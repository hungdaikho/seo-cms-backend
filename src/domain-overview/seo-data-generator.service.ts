import { Injectable } from '@nestjs/common';
import { getCountryName } from '../common/constants/countries';

export interface RealSeoKeyword {
  keyword: string;
  category: string;
  difficulty: number;
  volume: number;
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
}

export interface RealDomainMetrics {
  authorityFactor: number;
  industryType: string;
  estimatedAge: number;
  contentQuality: number;
}

@Injectable()
export class SeoDataGeneratorService {
  private readonly realKeywordDatabase: RealSeoKeyword[] = [
    // SEO & Digital Marketing
    {
      keyword: 'seo tools',
      category: 'seo',
      difficulty: 85,
      volume: 22000,
      intent: 'commercial',
    },
    {
      keyword: 'keyword research',
      category: 'seo',
      difficulty: 72,
      volume: 18000,
      intent: 'informational',
    },
    {
      keyword: 'backlink analysis',
      category: 'seo',
      difficulty: 68,
      volume: 8900,
      intent: 'commercial',
    },
    {
      keyword: 'google ranking factors',
      category: 'seo',
      difficulty: 75,
      volume: 12000,
      intent: 'informational',
    },
    {
      keyword: 'technical seo audit',
      category: 'seo',
      difficulty: 58,
      volume: 5400,
      intent: 'commercial',
    },
    {
      keyword: 'on page optimization',
      category: 'seo',
      difficulty: 61,
      volume: 7200,
      intent: 'informational',
    },
    {
      keyword: 'local seo services',
      category: 'seo',
      difficulty: 69,
      volume: 9800,
      intent: 'commercial',
    },
    {
      keyword: 'content marketing strategy',
      category: 'marketing',
      difficulty: 64,
      volume: 14500,
      intent: 'informational',
    },
    {
      keyword: 'link building techniques',
      category: 'seo',
      difficulty: 71,
      volume: 6700,
      intent: 'informational',
    },
    {
      keyword: 'seo audit checklist',
      category: 'seo',
      difficulty: 45,
      volume: 4200,
      intent: 'informational',
    },

    // E-commerce
    {
      keyword: 'ecommerce seo',
      category: 'ecommerce',
      difficulty: 73,
      volume: 8100,
      intent: 'commercial',
    },
    {
      keyword: 'product page optimization',
      category: 'ecommerce',
      difficulty: 52,
      volume: 3400,
      intent: 'informational',
    },
    {
      keyword: 'shopify seo',
      category: 'ecommerce',
      difficulty: 67,
      volume: 11000,
      intent: 'commercial',
    },
    {
      keyword: 'amazon seo',
      category: 'ecommerce',
      difficulty: 78,
      volume: 15600,
      intent: 'commercial',
    },
    {
      keyword: 'conversion rate optimization',
      category: 'ecommerce',
      difficulty: 69,
      volume: 9200,
      intent: 'commercial',
    },

    // Tech & SaaS
    {
      keyword: 'software as a service',
      category: 'tech',
      difficulty: 81,
      volume: 19000,
      intent: 'informational',
    },
    {
      keyword: 'cloud computing',
      category: 'tech',
      difficulty: 87,
      volume: 45000,
      intent: 'informational',
    },
    {
      keyword: 'artificial intelligence',
      category: 'tech',
      difficulty: 92,
      volume: 78000,
      intent: 'informational',
    },
    {
      keyword: 'machine learning',
      category: 'tech',
      difficulty: 89,
      volume: 67000,
      intent: 'informational',
    },
    {
      keyword: 'data analytics',
      category: 'tech',
      difficulty: 76,
      volume: 24000,
      intent: 'commercial',
    },

    // Business & Finance
    {
      keyword: 'business intelligence',
      category: 'business',
      difficulty: 74,
      volume: 13500,
      intent: 'commercial',
    },
    {
      keyword: 'project management software',
      category: 'business',
      difficulty: 82,
      volume: 16700,
      intent: 'commercial',
    },
    {
      keyword: 'customer relationship management',
      category: 'business',
      difficulty: 71,
      volume: 8900,
      intent: 'commercial',
    },
    {
      keyword: 'financial planning',
      category: 'finance',
      difficulty: 79,
      volume: 21000,
      intent: 'commercial',
    },
    {
      keyword: 'investment strategies',
      category: 'finance',
      difficulty: 83,
      volume: 17400,
      intent: 'informational',
    },

    // Health & Wellness
    {
      keyword: 'digital health',
      category: 'health',
      difficulty: 65,
      volume: 7800,
      intent: 'informational',
    },
    {
      keyword: 'telemedicine',
      category: 'health',
      difficulty: 73,
      volume: 12300,
      intent: 'commercial',
    },
    {
      keyword: 'mental health apps',
      category: 'health',
      difficulty: 58,
      volume: 5600,
      intent: 'commercial',
    },
    {
      keyword: 'fitness tracking',
      category: 'health',
      difficulty: 67,
      volume: 9100,
      intent: 'commercial',
    },

    // Education
    {
      keyword: 'online learning platforms',
      category: 'education',
      difficulty: 72,
      volume: 14200,
      intent: 'commercial',
    },
    {
      keyword: 'digital education',
      category: 'education',
      difficulty: 61,
      volume: 8700,
      intent: 'informational',
    },
    {
      keyword: 'e-learning solutions',
      category: 'education',
      difficulty: 68,
      volume: 6900,
      intent: 'commercial',
    },

    // Travel & Hospitality
    {
      keyword: 'travel booking',
      category: 'travel',
      difficulty: 88,
      volume: 34000,
      intent: 'transactional',
    },
    {
      keyword: 'hotel management system',
      category: 'travel',
      difficulty: 65,
      volume: 4500,
      intent: 'commercial',
    },
    {
      keyword: 'vacation rental',
      category: 'travel',
      difficulty: 81,
      volume: 19500,
      intent: 'commercial',
    },

    // Real Estate
    {
      keyword: 'real estate software',
      category: 'realestate',
      difficulty: 74,
      volume: 7200,
      intent: 'commercial',
    },
    {
      keyword: 'property management',
      category: 'realestate',
      difficulty: 76,
      volume: 11800,
      intent: 'commercial',
    },
    {
      keyword: 'home valuation',
      category: 'realestate',
      difficulty: 82,
      volume: 15600,
      intent: 'commercial',
    },

    // Food & Restaurant
    {
      keyword: 'restaurant pos system',
      category: 'restaurant',
      difficulty: 73,
      volume: 5800,
      intent: 'commercial',
    },
    {
      keyword: 'food delivery app',
      category: 'restaurant',
      difficulty: 79,
      volume: 12900,
      intent: 'commercial',
    },
    {
      keyword: 'menu optimization',
      category: 'restaurant',
      difficulty: 42,
      volume: 2100,
      intent: 'informational',
    },
  ];

