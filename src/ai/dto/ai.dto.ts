import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AIRequestType {
    KEYWORD_RESEARCH = 'keyword_research',
    CONTENT_OPTIMIZATION = 'content_optimization',
    META_GENERATION = 'meta_generation',
    CONTENT_IDEAS = 'content_ideas',
    COMPETITOR_ANALYSIS = 'competitor_analysis',
    SEO_AUDIT = 'seo_audit',
}

export class KeywordResearchDto {
    @ApiProperty({ description: 'Target keyword or topic' })
    @IsString()
    topic: string;

    @ApiPropertyOptional({ description: 'Industry or niche' })
    @IsOptional()
    @IsString()
    industry?: string;

    @ApiPropertyOptional({ description: 'Target location' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ description: 'Number of keywords to generate', default: 50 })
    @IsOptional()
    @IsNumber()
    count?: number = 50;
}

export class ContentOptimizationDto {
    @ApiProperty({ description: 'Content to optimize' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Target keyword' })
    @IsString()
    targetKeyword: string;

    @ApiPropertyOptional({ description: 'Additional keywords to include' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    additionalKeywords?: string[];

    @ApiPropertyOptional({ description: 'Content type (blog, product, landing page)' })
    @IsOptional()
    @IsString()
    contentType?: string;
}

export class MetaGenerationDto {
    @ApiProperty({ description: 'Page content or URL' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Target keyword' })
    @IsString()
    targetKeyword: string;

    @ApiPropertyOptional({ description: 'Brand name' })
    @IsOptional()
    @IsString()
    brandName?: string;
}

export class ContentIdeasDto {
    @ApiProperty({ description: 'Main topic or keyword' })
    @IsString()
    topic: string;

    @ApiPropertyOptional({ description: 'Target audience' })
    @IsOptional()
    @IsString()
    audience?: string;

    @ApiPropertyOptional({ description: 'Content format (blog, video, infographic)' })
    @IsOptional()
    @IsString()
    format?: string;

    @ApiPropertyOptional({ description: 'Number of ideas to generate', default: 10 })
    @IsOptional()
    @IsNumber()
    count?: number = 10;
}

export class CompetitorAnalysisDto {
    @ApiProperty({ description: 'Competitor domain' })
    @IsString()
    competitorDomain: string;

    @ApiProperty({ description: 'Your domain' })
    @IsString()
    yourDomain: string;

    @ApiPropertyOptional({ description: 'Industry context' })
    @IsOptional()
    @IsString()
    industry?: string;
}

export class SEOAuditDto {
    @ApiProperty({ description: 'URL to audit' })
    @IsString()
    url: string;

    @ApiPropertyOptional({ description: 'Target keywords' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    targetKeywords?: string[];
}

export class AIRequestDto {
    @ApiProperty({ description: 'Type of AI request', enum: AIRequestType })
    @IsEnum(AIRequestType)
    type: AIRequestType;

    @ApiPropertyOptional({ description: 'Project ID (optional)' })
    @IsOptional()
    @IsUUID()
    projectId?: string;

    @ApiProperty({ description: 'Request parameters' })
    parameters: any;
}

export class KeywordResearchResponse {
    @ApiProperty()
    keywords: KeywordSuggestion[];

    @ApiProperty()
    relatedTopics: string[];

    @ApiProperty()
    searchIntent: SearchIntentAnalysis[];
}

export class KeywordSuggestion {
    @ApiProperty()
    keyword: string;

    @ApiProperty()
    estimatedVolume: number;

    @ApiProperty()
    estimatedDifficulty: number;

    @ApiProperty()
    searchIntent: string;

    @ApiProperty()
    relevanceScore: number;
}

export class SearchIntentAnalysis {
    @ApiProperty()
    intent: string;

    @ApiProperty()
    keywords: string[];

    @ApiProperty()
    percentage: number;
}

export class ContentOptimizationResponse {
    @ApiProperty()
    optimizedContent: string;

    @ApiProperty()
    suggestions: OptimizationSuggestion[];

    @ApiProperty()
    seoScore: number;

    @ApiProperty()
    keywordDensity: KeywordDensityAnalysis[];
}

export class OptimizationSuggestion {
    @ApiProperty()
    type: string;

    @ApiProperty()
    suggestion: string;

    @ApiProperty()
    priority: string;

    @ApiProperty()
    impact: string;
}

export class KeywordDensityAnalysis {
    @ApiProperty()
    keyword: string;

    @ApiProperty()
    count: number;

    @ApiProperty()
    density: number;

    @ApiProperty()
    recommendation: string;
}

export class MetaTagsResponse {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    keywords: string[];

    @ApiProperty()
    alternativeTitles: string[];

    @ApiProperty()
    alternativeDescriptions: string[];
}

export class ContentIdeasResponse {
    @ApiProperty()
    ideas: ContentIdea[];

    @ApiProperty()
    contentPillars: string[];

    @ApiProperty()
    seasonalTopics: string[];
}

export class ContentIdea {
    @ApiProperty()
    title: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    contentType: string;

    @ApiProperty()
    targetKeywords: string[];

    @ApiProperty()
    difficulty: string;

    @ApiProperty()
    estimatedTraffic: number;
}

export class CompetitorAnalysisResponse {
    @ApiProperty()
    strengths: string[];

    @ApiProperty()
    weaknesses: string[];

    @ApiProperty()
    opportunities: string[];

    @ApiProperty()
    contentGaps: string[];

    @ApiProperty()
    recommendations: CompetitorRecommendation[];
}

export class CompetitorRecommendation {
    @ApiProperty()
    category: string;

    @ApiProperty()
    recommendation: string;

    @ApiProperty()
    priority: string;

    @ApiProperty()
    effort: string;
}

export class SEOAuditResponse {
    @ApiProperty()
    overallScore: number;

    @ApiProperty()
    issues: SEOIssue[];

    @ApiProperty()
    recommendations: SEORecommendation[];

    @ApiProperty()
    technicalIssues: TechnicalIssue[];
}

export class SEOIssue {
    @ApiProperty()
    category: string;

    @ApiProperty()
    issue: string;

    @ApiProperty()
    severity: string;

    @ApiProperty()
    impact: string;
}

export class SEORecommendation {
    @ApiProperty()
    category: string;

    @ApiProperty()
    recommendation: string;

    @ApiProperty()
    priority: string;

    @ApiProperty()
    implementationEffort: string;
}

export class TechnicalIssue {
    @ApiProperty()
    type: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    solution: string;

    @ApiProperty()
    priority: string;
}
