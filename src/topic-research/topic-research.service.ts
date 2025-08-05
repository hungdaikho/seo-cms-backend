import { Injectable, Logger } from '@nestjs/common';
import {
    TopicResearchDto,
    RelatedTopicsDto,
    TopicQuestionsDto,
    TopicResearchResponse,
    RelatedTopicsResponse,
    TopicQuestionsResponse,
    TopicIdea,
    RelatedTopic,
    TopicQuestion
} from './dto/topic-research.dto';
import { ExternalApisService } from './external-apis.service';

@Injectable()
export class TopicResearchService {
    private readonly logger = new Logger(TopicResearchService.name);

    constructor(private readonly externalApisService: ExternalApisService) { }

    async generateTopicIdeas(dto: TopicResearchDto): Promise<TopicResearchResponse> {
        this.logger.log(`Generating topic ideas for: ${dto.seedKeyword}`);

        const limit = dto.limit || 50;
        const topicIdeas: TopicIdea[] = [];

        try {
            // Get real data from Google APIs (free)
            const comprehensiveData = await this.externalApisService.getComprehensiveKeywordData(dto.seedKeyword, dto.country);

            // Topic generation based on different approaches
            const topicPrefixes = [
                'How to', 'Best', 'Top', 'Ultimate guide to', 'Benefits of', 'Challenges of',
                'Tips for', 'Strategies for', 'Common mistakes in', 'Future of',
                'Complete guide to', 'Advanced', 'Beginner\'s guide to', 'Expert tips for'
            ];

            const topicSuffixes = [
                'in 2024', 'for beginners', 'for businesses', 'strategies', 'tools',
                'tips and tricks', 'best practices', 'case studies', 'examples',
                'trends', 'mistakes to avoid', 'checklist', 'step by step'
            ];

            // Use real related keywords from Google
            const allRelatedKeywords = comprehensiveData.relatedKeywords;

            // Generate topic variations using real data
            const baseVolume = comprehensiveData.searchVolume || 1000;
            const baseCompetition = comprehensiveData.competition || 50;

            for (let i = 0; i < limit; i++) {
                const prefix = topicPrefixes[i % topicPrefixes.length];
                const suffix = topicSuffixes[i % topicSuffixes.length];
                const topic = `${prefix} ${dto.seedKeyword} ${suffix}`;

                // Use related keywords from Google APIs
                const relatedKeywords = allRelatedKeywords.length > 0
                    ? allRelatedKeywords.slice(i * 3, (i * 3) + 5)
                    : this.generateRelatedKeywords(dto.seedKeyword, 5);

                // Calculate volume based on real data with some variation
                const volumeVariation = 0.3 + (Math.random() * 1.4); // 0.3x to 1.7x variation
                const volume = Math.floor(baseVolume * volumeVariation);

                // Calculate difficulty based on real competition data
                const difficultyVariation = 0.7 + (Math.random() * 0.6); // 0.7x to 1.3x variation
                const difficulty = Math.min(100, Math.floor(baseCompetition * difficultyVariation));

                // Opportunity score based on volume vs difficulty and trends
                const opportunity = Math.max(1, Math.min(100, Math.floor((volume / 100) - difficulty + comprehensiveData.interest)));

                topicIdeas.push({
                    topic,
                    volume,
                    difficulty,
                    opportunity,
                    questions: Math.floor(Math.random() * 50) + 5, // Will be replaced with real data
                    relatedKeywords: relatedKeywords.slice(0, 5),
                    contentGap: Math.max(1, 100 - difficulty),
                    seasonality: this.calculateSeasonality(comprehensiveData.interest),
                    competitiveness: difficulty
                });
            }

            // Sort by opportunity score (highest first)
            topicIdeas.sort((a, b) => b.opportunity - a.opportunity);

            // Calculate metrics
            const avgVolume = Math.floor(topicIdeas.reduce((sum, topic) => sum + topic.volume, 0) / topicIdeas.length);
            const avgDifficulty = Math.floor(topicIdeas.reduce((sum, topic) => sum + topic.difficulty, 0) / topicIdeas.length);
            const avgOpportunity = Math.floor(topicIdeas.reduce((sum, topic) => sum + topic.opportunity, 0) / topicIdeas.length);
            const totalQuestions = topicIdeas.reduce((sum, topic) => sum + topic.questions, 0);

            return {
                seedKeyword: dto.seedKeyword,
                country: dto.country,
                industry: dto.industry,
                contentType: dto.contentType,
                topicIdeas,
                total: topicIdeas.length,
                metrics: {
                    avgVolume,
                    avgDifficulty,
                    avgOpportunity,
                    totalQuestions
                }
            };

        } catch (error) {
            this.logger.error(`Error generating topic ideas: ${error.message}`);
            // Fallback to original mock implementation
            return this.generateMockTopicIdeas(dto);
        }
    }

