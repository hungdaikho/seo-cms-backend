import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BacklinkGapService } from './backlink-gap.service';
import {
  BacklinkGapCompareDto,
  BacklinkGapCompareResponse,
  BacklinkProspectsDto,
  BacklinkProspectsResponse,
} from './dto/backlink-gap.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('SEO - Backlink Gap Analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seo/backlink-gap')
export class BacklinkGapController {
  constructor(private readonly backlinkGapService: BacklinkGapService) {}

  @Post('compare')
  @ApiOperation({
    summary: 'Compare backlink gaps between target domain and competitors',
    description:
      'Analyze backlink profiles to identify link building opportunities by comparing your domain against competitors',
  })
  @ApiResponse({
    status: 200,
    description: 'Backlink gap analysis completed successfully',
    type: 'BacklinkGapCompareResponse',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during analysis',
  })
  async compareBacklinkGaps(
    @Body(ValidationPipe) dto: BacklinkGapCompareDto,
  ): Promise<BacklinkGapCompareResponse> {
    return this.backlinkGapService.compareBacklinkGaps(dto);
  }

  @Get('prospects/:domain')
  @ApiOperation({
    summary: 'Get backlink prospects for a domain',
    description:
      'Find potential websites that could provide valuable backlinks based on competitor analysis',
  })
  @ApiResponse({
    status: 200,
    description: 'Backlink prospects retrieved successfully',
    type: 'BacklinkProspectsResponse',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid domain parameter',
  })
  @ApiResponse({
    status: 404,
    description: 'Domain not found or no prospects available',
  })
  async getBacklinkProspects(
    @Param('domain') domain: string,
    @Query() queryParams: any,
  ): Promise<BacklinkProspectsResponse> {
    // Manual parsing for nested filters
    const dto: BacklinkProspectsDto = {
      limit: queryParams.limit ? parseInt(queryParams.limit) : undefined,
      minAuthorityScore: queryParams.minAuthorityScore
        ? parseInt(queryParams.minAuthorityScore)
        : undefined,
      competitors: queryParams.competitors,
      linkType: queryParams.linkType,
      language: queryParams.language,
      filters: {},
    };

    // Parse nested filters from query params like filters.minAuthorityScore=30
    Object.keys(queryParams).forEach((key) => {
      if (key.startsWith('filters.')) {
        const filterKey = key.replace('filters.', '');
        if (!dto.filters) dto.filters = {};

        if (filterKey === 'minAuthorityScore') {
          dto.filters.minAuthorityScore = parseInt(queryParams[key]);
        } else if (filterKey === 'linkType') {
          dto.filters.linkType = queryParams[key];
        } else if (filterKey === 'language') {
          dto.filters.language = queryParams[key];
        } else if (filterKey === 'minReferringDomains') {
          dto.filters.minReferringDomains = parseInt(queryParams[key]);
        }
      }
    });

    return this.backlinkGapService.getBacklinkProspects(domain, dto);
  }
}
