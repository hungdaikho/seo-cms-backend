import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportType {
    KEYWORD_RANKING = 'keyword_ranking',
    TRAFFIC_ANALYSIS = 'traffic_analysis',
    COMPETITOR_ANALYSIS = 'competitor_analysis',
    BACKLINK_ANALYSIS = 'backlink_analysis',
    TECHNICAL_SEO = 'technical_seo',
    CONTENT_PERFORMANCE = 'content_performance',
    CUSTOM = 'custom',
}

export enum ReportStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export class CreateReportDto {
    @ApiProperty({ description: 'Report name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Project ID', example: 'uuid' })
    @IsUUID()
    projectId: string;

    @ApiProperty({ description: 'Type of report', enum: ReportType })
    @IsEnum(ReportType)
    type: ReportType;

    @ApiPropertyOptional({ description: 'Report configuration' })
    @IsOptional()
    config?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Start date for data analysis' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for data analysis' })
    @IsOptional()
    @IsDateString()
    endDate?: string;
}

export class GenerateReportDto {
    @ApiProperty({ description: 'Report type', enum: ReportType })
    @IsEnum(ReportType)
    type: ReportType;

    @ApiProperty({ description: 'Project ID', example: 'uuid' })
    @IsUUID()
    projectId: string;

    @ApiPropertyOptional({ description: 'Start date for analysis' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for analysis' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'Additional filters' })
    @IsOptional()
    filters?: Record<string, any>;
}

export class ReportResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    projectId: string;

    @ApiProperty({ enum: ReportType })
    type: ReportType;

    @ApiProperty({ enum: ReportStatus })
    status: ReportStatus;

    @ApiProperty()
    config: Record<string, any>;

    @ApiProperty()
    data?: Record<string, any>;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    generatedAt?: Date;
}

export class KeywordRankingReportData {
    @ApiProperty()
    totalKeywords: number;

    @ApiProperty()
    averagePosition: number;

    @ApiProperty()
    topKeywords: KeywordRankingData[];

    @ApiProperty()
    rankingTrends: RankingTrendData[];

    @ApiProperty()
    competitorComparison: CompetitorRankingData[];
}

export class KeywordRankingData {
    @ApiProperty()
    keyword: string;

    @ApiProperty()
    currentPosition: number;

    @ApiProperty()
    previousPosition: number;

    @ApiProperty()
    change: number;

    @ApiProperty()
    searchVolume: number;

    @ApiProperty()
    difficulty: number;

    @ApiProperty()
    url: string;
}

export class RankingTrendData {
    @ApiProperty()
    date: string;

    @ApiProperty()
    averagePosition: number;

    @ApiProperty()
    totalKeywords: number;

    @ApiProperty()
    top10Keywords: number;

    @ApiProperty()
    top3Keywords: number;
}

export class CompetitorRankingData {
    @ApiProperty()
    competitor: string;

    @ApiProperty()
    domain: string;

    @ApiProperty()
    averagePosition: number;

    @ApiProperty()
    totalKeywords: number;

    @ApiProperty()
    visibility: number;
}

export class TrafficAnalysisReportData {
    @ApiProperty()
    totalSessions: number;

    @ApiProperty()
    totalUsers: number;

    @ApiProperty()
    totalPageviews: number;

    @ApiProperty()
    averageBounceRate: number;

    @ApiProperty()
    averageSessionDuration: number;

    @ApiProperty()
    organicTraffic: TrafficData[];

    @ApiProperty()
    topPages: PageTrafficData[];

    @ApiProperty()
    trafficSources: TrafficSourceData[];
}

export class TrafficData {
    @ApiProperty()
    date: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    users: number;

    @ApiProperty()
    pageviews: number;

    @ApiProperty()
    bounceRate: number;
}

export class PageTrafficData {
    @ApiProperty()
    page: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    pageviews: number;

    @ApiProperty()
    bounceRate: number;

    @ApiProperty()
    avgSessionDuration: number;
}

export class TrafficSourceData {
    @ApiProperty()
    source: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    percentage: number;
}

export class ContentPerformanceReportData {
    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    totalClicks: number;

    @ApiProperty()
    totalImpressions: number;

    @ApiProperty()
    averageCTR: number;

    @ApiProperty()
    averagePosition: number;

    @ApiProperty()
    topPerformingPages: ContentPageData[];

    @ApiProperty()
    contentGaps: ContentGapData[];
}

export class ContentPageData {
    @ApiProperty()
    page: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    clicks: number;

    @ApiProperty()
    impressions: number;

    @ApiProperty()
    ctr: number;

    @ApiProperty()
    position: number;

    @ApiProperty()
    wordCount: number;

    @ApiProperty()
    lastUpdated: Date;
}

export class ContentGapData {
    @ApiProperty()
    keyword: string;

    @ApiProperty()
    searchVolume: number;

    @ApiProperty()
    difficulty: number;

    @ApiProperty()
    competitorRanking: boolean;

    @ApiProperty()
    opportunity: string;
}
