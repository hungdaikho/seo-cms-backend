import {
    Controller,
    Get,
    Query,
    Param,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrganicResearchService } from './organic-research.service';
import {
    OrganicDomainAnalysisDto,
    OrganicKeywordsDto,
    CompetitorDiscoveryDto,
    TopPagesDto
} from './dto/organic-research.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Organic Research')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/seo/organic-research')
export class OrganicResearchController {
    constructor(private readonly organicResearchService: OrganicResearchService) { }

    @Get('domain/:domain')
    @ApiOperation({ summary: 'Analyze domain organic performance' })
    @ApiResponse({ status: 200, description: 'Domain analysis completed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'country', description: 'Country code (e.g., US, UK)', example: 'US' })
    @ApiQuery({ name: 'database', description: 'Database to use', required: false, example: 'google' })
    async analyzeDomain(
        @Param('domain') domain: string,
        @Query('country') country: string,
        @Query('database') database?: string
    ) {
        const dto: OrganicDomainAnalysisDto = { domain, country, database };
        return this.organicResearchService.analyzeDomain(dto);
    }

    @Get('keywords/:domain')
    @ApiOperation({ summary: 'Get organic keywords for domain' })
    @ApiResponse({ status: 200, description: 'Organic keywords retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'country', description: 'Country code', example: 'US' })
    @ApiQuery({ name: 'limit', description: 'Number of results', required: false, example: 100 })
    @ApiQuery({ name: 'offset', description: 'Offset for pagination', required: false, example: 0 })
    @ApiQuery({ name: 'sortBy', description: 'Sort by field', required: false, enum: ['position', 'traffic', 'volume'] })
    @ApiQuery({ name: 'sortOrder', description: 'Sort order', required: false, enum: ['asc', 'desc'] })
    async getOrganicKeywords(
        @Param('domain') domain: string,
        @Query(ValidationPipe) query: Omit<OrganicKeywordsDto, 'domain'>
    ) {
        const dto: OrganicKeywordsDto = { domain, ...query };
        return this.organicResearchService.getOrganicKeywords(dto);
    }

    @Get('competitors/:domain')
    @ApiOperation({ summary: 'Discover competitors for domain' })
    @ApiResponse({ status: 200, description: 'Competitors discovered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'country', description: 'Country code', example: 'US' })
    @ApiQuery({ name: 'limit', description: 'Number of competitors', required: false, example: 50 })
    async discoverCompetitors(
        @Param('domain') domain: string,
        @Query('country') country: string,
        @Query('limit') limit?: number
    ) {
        const dto: CompetitorDiscoveryDto = { domain, country, limit };
        return this.organicResearchService.discoverCompetitors(dto);
    }

    @Get('top-pages/:domain')
    @ApiOperation({ summary: 'Get top performing pages for domain' })
    @ApiResponse({ status: 200, description: 'Top pages retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Invalid domain or parameters' })
    @ApiQuery({ name: 'country', description: 'Country code', example: 'US' })
    @ApiQuery({ name: 'limit', description: 'Number of pages', required: false, example: 100 })
    @ApiQuery({ name: 'sortBy', description: 'Sort by field', required: false, enum: ['traffic', 'keywords', 'value'] })
    async getTopPages(
        @Param('domain') domain: string,
        @Query('country') country: string,
        @Query('limit') limit?: number,
        @Query('sortBy') sortBy?: 'traffic' | 'keywords' | 'value'
    ) {
        const dto: TopPagesDto = { domain, country, limit, sortBy };
        return this.organicResearchService.getTopPages(dto);
    }

    @Get('api-limits')
    @ApiOperation({ summary: 'Check third-party API limits' })
    @ApiResponse({ status: 200, description: 'API limits retrieved successfully' })
    async getAPILimits() {
        return this.organicResearchService.checkAPILimits();
    }
}
