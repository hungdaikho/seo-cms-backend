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
    AIRequestType
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
}
