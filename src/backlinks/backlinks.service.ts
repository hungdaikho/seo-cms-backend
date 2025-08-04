import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBacklinkDto, UpdateBacklinkDto, BacklinkAnalyticsQuery } from './dto/backlink.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class BacklinksService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createBacklink(userId: string, projectId: string, createBacklinkDto: CreateBacklinkDto) {
        // Verify project ownership
        const project = await this.databaseService.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Check if backlink already exists
        const existingBacklink = await this.databaseService.backlink.findFirst({
            where: {
                projectId,
                sourceDomain: createBacklinkDto.sourceDomain,
                targetUrl: createBacklinkDto.targetUrl,
            },
        });

        if (existingBacklink) {
            throw new ConflictException('Backlink from this source to target already exists');
        }

        return this.databaseService.backlink.create({
            data: {
                projectId,
                sourceDomain: createBacklinkDto.sourceDomain,
                targetUrl: createBacklinkDto.targetUrl,
                anchorText: createBacklinkDto.anchorText,
                linkType: createBacklinkDto.linkType,
                authorityScore: createBacklinkDto.authorityScore,
            },
        });
    }

    async getProjectBacklinks(userId: string, projectId: string, paginationDto: PaginationDto) {
        // Verify project ownership
        const project = await this.databaseService.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const { page = 1, limit = 20 } = paginationDto;
        const skip = (page - 1) * limit;

        const [backlinks, total] = await Promise.all([
            this.databaseService.backlink.findMany({
                where: { projectId },
                skip,
                take: limit,
                orderBy: { discoveredAt: 'desc' },
            }),
            this.databaseService.backlink.count({
                where: { projectId },
            }),
        ]);

        return {
            data: backlinks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getBacklinkById(userId: string, backlinkId: string) {
        const backlink = await this.databaseService.backlink.findFirst({
            where: {
                id: backlinkId,
                project: { ownerId: userId },
            },
            include: { project: true },
        });

        if (!backlink) {
            throw new NotFoundException('Backlink not found');
        }

        return backlink;
    }

    async updateBacklink(userId: string, backlinkId: string, updateBacklinkDto: UpdateBacklinkDto) {
        const backlink = await this.databaseService.backlink.findFirst({
            where: {
                id: backlinkId,
                project: { ownerId: userId },
            },
        });

        if (!backlink) {
            throw new NotFoundException('Backlink not found');
        }

        return this.databaseService.backlink.update({
            where: { id: backlinkId },
            data: updateBacklinkDto,
        });
    }

    async deleteBacklink(userId: string, backlinkId: string) {
        const backlink = await this.databaseService.backlink.findFirst({
            where: {
                id: backlinkId,
                project: { ownerId: userId },
            },
        });

        if (!backlink) {
            throw new NotFoundException('Backlink not found');
        }

        await this.databaseService.backlink.delete({
            where: { id: backlinkId },
        });

        return { message: 'Backlink deleted successfully' };
    }

    async getBacklinkAnalytics(userId: string, projectId: string, query: BacklinkAnalyticsQuery) {
        // Verify project ownership
        const project = await this.databaseService.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Calculate date range - default to 360 days for comprehensive analysis
        const endDate = query.endDate ? new Date(query.endDate) : new Date();
        const startDate = query.startDate
            ? new Date(query.startDate)
            : new Date(Date.now() - (query.days || 360) * 24 * 60 * 60 * 1000);

        // Get all backlinks for the project
        const allBacklinks = await this.databaseService.backlink.findMany({
            where: { projectId },
        });

        // Get new backlinks in the date range
        const newBacklinks = await this.databaseService.backlink.findMany({
            where: {
                projectId,
                discoveredAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { discoveredAt: 'desc' },
        });

        // Calculate analytics
        const totalBacklinks = allBacklinks.length;
        const totalDomains = new Set(allBacklinks.map(b => b.sourceDomain)).size;
        const followLinks = allBacklinks.filter(b => b.linkType === 'follow').length;
        const nofollowLinks = allBacklinks.filter(b => b.linkType === 'nofollow').length;
        const activeLinks = allBacklinks.filter(b => b.isActive).length;

        const authorityScores = allBacklinks
            .filter(b => b.authorityScore !== null)
            .map(b => b.authorityScore!);
        const averageAuthorityScore = authorityScores.length > 0
            ? Math.round(authorityScores.reduce((sum, score) => sum + score, 0) / authorityScores.length * 10) / 10
            : null;

        // Top referring domains
        const domainCount = allBacklinks.reduce((acc, backlink) => {
            acc[backlink.sourceDomain] = (acc[backlink.sourceDomain] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topDomains = Object.entries(domainCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([domain, count]) => ({ domain, count }));

        // Target URL distribution
        const urlCount = allBacklinks.reduce((acc, backlink) => {
            acc[backlink.targetUrl] = (acc[backlink.targetUrl] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topTargetUrls = Object.entries(urlCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([url, count]) => ({ url, count }));

        return {
            summary: {
                totalBacklinks,
                totalDomains,
                activeLinks,
                followLinks,
                nofollowLinks,
                averageAuthorityScore,
                newBacklinksCount: newBacklinks.length,
            },
            newBacklinks,
            topDomains,
            topTargetUrls,
            linkTypeDistribution: {
                follow: followLinks,
                nofollow: nofollowLinks,
                unknown: totalBacklinks - followLinks - nofollowLinks,
            },
            authorityDistribution: this.getAuthorityDistribution(authorityScores),
        };
    }

    private getAuthorityDistribution(scores: number[]) {
        if (scores.length === 0) return null;

        const ranges = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0,
        };

        scores.forEach(score => {
            if (score <= 20) ranges['0-20']++;
            else if (score <= 40) ranges['21-40']++;
            else if (score <= 60) ranges['41-60']++;
            else if (score <= 80) ranges['61-80']++;
            else ranges['81-100']++;
        });

        return ranges;
    }
}
