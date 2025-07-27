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
    ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    CreateReportDto,
    GenerateReportDto,
    ReportResponse
} from './dto/report.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new report' })
    @ApiResponse({ status: 201, description: 'Report created successfully', type: ReportResponse })
    async createReport(
        @Request() req,
        @Body() createDto: CreateReportDto
    ) {
        return this.reportsService.createReport(req.user.id, createDto);
    }

    @Post('generate')
    @ApiOperation({ summary: 'Generate a report with data' })
    @ApiResponse({ status: 201, description: 'Report generated successfully', type: ReportResponse })
    async generateReport(
        @Request() req,
        @Body() generateDto: GenerateReportDto
    ) {
        return this.reportsService.generateReport(req.user.id, generateDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user reports' })
    @ApiQuery({ name: 'projectId', required: false, description: 'Filter by project ID' })
    @ApiResponse({ status: 200, description: 'List of reports', type: [ReportResponse] })
    async getUserReports(
        @Request() req,
        @Query('projectId') projectId?: string
    ) {
        return this.reportsService.getUserReports(req.user.id, projectId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get report by ID' })
    @ApiResponse({ status: 200, description: 'Report details', type: ReportResponse })
    async getReportById(
        @Request() req,
        @Param('id', ParseUUIDPipe) reportId: string
    ) {
        return this.reportsService.getReportById(req.user.id, reportId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete report' })
    @ApiResponse({ status: 200, description: 'Report deleted successfully' })
    async deleteReport(
        @Request() req,
        @Param('id', ParseUUIDPipe) reportId: string
    ) {
        return this.reportsService.deleteReport(req.user.id, reportId);
    }
}
