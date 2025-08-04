import { Injectable, Logger } from '@nestjs/common';
import { KeywordDifficultyService } from '../keyword-difficulty/keyword-difficulty.service';
import {
    OrganicDomainAnalysisDto,
    OrganicKeywordsDto,
    CompetitorDiscoveryDto,
    TopPagesDto,
    OrganicDomainResponse,
    OrganicKeywordsResponse,
    CompetitorDiscoveryResponse,
    TopPagesResponse,
    OrganicKeyword,
    CompetitorData,
    TopPage
} from './dto/organic-research.dto';

@Injectable()
export class ImprovedOrganicResearchService {
    private readonly logger = new Logger(ImprovedOrganicResearchService.name);

    constructor(
        private readonly keywordDifficultyService: KeywordDifficultyService
    ) { }

    async getOrganicKeywords(dto: OrganicKeywordsDto): Promise<OrganicKeywordsResponse> {
        this.logger.log(`Getting organic keywords for domain: ${dto.domain}`);

        // Set default values
        const limit = dto.limit || 100;
        const offset = dto.offset || 0;
        const sortBy = dto.sortBy || 'position';
        const sortOrder = dto.sortOrder || 'asc';

        // Generate mock organic keywords data
        const keywords: OrganicKeyword[] = [];
        const keywordPools = [
            'seo tools', 'keyword research', 'digital marketing', 'content optimization',
            'backlink analysis', 'competitor research', 'organic traffic', 'search ranking',
            'website audit', 'technical seo', 'local seo', 'mobile optimization'
        ];

        // Generate keywords
        const keywordPromises: string[] = [];
        for (let i = 0; i < limit; i++) {
            const baseKeyword = keywordPools[Math.floor(Math.random() * keywordPools.length)];
            const variation = ['guide', 'tips', 'best practices', 'strategy', 'tools', '2024'][Math.floor(Math.random() * 6)];
            const fullKeyword = `${baseKeyword} ${variation}`;

            // Add to batch for difficulty calculation
            keywordPromises.push(fullKeyword);
        }

        // Calculate difficulty scores in batch
        this.logger.log(`Calculating difficulty for ${keywordPromises.length} keywords...`);
        const difficultyResults = await this.keywordDifficultyService.calculateBatchDifficulty(keywordPromises);

        // Create keyword objects with real difficulty scores
        for (let i = 0; i < limit; i++) {
            const baseKeyword = keywordPools[Math.floor(Math.random() * keywordPools.length)];
            const variation = ['guide', 'tips', 'best practices', 'strategy', 'tools', '2024'][Math.floor(Math.random() * 6)];
            const fullKeyword = `${baseKeyword} ${variation}`;

            // Find difficulty calculation for this keyword
            const difficultyResult = difficultyResults.find(d => d.keyword === fullKeyword);
            const difficulty = difficultyResult ? difficultyResult.difficulty : this.estimateBasicDifficulty(fullKeyword);

            keywords.push({
                keyword: fullKeyword,
                position: Math.floor(Math.random() * 100) + 1,
                previousPosition: Math.floor(Math.random() * 100) + 1,
                searchVolume: Math.floor(Math.random() * 10000) + 100,
                trafficShare: Math.random() * 10,
                cpc: Math.random() * 50 + 0.5,
                difficulty: difficulty, // Now using calculated difficulty!
                intent: ['informational', 'commercial', 'transactional', 'navigational'][Math.floor(Math.random() * 4)],
                url: `https://${dto.domain}/${baseKeyword.replace(' ', '-')}`,
                features: ['featured_snippet', 'people_also_ask', 'local_pack'].slice(0, Math.floor(Math.random() * 3))
            });
        }

        // Sort keywords based on sortBy parameter
        keywords.sort((a, b) => {
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            switch (sortBy) {
                case 'position':
                    return (a.position - b.position) * multiplier;
                case 'traffic':
                    return (a.trafficShare - b.trafficShare) * multiplier;
                case 'volume':
                    return (a.searchVolume - b.searchVolume) * multiplier;
                default:
                    return 0;
            }
        });

        const total = Math.floor(Math.random() * 5000) + 1000;
        const page = Math.floor(offset / limit) + 1;

        this.logger.log(`Returning ${keywords.length} keywords with calculated difficulties`);

        return {
            data: keywords,
            total,
            page,
            limit: limit,
            hasNext: offset + limit < total,
            hasPrev: offset > 0
        };
    }

    /**
     * Estimate basic difficulty when calculation service fails
     */
    private estimateBasicDifficulty(keyword: string): number {
        // Fallback estimation logic
        let difficulty = 50; // Base difficulty

        const words = keyword.split(' ');
        if (words.length === 1) difficulty += 20; // Single words harder
        else if (words.length >= 4) difficulty -= 15; // Long-tail easier

        // Commercial intent indicators
        const commercialWords = ['buy', 'price', 'best', 'top', 'review'];
        if (commercialWords.some(word => keyword.toLowerCase().includes(word))) {
            difficulty += 15;
        }

        // Informational intent indicators  
        const informationalWords = ['what', 'how', 'tutorial', 'guide'];
        if (informationalWords.some(word => keyword.toLowerCase().includes(word))) {
            difficulty -= 10;
        }

        return Math.min(100, Math.max(10, difficulty));
    }

