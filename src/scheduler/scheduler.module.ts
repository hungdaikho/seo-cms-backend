import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RankingCronService } from './ranking-cron.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [ScheduleModule.forRoot(), DatabaseModule],
    providers: [RankingCronService],
})
export class SchedulerModule { }
