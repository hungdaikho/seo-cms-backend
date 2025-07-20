import { IsString, IsOptional, IsUrl, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ example: 'My SEO Project' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'example.com' })
    @IsString()
    domain: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    settings?: object;
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
    @IsObject()
    settings?: object;
}
