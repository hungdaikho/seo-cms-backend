import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RankingsService } from './rankings.service';
import { CreateRankingDto, RankingHistoryQuery } from './dto/ranking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Rankings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class RankingsController {
    constructor(private readonly rankingsService: RankingsService) { }

    @Post('keywords/:keywordId/rankings')
    @ApiOperation({ summary: 'Add ranking record for keyword' })
    @ApiResponse({ status: 201, description: 'Ranking record created successfully' })
    @ApiResponse({ status: 404, description: 'Keyword not found' })
    async createRanking(
        @Request() req,
        @Param('keywordId', ParseUUIDPipe) keywordId: string,
        @Body() createRankingDto: CreateRankingDto,
    ) {
        return this.rankingsService.createRanking(req.user.id, keywordId, createRankingDto);
    }

    @Get('keywords/:keywordId/rankings')
    @ApiOperation({ summary: 'Get keyword ranking history' })
    @ApiResponse({ status: 200, description: 'Ranking history retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Keyword not found' })
    async getRankingHistory(
        @Request() req,
        @Param('keywordId', ParseUUIDPipe) keywordId: string,
        @Query() query: RankingHistoryQuery,
    ) {
        return this.rankingsService.getRankingHistory(req.user.id, keywordId, query);
    }

    @Get('projects/:projectId/rankings/overview')
    @ApiOperation({ summary: 'Get project rankings overview' })
    @ApiResponse({ status: 200, description: 'Project rankings overview retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async getProjectRankingsOverview(
        @Request() req,
        @Param('projectId', ParseUUIDPipe) projectId: string,
    ) {
        return this.rankingsService.getProjectRankingsOverview(req.user.id, projectId);
    }
}
