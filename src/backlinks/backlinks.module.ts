import { Module } from '@nestjs/common';
import { BacklinksService } from './backlinks.service';
import { BacklinksController } from './backlinks.controller';

@Module({
    controllers: [BacklinksController],
    providers: [BacklinksService],
    exports: [BacklinksService],
})
export class BacklinksModule { }
