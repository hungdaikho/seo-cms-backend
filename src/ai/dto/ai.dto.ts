import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AIRequestType {
    KEYWORD_RESEARCH = 'keyword_research',
    CONTENT_OPTIMIZATION = 'content_optimization',
    META_GENERATION = 'meta_generation',
    CONTENT_IDEAS = 'content_ideas',
    COMPETITOR_ANALYSIS = 'competitor_analysis',
    SEO_AUDIT = 'seo_audit',
    // Advanced Content Generation
    BLOG_OUTLINE = 'blog_outline',
    PRODUCT_DESCRIPTION = 'product_description',
    SOCIAL_MEDIA = 'social_media',
    CONTENT_REWRITE = 'content_rewrite',
    CONTENT_EXPANSION = 'content_expansion',
    // Advanced SEO Analysis
    COMPETITOR_CONTENT_ANALYSIS = 'competitor_content_analysis',
    CONTENT_OPTIMIZATION_SUGGESTIONS = 'content_optimization_suggestions',
    SCHEMA_MARKUP_GENERATION = 'schema_markup_generation',
    // Advanced Keyword Research
    LONG_TAIL_KEYWORDS = 'long_tail_keywords',
    QUESTION_BASED_KEYWORDS = 'question_based_keywords',
    SEASONAL_KEYWORD_TRENDS = 'seasonal_keyword_trends',
    // Analytics
    CONTENT_PERFORMANCE_PREDICTION = 'content_performance_prediction',
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

// =============================
// ADVANCED CONTENT GENERATION DTOs
// =============================

export class BlogOutlineDto {
    @ApiProperty({ description: 'Blog topic' })
    @IsString()
    topic: string;

    @ApiProperty({ description: 'Target keywords' })
    @IsArray()
    @IsString({ each: true })
    targetKeywords: string[];

    @ApiProperty({ description: 'Target audience' })
    @IsString()
    targetAudience: string;

    @ApiPropertyOptional({ description: 'Target word count', default: 2000 })
    @IsOptional()
    @IsNumber()
    wordCount?: number = 2000;

    @ApiPropertyOptional({ description: 'Content tone', enum: ['professional', 'casual', 'friendly', 'authoritative'] })
    @IsOptional()
    @IsString()
    tone?: 'professional' | 'casual' | 'friendly' | 'authoritative' = 'professional';
}

export class ProductDescriptionDto {
    @ApiProperty({ description: 'Product name' })
    @IsString()
    productName: string;

    @ApiProperty({ description: 'Product features' })
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiProperty({ description: 'Product benefits' })
    @IsArray()
    @IsString({ each: true })
    benefits: string[];

    @ApiProperty({ description: 'Target audience' })
    @IsString()
    targetAudience: string;

    @ApiPropertyOptional({ description: 'Content tone' })
    @IsOptional()
    @IsString()
    tone?: string = 'professional';

    @ApiPropertyOptional({ description: 'Description length', enum: ['short', 'medium', 'long'] })
    @IsOptional()
    @IsString()
    length?: 'short' | 'medium' | 'long' = 'medium';
}

export class SocialMediaContentDto {
    @ApiProperty({ description: 'Social media platform', enum: ['facebook', 'twitter', 'linkedin', 'instagram'] })
    @IsString()
    platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram';

    @ApiProperty({ description: 'Content type', enum: ['post', 'caption', 'story', 'ad'] })
    @IsString()
    contentType: 'post' | 'caption' | 'story' | 'ad';

    @ApiProperty({ description: 'Content topic' })
    @IsString()
    topic: string;

    @ApiPropertyOptional({ description: 'Content tone' })
    @IsOptional()
    @IsString()
    tone?: string = 'friendly';

    @ApiPropertyOptional({ description: 'Include hashtags', default: true })
    @IsOptional()
    includeHashtags?: boolean = true;

    @ApiPropertyOptional({ description: 'Include emojis', default: true })
    @IsOptional()
    includeEmojis?: boolean = true;
}

export class ContentRewriteDto {
    @ApiProperty({ description: 'Content to rewrite' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Target tone' })
    @IsOptional()
    @IsString()
    tone?: string;

    @ApiPropertyOptional({ description: 'Target style' })
    @IsOptional()
    @IsString()
    style?: string;

    @ApiPropertyOptional({ description: 'Target length', enum: ['shorter', 'same', 'longer'] })
    @IsOptional()
    @IsString()
    length?: 'shorter' | 'same' | 'longer' = 'same';
}

export class ContentExpansionDto {
    @ApiProperty({ description: 'Content to expand' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Target length in words' })
    @IsNumber()
    targetLength: number;

    @ApiPropertyOptional({ description: 'Additional topics to include' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    additionalTopics?: string[];
}

// =============================
// ADVANCED SEO ANALYSIS DTOs
// =============================

export class CompetitorContentAnalysisDto {
    @ApiProperty({ description: 'Target keyword' })
    @IsString()
    keyword: string;

    @ApiProperty({ description: 'Target URL' })
    @IsString()
    targetUrl: string;

    @ApiProperty({ description: 'Competitor URLs' })
    @IsArray()
    @IsString({ each: true })
    competitorUrls: string[];

    @ApiPropertyOptional({ description: 'Additional target keywords' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    targetKeywords?: string[];
}

export class ContentOptimizationSuggestionsDto {
    @ApiProperty({ description: 'Content to analyze' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Target keywords' })
    @IsArray()
    @IsString({ each: true })
    targetKeywords: string[];

    @ApiPropertyOptional({ description: 'Current URL' })
    @IsOptional()
    @IsString()
    currentUrl?: string;

    @ApiProperty({ description: 'Target audience' })
    @IsString()
    targetAudience: string;
}

export class SchemaMarkupGenerationDto {
    @ApiProperty({ description: 'Content type', enum: ['article', 'product', 'service', 'local-business'] })
    @IsString()
    contentType: 'article' | 'product' | 'service' | 'local-business';

    @ApiProperty({ description: 'Content to analyze' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Additional metadata' })
    metadata: any;
}

// =============================
// ADVANCED KEYWORD RESEARCH DTOs
// =============================

export class LongTailKeywordsDto {
    @ApiProperty({ description: 'Seed keywords' })
    @IsArray()
    @IsString({ each: true })
    seedKeywords: string[];

    @ApiProperty({ description: 'Search intent', enum: ['informational', 'commercial', 'transactional', 'navigational'] })
    @IsString()
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational';

    @ApiPropertyOptional({ description: 'Target location' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ description: 'Target language', default: 'en' })
    @IsOptional()
    @IsString()
    language?: string = 'en';
}

export class QuestionBasedKeywordsDto {
    @ApiProperty({ description: 'Main topic' })
    @IsString()
    topic: string;

    @ApiPropertyOptional({ description: 'Target location' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ description: 'Target language', default: 'en' })
    @IsOptional()
    @IsString()
    language?: string = 'en';
}

export class SeasonalKeywordTrendsDto {
    @ApiProperty({ description: 'Keywords to analyze' })
    @IsArray()
    @IsString({ each: true })
    keywords: string[];

    @ApiProperty({ description: 'Industry context' })
    @IsString()
    industry: string;

    @ApiPropertyOptional({ description: 'Target location' })
    @IsOptional()
    @IsString()
    location?: string;
}

// =============================
// AI ANALYTICS DTOs
// =============================

export class ContentPerformancePredictionDto {
    @ApiProperty({ description: 'Content to analyze' })
    @IsString()
    content: string;

    @ApiProperty({ description: 'Target keywords' })
    @IsArray()
    @IsString({ each: true })
    targetKeywords: string[];

    @ApiProperty({ description: 'Planned publish date' })
    @IsString()
    publishDate: string;

    @ApiProperty({ description: 'Content type' })
    @IsString()
    contentType: string;
}

export class AIUsageAnalyticsDto {
    @ApiPropertyOptional({ description: 'Time period', enum: ['day', 'week', 'month', 'quarter', 'year'] })
    @IsOptional()
    @IsString()
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month';

    @ApiPropertyOptional({ description: 'User ID filter' })
    @IsOptional()
    @IsUUID()
    userId?: string;
}

// =============================
// AI TOOLS MANAGEMENT DTOs
// =============================

export class AIToolUsageDto {
    @ApiProperty({ description: 'Tool ID' })
    @IsString()
    toolId: string;

    @ApiProperty({ description: 'Tokens used' })
    @IsNumber()
    tokens: number;

    @ApiProperty({ description: 'Cost incurred' })
    @IsNumber()
    cost: number;

    @ApiProperty({ description: 'Request ID' })
    @IsUUID()
    requestId: string;
}

export class AITemplateDto {
    @ApiProperty({ description: 'Template name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Template description' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Tool ID' })
    @IsString()
    toolId: string;

    @ApiProperty({ description: 'Template parameters' })
    parameters: any;

    @ApiPropertyOptional({ description: 'Is shared template', default: false })
    @IsOptional()
    isShared?: boolean = false;
}

export class AIWorkflowDto {
    @ApiProperty({ description: 'Workflow name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Workflow description' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Workflow steps' })
    @IsArray()
    steps: {
        toolId: string;
        parameters: any;
        order: number;
    }[];
}

// =============================
// RESPONSE DTOs
// =============================

export class BlogOutlineResponse {
    @ApiProperty()
    outline: {
        sections: {
            title: string;
            description: string;
            estimatedWords: number;
            keyPoints: string[];
        }[];
    };

    @ApiProperty()
    suggestedImages: string[];

    @ApiProperty()
    internalLinkOpportunities: string[];
}

export class ProductDescriptionResponse {
    @ApiProperty()
    descriptions: string[];

    @ApiProperty()
    bulletPoints: string[];

    @ApiProperty()
    callToActions: string[];
}

export class SocialMediaContentResponse {
    @ApiProperty()
    content: string;

    @ApiProperty()
    hashtags: string[];

    @ApiProperty()
    alternativeVersions: string[];
}

export class ContentRewriteResponse {
    @ApiProperty()
    originalContent: string;

    @ApiProperty()
    rewrittenContent: string;

    @ApiProperty()
    changes: string[];

    @ApiProperty()
    wordCountChange: number;
}

export class ContentExpansionResponse {
    @ApiProperty()
    originalContent: string;

    @ApiProperty()
    expandedContent: string;

    @ApiProperty()
    addedSections: string[];

    @ApiProperty()
    wordCountIncrease: number;
}

export class CompetitorContentAnalysisResponse {
    @ApiProperty()
    keyword: string;

    @ApiProperty()
    topPerformingContent: {
        url: string;
        title: string;
        wordCount: number;
        seoScore: number;
        socialShares: number;
        backlinks: number;
        keywordOptimization: string[];
    }[];

    @ApiProperty()
    contentGaps: string[];

    @ApiProperty()
    recommendations: string[];
}

export class ContentOptimizationSuggestionsResponse {
    @ApiProperty()
    keywordDensity: {
        keyword: string;
        currentDensity: number;
        recommendedDensity: number;
        suggestions: string[];
    }[];

    @ApiProperty()
    readabilityIssues: string[];

    @ApiProperty()
    structureImprovements: string[];

    @ApiProperty()
    internalLinkSuggestions: string[];
}

export class SchemaMarkupResponse {
    @ApiProperty()
    schemaMarkup: string;

    @ApiProperty()
    implementationInstructions: string[];
}

export class LongTailKeywordsResponse {
    @ApiProperty()
    keywords: {
        keyword: string;
        searchVolume: number;
        difficulty: number;
        intent: string;
        relatedQuestions: string[];
    }[];

    @ApiProperty()
    topicClusters: {
        topic: string;
        keywords: string[];
        contentOpportunity: string;
    }[];
}

export class QuestionBasedKeywordsResponse {
    @ApiProperty()
    questions: {
        question: string;
        searchVolume: number;
        difficulty: number;
        answerFormat: 'paragraph' | 'list' | 'table' | 'video';
    }[];

    @ApiProperty()
    featuredSnippetOpportunities: string[];
}

export class SeasonalKeywordTrendsResponse {
    @ApiProperty()
    trends: {
        keyword: string;
        seasonality: {
            month: number;
            relativeInterest: number;
        }[];
        peakMonths: number[];
        contentCalendarSuggestions: {
            month: number;
            contentType: string;
            topics: string[];
        }[];
    }[];
}

export class ContentPerformancePredictionResponse {
    @ApiProperty()
    predictedMetrics: {
        estimatedTraffic: number;
        estimatedEngagement: number;
        estimatedConversions: number;
        confidenceScore: number;
    };

    @ApiProperty()
    improvementSuggestions: string[];

    @ApiProperty()
    competitorComparison: any;
}

export class AIUsageAnalyticsResponse {
    @ApiProperty()
    totalRequests: number;

    @ApiProperty()
    successfulRequests: number;

    @ApiProperty()
    failedRequests: number;

    @ApiProperty()
    totalTokensUsed: number;

    @ApiProperty()
    totalCost: number;

    @ApiProperty()
    toolUsageBreakdown: {
        toolId: string;
        toolName: string;
        requestCount: number;
        tokensUsed: number;
        cost: number;
    }[];

    @ApiProperty()
    dailyUsage: {
        date: string;
        requests: number;
        tokens: number;
        cost: number;
    }[];
}

export class AIToolUsageResponse {
    @ApiProperty()
    toolId: string;

    @ApiProperty()
    totalUsage: number;

    @ApiProperty()
    remainingUsage: number;

    @ApiProperty()
    usageLimit: number;

    @ApiProperty()
    currentPeriodUsage: number;

    @ApiProperty()
    costThisPeriod: number;
}

export class AITool {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    category: 'content' | 'seo' | 'analysis' | 'research' | 'optimization';

    @ApiProperty()
    icon: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isPremium: boolean;

    @ApiProperty()
    usageCount: number;

    @ApiPropertyOptional()
    maxUsage?: number;

    @ApiProperty()
    features: string[];

    @ApiPropertyOptional()
    costPerRequest?: number;

    @ApiPropertyOptional()
    averageTokens?: number;
}

export class AITemplate {
    @ApiProperty()
    id: string;

    @ApiProperty()
    projectId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    toolId: string;

    @ApiProperty()
    parameters: any;

    @ApiProperty()
    isShared: boolean;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    usageCount: number;
}

export class AIWorkflow {
    @ApiProperty()
    id: string;

    @ApiProperty()
    projectId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    steps: {
        id: string;
        toolId: string;
        parameters: any;
        order: number;
        dependsOn?: string[];
    }[];

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    createdAt: string;
}
