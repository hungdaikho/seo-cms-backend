import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createProject(userId: string, createProjectDto: CreateProjectDto) {
        const { name, domain, settings } = createProjectDto;

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

        const project = await this.databaseService.project.create({
            data: {
                name,
                domain,
                ownerId: userId,
                settings,
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

        return project;
    }

    async getUserProjects(userId: string, paginationDto: PaginationDto) {
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
                ownerId: userId,
                isActive: true,
            },
            include: {
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
                    },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async updateProject(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
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

        return this.databaseService.project.update({
            where: { id: projectId },
            data: updateProjectDto,
        });
    }

    async deleteProject(userId: string, projectId: string) {
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

        // Soft delete
        return this.databaseService.project.update({
            where: { id: projectId },
            data: { isActive: false },
        });
    }

    async getProjectStats(userId: string, projectId: string) {
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
}
