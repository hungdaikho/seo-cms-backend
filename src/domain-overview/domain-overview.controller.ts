import {
    Controller,
    Get,
    Query,
    Param,
    UseGuards,
    ValidationPipe,
    BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DomainOverviewService } from './domain-overview.service';
import {
    DomainOverviewDto,
    DomainTopKeywordsDto,
    DomainCompetitorsDto,
    DomainTopicsDto
} from './dto/domain-overview.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Domain Overview')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/seo/domain-overview')
export class DomainOverviewController {
    constructor(private readonly domainOverviewService: DomainOverviewService) { }

    @Get(':domain')
    @ApiOperation({ summary: 'Get comprehensive domain overview and authority metrics' })
    @ApiResponse({ status: 200, description: 'Domain overview retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain' })
    @ApiQuery({
        name: 'includeSubdomains',
        description: 'Include subdomains in analysis',
        required: false,
        example: false
    })
    async getDomainOverview(
        @Param('domain') domain: string,
        @Query('includeSubdomains') includeSubdomains?: boolean
    ) {
        if (!domain) {
            throw new BadRequestException('Domain parameter is required');
        }

        const dto: DomainOverviewDto = { domain, includeSubdomains };
        return this.domainOverviewService.getDomainOverview(dto);
    }

    @Get('top-keywords/:domain')
    @ApiOperation({ summary: 'Get top ranking keywords for domain' })
    @ApiResponse({ status: 200, description: 'Top keywords retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'limit', description: 'Number of keywords to return', required: false, example: 100 })
    @ApiQuery({ name: 'country', description: 'Country code', required: false, example: 'US' })
    async getTopKeywords(
        @Param('domain') domain: string,
        @Query('limit') limit?: number,
        @Query('country') country?: string
    ) {
        if (!domain) {
            throw new BadRequestException('Domain parameter is required');
        }

        const dto: DomainTopKeywordsDto = { domain, limit, country };
        return this.domainOverviewService.getTopKeywords(dto);
    }

    @Get('competitors/:domain')
    @ApiOperation({ summary: 'Get domain competitors analysis' })
    @ApiResponse({ status: 200, description: 'Competitors retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'limit', description: 'Number of competitors to return', required: false, example: 50 })
    @ApiQuery({ name: 'country', description: 'Country code', required: false, example: 'US' })
    async getDomainCompetitors(
        @Param('domain') domain: string,
        @Query('limit') limit?: number,
        @Query('country') country?: string
    ) {
        if (!domain) {
            throw new BadRequestException('Domain parameter is required');
        }

        const dto: DomainCompetitorsDto = { domain, limit, country };
        return this.domainOverviewService.getDomainCompetitors(dto);
    }

    @Get('topics/:domain')
    @ApiOperation({ summary: 'Get content topics analysis for domain' })
    @ApiResponse({ status: 200, description: 'Content topics retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'limit', description: 'Number of topics to return', required: false, example: 50 })
    async getDomainTopics(
        @Param('domain') domain: string,
        @Query('limit') limit?: number
    ) {
        if (!domain) {
            throw new BadRequestException('Domain parameter is required');
        }

        const dto: DomainTopicsDto = { domain, limit };
        return this.domainOverviewService.getDomainTopics(dto);
    }

    @Get('authority/:domain')
    @ApiOperation({ summary: 'Get domain authority metrics from multiple sources' })
    @ApiResponse({ status: 200, description: 'Domain authority metrics retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain' })
    async getDomainAuthority(@Param('domain') domain: string) {
        if (!domain) {
            throw new BadRequestException('Domain parameter is required');
        }

        return this.domainOverviewService.getDomainAuthority(domain);
    }
}
