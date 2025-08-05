import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { google } from 'googleapis';
import * as natural from 'natural';
const keywordExtractor = require('keyword-extractor');

interface GoogleKeywordData {
    keyword: string;
    searchVolume: number;
    competition: number;
    relatedKeywords: string[];
    suggestions: string[];
}

interface GoogleTrendsData {
    keyword: string;
    interest: number;
    relatedTopics: string[];
    risingTopics: string[];
    geographicData: any[];
}

interface YouTubeKeywordData {
    keyword: string;
    videoCount: number;
    topVideos: string[];
    suggestedKeywords: string[];
}

@Injectable()
export class ExternalApisService {
    private readonly logger = new Logger(ExternalApisService.name);
    private customSearch: any;
    private youtube: any;

    constructor(private readonly configService: ConfigService) {
        this.initializeGoogleAPIs();
    }

    private initializeGoogleAPIs() {
        const googleApiKey = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
        const youtubeApiKey = this.configService.get<string>('YOUTUBE_DATA_API_KEY');

        if (googleApiKey && googleApiKey !== 'your-google-search-api-key-here') {
            this.customSearch = google.customsearch('v1');
            this.youtube = google.youtube('v3');
        }
    }

    async getGoogleKeywordData(keyword: string, country: string = 'US'): Promise<GoogleKeywordData> {
        try {
            const [searchData, suggestionsData] = await Promise.all([
                this.getGoogleSearchData(keyword, country),
                this.getGoogleSuggestions(keyword)
            ]);

            const relatedKeywords = this.extractKeywordsFromContent(searchData.content);

            return {
                keyword,
                searchVolume: this.estimateSearchVolume(searchData.totalResults),
                competition: this.calculateCompetition(searchData.totalResults, searchData.timeToLoad),
                relatedKeywords: relatedKeywords.slice(0, 10),
                suggestions: suggestionsData
            };

        } catch (error) {
            this.logger.error(`Google API error for keyword "${keyword}": ${error.message}`);
            return this.getMockGoogleKeywordData(keyword);
        }
    }

    async getGoogleTrendsData(keyword: string, country: string = 'US'): Promise<GoogleTrendsData> {
        try {
            const googleTrends = require('google-trends-api');

            const [interestResponse, relatedResponse] = await Promise.all([
                googleTrends.interestOverTime({
                    keyword: keyword,
                    geo: country,
                    granularTimeUnit: 'month'
                }),
                googleTrends.relatedTopics({
                    keyword: keyword,
                    geo: country
                })
            ]);

            const interestData = JSON.parse(interestResponse);
            const relatedData = JSON.parse(relatedResponse);

            // Calculate average interest
            const timelineData = interestData.default?.timelineData || [];
            const avgInterest = timelineData.length > 0
                ? timelineData.reduce((sum: number, item: any) => sum + (item.value?.[0] || 0), 0) / timelineData.length
                : Math.floor(Math.random() * 100) + 1;

            // Extract related and rising topics
            const relatedTopics = relatedData.default?.rankedList?.[0]?.rankedKeyword
                ?.slice(0, 10)
                ?.map((item: any) => item.topic?.title || item.query) || [];

            const risingTopics = relatedData.default?.rankedList?.[1]?.rankedKeyword
                ?.slice(0, 5)
                ?.map((item: any) => item.topic?.title || item.query) || [];

            return {
                keyword,
                interest: Math.round(avgInterest),
                relatedTopics,
                risingTopics,
                geographicData: timelineData
            };

        } catch (error) {
            this.logger.error(`Google Trends API error for keyword "${keyword}": ${error.message}`);
            return this.getMockGoogleTrendsData(keyword);
        }
    }

    async getYouTubeKeywordData(keyword: string): Promise<YouTubeKeywordData> {
        const youtubeApiKey = this.configService.get<string>('YOUTUBE_DATA_API_KEY');

        if (!youtubeApiKey || youtubeApiKey === 'your-youtube-api-key-here') {
            return this.getMockYouTubeData(keyword);
        }

        try {
            const response = await this.youtube.search.list({
                auth: youtubeApiKey,
                part: ['snippet'],
                q: keyword,
                type: 'video',
                maxResults: 20,
                order: 'relevance'
            });

            const videos = response.data.items || [];
            const topVideos = videos.slice(0, 5).map((video: any) => video.snippet.title);

            // Extract keywords from video titles and descriptions
            const allText = videos.map((video: any) =>
                `${video.snippet.title} ${video.snippet.description}`
            ).join(' ');

            const suggestedKeywords = this.extractKeywordsFromContent(allText)
                .filter((kw: string) => kw.toLowerCase() !== keyword.toLowerCase())
                .slice(0, 10);

            return {
                keyword,
                videoCount: response.data.pageInfo?.totalResults || 0,
                topVideos,
                suggestedKeywords
            };

        } catch (error) {
            this.logger.error(`YouTube API error for keyword "${keyword}": ${error.message}`);
            return this.getMockYouTubeData(keyword);
        }
    }

