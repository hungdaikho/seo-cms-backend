import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
    @ApiProperty({ enum: NotificationType, example: 'ranking_change' })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty({ example: 'Keyword ranking improved' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Your keyword "seo tools" moved from position 15 to 8', required: false })
    @IsOptional()
    @IsString()
    message?: string;
}

export class UpdateNotificationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isRead?: boolean;
}

export class NotificationSettingsDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    emailNotifications: boolean;

    @ApiProperty({ example: true })
    @IsBoolean()
    pushNotifications: boolean;

    @ApiProperty({ example: ['ranking_change', 'audit_completed'] })
    @IsEnum(NotificationType, { each: true })
    enabledTypes: NotificationType[];
}
