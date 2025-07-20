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

        // Get ranking distribution
        const keywordRankings = await this.databaseService.keyword.findMany({
            where: { projectId, isTracking: true },
            select: { currentRanking: true },
        });

        const rankingDistribution = {
            top3: keywordRankings.filter(k => k.currentRanking > 0 && k.currentRanking <= 3).length,
            top10: keywordRankings.filter(k => k.currentRanking > 3 && k.currentRanking <= 10).length,
            top50: keywordRankings.filter(k => k.currentRanking > 10 && k.currentRanking <= 50).length,
            beyond50: keywordRankings.filter(k => k.currentRanking > 50).length,
            notRanked: keywordRankings.filter(k => k.currentRanking === 0).length,
        };

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

        return {
            totalKeywords: keywordRankings.length,
            rankingDistribution,
            recentChanges: recentRankings.length,
            lastUpdate: recentRankings[0]?.date || null,
        };
    }
}
