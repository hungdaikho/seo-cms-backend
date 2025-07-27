import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LinkType } from '@prisma/client';

export class CreateBacklinkDto {
    @ApiProperty({ example: 'authority-site.com' })
    @IsString()
    sourceDomain: string;

    @ApiProperty({ example: 'https://example.com/target-page' })
    @IsString()
    targetUrl: string;

    @ApiProperty({ example: 'best seo tools', required: false })
    @IsOptional()
    @IsString()
    anchorText?: string;

    @ApiProperty({ enum: LinkType, required: false, example: 'follow' })
    @IsOptional()
    @IsEnum(LinkType)
    linkType?: LinkType;

    @ApiProperty({ example: 85, required: false, description: 'Domain authority score 0-100' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    authorityScore?: number;
}

export class UpdateBacklinkDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    sourceDomain?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    targetUrl?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    anchorText?: string;

    @ApiProperty({ enum: LinkType, required: false })
    @IsOptional()
    @IsEnum(LinkType)
    linkType?: LinkType;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    authorityScore?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class BacklinkAnalyticsQuery {
    @ApiProperty({ required: false, description: 'Start date for analytics' })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiProperty({ required: false, description: 'End date for analytics' })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiProperty({ required: false, default: 30, description: 'Number of days to analyze' })
    @IsOptional()
    @IsNumber()
    days?: number;
}
