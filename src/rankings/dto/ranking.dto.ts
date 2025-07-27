import { IsNumber, IsOptional, IsString, IsObject, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRankingDto {
    @ApiProperty({ example: 5, description: 'Keyword position in search results' })
    @IsNumber()
    @Min(0)
    @Max(200)
    position: number;

    @ApiProperty({ example: 'https://example.com/page', required: false })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiProperty({ required: false, description: 'Additional metadata about ranking' })
    @IsOptional()
    @IsObject()
    metadata?: object;
}

export class RankingHistoryQuery {
    @ApiProperty({ required: false, description: 'Start date for ranking history' })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiProperty({ required: false, description: 'End date for ranking history' })
    @IsOptional()
    @IsString()
    endDate?: string;

    @ApiProperty({ required: false, default: 30, description: 'Number of days to fetch' })
    @IsOptional()
    @IsNumber()
    days?: number;
}
