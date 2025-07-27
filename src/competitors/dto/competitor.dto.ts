import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompetitorDto {
    @ApiProperty({ example: 'competitor.com' })
    @IsString()
    domain: string;

    @ApiProperty({ example: 'Main Competitor', required: false })
    @IsOptional()
    @IsString()
    name?: string;
}

export class UpdateCompetitorDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    domain?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
