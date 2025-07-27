import { Module } from '@nestjs/common';
import { TopicResearchController } from './topic-research.controller';
import { TopicResearchService } from './topic-research.service';

@Module({
    controllers: [TopicResearchController],
    providers: [TopicResearchService],
    exports: [TopicResearchService],
})
export class TopicResearchModule { }
