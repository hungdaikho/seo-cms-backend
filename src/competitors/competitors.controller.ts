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
import { CompetitorsService } from './competitors.service';
import { CreateCompetitorDto, UpdateCompetitorDto } from './dto/competitor.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Competitors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/competitors')
export class CompetitorsController {
    constructor(private readonly competitorsService: CompetitorsService) { }

    @Post()
    @ApiOperation({ summary: 'Add competitor to project' })
    @ApiResponse({ status: 201, description: 'Competitor added successfully' })
    @ApiResponse({ status: 403, description: 'Competitor already exists' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async createCompetitor(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Body() createCompetitorDto: CreateCompetitorDto,
    ) {
        return this.competitorsService.createCompetitor(req.user.id, projectId, createCompetitorDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get project competitors' })
    @ApiResponse({ status: 200, description: 'Competitors retrieved successfully' })
    async getProjectCompetitors(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.competitorsService.getProjectCompetitors(req.user.id, projectId, paginationDto);
    }

    @Get(':competitorId')
    @ApiOperation({ summary: 'Get competitor by ID' })
    @ApiResponse({ status: 200, description: 'Competitor retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Competitor not found' })
    async getCompetitorById(
        @Request() req,
        @Param('competitorId', ParseUUIDPipe) competitorId: string,
    ) {
        return this.competitorsService.getCompetitorById(req.user.id, competitorId);
    }

    @Put(':competitorId')
    @ApiOperation({ summary: 'Update competitor' })
    @ApiResponse({ status: 200, description: 'Competitor updated successfully' })
    @ApiResponse({ status: 404, description: 'Competitor not found' })
    async updateCompetitor(
        @Request() req,
        @Param('competitorId', ParseUUIDPipe) competitorId: string,
        @Body() updateCompetitorDto: UpdateCompetitorDto,
    ) {
        return this.competitorsService.updateCompetitor(req.user.id, competitorId, updateCompetitorDto);
    }

    @Delete(':competitorId')
    @ApiOperation({ summary: 'Delete competitor' })
    @ApiResponse({ status: 200, description: 'Competitor deleted successfully' })
    @ApiResponse({ status: 404, description: 'Competitor not found' })
    async deleteCompetitor(
        @Request() req,
        @Param('competitorId', ParseUUIDPipe) competitorId: string,
    ) {
        return this.competitorsService.deleteCompetitor(req.user.id, competitorId);
    }
}
