import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeactivateAccountDto {
    @ApiProperty({ example: 'I no longer need this service' })
    @IsString()
    reason: string;

    @ApiProperty({ example: 'CurrentPassword123!' })
    @IsString()
    password: string;
}

export class DeleteAccountDto {
    @ApiProperty({ example: 'CurrentPassword123!' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'DELETE' })
    @IsString()
    confirmation: string;

    @ApiProperty({ example: 'Too expensive', required: false })
    @IsOptional()
    @IsString()
    reason?: string;
}

export class ExportDataDto {
    @ApiProperty({ example: ['profile', 'projects', 'keywords'], required: false })
    @IsOptional()
    dataTypes?: string[];

    @ApiProperty({ example: 'json', enum: ['json', 'csv'], required: false })
    @IsOptional()
    @IsString()
    format?: 'json' | 'csv';
}
