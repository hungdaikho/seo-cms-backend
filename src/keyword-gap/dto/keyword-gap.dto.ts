import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum KeywordType {
  ORGANIC = 'organic',
  PAID = 'paid',
  ALL = 'all',
}

export enum Device {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
}

export enum Database {
  ALL = 'all',
  GOOGLE = 'google',
  BING = 'bing',
}

export class KeywordGapFiltersDto {
  @ApiPropertyOptional({ description: 'Minimum search volume', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minSearchVolume?: number;

  @ApiPropertyOptional({
    description: 'Maximum keyword difficulty',
    example: 80,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxDifficulty?: number;

  @ApiPropertyOptional({
    enum: KeywordType,
    description: 'Type of keywords to analyze',
  })
  @IsOptional()
  @IsEnum(KeywordType)
  keywordType?: KeywordType;
}

export class KeywordGapCompareDto {
  @ApiProperty({
    description: 'Target domain to analyze',
    example: 'example.com',
  })
  @IsString()
  targetDomain: string;

  @ApiProperty({
    description: 'Competitor domains to compare against',
    type: [String],
    example: ['competitor1.com', 'competitor2.com'],
  })
  @IsArray()
  @IsString({ each: true })
  competitors: string[];

  @ApiProperty({ description: 'Country code for analysis', example: 'US' })
  @IsString()
  country: string;

  @ApiPropertyOptional({
    enum: Database,
    description: 'Search engine database',
    default: Database.ALL,
  })
  @IsOptional()
  @IsEnum(Database)
  database?: Database;

  @ApiPropertyOptional({
    enum: Device,
    description: 'Device type for analysis',
    default: Device.DESKTOP,
  })
  @IsOptional()
  @IsEnum(Device)
  device?: Device;

  @ApiPropertyOptional({ description: 'Filters for keyword analysis' })
  @IsOptional()
  @ValidateNested()
  @Type(() => KeywordGapFiltersDto)
  filters?: KeywordGapFiltersDto;
}

export class KeywordGapOverlapDto {
  @ApiProperty({
    description: 'Comma-separated domains (max 3)',
    example: 'webflow.com,wix.com',
  })
  @IsString()
  domains: string;

  @ApiProperty({ description: 'Country code', example: 'US' })
  @IsString()
  country: string;
}

// Response DTOs
export interface KeywordGapComparison {
  shared: number;
  missing: number;
  weak: number;
  strong: number;
  untapped: number;
  unique: number;
}

export interface DomainMetrics {
  position: number;
  traffic: number;
  volume: number;
  cpc: number;
  result: string;
}

export interface KeywordDetail {
  keyword: string;
  intent: string;
  targetDomain: DomainMetrics | null;
  [key: string]: any; // For competitor domains
  kd: number;
  status: string;
}

export interface OpportunityCategory {
  category: string;
  keywords: number;
  estimatedTraffic: number;
}

export interface KeywordGapOverview {
  targetDomain: string;
  competitors: string[];
  comparison: KeywordGapComparison;
}

export interface KeywordGapCompareResponse {
  overview: KeywordGapOverview;
  keywordDetails: KeywordDetail[];
  opportunities: OpportunityCategory[];
  totalKeywords: number;
  exportUrl: string;
}

export interface VennDiagramData {
  total: number;
  unique: number;
  shared: number;
}

export interface OverlapOverview {
  domains: string[];
  totalUnique: number;
  overlap: Record<string, number>;
}

export interface TopOpportunity {
  keyword: string;
  volume: number;
  missing: string;
  competitors: Record<string, number | null>;
}

export interface KeywordGapOverlapResponse {
  overview: OverlapOverview;
  vennDiagram: Record<string, VennDiagramData>;
  topOpportunities: TopOpportunity[];
}
