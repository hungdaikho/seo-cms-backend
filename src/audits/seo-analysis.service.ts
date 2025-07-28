import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { Page } from 'puppeteer';
import axios from 'axios';

export interface SEOAnalysisResult {
    url: string;
    status_code: number;
    title: string;
    meta_description: string;
    h1_tags: string[];
    h2_tags: string[];
    h3_tags: string[];
    images_without_alt: number;
    images_total: number;
    internal_links: number;
    external_links: number;
    word_count: number;
    meta_keywords: string;
    canonical_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
    schema_markup: number;
    hreflang_tags: number;
    meta_robots: string;
    issues: SEOIssue[];
    score: number;
}

export interface SEOIssue {
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    recommendation: string;
    affected_elements?: string[];
}

@Injectable()
export class SEOAnalysisService {
    private readonly logger = new Logger(SEOAnalysisService.name);

    async analyzePage(page: Page, url: string): Promise<SEOAnalysisResult> {
        try {
            this.logger.log(`Starting SEO analysis for: ${url}`);

            // Get page response
            const response = await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Get HTML content
            const html = await page.content();
            const $ = cheerio.load(html);

            // Extract SEO data
            const seoData = await this.extractSEOData($, url, response?.status() || 0);

            // Analyze and generate issues
            const issues = this.analyzeSEOIssues(seoData, $);

            // Calculate SEO score
            const score = this.calculateSEOScore(seoData, issues);

            const result: SEOAnalysisResult = {
                ...seoData,
                issues,
                score
            };

            this.logger.log(`SEO analysis completed for: ${url} (Score: ${score})`);
            return result;

        } catch (error) {
            this.logger.error(`SEO analysis failed for ${url}:`, error);
            throw error;
        }
    }

    private async extractSEOData($: cheerio.Root, url: string, statusCode: number): Promise<Omit<SEOAnalysisResult, 'issues' | 'score'>> {
        // Basic meta data
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const metaKeywords = $('meta[name="keywords"]').attr('content') || '';
        const metaRobots = $('meta[name="robots"]').attr('content') || '';

        // Heading tags
        const h1Tags = $('h1').map((_, el) => $(el).text().trim()).get();
        const h2Tags = $('h2').map((_, el) => $(el).text().trim()).get();
        const h3Tags = $('h3').map((_, el) => $(el).text().trim()).get();

        // Images
        const images = $('img');
        const imagesWithoutAlt = $('img:not([alt]), img[alt=""]').length;
        const totalImages = images.length;

        // Links
        const urlHost = new URL(url).hostname;
        const internalLinks = $(`a[href^="/"], a[href*="${urlHost}"]`).length;
        const externalLinks = $('a[href^="http"]').not(`[href*="${urlHost}"]`).length;

        // Content analysis
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
        const wordCount = bodyText.split(' ').filter(word => word.length > 0).length;

        // Technical SEO
        const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';
        const hreflangTags = $('link[rel="alternate"][hreflang]').length;
        const schemaMarkup = $('script[type="application/ld+json"]').length;

        // Open Graph
        const ogTitle = $('meta[property="og:title"]').attr('content') || '';
        const ogDescription = $('meta[property="og:description"]').attr('content') || '';
        const ogImage = $('meta[property="og:image"]').attr('content') || '';

        // Twitter Card
        const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';

        return {
            url,
            status_code: statusCode,
            title,
            meta_description: metaDescription,
            h1_tags: h1Tags,
            h2_tags: h2Tags,
            h3_tags: h3Tags,
            images_without_alt: imagesWithoutAlt,
            images_total: totalImages,
            internal_links: internalLinks,
            external_links: externalLinks,
            word_count: wordCount,
            meta_keywords: metaKeywords,
            canonical_url: canonicalUrl,
            og_title: ogTitle,
            og_description: ogDescription,
            og_image: ogImage,
            twitter_card: twitterCard,
            schema_markup: schemaMarkup,
            hreflang_tags: hreflangTags,
            meta_robots: metaRobots
        };
    }