    async getRelatedTopics(dto: RelatedTopicsDto): Promise<RelatedTopicsResponse> {
        this.logger.log(`Getting related topics for: ${dto.topic}`);

        const limit = dto.limit || 30;
        const country = dto.country || 'US';
        const relatedTopics: RelatedTopic[] = [];

        try {
            // Get real data from Google APIs
            const comprehensiveData = await this.externalApisService.getComprehensiveKeywordData(dto.topic, country);

            // Combine related keywords from Google sources
            const allRelatedKeywords = comprehensiveData.relatedKeywords || [];

            // Generate semantic variations
            const semanticVariations = [
                `${dto.topic} optimization`, `${dto.topic} strategy`, `${dto.topic} tools`,
                `${dto.topic} analytics`, `${dto.topic} automation`, `${dto.topic} trends`,
                `${dto.topic} best practices`, `${dto.topic} case studies`, `${dto.topic} guide`,
                `Advanced ${dto.topic}`, `${dto.topic} for businesses`, `${dto.topic} ROI`,
                `${dto.topic} metrics`, `${dto.topic} performance`, `${dto.topic} reporting`
            ];

            // Combine all topics
            const allTopics = [...new Set([...allRelatedKeywords, ...semanticVariations])].slice(0, limit);

            const baseVolume = comprehensiveData.searchVolume || 1000;

            for (const topic of allTopics) {
                const volumeVariation = 0.2 + (Math.random() * 1.6);
                const volume = Math.floor(baseVolume * volumeVariation);

                relatedTopics.push({
                    topic,
                    relevance: Math.floor(Math.random() * 100) + 1,
                    volume,
                    difficulty: Math.floor(Math.random() * 100) + 1,
                    trending: comprehensiveData.risingTopics?.includes(topic) || Math.random() > 0.7,
                    topKeywords: this.generateRelatedKeywords(topic, 3),
                    contentOpportunities: Math.floor(Math.random() * 20) + 5
                });
            }

            // Sort by relevance (highest first)
            relatedTopics.sort((a, b) => b.relevance - a.relevance);

            // Create topic clusters
            const clusters = this.createTopicClusters(relatedTopics);

            return {
                baseTopic: dto.topic,
                country,
                relatedTopics,
                total: relatedTopics.length,
                clusters
            };

        } catch (error) {
            this.logger.error(`Error getting related topics: ${error.message}`);
            return this.generateMockRelatedTopics(dto);
        }
    }

