import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import {
    TrafficAnalyticsQueryDto,
    PagePerformanceQueryDto,
    TrafficSourceQueryDto,
    UserBehaviorQueryDto,
    RealTimeAnalyticsDto,
    TrafficOverviewResponse,
    PagePerformanceResponse,
    TrafficSourceResponse,
    UserBehaviorResponse,
    RealTimeData,
    TrafficMetricData,
    TimePeriod
} from './dto/traffic-analytics.dto';

@Injectable()
export class TrafficAnalyticsService {
    private readonly logger = new Logger(TrafficAnalyticsService.name);

    constructor(
        private readonly db: DatabaseService,
        private readonly googleAnalyticsService: GoogleAnalyticsService
    ) { }

    async getTrafficOverview(
        userId: string,
        projectId: string,
        queryDto: TrafficAnalyticsQueryDto
    ): Promise<TrafficOverviewResponse> {
        try {
            this.logger.log(`Getting traffic overview for project ${projectId}`);

            // Get current period data from Google Analytics
            const currentPeriodData = await this.googleAnalyticsService.getTrafficOverview(
                userId,
                projectId,
                queryDto
            );

            // Sync data to database
            await this.googleAnalyticsService.syncTrafficDataToDatabase(userId, projectId, currentPeriodData);

            // Calculate totals
            const totalSessions = currentPeriodData.reduce((sum, d) => sum + d.sessions, 0);
            const totalUsers = currentPeriodData.reduce((sum, d) => sum + d.users, 0);
            const totalPageviews = currentPeriodData.reduce((sum, d) => sum + d.pageviews, 0);
            const avgBounceRate = currentPeriodData.length > 0
                ? currentPeriodData.reduce((sum, d) => sum + d.bounceRate, 0) / currentPeriodData.length
                : 0;
            const avgSessionDuration = currentPeriodData.length > 0
                ? currentPeriodData.reduce((sum, d) => sum + d.avgSessionDuration, 0) / currentPeriodData.length
                : 0;

            const totalNewUsers = currentPeriodData.reduce((sum, d) => sum + d.newUsers, 0);
            const newUsersPercentage = totalUsers > 0 ? (totalNewUsers / totalUsers) * 100 : 0;
            const returningUsersPercentage = 100 - newUsersPercentage;

            // Get comparison data (previous period)
            const comparisonPeriod = this.getPreviousPeriod(queryDto);
            const previousPeriodData = await this.googleAnalyticsService.getTrafficOverview(
                userId,
                projectId,
                comparisonPeriod
            );

            const prevTotalSessions = previousPeriodData.reduce((sum, d) => sum + d.sessions, 0);
            const prevTotalUsers = previousPeriodData.reduce((sum, d) => sum + d.users, 0);
            const prevTotalPageviews = previousPeriodData.reduce((sum, d) => sum + d.pageviews, 0);
            const prevAvgBounceRate = previousPeriodData.length > 0
                ? previousPeriodData.reduce((sum, d) => sum + d.bounceRate, 0) / previousPeriodData.length
                : 0;

            // Calculate percentage changes
            const sessionsChange = this.calculatePercentageChange(totalSessions, prevTotalSessions);
            const usersChange = this.calculatePercentageChange(totalUsers, prevTotalUsers);
            const pageviewsChange = this.calculatePercentageChange(totalPageviews, prevTotalPageviews);
            const bounceRateChange = this.calculatePercentageChange(avgBounceRate, prevAvgBounceRate);

            return {
                totalSessions,
                totalUsers,
                totalPageviews,
                avgBounceRate,
                avgSessionDuration,
                newUsersPercentage,
                returningUsersPercentage,
                trends: currentPeriodData,
                periodComparison: {
                    sessionsChange,
                    usersChange,
                    pageviewsChange,
                    bounceRateChange
                }
            };

        } catch (error) {
            this.logger.error('Error getting traffic overview', error);
            throw new BadRequestException('Failed to get traffic overview');
        }
    }

    async getPagePerformance(
        userId: string,
        projectId: string,
        queryDto: PagePerformanceQueryDto
    ): Promise<PagePerformanceResponse> {
        try {
            this.logger.log(`Getting page performance for project ${projectId}`);

            const pages = await this.googleAnalyticsService.getPagePerformance(
                userId,
                projectId,
                queryDto
            );

            const totalPages = pages.length;
            const totalPageviews = pages.reduce((sum, p) => sum + p.pageviews, 0);
            const avgTimeOnPage = pages.length > 0
                ? pages.reduce((sum, p) => sum + p.avgTimeOnPage, 0) / pages.length
                : 0;
            const avgBounceRate = pages.length > 0
                ? pages.reduce((sum, p) => sum + p.bounceRate, 0) / pages.length
                : 0;

            return {
                pages,
                totalPages,
                totalPageviews,
                avgTimeOnPage,
                avgBounceRate
            };

        } catch (error) {
            this.logger.error('Error getting page performance', error);
            throw new BadRequestException('Failed to get page performance');
        }
    }

