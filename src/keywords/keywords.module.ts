import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController, KeywordController } from './keywords.controller';
import { KeywordDifficultyService } from '../keyword-difficulty/keyword-difficulty.service';

@Module({
    controllers: [KeywordsController, KeywordController],
    providers: [KeywordsService, KeywordDifficultyService],
    exports: [KeywordsService],
})
export class KeywordsModule { }
