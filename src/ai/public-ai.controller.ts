import { Controller, Post, Body, Get, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from '../ai/ai.service';
import { KeywordSuggestionsDto } from '../ai/dto/ai.dto';

@ApiTags('public-ai')
@Controller('api/v1/ai')
export class PublicAiController {
    constructor(private readonly aiService: AiService) { }

    @Post('seo/keyword-suggestions')
    @ApiOperation({ summary: 'Generate AI-powered keyword suggestions based on a seed keyword' })
    @ApiResponse({
        status: 200,
        description: 'Keyword suggestions generated successfully',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    keyword: { type: 'string', example: 'best seo tools 2024' },
                    searchVolume: { type: 'number', example: 5400 },
                    difficulty: { type: 'number', example: 65 },
                    intent: { type: 'string', example: 'Commercial' },
                    relevanceScore: { type: 'number', example: 0.92 },
                    category: { type: 'string', example: 'Tools' }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad Request',
        schema: {
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Bad Request' },
                message: { type: 'string', example: 'seedKeyword is required' },
                statusCode: { type: 'number', example: 400 }
            }
        }
    })
    @ApiResponse({
        status: 422,
        description: 'Unprocessable Entity',
        schema: {
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Unprocessable Entity' },
                message: { type: 'string', example: 'Invalid location code. Supported codes: US, UK, CA, AU, DE, FR, ES, IT, etc.' },
                statusCode: { type: 'number', example: 422 }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Internal Server Error',
        schema: {
            type: 'object',
            properties: {
                error: { type: 'string', example: 'Internal Server Error' },
                message: { type: 'string', example: 'AI service temporarily unavailable' },
                statusCode: { type: 'number', example: 500 }
            }
        }
    })
    async generateKeywordSuggestions(@Body(ValidationPipe) dto: KeywordSuggestionsDto) {
        console.log('=== KEYWORD SUGGESTIONS REQUEST START ===');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Received DTO:', JSON.stringify(dto, null, 2));
        console.log('DTO type:', typeof dto);
        console.log('DTO validation passed');

        try {
            const result = await this.aiService.generateKeywordSuggestionsPublic(dto);
            console.log('=== SUCCESS: Returning result ===');
            console.log('Result type:', typeof result);
            console.log('Result length:', Array.isArray(result) ? result.length : 'not array');
            console.log('Result preview:', JSON.stringify(result?.slice(0, 2), null, 2));
            return result;
        } catch (error) {
            console.error('=== ERROR IN CONTROLLER ===');
            console.error('Error type:', typeof error);
            console.error('Error name:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    @Get('test-connection')
    @ApiOperation({ summary: 'Test OpenAI API connection' })
    @ApiResponse({ status: 200, description: 'OpenAI connection test successful' })
    async testConnection() {
        return {
            message: 'OpenAI test successful',
            response: await this.aiService.testOpenAIConnection()
        };
    }
}