    async getTrafficSources(
        userId: string,
        projectId: string,
        queryDto: TrafficSourceQueryDto
    ): Promise<TrafficSourceResponse> {
        try {
            this.logger.log(`Getting traffic sources for project ${projectId}`);

            const sources = await this.googleAnalyticsService.getTrafficSources(
                userId,
                projectId,
                queryDto
            );

            const totalSessions = sources.reduce((sum, s) => sum + s.sessions, 0);

            // Calculate percentages by source type
            const organicSessions = sources
                .filter(s => s.source === 'google' && s.medium === 'organic')
                .reduce((sum, s) => sum + s.sessions, 0);

            const directSessions = sources
                .filter(s => s.source === '(direct)' && s.medium === '(none)')
                .reduce((sum, s) => sum + s.sessions, 0);

            const referralSessions = sources
                .filter(s => s.medium === 'referral')
                .reduce((sum, s) => sum + s.sessions, 0);

            const socialSessions = sources
                .filter(s => s.medium === 'social')
                .reduce((sum, s) => sum + s.sessions, 0);

            const paidSessions = sources
                .filter(s => s.medium === 'cpc' || s.medium === 'ppc')
                .reduce((sum, s) => sum + s.sessions, 0);

            return {
                sources,
                organicPercentage: totalSessions > 0 ? (organicSessions / totalSessions) * 100 : 0,
                directPercentage: totalSessions > 0 ? (directSessions / totalSessions) * 100 : 0,
                referralPercentage: totalSessions > 0 ? (referralSessions / totalSessions) * 100 : 0,
                socialPercentage: totalSessions > 0 ? (socialSessions / totalSessions) * 100 : 0,
                paidPercentage: totalSessions > 0 ? (paidSessions / totalSessions) * 100 : 0
            };

        } catch (error) {
            this.logger.error('Error getting traffic sources', error);
            throw new BadRequestException('Failed to get traffic sources');
        }
    }

    async getUserBehavior(
        userId: string,
        projectId: string,
        queryDto: UserBehaviorQueryDto
    ): Promise<UserBehaviorResponse> {
        try {
            this.logger.log(`Getting user behavior for project ${projectId}`);

            const devices = await this.googleAnalyticsService.getDeviceData(
                userId,
                projectId,
                queryDto
            );

            const geographic = queryDto.includeGeographic
                ? await this.googleAnalyticsService.getGeographicData(userId, projectId, queryDto)
                : [];

            // Calculate summary metrics
            const mobileData = devices.find(d => d.deviceCategory === 'mobile');
            const desktopData = devices.find(d => d.deviceCategory === 'desktop');
            const tabletData = devices.find(d => d.deviceCategory === 'tablet');

            const mobilePercentage = mobileData?.percentage || 0;
            const desktopPercentage = desktopData?.percentage || 0;
            const tabletPercentage = tabletData?.percentage || 0;

            const topCountryData = geographic.length > 0 ? geographic[0] : null;
            const topCountry = topCountryData?.country || 'Unknown';
            const topCountryPercentage = topCountryData?.percentage || 0;

            return {
                devices,
                geographic,
                summary: {
                    mobilePercentage,
                    desktopPercentage,
                    tabletPercentage,
                    topCountry,
                    topCountryPercentage
                }
            };

        } catch (error) {
            this.logger.error('Error getting user behavior', error);
            throw new BadRequestException('Failed to get user behavior');
        }
    }

    async getRealTimeAnalytics(
        userId: string,
        projectId: string,
        queryDto: RealTimeAnalyticsDto
    ): Promise<RealTimeData> {
        try {
            this.logger.log(`Getting real-time analytics for project ${projectId}`);

            return await this.googleAnalyticsService.getRealTimeData(userId, projectId);

        } catch (error) {
            this.logger.error('Error getting real-time analytics', error);
            throw new BadRequestException('Failed to get real-time analytics');
        }
    }

    async syncAllTrafficData(userId: string, projectId: string): Promise<{ message: string; recordsSynced: number }> {
        try {
            this.logger.log(`Syncing all traffic data for project ${projectId}`);

            // Sync last 90 days of data
            const queryDto: TrafficAnalyticsQueryDto = {
                period: TimePeriod.LAST_90_DAYS,
                limit: 1000
            };

            const trafficData = await this.googleAnalyticsService.getTrafficOverview(
                userId,
                projectId,
                queryDto
            );

            await this.googleAnalyticsService.syncTrafficDataToDatabase(userId, projectId, trafficData);

            return {
                message: 'Traffic data synchronized successfully',
                recordsSynced: trafficData.length
            };

        } catch (error) {
            this.logger.error('Error syncing traffic data', error);
            throw new BadRequestException('Failed to sync traffic data');
        }
    }

    // Helper methods
    private getPreviousPeriod(queryDto: TrafficAnalyticsQueryDto): TrafficAnalyticsQueryDto {
        const currentPeriod = queryDto.period || TimePeriod.LAST_7_DAYS;

        // Calculate the number of days in current period
        const today = new Date();
        let daysDiff = 7; // default

        switch (currentPeriod) {
            case TimePeriod.TODAY:
                daysDiff = 1;
                break;
            case TimePeriod.YESTERDAY:
                daysDiff = 1;
                break;
            case TimePeriod.LAST_7_DAYS:
                daysDiff = 7;
                break;
            case TimePeriod.LAST_30_DAYS:
                daysDiff = 30;
                break;
            case TimePeriod.LAST_90_DAYS:
                daysDiff = 90;
                break;
            case TimePeriod.LAST_12_MONTHS:
                daysDiff = 365;
                break;
            case TimePeriod.CUSTOM:
                if (queryDto.startDate && queryDto.endDate) {
                    const start = new Date(queryDto.startDate);
                    const end = new Date(queryDto.endDate);
                    daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                }
                break;
        }

        // Calculate previous period dates
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() - daysDiff);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - daysDiff);

        return {
            ...queryDto,
            period: TimePeriod.CUSTOM,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    }

    private calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    }
}
