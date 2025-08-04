import { Module } from '@nestjs/common';
import { KeywordDifficultyService } from './keyword-difficulty.service';

@Module({
    providers: [KeywordDifficultyService],
    exports: [KeywordDifficultyService],
})
export class KeywordDifficultyModule { }
