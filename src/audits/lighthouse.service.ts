import { Injectable, Logger } from '@nestjs/common';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { Page } from 'puppeteer';

export interface LighthouseResult {
    url: string;
    performance_score: number;
    accessibility_score: number;
    best_practices_score: number;
    seo_score: number;
    pwa_score: number;
    metrics: {
        first_contentful_paint: number;
        largest_contentful_paint: number;
        first_input_delay: number;
        cumulative_layout_shift: number;
        speed_index: number;
        total_blocking_time: number;
        time_to_interactive: number;
    };
    opportunities: LighthouseOpportunity[];
    diagnostics: LighthouseDiagnostic[];
    mobile_friendly: boolean;
    core_web_vitals: {
        lcp_status: 'good' | 'needs_improvement' | 'poor';
        fid_status: 'good' | 'needs_improvement' | 'poor';
        cls_status: 'good' | 'needs_improvement' | 'poor';
    };
}

export interface LighthouseOpportunity {
    id: string;
    title: string;
    description: string;
    score_display_mode: string;
    potential_savings: number;
    impact: 'high' | 'medium' | 'low';
}

export interface LighthouseDiagnostic {
    id: string;
    title: string;
    description: string;
    score_display_mode: string;
    impact: 'high' | 'medium' | 'low';
}

@Injectable()
export class LighthouseService {
    private readonly logger = new Logger(LighthouseService.name);

    async runAudit(url: string, isMobile: boolean = false): Promise<LighthouseResult> {
        let chrome;
        try {
            this.logger.log(`Starting Lighthouse audit for: ${url} (${isMobile ? 'Mobile' : 'Desktop'})`);

            // Launch Chrome instance
            chrome = await launch({
                chromeFlags: [
                    '--headless',
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage'
                ]
            });

            // Lighthouse configuration
            const config = {
                output: 'json' as const,
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'] as string[],
                port: chrome.port,
                emulatedFormFactor: isMobile ? 'mobile' as const : 'desktop' as const,
                throttling: {
                    rttMs: 40,
                    throughputKbps: 10240,
                    cpuSlowdownMultiplier: 1,
                    requestLatencyMs: 0,
                    downloadThroughputKbps: 0,
                    uploadThroughputKbps: 0
                }
            };

            // Run Lighthouse audit
            const result = await lighthouse(url, config);

            if (!result) {
                throw new Error('Lighthouse audit failed to return results');
            }

            // Parse and format results
            const formattedResult = this.formatLighthouseResults(result.lhr, url);

            this.logger.log(`Lighthouse audit completed for: ${url}`);
            return formattedResult;

        } catch (error) {
            this.logger.error(`Lighthouse audit failed for ${url}:`, error);
            throw error;
        } finally {
            if (chrome) {
                await chrome.kill();
            }
        }
    }

    async runBothAudits(url: string): Promise<{ desktop: LighthouseResult; mobile: LighthouseResult }> {
        const [desktop, mobile] = await Promise.all([
            this.runAudit(url, false),
            this.runAudit(url, true)
        ]);

        return { desktop, mobile };
    }

    private formatLighthouseResults(lhr: any, url: string): LighthouseResult {
        // Extract scores
        const performance_score = Math.round((lhr.categories.performance?.score || 0) * 100);
        const accessibility_score = Math.round((lhr.categories.accessibility?.score || 0) * 100);
        const best_practices_score = Math.round((lhr.categories['best-practices']?.score || 0) * 100);
        const seo_score = Math.round((lhr.categories.seo?.score || 0) * 100);
        const pwa_score = Math.round((lhr.categories.pwa?.score || 0) * 100);

        // Extract metrics
        const audits = lhr.audits;
        const metrics = {
            first_contentful_paint: audits['first-contentful-paint']?.numericValue || 0,
            largest_contentful_paint: audits['largest-contentful-paint']?.numericValue || 0,
            first_input_delay: audits['max-potential-fid']?.numericValue || 0,
            cumulative_layout_shift: audits['cumulative-layout-shift']?.numericValue || 0,
            speed_index: audits['speed-index']?.numericValue || 0,
            total_blocking_time: audits['total-blocking-time']?.numericValue || 0,
            time_to_interactive: audits['interactive']?.numericValue || 0,
        };

        // Extract opportunities
        const opportunities: LighthouseOpportunity[] = [];
        Object.keys(audits).forEach(auditId => {
            const audit = audits[auditId];
            if (audit.details && audit.details.type === 'opportunity' && audit.numericValue > 0) {
                opportunities.push({
                    id: auditId,
                    title: audit.title,
                    description: audit.description,
                    score_display_mode: audit.scoreDisplayMode,
                    potential_savings: audit.numericValue,
                    impact: this.getImpactLevel(audit.numericValue)
                });
            }
        });

        // Extract diagnostics
        const diagnostics: LighthouseDiagnostic[] = [];
        Object.keys(audits).forEach(auditId => {
            const audit = audits[auditId];
            if (audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== 'notApplicable') {
                diagnostics.push({
                    id: auditId,
                    title: audit.title,
                    description: audit.description,
                    score_display_mode: audit.scoreDisplayMode,
                    impact: audit.score < 0.5 ? 'high' : audit.score < 0.9 ? 'medium' : 'low'
                });
            }
        });

        // Check mobile-friendly
        const mobile_friendly = audits['viewport']?.score === 1;

        // Core Web Vitals assessment
        const core_web_vitals = {
            lcp_status: this.assessLCP(metrics.largest_contentful_paint),
            fid_status: this.assessFID(metrics.first_input_delay),
            cls_status: this.assessCLS(metrics.cumulative_layout_shift)
        };

        return {
            url,
            performance_score,
            accessibility_score,
            best_practices_score,
            seo_score,
            pwa_score,
            metrics,
            opportunities: opportunities.sort((a, b) => b.potential_savings - a.potential_savings),
            diagnostics: diagnostics.sort((a, b) => this.getImpactScore(b.impact) - this.getImpactScore(a.impact)),
            mobile_friendly,
            core_web_vitals
        };
    }

