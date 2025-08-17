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
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum LinkType {
  DOFOLLOW = 'dofollow',
  NOFOLLOW = 'nofollow',
  ALL = 'all',
}

export enum LinkStatus {
  ACTIVE = 'active',
  BROKEN = 'broken',
  REDIRECT = 'redirect',
  ALL = 'all',
}

export class BacklinkGapFiltersDto {
  @ApiPropertyOptional({
    description: 'Minimum authority score',
    example: 30,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minAuthorityScore?: number;

  @ApiPropertyOptional({
    enum: LinkType,
    description: 'Type of links to analyze',
    default: LinkType.ALL,
  })
  @IsOptional()
  @IsEnum(LinkType)
  linkType?: LinkType;

  @ApiPropertyOptional({
    enum: LinkStatus,
    description: 'Status of links to analyze',
    default: LinkStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(LinkStatus)
  linkStatus?: LinkStatus;

  @ApiPropertyOptional({
    description: 'Language code for content analysis',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Minimum referring domains',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minReferringDomains?: number;
}

export class BacklinkGapCompareDto {
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

  @ApiPropertyOptional({ description: 'Filters for backlink analysis' })
  @IsOptional()
  @ValidateNested()
  @Type(() => BacklinkGapFiltersDto)
  filters?: BacklinkGapFiltersDto;
}

export class BacklinkProspectsDto {
  @ApiPropertyOptional({
    description: 'Number of results to return',
    example: 100,
    default: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Minimum authority score (flat parameter)',
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  minAuthorityScore?: number;

  @ApiPropertyOptional({
    description: 'Competitor domains (comma-separated)',
    example: 'competitor1.com,competitor2.com',
  })
  @IsOptional()
  @IsString()
  competitors?: string;

  @ApiPropertyOptional({
    enum: LinkType,
    description: 'Type of links to analyze',
    default: LinkType.ALL,
  })
  @IsOptional()
  @IsEnum(LinkType)
  linkType?: LinkType;

  @ApiPropertyOptional({
    description: 'Language code for content analysis',
    example: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Nested filters object (alternative to flat parameters)',
    type: BacklinkGapFiltersDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BacklinkGapFiltersDto)
  filters?: BacklinkGapFiltersDto;
}

// Response DTOs
export interface BacklinkGapComparison {
  shared: number;
  missing: number;
  unique: number;
  opportunities: number;
  total: number;
}

export interface DomainBacklinkMetrics {
  authorityScore: number;
  referringDomains: number;
  backlinks: number;
  linkType: string;
  anchorText: string;
  firstSeen: string;
  lastSeen: string;
}

export interface BacklinkDetail {
  sourceUrl: string;
  targetUrl: string;
  sourceDomain: string;
  authorityScore: number;
  linkType: LinkType;
  anchorText: string;
  firstSeen: string;
  lastSeen: string;
  status: LinkStatus;
  targetDomain: DomainBacklinkMetrics | null;
  competitors: Record<string, DomainBacklinkMetrics | null>;
}

export interface BacklinkOpportunity {
  domain: string;
  authorityScore: number;
  referringDomains: number;
  missingFrom: string[];
  linkingToCompetitors: number;
  estimatedValue: number;
}

export interface BacklinkGapOverview {
  targetDomain: string;
  competitors: string[];
  comparison: BacklinkGapComparison;
  totalAnalyzed: number;
}

export interface BacklinkGapCompareResponse {
  overview: BacklinkGapOverview;
  backlinkDetails: BacklinkDetail[];
  opportunities: BacklinkOpportunity[];
  totalBacklinks: number;
  exportUrl: string;
}

export interface BacklinkProspect {
  domain: string;
  url: string;
  authorityScore: number;
  referringDomains: number;
  backlinks: number;
  topAnchorText: string;
  contentTopic: string;
  contactInfo: {
    email?: string;
    socialMedia?: Record<string, string>;
  };
  outreachScore: number;
}

export interface BacklinkProspectsResponse {
  prospects: BacklinkProspect[];
  totalFound: number;
  analysisDate: string;
}
