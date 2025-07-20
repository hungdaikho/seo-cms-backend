import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKeywordDto {
    @ApiProperty({ example: 'seo tools' })
    @IsString()
    keyword: string;

    @ApiProperty({ example: 'https://example.com/seo-tools' })
    @IsOptional()
    @IsString()
    targetUrl?: string;

    @ApiProperty({ example: 1000 })
    @IsOptional()
    @IsNumber()
    searchVolume?: number;

    @ApiProperty({ example: 65.5 })
    @IsOptional()
    @IsNumber()
    difficulty?: number;

    @ApiProperty({ example: 2.5 })
    @IsOptional()
    @IsNumber()
    cpc?: number;
}

export class BulkCreateKeywordsDto {
    @ApiProperty({ type: [CreateKeywordDto] })
    @IsArray()
    keywords: CreateKeywordDto[];
}

export class UpdateKeywordDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    targetUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    searchVolume?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    difficulty?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    cpc?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isTracking?: boolean;
}
