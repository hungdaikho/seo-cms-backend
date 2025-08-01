import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { PublicAiController } from './public-ai.controller';
import { AiService } from './ai.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AiController, PublicAiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule { }
