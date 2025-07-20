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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
