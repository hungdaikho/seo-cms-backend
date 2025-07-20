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
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KeywordsService } from './keywords.service';
import { CreateKeywordDto, UpdateKeywordDto, BulkCreateKeywordsDto } from './dto/keyword.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Keywords')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/keywords')
export class KeywordsController {
    constructor(private readonly keywordsService: KeywordsService) { }

    @Post()
    @ApiOperation({ summary: 'Add keyword to project' })
    @ApiResponse({ status: 201, description: 'Keyword created successfully' })
    @ApiResponse({ status: 403, description: 'Keyword limit reached' })
    async createKeyword(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() createKeywordDto: CreateKeywordDto,
    ) {
        return this.keywordsService.createKeyword(req.user.id, projectId, createKeywordDto);
    }

    @Post('bulk')
    @ApiOperation({ summary: 'Add multiple keywords to project' })
    @ApiResponse({ status: 201, description: 'Keywords created successfully' })
    @ApiResponse({ status: 403, description: 'Keyword limit exceeded' })
    async bulkCreateKeywords(
        @Request() req,
        @Param('projectId') projectId: string,
        @Body() bulkCreateDto: BulkCreateKeywordsDto,
    ) {
        return this.keywordsService.bulkCreateKeywords(req.user.id, projectId, bulkCreateDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get project keywords' })
    @ApiResponse({ status: 200, description: 'Keywords retrieved successfully' })
    async getProjectKeywords(
        @Request() req,
        @Param('projectId') projectId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.keywordsService.getProjectKeywords(req.user.id, projectId, paginationDto);
    }
}

@ApiTags('Keywords')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('keywords')
export class KeywordController {
    constructor(private readonly keywordsService: KeywordsService) { }

    @Patch(':id')
    @ApiOperation({ summary: 'Update keyword' })
    @ApiResponse({ status: 200, description: 'Keyword updated successfully' })
    @ApiResponse({ status: 404, description: 'Keyword not found' })
    async updateKeyword(
        @Request() req,
        @Param('id') keywordId: string,
        @Body() updateKeywordDto: UpdateKeywordDto,
    ) {
        return this.keywordsService.updateKeyword(req.user.id, keywordId, updateKeywordDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete keyword' })
    @ApiResponse({ status: 200, description: 'Keyword deleted successfully' })
    @ApiResponse({ status: 404, description: 'Keyword not found' })
    async deleteKeyword(@Request() req, @Param('id') keywordId: string) {
        return this.keywordsService.deleteKeyword(req.user.id, keywordId);
    }

    @Get(':id/rankings')
    @ApiOperation({ summary: 'Get keyword ranking history' })
    @ApiResponse({ status: 200, description: 'Ranking history retrieved successfully' })
    async getKeywordRankings(
        @Request() req,
        @Param('id') keywordId: string,
        @Query('days', ParseIntPipe) days = 30,
    ) {
        return this.keywordsService.getKeywordRankings(req.user.id, keywordId, days);
    }
}
