import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TopicResearchController } from './topic-research.controller';
import { TopicResearchService } from './topic-research.service';
import { ExternalApisService } from './external-apis.service';

@Module({
    imports: [ConfigModule],
    controllers: [TopicResearchController],
    providers: [TopicResearchService, ExternalApisService],
    exports: [TopicResearchService],
})
export class TopicResearchModule { }
