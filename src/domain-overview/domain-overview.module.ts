import { Module } from '@nestjs/common';
import { DomainOverviewController } from './domain-overview.controller';
import { DomainOverviewService } from './domain-overview.service';
import { SeoDataGeneratorService } from './seo-data-generator.service';
import { LibraryBasedSeoService } from './library-based-seo.service';

@Module({
  controllers: [DomainOverviewController],
  providers: [
    DomainOverviewService,
    SeoDataGeneratorService,
    LibraryBasedSeoService,
  ],
  exports: [DomainOverviewService],
})
export class DomainOverviewModule {}
