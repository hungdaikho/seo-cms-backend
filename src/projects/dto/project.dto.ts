import { IsString, IsOptional, IsUrl, IsObject, IsBoolean, IsArray, ValidateNested, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class ProjectSettingsDto {
    @ApiProperty({ example: 'US' })
    @IsString()
    country: string;

    @ApiProperty({ example: 'en' })
    @IsString()
    language: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    trackingEnabled: boolean;

    @ApiProperty({ example: ['seo tools', 'keyword research', 'rank tracking'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keyWordsArray?: string[];
}

export class CreateProjectDto {
    @ApiProperty({ example: 'My SEO Project' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'example.com' })
    @IsString()
    domain: string;

    @ApiProperty({ example: 'A comprehensive SEO project for tracking rankings', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: ProjectSettingsDto })
    @ValidateNested()
    @Type(() => ProjectSettingsDto)
    settings: ProjectSettingsDto;
}

export class UpdateProjectDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    domain?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: ProjectSettingsDto, required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProjectSettingsDto)
    settings?: ProjectSettingsDto;

    @ApiProperty({ example: true, required: false, description: 'Enable/disable project sharing' })
    @IsOptional()
    @IsBoolean()
    isShared?: boolean;
}

export class SearchSharedProjectsDto {
    @ApiProperty({ required: false, description: 'Search term for project name or domain' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, description: 'Share code to find specific project' })
    @IsOptional()
    @IsString()
    shareCode?: string;

    @ApiProperty({ required: false, default: 1, description: 'Page number' })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, default: 10, description: 'Items per page' })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

export class ApplyToProjectDto {
    @ApiProperty({ example: 'abc123def456', description: 'Share code of the project to apply' })
    @IsString()
    shareCode: string;
}

export enum ProjectMemberRole {
    MEMBER = 'member',
    MODERATOR = 'moderator'
}

export enum ProjectMemberStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}
