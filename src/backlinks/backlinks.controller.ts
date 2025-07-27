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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BacklinksService } from './backlinks.service';
import { CreateBacklinkDto, UpdateBacklinkDto, BacklinkAnalyticsQuery } from './dto/backlink.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Backlinks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/backlinks')
export class BacklinksController {
    constructor(private readonly backlinksService: BacklinksService) { }

    @Post()
    @ApiOperation({ summary: 'Add backlink to project' })
    @ApiResponse({ status: 201, description: 'Backlink added successfully' })
    @ApiResponse({ status: 409, description: 'Backlink already exists' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async createBacklink(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() createBacklinkDto: CreateBacklinkDto,
    ) {
        return this.backlinksService.createBacklink(req.user.id, projectId, createBacklinkDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get project backlinks' })
    @ApiResponse({ status: 200, description: 'Backlinks retrieved successfully' })
    async getProjectBacklinks(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.backlinksService.getProjectBacklinks(req.user.id, projectId, paginationDto);
    }

    @Get('analytics')
    @ApiOperation({ summary: 'Get project backlinks analytics' })
    @ApiResponse({ status: 200, description: 'Backlinks analytics retrieved successfully' })
    async getBacklinkAnalytics(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() query: BacklinkAnalyticsQuery,
    ) {
        return this.backlinksService.getBacklinkAnalytics(req.user.id, projectId, query);
    }

    @Get(':backlinkId')
    @ApiOperation({ summary: 'Get backlink by ID' })
    @ApiResponse({ status: 200, description: 'Backlink retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Backlink not found' })
    async getBacklinkById(
        @Request() req,
        @Param('backlinkId', ParseUUIDPipe) backlinkId: string,
    ) {
        return this.backlinksService.getBacklinkById(req.user.id, backlinkId);
    }

    @Put(':backlinkId')
    @ApiOperation({ summary: 'Update backlink' })
    @ApiResponse({ status: 200, description: 'Backlink updated successfully' })
    @ApiResponse({ status: 404, description: 'Backlink not found' })
    async updateBacklink(
        @Request() req,
        @Param('backlinkId', ParseUUIDPipe) backlinkId: string,
        @Body() updateBacklinkDto: UpdateBacklinkDto,
    ) {
        return this.backlinksService.updateBacklink(req.user.id, backlinkId, updateBacklinkDto);
    }

    @Delete(':backlinkId')
    @ApiOperation({ summary: 'Delete backlink' })
    @ApiResponse({ status: 200, description: 'Backlink deleted successfully' })
    @ApiResponse({ status: 404, description: 'Backlink not found' })
    async deleteBacklink(
        @Request() req,
        @Param('backlinkId', ParseUUIDPipe) backlinkId: string,
    ) {
        return this.backlinksService.deleteBacklink(req.user.id, backlinkId);
    }
}
