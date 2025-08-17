import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { KeywordGapService } from './keyword-gap.service';
import {
  KeywordGapCompareDto,
  KeywordGapOverlapDto,
  KeywordGapCompareResponse,
  KeywordGapOverlapResponse,
} from './dto/keyword-gap.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Keyword Gap Analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seo/keyword-gap')
export class KeywordGapController {
  constructor(private readonly keywordGapService: KeywordGapService) {}

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Compare keyword gaps between target domain and competitors',
    description:
      'Analyze keyword gaps to identify missing opportunities, weak positions, and competitive advantages',
  })
  @ApiResponse({
    status: 200,
    description: 'Keyword gap analysis completed successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  async compareKeywordGaps(
    @Body(ValidationPipe) dto: KeywordGapCompareDto,
  ): Promise<KeywordGapCompareResponse> {
    return this.keywordGapService.compareKeywordGaps(dto);
  }

  @Get('overlap')
  @ApiOperation({
    summary: 'Get keyword overlap analysis between domains',
    description:
      'Analyze keyword overlap and unique opportunities between multiple domains',
  })
  @ApiResponse({
    status: 200,
    description: 'Keyword overlap analysis completed successfully',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Invalid domain parameters' })
  @ApiQuery({
    name: 'domains',
    description: 'Comma-separated domains (max 3)',
    example: 'webflow.com,wix.com',
  })
  @ApiQuery({
    name: 'country',
    description: 'Country code for analysis',
    example: 'US',
  })
  async getKeywordOverlap(
    @Query(ValidationPipe) dto: KeywordGapOverlapDto,
  ): Promise<KeywordGapOverlapResponse> {
    return this.keywordGapService.getKeywordOverlap(dto);
  }
}
