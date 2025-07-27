import { Module } from '@nestjs/common';
import { DomainOverviewController } from './domain-overview.controller';
import { DomainOverviewService } from './domain-overview.service';

@Module({
    controllers: [DomainOverviewController],
    providers: [DomainOverviewService],
    exports: [DomainOverviewService],
})
export class DomainOverviewModule { }