    private analyzeSEOIssues(seoData: Omit<SEOAnalysisResult, 'issues' | 'score'>, $: cheerio.Root): SEOIssue[] {
        const issues: SEOIssue[] = [];

        // Title tag issues
        if (!seoData.title) {
            issues.push({
                type: 'error',
                title: 'Missing Title Tag',
                description: 'The page is missing a title tag',
                impact: 'high',
                recommendation: 'Add a unique, descriptive title tag (50-60 characters)'
            });
        } else if (seoData.title.length < 30) {
            issues.push({
                type: 'warning',
                title: 'Title Tag Too Short',
                description: `Title tag is only ${seoData.title.length} characters`,
                impact: 'medium',
                recommendation: 'Expand title tag to 50-60 characters for better SEO'
            });
        } else if (seoData.title.length > 60) {
            issues.push({
                type: 'warning',
                title: 'Title Tag Too Long',
                description: `Title tag is ${seoData.title.length} characters`,
                impact: 'medium',
                recommendation: 'Shorten title tag to under 60 characters to avoid truncation'
            });
        }

        // Meta description issues
        if (!seoData.meta_description) {
            issues.push({
                type: 'warning',
                title: 'Missing Meta Description',
                description: 'The page is missing a meta description',
                impact: 'medium',
                recommendation: 'Add a compelling meta description (150-160 characters)'
            });
        } else if (seoData.meta_description.length < 120) {
            issues.push({
                type: 'info',
                title: 'Meta Description Too Short',
                description: `Meta description is only ${seoData.meta_description.length} characters`,
                impact: 'low',
                recommendation: 'Expand meta description to 150-160 characters'
            });
        } else if (seoData.meta_description.length > 160) {
            issues.push({
                type: 'warning',
                title: 'Meta Description Too Long',
                description: `Meta description is ${seoData.meta_description.length} characters`,
                impact: 'medium',
                recommendation: 'Shorten meta description to under 160 characters'
            });
        }

        // H1 tag issues
        if (seoData.h1_tags.length === 0) {
            issues.push({
                type: 'error',
                title: 'Missing H1 Tag',
                description: 'The page has no H1 tag',
                impact: 'high',
                recommendation: 'Add a single, descriptive H1 tag that matches the page topic'
            });
        } else if (seoData.h1_tags.length > 1) {
            issues.push({
                type: 'warning',
                title: 'Multiple H1 Tags',
                description: `Found ${seoData.h1_tags.length} H1 tags`,
                impact: 'medium',
                recommendation: 'Use only one H1 tag per page',
                affected_elements: seoData.h1_tags
            });
        }

        // Image alt text issues
        if (seoData.images_without_alt > 0) {
            issues.push({
                type: 'error',
                title: 'Missing Image Alt Text',
                description: `${seoData.images_without_alt} out of ${seoData.images_total} images are missing alt text`,
                impact: 'high',
                recommendation: 'Add descriptive alt text to all images for accessibility and SEO'
            });
        }

        // Content length issues
        if (seoData.word_count < 300) {
            issues.push({
                type: 'warning',
                title: 'Thin Content',
                description: `Page has only ${seoData.word_count} words`,
                impact: 'medium',
                recommendation: 'Expand content to at least 300 words for better SEO value'
            });
        }

        // Technical SEO issues
        if (!seoData.canonical_url) {
            issues.push({
                type: 'warning',
                title: 'Missing Canonical URL',
                description: 'No canonical URL specified',
                impact: 'medium',
                recommendation: 'Add a canonical URL to prevent duplicate content issues'
            });
        }

        // Open Graph issues
        if (!seoData.og_title) {
            issues.push({
                type: 'info',
                title: 'Missing Open Graph Title',
                description: 'No og:title meta tag found',
                impact: 'low',
                recommendation: 'Add Open Graph title for better social media sharing'
            });
        }

        if (!seoData.og_description) {
            issues.push({
                type: 'info',
                title: 'Missing Open Graph Description',
                description: 'No og:description meta tag found',
                impact: 'low',
                recommendation: 'Add Open Graph description for better social media sharing'
            });
        }

        if (!seoData.og_image) {
            issues.push({
                type: 'info',
                title: 'Missing Open Graph Image',
                description: 'No og:image meta tag found',
                impact: 'low',
                recommendation: 'Add Open Graph image for better social media sharing'
            });
        }

        // Schema markup
        if (seoData.schema_markup === 0) {
            issues.push({
                type: 'info',
                title: 'No Structured Data',
                description: 'No JSON-LD structured data found',
                impact: 'low',
                recommendation: 'Add structured data markup to help search engines understand your content'
            });
        }

        // Check for duplicate title and H1
        if (seoData.title && seoData.h1_tags.length > 0 && seoData.title === seoData.h1_tags[0]) {
            issues.push({
                type: 'info',
                title: 'Title and H1 Are Identical',
                description: 'Title tag and H1 tag have the same text',
                impact: 'low',
                recommendation: 'Consider making title and H1 slightly different for better optimization'
            });
        }

        return issues;
    }

