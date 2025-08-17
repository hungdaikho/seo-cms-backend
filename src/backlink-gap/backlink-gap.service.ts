import { Injectable } from '@nestjs/common';
import {
  BacklinkGapCompareDto,
  BacklinkGapCompareResponse,
  BacklinkProspectsDto,
  BacklinkProspectsResponse,
  BacklinkDetail,
  BacklinkOpportunity,
  BacklinkProspect,
  LinkType,
  LinkStatus,
} from './dto/backlink-gap.dto';

@Injectable()
export class BacklinkGapService {
  async compareBacklinkGaps(
    dto: BacklinkGapCompareDto,
  ): Promise<BacklinkGapCompareResponse> {
    try {
      // Simulate backlink analysis using mock data
      const targetDomain = dto.targetDomain;
      const competitors = dto.competitors;

      // Generate mock backlink data for analysis
      const targetBacklinks = this.generateMockBacklinks(targetDomain, 150);
      const competitorBacklinks = new Map<string, any[]>();

      for (const competitor of competitors) {
        competitorBacklinks.set(
          competitor,
          this.generateMockBacklinks(competitor, 200),
        );
      }

      // Analyze gaps
      const analysis = this.analyzeBacklinkGaps(
        targetBacklinks,
        competitorBacklinks,
        dto.filters,
      );

      return {
        overview: {
          targetDomain,
          competitors,
          comparison: analysis.comparison,
          totalAnalyzed: analysis.totalAnalyzed,
        },
        backlinkDetails: analysis.backlinkDetails,
        opportunities: analysis.opportunities,
        totalBacklinks: analysis.totalAnalyzed,
        exportUrl: `/api/v1/seo/backlink-gap/export/${Date.now()}`,
      };
    } catch (error) {
      throw new Error(`Backlink gap analysis failed: ${error.message}`);
    }
  }

  async getBacklinkProspects(
    domain: string,
    dto: BacklinkProspectsDto,
  ): Promise<BacklinkProspectsResponse> {
    try {
      // Merge flat parameters and nested filters
      const filters: any = { ...dto.filters };

      // Flat parameters override nested filters
      if (dto.minAuthorityScore !== undefined) {
        filters.minAuthorityScore = dto.minAuthorityScore;
      }
      if (dto.linkType !== undefined) {
        filters.linkType = dto.linkType;
      }
      if (dto.language !== undefined) {
        filters.language = dto.language;
      }

      // Parse competitors if provided
      const competitors = dto.competitors
        ? dto.competitors.split(',').map((c) => c.trim())
        : [];

      // Generate mock prospect data
      const prospects = this.generateMockProspects(
        domain,
        dto.limit || 50,
        filters,
        competitors,
      );

      return {
        prospects,
        totalFound: prospects.length,
        analysisDate: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Backlink prospects analysis failed: ${error.message}`);
    }
  }

  private generateMockBacklinks(domain: string, count: number): any[] {
    const backlinks: any[] = [];
    const sources = [
      'blog.industry-site.com',
      'news.tech-magazine.com',
      'forum.developers.org',
      'resource.marketing-hub.com',
      'guide.business-tools.net',
      'article.startup-news.io',
      'post.social-media.com',
      'review.product-site.com',
    ];

    for (let i = 0; i < count; i++) {
      const sourceIndex = Math.floor(Math.random() * sources.length);
      const sourceDomain = sources[sourceIndex];

      backlinks.push({
        sourceUrl: `https://${sourceDomain}/page-${i + 1}`,
        targetUrl: `https://${domain}/target-page-${i + 1}`,
        sourceDomain,
        authorityScore: Math.floor(Math.random() * 70) + 30,
        linkType: Math.random() > 0.3 ? LinkType.DOFOLLOW : LinkType.NOFOLLOW,
        anchorText: this.generateAnchorText(domain),
        firstSeen: this.generateRandomDate(365),
        lastSeen: this.generateRandomDate(30),
        status: Math.random() > 0.1 ? LinkStatus.ACTIVE : LinkStatus.BROKEN,
        referringDomains: Math.floor(Math.random() * 100) + 10,
        backlinks: Math.floor(Math.random() * 500) + 50,
      });
    }

