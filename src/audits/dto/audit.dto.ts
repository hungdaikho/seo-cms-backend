import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    settings?: object;
}
