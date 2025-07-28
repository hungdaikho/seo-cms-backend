import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController, AuditController } from './audits.controller';
import { DatabaseModule } from '../database/database.module';
import { AuditProcessingService } from './audit-processing.service';
import { BrowserPoolService } from './browser-pool.service';
import { SEOAnalysisService } from './seo-analysis.service';
import { LighthouseService } from './lighthouse.service';

@Module({
    imports: [DatabaseModule],
    controllers: [AuditsController, AuditController],
    providers: [
        AuditsService,
        AuditProcessingService,
        BrowserPoolService,
        SEOAnalysisService,
        LighthouseService
    ],
    exports: [AuditsService],
})
export class AuditsModule { }
