import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import OpenAI from 'openai';
import {
    AIRequestType,
    KeywordResearchDto,
    ContentOptimizationDto,
    MetaGenerationDto,
    ContentIdeasDto,
    CompetitorAnalysisDto,
    SEOAuditDto,
    KeywordResearchResponse,
    ContentOptimizationResponse,
    MetaTagsResponse,
    ContentIdeasResponse,
    CompetitorAnalysisResponse,
    SEOAuditResponse,
    KeywordSuggestion,
    ContentIdea,
    OptimizationSuggestion,
} from './dto/ai.dto';

@Injectable()
export class AiService {
    private readonly openai: OpenAI;

    constructor(private readonly db: DatabaseService) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async processAIRequest(userId: string, type: AIRequestType, parameters: any, projectId?: string) {
        // Create AI request record
        const aiRequest = await this.db.aIRequest.create({
            data: {
                userId,
                projectId,
                type,
                parameters,
                status: 'processing',
            },
        });

        try {
            let result: any;

            switch (type) {
                case AIRequestType.KEYWORD_RESEARCH:
                    result = await this.generateKeywordResearch(parameters as KeywordResearchDto);
                    break;

                case AIRequestType.CONTENT_OPTIMIZATION:
                    result = await this.optimizeContent(parameters as ContentOptimizationDto);
                    break;

                case AIRequestType.META_GENERATION:
                    result = await this.generateMetaTags(parameters as MetaGenerationDto);
                    break;

                case AIRequestType.CONTENT_IDEAS:
                    result = await this.generateContentIdeas(parameters as ContentIdeasDto);
                    break;

                case AIRequestType.COMPETITOR_ANALYSIS:
                    result = await this.analyzeCompetitor(parameters as CompetitorAnalysisDto);
                    break;

                case AIRequestType.SEO_AUDIT:
                    result = await this.performSEOAudit(parameters as SEOAuditDto);
                    break;

                default:
                    throw new BadRequestException('Unsupported AI request type');
            }

            // Update request with result
            await this.db.aIRequest.update({
                where: { id: aiRequest.id },
                data: {
                    status: 'completed',
                    response: result,
                    completedAt: new Date(),
                },
            });

            return { requestId: aiRequest.id, result };
        } catch (error) {
            // Update request with error
            await this.db.aIRequest.update({
                where: { id: aiRequest.id },
                data: {
                    status: 'failed',
                    response: { error: error.message },
                },
            });

            throw new BadRequestException('AI request failed: ' + error.message);
        }
    }

    async generateKeywordResearch(dto: KeywordResearchDto): Promise<KeywordResearchResponse> {
        const prompt = `
    As an expert SEO specialist, generate comprehensive keyword research for the topic: "${dto.topic}"
    ${dto.industry ? `Industry: ${dto.industry}` : ''}
    ${dto.location ? `Target location: ${dto.location}` : ''}
    
    Provide ${dto.count || 50} relevant keywords with the following information:
    1. Primary keyword variations
    2. Long-tail keywords
    3. Related semantic keywords
    4. Question-based keywords
    5. Commercial intent keywords
    
    For each keyword, estimate:
    - Search volume (monthly)
    - Keyword difficulty (1-100)
    - Search intent (informational, navigational, commercial, transactional)
    - Relevance score (1-10)
    
    Also provide:
    - Related topics for content expansion
    - Search intent analysis breakdown
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        try {
            const response = JSON.parse(completion.choices[0].message.content || '{}');

            // Transform and validate the response
            const keywords: KeywordSuggestion[] = response.keywords?.map((k: any) => ({
                keyword: k.keyword,
                estimatedVolume: k.estimatedVolume || 0,
                estimatedDifficulty: k.estimatedDifficulty || 50,
                searchIntent: k.searchIntent || 'informational',
                relevanceScore: k.relevanceScore || 5,
            })) || [];

            return {
                keywords,
                relatedTopics: response.relatedTopics || [],
                searchIntent: response.searchIntent || [],
            };
        } catch (error) {
            throw new BadRequestException('Failed to parse AI response for keyword research');
        }
    }

    async optimizeContent(dto: ContentOptimizationDto): Promise<ContentOptimizationResponse> {
        const prompt = `
    As an expert SEO content optimizer, analyze and optimize the following content:
    
    Content: "${dto.content}"
    Target keyword: "${dto.targetKeyword}"
    ${dto.additionalKeywords ? `Additional keywords: ${dto.additionalKeywords.join(', ')}` : ''}
    ${dto.contentType ? `Content type: ${dto.contentType}` : ''}
    
    Provide:
    1. Optimized version of the content with better SEO
    2. Specific suggestions for improvement
    3. SEO score (1-100)
    4. Keyword density analysis
    5. Recommendations for meta tags
    6. Content structure improvements
    
    Focus on:
    - Natural keyword integration
    - Readability improvement
    - Semantic SEO optimization
    - User intent alignment
    - Content quality enhancement
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        try {
            const response = JSON.parse(completion.choices[0].message.content || '{}');

            return {
                optimizedContent: response.optimizedContent || dto.content,
                suggestions: response.suggestions || [],
                seoScore: response.seoScore || 50,
                keywordDensity: response.keywordDensity || [],
            };
        } catch (error) {
            throw new BadRequestException('Failed to parse AI response for content optimization');
        }
    }

