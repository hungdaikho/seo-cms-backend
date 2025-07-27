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

@Injectable()
export class TopicResearchService {
    private readonly logger = new Logger(TopicResearchService.name);

    async generateTopicIdeas(dto: TopicResearchDto): Promise<TopicResearchResponse> {
        this.logger.log(`Generating topic ideas for: ${dto.seedKeyword}`);

        const limit = dto.limit || 50;
        const topicIdeas: TopicIdea[] = [];

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

        // Generate topic variations
        for (let i = 0; i < limit; i++) {
            const prefix = topicPrefixes[i % topicPrefixes.length];
            const suffix = topicSuffixes[i % topicSuffixes.length];
            const topic = `${prefix} ${dto.seedKeyword} ${suffix}`;

            // Generate related keywords
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
    }

    async getRelatedTopics(dto: RelatedTopicsDto): Promise<RelatedTopicsResponse> {
        this.logger.log(`Getting related topics for: ${dto.topic}`);

        const limit = dto.limit || 30;
        const country = dto.country || 'US';
        const relatedTopics: RelatedTopic[] = [];

        // Generate related topics using semantic variations
        const semanticVariations = [
            `${dto.topic} optimization`, `${dto.topic} strategy`, `${dto.topic} tools`,
            `${dto.topic} analytics`, `${dto.topic} automation`, `${dto.topic} trends`,
            `${dto.topic} best practices`, `${dto.topic} case studies`, `${dto.topic} guide`,
            `Advanced ${dto.topic}`, `${dto.topic} for businesses`, `${dto.topic} ROI`,
            `${dto.topic} metrics`, `${dto.topic} performance`, `${dto.topic} reporting`
        ];

        // Add broader category topics
        const broaderTopics = this.getBroaderTopics(dto.topic);
        const allTopics = [...semanticVariations, ...broaderTopics].slice(0, limit);

        for (const topic of allTopics) {
            relatedTopics.push({
                topic,
                relevance: Math.floor(Math.random() * 100) + 1,
                volume: Math.floor(Math.random() * 15000) + 500,
                difficulty: Math.floor(Math.random() * 100) + 1,
                trending: Math.random() > 0.7, // 30% chance of being trending
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
    }

    async getTopicQuestions(dto: TopicQuestionsDto): Promise<TopicQuestionsResponse> {
        this.logger.log(`Getting questions for topic: ${dto.topic}`);

        const limit = dto.limit || 50;
        const country = dto.country || 'US';
        const questions: TopicQuestion[] = [];

        // Question templates for different intents
        const questionTemplates = {
            what: [
                `What is ${dto.topic}?`,
                `What are the benefits of ${dto.topic}?`,
                `What are the best ${dto.topic} tools?`,
                `What is the future of ${dto.topic}?`,
                `What are ${dto.topic} best practices?`
            ],
            how: [
                `How to implement ${dto.topic}?`,
                `How to measure ${dto.topic} success?`,
                `How to optimize ${dto.topic}?`,
                `How to start with ${dto.topic}?`,
                `How does ${dto.topic} work?`
            ],
            why: [
                `Why is ${dto.topic} important?`,
                `Why use ${dto.topic} for business?`,
                `Why invest in ${dto.topic}?`,
                `Why ${dto.topic} fails?`,
                `Why choose ${dto.topic} over alternatives?`
            ],
            when: [
                `When to use ${dto.topic}?`,
                `When to implement ${dto.topic}?`,
                `When does ${dto.topic} show results?`,
                `When to hire ${dto.topic} experts?`,
                `When to update ${dto.topic} strategy?`
            ],
            where: [
                `Where to learn ${dto.topic}?`,
                `Where to find ${dto.topic} experts?`,
                `Where to implement ${dto.topic}?`,
                `Where to get ${dto.topic} tools?`,
                `Where ${dto.topic} is heading?`
            ],
            who: [
                `Who needs ${dto.topic}?`,
                `Who are ${dto.topic} experts?`,
                `Who benefits from ${dto.topic}?`,
                `Who provides ${dto.topic} services?`,
                `Who should implement ${dto.topic}?`
            ]
        };

        // Generate questions from all categories
        const allQuestions: { question: string; type: keyof typeof questionTemplates }[] = [];

        Object.entries(questionTemplates).forEach(([type, templates]) => {
            templates.forEach(template => {
                allQuestions.push({
                    question: template,
                    type: type as keyof typeof questionTemplates
                });
            });
        });

        // Add more specific questions
        const specificQuestions = this.generateSpecificQuestions(dto.topic, limit - allQuestions.length);

        // Combine and shuffle
        const combinedQuestions = [...allQuestions, ...specificQuestions].slice(0, limit);

        for (const { question, type } of combinedQuestions) {
            questions.push({
                question,
                volume: Math.floor(Math.random() * 5000) + 100,
                difficulty: Math.floor(Math.random() * 100) + 1,
                intent: this.getQuestionIntent(question),
                relatedKeywords: this.generateRelatedKeywords(question, 3),
                competitiveness: Math.floor(Math.random() * 100) + 1,
                answerLength: ['short', 'medium', 'long'][Math.floor(Math.random() * 3)] as 'short' | 'medium' | 'long'
            });
        }

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
        // This would ideally use NLP or predefined topic hierarchies
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
        // Simple clustering based on common words
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

    private generateSpecificQuestions(topic: string, count: number): { question: string; type: string }[] {
        const questions: { question: string; type: string }[] = [];
        const questionStarters = ['How much', 'How long', 'How often', 'Which', 'Should I', 'Can you', 'Is it'];

        for (let i = 0; i < count; i++) {
            const starter = questionStarters[i % questionStarters.length];
            questions.push({
                question: `${starter} ${topic}?`,
                type: 'specific'
            });
        }

        return questions;
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
}