  private readonly competitorDomains = {
    seo: [
      'semrush.com',
      'ahrefs.com',
      'moz.com',
      'majestic.com',
      'spyfu.com',
      'serpstat.com',
      'kwfinder.com',
      'screaming-frog.co.uk',
      'seranking.com',
      'brightedge.com',
      'cognitiveseo.com',
      'searchmetrics.com',
      'sistrix.com',
    ],
    ecommerce: [
      'shopify.com',
      'bigcommerce.com',
      'woocommerce.com',
      'magento.com',
      'amazon.com',
      'ebay.com',
      'etsy.com',
      'prestashop.com',
    ],
    tech: [
      'microsoft.com',
      'google.com',
      'aws.amazon.com',
      'salesforce.com',
      'oracle.com',
      'ibm.com',
      'adobe.com',
      'atlassian.com',
    ],
    business: [
      'hubspot.com',
      'zendesk.com',
      'slack.com',
      'asana.com',
      'trello.com',
      'monday.com',
      'notion.so',
      'airtable.com',
    ],
    finance: [
      'stripe.com',
      'paypal.com',
      'square.com',
      'quickbooks.com',
      'xero.com',
      'mint.com',
      'robinhood.com',
      'coinbase.com',
    ],
  };

  generateRealisticKeywords(domain: string, country: string, limit: number) {
    const industry = this.detectIndustry(domain);
    const baseKeywords = this.getKeywordsByIndustry(industry);

    // Shuffle và lấy số lượng cần thiết
    const shuffled = this.shuffleArray([...baseKeywords]);
    const selectedKeywords = shuffled.slice(0, limit);

    return selectedKeywords.map((kw, index) => {
      const countryFactor = this.getCountrySearchFactor(country);
      const positionVariation = Math.random() * 30 + 1; // 1-31

      return {
        keyword: kw.keyword,
        position: Math.floor(positionVariation),
        searchVolume: Math.floor(kw.volume * countryFactor),
        traffic: Math.floor(
          (kw.volume * countryFactor) / (positionVariation * 2),
        ),
        cpc: this.calculateCPC(kw.difficulty, country),
        difficulty: kw.difficulty + (Math.random() * 10 - 5), // ±5 variation
        trend: this.generateTrend(index),
        url: `https://${domain}/${kw.keyword.replace(/\s+/g, '-').toLowerCase()}`,
      };
    });
  }

