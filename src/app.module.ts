import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';
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
// New SEO modules
import { OrganicResearchModule } from './organic-research/organic-research.module';
import { DomainOverviewModule } from './domain-overview/domain-overview.module';
import { TopicResearchModule } from './topic-research/topic-research.module';
import { ContentModule } from './content/content.module';
import { TrafficAnalyticsModule } from './traffic-analytics/traffic-analytics.module';
import { AdminModule } from './admin/admin.module';
import { KeywordGapModule } from './keyword-gap/keyword-gap.module';
import { BacklinkGapModule } from './backlink-gap/backlink-gap.module';
import { EmailModule } from './email/email.module';
import { CmsModule } from './cms/cms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EmailModule,
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
    // New SEO modules
    OrganicResearchModule,
    DomainOverviewModule,
    TopicResearchModule,
    ContentModule,
    TrafficAnalyticsModule,
    AdminModule,
    KeywordGapModule,
    BacklinkGapModule,
    CmsModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
