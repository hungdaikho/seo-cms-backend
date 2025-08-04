import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateKeywordDto, UpdateKeywordDto, BulkCreateKeywordsDto } from './dto/keyword.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { KeywordDifficultyService } from '../keyword-difficulty/keyword-difficulty.service';

@Injectable()
export class KeywordsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly keywordDifficultyService: KeywordDifficultyService
    ) { }

    async createKeyword(userId: string, projectId: string, createKeywordDto: CreateKeywordDto) {
        // Verify project ownership
        await this.verifyProjectOwnership(userId, projectId);

        // Check keyword limit
        await this.checkKeywordLimit(userId);

        // Calculate difficulty if not provided
        let difficulty = createKeywordDto.difficulty;
        if (!difficulty) {
            try {
                const difficultyResult = await this.keywordDifficultyService.calculateDifficulty(createKeywordDto.keyword);
                difficulty = difficultyResult.difficulty;
                console.log(`✅ Calculated difficulty for "${createKeywordDto.keyword}": ${difficulty} (confidence: ${difficultyResult.confidence}%)`);
            } catch (error) {
                console.warn(`⚠️ Failed to calculate difficulty for "${createKeywordDto.keyword}": ${error.message}`);
                // Use estimated difficulty as fallback
                difficulty = this.estimateBasicDifficulty(createKeywordDto.keyword);
                console.log(`📊 Using estimated difficulty for "${createKeywordDto.keyword}": ${difficulty}`);
            }
        }

        const keyword = await this.databaseService.keyword.create({
            data: {
                ...createKeywordDto,
                difficulty,
                projectId,
            },
        });

        // Update usage
        await this.updateKeywordUsage(userId);

        return keyword;
    }

    async bulkCreateKeywords(userId: string, projectId: string, bulkCreateDto: BulkCreateKeywordsDto) {
        // Verify project ownership
        await this.verifyProjectOwnership(userId, projectId);

        // Check keyword limit
        const currentUsage = await this.getCurrentKeywordUsage(userId);
        const newKeywordCount = bulkCreateDto.keywords.length;

        const userSubscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trial'] },
            },
            include: { plan: true },
        });

        if (userSubscription?.plan.limits) {
            const limits = userSubscription.plan.limits as any;
            const keywordLimit = limits.keywords_tracking || 25;

            if (currentUsage + newKeywordCount > keywordLimit) {
                throw new ForbiddenException(`Keyword limit exceeded. You can add ${keywordLimit - currentUsage} more keywords.`);
            }
        }

        // Calculate difficulty for keywords that don't have it
        console.log(`📊 Calculating difficulty for ${bulkCreateDto.keywords.length} keywords...`);
        const keywordsWithDifficulty = await Promise.all(
            bulkCreateDto.keywords.map(async (keyword) => {
                let difficulty = keyword.difficulty;

                if (!difficulty) {
                    try {
                        const difficultyResult = await this.keywordDifficultyService.calculateDifficulty(keyword.keyword);
                        difficulty = difficultyResult.difficulty;
                        console.log(`✅ Calculated difficulty for "${keyword.keyword}": ${difficulty}`);
                    } catch (error) {
                        console.warn(`⚠️ Failed to calculate difficulty for "${keyword.keyword}": ${error.message}`);
                        difficulty = this.estimateBasicDifficulty(keyword.keyword);
                        console.log(`📊 Using estimated difficulty for "${keyword.keyword}": ${difficulty}`);
                    }
                }

                return {
                    ...keyword,
                    difficulty,
                    projectId,
                };
            })
        );

        // Create keywords in batch
        const keywords = await this.databaseService.keyword.createMany({
            data: keywordsWithDifficulty,
        });

        // Update usage
        await this.updateKeywordUsage(userId, newKeywordCount);

        return keywords;
    }

    async getProjectKeywords(userId: string, projectId: string, paginationDto: PaginationDto) {
        // Verify project ownership
        await this.verifyProjectOwnership(userId, projectId);

        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = paginationDto;
        const skip = (page - 1) * limit;

        const where: any = { projectId };

        if (search) {
            where.keyword = { contains: search, mode: 'insensitive' };
        }

        const [keywords, total] = await Promise.all([
            this.databaseService.keyword.findMany({
                where,
                include: {
                    rankings: {
                        orderBy: { date: 'desc' },
                        take: 1,
                    },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: limit,
            }),
            this.databaseService.keyword.count({ where }),
        ]);

        return {
            data: keywords.map(keyword => ({
                ...keyword,
                latestRanking: keyword.rankings[0] || null,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateKeyword(userId: string, keywordId: string, updateKeywordDto: UpdateKeywordDto) {
        const keyword = await this.databaseService.keyword.findUnique({
            where: { id: keywordId },
            include: { project: true },
        });

        if (!keyword) {
            throw new NotFoundException('Keyword not found');
        }

        // Verify project ownership
        if (keyword.project.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this keyword');
        }

        return this.databaseService.keyword.update({
            where: { id: keywordId },
            data: updateKeywordDto,
        });
    }

    async deleteKeyword(userId: string, keywordId: string) {
        const keyword = await this.databaseService.keyword.findUnique({
            where: { id: keywordId },
            include: { project: true },
        });

        if (!keyword) {
            throw new NotFoundException('Keyword not found');
        }

        // Verify project ownership
        if (keyword.project.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this keyword');
        }

        await this.databaseService.keyword.delete({
            where: { id: keywordId },
        });

        // Update usage
        await this.updateKeywordUsage(userId, -1);

        return { message: 'Keyword deleted successfully' };
    }

    async getKeywordRankings(userId: string, keywordId: string, days = 30) {
        const keyword = await this.databaseService.keyword.findUnique({
            where: { id: keywordId },
            include: { project: true },
        });

        if (!keyword) {
            throw new NotFoundException('Keyword not found');
        }

        // Verify project ownership
        if (keyword.project.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this keyword');
        }

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const rankings = await this.databaseService.ranking.findMany({
            where: {
                keywordId,
                date: { gte: startDate },
            },
            orderBy: { date: 'asc' },
        });

        return rankings;
    }

    private async verifyProjectOwnership(userId: string, projectId: string) {
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

        return project;
    }

    private async checkKeywordLimit(userId: string) {
        const currentUsage = await this.getCurrentKeywordUsage(userId);

        const userSubscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trial'] },
            },
            include: { plan: true },
        });

        if (userSubscription?.plan.limits) {
            const limits = userSubscription.plan.limits as any;
            const keywordLimit = limits.keywords_tracking || 25;

            if (currentUsage >= keywordLimit) {
                throw new ForbiddenException(`Keyword limit reached. Upgrade your plan to track more keywords.`);
            }
        }
    }

    private async getCurrentKeywordUsage(userId: string): Promise<number> {
        return this.databaseService.keyword.count({
            where: {
                project: { ownerId: userId },
                isTracking: true,
            },
        });
    }

    private async updateKeywordUsage(userId: string, increment = 1) {
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
                    usageType: 'keywords_tracking',
                },
                data: {
                    currentUsage: {
                        increment,
                    },
                },
            });
        }
    }

    /**
     * Estimate basic difficulty when calculation service fails
     */
    private estimateBasicDifficulty(keyword: string): number {
        // Fallback estimation logic
        let difficulty = 50; // Base difficulty

        const words = keyword.split(' ');
        if (words.length === 1) difficulty += 20; // Single words harder
        else if (words.length >= 4) difficulty -= 15; // Long-tail easier

        // Commercial intent indicators
        const commercialWords = ['buy', 'price', 'best', 'top', 'review'];
        if (commercialWords.some(word => keyword.toLowerCase().includes(word))) {
            difficulty += 15;
        }

        // Informational intent indicators  
        const informationalWords = ['what', 'how', 'tutorial', 'guide'];
        if (informationalWords.some(word => keyword.toLowerCase().includes(word))) {
            difficulty -= 10;
        }

        return Math.min(100, Math.max(10, difficulty));
    }
}
