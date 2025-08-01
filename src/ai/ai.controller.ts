import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    AIRequestDto,
    KeywordResearchDto,
    ContentOptimizationDto,
    MetaGenerationDto,
    ContentIdeasDto,
    CompetitorAnalysisDto,
    SEOAuditDto,
    KeywordResearchResponse,
    ContentOptimizationResponse,
    MetaTagsResponse,
    ContentIdeasResponse,
    CompetitorAnalysisResponse,
    SEOAuditResponse,
    AIRequestType,
    // Advanced Content Generation DTOs
    BlogOutlineDto,
    ProductDescriptionDto,
    SocialMediaContentDto,
    ContentRewriteDto,
    ContentExpansionDto,
    // Advanced SEO Analysis DTOs
    CompetitorContentAnalysisDto,
    ContentOptimizationSuggestionsDto,
    SchemaMarkupGenerationDto,
    // Advanced Keyword Research DTOs
    LongTailKeywordsDto,
    QuestionBasedKeywordsDto,
    SeasonalKeywordTrendsDto,
    KeywordMagicToolDto,
    KeywordSuggestionsDto,
    // AI Analytics DTOs
    ContentPerformancePredictionDto,
    AIUsageAnalyticsDto,
    // AI Tools Management DTOs
    AIToolUsageDto,
    AITemplateDto,
    AIWorkflowDto,
    // Response DTOs
    BlogOutlineResponse,
    ProductDescriptionResponse,
    SocialMediaContentResponse,
    ContentRewriteResponse,
    ContentExpansionResponse,
    CompetitorContentAnalysisResponse,
    ContentOptimizationSuggestionsResponse,
    SchemaMarkupResponse,
    LongTailKeywordsResponse,
    QuestionBasedKeywordsResponse,
    SeasonalKeywordTrendsResponse,
    KeywordMagicToolResponse,
    KeywordSuggestionsResponse,
    ContentPerformancePredictionResponse,
    AIUsageAnalyticsResponse,
    AIToolUsageResponse,
    AITool,
    AITemplate,
    AIWorkflow,
} from './dto/ai.dto';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('keyword-research')
    @ApiOperation({ summary: 'Generate keyword research using AI' })
    @ApiResponse({ status: 201, description: 'Keywords generated successfully', type: KeywordResearchResponse })
    async keywordResearch(
        @Request() req,
        @Body() dto: KeywordResearchDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.KEYWORD_RESEARCH,
            dto,
            projectId
        );
    }

    @Post('content-optimization')
    @ApiOperation({ summary: 'Optimize content for SEO using AI' })
    @ApiResponse({ status: 201, description: 'Content optimized successfully', type: ContentOptimizationResponse })
    async contentOptimization(
        @Request() req,
        @Body() dto: ContentOptimizationDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.CONTENT_OPTIMIZATION,
            dto,
            projectId
        );
    }

    @Post('meta-generation')
    @ApiOperation({ summary: 'Generate meta tags using AI' })
    @ApiResponse({ status: 201, description: 'Meta tags generated successfully', type: MetaTagsResponse })
    async metaGeneration(
        @Request() req,
        @Body() dto: MetaGenerationDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.META_GENERATION,
            dto,
            projectId
        );
    }

    @Post('content-ideas')
    @ApiOperation({ summary: 'Generate content ideas using AI' })
    @ApiResponse({ status: 201, description: 'Content ideas generated successfully', type: ContentIdeasResponse })
    async contentIdeas(
        @Request() req,
        @Body() dto: ContentIdeasDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.CONTENT_IDEAS,
            dto,
            projectId
        );
    }

    @Post('competitor-analysis')
    @ApiOperation({ summary: 'Analyze competitors using AI' })
    @ApiResponse({ status: 201, description: 'Competitor analysis completed successfully', type: CompetitorAnalysisResponse })
    async competitorAnalysis(
        @Request() req,
        @Body() dto: CompetitorAnalysisDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.COMPETITOR_ANALYSIS,
            dto,
            projectId
        );
    }

    @Post('seo-audit')
    @ApiOperation({ summary: 'Perform SEO audit using AI' })
    @ApiResponse({ status: 201, description: 'SEO audit completed successfully', type: SEOAuditResponse })
    async seoAudit(
        @Request() req,
        @Body() dto: SEOAuditDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.SEO_AUDIT,
            dto,
            projectId
        );
    }

    @Post('request')
    @ApiOperation({ summary: 'Make a generic AI request' })
    @ApiResponse({ status: 201, description: 'AI request processed successfully' })
    async makeAIRequest(
        @Request() req,
        @Body() dto: AIRequestDto
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            dto.type,
            dto.parameters,
            dto.projectId
        );
    }

    @Get('requests')
    @ApiOperation({ summary: 'Get user AI requests history' })
    @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
    @ApiResponse({ status: 200, description: 'List of AI requests' })
    async getUserAIRequests(
        @Request() req,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.getUserAIRequests(req.user.id, projectId);
    }

    @Get('requests/:id')
    @ApiOperation({ summary: 'Get AI request by ID' })
    @ApiResponse({ status: 200, description: 'AI request details' })
    async getAIRequestById(
        @Request() req,
        @Param('id', ParseUUIDPipe) requestId: string
    ) {
        return this.aiService.getAIRequestById(req.user.id, requestId);
    }

    // =============================
    // ADVANCED CONTENT GENERATION ENDPOINTS
    // =============================

    @Post('content/blog-outline')
    @ApiOperation({ summary: 'Generate blog post outline using AI' })
    @ApiResponse({ status: 201, description: 'Blog outline generated successfully', type: BlogOutlineResponse })
    async generateBlogOutline(
        @Request() req,
        @Body() dto: BlogOutlineDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.BLOG_OUTLINE,
            dto,
            projectId
        );
    }

    @Post('content/product-description')
    @ApiOperation({ summary: 'Generate product descriptions using AI' })
    @ApiResponse({ status: 201, description: 'Product description generated successfully', type: ProductDescriptionResponse })
    async generateProductDescription(
        @Request() req,
        @Body() dto: ProductDescriptionDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.PRODUCT_DESCRIPTION,
            dto,
            projectId
        );
    }

    @Post('content/social-media')
    @ApiOperation({ summary: 'Generate social media content using AI' })
    @ApiResponse({ status: 201, description: 'Social media content generated successfully', type: SocialMediaContentResponse })
    async generateSocialMediaContent(
        @Request() req,
        @Body() dto: SocialMediaContentDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.SOCIAL_MEDIA,
            dto,
            projectId
        );
    }

    @Post('content/rewrite')
    @ApiOperation({ summary: 'Rewrite content using AI' })
    @ApiResponse({ status: 201, description: 'Content rewritten successfully', type: ContentRewriteResponse })
    async rewriteContent(
        @Request() req,
        @Body() dto: ContentRewriteDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.CONTENT_REWRITE,
            dto,
            projectId
        );
    }

    @Post('content/expand')
    @ApiOperation({ summary: 'Expand content using AI' })
    @ApiResponse({ status: 201, description: 'Content expanded successfully', type: ContentExpansionResponse })
    async expandContent(
        @Request() req,
        @Body() dto: ContentExpansionDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.CONTENT_EXPANSION,
            dto,
            projectId
        );
    }

    // =============================
    // ADVANCED SEO ANALYSIS ENDPOINTS
    // =============================

    @Post('seo/competitor-content-analysis')
    @ApiOperation({ summary: 'Analyze competitor content using AI' })
    @ApiResponse({ status: 201, description: 'Competitor content analysis completed successfully', type: CompetitorContentAnalysisResponse })
    async analyzeCompetitorContent(
        @Request() req,
        @Body() dto: CompetitorContentAnalysisDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.COMPETITOR_CONTENT_ANALYSIS,
            dto,
            projectId
        );
    }

    @Post('seo/optimization-suggestions')
    @ApiOperation({ summary: 'Get content optimization suggestions using AI' })
    @ApiResponse({ status: 201, description: 'Content optimization suggestions generated successfully', type: ContentOptimizationSuggestionsResponse })
    async getContentOptimizationSuggestions(
        @Request() req,
        @Body() dto: ContentOptimizationSuggestionsDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.CONTENT_OPTIMIZATION_SUGGESTIONS,
            dto,
            projectId
        );
    }

    @Post('seo/schema-generation')
    @ApiOperation({ summary: 'Generate schema markup using AI' })
    @ApiResponse({ status: 201, description: 'Schema markup generated successfully', type: SchemaMarkupResponse })
    async generateSchemaMarkup(
        @Request() req,
        @Body() dto: SchemaMarkupGenerationDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.SCHEMA_MARKUP_GENERATION,
            dto,
            projectId
        );
    }

    @Post('seo/keyword-suggestions')
    @ApiOperation({ summary: 'Generate AI-powered keyword suggestions based on a seed keyword' })
    @ApiResponse({ status: 201, description: 'Keyword suggestions generated successfully', type: KeywordSuggestionsResponse })
    async generateKeywordSuggestions(
        @Request() req,
        @Body() dto: KeywordSuggestionsDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.KEYWORD_SUGGESTIONS,
            dto,
            projectId
        );
    }

    // =============================
    // ADVANCED KEYWORD RESEARCH ENDPOINTS
    // =============================

    @Post('keywords/long-tail')
    @ApiOperation({ summary: 'Generate long-tail keywords using AI' })
    @ApiResponse({ status: 201, description: 'Long-tail keywords generated successfully', type: LongTailKeywordsResponse })
    async generateLongTailKeywords(
        @Request() req,
        @Body() dto: LongTailKeywordsDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.LONG_TAIL_KEYWORDS,
            dto,
            projectId
        );
    }

    @Post('keywords/questions')
    @ApiOperation({ summary: 'Generate question-based keywords using AI' })
    @ApiResponse({ status: 201, description: 'Question-based keywords generated successfully', type: QuestionBasedKeywordsResponse })
    async generateQuestionBasedKeywords(
        @Request() req,
        @Body() dto: QuestionBasedKeywordsDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.QUESTION_BASED_KEYWORDS,
            dto,
            projectId
        );
    }

    @Post('keywords/seasonal-trends')
    @ApiOperation({ summary: 'Analyze seasonal keyword trends using AI' })
    @ApiResponse({ status: 201, description: 'Seasonal keyword trends analyzed successfully', type: SeasonalKeywordTrendsResponse })
    async analyzeSeasonalKeywordTrends(
        @Request() req,
        @Body() dto: SeasonalKeywordTrendsDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.SEASONAL_KEYWORD_TRENDS,
            dto,
            projectId
        );
    }

    @Post('keywords/magic-tool')
    @ApiOperation({ summary: 'Comprehensive keyword research using AI Magic Tool' })
    @ApiResponse({ status: 201, description: 'Keyword magic tool analysis completed successfully', type: KeywordMagicToolResponse })
    async keywordMagicTool(
        @Request() req,
        @Body() dto: KeywordMagicToolDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.KEYWORD_MAGIC_TOOL,
            dto,
            projectId
        );
    }

    // =============================
    // AI ANALYTICS ENDPOINTS
    // =============================

    @Post('analytics/content-prediction')
    @ApiOperation({ summary: 'Predict content performance using AI' })
    @ApiResponse({ status: 201, description: 'Content performance predicted successfully', type: ContentPerformancePredictionResponse })
    async predictContentPerformance(
        @Request() req,
        @Body() dto: ContentPerformancePredictionDto,
        @Query('projectId') projectId?: string
    ) {
        return this.aiService.processAIRequest(
            req.user.id,
            AIRequestType.CONTENT_PERFORMANCE_PREDICTION,
            dto,
            projectId
        );
    }

    @Get('analytics/usage')
    @ApiOperation({ summary: 'Get AI usage analytics' })
    @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
    @ApiQuery({ name: 'period', required: false, description: 'Time period', enum: ['day', 'week', 'month', 'quarter', 'year'] })
    @ApiQuery({ name: 'userId', required: false, description: 'User ID filter' })
    @ApiResponse({ status: 200, description: 'AI usage analytics', type: AIUsageAnalyticsResponse })
    async getAIUsageAnalytics(
        @Request() req,
        @Query('projectId') projectId: string,
        @Query('period') period?: 'day' | 'week' | 'month' | 'quarter' | 'year',
        @Query('userId') userId?: string
    ) {
        const dto: AIUsageAnalyticsDto = {
            period: period || 'month',
            userId: userId || req.user.id,
        };
        return this.aiService.getAIUsageAnalytics(req.user.id, projectId, dto);
    }

    // =============================
    // AI TOOLS MANAGEMENT ENDPOINTS
    // =============================

    @Get('tools')
    @ApiOperation({ summary: 'Get available AI tools' })
    @ApiQuery({ name: 'category', required: false, description: 'Tool category filter' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Active status filter' })
    @ApiResponse({ status: 200, description: 'List of available AI tools', type: [AITool] })
    async getAvailableAITools(
        @Query('category') category?: 'content' | 'seo' | 'analysis' | 'research' | 'optimization',
        @Query('isActive') isActive?: boolean
    ) {
        return this.aiService.getAvailableAITools(category, isActive);
    }

    @Get('tools/:toolId/usage')
    @ApiOperation({ summary: 'Get tool usage statistics' })
    @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Tool usage statistics', type: AIToolUsageResponse })
    async getToolUsageStatistics(
        @Request() req,
        @Param('toolId') toolId: string,
        @Query('projectId') projectId: string
    ) {
        return this.aiService.getAIToolUsage(req.user.id, projectId, toolId);
    }

    @Post('tools/:toolId/usage')
    @ApiOperation({ summary: 'Update tool usage' })
    @ApiResponse({ status: 201, description: 'Tool usage updated successfully' })
    async updateToolUsage(
        @Request() req,
        @Param('toolId') toolId: string,
        @Body() dto: Omit<AIToolUsageDto, 'toolId'>,
        @Query('projectId') projectId?: string
    ) {
        const usageDto: AIToolUsageDto = { ...dto, toolId };
        return this.aiService.trackAIToolUsage(req.user.id, projectId || '', usageDto);
    }

    // =============================
    // AI TEMPLATES ENDPOINTS
    // =============================

    @Post('templates')
    @ApiOperation({ summary: 'Create AI template' })
    @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'AI template created successfully', type: AITemplate })
    async createAITemplate(
        @Request() req,
        @Body() dto: AITemplateDto,
        @Query('projectId') projectId: string
    ) {
        return this.aiService.createAITemplate(req.user.id, projectId, dto);
    }

    @Get('templates')
    @ApiOperation({ summary: 'Get AI templates' })
    @ApiQuery({ name: 'projectId', required: false, description: 'Project ID filter' })
    @ApiQuery({ name: 'toolId', required: false, description: 'Tool ID filter' })
    @ApiQuery({ name: 'isShared', required: false, description: 'Shared status filter' })
    @ApiResponse({ status: 200, description: 'List of AI templates', type: [AITemplate] })
    async getAITemplates(
        @Request() req,
        @Query('projectId') projectId?: string,
        @Query('toolId') toolId?: string,
        @Query('isShared') isShared?: boolean
    ) {
        return this.aiService.getAITemplates(req.user.id, projectId, toolId, isShared);
    }

    // =============================
    // AI WORKFLOWS ENDPOINTS
    // =============================

    @Post('workflows')
    @ApiOperation({ summary: 'Create AI workflow' })
    @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'AI workflow created successfully', type: AIWorkflow })
    async createAIWorkflow(
        @Request() req,
        @Body() dto: AIWorkflowDto,
        @Query('projectId') projectId: string
    ) {
        return this.aiService.createAIWorkflow(req.user.id, projectId, dto);
    }

    @Get('workflows')
    @ApiOperation({ summary: 'Get AI workflows' })
    @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'List of AI workflows', type: [AIWorkflow] })
    async getAIWorkflows(
        @Request() req,
        @Query('projectId') projectId: string
    ) {
        return this.aiService.getAIWorkflows(req.user.id, projectId);
    }

    @Post('workflows/:workflowId/execute')
    @ApiOperation({ summary: 'Execute AI workflow' })
    @ApiQuery({ name: 'projectId', required: true, description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'AI workflow execution started successfully' })
    async executeAIWorkflow(
        @Request() req,
        @Param('workflowId') workflowId: string,
        @Body() body: { initialInput: any },
        @Query('projectId') projectId: string
    ) {
        return this.aiService.executeAIWorkflow(req.user.id, projectId, workflowId, body.initialInput);
    }
}
