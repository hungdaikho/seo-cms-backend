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
    // Advanced Content Generation DTOs
    BlogOutlineDto,
    ProductDescriptionDto,
    SocialMediaContentDto,
    ContentRewriteDto,
    ContentExpansionDto,
    // Advanced SEO Analysis DTOs
    CompetitorContentAnalysisDto,
    ContentOptimizationSuggestionsDto,
    SchemaMarkupGenerationDto,
    // Advanced Keyword Research DTOs
    LongTailKeywordsDto,
    QuestionBasedKeywordsDto,
    SeasonalKeywordTrendsDto,
    KeywordMagicToolDto,
    KeywordSuggestionsDto,
    // AI Analytics DTOs
    ContentPerformancePredictionDto,
    AIUsageAnalyticsDto,
    // AI Tools Management DTOs
    AIToolUsageDto,
    AITemplateDto,
    AIWorkflowDto,
    // Response DTOs
    BlogOutlineResponse,
    ProductDescriptionResponse,
    SocialMediaContentResponse,
    ContentRewriteResponse,
    ContentExpansionResponse,
    CompetitorContentAnalysisResponse,
    ContentOptimizationSuggestionsResponse,
    SchemaMarkupResponse,
    LongTailKeywordsResponse,
    QuestionBasedKeywordsResponse,
    SeasonalKeywordTrendsResponse,
    KeywordMagicToolResponse,
    KeywordSuggestionsResponse,
    ContentPerformancePredictionResponse,
    AIUsageAnalyticsResponse,
    AIToolUsageResponse,
    AITool,
    AITemplate,
    AIWorkflow,
} from './dto/ai.dto';

@Injectable()
export class AiService {
    private readonly openai: OpenAI;

