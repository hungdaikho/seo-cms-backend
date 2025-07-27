import { Module } from '@nestjs/common';
import { OrganicResearchController } from './organic-research.controller';
import { OrganicResearchService } from './organic-research.service';

@Module({
    controllers: [OrganicResearchController],
    providers: [OrganicResearchService],
    exports: [OrganicResearchService],
})
export class OrganicResearchModule { }