  generateRealisticCompetitors(domain: string, country: string, limit: number) {
    const industry = this.detectIndustry(domain);
    const competitors =
      this.competitorDomains[industry] || this.competitorDomains.tech;

    // Lọc ra domain hiện tại
    const filteredCompetitors = competitors.filter((comp) => comp !== domain);
    const shuffled = this.shuffleArray([...filteredCompetitors]);

    return shuffled.slice(0, limit).map((competitorDomain) => {
      const competitionLevel = Math.floor(Math.random() * 40) + 60; // 60-100
      const domainMetrics = this.generateDomainMetrics(competitorDomain);

      return {
        domain: competitorDomain,
        competitionLevel,
        commonKeywords: Math.floor(Math.random() * 2000) + 500,
        authorityScore: Math.floor(domainMetrics.authorityFactor * 100),
        trafficGap: Math.floor(Math.random() * 80000) + 10000,
        organicKeywords: Math.floor(Math.random() * 15000) + 5000,
        estimatedTraffic: Math.floor(Math.random() * 150000) + 20000,
      };
    });
  }

  generateRealisticTopics(limit: number) {
    const topicTemplates = [
      { topic: 'SEO Strategy & Best Practices', keywords: 850, difficulty: 72 },
      {
        topic: 'Content Marketing & Optimization',
        keywords: 1200,
        difficulty: 65,
      },
      {
        topic: 'Technical SEO & Website Performance',
        keywords: 680,
        difficulty: 78,
      },
      {
        topic: 'Link Building & Authority Building',
        keywords: 540,
        difficulty: 81,
      },
      {
        topic: 'Local SEO & Google My Business',
        keywords: 420,
        difficulty: 58,
      },
      { topic: 'Keyword Research & Analysis', keywords: 760, difficulty: 69 },
      {
        topic: 'Analytics & Performance Tracking',
        keywords: 390,
        difficulty: 62,
      },
      { topic: 'E-commerce SEO Strategies', keywords: 510, difficulty: 74 },
      { topic: 'Mobile SEO & User Experience', keywords: 380, difficulty: 67 },
      { topic: 'Voice Search Optimization', keywords: 280, difficulty: 71 },
      {
        topic: 'International SEO & Localization',
        keywords: 320,
        difficulty: 76,
      },
      {
        topic: 'Schema Markup & Structured Data',
        keywords: 240,
        difficulty: 69,
      },
      { topic: 'Page Speed & Core Web Vitals', keywords: 190, difficulty: 63 },
      { topic: 'Social Media Integration', keywords: 350, difficulty: 55 },
      {
        topic: 'Video SEO & YouTube Optimization',
        keywords: 280,
        difficulty: 68,
      },
      {
        topic: 'Brand Authority & Reputation Management',
        keywords: 210,
        difficulty: 73,
      },
      { topic: 'Conversion Rate Optimization', keywords: 430, difficulty: 70 },
      {
        topic: 'Competitor Analysis & Market Research',
        keywords: 380,
        difficulty: 66,
      },
      { topic: 'Content Strategy & Planning', keywords: 520, difficulty: 61 },
      { topic: 'Search Intent & User Behavior', keywords: 290, difficulty: 64 },
    ];

    return topicTemplates.slice(0, limit).map((template) => ({
      topic: template.topic,
      keywords: template.keywords + Math.floor(Math.random() * 200 - 100),
      traffic: Math.floor(Math.random() * 8000) + 1000,
      difficulty: template.difficulty + Math.floor(Math.random() * 10 - 5),
      opportunities: Math.floor(Math.random() * 30) + 10,
      topKeywords: this.generateTopKeywordsForTopic(template.topic),
    }));
  }