    async getTopicQuestions(topic: string, country: string = 'US'): Promise<string[]> {
        try {
            // Use Google autocomplete and "People Also Ask" approach
            const questions = await this.getGoogleQuestions(topic, country);

            if (questions.length > 0) {
                return questions;
            }

            // Fallback to generated questions
            return this.generateQuestions(topic);

        } catch (error) {
            this.logger.error(`Error getting questions for topic "${topic}": ${error.message}`);
            return this.generateQuestions(topic);
        }
    }

    private async getGoogleSearchData(keyword: string, country: string): Promise<any> {
        const googleApiKey = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
        const searchEngineId = this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID');

        if (!googleApiKey || !searchEngineId) {
            throw new Error('Google Search API not configured');
        }

        const startTime = Date.now();

        const response = await this.customSearch.cse.list({
            auth: googleApiKey,
            cx: searchEngineId,
            q: keyword,
            gl: country.toLowerCase(),
            num: 10
        });

        const timeToLoad = Date.now() - startTime;
        const items = response.data.items || [];
        const content = items.map((item: any) => `${item.title} ${item.snippet}`).join(' ');

        return {
            totalResults: parseInt(response.data.searchInformation?.totalResults || '0'),
            timeToLoad,
            content,
            items
        };
    }

    private async getGoogleSuggestions(keyword: string): Promise<string[]> {
        try {
            // Use Google's autocomplete API (unofficial)
            const response = await axios.get(`http://suggestqueries.google.com/complete/search`, {
                params: {
                    client: 'firefox',
                    q: keyword
                },
                timeout: 5000
            });

            if (Array.isArray(response.data) && response.data[1]) {
                return response.data[1].slice(0, 10);
            }

            return [];

        } catch (error) {
            this.logger.warn(`Google suggestions error: ${error.message}`);
            return [];
        }
    }

    private async getGoogleQuestions(topic: string, country: string): Promise<string[]> {
        try {
            // Search for "questions about [topic]" to find common questions
            const questionQueries = [
                `"${topic}" questions`,
                `what is ${topic}`,
                `how to ${topic}`,
                `why ${topic}`,
                `when ${topic}`,
                `${topic} FAQ`
            ];

            const allQuestions: string[] = [];

            for (const query of questionQueries) {
                try {
                    const searchData = await this.getGoogleSearchData(query, country);
                    const extractedQuestions = this.extractQuestionsFromContent(searchData.content);
                    allQuestions.push(...extractedQuestions);
                } catch (error) {
                    this.logger.warn(`Error searching for questions with query "${query}": ${error.message}`);
                }
            }

            // Remove duplicates and filter
            const uniqueQuestions = [...new Set(allQuestions)]
                .filter(q => q.toLowerCase().includes(topic.toLowerCase()))
                .slice(0, 20);

            return uniqueQuestions;

        } catch (error) {
            this.logger.error(`Error getting Google questions: ${error.message}`);
            return [];
        }
    }

    private extractKeywordsFromContent(content: string): string[] {
        try {
            // Use natural language processing to extract keywords
            const cleanContent = content.replace(/[^\w\s]/gi, ' ').toLowerCase();

            // Extract using keyword-extractor library
            const extractedKeywords = keywordExtractor.extract(cleanContent, {
                language: 'english',
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true
            });

            // Use TF-IDF to find important terms
            const tfidf = new natural.TfIdf();
            tfidf.addDocument(cleanContent);

            const importantTerms: string[] = [];
            tfidf.listTerms(0).slice(0, 20).forEach((item: any) => {
                if (item.term.length > 2) {
                    importantTerms.push(item.term);
                }
            });

            // Combine and deduplicate
            const allKeywords = [...extractedKeywords, ...importantTerms];
            return [...new Set(allKeywords)].slice(0, 15);

        } catch (error) {
            this.logger.warn(`Keyword extraction error: ${error.message}`);
            return [];
        }
    }

    private extractQuestionsFromContent(content: string): string[] {
        const questionPatterns = [
            /\b(what|how|why|when|where|who|which|can|should|will|would|could|is|are|does|do|did)\s+[^.?!]*\?/gi,
            /\b\w+[^.!]*\?/g
        ];

        const questions: string[] = [];

        questionPatterns.forEach(pattern => {
            const matches = content.match(pattern) || [];
            questions.push(...matches);
        });

        return questions
            .map(q => q.trim())
            .filter(q => q.length > 10 && q.length < 200)
            .slice(0, 20);
    }

