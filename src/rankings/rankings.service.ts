import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateRankingDto, RankingHistoryQuery } from './dto/ranking.dto';

@Injectable()
export class RankingsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createRanking(userId: string, keywordId: string, createRankingDto: CreateRankingDto) {
        // Verify keyword ownership
        const keyword = await this.databaseService.keyword.findFirst({
            where: {
                id: keywordId,
                project: { ownerId: userId }
            },
        });

        if (!keyword) {
            throw new NotFoundException('Keyword not found');
        }

        // Create ranking record
        const ranking = await this.databaseService.ranking.create({
            data: {
                keywordId,
                position: createRankingDto.position,
                url: createRankingDto.url,
                metadata: createRankingDto.metadata,
            },
        });

        // Update current ranking in keyword
        await this.databaseService.keyword.update({
            where: { id: keywordId },
            data: { currentRanking: createRankingDto.position },
        });

        return ranking;
    }

    async getRankingHistory(userId: string, keywordId: string, query: RankingHistoryQuery) {
        // Verify keyword ownership
        const keyword = await this.databaseService.keyword.findFirst({
            where: {
                id: keywordId,
                project: { ownerId: userId }
            },
            include: { project: true },
        });

        if (!keyword) {
            throw new NotFoundException('Keyword not found');
        }

        // Calculate date range
        const endDate = query.endDate ? new Date(query.endDate) : new Date();
        const startDate = query.startDate
            ? new Date(query.startDate)
            : new Date(Date.now() - (query.days || 30) * 24 * 60 * 60 * 1000);

        const rankings = await this.databaseService.ranking.findMany({
            where: {
                keywordId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'asc' },
        });

        // Calculate trend
        const trend = this.calculateTrend(rankings);

        return {
            keyword: {
                id: keyword.id,
                keyword: keyword.keyword,
                currentRanking: keyword.currentRanking,
                project: keyword.project.name,
            },
            rankings,
            trend,
            summary: {
                totalRecords: rankings.length,
                bestPosition: rankings.length > 0 ? Math.min(...rankings.map(r => r.position)) : null,
                worstPosition: rankings.length > 0 ? Math.max(...rankings.map(r => r.position)) : null,
                averagePosition: rankings.length > 0
                    ? Math.round(rankings.reduce((sum, r) => sum + r.position, 0) / rankings.length * 10) / 10
                    : null,
            },
        };
    }

    async getProjectRankingsOverview(userId: string, projectId: string) {
        // Verify project ownership
        const project = await this.databaseService.project.findFirst({
            where: { id: projectId, ownerId: userId },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        // Get keywords with recent rankings
        const keywords = await this.databaseService.keyword.findMany({
            where: { projectId },
            include: {
                rankings: {
                    orderBy: { date: 'desc' },
                    take: 30, // Last 30 rankings per keyword
                },
            },
        });

        const overview = keywords.map(keyword => {
            const recentRankings = keyword.rankings;
            const trend = this.calculateTrend(recentRankings);

            return {
                id: keyword.id,
                keyword: keyword.keyword,
                currentRanking: keyword.currentRanking,
                targetUrl: keyword.targetUrl,
                searchVolume: keyword.searchVolume,
                difficulty: keyword.difficulty,
                trend,
                rankingHistory: recentRankings.slice(0, 7), // Last 7 days
            };
        });

        // Calculate project summary
        const totalKeywords = keywords.length;
        const trackedKeywords = keywords.filter(k => k.isTracking).length;
        const rankedKeywords = keywords.filter(k => k.currentRanking > 0).length;
        const avgPosition = rankedKeywords > 0
            ? Math.round(keywords
                .filter(k => k.currentRanking > 0)
                .reduce((sum, k) => sum + k.currentRanking, 0) / rankedKeywords * 10) / 10
            : null;

        return {
            project: {
                id: project.id,
                name: project.name,
                domain: project.domain,
            },
            summary: {
                totalKeywords,
                trackedKeywords,
                rankedKeywords,
                avgPosition,
            },
            keywords: overview,
        };
    }

    private calculateTrend(rankings: any[]): 'up' | 'down' | 'stable' | 'no-data' {
        if (rankings.length < 2) return 'no-data';

        const recent = rankings.slice(-7); // Last 7 records
        const older = rankings.slice(-14, -7); // Previous 7 records

        if (recent.length === 0 || older.length === 0) return 'no-data';

        const recentAvg = recent.reduce((sum, r) => sum + r.position, 0) / recent.length;
        const olderAvg = older.reduce((sum, r) => sum + r.position, 0) / older.length;

        const difference = olderAvg - recentAvg; // Positive means improvement (lower position number)

        if (Math.abs(difference) < 1) return 'stable';
        return difference > 0 ? 'up' : 'down';
    }
}