  private detectIndustry(domain: string): string {
    const domainLower = domain.toLowerCase();

    if (
      domainLower.includes('shop') ||
      domainLower.includes('store') ||
      domainLower.includes('buy')
    ) {
      return 'ecommerce';
    }
    if (
      domainLower.includes('seo') ||
      domainLower.includes('marketing') ||
      domainLower.includes('rank')
    ) {
      return 'seo';
    }
    if (
      domainLower.includes('tech') ||
      domainLower.includes('soft') ||
      domainLower.includes('app')
    ) {
      return 'tech';
    }
    if (
      domainLower.includes('finance') ||
      domainLower.includes('pay') ||
      domainLower.includes('bank')
    ) {
      return 'finance';
    }
    if (
      domainLower.includes('health') ||
      domainLower.includes('medical') ||
      domainLower.includes('care')
    ) {
      return 'health';
    }

    return 'business'; // default
  }

  private getKeywordsByIndustry(industry: string): RealSeoKeyword[] {
    return this.realKeywordDatabase.filter(
      (kw) => kw.category === industry || kw.category === 'seo', // SEO keywords are universal
    );
  }

  private getCountrySearchFactor(country: string): number {
    const factors = {
      US: 1.0,
      GB: 0.8,
      CA: 0.6,
      AU: 0.4,
      DE: 0.7,
      FR: 0.6,
      VN: 0.3,
      JP: 0.8,
      KR: 0.5,
      IN: 0.9,
      BR: 0.7,
      MX: 0.4,
    };

    return factors[country] || 0.5;
  }

  private calculateCPC(difficulty: number, country: string): number {
    const baseCPC = (difficulty / 100) * 15; // $0-15 based on difficulty
    const countryMultiplier = {
      US: 1.0,
      GB: 0.9,
      CA: 0.8,
      AU: 0.7,
      DE: 0.8,
      VN: 0.2,
      IN: 0.3,
      BR: 0.4,
    };

    return Number((baseCPC * (countryMultiplier[country] || 0.5)).toFixed(2));
  }

  private generateTrend(index: number): 'up' | 'down' | 'stable' {
    const random = Math.random();
    if (index < 10) return random > 0.6 ? 'up' : 'stable'; // Top keywords trending up
    if (index > 50) return random > 0.7 ? 'down' : 'stable'; // Lower keywords trending down
    return random > 0.5 ? 'stable' : random > 0.25 ? 'up' : 'down';
  }

  private generateDomainMetrics(domain: string): RealDomainMetrics {
    // Simulate different authority based on domain
    const wellKnownDomains = ['google.com', 'microsoft.com', 'amazon.com'];
    const isWellKnown = wellKnownDomains.includes(domain);

    return {
      authorityFactor: isWellKnown
        ? 0.9 + Math.random() * 0.1
        : 0.3 + Math.random() * 0.6,
      industryType: this.detectIndustry(domain),
      estimatedAge: Math.floor(Math.random() * 20) + 1,
      contentQuality: Math.random(),
    };
  }

  private generateTopKeywordsForTopic(topic: string): string[] {
    const topicWords = topic.toLowerCase().split(' ');
    const baseWord = topicWords[0];

    return [
      `${baseWord} guide`,
      `best ${baseWord} practices`,
      `${baseWord} tools`,
      `${baseWord} strategy`,
      `${baseWord} tips`,
    ].slice(0, 3);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
