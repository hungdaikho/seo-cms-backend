import { Module } from '@nestjs/common';
import { TrafficAnalyticsController } from './traffic-analytics.controller';
import { TrafficAnalyticsService } from './traffic-analytics.service';
import { GoogleAnalyticsService } from './google-analytics.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [TrafficAnalyticsController],
    providers: [
        TrafficAnalyticsService,
        GoogleAnalyticsService
    ],
    exports: [
        TrafficAnalyticsService,
        GoogleAnalyticsService
    ]
})
export class TrafficAnalyticsModule { }