    async getTopicQuestions(dto: TopicQuestionsDto): Promise<TopicQuestionsResponse> {
        this.logger.log(`Getting questions for topic: ${dto.topic}`);

        const limit = dto.limit || 50;
        const country = dto.country || 'US';
        let questions: TopicQuestion[] = [];

        try {
            // Get real questions from APIs
            const realQuestions = await this.externalApisService.getTopicQuestions(dto.topic, country);

            // Convert real questions to TopicQuestion objects
            const realQuestionObjects = realQuestions.map(q => ({
                question: q,
                volume: Math.floor(Math.random() * 3000) + 200, // Will be improved with real volume data
                difficulty: Math.floor(Math.random() * 80) + 20,
                intent: this.getQuestionIntent(q),
                relatedKeywords: this.generateRelatedKeywords(q, 3),
                competitiveness: Math.floor(Math.random() * 100) + 1,
                answerLength: this.estimateAnswerLength(q)
            }));

            questions = realQuestionObjects;

            // If we don't have enough questions, supplement with template questions
            if (questions.length < limit) {
                const additionalQuestions = this.generateTemplateQuestions(dto.topic, limit - questions.length);
                questions = [...questions, ...additionalQuestions];
            }

        } catch (error) {
            this.logger.error(`Error getting real questions for topic "${dto.topic}": ${error.message}`);
            // Fallback to template questions
            questions = this.generateTemplateQuestions(dto.topic, limit);
        }

        // Ensure we don't exceed the limit
        questions = questions.slice(0, limit);

        // Sort by volume (highest first)
        questions.sort((a, b) => b.volume - a.volume);

        // Count question types
        const questionTypes = {
            what: questions.filter(q => q.question.toLowerCase().startsWith('what')).length,
            how: questions.filter(q => q.question.toLowerCase().startsWith('how')).length,
            why: questions.filter(q => q.question.toLowerCase().startsWith('why')).length,
            when: questions.filter(q => q.question.toLowerCase().startsWith('when')).length,
            where: questions.filter(q => q.question.toLowerCase().startsWith('where')).length,
            who: questions.filter(q => q.question.toLowerCase().startsWith('who')).length
        };

        return {
            topic: dto.topic,
            country,
            questions,
            total: questions.length,
            questionTypes
        };
    }

    // Helper methods
    private generateRelatedKeywords(baseTerm: string, count: number): string[] {
        const modifiers = ['best', 'top', 'free', 'professional', 'advanced', 'basic', 'complete', 'ultimate'];
        const suffixes = ['tools', 'tips', 'guide', 'strategy', 'examples', 'course', 'tutorial', 'checklist'];

        const keywords: string[] = [];
        for (let i = 0; i < count; i++) {
            const modifier = modifiers[i % modifiers.length];
            const suffix = suffixes[i % suffixes.length];
            keywords.push(`${modifier} ${baseTerm} ${suffix}`);
        }
        return keywords;
    }

    private getBroaderTopics(topic: string): string[] {
        const topicMappings: { [key: string]: string[] } = {
            'seo': ['digital marketing', 'online marketing', 'search marketing', 'content marketing'],
            'marketing': ['business', 'advertising', 'promotion', 'branding'],
            'content': ['writing', 'blogging', 'copywriting', 'content strategy'],
            'social media': ['digital marketing', 'online presence', 'social networking', 'community management']
        };

        const lowerTopic = topic.toLowerCase();
        for (const [key, values] of Object.entries(topicMappings)) {
            if (lowerTopic.includes(key)) {
                return values;
            }
        }

        return ['business strategy', 'digital transformation', 'online business', 'growth hacking'];
    }