    return backlinks;
  }

  private generateMockProspects(
    domain: string,
    count: number,
    filters?: any,
    competitors?: string[],
  ): BacklinkProspect[] {
    const prospects: BacklinkProspect[] = [];
    const industries = [
      'technology',
      'marketing',
      'business',
      'design',
      'development',
    ];
    const tlds = ['.com', '.org', '.net', '.io', '.co'];

    for (let i = 0; i < count; i++) {
      const industry =
        industries[Math.floor(Math.random() * industries.length)];
      const tld = tlds[Math.floor(Math.random() * tlds.length)];
      const prospectDomain = `${industry}-site-${i + 1}${tld}`;

      const authorityScore = Math.floor(Math.random() * 70) + 30;

      // Apply filters if provided
      if (
        filters?.minAuthorityScore &&
        authorityScore < filters.minAuthorityScore
      ) {
        continue;
      }

      prospects.push({
        domain: prospectDomain,
        url: `https://${prospectDomain}`,
        authorityScore,
        referringDomains: Math.floor(Math.random() * 500) + 100,
        backlinks: Math.floor(Math.random() * 2000) + 500,
        topAnchorText: this.generateAnchorText(domain),
        contentTopic: industry,
        contactInfo: {
          email: Math.random() > 0.5 ? `contact@${prospectDomain}` : undefined,
          socialMedia: {
            twitter: `@${industry}site${i + 1}`,
            linkedin: `company/${industry}-site-${i + 1}`,
          },
        },
        outreachScore: Math.floor(Math.random() * 40) + 60,
      });
    }

    return prospects.slice(0, count);
  }

  private analyzeBacklinkGaps(
    targetBacklinks: any[],
    competitorBacklinks: Map<string, any[]>,
    filters?: any,
  ): any {
    // Apply filters to backlinks
    const filteredTargetBacklinks = this.applyFilters(targetBacklinks, filters);
    const filteredCompetitorBacklinks = new Map();

    for (const [competitor, backlinks] of competitorBacklinks) {
      filteredCompetitorBacklinks.set(
        competitor,
        this.applyFilters(backlinks, filters),
      );
    }

    // Get all unique source domains
    const targetDomains = new Set(
      filteredTargetBacklinks.map((bl) => bl.sourceDomain),
    );
    const allCompetitorDomains = new Set();

    for (const backlinks of filteredCompetitorBacklinks.values()) {
      backlinks.forEach((bl) => allCompetitorDomains.add(bl.sourceDomain));
    }

    // Calculate gaps
    const sharedDomains = new Set(
      [...targetDomains].filter((d) => allCompetitorDomains.has(d)),
    );
    const missingDomains = new Set(
      [...allCompetitorDomains].filter((d) => !targetDomains.has(d)),
    );
    const uniqueDomains = new Set(
      [...targetDomains].filter((d) => !allCompetitorDomains.has(d)),
    );

    // Generate detailed backlink analysis
    const backlinkDetails: BacklinkDetail[] = [];
    const opportunities: BacklinkOpportunity[] = [];

    // Add missing opportunities
    let opportunityCount = 0;
    for (const domain of missingDomains) {
      if (opportunityCount >= 20) break; // Limit to 20 opportunities

      const domainStr = domain as string;
      const competitorBacklink = this.findBacklinkByDomain(
        domainStr,
        filteredCompetitorBacklinks,
      );
      if (competitorBacklink) {
        const competitors: Record<string, any> = {};
        for (const [comp, backlinks] of filteredCompetitorBacklinks) {
          const compBacklink = backlinks.find(
            (bl) => bl.sourceDomain === domainStr,
          );
          if (compBacklink) {
            competitors[comp] = {
              authorityScore: compBacklink.authorityScore,
              referringDomains: compBacklink.referringDomains,
              backlinks: compBacklink.backlinks,
              linkType: compBacklink.linkType,
              anchorText: compBacklink.anchorText,
              firstSeen: compBacklink.firstSeen,
              lastSeen: compBacklink.lastSeen,
            };
          }
        }

        backlinkDetails.push({
          sourceUrl: competitorBacklink.sourceUrl,
          targetUrl: competitorBacklink.targetUrl,
          sourceDomain: domainStr,
          authorityScore: competitorBacklink.authorityScore,
          linkType: competitorBacklink.linkType,
          anchorText: competitorBacklink.anchorText,
          firstSeen: competitorBacklink.firstSeen,
          lastSeen: competitorBacklink.lastSeen,
          status: competitorBacklink.status,
          targetDomain: null,
          competitors,
        });

        opportunities.push({
          domain: domainStr,
          authorityScore: competitorBacklink.authorityScore,
          referringDomains: competitorBacklink.referringDomains,
          missingFrom: [competitorBacklink.sourceDomain],
          linkingToCompetitors: Object.keys(competitors).length,
          estimatedValue: this.calculateEstimatedValue(
            competitorBacklink.authorityScore,
          ),
        });

        opportunityCount++;
      }
    }

    return {
      comparison: {
        shared: sharedDomains.size,
        missing: missingDomains.size,
        unique: uniqueDomains.size,
        opportunities: opportunities.length,
        total: targetDomains.size + missingDomains.size,
      },
      backlinkDetails,
      opportunities,
      totalAnalyzed:
        filteredTargetBacklinks.length +
        Array.from(filteredCompetitorBacklinks.values()).flat().length,
    };
  }

  private applyFilters(backlinks: any[], filters?: any): any[] {
    if (!filters) return backlinks;

    return backlinks.filter((backlink) => {
      if (
        filters.minAuthorityScore &&
        backlink.authorityScore < filters.minAuthorityScore
      ) {
        return false;
      }
      if (
        filters.linkType &&
        filters.linkType !== 'all' &&
        backlink.linkType !== filters.linkType
      ) {
        return false;
      }
      if (
        filters.linkStatus &&
        filters.linkStatus !== 'all' &&
        backlink.status !== filters.linkStatus
      ) {
        return false;
      }
      if (
        filters.minReferringDomains &&
        backlink.referringDomains < filters.minReferringDomains
      ) {
        return false;
      }
      return true;
    });
  }

  private findBacklinkByDomain(
    domain: string,
    competitorBacklinks: Map<string, any[]>,
  ): any {
    for (const backlinks of competitorBacklinks.values()) {
      const found = backlinks.find((bl) => bl.sourceDomain === domain);
      if (found) return found;
    }
    return null;
  }

  private calculateEstimatedValue(authorityScore: number): number {
    // Simple formula: higher authority = higher value
    return Math.floor(authorityScore * 2.5 + Math.random() * 50);
  }

  private generateAnchorText(domain: string): string {
    const anchorTypes = [
      domain,
      `Visit ${domain}`,
      'Click here',
      'Learn more',
      'Read article',
      'Best practices',
      'Industry guide',
      'Expert tips',
    ];
    return anchorTypes[Math.floor(Math.random() * anchorTypes.length)];
  }

  private generateRandomDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString();
  }
}
