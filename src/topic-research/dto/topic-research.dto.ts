import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

export class TopicResearchDto {
    @ApiProperty({ description: 'Seed keyword for topic research', example: 'digital marketing' })
    @IsString()
    seedKeyword: string;

    @ApiProperty({ description: 'Country code', example: 'US' })
    @IsString()
    country: string;

    @ApiPropertyOptional({ description: 'Industry category', example: 'technology' })
    @IsString()
    @IsOptional()
    industry?: string;

    @ApiPropertyOptional({
        description: 'Content type focus',
        enum: ['blog', 'product', 'service'],
        example: 'blog'
    })
    @IsEnum(['blog', 'product', 'service'])
    @IsOptional()
    contentType?: 'blog' | 'product' | 'service';

    @ApiPropertyOptional({ description: 'Number of topic ideas to return', example: 50 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(200)
    limit?: number = 50;
}

export class RelatedTopicsDto {
    @ApiProperty({ description: 'Topic to find related topics for', example: 'seo optimization' })
    @IsString()
    topic: string;

    @ApiPropertyOptional({ description: 'Number of related topics to return', example: 30 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(100)
    limit?: number = 30;

    @ApiPropertyOptional({ description: 'Country code', example: 'US' })
    @IsString()
    @IsOptional()
    country?: string = 'US';
}

export class TopicQuestionsDto {
    @ApiProperty({ description: 'Topic to find questions for', example: 'content marketing' })
    @IsString()
    topic: string;

    @ApiPropertyOptional({ description: 'Number of questions to return', example: 50 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(200)
    limit?: number = 50;

    @ApiPropertyOptional({ description: 'Country code', example: 'US' })
    @IsString()
    @IsOptional()
    country?: string = 'US';
}

// Response interfaces
export interface TopicIdea {
    topic: string;
    volume: number;
    difficulty: number;
    opportunity: number;
    questions: number;
    relatedKeywords: string[];
    contentGap: number;
    seasonality: 'high' | 'medium' | 'low';
    competitiveness: number;
}

export interface RelatedTopic {
    topic: string;
    relevance: number;
    volume: number;
    difficulty: number;
    trending: boolean;
    topKeywords: string[];
    contentOpportunities: number;
}

export interface TopicQuestion {
    question: string;
    volume: number;
    difficulty: number;
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
    relatedKeywords: string[];
    competitiveness: number;
    answerLength: 'short' | 'medium' | 'long';
}

export interface TopicResearchResponse {
    seedKeyword: string;
    country: string;
    industry?: string;
    contentType?: string;
    topicIdeas: TopicIdea[];
    total: number;
    metrics: {
        avgVolume: number;
        avgDifficulty: number;
        avgOpportunity: number;
        totalQuestions: number;
    };
}

export interface RelatedTopicsResponse {
    baseTopic: string;
    country: string;
    relatedTopics: RelatedTopic[];
    total: number;
    clusters: {
        name: string;
        topics: string[];
        volume: number;
    }[];
}

export interface TopicQuestionsResponse {
    topic: string;
    country: string;
    questions: TopicQuestion[];
    total: number;
    questionTypes: {
        what: number;
        how: number;
        why: number;
        when: number;
        where: number;
        who: number;
    };
}
