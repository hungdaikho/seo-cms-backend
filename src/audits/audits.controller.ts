import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuditsService } from './audits.service';
import { CreateAuditDto } from './dto/audit.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Audits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/audits')
export class AuditsController {
    constructor(private readonly auditsService: AuditsService) { }

    @Post()
    @ApiOperation({ summary: 'Start new SEO audit for project' })
    @ApiResponse({ status: 201, description: 'Audit started successfully' })
    @ApiResponse({ status: 403, description: 'Audit limit reached' })
    async createAudit(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() createAuditDto: CreateAuditDto,
    ) {
        return this.auditsService.createAudit(req.user.id, projectId, createAuditDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get project audits' })
    @ApiResponse({ status: 200, description: 'Audits retrieved successfully' })
    async getProjectAudits(
        @Request() req,
        @Param('projectId') projectId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.auditsService.getProjectAudits(req.user.id, projectId, paginationDto);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get audit summary for project' })
    @ApiResponse({ status: 200, description: 'Audit summary retrieved successfully' })
    async getAuditSummary(@Request() req, @Param('projectId') projectId: string) {
        return this.auditsService.getAuditSummary(req.user.id, projectId);
    }
}

@ApiTags('Audits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audits')
export class AuditController {
    constructor(private readonly auditsService: AuditsService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get audit by ID' })
    @ApiResponse({ status: 200, description: 'Audit retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Audit not found' })
    async getAuditById(@Request() req, @Param('id') auditId: string) {
        return this.auditsService.getAuditById(req.user.id, auditId);
    }

    @Get(':id/results')
    @ApiOperation({ summary: 'Get audit results' })
    @ApiResponse({ status: 200, description: 'Audit results retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Audit not completed' })
    async getAuditResults(@Request() req, @Param('id') auditId: string) {
        return this.auditsService.getAuditResults(req.user.id, auditId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete audit' })
    @ApiResponse({ status: 200, description: 'Audit deleted successfully' })
    @ApiResponse({ status: 400, description: 'Cannot delete running audit' })
    async deleteAudit(@Request() req, @Param('id') auditId: string) {
        return this.auditsService.deleteAudit(req.user.id, auditId);
    }
}
