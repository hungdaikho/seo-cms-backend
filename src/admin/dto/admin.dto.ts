import { IsString, IsEmail, IsOptional, IsBoolean, IsUUID, IsEnum, IsNumber, IsDecimal, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, SubscriptionStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class GetUsersQueryDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Search by email or name' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by user role', enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ description: 'Filter by active status' })
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ description: 'User name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'User email' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'User role', enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ description: 'User active status' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: 'Timezone' })
    @IsOptional()
    @IsString()
    timezone?: string;
}

export class CreateSubscriptionPlanDto {
    @ApiProperty({ description: 'Plan name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Plan slug (unique identifier)' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ description: 'Plan description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Monthly price' })
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @ApiPropertyOptional({ description: 'Yearly price' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yearlyPrice?: number;

    @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
    @IsOptional()
    @IsString()
    currency?: string = 'USD';

    @ApiPropertyOptional({ description: 'Plan features (JSON)' })
    @IsOptional()
    features?: any;

    @ApiPropertyOptional({ description: 'Plan limits (JSON)' })
    @IsOptional()
    limits?: any;

    @ApiPropertyOptional({ description: 'Sort order', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number = 0;
}

export class UpdateSubscriptionPlanDto {
    @ApiPropertyOptional({ description: 'Plan name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Plan description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Monthly price' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ description: 'Yearly price' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    yearlyPrice?: number;

    @ApiPropertyOptional({ description: 'Currency code' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ description: 'Plan features (JSON)' })
    @IsOptional()
    features?: any;

    @ApiPropertyOptional({ description: 'Plan limits (JSON)' })
    @IsOptional()
    limits?: any;

    @ApiPropertyOptional({ description: 'Is plan active' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    sortOrder?: number;
}

export class UpdateUserSubscriptionDto {
    @ApiProperty({ description: 'New subscription plan ID' })
    @IsUUID()
    planId: string;

    @ApiPropertyOptional({ description: 'Subscription status', enum: SubscriptionStatus })
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @ApiPropertyOptional({ description: 'Expiration date' })
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    expiresAt?: Date;
}

export class AdminStatsDto {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: number;
}

export class UpdateAdminPasswordDto {
    @ApiProperty({ description: 'Current password' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ description: 'New password' })
    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class UpdateAdminEmailDto {
    @ApiProperty({ description: 'New email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Current password for verification' })
    @IsString()
    password: string;
}