    async generateMetaTags(dto: MetaGenerationDto): Promise<MetaTagsResponse> {
        const prompt = `
    Generate SEO-optimized meta tags for the following content:
    
    Content/URL: "${dto.content}"
    Target keyword: "${dto.targetKeyword}"
    ${dto.brandName ? `Brand: ${dto.brandName}` : ''}
    
    Generate:
    1. Optimized title tag (50-60 characters)
    2. Meta description (150-160 characters)
    3. Meta keywords (comma-separated)
    4. 3 alternative title variations
    5. 3 alternative description variations
    
    Requirements:
    - Include target keyword naturally
    - Compelling and click-worthy
    - Search engine friendly
    - Brand appropriate
    - Conversion focused
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        try {
            const response = JSON.parse(completion.choices[0].message.content || '{}');

            return {
                title: response.title || '',
                description: response.description || '',
                keywords: response.keywords || [],
                alternativeTitles: response.alternativeTitles || [],
                alternativeDescriptions: response.alternativeDescriptions || [],
            };
        } catch (error) {
            throw new BadRequestException('Failed to parse AI response for meta tag generation');
        }
    }

    async generateContentIdeas(dto: ContentIdeasDto): Promise<ContentIdeasResponse> {
        const prompt = `
    Generate creative and SEO-focused content ideas for:
    
    Topic: "${dto.topic}"
    ${dto.audience ? `Target audience: ${dto.audience}` : ''}
    ${dto.format ? `Preferred format: ${dto.format}` : ''}
    
    Generate ${dto.count || 10} content ideas including:
    1. Blog post ideas
    2. Video content concepts
    3. Infographic topics
    4. Social media content
    5. Lead magnets
    
    For each idea provide:
    - Compelling title
    - Brief description
    - Content type/format
    - Target keywords
    - Difficulty level (easy, medium, hard)
    - Estimated traffic potential
    
    Also include:
    - Content pillars for strategy
    - Seasonal content opportunities
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
        });

        try {
            const response = JSON.parse(completion.choices[0].message.content || '{}');

            const ideas: ContentIdea[] = response.ideas?.map((idea: any) => ({
                title: idea.title,
                description: idea.description,
                contentType: idea.contentType || 'blog',
                targetKeywords: idea.targetKeywords || [],
                difficulty: idea.difficulty || 'medium',
                estimatedTraffic: idea.estimatedTraffic || 0,
            })) || [];

            return {
                ideas,
                contentPillars: response.contentPillars || [],
                seasonalTopics: response.seasonalTopics || [],
            };
        } catch (error) {
            throw new BadRequestException('Failed to parse AI response for content ideas');
        }
    }

    async analyzeCompetitor(dto: CompetitorAnalysisDto): Promise<CompetitorAnalysisResponse> {
        const prompt = `
    Perform competitive analysis between:
    Competitor: ${dto.competitorDomain}
    Your domain: ${dto.yourDomain}
    ${dto.industry ? `Industry: ${dto.industry}` : ''}
    
    Analyze and provide:
    1. Competitor's SEO strengths
    2. Competitor's weaknesses/gaps
    3. Opportunities for your domain
    4. Content gaps you can exploit
    5. Strategic recommendations
    
    Focus on:
    - Content strategy analysis
    - Keyword positioning
    - Technical SEO factors
    - User experience elements
    - Market positioning
    
    Provide actionable recommendations with priority levels and implementation effort.
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        try {
            const response = JSON.parse(completion.choices[0].message.content || '{}');

            return {
                strengths: response.strengths || [],
                weaknesses: response.weaknesses || [],
                opportunities: response.opportunities || [],
                contentGaps: response.contentGaps || [],
                recommendations: response.recommendations || [],
            };
        } catch (error) {
            throw new BadRequestException('Failed to parse AI response for competitor analysis');
        }
    }

    async performSEOAudit(dto: SEOAuditDto): Promise<SEOAuditResponse> {
        const prompt = `
    Perform comprehensive SEO audit for: ${dto.url}
    ${dto.targetKeywords ? `Target keywords: ${dto.targetKeywords.join(', ')}` : ''}
    
    Analyze and provide:
    1. Overall SEO score (1-100)
    2. Technical SEO issues
    3. On-page optimization problems
    4. Content quality assessment
    5. User experience factors
    6. Mobile optimization
    7. Page speed considerations
    8. Schema markup opportunities
    
    For each issue, provide:
    - Category (technical, content, UX, etc.)
    - Severity level (low, medium, high, critical)
    - Impact on SEO
    - Specific recommendations
    - Implementation effort required
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
        });

        try {
            const response = JSON.parse(completion.choices[0].message.content || '{}');

            return {
                overallScore: response.overallScore || 50,
                issues: response.issues || [],
                recommendations: response.recommendations || [],
                technicalIssues: response.technicalIssues || [],
            };
        } catch (error) {
            throw new BadRequestException('Failed to parse AI response for SEO audit');
        }
    }

    async getUserAIRequests(userId: string, projectId?: string) {
        const where: any = { userId };
        if (projectId) {
            where.projectId = projectId;
        }

        return this.db.aIRequest.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                project: {
                    select: { id: true, name: true, domain: true }
                }
            },
        });
    }

    async getAIRequestById(userId: string, requestId: string) {
        const request = await this.db.aIRequest.findFirst({
            where: { id: requestId, userId },
            include: {
                project: {
                    select: { id: true, name: true, domain: true }
                }
            },
        });

        if (!request) {
            throw new BadRequestException('AI request not found');
        }

        return request;
    }
}