    constructor(private readonly db: DatabaseService) {
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is not set in environment variables');
            throw new Error('OPENAI_API_KEY is required');
        }

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        console.log('OpenAI client initialized successfully');
    }

    /**
     * Helper method to safely parse OpenAI response content
     */
    private safeParseOpenAIResponse(content: string): any {
        try {
            if (!content || content.trim() === '') {
                console.warn('Empty content received from OpenAI');
                return {};
            }

            // Remove code block markers if present
            let cleanedContent = content
                .replace(/```json\s*/gi, '')
                .replace(/```\s*/gi, '')
                .replace(/^```/gm, '')
                .replace(/```$/gm, '')
                .trim();

            // Remove any leading/trailing whitespace and newlines
            cleanedContent = cleanedContent.replace(/^\s+|\s+$/g, '');

            // Try to find JSON content if wrapped in other text
            const jsonMatch = cleanedContent.match(/\{.*\}/s);
            if (jsonMatch) {
                cleanedContent = jsonMatch[0];
            }

            // Log for debugging
            console.log('Original content length:', content.length);
            console.log('Cleaned content preview:', cleanedContent.substring(0, 200) + '...');

            const parsed = JSON.parse(cleanedContent);
            console.log('Successfully parsed JSON response');
            return parsed;
        } catch (error) {
            console.error('JSON parsing failed:', error.message);
            console.error('Content that failed to parse:', content.substring(0, 500) + '...');

            // Try to extract JSON from text
            try {
                const jsonRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
                const matches = content.match(jsonRegex);
                if (matches && matches.length > 0) {
                    const parsed = JSON.parse(matches[0]);
                    console.log('Successfully extracted and parsed JSON from text');
                    return parsed;
                }
            } catch (extractError) {
                console.error('JSON extraction also failed:', extractError.message);
            }

            // Return empty object as fallback
            return {};
        }
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

                // Advanced Content Generation
                case AIRequestType.BLOG_OUTLINE:
                    result = await this.generateBlogOutline(parameters as BlogOutlineDto);
                    break;

                case AIRequestType.PRODUCT_DESCRIPTION:
                    result = await this.generateProductDescription(parameters as ProductDescriptionDto);
                    break;

                case AIRequestType.SOCIAL_MEDIA:
                    result = await this.generateSocialMediaContent(parameters as SocialMediaContentDto);
                    break;

                case AIRequestType.CONTENT_REWRITE:
                    result = await this.rewriteContent(parameters as ContentRewriteDto);
                    break;

                case AIRequestType.CONTENT_EXPANSION:
                    result = await this.expandContent(parameters as ContentExpansionDto);
                    break;

                // Advanced SEO Analysis
                case AIRequestType.COMPETITOR_CONTENT_ANALYSIS:
                    result = await this.analyzeCompetitorContent(parameters as CompetitorContentAnalysisDto);
                    break;

                case AIRequestType.CONTENT_OPTIMIZATION_SUGGESTIONS:
                    result = await this.generateContentOptimizationSuggestions(parameters as ContentOptimizationSuggestionsDto);
                    break;

                case AIRequestType.SCHEMA_MARKUP_GENERATION:
                    result = await this.generateSchemaMarkup(parameters as SchemaMarkupGenerationDto);
                    break;

                // Advanced Keyword Research
                case AIRequestType.LONG_TAIL_KEYWORDS:
                    result = await this.generateLongTailKeywords(parameters as LongTailKeywordsDto);
                    break;

                case AIRequestType.QUESTION_BASED_KEYWORDS:
                    result = await this.generateQuestionBasedKeywords(parameters as QuestionBasedKeywordsDto);
                    break;

                case AIRequestType.SEASONAL_KEYWORD_TRENDS:
                    result = await this.analyzeSeasonalKeywordTrends(parameters as SeasonalKeywordTrendsDto);
                    break;

                case AIRequestType.KEYWORD_MAGIC_TOOL:
                    result = await this.keywordMagicTool(parameters as KeywordMagicToolDto);
                    break;

                case AIRequestType.KEYWORD_SUGGESTIONS:
                    result = await this.generateKeywordSuggestions(parameters as KeywordSuggestionsDto);
                    break;

                // Analytics
                case AIRequestType.CONTENT_PERFORMANCE_PREDICTION:
                    result = await this.predictContentPerformance(parameters as ContentPerformancePredictionDto);
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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

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
            console.error('Error in generateKeywordResearch:', error);
            throw new BadRequestException('Failed to parse AI response for keyword research: ' + error.message);
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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

            return {
                optimizedContent: response.optimizedContent || dto.content,
                suggestions: response.suggestions || [],
                seoScore: response.seoScore || 50,
                keywordDensity: response.keywordDensity || [],
            };
        } catch (error) {
            console.error('Error in optimizeContent:', error);
            throw new BadRequestException('Failed to parse AI response for content optimization: ' + error.message);
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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

            return {
                title: response.title || '',
                description: response.description || '',
                keywords: response.keywords || [],
                alternativeTitles: response.alternativeTitles || [],
                alternativeDescriptions: response.alternativeDescriptions || [],
            };
        } catch (error) {
            console.error('Error in generateMetaTags:', error);
            throw new BadRequestException('Failed to parse AI response for meta tag generation: ' + error.message);
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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

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
            console.error('Error in generateContentIdeas:', error);
            throw new BadRequestException('Failed to parse AI response for content ideas: ' + error.message);
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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

            return {
                strengths: response.strengths || [],
                weaknesses: response.weaknesses || [],
                opportunities: response.opportunities || [],
                contentGaps: response.contentGaps || [],
                recommendations: response.recommendations || [],
            };
        } catch (error) {
            console.error('Error in analyzeCompetitor:', error);
            throw new BadRequestException('Failed to parse AI response for competitor analysis: ' + error.message);
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
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

            return {
                overallScore: response.overallScore || 50,
                issues: response.issues || [],
                recommendations: response.recommendations || [],
                technicalIssues: response.technicalIssues || [],
            };
        } catch (error) {
            console.error('Error in performSEOAudit:', error);
            throw new BadRequestException('Failed to parse AI response for SEO audit: ' + error.message);
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

    // =============================
    // ADVANCED CONTENT GENERATION METHODS
    // =============================

    async generateBlogOutline(dto: BlogOutlineDto): Promise<BlogOutlineResponse> {
        const prompt = `
    Generate a comprehensive blog post outline for:
    
    Topic: "${dto.topic}"
    Target Keywords: ${dto.targetKeywords.join(', ')}
    Target Audience: ${dto.targetAudience}
    Target Word Count: ${dto.wordCount}
    Tone: ${dto.tone}
    
    Create a detailed outline including:
    1. Introduction section with hook and thesis
    2. Main content sections (H2 headings)
    3. Subsections (H3 headings) for each main section
    4. Key points to cover in each section
    5. Estimated word count for each section
    6. Suggested images/visuals for each section
    7. Internal link opportunities
    8. Call-to-action recommendations
    
    Focus on:
    - SEO optimization with natural keyword integration
    - Logical content flow and structure
    - User engagement and value delivery
    - Search intent satisfaction
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');
            return {
                outline: response.outline || { sections: [] },
                suggestedImages: response.suggestedImages || [],
                internalLinkOpportunities: response.internalLinkOpportunities || [],
            };
        } catch (error) {
            console.error('Error in generateBlogOutline:', error);
            throw new BadRequestException('Failed to parse AI response for blog outline generation: ' + error.message);
        }
    }

    async generateProductDescription(dto: ProductDescriptionDto): Promise<ProductDescriptionResponse> {
        const prompt = `
    Generate compelling product descriptions for:
    
    Product: "${dto.productName}"
    Features: ${dto.features.join(', ')}
    Benefits: ${dto.benefits.join(', ')}
    Target Audience: ${dto.targetAudience}
    Tone: ${dto.tone}
    Length: ${dto.length}
    
    Create:
    1. 3 different product descriptions (short, medium, long variations)
    2. Compelling bullet points highlighting key features
    3. Benefit-focused copy that addresses customer pain points
    4. Call-to-action suggestions
    5. SEO-optimized descriptions with natural keyword integration
    
    Focus on:
    - Emotional triggers and persuasive language
    - Clear value proposition
    - Customer benefits over features
    - Trust building elements
    - Conversion optimization
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');
            return {
                descriptions: response.descriptions || [],
                bulletPoints: response.bulletPoints || [],
                callToActions: response.callToActions || [],
            };
        } catch (error) {
            console.error('Error in generateProductDescription:', error);
            throw new BadRequestException('Failed to parse AI response for product description generation: ' + error.message);
        }
    }

    async generateSocialMediaContent(dto: SocialMediaContentDto): Promise<SocialMediaContentResponse> {
        const prompt = `
    Generate ${dto.platform} ${dto.contentType} content for:
    
    Platform: ${dto.platform}
    Content Type: ${dto.contentType}
    Topic: "${dto.topic}"
    Tone: ${dto.tone}
    Include Hashtags: ${dto.includeHashtags}
    Include Emojis: ${dto.includeEmojis}
    
    Create:
    1. Primary ${dto.contentType} content optimized for ${dto.platform}
    2. 3 alternative versions with different approaches
    3. Relevant hashtags (if requested)
    4. Platform-specific optimization
    
    Platform Guidelines:
    ${dto.platform === 'twitter' ? '- Maximum 280 characters for tweets' : ''}
    ${dto.platform === 'linkedin' ? '- Professional tone, business-focused' : ''}
    ${dto.platform === 'instagram' ? '- Visual-first, engaging captions' : ''}
    ${dto.platform === 'facebook' ? '- Conversational, community-focused' : ''}
    
    Focus on:
    - Platform best practices
    - Engagement optimization
    - Call-to-action inclusion
    - Brand voice consistency
    - Viral potential
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');
            return {
                content: response.content || '',
                hashtags: response.hashtags || [],
                alternativeVersions: response.alternativeVersions || [],
            };
        } catch (error) {
            console.error('Error in generateSocialMediaContent:', error);
            throw new BadRequestException('Failed to parse AI response for social media content generation: ' + error.message);
        }
    }

    async rewriteContent(dto: ContentRewriteDto): Promise<ContentRewriteResponse> {
        const prompt = `
    Rewrite the following content with these specifications:
    
    Original Content: "${dto.content}"
    Target Tone: ${dto.tone || 'professional'}
    Target Style: ${dto.style || 'standard'}
    Target Length: ${dto.length}
    
    Rewriting Requirements:
    1. Maintain the core message and key information
    2. Improve clarity and readability
    3. Adjust tone and style as specified
    4. ${dto.length === 'shorter' ? 'Reduce length by 15-25%' : dto.length === 'longer' ? 'Expand length by 20-40%' : 'Maintain similar length'}
    5. Enhance engagement and flow
    6. Improve SEO potential
    
    Provide:
    - Rewritten content
    - List of specific changes made
    - Word count difference
    - Improvement highlights
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            const originalWords = dto.content.split(/\s+/).length;
            const rewrittenWords = response.rewrittenContent?.split(/\s+/).length || originalWords;

            return {
                originalContent: dto.content,
                rewrittenContent: response.rewrittenContent || dto.content,
                changes: response.changes || [],
                wordCountChange: rewrittenWords - originalWords,
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for content rewriting: ' + error.message);
        }
    }

    async expandContent(dto: ContentExpansionDto): Promise<ContentExpansionResponse> {
        const prompt = `
    Expand the following content to reach the target length:
    
    Original Content: "${dto.content}"
    Target Length: ${dto.targetLength} words
    Additional Topics: ${dto.additionalTopics?.join(', ') || 'None specified'}
    
    Expansion Requirements:
    1. Maintain the original message and tone
    2. Add valuable, relevant information
    3. Include additional topics if specified
    4. Improve depth and comprehensiveness
    5. Maintain readability and flow
    6. Add examples, explanations, or supporting details
    
    Provide:
    - Expanded content
    - List of new sections/topics added
    - Word count increase
    - Enhancement summary
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            const originalWords = dto.content.split(/\s+/).length;
            const expandedWords = response.expandedContent?.split(/\s+/).length || originalWords;

            return {
                originalContent: dto.content,
                expandedContent: response.expandedContent || dto.content,
                addedSections: response.addedSections || [],
                wordCountIncrease: expandedWords - originalWords,
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for content expansion: ' + error.message);
        }
    }

    // =============================
    // ADVANCED SEO ANALYSIS METHODS
    // =============================

    async analyzeCompetitorContent(dto: CompetitorContentAnalysisDto): Promise<CompetitorContentAnalysisResponse> {
        const prompt = `
    Perform competitor content analysis for:
    
    Target Keyword: "${dto.keyword}"
    Target URL: ${dto.targetUrl}
    Competitor URLs: ${dto.competitorUrls.join(', ')}
    Additional Keywords: ${dto.targetKeywords?.join(', ') || 'None'}
    
    Analyze and provide:
    1. Top performing competitor content analysis
    2. Content gaps and opportunities
    3. Keyword optimization strategies used by competitors
    4. Content structure and format analysis
    5. Unique value propositions of competitors
    6. Recommendations for content improvement
    
    For each competitor, analyze:
    - Content length and structure
    - Keyword optimization
    - User engagement factors
    - Unique selling points
    - Content format (text, video, interactive)
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            return {
                keyword: dto.keyword,
                topPerformingContent: response.topPerformingContent || [],
                contentGaps: response.contentGaps || [],
                recommendations: response.recommendations || [],
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for competitor content analysis: ' + error.message);
        }
    }

    async generateContentOptimizationSuggestions(dto: ContentOptimizationSuggestionsDto): Promise<ContentOptimizationSuggestionsResponse> {
        const prompt = `
Analyze content and provide optimization suggestions for:

Content: "${dto.content}"
Target Keywords: ${dto.targetKeywords.join(', ')}
Target Audience: ${dto.targetAudience}
Current URL: ${dto.currentUrl || 'Not specified'}

Provide detailed suggestions for:
1. Keyword density optimization
2. Readability improvements
3. Content structure enhancements
4. Internal linking opportunities
5. User experience improvements
6. SEO technical optimizations

For each suggestion, include:
- Current state analysis
- Recommended improvements
- Implementation priority
- Expected impact

**Important**: Ensure the response is always formatted as a structured JSON object with the following fields:
{
  "keyword_density_optimization": { ... },
  "readability_improvements": { ... },
  "content_structure_enhancements": { ... },
  "internal_linking_opportunities": { ... },
  "user_experience_improvements": { ... },
  "seo_technical_optimizations": { ... }
}

Even if no data is available for a section, include the field with a value of null.
Format the response strictly in JSON format.
`;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        try {
            // Kiểm tra dữ liệu trả về
            if (!completion.choices || !completion.choices[0].message) {
                throw new BadRequestException('No valid response from AI');
            }

            // Sử dụng helper method để parse an toàn
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}');

            // Trả về kết quả đã được xử lý
            return {
                keywordDensity: response.keyword_density_optimization || {},
                readabilityIssues: response.readability_improvements || {},
                structureImprovements: response.content_structure_enhancements || {},
                internalLinkSuggestions: response.internal_linking_opportunities || {},
            };
        } catch (error) {
            console.error('Error in generateContentOptimizationSuggestions:', error);
            throw new BadRequestException('Failed to parse AI response for content optimization suggestions: ' + error.message);
        }
    }

    async generateSchemaMarkup(dto: SchemaMarkupGenerationDto): Promise<SchemaMarkupResponse> {
        const prompt = `
    Generate schema markup for:
    
    Content Type: ${dto.contentType}
    Content: "${dto.content}"
    Metadata: ${JSON.stringify(dto.metadata)}
    
    Generate appropriate schema.org markup for ${dto.contentType} including:
    1. Proper schema type selection
    2. All relevant properties
    3. Nested schema objects where appropriate
    4. Implementation best practices
    
    Schema Types to Consider:
    ${dto.contentType === 'article' ? '- Article, BlogPosting, NewsArticle' : ''}
    ${dto.contentType === 'product' ? '- Product, Offer, Review' : ''}
    ${dto.contentType === 'service' ? '- Service, LocalBusiness' : ''}
    ${dto.contentType === 'local-business' ? '- LocalBusiness, Organization' : ''}
    
    Provide:
    - Complete JSON-LD schema markup
    - Implementation instructions
    - Best practices recommendations
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            return {
                schemaMarkup: response.schemaMarkup || '',
                implementationInstructions: response.implementationInstructions || [],
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for schema markup generation: ' + error.message);
        }
    }

    // =============================
    // ADVANCED KEYWORD RESEARCH METHODS
    // =============================

    async generateLongTailKeywords(dto: LongTailKeywordsDto): Promise<LongTailKeywordsResponse> {
        const prompt = `
    Generate long-tail keyword research for:
    
    Seed Keywords: ${dto.seedKeywords.join(', ')}
    Search Intent: ${dto.intent}
    Location: ${dto.location || 'Global'}
    Language: ${dto.language}
    
    Generate comprehensive long-tail keywords including:
    1. 3-5 word phrase variations
    2. Question-based keywords
    3. Location-specific variations (if applicable)
    4. Commercial intent phrases
    5. Problem-solving keywords
    
    For each keyword provide:
    - Estimated search volume
    - Keyword difficulty (1-100)
    - Search intent classification
    - Related questions
    - Content opportunity assessment
    
    Also provide:
    - Topic clusters for content planning
    - Content gap opportunities
    - Seasonal considerations
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            return {
                keywords: response.keywords || [],
                topicClusters: response.topicClusters || [],
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for long-tail keyword generation: ' + error.message);
        }
    }

    async generateQuestionBasedKeywords(dto: QuestionBasedKeywordsDto): Promise<QuestionBasedKeywordsResponse> {
        const prompt = `
    Generate question-based keywords for:
    
    Topic: "${dto.topic}"
    Location: ${dto.location || 'Global'}
    Language: ${dto.language}
    
    Generate comprehensive question-based keywords including:
    1. What, How, Why, When, Where questions
    2. "People also ask" style questions
    3. Problem-solving questions
    4. Comparison questions
    5. Definition questions
    
    For each question provide:
    - Estimated search volume
    - Keyword difficulty
    - Best answer format (paragraph, list, table, video)
    - Featured snippet potential
    - Related follow-up questions
    
    Also identify:
    - Featured snippet opportunities
    - Voice search optimization potential
    - FAQ content opportunities
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            return {
                questions: response.questions || [],
                featuredSnippetOpportunities: response.featuredSnippetOpportunities || [],
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for question-based keyword generation: ' + error.message);
        }
    }

    async analyzeSeasonalKeywordTrends(dto: SeasonalKeywordTrendsDto): Promise<SeasonalKeywordTrendsResponse> {
        const prompt = `
    Analyze seasonal trends for keywords:
    
    Keywords: ${dto.keywords.join(', ')}
    Industry: ${dto.industry}
    Location: ${dto.location || 'Global'}
    
    Provide seasonal analysis including:
    1. Monthly search volume patterns
    2. Peak and low seasons identification
    3. Year-over-year trend analysis
    4. Industry-specific seasonal factors
    5. Content calendar recommendations
    
    For each keyword analyze:
    - Seasonal variations (monthly breakdown)
    - Peak months and reasons
    - Content planning opportunities
    - Competitive landscape changes
    - Marketing calendar alignment
    
    Also provide:
    - Content calendar suggestions by month
    - Seasonal content opportunities
    - Budget allocation recommendations
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            return {
                trends: response.trends || [],
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for seasonal keyword trend analysis: ' + error.message);
        }
    }

    async keywordMagicTool(dto: KeywordMagicToolDto): Promise<KeywordMagicToolResponse> {
        const prompt = `
    Perform comprehensive keyword research using Keyword Magic Tool for:
    
    Seed Keyword: "${dto.seedKeyword}"
    Industry: ${dto.industry || 'General'}
    Location: ${dto.location || 'US'}
    Language: ${dto.language || 'en'}
    Intent Filter: ${dto.intentFilter || 'all'}
    Difficulty Range: ${dto.minDifficulty || 0}-${dto.maxDifficulty || 100}
    Volume Range: ${dto.minVolume || 0}${dto.maxVolume ? `-${dto.maxVolume}` : '+'}
    Target Audience: ${dto.targetAudience || 'General audience'}
    Content Type: ${dto.contentType || 'General content'}
    
    Generate comprehensive keyword research including:
    
    1. PRIMARY KEYWORDS (${dto.limitPerCategory || 50} keywords):
       - High-volume exact and related keywords
       - Search intent analysis
       - Competition level
       - Opportunity score
       - Trend analysis
    
    2. LONG-TAIL KEYWORDS (if enabled: ${dto.includeLongTail}):
       - 3-5 word variations
       - Lower competition alternatives
       - Specific intent targeting
       
    3. QUESTION KEYWORDS (if enabled: ${dto.includeQuestions}):
       - How, what, why, when questions
       - Featured snippet opportunities
       - Answer format suggestions
       
    4. RELATED TOPICS:
       - Semantic keyword clusters
       - Content pillar opportunities
       - Supporting topics
       
    5. KEYWORD CLUSTERS:
       - Grouped by search intent
       - Topic-based groupings
       - Content strategy alignment
       
    6. CONTENT SUGGESTIONS:
       - Content types for each cluster
       - Estimated word counts
       - Primary and supporting keywords
       
    ${dto.includeCompetitorKeywords && dto.competitorDomains?.length ? `
    7. COMPETITOR ANALYSIS:
       - Analyze keywords from: ${dto.competitorDomains.join(', ')}
       - Keyword gaps identification
       - Competitive opportunities
    ` : ''}
    
    ${dto.includeSeasonalTrends ? `
    8. SEASONAL DATA:
       - Monthly trend patterns
       - Peak and low seasons
       - Content calendar alignment
    ` : ''}
    
    For each keyword provide:
    - Estimated search volume
    - Keyword difficulty (0-100)
    - CPC estimate
    - Search intent classification
    - Competition level
    - Opportunity score (0-100)
    - Trend direction
    
    Provide summary statistics:
    - Total keywords found
    - Average search volume
    - Average difficulty
    - Total estimated traffic
    - Top search intent
    - Competition level assessment
    
    Format the response as a structured JSON object matching KeywordMagicToolResponse interface.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
            max_tokens: 4000,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')

            return {
                seedKeyword: dto.seedKeyword,
                totalKeywords: response.totalKeywords || 0,
                summary: response.summary || {
                    avgSearchVolume: 0,
                    avgDifficulty: 0,
                    totalEstimatedTraffic: 0,
                    topIntent: 'informational',
                    competitionLevel: 'medium'
                },
                primaryKeywords: response.primaryKeywords || [],
                longTailKeywords: response.longTailKeywords || [],
                questionKeywords: response.questionKeywords || [],
                relatedTopics: response.relatedTopics || [],
                competitorAnalysis: response.competitorAnalysis || [],
                seasonalData: response.seasonalData || [],
                contentSuggestions: response.contentSuggestions || [],
                keywordClusters: response.keywordClusters || [],
                filters: {
                    location: dto.location || 'US',
                    language: dto.language || 'en',
                    intentFilter: dto.intentFilter || 'all',
                    difficultyRange: `${dto.minDifficulty || 0}-${dto.maxDifficulty || 100}`,
                    volumeRange: `${dto.minVolume || 0}${dto.maxVolume ? `-${dto.maxVolume}` : '+'}`
                }
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for keyword magic tool analysis: ' + error.message);
        }
    }

    async generateKeywordSuggestions(dto: KeywordSuggestionsDto): Promise<KeywordSuggestionsResponse> {
        const prompt = `
    Generate AI-powered keyword suggestions based on the seed keyword: "${dto.seedKeyword}"
    ${dto.industry ? `Industry Context: ${dto.industry}` : ''}
    ${dto.location ? `Location: ${dto.location}` : ''}
    
    Provide 15-20 high-quality keyword suggestions that include:
    
    1. Long-tail keyword variations
    2. Question-based keywords (How, What, Why, When, Where)
    3. Commercial intent keywords
    4. Informational keywords
    5. Related semantic keywords
    
    For each keyword, provide:
    - keyword: The suggested keyword phrase
    - searchVolume: Estimated monthly search volume (number)
    - difficulty: Keyword difficulty score 0-100 (number)
    - intent: Search intent classification ("Commercial", "Informational", "Navigational", "Transactional")
    - relevanceScore: AI-calculated relevance to seed keyword 0-1 (number)
    - category: Category or theme of the keyword (string)
    
    Requirements:
    - Focus on keywords that users would actually search for
    - Include a mix of different search intents
    - Ensure high relevance to the seed keyword
    - Sort by relevance score (highest first)
    - No exact duplicates
    
    Return the response as a JSON object with this structure:
    {
        "suggestions": [
            {
                "keyword": "example keyword",
                "searchVolume": 5400,
                "difficulty": 65,
                "intent": "Commercial",
                "relevanceScore": 0.92,
                "category": "Tools"
            }
        ]
    }
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 2000,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')

            // Validate and transform the response
            const suggestions = (response.suggestions || []).map((suggestion: any) => ({
                keyword: suggestion.keyword || '',
                searchVolume: suggestion.searchVolume || undefined,
                difficulty: suggestion.difficulty || undefined,
                intent: suggestion.intent || undefined,
                relevanceScore: suggestion.relevanceScore || undefined,
                category: suggestion.category || undefined,
            }));

            return {
                suggestions: suggestions
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for keyword suggestions: ' + error.message);
        }
    }

    // Public method for keyword suggestions (no auth required)
    async generateKeywordSuggestionsPublic(dto: KeywordSuggestionsDto): Promise<any[]> {
        console.log('=== AI SERVICE: generateKeywordSuggestionsPublic START ===');
        console.log('Input DTO:', JSON.stringify(dto, null, 2));

        // Validate environment
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY is missing from environment');
            return this.generateMockKeywordSuggestions(dto);
        }

        const prompt = `
    Generate AI-powered keyword suggestions based on the seed keyword: "${dto.seedKeyword}"
    ${dto.industry ? `Industry Context: ${dto.industry}` : ''}
    ${dto.location ? `Location: ${dto.location}` : ''}
    
    Provide 10-15 high-quality keyword suggestions that include:
    
    1. Long-tail keyword variations
    2. Question-based keywords (How, What, Why, When, Where)
    3. Commercial intent keywords
    4. Informational keywords
    5. Related semantic keywords
    
    For each keyword, provide:
    - keyword: The suggested keyword phrase
    - searchVolume: Estimated monthly search volume (number, optional)
    - difficulty: Keyword difficulty score 0-100 (number, optional)
    - intent: Search intent classification ("Commercial", "Informational", "Navigational", "Transactional", optional)
    - relevanceScore: AI-calculated relevance to seed keyword 0-1 (number, optional)
    - category: Category or theme of the keyword (string, optional)
    
    Requirements:
    - Focus on keywords that users would actually search for
    - Include a mix of different search intents
    - Ensure high relevance to the seed keyword
    - Sort by relevance score (highest first)
    - No exact duplicates
    
    Return ONLY a JSON array of keyword objects without any wrapper:
    [
        {
            "keyword": "example keyword",
            "searchVolume": 5400,
            "difficulty": 65,
            "intent": "Commercial",
            "relevanceScore": 0.92,
            "category": "Tools"
        }
    ]
    `;

        console.log('=== CALLING OPENAI API ===');
        console.log('Seed keyword:', dto.seedKeyword);
        console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
        console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);

        let completion;
        try {
            console.log('Starting OpenAI API call...');
            completion = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 2000,
            });

            console.log('=== OPENAI API CALL SUCCESS ===');
            console.log('Response received');
            console.log('Choices length:', completion.choices?.length || 0);
        } catch (apiError) {
            console.error('=== OPENAI API CALL FAILED ===');
            console.error('API Error type:', typeof apiError);
            console.error('API Error name:', apiError.constructor.name);
            console.error('API Error message:', apiError.message);
            console.error('API Error code:', apiError.code);
            console.error('API Error status:', apiError.status);
            console.error('API Error stack:', apiError.stack);

            // Fallback to mock data if OpenAI fails
            if (apiError.code === 'invalid_api_key' || apiError.status === 401) {
                console.log('Using fallback mock data due to API key issue');
                return this.generateMockKeywordSuggestions(dto);
            }

            throw new BadRequestException(`OpenAI API error: ${apiError.message}`);
        }

        console.log('=== PARSING OPENAI RESPONSE ===');
        try {
            const responseText = completion.choices[0].message.content || '[]';
            console.log('Raw OpenAI response:');
            console.log('Response length:', responseText.length);
            console.log('Response preview (first 200 chars):', responseText.substring(0, 200));
            console.log('Full response:', responseText);

            // Clean the response to ensure it's valid JSON
            const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            console.log('Cleaned response:');
            console.log('Cleaned length:', cleanedResponse.length);
            console.log('Cleaned preview (first 200 chars):', cleanedResponse.substring(0, 200));

            console.log('Attempting to parse JSON...');
            const suggestions = JSON.parse(cleanedResponse);
            console.log('JSON parsing successful');
            console.log('Parsed suggestions type:', typeof suggestions);
            console.log('Is array:', Array.isArray(suggestions));
            console.log('Suggestions count:', Array.isArray(suggestions) ? suggestions.length : 'N/A');

            // Validate that we got an array
            if (!Array.isArray(suggestions)) {
                console.error('Response is not an array');
                console.error('Actual type:', typeof suggestions);
                console.error('Actual value:', suggestions);
                throw new Error('Response is not an array');
            }

            console.log('=== VALIDATING AND FILTERING SUGGESTIONS ===');
            // Filter and validate suggestions
            const validSuggestions = suggestions.filter((suggestion, index) => {
                console.log(`Validating suggestion ${index}:`, JSON.stringify(suggestion, null, 2));
                const isValid = suggestion &&
                    typeof suggestion === 'object' &&
                    suggestion.keyword &&
                    typeof suggestion.keyword === 'string';
                console.log(`Suggestion ${index} is valid:`, isValid);
                return isValid;
            }).map((suggestion, index) => {
                const mapped = {
                    keyword: suggestion.keyword,
                    searchVolume: suggestion.searchVolume || undefined,
                    difficulty: suggestion.difficulty || undefined,
                    intent: suggestion.intent || undefined,
                    relevanceScore: suggestion.relevanceScore || undefined,
                    category: suggestion.category || undefined,
                };
                console.log(`Mapped suggestion ${index}:`, JSON.stringify(mapped, null, 2));
                return mapped;
            });

            console.log('=== FINAL RESULT ===');
            console.log('Valid suggestions count:', validSuggestions.length);
            console.log('Final result preview:', JSON.stringify(validSuggestions.slice(0, 2), null, 2));

            return validSuggestions;
        } catch (parseError) {
            console.error('=== PARSING ERROR ===');
            console.error('Parse error type:', typeof parseError);
            console.error('Parse error name:', parseError.constructor.name);
            console.error('Parse error message:', parseError.message);
            console.error('Parse error stack:', parseError.stack);

            console.log('Falling back to mock data due to parsing error');
            return this.generateMockKeywordSuggestions(dto);
        }
    }

    // =============================
    // AI ANALYTICS METHODS
    // =============================

    async predictContentPerformance(dto: ContentPerformancePredictionDto): Promise<ContentPerformancePredictionResponse> {
        const prompt = `
    Predict content performance for:
    
    Content: "${dto.content}"
    Target Keywords: ${dto.targetKeywords.join(', ')}
    Publish Date: ${dto.publishDate}
    Content Type: ${dto.contentType}
    
    Analyze and predict:
    1. Estimated organic traffic potential
    2. Engagement metrics prediction
    3. Conversion potential
    4. Competitive landscape impact
    5. SEO performance forecast
    
    Consider factors:
    - Content quality and depth
    - Keyword competitiveness
    - Market timing
    - Content format optimization
    - User intent alignment
    
    Provide predictions with confidence scores and improvement suggestions.
    
    Format the response as a structured JSON object.
    `;

        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        try {
            const response = this.safeParseOpenAIResponse(completion.choices[0].message.content || '{}')
            return {
                predictedMetrics: response.predictedMetrics || {
                    estimatedTraffic: 0,
                    estimatedEngagement: 0,
                    estimatedConversions: 0,
                    confidenceScore: 0
                },
                improvementSuggestions: response.improvementSuggestions || [],
                competitorComparison: response.competitorComparison || {},
            };
        } catch (error) {
            console.error('Error in method:', error); throw new BadRequestException('Failed to parse AI response for content performance prediction: ' + error.message);
        }
    }

    // =============================
    // AI TOOLS MANAGEMENT METHODS
    // =============================

    async getAvailableAITools(category?: string, isActive?: boolean): Promise<AITool[]> {
        // Mock implementation - in real scenario, this would be stored in database
        const allTools: AITool[] = [
            {
                id: 'content-generator',
                name: 'Content Generator',
                description: 'Generate high-quality content for blogs, articles, and marketing materials',
                category: 'content',
                icon: 'edit',
                isActive: true,
                isPremium: false,
                usageCount: 0,
                maxUsage: 100,
                features: ['Blog posts', 'Articles', 'Marketing copy', 'Product descriptions'],
                costPerRequest: 0.05,
                averageTokens: 1500,
            },
            {
                id: 'seo-optimizer',
                name: 'SEO Optimizer',
                description: 'Optimize content for search engines with AI-powered recommendations',
                category: 'seo',
                icon: 'search',
                isActive: true,
                isPremium: true,
                usageCount: 0,
                maxUsage: 50,
                features: ['Content optimization', 'Keyword suggestions', 'Meta tag generation'],
                costPerRequest: 0.08,
                averageTokens: 2000,
            },
            {
                id: 'keyword-research',
                name: 'Keyword Research',
                description: 'Discover high-value keywords with AI-powered analysis',
                category: 'research',
                icon: 'target',
                isActive: true,
                isPremium: false,
                usageCount: 0,
                maxUsage: 200,
                features: ['Keyword discovery', 'Search volume analysis', 'Competition analysis'],
                costPerRequest: 0.03,
                averageTokens: 1000,
            },
            {
                id: 'competitor-analysis',
                name: 'Competitor Analysis',
                description: 'Analyze competitors and find content opportunities',
                category: 'analysis',
                icon: 'bar-chart',
                isActive: true,
                isPremium: true,
                usageCount: 0,
                features: ['Competitor content analysis', 'Gap identification', 'Strategy recommendations'],
                costPerRequest: 0.10,
                averageTokens: 2500,
            },
            {
                id: 'content-optimizer',
                name: 'Content Optimizer',
                description: 'Enhance existing content for better performance',
                category: 'optimization',
                icon: 'trending-up',
                isActive: true,
                isPremium: false,
                usageCount: 0,
                maxUsage: 150,
                features: ['Content enhancement', 'Readability improvement', 'SEO optimization'],
                costPerRequest: 0.06,
                averageTokens: 1800,
            },
            {
                id: 'social-media-generator',
                name: 'Social Media Generator',
                description: 'Create engaging social media content across platforms',
                category: 'content',
                icon: 'share',
                isActive: true,
                isPremium: false,
                usageCount: 0,
                maxUsage: 300,
                features: ['Multi-platform content', 'Hashtag generation', 'Engagement optimization'],
                costPerRequest: 0.02,
                averageTokens: 500,
            },
        ];

        let filteredTools = allTools;

        if (category) {
            filteredTools = filteredTools.filter(tool => tool.category === category);
        }

        if (isActive !== undefined) {
            filteredTools = filteredTools.filter(tool => tool.isActive === isActive);
        }

        return filteredTools;
    }

    async getAIToolUsage(userId: string, projectId: string, toolId: string): Promise<AIToolUsageResponse> {
        // Mock implementation - in real scenario, this would query usage tracking
        const mockUsage: AIToolUsageResponse = {
            toolId,
            totalUsage: Math.floor(Math.random() * 100),
            remainingUsage: Math.floor(Math.random() * 50) + 10,
            usageLimit: 100,
            currentPeriodUsage: Math.floor(Math.random() * 30),
            costThisPeriod: Math.random() * 10 + 1,
        };

        return mockUsage;
    }

    async trackAIToolUsage(userId: string, projectId: string, dto: AIToolUsageDto): Promise<{ success: boolean }> {
        // Mock implementation - in real scenario, this would create usage tracking record
        return { success: true };
    }

    async getAIUsageAnalytics(userId: string, projectId: string, dto: AIUsageAnalyticsDto): Promise<AIUsageAnalyticsResponse> {
        // Mock implementation - in real scenario, this would aggregate usage data
        const mockAnalytics: AIUsageAnalyticsResponse = {
            totalRequests: Math.floor(Math.random() * 1000) + 100,
            successfulRequests: Math.floor(Math.random() * 900) + 90,
            failedRequests: Math.floor(Math.random() * 50) + 5,
            totalTokensUsed: Math.floor(Math.random() * 50000) + 5000,
            totalCost: Math.random() * 500 + 50,
            toolUsageBreakdown: [
                {
                    toolId: 'content-generator',
                    toolName: 'Content Generator',
                    requestCount: Math.floor(Math.random() * 200) + 20,
                    tokensUsed: Math.floor(Math.random() * 10000) + 1000,
                    cost: Math.random() * 100 + 10,
                },
                {
                    toolId: 'seo-optimizer',
                    toolName: 'SEO Optimizer',
                    requestCount: Math.floor(Math.random() * 150) + 15,
                    tokensUsed: Math.floor(Math.random() * 8000) + 800,
                    cost: Math.random() * 80 + 8,
                },
            ],
            dailyUsage: Array.from({ length: 30 }, (_, i) => ({
                date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                requests: Math.floor(Math.random() * 50) + 5,
                tokens: Math.floor(Math.random() * 2000) + 200,
                cost: Math.random() * 20 + 2,
            })),
        };

        return mockAnalytics;
    }

    // =============================
    // AI TEMPLATES METHODS
    // =============================

    async createAITemplate(userId: string, projectId: string, dto: AITemplateDto): Promise<AITemplate> {
        // Mock implementation - in real scenario, this would create database record
        const template: AITemplate = {
            id: `template-${Date.now()}`,
            projectId,
            name: dto.name,
            description: dto.description,
            toolId: dto.toolId,
            parameters: dto.parameters,
            isShared: dto.isShared || false,
            createdBy: userId,
            createdAt: new Date().toISOString(),
            usageCount: 0,
        };

        return template;
    }

    async getAITemplates(userId: string, projectId?: string, toolId?: string, isShared?: boolean): Promise<AITemplate[]> {
        // Mock implementation
        const mockTemplates: AITemplate[] = [
            {
                id: 'template-1',
                projectId: projectId || 'project-1',
                name: 'Blog Post Template',
                description: 'Standard blog post generation template',
                toolId: 'content-generator',
                parameters: {
                    tone: 'professional',
                    length: 'medium',
                    includeImages: true,
                },
                isShared: false,
                createdBy: userId,
                createdAt: new Date().toISOString(),
                usageCount: 5,
            },
            {
                id: 'template-2',
                projectId: projectId || 'project-1',
                name: 'SEO Meta Tags Template',
                description: 'Optimized meta tags generation',
                toolId: 'seo-optimizer',
                parameters: {
                    includeKeywords: true,
                    maxTitleLength: 60,
                    maxDescriptionLength: 160,
                },
                isShared: true,
                createdBy: userId,
                createdAt: new Date().toISOString(),
                usageCount: 12,
            },
        ];

        let filteredTemplates = mockTemplates;

        if (toolId) {
            filteredTemplates = filteredTemplates.filter(template => template.toolId === toolId);
        }

        if (isShared !== undefined) {
            filteredTemplates = filteredTemplates.filter(template => template.isShared === isShared);
        }

        return filteredTemplates;
    }

    // =============================
    // AI WORKFLOWS METHODS
    // =============================

    async createAIWorkflow(userId: string, projectId: string, dto: AIWorkflowDto): Promise<AIWorkflow> {
        // Mock implementation
        const workflow: AIWorkflow = {
            id: `workflow-${Date.now()}`,
            projectId,
            name: dto.name,
            description: dto.description,
            steps: dto.steps.map((step, index) => ({
                id: `step-${index}`,
                toolId: step.toolId,
                parameters: step.parameters,
                order: step.order,
                dependsOn: [],
            })),
            isActive: true,
            createdBy: userId,
            createdAt: new Date().toISOString(),
        };

        return workflow;
    }

    async getAIWorkflows(userId: string, projectId: string): Promise<AIWorkflow[]> {
        // Mock implementation
        const mockWorkflows: AIWorkflow[] = [
            {
                id: 'workflow-1',
                projectId,
                name: 'Content Creation Workflow',
                description: 'Complete content creation from research to optimization',
                steps: [
                    {
                        id: 'step-1',
                        toolId: 'keyword-research',
                        parameters: { topic: '', count: 20 },
                        order: 1,
                        dependsOn: [],
                    },
                    {
                        id: 'step-2',
                        toolId: 'content-generator',
                        parameters: { type: 'blog-post' },
                        order: 2,
                        dependsOn: ['step-1'],
                    },
                    {
                        id: 'step-3',
                        toolId: 'seo-optimizer',
                        parameters: {},
                        order: 3,
                        dependsOn: ['step-2'],
                    },
                ],
                isActive: true,
                createdBy: userId,
                createdAt: new Date().toISOString(),
            },
        ];

        return mockWorkflows;
    }

    async executeAIWorkflow(userId: string, projectId: string, workflowId: string, initialInput: any): Promise<any> {
        // Mock implementation
        return {
            workflowExecutionId: `execution-${Date.now()}`,
            status: 'pending',
            steps: [
                {
                    stepId: 'step-1',
                    status: 'pending',
                    output: null,
                },
            ],
        };
    }

    // Test method to debug OpenAI API issues
    async testOpenAIConnection(): Promise<string> {
        try {
            console.log('Testing OpenAI connection...');
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo", // Use cheaper model for testing
                messages: [{ role: "user", content: "Say hello" }],
                max_tokens: 10,
            });

            const response = completion.choices[0].message.content || 'No response';
            console.log('OpenAI test successful:', response);
            return response;
        } catch (error) {
            console.error('OpenAI test failed:', error);
            throw new BadRequestException(`OpenAI connection test failed: ${error.message}`);
        }
    }

    // Fallback mock data generator
    private generateMockKeywordSuggestions(dto: KeywordSuggestionsDto): any[] {
        console.log('=== GENERATING MOCK DATA ===');
        const seedKeyword = dto.seedKeyword.toLowerCase();
        const industry = dto.industry || 'general';
        const location = dto.location || 'global';

        console.log(`Mock data params - seedKeyword: ${seedKeyword}, industry: ${industry}, location: ${location}`);

        // Mock suggestions based on seed keyword
        const mockSuggestions = [
            {
                keyword: `best ${seedKeyword}`,
                searchVolume: 2500,
                difficulty: 65,
                intent: "Commercial",
                relevanceScore: 0.95,
                category: "Comparison"
            },
            {
                keyword: `${seedKeyword} guide`,
                searchVolume: 1800,
                difficulty: 45,
                intent: "Informational",
                relevanceScore: 0.88,
                category: "Education"
            },
            {
                keyword: `how to use ${seedKeyword}`,
                searchVolume: 1200,
                difficulty: 40,
                intent: "Informational",
                relevanceScore: 0.82,
                category: "Tutorial"
            },
            {
                keyword: `${seedKeyword} tips`,
                searchVolume: 950,
                difficulty: 35,
                intent: "Informational",
                relevanceScore: 0.78,
                category: "Tips"
            },
            {
                keyword: `${seedKeyword} for beginners`,
                searchVolume: 800,
                difficulty: 30,
                intent: "Informational",
                relevanceScore: 0.75,
                category: "Education"
            },
            {
                keyword: `free ${seedKeyword}`,
                searchVolume: 1500,
                difficulty: 55,
                intent: "Commercial",
                relevanceScore: 0.85,
                category: "Free"
            },
            {
                keyword: `${seedKeyword} software`,
                searchVolume: 2200,
                difficulty: 70,
                intent: "Commercial",
                relevanceScore: 0.90,
                category: "Software"
            },
            {
                keyword: `${seedKeyword} online`,
                searchVolume: 1100,
                difficulty: 50,
                intent: "Commercial",
                relevanceScore: 0.80,
                category: "Online"
            },
            {
                keyword: `what is ${seedKeyword}`,
                searchVolume: 600,
                difficulty: 25,
                intent: "Informational",
                relevanceScore: 0.70,
                category: "Definition"
            },
            {
                keyword: `${seedKeyword} vs alternatives`,
                searchVolume: 400,
                difficulty: 45,
                intent: "Commercial",
                relevanceScore: 0.68,
                category: "Comparison"
            }
        ];

        // Add industry-specific suggestions if provided
        if (dto.industry && dto.industry !== 'general') {
            mockSuggestions.push({
                keyword: `${seedKeyword} for ${dto.industry.toLowerCase()}`,
                searchVolume: 750,
                difficulty: 42,
                intent: "Commercial",
                relevanceScore: 0.83,
                category: dto.industry
            });
        }

        // Add location-specific suggestions if provided
        if (dto.location && dto.location !== 'global') {
            mockSuggestions.push({
                keyword: `${seedKeyword} in ${dto.location}`,
                searchVolume: 300,
                difficulty: 38,
                intent: "Commercial",
                relevanceScore: 0.72,
                category: "Local"
            });
        }

        const finalSuggestions = mockSuggestions.slice(0, 12);
        console.log('Generated mock suggestions count:', finalSuggestions.length);
        console.log('Mock suggestions preview:', JSON.stringify(finalSuggestions.slice(0, 2), null, 2));

        return finalSuggestions; // Return max 12 suggestions
    }
}


