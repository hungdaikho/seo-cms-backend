import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeywordGapController } from './keyword-gap.controller';
import { KeywordGapService } from './keyword-gap.service';

@Module({
  imports: [ConfigModule],
  controllers: [KeywordGapController],
  providers: [KeywordGapService],
  exports: [KeywordGapService],
})
export class KeywordGapModule {}
