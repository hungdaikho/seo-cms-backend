import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty()
    data: T;

    @ApiProperty({ required: false })
    message?: string;
}

export class ErrorResponseDto {
    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: 'Error message' })
    message: string;

    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ required: false })
    error?: string;

    @ApiProperty({ required: false })
    details?: any;
}

export class UserResponseDto {
    @ApiProperty({ example: 'uuid-string' })
    id: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'user' })
    role: string;

    @ApiProperty({ required: false })
    phone?: string;

    @ApiProperty({ required: false })
    timezone?: string;

    @ApiProperty({ required: false })
    avatarUrl?: string;

    @ApiProperty({ example: true })
    emailVerified: boolean;

    @ApiProperty()
    createdAt: Date;
}

export class AuthResponseDto {
    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;
}

export class ProjectResponseDto {
    @ApiProperty({ example: 'uuid-string' })
    id: string;

    @ApiProperty({ example: 'My SEO Project' })
    name: string;

    @ApiProperty({ example: 'example.com' })
    domain: string;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class KeywordResponseDto {
    @ApiProperty({ example: 'uuid-string' })
    id: string;

    @ApiProperty({ example: 'seo tools' })
    keyword: string;

    @ApiProperty({ example: 'https://example.com/seo-tools' })
    targetUrl: string;

    @ApiProperty({ example: 1000 })
    searchVolume: number;

    @ApiProperty({ example: 65.5 })
    difficulty: number;

    @ApiProperty({ example: 2.5 })
    cpc: number;

    @ApiProperty({ example: 5 })
    currentRanking: number;

    @ApiProperty({ example: true })
    isTracking: boolean;

    @ApiProperty()
    createdAt: Date;
}

export class SubscriptionPlanResponseDto {
    @ApiProperty({ example: 'uuid-string' })
    id: string;

    @ApiProperty({ example: 'Professional' })
    name: string;

    @ApiProperty({ example: 'professional' })
    slug: string;

    @ApiProperty({ example: 'Advanced SEO tools for growing businesses' })
    description: string;

    @ApiProperty({ example: 79.00 })
    price: number;

    @ApiProperty({ example: 63.20 })
    yearlyPrice: number;

    @ApiProperty({ example: 'USD' })
    currency: string;

    @ApiProperty({
        example: [
            '15 projects',
            '1,000 keywords tracking',
            'Daily reports'
        ]
    })
    features: string[];

    @ApiProperty({
        example: {
            projects: 15,
            keywords_tracking: 1000,
            audits_monthly: 10
        }
    })
    limits: object;
}
