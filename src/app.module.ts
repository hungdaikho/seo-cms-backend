import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ProjectsModule } from './projects/projects.module';
import { KeywordsModule } from './keywords/keywords.module';
import { AuditsModule } from './audits/audits.module';
import { CompetitorsModule } from './competitors/competitors.module';
import { RankingsModule } from './rankings/rankings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BacklinksModule } from './backlinks/backlinks.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    ProjectsModule,
    KeywordsModule,
    AuditsModule,
    CompetitorsModule,
    RankingsModule,
    NotificationsModule,
    BacklinksModule,
    IntegrationsModule,
    ReportsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
