import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAuditDto } from './dto/audit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AuditsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createAudit(userId: string, projectId: string, createAuditDto: CreateAuditDto) {
        // Verify project ownership
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

        // Check audit limit
        await this.checkAuditLimit(userId);

        const audit = await this.databaseService.audit.create({
            data: {
                projectId,
                status: 'pending',
            },
        });

        // Update usage
        await this.updateAuditUsage(userId);

        // TODO: Queue audit job for background processing

        return audit;
    }

    async getProjectAudits(userId: string, projectId: string, paginationDto: PaginationDto) {
        // Verify project ownership
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

        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
        const skip = (page - 1) * limit;

        const [audits, total] = await Promise.all([
            this.databaseService.audit.findMany({
                where: { projectId },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            this.databaseService.audit.count({
                where: { projectId },
            }),
        ]);

        return {
            data: audits,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getAuditById(userId: string, auditId: string) {
        const audit = await this.databaseService.audit.findUnique({
            where: { id: auditId },
            include: {
                project: true,
            },
        });

        if (!audit) {
            throw new NotFoundException('Audit not found');
        }

        // Verify project ownership
        if (audit.project.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this audit');
        }

        return audit;
    }

    async getAuditResults(userId: string, auditId: string) {
        const audit = await this.getAuditById(userId, auditId);

        if (audit.status !== 'completed') {
            throw new BadRequestException('Audit is not completed yet');
        }

        return {
            id: audit.id,
            status: audit.status,
            results: audit.results,
            createdAt: audit.createdAt,
            completedAt: audit.completedAt,
        };
    }

    async deleteAudit(userId: string, auditId: string) {
        const audit = await this.databaseService.audit.findUnique({
            where: { id: auditId },
            include: { project: true },
        });

        if (!audit) {
            throw new NotFoundException('Audit not found');
        }

        // Verify project ownership
        if (audit.project.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this audit');
        }

        if (audit.status === 'running') {
            throw new BadRequestException('Cannot delete a running audit');
        }

        await this.databaseService.audit.delete({
            where: { id: auditId },
        });

        return { message: 'Audit deleted successfully' };
    }

    async getAuditSummary(userId: string, projectId: string) {
        // Verify project ownership
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

        // Get latest completed audit
        const latestAudit = await this.databaseService.audit.findFirst({
            where: {
                projectId,
                status: 'completed',
            },
            orderBy: { completedAt: 'desc' },
        });

        // Get audit count by status
        const auditStats = await this.databaseService.audit.groupBy({
            by: ['status'],
            where: { projectId },
            _count: {
                status: true,
            },
        });

        return {
            latestAudit,
            stats: auditStats.reduce((acc, stat) => {
                acc[stat.status] = stat._count.status;
                return acc;
            }, {} as Record<string, number>),
        };
    }

    private async checkAuditLimit(userId: string) {
        const userSubscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trial'] },
            },
            include: { plan: true },
        });

        if (userSubscription?.plan.limits) {
            const limits = userSubscription.plan.limits as any;
            const auditLimit = limits.audits_monthly || 1;

            // Count audits this month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const currentUsage = await this.databaseService.audit.count({
                where: {
                    project: { ownerId: userId },
                    createdAt: { gte: startOfMonth },
                },
            });

            if (currentUsage >= auditLimit) {
                throw new ForbiddenException(`Monthly audit limit reached. Upgrade your plan to run more audits.`);
            }
        }
    }

    private async updateAuditUsage(userId: string) {
        const subscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trial'] },
            },
        });

        if (subscription) {
            await this.databaseService.subscriptionUsage.updateMany({
                where: {
                    userId,
                    subscriptionId: subscription.id,
                    usageType: 'audits_monthly',
                },
                data: {
                    currentUsage: {
                        increment: 1,
                    },
                },
            });
        }
    }
}
