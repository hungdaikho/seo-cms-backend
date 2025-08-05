import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsEnum, IsInt, Min, Max, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum TimePeriod {
    TODAY = 'today',
    YESTERDAY = 'yesterday',
    LAST_7_DAYS = '7d',
    LAST_30_DAYS = '30d',
    LAST_90_DAYS = '90d',
    LAST_12_MONTHS = '12m',
    CUSTOM = 'custom'
}

export enum MetricType {
    SESSIONS = 'sessions',
    USERS = 'users',
    PAGEVIEWS = 'pageviews',
    BOUNCE_RATE = 'bounceRate',
    SESSION_DURATION = 'sessionDuration',
    CONVERSION_RATE = 'conversionRate'
}

export enum DimensionType {
    DATE = 'date',
    PAGE = 'page',
    SOURCE = 'source',
    MEDIUM = 'medium',
    COUNTRY = 'country',
    DEVICE = 'device',
    BROWSER = 'browser'
}

export class TrafficAnalyticsQueryDto {
    @ApiPropertyOptional({ enum: TimePeriod, default: TimePeriod.LAST_7_DAYS })
    @IsOptional()
    @IsEnum(TimePeriod)
    period?: TimePeriod = TimePeriod.LAST_7_DAYS;

    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD) - required for custom period' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD) - required for custom period' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ enum: MetricType, isArray: true, default: [MetricType.SESSIONS, MetricType.USERS] })
    @IsOptional()
    @IsArray()
    @IsEnum(MetricType, { each: true })
    metrics?: MetricType[] = [MetricType.SESSIONS, MetricType.USERS];

    @ApiPropertyOptional({ enum: DimensionType, isArray: true, default: [DimensionType.DATE] })
    @IsOptional()
    @IsArray()
    @IsEnum(DimensionType, { each: true })
    dimensions?: DimensionType[] = [DimensionType.DATE];

    @ApiPropertyOptional({ description: 'Limit number of results', default: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10000)
    limit?: number = 100;

    @ApiPropertyOptional({ description: 'Offset for pagination', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number = 0;
}

export class PagePerformanceQueryDto extends TrafficAnalyticsQueryDto {
    @ApiPropertyOptional({ description: 'Filter by specific page path' })
    @IsOptional()
    @IsString()
    pagePath?: string;

    @ApiPropertyOptional({ description: 'Sort by metric', enum: MetricType, default: MetricType.PAGEVIEWS })
    @IsOptional()
    @IsEnum(MetricType)
    sortBy?: MetricType = MetricType.PAGEVIEWS;

    @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}

export class TrafficSourceQueryDto extends TrafficAnalyticsQueryDto {
    @ApiPropertyOptional({ description: 'Group by source/medium', default: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    groupBySourceMedium?: boolean = true;
}

export class UserBehaviorQueryDto extends TrafficAnalyticsQueryDto {
    @ApiPropertyOptional({ description: 'Include device breakdown', default: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includeDevices?: boolean = true;

    @ApiPropertyOptional({ description: 'Include geographic data', default: true })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includeGeographic?: boolean = true;

    @ApiPropertyOptional({ description: 'Include browser data', default: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    includeBrowsers?: boolean = false;
}

export class RealTimeAnalyticsDto {
    @ApiPropertyOptional({ description: 'Number of minutes to look back', default: 30 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(60)
    minutesAgo?: number = 30;
}

// Response DTOs
export class TrafficMetricData {
    @ApiProperty()
    date: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    users: number;

    @ApiProperty()
    pageviews: number;

    @ApiProperty()
    bounceRate: number;

    @ApiProperty()
    avgSessionDuration: number;

    @ApiProperty()
    newUsers: number;

    @ApiProperty()
    returningUsers: number;
}

export class PagePerformanceData {
    @ApiProperty()
    pagePath: string;

    @ApiProperty()
    pageTitle: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    pageviews: number;

    @ApiProperty()
    uniquePageviews: number;

    @ApiProperty()
    avgTimeOnPage: number;

    @ApiProperty()
    bounceRate: number;

    @ApiProperty()
    exitRate: number;

    @ApiProperty()
    entrances: number;
}

export class TrafficSourceData {
    @ApiProperty()
    source: string;

    @ApiProperty()
    medium: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    users: number;

    @ApiProperty()
    newUsers: number;

    @ApiProperty()
    bounceRate: number;

    @ApiProperty()
    avgSessionDuration: number;

    @ApiProperty()
    conversions: number;

    @ApiProperty()
    conversionRate: number;
}

export class DeviceData {
    @ApiProperty()
    deviceCategory: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    users: number;

    @ApiProperty()
    bounceRate: number;

    @ApiProperty()
    avgSessionDuration: number;

    @ApiProperty()
    percentage: number;
}

export class GeographicData {
    @ApiProperty()
    country: string;

    @ApiProperty()
    countryCode: string;

    @ApiProperty()
    sessions: number;

    @ApiProperty()
    users: number;

    @ApiProperty()
    bounceRate: number;

    @ApiProperty()
    avgSessionDuration: number;

    @ApiProperty()
    percentage: number;
}

export class RealTimeData {
    @ApiProperty()
    activeUsers: number;

    @ApiProperty()
    activePages: number;

    @ApiProperty()
    topPages: Array<{
        pagePath: string;
        activeUsers: number;
    }>;

    @ApiProperty()
    topSources: Array<{
        source: string;
        activeUsers: number;
    }>;

    @ApiProperty()
    topCountries: Array<{
        country: string;
        activeUsers: number;
    }>;

    @ApiProperty()
    timestamp: string;
}

export class TrafficOverviewResponse {
    @ApiProperty()
    totalSessions: number;

    @ApiProperty()
    totalUsers: number;

    @ApiProperty()
    totalPageviews: number;

    @ApiProperty()
    avgBounceRate: number;

    @ApiProperty()
    avgSessionDuration: number;

    @ApiProperty()
    newUsersPercentage: number;

    @ApiProperty()
    returningUsersPercentage: number;

    @ApiProperty({ type: [TrafficMetricData] })
    trends: TrafficMetricData[];

    @ApiProperty()
    periodComparison: {
        sessionsChange: number;
        usersChange: number;
        pageviewsChange: number;
        bounceRateChange: number;
    };
}

export class PagePerformanceResponse {
    @ApiProperty({ type: [PagePerformanceData] })
    pages: PagePerformanceData[];

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    totalPageviews: number;

    @ApiProperty()
    avgTimeOnPage: number;

    @ApiProperty()
    avgBounceRate: number;
}

export class TrafficSourceResponse {
    @ApiProperty({ type: [TrafficSourceData] })
    sources: TrafficSourceData[];

    @ApiProperty()
    organicPercentage: number;

    @ApiProperty()
    directPercentage: number;

    @ApiProperty()
    referralPercentage: number;

    @ApiProperty()
    socialPercentage: number;

    @ApiProperty()
    paidPercentage: number;
}

export class UserBehaviorResponse {
    @ApiProperty({ type: [DeviceData] })
    devices: DeviceData[];

    @ApiProperty({ type: [GeographicData] })
    geographic: GeographicData[];

    @ApiProperty()
    browserData?: Array<{
        browser: string;
        sessions: number;
        percentage: number;
    }>;

    @ApiProperty()
    summary: {
        mobilePercentage: number;
        desktopPercentage: number;
        tabletPercentage: number;
        topCountry: string;
        topCountryPercentage: number;
    };
}