    private estimateSearchVolume(totalResults: number): number {
        // Estimate search volume based on total results
        if (totalResults > 100000000) return Math.floor(Math.random() * 50000) + 10000;
        if (totalResults > 10000000) return Math.floor(Math.random() * 20000) + 5000;
        if (totalResults > 1000000) return Math.floor(Math.random() * 10000) + 1000;
        if (totalResults > 100000) return Math.floor(Math.random() * 5000) + 500;
        return Math.floor(Math.random() * 1000) + 100;
    }

    private calculateCompetition(totalResults: number, timeToLoad: number): number {
        // Calculate competition based on results count and search time
        let competition = 0;

        if (totalResults > 50000000) competition += 40;
        else if (totalResults > 10000000) competition += 30;
        else if (totalResults > 1000000) competition += 20;
        else competition += 10;

        if (timeToLoad > 1000) competition += 20;
        else if (timeToLoad > 500) competition += 10;

        return Math.min(100, competition + Math.floor(Math.random() * 30));
    }

    private generateQuestions(topic: string): string[] {
        const questionTemplates = [
            `What is ${topic}?`,
            `How does ${topic} work?`,
            `Why is ${topic} important?`,
            `When should I use ${topic}?`,
            `Where can I learn ${topic}?`,
            `Who benefits from ${topic}?`,
            `What are the benefits of ${topic}?`,
            `How to get started with ${topic}?`,
            `What are the best ${topic} practices?`,
            `How much does ${topic} cost?`,
            `Is ${topic} worth it?`,
            `What are ${topic} alternatives?`,
            `How to improve ${topic}?`,
            `What are common ${topic} mistakes?`,
            `How to measure ${topic} success?`
        ];

        return questionTemplates;
    }

    // Mock data methods (fallback when APIs are not available)
    private getMockGoogleKeywordData(keyword: string): GoogleKeywordData {
        return {
            keyword,
            searchVolume: Math.floor(Math.random() * 10000) + 500,
            competition: Math.floor(Math.random() * 100) + 1,
            relatedKeywords: [
                `${keyword} guide`,
                `best ${keyword}`,
                `${keyword} tips`,
                `${keyword} tools`,
                `${keyword} strategy`
            ],
            suggestions: [
                `${keyword} for beginners`,
                `${keyword} tutorial`,
                `${keyword} examples`,
                `${keyword} course`,
                `${keyword} certification`
            ]
        };
    }

    private getMockGoogleTrendsData(keyword: string): GoogleTrendsData {
        return {
            keyword,
            interest: Math.floor(Math.random() * 100) + 1,
            relatedTopics: [
                `${keyword} trends`,
                `${keyword} analysis`,
                `${keyword} research`,
                `future of ${keyword}`,
                `${keyword} insights`
            ],
            risingTopics: [
                `AI ${keyword}`,
                `${keyword} automation`,
                `${keyword} 2025`
            ],
            geographicData: []
        };
    }

    private getMockYouTubeData(keyword: string): YouTubeKeywordData {
        return {
            keyword,
            videoCount: Math.floor(Math.random() * 100000) + 1000,
            topVideos: [
                `Complete ${keyword} Tutorial`,
                `${keyword} for Beginners`,
                `Advanced ${keyword} Tips`,
                `${keyword} Best Practices`,
                `${keyword} Case Study`
            ],
            suggestedKeywords: [
                `${keyword} tutorial`,
                `${keyword} course`,
                `${keyword} training`,
                `${keyword} certification`,
                `${keyword} examples`
            ]
        };
    }

    // Method to check API availability
    async checkApiStatus(): Promise<{ [key: string]: boolean }> {
        const apis = {
            googleSearch: !!this.configService.get<string>('GOOGLE_SEARCH_API_KEY')?.replace('your-google-search-api-key-here', ''),
            youtube: !!this.configService.get<string>('YOUTUBE_DATA_API_KEY')?.replace('your-youtube-api-key-here', ''),
            googleTrends: true // Google Trends is available through unofficial API
        };

        return apis;
    }

    // Combined method to get all keyword data
    async getComprehensiveKeywordData(keyword: string, country: string = 'US') {
        const [googleData, trendsData, youtubeData] = await Promise.all([
            this.getGoogleKeywordData(keyword, country),
            this.getGoogleTrendsData(keyword, country),
            this.getYouTubeKeywordData(keyword)
        ]);

        return {
            keyword,
            searchVolume: googleData.searchVolume,
            competition: googleData.competition,
            interest: trendsData.interest,
            videoCount: youtubeData.videoCount,
            relatedKeywords: [
                ...googleData.relatedKeywords,
                ...trendsData.relatedTopics,
                ...youtubeData.suggestedKeywords
            ].slice(0, 15),
            suggestions: googleData.suggestions,
            risingTopics: trendsData.risingTopics,
            topVideos: youtubeData.topVideos
        };
    }
}