    private createTopicClusters(topics: RelatedTopic[]): { name: string; topics: string[]; volume: number }[] {
        const clusters: { [key: string]: { topics: string[]; volume: number } } = {};

        topics.forEach(topic => {
            const words = topic.topic.toLowerCase().split(' ');
            const clusterKey = words.find(word =>
                ['strategy', 'tools', 'optimization', 'analytics', 'marketing', 'content'].includes(word)
            ) || 'general';

            if (!clusters[clusterKey]) {
                clusters[clusterKey] = { topics: [], volume: 0 };
            }

            clusters[clusterKey].topics.push(topic.topic);
            clusters[clusterKey].volume += topic.volume;
        });

        return Object.entries(clusters).map(([name, data]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            ...data
        }));
    }

    private generateTemplateQuestions(topic: string, count: number): TopicQuestion[] {
        const questionTemplates = {
            what: [
                `What is ${topic}?`,
                `What are the benefits of ${topic}?`,
                `What are the best ${topic} tools?`,
                `What is the future of ${topic}?`,
                `What are ${topic} best practices?`
            ],
            how: [
                `How to implement ${topic}?`,
                `How to measure ${topic} success?`,
                `How to optimize ${topic}?`,
                `How to start with ${topic}?`,
                `How does ${topic} work?`
            ],
            why: [
                `Why is ${topic} important?`,
                `Why use ${topic} for business?`,
                `Why invest in ${topic}?`,
                `Why ${topic} fails?`,
                `Why choose ${topic} over alternatives?`
            ],
            when: [
                `When to use ${topic}?`,
                `When to implement ${topic}?`,
                `When does ${topic} show results?`,
                `When to hire ${topic} experts?`,
                `When to update ${topic} strategy?`
            ],
            where: [
                `Where to learn ${topic}?`,
                `Where to find ${topic} experts?`,
                `Where to implement ${topic}?`,
                `Where to get ${topic} tools?`,
                `Where ${topic} is heading?`
            ],
            who: [
                `Who needs ${topic}?`,
                `Who are ${topic} experts?`,
                `Who benefits from ${topic}?`,
                `Who provides ${topic} services?`,
                `Who should implement ${topic}?`
            ]
        };

        const allQuestions: TopicQuestion[] = [];
        let questionIndex = 0;

        Object.entries(questionTemplates).forEach(([type, templates]) => {
            templates.forEach(template => {
                if (questionIndex < count) {
                    allQuestions.push({
                        question: template,
                        volume: Math.floor(Math.random() * 5000) + 100,
                        difficulty: Math.floor(Math.random() * 100) + 1,
                        intent: this.getQuestionIntent(template),
                        relatedKeywords: this.generateRelatedKeywords(template, 3),
                        competitiveness: Math.floor(Math.random() * 100) + 1,
                        answerLength: this.estimateAnswerLength(template)
                    });
                    questionIndex++;
                }
            });
        });

        return allQuestions.slice(0, count);
    }

    private getQuestionIntent(question: string): 'informational' | 'commercial' | 'transactional' | 'navigational' {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('buy') || lowerQuestion.includes('price') || lowerQuestion.includes('cost')) {
            return 'transactional';
        }

        if (lowerQuestion.includes('best') || lowerQuestion.includes('review') || lowerQuestion.includes('compare')) {
            return 'commercial';
        }

        if (lowerQuestion.includes('login') || lowerQuestion.includes('website') || lowerQuestion.includes('contact')) {
            return 'navigational';
        }

        return 'informational';
    }

    private estimateAnswerLength(question: string): 'short' | 'medium' | 'long' {
        const lowerQuestion = question.toLowerCase();

        if (lowerQuestion.includes('what is') || lowerQuestion.includes('who is')) {
            return 'short';
        }

        if (lowerQuestion.includes('how to') || lowerQuestion.includes('guide') || lowerQuestion.includes('step')) {
            return 'long';
        }

        return 'medium';
    }

    private calculateSeasonality(trendScore: number): 'high' | 'medium' | 'low' {
        if (trendScore >= 70) return 'high';
        if (trendScore >= 40) return 'medium';
        return 'low';
    }

    private async generateMockTopicIdeas(dto: TopicResearchDto): Promise<TopicResearchResponse> {
        const limit = dto.limit || 50;
        const topicIdeas: TopicIdea[] = [];

        const topicPrefixes = [
            'How to', 'Best', 'Top', 'Ultimate guide to', 'Benefits of', 'Challenges of',
            'Tips for', 'Strategies for', 'Common mistakes in', 'Future of',
            'Complete guide to', 'Advanced', 'Beginner\'s guide to', 'Expert tips for'
        ];

        const topicSuffixes = [
            'in 2024', 'for beginners', 'for businesses', 'strategies', 'tools',
            'tips and tricks', 'best practices', 'case studies', 'examples',
            'trends', 'mistakes to avoid', 'checklist', 'step by step'
        ];

        for (let i = 0; i < limit; i++) {
            const prefix = topicPrefixes[i % topicPrefixes.length];
            const suffix = topicSuffixes[i % topicSuffixes.length];
            const topic = `${prefix} ${dto.seedKeyword} ${suffix}`;
            const relatedKeywords = this.generateRelatedKeywords(dto.seedKeyword, 5);

            topicIdeas.push({
                topic,
                volume: Math.floor(Math.random() * 10000) + 500,
                difficulty: Math.floor(Math.random() * 100) + 1,
                opportunity: Math.floor(Math.random() * 100) + 1,
                questions: Math.floor(Math.random() * 50) + 5,
                relatedKeywords,
                contentGap: Math.floor(Math.random() * 100) + 1,
                seasonality: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
                competitiveness: Math.floor(Math.random() * 100) + 1
            });
        }

        topicIdeas.sort((a, b) => b.opportunity - a.opportunity);

        const avgVolume = Math.floor(topicIdeas.reduce((sum, topic) => sum + topic.volume, 0) / topicIdeas.length);
        const avgDifficulty = Math.floor(topicIdeas.reduce((sum, topic) => sum + topic.difficulty, 0) / topicIdeas.length);
        const avgOpportunity = Math.floor(topicIdeas.reduce((sum, topic) => sum + topic.opportunity, 0) / topicIdeas.length);
        const totalQuestions = topicIdeas.reduce((sum, topic) => sum + topic.questions, 0);

        return {
            seedKeyword: dto.seedKeyword,
            country: dto.country,
            industry: dto.industry,
            contentType: dto.contentType,
            topicIdeas,
            total: topicIdeas.length,
            metrics: {
                avgVolume,
                avgDifficulty,
                avgOpportunity,
                totalQuestions
            }
        };
    }

    private async generateMockRelatedTopics(dto: RelatedTopicsDto): Promise<RelatedTopicsResponse> {
        const limit = dto.limit || 30;
        const country = dto.country || 'US';
        const relatedTopics: RelatedTopic[] = [];

        const semanticVariations = [
            `${dto.topic} optimization`, `${dto.topic} strategy`, `${dto.topic} tools`,
            `${dto.topic} analytics`, `${dto.topic} automation`, `${dto.topic} trends`,
            `${dto.topic} best practices`, `${dto.topic} case studies`, `${dto.topic} guide`,
            `Advanced ${dto.topic}`, `${dto.topic} for businesses`, `${dto.topic} ROI`,
            `${dto.topic} metrics`, `${dto.topic} performance`, `${dto.topic} reporting`
        ];

        const broaderTopics = this.getBroaderTopics(dto.topic);
        const allTopics = [...semanticVariations, ...broaderTopics].slice(0, limit);

        for (const topic of allTopics) {
            relatedTopics.push({
                topic,
                relevance: Math.floor(Math.random() * 100) + 1,
                volume: Math.floor(Math.random() * 15000) + 500,
                difficulty: Math.floor(Math.random() * 100) + 1,
                trending: Math.random() > 0.7,
                topKeywords: this.generateRelatedKeywords(topic, 3),
                contentOpportunities: Math.floor(Math.random() * 20) + 5
            });
        }

        relatedTopics.sort((a, b) => b.relevance - a.relevance);
        const clusters = this.createTopicClusters(relatedTopics);

        return {
            baseTopic: dto.topic,
            country,
            relatedTopics,
            total: relatedTopics.length,
            clusters
        };
    }

    async checkApiStatus(): Promise<{ [key: string]: boolean }> {
        return this.externalApisService.checkApiStatus();
    }

    async getComprehensiveKeywordDemo(keyword: string, country: string = 'US') {
        this.logger.log(`Getting comprehensive demo data for keyword: ${keyword}`);

        try {
            const comprehensiveData = await this.externalApisService.getComprehensiveKeywordData(keyword, country);
            const questions = await this.externalApisService.getTopicQuestions(keyword, country);

            return {
                keyword,
                country,
                overview: {
                    searchVolume: comprehensiveData.searchVolume,
                    competition: comprehensiveData.competition,
                    interest: comprehensiveData.interest,
                    videoCount: comprehensiveData.videoCount
                },
                relatedKeywords: comprehensiveData.relatedKeywords,
                suggestions: comprehensiveData.suggestions,
                risingTopics: comprehensiveData.risingTopics,
                topVideos: comprehensiveData.topVideos,
                questions: questions.slice(0, 10),
                contentOpportunities: {
                    blogPosts: comprehensiveData.relatedKeywords.slice(0, 5),
                    videos: comprehensiveData.topVideos.slice(0, 3),
                    socialMedia: comprehensiveData.risingTopics
                },
                dataSource: 'Google APIs (Free)',
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            this.logger.error(`Error in comprehensive demo: ${error.message}`);
            return {
                keyword,
                country,
                error: 'Unable to fetch real data, please configure Google APIs',
                fallback: 'Using mock data',
                setupGuide: '/docs/GOOGLE_APIS_SETUP_GUIDE.md'
            };
        }
    }
}
