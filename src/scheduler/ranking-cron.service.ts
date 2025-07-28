import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import axios from 'axios';

@Injectable()
export class RankingCronService {
    private readonly logger = new Logger(RankingCronService.name);

    constructor(private readonly databaseService: DatabaseService) { }

    // Chạy mỗi ngày lúc 2h sáng
    @Cron(CronExpression.EVERY_DAY_AT_2AM)
    async handleRankingUpdate() {
        this.logger.log('Bắt đầu cập nhật ranking cho tất cả keywords...');
        const keywords = await this.databaseService.keyword.findMany({
            where: { isTracking: true },
            select: { id: true, keyword: true, projectId: true },
        });

        for (const k of keywords) {
            try {
                // Gọi SerpApi để lấy ranking thực
                const response = await axios.get('https://serpapi.com/search', {
                    params: {
                        q: k.keyword,
                        engine: 'google',
                        api_key: 'b47a0ae107b86a27d4995f65ca1ad7536709bc1a032024fddfd84f69fb043aa0', // Thay bằng key thật của bạn
                        // domain: 'google.com', // tuỳ chọn
                        // location: 'Vietnam', // tuỳ chọn
                    },
                });
                const ranking = response.data?.organic_results?.[0]?.position ?? null;
                if (ranking !== null) {
                    // Cập nhật bảng ranking (lưu lịch sử)
                    await this.databaseService.ranking.create({
                        data: {
                            keywordId: k.id,
                            position: ranking,
                            date: new Date(),
                        },
                    });
                    // Cập nhật ranking hiện tại cho keyword
                    await this.databaseService.keyword.update({
                        where: { id: k.id },
                        data: { currentRanking: ranking },
                    });
                }
            } catch (err) {
                this.logger.warn(`Lỗi cập nhật ranking cho keyword ${k.keyword}: ${err.message}`);
            }
        }
        this.logger.log('Đã cập nhật ranking xong!');
    }
}
