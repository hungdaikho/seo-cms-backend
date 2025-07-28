import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateAuditDto } from './dto/audit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuditProcessingService, AuditConfig } from './audit-processing.service';

@Injectable()
export class AuditsService {
    private readonly logger = new Logger(AuditsService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly auditProcessingService: AuditProcessingService,
    ) { }

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

        // Prepare audit configuration
        const auditConfig: AuditConfig = {
            include_mobile: createAuditDto.include_mobile || false,
            check_accessibility: createAuditDto.check_accessibility || false,
            analyze_performance: createAuditDto.analyze_performance || false,
            check_seo: createAuditDto.check_seo || true,
            check_content: createAuditDto.check_content || true,
            check_technical: createAuditDto.check_technical || true,
            validate_html: createAuditDto.validate_html || false,
            check_links: createAuditDto.check_links || true,
            check_images: createAuditDto.check_images || true,
            check_meta: createAuditDto.check_meta || true,
            audit_type: createAuditDto.audit_type || 'full',
            pages: createAuditDto.pages || [],
            max_depth: createAuditDto.max_depth || 3,
            custom_settings: createAuditDto.settings || {},
        };

        const audit = await this.databaseService.audit.create({
            data: {
                projectId,
                status: 'pending',
                results: {
                    config: auditConfig,
                    started_at: new Date().toISOString(),
                    progress: 0,
                },
            },
        });

        // Update usage
        await this.updateAuditUsage(userId);

        // Queue audit job for background processing
        setTimeout(() => {
            this.logger.log(`Processing audit ${audit.id} with config:`, auditConfig);
            this.auditProcessingService.processAudit(audit.id, auditConfig);
        }, 1000); // Start processing after 1 second

        return {
            ...audit,
            message: 'Audit queued for processing',
            estimated_duration: this.estimateAuditDuration(auditConfig),
        };
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

    async getAuditHistory(userId: string, projectId: string, paginationDto: PaginationDto) {
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
                select: {
                    id: true,
                    status: true,
                    createdAt: true,
                    completedAt: true,
                    results: true,
                },
            }),
            this.databaseService.audit.count({
                where: { projectId },
            }),
        ]);

        return {
            data: audits.map(audit => ({
                id: audit.id,
                status: audit.status,
                created_at: audit.createdAt,
                completed_at: audit.completedAt,
                summary: audit.results ? {
                    score: (audit.results as any)?.overall_score || null,
                    issues_found: (audit.results as any)?.issues_count || 0,
                    pages_audited: (audit.results as any)?.pages_audited || 0,
                } : null,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
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

    private estimateAuditDuration(auditConfig: any): string {
        let baseDuration = 30; // Base 30 seconds

        // Add time based on audit type
        if (auditConfig.include_mobile) baseDuration += 15;
        if (auditConfig.check_accessibility) baseDuration += 20;
        if (auditConfig.analyze_performance) baseDuration += 25;
        if (auditConfig.check_technical) baseDuration += 10;
        if (auditConfig.validate_html) baseDuration += 10;
        if (auditConfig.check_links) baseDuration += 15;
        if (auditConfig.check_images) baseDuration += 10;

        // Add time based on pages count
        const pageCount = auditConfig.pages?.length || 1;
        baseDuration += pageCount * 5;

        // Add time based on max depth
        const maxDepth = auditConfig.max_depth || 1;
        baseDuration += maxDepth * 10;

        const minutes = Math.ceil(baseDuration / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
}
