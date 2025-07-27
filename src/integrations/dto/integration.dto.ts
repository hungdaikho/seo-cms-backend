import { IsString, IsOptional, IsBoolean, IsUUID, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum IntegrationType {
    GOOGLE_SEARCH_CONSOLE = 'gsc',
    GOOGLE_ANALYTICS = 'ga',
    AHREFS = 'ahrefs',
    MOZ = 'moz',
    SEMRUSH = 'semrush',
    OPENAI = 'openai',
}

export class CreateIntegrationDto {
    @ApiProperty({ description: 'Type of integration', enum: IntegrationType })
    @IsEnum(IntegrationType)
    type: IntegrationType;

    @ApiPropertyOptional({ description: 'Project ID to link integration (optional for user-level integrations)' })
    @IsOptional()
    @IsUUID()
    projectId?: string;

    @ApiProperty({ description: 'Integration configuration settings' })
    @IsObject()
    config: Record<string, any>;

    @ApiPropertyOptional({ description: 'Encrypted credentials for the integration' })
    @IsOptional()
    @IsObject()
    credentials?: Record<string, any>;
}

export class UpdateIntegrationDto {
    @ApiPropertyOptional({ description: 'Integration configuration settings' })
    @IsOptional()
    @IsObject()
    config?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Encrypted credentials for the integration' })
    @IsOptional()
    @IsObject()
    credentials?: Record<string, any>;

    @ApiPropertyOptional({ description: 'Whether the integration is active' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class GoogleSearchConsoleConnectDto {
    @ApiProperty({ description: 'Google authorization code' })
    @IsString()
    authCode: string;

    @ApiProperty({ description: 'Project ID to connect GSC to' })
    @IsUUID()
    projectId: string;

    @ApiProperty({ description: 'GSC property URL' })
    @IsString()
    propertyUrl: string;
}

export class GoogleAnalyticsConnectDto {
    @ApiProperty({ description: 'Google authorization code' })
    @IsString()
    authCode: string;

    @ApiProperty({ description: 'Project ID to connect GA to' })
    @IsUUID()
    projectId: string;

    @ApiProperty({ description: 'GA4 property ID' })
    @IsString()
    propertyId: string;
}

export class SyncIntegrationDto {
    @ApiPropertyOptional({ description: 'Start date for data sync (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'End date for data sync (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    endDate?: string;
}

export class IntegrationResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    projectId?: string;

    @ApiProperty({ enum: IntegrationType })
    type: IntegrationType;

    @ApiProperty()
    config: Record<string, any>;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    lastSync?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class GSCDataResponse {
    @ApiProperty()
    queries: GSCQuery[];

    @ApiProperty()
    pages: GSCPage[];

    @ApiProperty()
    totalImpressions: number;

    @ApiProperty()
    totalClicks: number;

    @ApiProperty()
    averageCTR: number;

    @ApiProperty()
    averagePosition: number;
}

export class GSCQuery {
    @ApiProperty()
    query: string;

    @ApiProperty()
    clicks: number;

    @ApiProperty()
    impressions: number;

    @ApiProperty()
    ctr: number;

    @ApiProperty()
    position: number;
}

export class GSCPage {
    @ApiProperty()
    page: string;

    @ApiProperty()
    clicks: number;

    @ApiProperty()
    impressions: number;

    @ApiProperty()
    ctr: number;

    @ApiProperty()
    position: number;
}
