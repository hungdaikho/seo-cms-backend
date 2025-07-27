import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    CreateIntegrationDto,
    UpdateIntegrationDto,
    GoogleSearchConsoleConnectDto,
    GoogleAnalyticsConnectDto,
    SyncIntegrationDto,
    IntegrationResponse,
    GSCDataResponse
} from './dto/integration.dto';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
    constructor(private readonly integrationsService: IntegrationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new integration' })
    @ApiResponse({ status: 201, description: 'Integration created successfully', type: IntegrationResponse })
    async createIntegration(
        @Request() req,
        @Body() createDto: CreateIntegrationDto
    ) {
        return this.integrationsService.createIntegration(req.user.id, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user integrations' })
    @ApiResponse({ status: 200, description: 'List of integrations', type: [IntegrationResponse] })
    async getUserIntegrations(@Request() req) {
        return this.integrationsService.getUserIntegrations(req.user.id);
    }

    @Get('auth/google')
    @ApiOperation({ summary: 'Get Google OAuth URL for authentication' })
    @ApiResponse({ status: 200, description: 'Google OAuth URL' })
    async getGoogleAuthUrl() {
        return this.integrationsService.getGoogleAuthUrl();
    }

    @Post('google/search-console')
    @ApiOperation({ summary: 'Connect Google Search Console' })
    @ApiResponse({ status: 201, description: 'GSC connected successfully', type: IntegrationResponse })
    async connectGoogleSearchConsole(
        @Request() req,
        @Body() connectDto: GoogleSearchConsoleConnectDto
    ) {
        return this.integrationsService.connectGoogleSearchConsole(req.user.id, connectDto);
    }

    @Post('google/analytics')
    @ApiOperation({ summary: 'Connect Google Analytics' })
    @ApiResponse({ status: 201, description: 'GA connected successfully', type: IntegrationResponse })
    async connectGoogleAnalytics(
        @Request() req,
        @Body() connectDto: GoogleAnalyticsConnectDto
    ) {
        return this.integrationsService.connectGoogleAnalytics(req.user.id, connectDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get integration by ID' })
    @ApiResponse({ status: 200, description: 'Integration details', type: IntegrationResponse })
    async getIntegrationById(
        @Request() req,
        @Param('id', ParseUUIDPipe) integrationId: string
    ) {
        return this.integrationsService.getIntegrationById(req.user.id, integrationId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update integration' })
    @ApiResponse({ status: 200, description: 'Integration updated successfully', type: IntegrationResponse })
    async updateIntegration(
        @Request() req,
        @Param('id', ParseUUIDPipe) integrationId: string,
        @Body() updateDto: UpdateIntegrationDto
    ) {
        return this.integrationsService.updateIntegration(req.user.id, integrationId, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete integration' })
    @ApiResponse({ status: 200, description: 'Integration deleted successfully' })
    async deleteIntegration(
        @Request() req,
        @Param('id', ParseUUIDPipe) integrationId: string
    ) {
        return this.integrationsService.deleteIntegration(req.user.id, integrationId);
    }

    @Post(':id/sync')
    @ApiOperation({ summary: 'Sync data from integration' })
    @ApiResponse({ status: 200, description: 'Data synced successfully' })
    async syncIntegrationData(
        @Request() req,
        @Param('id', ParseUUIDPipe) integrationId: string,
        @Body() syncDto: SyncIntegrationDto
    ) {
        return this.integrationsService.syncIntegrationData(req.user.id, integrationId, syncDto);
    }
}
