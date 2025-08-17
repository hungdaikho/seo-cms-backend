import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BacklinkGapController } from './backlink-gap.controller';
import { BacklinkGapService } from './backlink-gap.service';

@Module({
  imports: [ConfigModule],
  controllers: [BacklinkGapController],
  providers: [BacklinkGapService],
  exports: [BacklinkGapService],
})
export class BacklinkGapModule {}