    private calculateSEOScore(seoData: Omit<SEOAnalysisResult, 'issues' | 'score'>, issues: SEOIssue[]): number {
        let score = 100;

        // Deduct points for issues
        issues.forEach(issue => {
            switch (issue.impact) {
                case 'high':
                    score -= issue.type === 'error' ? 15 : 10;
                    break;
                case 'medium':
                    score -= issue.type === 'error' ? 10 : 5;
                    break;
                case 'low':
                    score -= 2;
                    break;
            }
        });

        // Bonus points for good practices
        if (seoData.title && seoData.title.length >= 30 && seoData.title.length <= 60) {
            score += 5;
        }
        if (seoData.meta_description && seoData.meta_description.length >= 120 && seoData.meta_description.length <= 160) {
            score += 5;
        }
        if (seoData.h1_tags.length === 1) {
            score += 5;
        }
        if (seoData.images_without_alt === 0 && seoData.images_total > 0) {
            score += 5;
        }
        if (seoData.word_count >= 500) {
            score += 5;
        }
        if (seoData.canonical_url) {
            score += 3;
        }
        if (seoData.schema_markup > 0) {
            score += 3;
        }

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    async checkRobotsTxt(baseUrl: string): Promise<{ exists: boolean; content?: string; issues: string[] }> {
        try {
            const robotsUrl = new URL('/robots.txt', baseUrl).toString();
            const response = await axios.get(robotsUrl, { timeout: 10000 });

            const issues: string[] = [];
            const content = response.data;

            if (!content.includes('Sitemap:')) {
                issues.push('No sitemap reference found in robots.txt');
            }

            return {
                exists: true,
                content: content,
                issues
            };
        } catch (error) {
            return {
                exists: false,
                issues: ['robots.txt file not found']
            };
        }
    }

    async checkSitemap(baseUrl: string): Promise<{ exists: boolean; url?: string; urlCount?: number; issues: string[] }> {
        const possibleSitemaps = [
            '/sitemap.xml',
            '/sitemap_index.xml',
            '/sitemap.txt'
        ];

        for (const sitemapPath of possibleSitemaps) {
            try {
                const sitemapUrl = new URL(sitemapPath, baseUrl).toString();
                const response = await axios.get(sitemapUrl, { timeout: 10000 });

                const urlCount = (response.data.match(/<url>/g) || []).length;

                return {
                    exists: true,
                    url: sitemapUrl,
                    urlCount,
                    issues: urlCount === 0 ? ['Sitemap is empty'] : []
                };
            } catch (error) {
                continue;
            }
        }

        return {
            exists: false,
            issues: ['No sitemap found']
        };
    }
}
