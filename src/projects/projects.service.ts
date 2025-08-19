import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProjectDto, UpdateProjectDto, SearchSharedProjectsDto, ApplyToProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { KeywordsService } from '../keywords/keywords.service';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly keywordsService: KeywordsService
    ) { }

    // Helper method to generate unique share code
    private async generateShareCode(): Promise<string> {
        let shareCode: string;
        let isUnique = false;

        while (!isUnique) {
            // Generate a random 12-character alphanumeric string
            shareCode = Math.random().toString(36).substring(2, 14).toUpperCase();

            // Check if it's unique
            const existing = await this.databaseService.project.findUnique({
                where: { shareCode }
            });

            if (!existing) {
                isUnique = true;
            }
        }

        return shareCode!;
    }

    // Helper method to check if user has access to project (owner or member)
    private async checkProjectAccess(userId: string, projectId: string): Promise<boolean> {
        const project = await this.databaseService.project.findFirst({
            where: {
                id: projectId,
                isActive: true,
                OR: [
                    { ownerId: userId }, // User is owner
                    {
                        members: {
                            some: {
                                userId,
                                status: 'active'
                            }
                        }
                    } // User is member
                ]
            },
        });

        return !!project;
    }

    // Helper method to check if user is owner of project
    private async checkProjectOwnership(userId: string, projectId: string): Promise<boolean> {
        const project = await this.databaseService.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
                isActive: true,
            },
        });

        return !!project;
    }

    async createProject(userId: string, createProjectDto: CreateProjectDto) {
        const { name, domain, description, settings } = createProjectDto;

        // Check user's project limit
        const userSubscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trial'] },
            },
            include: { plan: true },
        });

        if (userSubscription?.plan.limits) {
            const limits = userSubscription.plan.limits as any;
            const projectLimit = limits.projects || 1;

            const currentProjectCount = await this.databaseService.project.count({
                where: { ownerId: userId, isActive: true },
            });

            if (currentProjectCount >= projectLimit) {
                throw new ForbiddenException(`Project limit reached. Upgrade your plan to create more projects.`);
            }
        }

        // Extract keywords from settings before creating project
        const { keyWordsArray, ...projectSettings } = settings;

        const project = await this.databaseService.project.create({
            data: {
                name,
                domain,
                description,
                ownerId: userId,
                settings: projectSettings as any, // Convert to JSON
            },
            include: {
                _count: {
                    select: {
                        keywords: true,
                        competitors: true,
                        audits: true,
                    },
                },
            },
        });

        // Create keywords if provided
        if (keyWordsArray && keyWordsArray.length > 0) {
            try {
                console.log(`🔍 Creating ${keyWordsArray.length} keywords for project: ${project.name}`);

                const keywordDtos = keyWordsArray.map(keyword => ({
                    keyword: keyword.trim(),
                    targetUrl: `https://${domain}`, // Use project domain as default target URL
                }));

                await this.keywordsService.bulkCreateKeywords(userId, project.id, {
                    keywords: keywordDtos
                });

                console.log(`✅ Successfully created ${keyWordsArray.length} keywords for project: ${project.name}`);
            } catch (error) {
                console.error(`❌ Failed to create keywords for project ${project.name}:`, error.message);
                // Don't throw error, project is already created
                // Could optionally return warning in response
            }
        }

        return project;
    }

    async getUserProjects(userId: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
        const skip = (page - 1) * limit;

        // Build WHERE clause for owned projects
        const ownedWhere: any = {
            ownerId: userId,
            isActive: true,
        };

        if (search) {
            ownedWhere.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Build WHERE clause for applied projects
        const appliedWhere: any = {
            isActive: true,
            members: {
                some: {
                    userId,
                    status: 'active'
                }
            }
        };

        if (search) {
            appliedWhere.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Get projects with proper pagination
        const [ownedProjects, appliedProjects, ownedTotal, appliedTotal] = await Promise.all([
            this.databaseService.project.findMany({
                where: ownedWhere,
                include: {
                    _count: {
                        select: {
                            keywords: true,
                            competitors: true,
                            audits: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
            }),
            this.databaseService.project.findMany({
                where: appliedWhere,
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    _count: {
                        select: {
                            keywords: true,
                            competitors: true,
                            audits: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
            }),
            this.databaseService.project.count({ where: ownedWhere }),
            this.databaseService.project.count({ where: appliedWhere }),
        ]);

        // For backward compatibility: if no applied projects exist, return only owned projects with original format
        if (appliedTotal === 0) {
            const paginatedOwnedProjects = ownedProjects.slice(skip, skip + limit);

            return {
                data: paginatedOwnedProjects,
                total: ownedTotal,
                page,
                limit,
                totalPages: Math.ceil(ownedTotal / limit),
            };
        }

        // New format: combine owned and applied projects
        const projectsWithType = [
            ...ownedProjects.map(p => ({ ...p, relationshipType: 'owner' })),
            ...appliedProjects.map(p => ({ ...p, relationshipType: 'member' })),
        ];

        // Sort combined results
        projectsWithType.sort((a, b) => {
            const aDate = new Date(a[sortBy] as string).getTime();
            const bDate = new Date(b[sortBy] as string).getTime();

            if (sortOrder === 'desc') {
                return bDate - aDate;
            } else {
                return aDate - bDate;
            }
        });

        // Apply pagination to combined results
        const paginatedProjects = projectsWithType.slice(skip, skip + limit);
        const totalProjects = ownedTotal + appliedTotal;

        return {
            data: paginatedProjects,
            total: totalProjects,
            ownedCount: ownedTotal,
            appliedCount: appliedTotal,
            page,
            limit,
            totalPages: Math.ceil(totalProjects / limit),
        };
    }

    async getOwnedProjects(userId: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
        const skip = (page - 1) * limit;

        const where: any = {
            ownerId: userId,
            isActive: true,
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [projects, total] = await Promise.all([
            this.databaseService.project.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            keywords: true,
                            competitors: true,
                            audits: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            this.databaseService.project.count({ where }),
        ]);

        return {
            data: projects,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getProjectById(userId: string, projectId: string) {
        const project = await this.databaseService.project.findFirst({
            where: {
                id: projectId,
                isActive: true,
                OR: [
                    { ownerId: userId }, // User is owner
                    {
                        members: {
                            some: {
                                userId,
                                status: 'active'
                            }
                        }
                    } // User is member
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                members: {
                    where: { status: 'active' },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                keywords: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
                competitors: {
                    where: { isActive: true },
                },
                audits: {
                    take: 3,
                    orderBy: { createdAt: 'desc' },
                },
                _count: {
                    select: {
                        keywords: true,
                        competitors: true,
                        audits: true,
                        backlinks: true,
                        members: true,
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Add user's relationship to the project
        const isOwner = project.ownerId === userId;
        const isMember = project.members.some(m => m.userId === userId);

        return {
            ...project,
            userRole: isOwner ? 'owner' : isMember ? 'member' : null,
        };
    }

    async updateProject(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
        // Check if user is owner of project
        const isOwner = await this.checkProjectOwnership(userId, projectId);
        if (!isOwner) {
            throw new NotFoundException('Project not found');
        }

        // Get project info for logging
        const project = await this.databaseService.project.findUnique({
            where: { id: projectId },
            select: { name: true, domain: true }
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Extract keywords from settings if provided
        const updateData: any = { ...updateProjectDto };
        if (updateData.settings) {
            const { keyWordsArray, ...projectSettings } = updateData.settings;
            updateData.settings = projectSettings;

            // Handle keywords update if provided
            if (keyWordsArray && keyWordsArray.length > 0) {
                try {
                    console.log(`🔍 Adding ${keyWordsArray.length} new keywords to project: ${project.name}`);

                    const keywordDtos = keyWordsArray.map(keyword => ({
                        keyword: keyword.trim(),
                        targetUrl: `https://${updateData.domain || project.domain}`,
                    }));

                    await this.keywordsService.bulkCreateKeywords(userId, projectId, {
                        keywords: keywordDtos
                    });

                    console.log(`✅ Successfully added ${keyWordsArray.length} keywords to project: ${project.name}`);
                } catch (error) {
                    console.error(`❌ Failed to add keywords to project ${project.name}:`, error.message);
                    // Don't throw error, project update should still proceed
                }
            }
        }

        return this.databaseService.project.update({
            where: { id: projectId },
            data: updateData,
        });
    }

    async deleteProject(userId: string, projectId: string) {
        // Check if user is owner of project
        const isOwner = await this.checkProjectOwnership(userId, projectId);
        if (!isOwner) {
            throw new NotFoundException('Project not found');
        }

        // Soft delete
        return this.databaseService.project.update({
            where: { id: projectId },
            data: { isActive: false },
        });
    }

    async getProjectStats(userId: string, projectId: string) {
        // Check if user has access to project
        const hasAccess = await this.checkProjectAccess(userId, projectId);
        if (!hasAccess) {
            throw new NotFoundException('Project not found');
        }

        // Get all keywords for project
        const keywords = await this.databaseService.keyword.findMany({
            where: { projectId, isTracking: true },
            select: { id: true, keyword: true, currentRanking: true },
        });

        // Average ranking
        const trackedKeywords = keywords.filter(k => k.currentRanking > 0);
        const averageRanking = trackedKeywords.length > 0
            ? trackedKeywords.reduce((sum, k) => sum + k.currentRanking, 0) / trackedKeywords.length
            : null;

        // Top keywords (top 5 ranking > 0, ascending)
        const topKeywords = [...trackedKeywords]
            .sort((a, b) => a.currentRanking - b.currentRanking)
            .slice(0, 5)
            .map(k => ({ id: k.id, keyword: k.keyword, currentRanking: k.currentRanking }));

        // Get ranking distribution
        const rankingDistribution = {
            top3: trackedKeywords.filter(k => k.currentRanking > 0 && k.currentRanking <= 3).length,
            top10: trackedKeywords.filter(k => k.currentRanking > 3 && k.currentRanking <= 10).length,
            top50: trackedKeywords.filter(k => k.currentRanking > 10 && k.currentRanking <= 50).length,
            beyond50: trackedKeywords.filter(k => k.currentRanking > 50).length,
            notRanked: keywords.filter(k => k.currentRanking === 0).length,
        };

        // Get ranking changes for each keyword (2 ngày gần nhất)
        const keywordIds = keywords.map(k => k.id);
        const rankingsByKeyword = await this.databaseService.ranking.findMany({
            where: {
                keywordId: { in: keywordIds },
            },
            orderBy: { date: 'desc' },
            take: keywordIds.length * 2, // lấy 2 bản ghi gần nhất cho mỗi keyword
        });

        // Map keywordId -> [ranking gần nhất, ranking trước đó]
        const rankingMap: Record<string, number[]> = {};
        for (const r of rankingsByKeyword) {
            if (!rankingMap[r.keywordId]) rankingMap[r.keywordId] = [];
            if (rankingMap[r.keywordId].length < 2) rankingMap[r.keywordId].push(r.position);
        }

        let improved = 0, declined = 0, stable = 0;
        for (const k of keywordIds) {
            const [latest, prev] = rankingMap[k] || [];
            if (latest != null && prev != null) {
                if (latest < prev) improved++;
                else if (latest > prev) declined++;
                else stable++;
            }
        }

        // Get recent ranking changes (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentRankings = await this.databaseService.ranking.findMany({
            where: {
                keyword: { projectId },
                date: { gte: sevenDaysAgo },
            },
            include: { keyword: true },
            orderBy: { date: 'desc' },
        });

        // Audit summary
        const audits = await this.databaseService.audit.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
        const totalAudits = audits.length;
        let sumScore = 0;
        let sumCritical = 0;
        for (const a of audits) {
            let score = null;
            let critical = null;
            if (a.results) {
                try {
                    const results = typeof a.results === 'string' ? JSON.parse(a.results) : a.results;
                    score = results?.overview?.score ?? null;
                    critical = results?.overview?.critical_issues ?? null;
                } catch (e) { /* ignore parse error */ }
            }
            sumScore += score || 0;
            sumCritical += critical || 0;
        }
        const averageScore = totalAudits > 0 ? (sumScore / totalAudits) : null;
        const criticalIssues = sumCritical;

        return {
            totalKeywords: keywords.length,
            averageRanking,
            rankingDistribution,
            improvedKeywords: improved,
            declinedKeywords: declined,
            stableKeywords: stable,
            topKeywords,
            recentChanges: recentRankings.length,
            lastUpdate: recentRankings[0]?.date || null,
            auditSummary: {
                totalAudits,
                averageScore,
                criticalIssues,
            },
        };
    }

    // =============================
    // PROJECT SHARING METHODS
    // =============================

    async searchSharedProjects(userId: string, searchDto: SearchSharedProjectsDto) {
        const { search, shareCode, page = 1, limit = 10 } = searchDto;

        // Ensure page and limit are numbers
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {
            isActive: true,
            isShared: true,
            ownerId: { not: userId }, // Exclude own projects
        };

        // If shareCode is provided, search for specific project
        if (shareCode) {
            where.shareCode = shareCode;
        }

        // If search term is provided, search in name, domain, or description
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [projects, total] = await Promise.all([
            this.databaseService.project.findMany({
                where,
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    _count: {
                        select: {
                            keywords: true,
                            competitors: true,
                            audits: true,
                            members: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            this.databaseService.project.count({ where }),
        ]);

        return {
            data: projects,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async applyToProject(userId: string, applyDto: ApplyToProjectDto) {
        const { shareCode } = applyDto;

        // Find the shared project
        const project = await this.databaseService.project.findUnique({
            where: {
                shareCode,
                isActive: true,
                isShared: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found or not available for sharing');
        }

        // Check if user is not the owner
        if (project.ownerId === userId) {
            throw new ConflictException('You cannot apply to your own project');
        }

        // Check if user has already applied
        const existingMembership = await this.databaseService.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId: project.id,
                    userId,
                }
            }
        });

        if (existingMembership) {
            throw new ConflictException('You have already applied to this project');
        }

        // Create membership
        const membership = await this.databaseService.projectMember.create({
            data: {
                projectId: project.id,
                userId,
                role: 'member',
                status: 'active',
                appliedAt: new Date(),
                approvedAt: new Date(), // Auto-approve for now
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        domain: true,
                        description: true,
                    }
                }
            }
        });

        return {
            message: 'Successfully applied to project',
            membership,
        };
    }

    async getAppliedProjects(userId: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10, search, sortBy = 'appliedAt', sortOrder = 'desc' } = paginationDto;

        // Ensure page and limit are numbers
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const where: any = {
            userId,
            status: 'active',
            project: {
                isActive: true,
            }
        };

        if (search) {
            where.project.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [memberships, total] = await Promise.all([
            this.databaseService.projectMember.findMany({
                where,
                include: {
                    project: {
                        include: {
                            owner: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                }
                            },
                            _count: {
                                select: {
                                    keywords: true,
                                    competitors: true,
                                    audits: true,
                                    members: true,
                                },
                            },
                        }
                    }
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limitNum,
            }),
            this.databaseService.projectMember.count({ where }),
        ]);

        return {
            data: memberships,
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        };
    }

    async leaveProject(userId: string, projectId: string) {
        const membership = await this.databaseService.projectMember.findUnique({
            where: {
                projectId_userId: {
                    projectId,
                    userId,
                }
            }
        });

        if (!membership) {
            throw new NotFoundException('You are not a member of this project');
        }

        await this.databaseService.projectMember.delete({
            where: {
                id: membership.id,
            }
        });

        return {
            message: 'Successfully left the project',
        };
    }

    async toggleProjectSharing(userId: string, projectId: string, isShared: boolean) {
        const project = await this.databaseService.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
                isActive: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        let shareCode = project.shareCode;

        // Generate share code if enabling sharing and no code exists
        if (isShared && !shareCode) {
            shareCode = await this.generateShareCode();
        }

        const updatedProject = await this.databaseService.project.update({
            where: { id: projectId },
            data: {
                isShared,
                shareCode: isShared ? shareCode : project.shareCode, // Keep existing code even when disabled
            },
        });

        return {
            ...updatedProject,
            message: isShared ? 'Project sharing enabled' : 'Project sharing disabled',
        };
    }

    async getProjectMembers(userId: string, projectId: string) {
        // Verify user is owner of the project
        const project = await this.databaseService.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
                isActive: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const members = await this.databaseService.projectMember.findMany({
            where: {
                projectId,
                status: 'active',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: { appliedAt: 'desc' },
        });

        return {
            data: members,
            total: members.length,
        };
    }

    async removeProjectMember(userId: string, projectId: string, memberId: string) {
        // Verify user is owner of the project
        const project = await this.databaseService.project.findFirst({
            where: {
                id: projectId,
                ownerId: userId,
                isActive: true,
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Find the membership
        const membership = await this.databaseService.projectMember.findUnique({
            where: {
                id: memberId,
                projectId,
            },
        });

        if (!membership) {
            throw new NotFoundException('Member not found');
        }

        await this.databaseService.projectMember.delete({
            where: {
                id: memberId,
            }
        });

        return {
            message: 'Member removed successfully',
        };
    }
}
