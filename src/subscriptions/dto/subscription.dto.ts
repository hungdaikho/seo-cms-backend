import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle } from '@prisma/client';

export class CreateSubscriptionDto {
    @ApiProperty({ example: 'pro-plan-id' })
    @IsString()
    planId: string;

    @ApiProperty({ enum: BillingCycle, example: 'monthly' })
    @IsEnum(BillingCycle)
    billingCycle: BillingCycle;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    paymentMethodId?: string;
}

export class UpdateSubscriptionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    planId?: string;

    @ApiProperty({ enum: BillingCycle, required: false })
    @IsOptional()
    @IsEnum(BillingCycle)
    billingCycle?: BillingCycle;
}
