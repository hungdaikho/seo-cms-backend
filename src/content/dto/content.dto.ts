import { IsString, IsEnum, IsOptional, IsArray, IsNumber, IsUUID, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ContentStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    SCHEDULED = 'scheduled',
    ARCHIVED = 'archived',
}

export enum ContentType {
    POST = 'post',
    PAGE = 'page',
    LANDING_PAGE = 'landing-page',
    PRODUCT = 'product',
}

export enum ContentPriority {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
}

export enum CalendarItemType {
    BLOG_POST = 'blog-post',
    SOCIAL_MEDIA = 'social-media',
    EMAIL = 'email',
    LANDING_PAGE = 'landing-page',
    VIDEO = 'video',
    INFOGRAPHIC = 'infographic',
}

export enum CalendarItemStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'in-progress',
    REVIEW = 'review',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

// Content CRUD DTOs
export class CreateContentDto {
    @ApiProperty({ description: 'Content title' })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Content body' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Content excerpt' })
    @IsOptional()
    @IsString()
    excerpt?: string;

    @ApiProperty({ enum: ContentStatus, description: 'Content status' })
    @IsEnum(ContentStatus)
    status: ContentStatus;

    @ApiProperty({ enum: ContentType, description: 'Content type' })
    @IsEnum(ContentType)
    type: ContentType;

    @ApiPropertyOptional({ type: [String], description: 'Content categories' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiPropertyOptional({ type: [String], description: 'Content tags' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: 'SEO meta title' })
    @IsOptional()
    @IsString()
    metaTitle?: string;

    @ApiPropertyOptional({ description: 'SEO meta description' })
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiPropertyOptional({ description: 'Focus keyword for SEO' })
    @IsOptional()
    @IsString()
    focusKeyword?: string;

    @ApiPropertyOptional({ description: 'Scheduled publish date' })
    @IsOptional()
    @IsDateString()
    publishedAt?: string;

    @ApiPropertyOptional({ description: 'Featured image URL' })
    @IsOptional()
    @IsString()
    featuredImage?: string;
}

export class UpdateContentDto extends CreateContentDto {
    @ApiProperty({ description: 'Content ID' })
    @IsUUID()
    id: string;
}

export class GetContentItemsDto {
    @ApiPropertyOptional({ enum: ContentStatus, description: 'Filter by status' })
    @IsOptional()
    @IsEnum(ContentStatus)
    status?: ContentStatus;

    @ApiPropertyOptional({ enum: ContentType, description: 'Filter by type' })
    @IsOptional()
    @IsEnum(ContentType)
    type?: ContentType;

    @ApiPropertyOptional({ description: 'Filter by category' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Search query' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by author' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ description: 'Sort by field' })
    @IsOptional()
    @IsString()
    sortBy?: string;

    @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort order' })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc';

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', default: 20 })
    @IsOptional()
    @IsNumber()
    limit?: number;
}

// Content Categories DTOs
export class CreateCategoryDto {
    @ApiProperty({ description: 'Category name' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Category description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Parent category ID' })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({ description: 'Category color' })
    @IsOptional()
    @IsString()
    color?: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
    @ApiProperty({ description: 'Category ID' })
    @IsUUID()
    id: string;
}

// Content Calendar DTOs
export class CreateCalendarItemDto {
    @ApiProperty({ description: 'Calendar item title' })
    @IsString()
    title: string;

    @ApiProperty({ enum: CalendarItemType, description: 'Content type' })
    @IsEnum(CalendarItemType)
    type: CalendarItemType;

    @ApiProperty({ enum: CalendarItemStatus, description: 'Item status' })
    @IsEnum(CalendarItemStatus)
    status: CalendarItemStatus;

    @ApiProperty({ enum: ContentPriority, description: 'Priority level' })
    @IsEnum(ContentPriority)
    priority: ContentPriority;

    @ApiProperty({ description: 'Publish date' })
    @IsDateString()
    publishDate: string;

    @ApiPropertyOptional({ type: [String], description: 'Target keywords' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    targetKeywords?: string[];

    @ApiPropertyOptional({ description: 'Estimated word count' })
    @IsOptional()
    @IsNumber()
    estimatedWordCount?: number;

    @ApiPropertyOptional({ description: 'Actual word count' })
    @IsOptional()
    @IsNumber()
    actualWordCount?: number;

    @ApiProperty({ description: 'Content brief' })
    @IsString()
    brief: string;

    @ApiPropertyOptional({ description: 'Additional notes' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiPropertyOptional({ type: [String], description: 'Tags' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}

export class UpdateCalendarItemDto extends CreateCalendarItemDto {
    @ApiProperty({ description: 'Calendar item ID' })
    @IsUUID()
    id: string;

    @ApiPropertyOptional({ description: 'SEO score' })
    @IsOptional()
    @IsNumber()
    seoScore?: number;

    @ApiPropertyOptional({ description: 'Readability score' })
    @IsOptional()
    @IsNumber()
    readabilityScore?: number;
}

export class BulkUpdateCalendarDto {
    @ApiProperty({ type: [Object], description: 'Items to update' })
    @IsArray()
    items: Array<{
        id: string;
        status?: CalendarItemStatus;
        publishDate?: string;
        priority?: ContentPriority;
    }>;
}

export class GetCalendarItemsDto {
    @ApiPropertyOptional({ description: 'Start date for calendar' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for calendar' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ enum: CalendarItemStatus, description: 'Filter by status' })
    @IsOptional()
    @IsEnum(CalendarItemStatus)
    status?: CalendarItemStatus;

    @ApiPropertyOptional({ enum: CalendarItemType, description: 'Filter by type' })
    @IsOptional()
    @IsEnum(CalendarItemType)
    type?: CalendarItemType;

    @ApiPropertyOptional({ description: 'Filter by author' })
    @IsOptional()
    @IsString()
    author?: string;
}

// Content Performance DTOs
export class ContentPerformanceDto {
    @ApiPropertyOptional({ description: 'Time period (7d, 30d, 90d, custom)' })
    @IsOptional()
    @IsString()
    period?: string;

    @ApiPropertyOptional({ description: 'Start date for custom period' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for custom period' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ type: [String], description: 'Specific content IDs' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    contentIds?: string[];

    @ApiPropertyOptional({ enum: ['day', 'week', 'month'], description: 'Group by time period' })
    @IsOptional()
    @IsEnum(['day', 'week', 'month'])
    groupBy?: 'day' | 'week' | 'month';
}

export class ContentROIDto {
    @ApiPropertyOptional({ description: 'Time period for ROI analysis' })
    @IsOptional()
    @IsString()
    period?: string;

    @ApiPropertyOptional({ type: [String], description: 'Specific content IDs' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    contentIds?: string[];
}

// AI Content Generation DTOs
export class AIContentGenerationDto {
    @ApiProperty({ enum: ['blog-post', 'social-media', 'email', 'meta-description', 'title'], description: 'Content type to generate' })
    @IsEnum(['blog-post', 'social-media', 'email', 'meta-description', 'title'])
    type: string;

    @ApiProperty({ description: 'Topic for content generation' })
    @IsString()
    topic: string;

    @ApiProperty({ type: [String], description: 'Target keywords' })
    @IsArray()
    @IsString({ each: true })
    targetKeywords: string[];

    @ApiProperty({ enum: ['professional', 'casual', 'friendly', 'authoritative', 'conversational'], description: 'Content tone' })
    @IsEnum(['professional', 'casual', 'friendly', 'authoritative', 'conversational'])
    tone: string;

    @ApiProperty({ enum: ['short', 'medium', 'long'], description: 'Content length' })
    @IsEnum(['short', 'medium', 'long'])
    length: string;

    @ApiProperty({ description: 'Content language' })
    @IsString()
    language: string;

    @ApiPropertyOptional({ description: 'Target audience' })
    @IsOptional()
    @IsString()
    audience?: string;

    @ApiPropertyOptional({ description: 'Additional instructions for AI' })
    @IsOptional()
    @IsString()
    additionalInstructions?: string;
}

export class ContentOptimizationDto {
    @ApiPropertyOptional({ description: 'Content ID to optimize' })
    @IsOptional()
    @IsUUID()
    contentId?: string;

    @ApiProperty({ description: 'Content to optimize' })
    @IsString()
    content: string;

    @ApiProperty({ type: [String], description: 'Target keywords' })
    @IsArray()
    @IsString({ each: true })
    targetKeywords: string[];

    @ApiProperty({ enum: ['seo', 'readability', 'engagement', 'conversion'], description: 'Optimization type' })
    @IsEnum(['seo', 'readability', 'engagement', 'conversion'])
    optimizationType: string;
}

export class ContentRewriteDto {
    @ApiProperty({ description: 'Content to rewrite' })
    @IsString()
    content: string;

    @ApiPropertyOptional({ description: 'Tone for rewrite' })
    @IsOptional()
    @IsString()
    tone?: string;

    @ApiPropertyOptional({ enum: ['shorter', 'longer', 'same'], description: 'Length preference' })
    @IsOptional()
    @IsEnum(['shorter', 'longer', 'same'])
    length?: string;

    @ApiPropertyOptional({ enum: ['formal', 'casual', 'creative', 'technical'], description: 'Writing style' })
    @IsOptional()
    @IsEnum(['formal', 'casual', 'creative', 'technical'])
    style?: string;
}

// SEO Analysis DTOs
export class BulkSEOAnalysisDto {
    @ApiProperty({ type: [String], description: 'Content IDs to analyze' })
    @IsArray()
    @IsString({ each: true })
    contentIds: string[];

    @ApiProperty({ enum: ['basic', 'comprehensive', 'competitive'], description: 'Analysis type' })
    @IsEnum(['basic', 'comprehensive', 'competitive'])
    analysisType: string;
}

export class CompetitiveContentDto {
    @ApiProperty({ description: 'Target keyword' })
    @IsString()
    keyword: string;

    @ApiProperty({ type: [String], description: 'Competitor domains' })
    @IsArray()
    @IsString({ each: true })
    competitors: string[];

    @ApiPropertyOptional({ description: 'Content type filter' })
    @IsOptional()
    @IsString()
    contentType?: string;
}

// Comment and Collaboration DTOs
export class CreateCommentDto {
    @ApiProperty({ description: 'Content ID' })
    @IsUUID()
    contentId: string;

    @ApiProperty({ description: 'Comment text' })
    @IsString()
    comment: string;

    @ApiPropertyOptional({ description: 'Position in content' })
    @IsOptional()
    position?: {
        start: number;
        end: number;
    };
}

export class ContentApprovalDto {
    @ApiProperty({ enum: ['pending', 'approved', 'rejected'], description: 'Approval status' })
    @IsEnum(['pending', 'approved', 'rejected'])
    status: string;

    @ApiPropertyOptional({ description: 'Approval feedback' })
    @IsOptional()
    @IsString()
    feedback?: string;

    @ApiPropertyOptional({ description: 'Approver notes' })
    @IsOptional()
    @IsString()
    approverNotes?: string;
}

// Content Template DTOs
export class CreateTemplateDto {
    @ApiProperty({ description: 'Template name' })
    @IsString()
    name: string;

    @ApiProperty({ enum: ['blog-post', 'landing-page', 'email', 'social-media'], description: 'Template type' })
    @IsEnum(['blog-post', 'landing-page', 'email', 'social-media'])
    type: string;

    @ApiProperty({ description: 'Template content' })
    @IsString()
    template: string;

    @ApiPropertyOptional({ type: [Object], description: 'Template variables' })
    @IsOptional()
    @IsArray()
    variables?: Array<{
        name: string;
        type: 'text' | 'keyword' | 'date' | 'number';
        required: boolean;
    }>;

    @ApiPropertyOptional({ type: [String], description: 'SEO guidelines' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    seoGuidelines?: string[];

    @ApiPropertyOptional({ description: 'Word count range' })
    @IsOptional()
    wordCountRange?: {
        min: number;
        max: number;
    };
}

export class UpdateTemplateDto extends CreateTemplateDto {
    @ApiProperty({ description: 'Template ID' })
    @IsUUID()
    id: string;
}
