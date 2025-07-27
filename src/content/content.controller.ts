import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    CreateContentDto,
    UpdateContentDto,
    GetContentItemsDto,
    CreateCategoryDto,
    UpdateCategoryDto,
    CreateCalendarItemDto,
    UpdateCalendarItemDto,
    BulkUpdateCalendarDto,
    GetCalendarItemsDto,
    ContentPerformanceDto,
    ContentROIDto,
    AIContentGenerationDto,
    ContentOptimizationDto,
    ContentRewriteDto,
    BulkSEOAnalysisDto,
    CompetitiveContentDto,
    CreateCommentDto,
    ContentApprovalDto,
    CreateTemplateDto,
    UpdateTemplateDto,
} from './dto/content.dto';

@ApiTags('Content Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/projects/:projectId/content')
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    // =============================
    // CONTENT CRUD OPERATIONS
    // =============================

    @Post('items')
    @ApiOperation({ summary: 'Create new content item' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'Content created successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async createContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: CreateContentDto,
    ) {
        return this.contentService.createContent(req.user.id, projectId, dto);
    }

    @Get('items')
    @ApiOperation({ summary: 'Get content items with filters and pagination' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Content items retrieved successfully' })
    async getContentItems(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() dto: GetContentItemsDto,
    ) {
        return this.contentService.getContentItems(req.user.id, projectId, dto);
    }

    @Get('items/:contentId')
    @ApiOperation({ summary: 'Get content item by ID' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'contentId', description: 'Content ID' })
    @ApiResponse({ status: 200, description: 'Content item retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Content not found' })
    async getContentById(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('contentId', ParseUUIDPipe) contentId: string,
    ) {
        return this.contentService.getContentById(req.user.id, projectId, contentId);
    }

    @Put('items/:contentId')
    @ApiOperation({ summary: 'Update content item' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'contentId', description: 'Content ID' })
    @ApiResponse({ status: 200, description: 'Content updated successfully' })
    @ApiResponse({ status: 404, description: 'Content not found' })
    async updateContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('contentId', ParseUUIDPipe) contentId: string,
        @Body(ValidationPipe) dto: UpdateContentDto,
    ) {
        return this.contentService.updateContent(req.user.id, projectId, contentId, dto);
    }

    @Delete('items/:contentId')
    @ApiOperation({ summary: 'Delete content item' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'contentId', description: 'Content ID' })
    @ApiResponse({ status: 200, description: 'Content deleted successfully' })
    @ApiResponse({ status: 404, description: 'Content not found' })
    async deleteContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('contentId', ParseUUIDPipe) contentId: string,
    ) {
        return this.contentService.deleteContent(req.user.id, projectId, contentId);
    }

    // =============================
    // CONTENT CATEGORIES
    // =============================

    @Post('categories')
    @ApiOperation({ summary: 'Create new content category' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    async createCategory(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: CreateCategoryDto,
    ) {
        return this.contentService.createCategory(req.user.id, projectId, dto);
    }

    @Get('categories')
    @ApiOperation({ summary: 'Get all content categories' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
    async getCategories(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.contentService.getCategories(req.user.id, projectId);
    }

    @Put('categories/:categoryId')
    @ApiOperation({ summary: 'Update content category' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'categoryId', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async updateCategory(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
        @Body(ValidationPipe) dto: UpdateCategoryDto,
    ) {
        return this.contentService.updateCategory(req.user.id, projectId, categoryId, dto);
    }

    @Delete('categories/:categoryId')
    @ApiOperation({ summary: 'Delete content category' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'categoryId', description: 'Category ID' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    @ApiResponse({ status: 400, description: 'Cannot delete category with subcategories' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async deleteCategory(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('categoryId', ParseUUIDPipe) categoryId: string,
    ) {
        return this.contentService.deleteCategory(req.user.id, projectId, categoryId);
    }

    // =============================
    // CONTENT CALENDAR
    // =============================

    @Post('calendar/items')
    @ApiOperation({ summary: 'Create new calendar item' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'Calendar item created successfully' })
    async createCalendarItem(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: CreateCalendarItemDto,
    ) {
        return this.contentService.createCalendarItem(req.user.id, projectId, dto);
    }

    @Get('calendar/items')
    @ApiOperation({ summary: 'Get calendar items with filters' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Calendar items retrieved successfully' })
    async getCalendarItems(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() dto: GetCalendarItemsDto,
    ) {
        return this.contentService.getCalendarItems(req.user.id, projectId, dto);
    }

    @Put('calendar/items/:itemId')
    @ApiOperation({ summary: 'Update calendar item' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'itemId', description: 'Calendar item ID' })
    @ApiResponse({ status: 200, description: 'Calendar item updated successfully' })
    @ApiResponse({ status: 404, description: 'Calendar item not found' })
    async updateCalendarItem(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('itemId', ParseUUIDPipe) itemId: string,
        @Body(ValidationPipe) dto: UpdateCalendarItemDto,
    ) {
        return this.contentService.updateCalendarItem(req.user.id, projectId, itemId, dto);
    }

    @Post('calendar/bulk-update')
    @ApiOperation({ summary: 'Bulk update calendar items' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Calendar items updated successfully' })
    async bulkUpdateCalendarItems(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: BulkUpdateCalendarDto,
    ) {
        return this.contentService.bulkUpdateCalendarItems(req.user.id, projectId, dto);
    }

    @Delete('calendar/items/:itemId')
    @ApiOperation({ summary: 'Delete calendar item' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'itemId', description: 'Calendar item ID' })
    @ApiResponse({ status: 200, description: 'Calendar item deleted successfully' })
    @ApiResponse({ status: 404, description: 'Calendar item not found' })
    async deleteCalendarItem(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('itemId', ParseUUIDPipe) itemId: string,
    ) {
        return this.contentService.deleteCalendarItem(req.user.id, projectId, itemId);
    }

    // =============================
    // CONTENT PERFORMANCE & ANALYTICS
    // =============================

    @Get('analytics/performance')
    @ApiOperation({ summary: 'Get content performance analytics' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Performance analytics retrieved successfully' })
    async getContentPerformance(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() dto: ContentPerformanceDto,
    ) {
        return this.contentService.getContentPerformance(req.user.id, projectId, dto);
    }

    @Get('analytics/roi')
    @ApiOperation({ summary: 'Get content ROI analytics' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'ROI analytics retrieved successfully' })
    async getContentROI(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() dto: ContentROIDto,
    ) {
        return this.contentService.getContentROI(req.user.id, projectId, dto);
    }

    // =============================
    // CONTENT TEMPLATES
    // =============================

    @Post('templates')
    @ApiOperation({ summary: 'Create new content template' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'Template created successfully' })
    async createTemplate(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: CreateTemplateDto,
    ) {
        return this.contentService.createTemplate(req.user.id, projectId, dto);
    }

    @Get('templates')
    @ApiOperation({ summary: 'Get all content templates' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
    async getTemplates(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.contentService.getTemplates(req.user.id, projectId);
    }

    @Put('templates/:templateId')
    @ApiOperation({ summary: 'Update content template' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'templateId', description: 'Template ID' })
    @ApiResponse({ status: 200, description: 'Template updated successfully' })
    @ApiResponse({ status: 404, description: 'Template not found' })
    async updateTemplate(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('templateId', ParseUUIDPipe) templateId: string,
        @Body(ValidationPipe) dto: UpdateTemplateDto,
    ) {
        return this.contentService.updateTemplate(req.user.id, projectId, templateId, dto);
    }

    @Delete('templates/:templateId')
    @ApiOperation({ summary: 'Delete content template' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'templateId', description: 'Template ID' })
    @ApiResponse({ status: 200, description: 'Template deleted successfully' })
    @ApiResponse({ status: 404, description: 'Template not found' })
    async deleteTemplate(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('templateId', ParseUUIDPipe) templateId: string,
    ) {
        return this.contentService.deleteTemplate(req.user.id, projectId, templateId);
    }

    // =============================
    // AI CONTENT GENERATION & OPTIMIZATION
    // =============================

    @Post('ai/generate')
    @ApiOperation({ summary: 'Generate content using AI' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'Content generated successfully' })
    async generateAIContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: AIContentGenerationDto,
    ) {
        return this.contentService.generateAIContent(req.user.id, projectId, dto);
    }

    @Post('ai/optimize')
    @ApiOperation({ summary: 'Optimize content using AI' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Content optimized successfully' })
    async optimizeContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: ContentOptimizationDto,
    ) {
        return this.contentService.optimizeContent(req.user.id, projectId, dto);
    }

    @Post('ai/rewrite')
    @ApiOperation({ summary: 'Rewrite content using AI' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Content rewritten successfully' })
    async rewriteContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: ContentRewriteDto,
    ) {
        return this.contentService.rewriteContent(req.user.id, projectId, dto);
    }

    // =============================
    // SEO ANALYSIS
    // =============================

    @Post('seo/bulk-analyze')
    @ApiOperation({ summary: 'Perform bulk SEO analysis on content' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'SEO analysis completed successfully' })
    async bulkSEOAnalysis(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: BulkSEOAnalysisDto,
    ) {
        return this.contentService.bulkSEOAnalysis(req.user.id, projectId, dto);
    }

    @Get('seo/competitive-analysis')
    @ApiOperation({ summary: 'Get competitive content analysis' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Competitive analysis retrieved successfully' })
    async competitiveContentAnalysis(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() dto: CompetitiveContentDto,
    ) {
        return this.contentService.competitiveContentAnalysis(req.user.id, projectId, dto);
    }

    // =============================
    // COLLABORATION FEATURES
    // =============================

    @Post('collaboration/comments')
    @ApiOperation({ summary: 'Add comment to content' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiResponse({ status: 201, description: 'Comment added successfully' })
    async createComment(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body(ValidationPipe) dto: CreateCommentDto,
    ) {
        return this.contentService.createComment(req.user.id, projectId, dto);
    }

    @Get('collaboration/comments/:contentId')
    @ApiOperation({ summary: 'Get comments for content' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'contentId', description: 'Content ID' })
    @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
    async getContentComments(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('contentId', ParseUUIDPipe) contentId: string,
    ) {
        return this.contentService.getContentComments(req.user.id, projectId, contentId);
    }

    @Put('approval/:contentId')
    @ApiOperation({ summary: 'Approve or reject content' })
    @ApiParam({ name: 'projectId', description: 'Project ID' })
    @ApiParam({ name: 'contentId', description: 'Content ID' })
    @ApiResponse({ status: 200, description: 'Content approval status updated' })
    async approveContent(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Param('contentId', ParseUUIDPipe) contentId: string,
        @Body(ValidationPipe) dto: ContentApprovalDto,
    ) {
        return this.contentService.approveContent(req.user.id, projectId, contentId, dto);
    }
}