    async analyzeDomain(dto: OrganicDomainAnalysisDto): Promise<OrganicDomainResponse> {
        this.logger.log(`Analyzing domain: ${dto.domain} for country: ${dto.country}`);

        // TODO: Integrate with third-party APIs (SEMrush, Ahrefs, etc.)
        // For now, return mock data with realistic values

        const mockResponse: OrganicDomainResponse = {
            domain: dto.domain,
            organicKeywords: Math.floor(Math.random() * 10000) + 1000,
            organicTraffic: Math.floor(Math.random() * 100000) + 5000,
            organicCost: Math.floor(Math.random() * 50000) + 1000,
            avgPosition: Math.floor(Math.random() * 50) + 10,
            visibility: Math.random() * 0.5 + 0.1,
            lastUpdated: new Date().toISOString()
        };

        return mockResponse;
    }

    async discoverCompetitors(dto: CompetitorDiscoveryDto): Promise<CompetitorDiscoveryResponse> {
        this.logger.log(`Discovering competitors for domain: ${dto.domain}`);

        const limit = dto.limit || 50;

        // Generate mock competitor data
        const competitors: CompetitorData[] = [];
        const competitorDomains = [
            'semrush.com', 'ahrefs.com', 'moz.com', 'screaming-frog.co.uk',
            'brightedge.com', 'serpstat.com', 'kwfinder.com', 'spyfu.com',
            'seranking.com', 'cognitiveseo.com', 'majestic.com', 'searchmetrics.com'
        ].filter(domain => domain !== dto.domain);

        for (let i = 0; i < Math.min(limit, competitorDomains.length); i++) {
            const domain = competitorDomains[i];
            competitors.push({
                domain,
                competitionLevel: Math.floor(Math.random() * 100) + 1,
                commonKeywords: Math.floor(Math.random() * 1000) + 50,
                keywords: Math.floor(Math.random() * 5000) + 500,
                traffic: Math.floor(Math.random() * 100000) + 5000,
                trafficValue: Math.floor(Math.random() * 50000) + 2000,
                topKeyword: ['seo tools', 'keyword research', 'backlink analysis'][Math.floor(Math.random() * 3)]
            });
        }

        // Sort by competition level (highest first)
        competitors.sort((a, b) => b.competitionLevel - a.competitionLevel);

        return {
            data: competitors,
            total: competitors.length,
            targetDomain: dto.domain,
            country: dto.country
        };
    }

    async getTopPages(dto: TopPagesDto): Promise<TopPagesResponse> {
        this.logger.log(`Getting top pages for domain: ${dto.domain}`);

        const limit = dto.limit || 100;
        const sortBy = dto.sortBy || 'traffic';

        // Generate mock top pages data
        const pages: TopPage[] = [];
        const pageTypes = [
            '/blog/seo-guide', '/tools/keyword-research', '/pricing', '/features',
            '/blog/content-marketing', '/resources/seo-checklist', '/about',
            '/blog/link-building', '/academy/seo-course', '/templates'
        ];

        for (let i = 0; i < limit; i++) {
            const pagePath = pageTypes[i % pageTypes.length] || `/page-${i}`;

            pages.push({
                url: `https://${dto.domain}${pagePath}`,
                traffic: Math.floor(Math.random() * 10000) + 100,
                keywords: Math.floor(Math.random() * 200) + 10,
                trafficValue: Math.floor(Math.random() * 5000) + 100,
                avgPosition: Math.floor(Math.random() * 30) + 5,
                topKeywords: [
                    'seo tools', 'keyword research', 'backlink analysis',
                    'content optimization', 'technical seo'
                ].slice(0, Math.floor(Math.random() * 3) + 1)
            });
        }

        // Sort pages based on sortBy parameter
        pages.sort((a, b) => {
            switch (sortBy) {
                case 'traffic':
                    return b.traffic - a.traffic;
                case 'keywords':
                    return b.keywords - a.keywords;
                case 'value':
                    return b.trafficValue - a.trafficValue;
                default:
                    return b.traffic - a.traffic;
            }
        });

        return {
            data: pages,
            total: pages.length,
            domain: dto.domain,
            country: dto.country
        };
    }

    // Helper method for future third-party API integration
    private async callThirdPartyAPI(endpoint: string, params: any): Promise<any> {
        // TODO: Implement actual API calls to SEMrush, Ahrefs, etc.
        this.logger.log(`Would call third-party API: ${endpoint} with params:`, params);
        return null;
    }

    // Method to check API quota/limits
    async checkAPILimits(): Promise<{ semrush: number; ahrefs: number; moz: number }> {
        // TODO: Implement actual API limit checking
        return {
            semrush: 1000,
            ahrefs: 500,
            moz: 300
        };
    }
}
