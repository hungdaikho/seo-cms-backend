import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController, KeywordController } from './keywords.controller';

@Module({
    controllers: [KeywordsController, KeywordController],
    providers: [KeywordsService],
    exports: [KeywordsService],
})
export class KeywordsModule { }
