import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';
import { AuditsController, AuditController } from './audits.controller';

@Module({
    controllers: [AuditsController, AuditController],
    providers: [AuditsService],
    exports: [AuditsService],
})
export class AuditsModule { }
