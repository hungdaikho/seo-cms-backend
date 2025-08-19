import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, SearchSharedProjectsDto, ApplyToProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @ApiOperation({
        summary: 'Create new project',
        description: 'Create a new SEO project. You can optionally include keywords in settings.keyWordsArray to create them automatically with the project.'
    })
    @ApiResponse({ status: 201, description: 'Project created successfully (keywords created if provided)' })
    @ApiResponse({ status: 403, description: 'Project limit reached' })
    async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(req.user.id, createProjectDto);
    }

    @Get()
    @ApiOperation({
        summary: 'Get user projects',
        description: 'Get all projects accessible by user (owned + applied). For backward compatibility, returns only owned projects if no applied projects exist.'
    })
    @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
    async getUserProjects(@Request() req, @Query() paginationDto: PaginationDto) {
        return this.projectsService.getUserProjects(req.user.id, paginationDto);
    }

    @Get('owned')
    @ApiOperation({
        summary: 'Get owned projects only',
        description: 'Get only projects owned by the user (original behavior)'
    })
    @ApiResponse({ status: 200, description: 'Owned projects retrieved successfully' })
    async getOwnedProjects(@Request() req, @Query() paginationDto: PaginationDto) {
        return this.projectsService.getOwnedProjects(req.user.id, paginationDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get project by ID' })
    @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async getProjectById(@Request() req, @Param('id', ParseUUIDPipe) projectId: string) {
        return this.projectsService.getProjectById(req.user.id, projectId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update project' })
    @ApiResponse({ status: 200, description: 'Project updated successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async updateProject(
        @Request() req,
        @Param('id', ParseUUIDPipe) projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectsService.updateProject(req.user.id, projectId, updateProjectDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete project' })
    @ApiResponse({ status: 200, description: 'Project deleted successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async deleteProject(@Request() req, @Param('id', ParseUUIDPipe) projectId: string) {
        return this.projectsService.deleteProject(req.user.id, projectId);
    }

    @Get(':id/stats')
    @ApiOperation({ summary: 'Get project statistics' })
    @ApiResponse({ status: 200, description: 'Project stats retrieved successfully' })
    async getProjectStats(@Request() req, @Param('id', ParseUUIDPipe) projectId: string) {
        return this.projectsService.getProjectStats(req.user.id, projectId);
    }

    // =============================
    // PROJECT SHARING FEATURES
    // =============================

    @Get('shared/search')
    @ApiOperation({
        summary: 'Search shared projects',
        description: 'Search for publicly shared projects that you can apply to'
    })
    @ApiResponse({ status: 200, description: 'Shared projects retrieved successfully' })
    async searchSharedProjects(@Request() req, @Query() searchDto: SearchSharedProjectsDto) {
        return this.projectsService.searchSharedProjects(req.user.id, searchDto);
    }

    @Post('shared/apply')
    @ApiOperation({
        summary: 'Apply to a shared project',
        description: 'Apply to join a shared project using its share code'
    })
    @ApiResponse({ status: 201, description: 'Successfully applied to project' })
    @ApiResponse({ status: 404, description: 'Project not found or not shared' })
    @ApiResponse({ status: 409, description: 'Already applied to this project' })
    async applyToProject(@Request() req, @Body() applyDto: ApplyToProjectDto) {
        return this.projectsService.applyToProject(req.user.id, applyDto);
    }

    @Get('applied')
    @ApiOperation({
        summary: 'Get applied projects',
        description: 'Get list of projects that user has applied to'
    })
    @ApiResponse({ status: 200, description: 'Applied projects retrieved successfully' })
    async getAppliedProjects(@Request() req, @Query() paginationDto: PaginationDto) {
        return this.projectsService.getAppliedProjects(req.user.id, paginationDto);
    }

    @Delete('applied/:projectId')
    @ApiOperation({
        summary: 'Leave applied project',
        description: 'Leave a project that you have applied to'
    })
    @ApiResponse({ status: 200, description: 'Successfully left the project' })
    @ApiResponse({ status: 404, description: 'Project membership not found' })
    async leaveProject(@Request() req, @Param('projectId', ParseUUIDPipe) projectId: string) {
        return this.projectsService.leaveProject(req.user.id, projectId);
    }

    @Patch(':id/sharing')
    @ApiOperation({
        summary: 'Toggle project sharing',
        description: 'Enable or disable sharing for a project'
    })
    @ApiResponse({ status: 200, description: 'Project sharing settings updated' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async toggleProjectSharing(
        @Request() req,
        @Param('id', ParseUUIDPipe) projectId: string,
        @Body() updateDto: { isShared: boolean }
    ) {
        return this.projectsService.toggleProjectSharing(req.user.id, projectId, updateDto.isShared);
    }

    @Get(':id/members')
    @ApiOperation({
        summary: 'Get project members',
        description: 'Get list of users who have applied to this project'
    })
    @ApiResponse({ status: 200, description: 'Project members retrieved successfully' })
    async getProjectMembers(@Request() req, @Param('id', ParseUUIDPipe) projectId: string) {
        return this.projectsService.getProjectMembers(req.user.id, projectId);
    }

    @Delete(':id/members/:memberId')
    @ApiOperation({
        summary: 'Remove project member',
        description: 'Remove a member from your project'
    })
    @ApiResponse({ status: 200, description: 'Member removed successfully' })
    @ApiResponse({ status: 404, description: 'Member not found' })
    async removeProjectMember(
        @Request() req,
        @Param('id', ParseUUIDPipe) projectId: string,
        @Param('memberId', ParseUUIDPipe) memberId: string
    ) {
        return this.projectsService.removeProjectMember(req.user.id, projectId, memberId);
    }
}
