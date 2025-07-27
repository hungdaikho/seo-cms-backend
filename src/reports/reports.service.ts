import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
    CreateReportDto,
    GenerateReportDto,
    ReportType,
    ReportStatus,
    KeywordRankingReportData,
    TrafficAnalysisReportData,
    ContentPerformanceReportData,
    KeywordRankingData,
    TrafficData,
    ContentPageData
} from './dto/report.dto';

@Injectable()
export class ReportsService {
    constructor(private readonly db: DatabaseService) { }

    async createReport(userId: string, createDto: CreateReportDto) {
        // Verify project ownership
        const project = await this.db.project.findFirst({
            where: { id: createDto.projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return this.db.report.create({
            data: {
                name: createDto.name,
                userId,
                projectId: createDto.projectId,
                type: createDto.type,
                status: ReportStatus.PENDING,
                config: createDto.config || {},
            },
        });
    }

    async getUserReports(userId: string, projectId?: string) {
        const where: any = { userId };
        if (projectId) {
            where.projectId = projectId;
        }

        return this.db.report.findMany({
            where,
            include: {
                project: {
                    select: { id: true, name: true, domain: true }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getReportById(userId: string, reportId: string) {
        const report = await this.db.report.findFirst({
            where: { id: reportId, userId },
            include: {
                project: {
                    select: { id: true, name: true, domain: true }
                }
            },
        });

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        return report;
    }

    async deleteReport(userId: string, reportId: string) {
        const report = await this.db.report.findFirst({
            where: { id: reportId, userId },
        });

        if (!report) {
            throw new NotFoundException('Report not found');
        }

        await this.db.report.delete({
            where: { id: reportId },
        });

        return { message: 'Report deleted successfully' };
    }

    async generateReport(userId: string, generateDto: GenerateReportDto) {
        // Verify project ownership
        const project = await this.db.project.findFirst({
            where: { id: generateDto.projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Create report record
        const report = await this.db.report.create({
            data: {
                name: `${generateDto.type.replace('_', ' ')} Report - ${new Date().toLocaleDateString()}`,
                userId,
                projectId: generateDto.projectId,
                type: generateDto.type,
                status: ReportStatus.PROCESSING,
                config: {
                    startDate: generateDto.startDate,
                    endDate: generateDto.endDate,
                    filters: generateDto.filters,
                },
            },
        });

        // Generate report data based on type
        try {
            let reportData: any;

            switch (generateDto.type) {
                case ReportType.KEYWORD_RANKING:
                    reportData = await this.generateKeywordRankingReport(generateDto.projectId, generateDto);
                    break;

                case ReportType.TRAFFIC_ANALYSIS:
                    reportData = await this.generateTrafficAnalysisReport(generateDto.projectId, generateDto);
                    break;

                case ReportType.CONTENT_PERFORMANCE:
                    reportData = await this.generateContentPerformanceReport(generateDto.projectId, generateDto);
                    break;

                default:
                    throw new BadRequestException('Unsupported report type');
            }

            // Update report with generated data
            await this.db.report.update({
                where: { id: report.id },
                data: {
                    status: ReportStatus.COMPLETED,
                    data: reportData,
                    generatedAt: new Date(),
                },
            });

            return { ...report, data: reportData, status: ReportStatus.COMPLETED };
        } catch (error) {
            // Update report status to failed
            await this.db.report.update({
                where: { id: report.id },
                data: {
                    status: ReportStatus.FAILED,
                    data: { error: error.message },
                },
            });

            throw new BadRequestException('Failed to generate report: ' + error.message);
        }
    }

    private async generateKeywordRankingReport(projectId: string, dto: GenerateReportDto): Promise<KeywordRankingReportData> {
        const startDate = dto.startDate ? new Date(dto.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = dto.endDate ? new Date(dto.endDate) : new Date();

        // Get keywords for the project
        const keywords = await this.db.keyword.findMany({
            where: { projectId },
            include: {
                rankings: {
                    where: {
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    orderBy: { date: 'desc' },
                },
            },
        });

        const keywordData: KeywordRankingData[] = keywords.map(keyword => {
            const latestRanking = keyword.rankings[0];
            const previousRanking = keyword.rankings[1];

            return {
                keyword: keyword.keyword,
                currentPosition: latestRanking?.position || 0,
                previousPosition: previousRanking?.position || 0,
                change: (previousRanking?.position || 0) - (latestRanking?.position || 0),
                searchVolume: keyword.searchVolume || 0,
                difficulty: keyword.difficulty || 0,
                url: latestRanking?.url || '',
            };
        });

        const totalKeywords = keywords.length;
        const averagePosition = keywordData.reduce((sum, k) => sum + k.currentPosition, 0) / totalKeywords || 0;
        const topKeywords = keywordData.filter(k => k.currentPosition > 0).slice(0, 20);

        return {
            totalKeywords,
            averagePosition: Math.round(averagePosition * 100) / 100,
            topKeywords,
            rankingTrends: [],
            competitorComparison: [],
        };
    }

    private async generateTrafficAnalysisReport(projectId: string, dto: GenerateReportDto): Promise<TrafficAnalysisReportData> {
        const startDate = dto.startDate ? new Date(dto.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = dto.endDate ? new Date(dto.endDate) : new Date();

        // Get traffic data
        const trafficData = await this.db.trafficData.findMany({
            where: {
                projectId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'asc' },
        });

        const totalSessions = trafficData.reduce((sum, t) => sum + (t.sessions || 0), 0);
        const totalUsers = trafficData.reduce((sum, t) => sum + (t.users || 0), 0);
        const totalPageviews = trafficData.reduce((sum, t) => sum + (t.pageviews || 0), 0);
        const averageBounceRate = trafficData.reduce((sum, t) => sum + (t.bounceRate || 0), 0) / trafficData.length || 0;
        const averageSessionDuration = trafficData.reduce((sum, t) => sum + (t.avgSessionDuration || 0), 0) / trafficData.length || 0;

        // Group by date for trends
        const dailyTraffic: TrafficData[] = trafficData.reduce((acc, data) => {
            const dateStr = data.date.toISOString().split('T')[0];
            const existing = acc.find(d => d.date === dateStr);

            if (existing) {
                existing.sessions += data.sessions || 0;
                existing.users += data.users || 0;
                existing.pageviews += data.pageviews || 0;
                existing.bounceRate = (existing.bounceRate + (data.bounceRate || 0)) / 2;
            } else {
                acc.push({
                    date: dateStr,
                    sessions: data.sessions || 0,
                    users: data.users || 0,
                    pageviews: data.pageviews || 0,
                    bounceRate: data.bounceRate || 0,
                });
            }

            return acc;
        }, [] as TrafficData[]);

        return {
            totalSessions,
            totalUsers,
            totalPageviews,
            averageBounceRate: Math.round(averageBounceRate * 100) / 100,
            averageSessionDuration: Math.round(averageSessionDuration * 100) / 100,
            organicTraffic: dailyTraffic,
            topPages: [],
            trafficSources: [],
        };
    }

    private async generateContentPerformanceReport(projectId: string, dto: GenerateReportDto): Promise<ContentPerformanceReportData> {
        const startDate = dto.startDate ? new Date(dto.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = dto.endDate ? new Date(dto.endDate) : new Date();

        // Get content performance data
        const contentData = await this.db.contentPerformance.findMany({
            where: {
                projectId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { clicks: 'desc' },
        });

        const totalPages = contentData.length;
        const totalClicks = contentData.reduce((sum, c) => sum + (c.clicks || 0), 0);
        const totalImpressions = contentData.reduce((sum, c) => sum + (c.impressions || 0), 0);
        const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const averagePosition = contentData.reduce((sum, c) => sum + (c.position || 0), 0) / totalPages || 0;

        const topPerformingPages: ContentPageData[] = contentData.slice(0, 20).map(content => ({
            page: content.page,
            title: content.title || content.page,
            clicks: content.clicks || 0,
            impressions: content.impressions || 0,
            ctr: content.impressions > 0 ? ((content.clicks || 0) / content.impressions) * 100 : 0,
            position: content.position || 0,
            wordCount: content.wordCount || 0,
            lastUpdated: content.updatedAt,
        }));

        return {
            totalPages,
            totalClicks,
            totalImpressions,
            averageCTR: Math.round(averageCTR * 100) / 100,
            averagePosition: Math.round(averagePosition * 100) / 100,
            topPerformingPages,
            contentGaps: [],
        };
    }
}
