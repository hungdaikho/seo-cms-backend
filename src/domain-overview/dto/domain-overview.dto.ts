import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { IsValidCountryCode } from '../../common/validators/country.validator';

export class DomainOverviewDto {
  @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
  @IsString()
  domain: string;

  @ApiPropertyOptional({
    description: 'Include subdomains in analysis',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  includeSubdomains?: boolean = false;
}

export class DomainTopKeywordsDto {
  @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
  @IsString()
  domain: string;

  @ApiPropertyOptional({
    description: 'Number of keywords to return',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(500)
  limit?: number = 100;

  @ApiPropertyOptional({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'US',
    enum: ['US', 'GB', 'DE', 'FR', 'VN', 'JP', 'KR', 'AU', 'CA'], // Show common examples
  })
  @IsString()
  @IsOptional()
  @IsValidCountryCode()
  country?: string = 'US';
}

export class DomainCompetitorsDto {
  @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
  @IsString()
  domain: string;

  @ApiPropertyOptional({
    description: 'Number of competitors to return',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @ApiPropertyOptional({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'US',
    enum: ['US', 'GB', 'DE', 'FR', 'VN', 'JP', 'KR', 'AU', 'CA'], // Show common examples
  })
  @IsString()
  @IsOptional()
  @IsValidCountryCode()
  country?: string = 'US';
}

export class DomainTopicsDto {
  @ApiProperty({ description: 'Domain to analyze', example: 'example.com' })
  @IsString()
  domain: string;

  @ApiPropertyOptional({
    description: 'Number of topics to return',
    example: 50,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(200)
  limit?: number = 50;
}

// Response interfaces
export interface CountryTraffic {
  country: string;
  traffic: number;
  percentage: number;
}

export interface TrafficTrend {
  date: string;
  traffic: number;
}

export interface DomainOverviewResponse {
  domain: string;
  authorityScore: number;
  organicKeywords: number;
  organicTraffic: number;
  organicCost: number;
  backlinks: number;
  referringDomains: number;
  topCountries: CountryTraffic[];
  trafficTrend: TrafficTrend[];
}

export interface TopKeyword {
  keyword: string;
  position: number;
  searchVolume: number;
  traffic: number;
  cpc: number;
  difficulty: number;
  trend: 'up' | 'down' | 'stable';
  url: string;
}

export interface DomainCompetitor {
  domain: string;
  competitionLevel: number;
  commonKeywords: number;
  authorityScore: number;
  trafficGap: number;
  organicKeywords: number;
  estimatedTraffic: number;
}

export interface DomainTopic {
  topic: string;
  keywords: number;
  traffic: number;
  difficulty: number;
  opportunities: number;
  topKeywords: string[];
}

export interface DomainTopKeywordsResponse {
  data: TopKeyword[];
  total: number;
  domain: string;
  country: string;
}

export interface DomainCompetitorsResponse {
  data: DomainCompetitor[];
  total: number;
  domain: string;
  country: string;
}

export interface DomainTopicsResponse {
  data: DomainTopic[];
  total: number;
  domain: string;
}
