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
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    @ApiOperation({ summary: 'Create new project' })
    @ApiResponse({ status: 201, description: 'Project created successfully' })
    @ApiResponse({ status: 403, description: 'Project limit reached' })
    async createProject(@Request() req, @Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(req.user.id, createProjectDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user projects' })
    @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
    async getUserProjects(@Request() req, @Query() paginationDto: PaginationDto) {
        return this.projectsService.getUserProjects(req.user.id, paginationDto);
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
}
