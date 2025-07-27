import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsArray, Min, Max } from 'class-validator';

export class OrganicDomainAnalysisDto {
    @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
    @IsString()
    domain: string;

    @ApiProperty({ description: 'Country code', example: 'US' })
    @IsString()
    country: string;

    @ApiPropertyOptional({ description: 'Database to use', example: 'google' })
    @IsString()
    @IsOptional()
    database?: string;
}

export class OrganicKeywordsDto {
    @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
    @IsString()
    domain: string;

    @ApiProperty({ description: 'Country code', example: 'US' })
    @IsString()
    country: string;

    @ApiPropertyOptional({ description: 'Number of results to return', example: 100 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(1000)
    limit?: number = 100;

    @ApiPropertyOptional({ description: 'Offset for pagination', example: 0 })
    @IsNumber()
    @IsOptional()
    @Min(0)
    offset?: number = 0;

    @ApiPropertyOptional({
        description: 'Sort by field',
        enum: ['position', 'traffic', 'volume'],
        example: 'position'
    })
    @IsEnum(['position', 'traffic', 'volume'])
    @IsOptional()
    sortBy?: 'position' | 'traffic' | 'volume' = 'position';

    @ApiPropertyOptional({
        description: 'Sort order',
        enum: ['asc', 'desc'],
        example: 'asc'
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    sortOrder?: 'asc' | 'desc' = 'asc';
}

export class CompetitorDiscoveryDto {
    @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
    @IsString()
    domain: string;

    @ApiProperty({ description: 'Country code', example: 'US' })
    @IsString()
    country: string;

    @ApiPropertyOptional({ description: 'Number of competitors to return', example: 50 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(200)
    limit?: number = 50;
}

export class TopPagesDto {
    @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
    @IsString()
    domain: string;

    @ApiProperty({ description: 'Country code', example: 'US' })
    @IsString()
    country: string;

    @ApiPropertyOptional({ description: 'Number of pages to return', example: 100 })
    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(500)
    limit?: number = 100;

    @ApiPropertyOptional({
        description: 'Sort by field',
        enum: ['traffic', 'keywords', 'value'],
        example: 'traffic'
    })
    @IsEnum(['traffic', 'keywords', 'value'])
    @IsOptional()
    sortBy?: 'traffic' | 'keywords' | 'value' = 'traffic';
}

// Response interfaces
export interface OrganicDomainResponse {
    domain: string;
    organicKeywords: number;
    organicTraffic: number;
    organicCost: number;
    avgPosition: number;
    visibility: number;
    lastUpdated: string;
}

export interface OrganicKeyword {
    keyword: string;
    position: number;
    previousPosition: number;
    searchVolume: number;
    trafficShare: number;
    cpc: number;
    difficulty: number;
    intent: string;
    url: string;
    features: string[];
}

export interface CompetitorData {
    domain: string;
    competitionLevel: number;
    commonKeywords: number;
    keywords: number;
    traffic: number;
    trafficValue: number;
    topKeyword: string;
}

export interface TopPage {
    url: string;
    traffic: number;
    keywords: number;
    trafficValue: number;
    avgPosition: number;
    topKeywords: string[];
}

export interface OrganicKeywordsResponse {
    data: OrganicKeyword[];
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface CompetitorDiscoveryResponse {
    data: CompetitorData[];
    total: number;
    targetDomain: string;
    country: string;
}

export interface TopPagesResponse {
    data: TopPage[];
    total: number;
    domain: string;
    country: string;
}
