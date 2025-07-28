import { IsOptional, IsObject, IsBoolean, IsString, IsArray, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AuditType {
    TECHNICAL = 'technical',
    CONTENT = 'content',
    PERFORMANCE = 'performance',
    ACCESSIBILITY = 'accessibility',
    FULL = 'full'
}

export class ComprehensiveAuditSettingsDto {
    @ApiProperty({ required: false, description: 'Crawl depth for discovering pages' })
    @IsOptional()
    @IsNumber()
    crawlDepth?: number;

    @ApiProperty({ required: false, description: 'Include image analysis' })
    @IsOptional()
    @IsBoolean()
    includeImages?: boolean;

    @ApiProperty({ required: false, description: 'Check mobile friendliness' })
    @IsOptional()
    @IsBoolean()
    checkMobileFriendly?: boolean;

    @ApiProperty({ required: false, description: 'Analyze page speed performance' })
    @IsOptional()
    @IsBoolean()
    analyzePageSpeed?: boolean;
}

export class ComprehensiveAuditOptionsDto {
    @ApiProperty({ required: false, enum: ['full', 'technical', 'content', 'performance'], description: 'Type of audit to perform' })
    @IsOptional()
    @IsEnum(['full', 'technical', 'content', 'performance'])
    auditType?: "full" | "technical" | "content" | "performance";

    @ApiProperty({ required: false, type: ComprehensiveAuditSettingsDto })
    @IsOptional()
    @IsObject()
    settings?: ComprehensiveAuditSettingsDto;
}

export class StartComprehensiveAuditDto {
    @ApiProperty({ description: 'URL to audit' })
    @IsString()
    url: string;

    @ApiProperty({ required: false, type: ComprehensiveAuditOptionsDto })
    @IsOptional()
    @IsObject()
    options?: ComprehensiveAuditOptionsDto;
}

export class CreateAuditDto {
    @ApiProperty({ required: false, description: 'Include mobile audit' })
    @IsOptional()
    @IsBoolean()
    include_mobile?: boolean;

    @ApiProperty({ required: false, description: 'Check accessibility issues' })
    @IsOptional()
    @IsBoolean()
    check_accessibility?: boolean;

    @ApiProperty({ required: false, description: 'Analyze performance metrics' })
    @IsOptional()
    @IsBoolean()
    analyze_performance?: boolean;

    @ApiProperty({ required: false, description: 'Check SEO best practices' })
    @IsOptional()
    @IsBoolean()
    check_seo?: boolean;

    @ApiProperty({ required: false, description: 'Analyze content quality' })
    @IsOptional()
    @IsBoolean()
    check_content?: boolean;

    @ApiProperty({ required: false, description: 'Check technical SEO issues' })
    @IsOptional()
    @IsBoolean()
    check_technical?: boolean;

    @ApiProperty({ required: false, description: 'Validate HTML markup' })
    @IsOptional()
    @IsBoolean()
    validate_html?: boolean;

    @ApiProperty({ required: false, description: 'Check broken links' })
    @IsOptional()
    @IsBoolean()
    check_links?: boolean;

    @ApiProperty({ required: false, description: 'Analyze images and media' })
    @IsOptional()
    @IsBoolean()
    check_images?: boolean;

    @ApiProperty({ required: false, description: 'Check meta tags' })
    @IsOptional()
    @IsBoolean()
    check_meta?: boolean;

    @ApiProperty({ required: false, enum: AuditType, description: 'Type of audit to perform' })
    @IsOptional()
    @IsEnum(AuditType)
    audit_type?: AuditType;

    @ApiProperty({ required: false, description: 'Specific pages to audit' })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    pages?: string[];

    @ApiProperty({ required: false, description: 'Maximum depth for crawling' })
    @IsOptional()
    max_depth?: number;

    @ApiProperty({ required: false, description: 'Custom audit settings' })
    @IsOptional()
    @IsObject()
    settings?: object;
}
