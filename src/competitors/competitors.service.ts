import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCompetitorDto, UpdateCompetitorDto } from './dto/competitor.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class CompetitorsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createCompetitor(userId: string, projectId: string, createCompetitorDto: CreateCompetitorDto) {
        // Verify project ownership
        const project = await this.databaseService.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Check if competitor already exists
        const existingCompetitor = await this.databaseService.competitor.findFirst({
            where: {
                projectId,
                domain: createCompetitorDto.domain
            },
        });

        if (existingCompetitor) {
            throw new ForbiddenException('Competitor with this domain already exists');
        }

        return this.databaseService.competitor.create({
            data: {
                projectId,
                domain: createCompetitorDto.domain,
                name: createCompetitorDto.name || createCompetitorDto.domain,
            },
        });
    }

    async getProjectCompetitors(userId: string, projectId: string, paginationDto: PaginationDto) {
        // Verify project ownership
        const project = await this.databaseService.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const [competitors, total] = await Promise.all([
            this.databaseService.competitor.findMany({
                where: { projectId },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.databaseService.competitor.count({
                where: { projectId },
            }),
        ]);

        return {
            data: competitors,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getCompetitorById(userId: string, competitorId: string) {
        const competitor = await this.databaseService.competitor.findFirst({
            where: {
                id: competitorId,
                project: { ownerId: userId }
            },
            include: { project: true },
        });

        if (!competitor) {
            throw new NotFoundException('Competitor not found');
        }

        return competitor;
    }

    async updateCompetitor(userId: string, competitorId: string, updateCompetitorDto: UpdateCompetitorDto) {
        const competitor = await this.databaseService.competitor.findFirst({
            where: {
                id: competitorId,
                project: { ownerId: userId }
            },
        });

        if (!competitor) {
            throw new NotFoundException('Competitor not found');
        }

        return this.databaseService.competitor.update({
            where: { id: competitorId },
            data: updateCompetitorDto,
        });
    }

    async deleteCompetitor(userId: string, competitorId: string) {
        const competitor = await this.databaseService.competitor.findFirst({
            where: {
                id: competitorId,
                project: { ownerId: userId }
            },
        });

        if (!competitor) {
            throw new NotFoundException('Competitor not found');
        }

        await this.databaseService.competitor.delete({
            where: { id: competitorId },
        });

        return { message: 'Competitor deleted successfully' };
    }
}