    private getImpactLevel(savings: number): 'high' | 'medium' | 'low' {
        if (savings > 1000) return 'high';
        if (savings > 500) return 'medium';
        return 'low';
    }

    private getImpactScore(impact: 'high' | 'medium' | 'low'): number {
        switch (impact) {
            case 'high': return 3;
            case 'medium': return 2;
            case 'low': return 1;
        }
    }

    private assessLCP(lcp: number): 'good' | 'needs_improvement' | 'poor' {
        if (lcp <= 2500) return 'good';
        if (lcp <= 4000) return 'needs_improvement';
        return 'poor';
    }

    private assessFID(fid: number): 'good' | 'needs_improvement' | 'poor' {
        if (fid <= 100) return 'good';
        if (fid <= 300) return 'needs_improvement';
        return 'poor';
    }

    private assessCLS(cls: number): 'good' | 'needs_improvement' | 'poor' {
        if (cls <= 0.1) return 'good';
        if (cls <= 0.25) return 'needs_improvement';
        return 'poor';
    }

    async measureWebVitals(page: Page): Promise<{
        lcp: number;
        fid: number;
        cls: number;
        fcp: number;
        ttfb: number;
    }> {
        try {
            // Inject Web Vitals library
            await page.addScriptTag({
                url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
            });

            // Measure Web Vitals
            const webVitals = await page.evaluate(() => {
                return new Promise<any>((resolve) => {
                    const vitals: any = {};
                    let metricsCollected = 0;
                    const totalMetrics = 5;

                    const onVital = (metric: any) => {
                        vitals[metric.name] = metric.value;
                        metricsCollected++;
                        if (metricsCollected === totalMetrics) {
                            resolve(vitals);
                        }
                    };

                    // @ts-ignore
                    if (typeof webVitals !== 'undefined') {
                        // @ts-ignore
                        webVitals.onLCP(onVital);
                        // @ts-ignore
                        webVitals.onFID(onVital);
                        // @ts-ignore
                        webVitals.onCLS(onVital);
                        // @ts-ignore
                        webVitals.onFCP(onVital);
                        // @ts-ignore
                        webVitals.onTTFB(onVital);
                    }

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        resolve(vitals);
                    }, 10000);
                });
            }) as any;

            return {
                lcp: webVitals?.LCP || 0,
                fid: webVitals?.FID || 0,
                cls: webVitals?.CLS || 0,
                fcp: webVitals?.FCP || 0,
                ttfb: webVitals?.TTFB || 0
            };
        } catch (error) {
            this.logger.warn('Failed to measure Web Vitals:', error);
            return {
                lcp: 0,
                fid: 0,
                cls: 0,
                fcp: 0,
                ttfb: 0
            };
        }
    }

    generatePerformanceRecommendations(result: LighthouseResult): string[] {
        const recommendations: string[] = [];

        if (result.performance_score < 50) {
            recommendations.push('Performance score is critically low. Immediate optimization needed.');
        } else if (result.performance_score < 90) {
            recommendations.push('Performance can be improved significantly.');
        }

        if (result.core_web_vitals.lcp_status === 'poor') {
            recommendations.push('Largest Contentful Paint is too slow. Optimize images and server response times.');
        }

        if (result.core_web_vitals.fid_status === 'poor') {
            recommendations.push('First Input Delay is too high. Reduce JavaScript execution time.');
        }

        if (result.core_web_vitals.cls_status === 'poor') {
            recommendations.push('Cumulative Layout Shift is causing visual instability. Set dimensions for images and ads.');
        }

        if (!result.mobile_friendly) {
            recommendations.push('Website is not mobile-friendly. Add responsive design.');
        }

        // Add specific recommendations based on opportunities
        result.opportunities.slice(0, 3).forEach(opportunity => {
            recommendations.push(`${opportunity.title}: ${opportunity.description}`);
        });

        return recommendations;
    }
}
