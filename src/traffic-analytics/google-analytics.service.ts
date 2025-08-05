import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { DatabaseService } from '../database/database.service';
import {
    TimePeriod,
    MetricType,
    DimensionType,
    TrafficAnalyticsQueryDto,
    TrafficMetricData,
    PagePerformanceData,
    TrafficSourceData,
    DeviceData,
    GeographicData,
    RealTimeData
} from './dto/traffic-analytics.dto';

@Injectable()
export class GoogleAnalyticsService {
    private readonly logger = new Logger(GoogleAnalyticsService.name);
    private analyticsData: any;

    constructor(private readonly db: DatabaseService) {
        this.initializeGoogleAnalytics();
    }

    private async initializeGoogleAnalytics() {
        try {
            const auth = new GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
                // Có thể sử dụng service account key file hoặc credentials từ environment
                keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
                credentials: process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS ?
                    JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) : undefined,
            });

            this.analyticsData = google.analyticsdata({
                version: 'v1beta',
                auth,
            });

            this.logger.log('Google Analytics API initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Google Analytics API', error);
        }
    }

    private async getGoogleAnalyticsPropertyId(userId: string, projectId: string): Promise<string> {
        // Lấy Google Analytics property ID từ database integration
        const integration = await this.db.integration.findFirst({
            where: {
                userId,
                type: 'google_analytics',
                isActive: true,
                config: {
                    path: ['projectId'],
                    equals: projectId
                }
            }
        });

        if (!integration || !integration.config || !integration.config['propertyId']) {
            throw new BadRequestException('Google Analytics integration not found or property ID not configured');
        }

        return integration.config['propertyId'] as string;
    }

    private getDateRange(period: TimePeriod, startDate?: string, endDate?: string): { startDate: string; endDate: string } {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        switch (period) {
            case TimePeriod.TODAY:
                return { startDate: todayStr, endDate: todayStr };

            case TimePeriod.YESTERDAY:
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                return { startDate: yesterdayStr, endDate: yesterdayStr };

            case TimePeriod.LAST_7_DAYS:
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return { startDate: sevenDaysAgo.toISOString().split('T')[0], endDate: todayStr };

            case TimePeriod.LAST_30_DAYS:
                const thirtyDaysAgo = new Date(today);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return { startDate: thirtyDaysAgo.toISOString().split('T')[0], endDate: todayStr };

            case TimePeriod.LAST_90_DAYS:
                const ninetyDaysAgo = new Date(today);
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
                return { startDate: ninetyDaysAgo.toISOString().split('T')[0], endDate: todayStr };

            case TimePeriod.LAST_12_MONTHS:
                const twelveMonthsAgo = new Date(today);
                twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
                return { startDate: twelveMonthsAgo.toISOString().split('T')[0], endDate: todayStr };

            case TimePeriod.CUSTOM:
                if (!startDate || !endDate) {
                    throw new BadRequestException('Start date and end date are required for custom period');
                }
                return { startDate, endDate };

            default:
                return { startDate: new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0], endDate: todayStr };
        }
    }

    private mapMetricToGA4(metric: MetricType): string {
        const metricMap = {
            [MetricType.SESSIONS]: 'sessions',
            [MetricType.USERS]: 'totalUsers',
            [MetricType.PAGEVIEWS]: 'screenPageViews',
            [MetricType.BOUNCE_RATE]: 'bounceRate',
            [MetricType.SESSION_DURATION]: 'userEngagementDuration',
            [MetricType.CONVERSION_RATE]: 'conversions'
        };
        return metricMap[metric] || 'sessions';
    }

    private mapDimensionToGA4(dimension: DimensionType): string {
        const dimensionMap = {
            [DimensionType.DATE]: 'date',
            [DimensionType.PAGE]: 'pagePath',
            [DimensionType.SOURCE]: 'sessionSource',
            [DimensionType.MEDIUM]: 'sessionMedium',
            [DimensionType.COUNTRY]: 'country',
            [DimensionType.DEVICE]: 'deviceCategory',
            [DimensionType.BROWSER]: 'browser'
        };
        return dimensionMap[dimension] || 'date';
    }

    async getTrafficOverview(
        userId: string,
        projectId: string,
        queryDto: TrafficAnalyticsQueryDto
    ): Promise<TrafficMetricData[]> {
        try {
            const propertyId = await this.getGoogleAnalyticsPropertyId(userId, projectId);
            const { startDate, endDate } = this.getDateRange(queryDto.period || TimePeriod.LAST_7_DAYS, queryDto.startDate, queryDto.endDate);

            const metrics = queryDto.metrics?.map(m => ({ name: this.mapMetricToGA4(m) })) || [
                { name: 'sessions' },
                { name: 'totalUsers' },
                { name: 'screenPageViews' },
                { name: 'bounceRate' },
                { name: 'userEngagementDuration' }
            ];

            const dimensions = queryDto.dimensions?.map(d => ({ name: this.mapDimensionToGA4(d) })) || [
                { name: 'date' }
            ];

            const response = await this.analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate }],
                    metrics,
                    dimensions,
                    limit: queryDto.limit?.toString(),
                    offset: queryDto.offset?.toString(),
                    orderBys: [{ dimension: { dimensionName: 'date' } }]
                }
            });

            const rows = response.data?.rows || [];
            return rows.map(row => {
                const dimensionValues = row.dimensionValues || [];
                const metricValues = row.metricValues || [];

                return {
                    date: dimensionValues[0]?.value || '',
                    sessions: parseInt(metricValues[0]?.value || '0'),
                    users: parseInt(metricValues[1]?.value || '0'),
                    pageviews: parseInt(metricValues[2]?.value || '0'),
                    bounceRate: parseFloat(metricValues[3]?.value || '0'),
                    avgSessionDuration: parseFloat(metricValues[4]?.value || '0'),
                    newUsers: parseInt(metricValues[5]?.value || '0'),
                    returningUsers: parseInt(metricValues[1]?.value || '0') - parseInt(metricValues[5]?.value || '0')
                };
            });

        } catch (error) {
            this.logger.error('Error fetching traffic overview from Google Analytics', error);
            throw new BadRequestException('Failed to fetch traffic data from Google Analytics');
        }
    }

    async getPagePerformance(
        userId: string,
        projectId: string,
        queryDto: TrafficAnalyticsQueryDto
    ): Promise<PagePerformanceData[]> {
        try {
            const propertyId = await this.getGoogleAnalyticsPropertyId(userId, projectId);
            const { startDate, endDate } = this.getDateRange(queryDto.period || TimePeriod.LAST_7_DAYS, queryDto.startDate, queryDto.endDate);

            const response = await this.analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate }],
                    metrics: [
                        { name: 'sessions' },
                        { name: 'screenPageViews' },
                        { name: 'userEngagementDuration' },
                        { name: 'bounceRate' },
                        { name: 'entrances' }
                    ],
                    dimensions: [
                        { name: 'pagePath' },
                        { name: 'pageTitle' }
                    ],
                    limit: queryDto.limit?.toString(),
                    offset: queryDto.offset?.toString(),
                    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
                }
            });

            const rows = response.data?.rows || [];
            return rows.map(row => {
                const dimensionValues = row.dimensionValues || [];
                const metricValues = row.metricValues || [];

                const sessions = parseInt(metricValues[0]?.value || '0');
                const pageviews = parseInt(metricValues[1]?.value || '0');
                const totalTime = parseFloat(metricValues[2]?.value || '0');

                return {
                    pagePath: dimensionValues[0]?.value || '',
                    pageTitle: dimensionValues[1]?.value || '',
                    sessions,
                    pageviews,
                    uniquePageviews: pageviews, // GA4 doesn't have unique pageviews, using pageviews
                    avgTimeOnPage: sessions > 0 ? totalTime / sessions : 0,
                    bounceRate: parseFloat(metricValues[3]?.value || '0'),
                    exitRate: 0, // Calculate separately if needed
                    entrances: parseInt(metricValues[4]?.value || '0')
                };
            });

        } catch (error) {
            this.logger.error('Error fetching page performance from Google Analytics', error);
            throw new BadRequestException('Failed to fetch page performance data from Google Analytics');
        }
    }

    async getTrafficSources(
        userId: string,
        projectId: string,
        queryDto: TrafficAnalyticsQueryDto
    ): Promise<TrafficSourceData[]> {
        try {
            const propertyId = await this.getGoogleAnalyticsPropertyId(userId, projectId);
            const { startDate, endDate } = this.getDateRange(queryDto.period || TimePeriod.LAST_7_DAYS, queryDto.startDate, queryDto.endDate);

            const response = await this.analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate }],
                    metrics: [
                        { name: 'sessions' },
                        { name: 'totalUsers' },
                        { name: 'newUsers' },
                        { name: 'bounceRate' },
                        { name: 'userEngagementDuration' },
                        { name: 'conversions' }
                    ],
                    dimensions: [
                        { name: 'sessionSource' },
                        { name: 'sessionMedium' }
                    ],
                    limit: queryDto.limit?.toString(),
                    offset: queryDto.offset?.toString(),
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
                }
            });

            const rows = response.data?.rows || [];
            return rows.map(row => {
                const dimensionValues = row.dimensionValues || [];
                const metricValues = row.metricValues || [];

                const sessions = parseInt(metricValues[0]?.value || '0');
                const conversions = parseInt(metricValues[5]?.value || '0');

                return {
                    source: dimensionValues[0]?.value || '',
                    medium: dimensionValues[1]?.value || '',
                    sessions,
                    users: parseInt(metricValues[1]?.value || '0'),
                    newUsers: parseInt(metricValues[2]?.value || '0'),
                    bounceRate: parseFloat(metricValues[3]?.value || '0'),
                    avgSessionDuration: parseFloat(metricValues[4]?.value || '0'),
                    conversions,
                    conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0
                };
            });

        } catch (error) {
            this.logger.error('Error fetching traffic sources from Google Analytics', error);
            throw new BadRequestException('Failed to fetch traffic sources data from Google Analytics');
        }
    }

    async getDeviceData(
        userId: string,
        projectId: string,
        queryDto: TrafficAnalyticsQueryDto
    ): Promise<DeviceData[]> {
        try {
            const propertyId = await this.getGoogleAnalyticsPropertyId(userId, projectId);
            const { startDate, endDate } = this.getDateRange(queryDto.period || TimePeriod.LAST_7_DAYS, queryDto.startDate, queryDto.endDate);

            const response = await this.analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate }],
                    metrics: [
                        { name: 'sessions' },
                        { name: 'totalUsers' },
                        { name: 'bounceRate' },
                        { name: 'userEngagementDuration' }
                    ],
                    dimensions: [
                        { name: 'deviceCategory' }
                    ],
                    limit: queryDto.limit?.toString(),
                    offset: queryDto.offset?.toString(),
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
                }
            });

            const rows = response.data?.rows || [];
            const totalSessions = rows.reduce((sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'), 0);

            return rows.map(row => {
                const dimensionValues = row.dimensionValues || [];
                const metricValues = row.metricValues || [];
                const sessions = parseInt(metricValues[0]?.value || '0');

                return {
                    deviceCategory: dimensionValues[0]?.value || '',
                    sessions,
                    users: parseInt(metricValues[1]?.value || '0'),
                    bounceRate: parseFloat(metricValues[2]?.value || '0'),
                    avgSessionDuration: parseFloat(metricValues[3]?.value || '0'),
                    percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0
                };
            });

        } catch (error) {
            this.logger.error('Error fetching device data from Google Analytics', error);
            throw new BadRequestException('Failed to fetch device data from Google Analytics');
        }
    }

    async getGeographicData(
        userId: string,
        projectId: string,
        queryDto: TrafficAnalyticsQueryDto
    ): Promise<GeographicData[]> {
        try {
            const propertyId = await this.getGoogleAnalyticsPropertyId(userId, projectId);
            const { startDate, endDate } = this.getDateRange(queryDto.period || TimePeriod.LAST_7_DAYS, queryDto.startDate, queryDto.endDate);

            const response = await this.analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate, endDate }],
                    metrics: [
                        { name: 'sessions' },
                        { name: 'totalUsers' },
                        { name: 'bounceRate' },
                        { name: 'userEngagementDuration' }
                    ],
                    dimensions: [
                        { name: 'country' },
                        { name: 'countryId' }
                    ],
                    limit: queryDto.limit?.toString(),
                    offset: queryDto.offset?.toString(),
                    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
                }
            });

            const rows = response.data?.rows || [];
            const totalSessions = rows.reduce((sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'), 0);

            return rows.map(row => {
                const dimensionValues = row.dimensionValues || [];
                const metricValues = row.metricValues || [];
                const sessions = parseInt(metricValues[0]?.value || '0');

                return {
                    country: dimensionValues[0]?.value || '',
                    countryCode: dimensionValues[1]?.value || '',
                    sessions,
                    users: parseInt(metricValues[1]?.value || '0'),
                    bounceRate: parseFloat(metricValues[2]?.value || '0'),
                    avgSessionDuration: parseFloat(metricValues[3]?.value || '0'),
                    percentage: totalSessions > 0 ? (sessions / totalSessions) * 100 : 0
                };
            });

        } catch (error) {
            this.logger.error('Error fetching geographic data from Google Analytics', error);
            throw new BadRequestException('Failed to fetch geographic data from Google Analytics');
        }
    }

    async getRealTimeData(
        userId: string,
        projectId: string
    ): Promise<RealTimeData> {
        try {
            const propertyId = await this.getGoogleAnalyticsPropertyId(userId, projectId);

            // Real-time data endpoint
            const response = await this.analyticsData.properties.runRealtimeReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    metrics: [
                        { name: 'activeUsers' }
                    ],
                    dimensions: [
                        { name: 'unifiedPagePathScreen' }
                    ],
                    limit: '10'
                }
            });

            const rows = response.data?.rows || [];
            const totalActiveUsers = rows.reduce((sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'), 0);

            // Get top pages
            const topPages = rows.slice(0, 10).map(row => ({
                pagePath: row.dimensionValues?.[0]?.value || '',
                activeUsers: parseInt(row.metricValues?.[0]?.value || '0')
            }));

            return {
                activeUsers: totalActiveUsers,
                activePages: rows.length,
                topPages,
                topSources: [], // Would need separate API call for sources
                topCountries: [], // Would need separate API call for countries
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            this.logger.error('Error fetching real-time data from Google Analytics', error);
            throw new BadRequestException('Failed to fetch real-time data from Google Analytics');
        }
    }

    // Store traffic data in local database for historical analysis
    async syncTrafficDataToDatabase(
        userId: string,
        projectId: string,
        data: TrafficMetricData[]
    ): Promise<void> {
        try {
            for (const dailyData of data) {
                await this.db.trafficData.upsert({
                    where: {
                        projectId_source_date_page: {
                            projectId,
                            source: 'all',
                            date: new Date(dailyData.date),
                            page: '/'
                        }
                    },
                    update: {
                        sessions: dailyData.sessions,
                        users: dailyData.users,
                        pageviews: dailyData.pageviews,
                        bounceRate: dailyData.bounceRate,
                        avgSessionDuration: dailyData.avgSessionDuration
                    },
                    create: {
                        id: `${projectId}-${dailyData.date}-all`,
                        projectId,
                        date: new Date(dailyData.date),
                        page: '/',
                        source: 'all',
                        sessions: dailyData.sessions,
                        users: dailyData.users,
                        pageviews: dailyData.pageviews,
                        bounceRate: dailyData.bounceRate,
                        avgSessionDuration: dailyData.avgSessionDuration,
                        createdAt: new Date()
                    }
                });
            }

            this.logger.log(`Synced ${data.length} traffic data records to database`);
        } catch (error) {
            this.logger.error('Error syncing traffic data to database', error);
        }
    }
}
