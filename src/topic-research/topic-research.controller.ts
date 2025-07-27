import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    Param,
    UseGuards,
    ValidationPipe,
    BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { TopicResearchService } from './topic-research.service';
import {
    TopicResearchDto,
    RelatedTopicsDto,
    TopicQuestionsDto
} from './dto/topic-research.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Topic Research')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/seo/topic-research')
export class TopicResearchController {
    constructor(private readonly topicResearchService: TopicResearchService) { }

    @Post('ideas')
    @ApiOperation({ summary: 'Generate topic ideas based on seed keyword' })
    @ApiResponse({ status: 201, description: 'Topic ideas generated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid parameters' })
    @ApiBody({ type: TopicResearchDto })
    async generateTopicIdeas(
        @Body(ValidationPipe) dto: TopicResearchDto
    ) {
        if (!dto.seedKeyword?.trim()) {
            throw new BadRequestException('Seed keyword is required');
        }

        if (!dto.country?.trim()) {
            throw new BadRequestException('Country is required');
        }

        return this.topicResearchService.generateTopicIdeas(dto);
    }

    @Get('related/:topic')
    @ApiOperation({ summary: 'Get related topics for a given topic' })
    @ApiResponse({ status: 200, description: 'Related topics retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid topic parameter' })
    @ApiQuery({ name: 'limit', description: 'Number of related topics to return', required: false, example: 30 })
    @ApiQuery({ name: 'country', description: 'Country code', required: false, example: 'US' })
    async getRelatedTopics(
        @Param('topic') topic: string,
        @Query('limit') limit?: number,
        @Query('country') country?: string
    ) {
        if (!topic?.trim()) {
            throw new BadRequestException('Topic parameter is required');
        }

        const dto: RelatedTopicsDto = {
            topic: decodeURIComponent(topic),
            limit,
            country
        };

        return this.topicResearchService.getRelatedTopics(dto);
    }

    @Get('questions/:topic')
    @ApiOperation({ summary: 'Get questions related to a topic for content creation' })
    @ApiResponse({ status: 200, description: 'Topic questions retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid topic parameter' })
    @ApiQuery({ name: 'limit', description: 'Number of questions to return', required: false, example: 50 })
    @ApiQuery({ name: 'country', description: 'Country code', required: false, example: 'US' })
    async getTopicQuestions(
        @Param('topic') topic: string,
        @Query('limit') limit?: number,
        @Query('country') country?: string
    ) {
        if (!topic?.trim()) {
            throw new BadRequestException('Topic parameter is required');
        }

        const dto: TopicQuestionsDto = {
            topic: decodeURIComponent(topic),
            limit,
            country
        };

        return this.topicResearchService.getTopicQuestions(dto);
    }

    @Post('batch-analysis')
    @ApiOperation({ summary: 'Analyze multiple topics at once for content planning' })
    @ApiResponse({ status: 201, description: 'Batch analysis completed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid parameters' })
    async batchTopicAnalysis(
        @Body() body: { topics: string[]; country: string; includeQuestions?: boolean }
    ) {
        if (!body.topics || !Array.isArray(body.topics) || body.topics.length === 0) {
            throw new BadRequestException('Topics array is required and cannot be empty');
        }

        if (!body.country?.trim()) {
            throw new BadRequestException('Country is required');
        }

        if (body.topics.length > 10) {
            throw new BadRequestException('Maximum 10 topics allowed per batch request');
        }

        const results: any[] = [];

        for (const topic of body.topics) {
            const relatedTopics = await this.topicResearchService.getRelatedTopics({
                topic,
                country: body.country,
                limit: 10
            });

            const result: any = {
                topic,
                relatedTopics: relatedTopics.relatedTopics,
                clusters: relatedTopics.clusters
            };

            if (body.includeQuestions) {
                const questions = await this.topicResearchService.getTopicQuestions({
                    topic,
                    country: body.country,
                    limit: 20
                });
                result.topQuestions = questions.questions.slice(0, 10);
            }

            results.push(result);
        }

        return {
            batchResults: results,
            totalTopics: body.topics.length,
            country: body.country,
            timestamp: new Date().toISOString()
        };
    }

    @Get('trending-topics')
    @ApiOperation({ summary: 'Get currently trending topics for content opportunities' })
    @ApiResponse({ status: 200, description: 'Trending topics retrieved successfully' })
    @ApiQuery({ name: 'category', description: 'Topic category', required: false, example: 'technology' })
    @ApiQuery({ name: 'country', description: 'Country code', required: false, example: 'US' })
    @ApiQuery({ name: 'limit', description: 'Number of trending topics', required: false, example: 20 })
    async getTrendingTopics(
        @Query('category') category?: string,
        @Query('country') country?: string,
        @Query('limit') limit?: number
    ) {
        // Mock trending topics - in real implementation, this would integrate with Google Trends API
        const trendingTopics = [
            { topic: 'AI and Machine Learning', volume: 15000, growth: 45 },
            { topic: 'Sustainable Business Practices', volume: 8500, growth: 38 },
            { topic: 'Remote Work Technology', volume: 12000, growth: 25 },
            { topic: 'Digital Privacy', volume: 9500, growth: 55 },
            { topic: 'E-commerce Optimization', volume: 11000, growth: 30 },
            { topic: 'Voice Search SEO', volume: 6500, growth: 42 },
            { topic: 'Video Marketing', volume: 13500, growth: 28 },
            { topic: 'Mobile-First Design', volume: 7800, growth: 35 }
        ];

        const filteredTopics = trendingTopics
            .filter(topic => !category || topic.topic.toLowerCase().includes(category.toLowerCase()))
            .slice(0, limit || 20);

        return {
            trendingTopics: filteredTopics,
            category: category || 'all',
            country: country || 'global',
            lastUpdated: new Date().toISOString()
        };
    }
}
