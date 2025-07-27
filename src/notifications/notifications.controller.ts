import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    ParseIntPipe,
    ParseBoolPipe,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Get user notifications' })
    @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
    @ApiQuery({ name: 'limit', required: false, type: 'number', example: 20 })
    @ApiQuery({ name: 'unreadOnly', required: false, type: 'boolean', example: false })
    async getUserNotifications(
        @Request() req,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
        @Query('unreadOnly', new ParseBoolPipe({ optional: true })) unreadOnly: boolean = false,
    ) {
        return this.notificationsService.getUserNotifications(req.user.id, limit, unreadOnly);
    }

    @Get(':notificationId')
    @ApiOperation({ summary: 'Get notification by ID' })
    @ApiResponse({ status: 200, description: 'Notification retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    async getNotificationById(
        @Request() req,
        @Param('notificationId', ParseUUIDPipe) notificationId: string,
    ) {
        return this.notificationsService.getNotificationById(req.user.id, notificationId);
    }

    @Put(':notificationId/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    async markNotificationAsRead(
        @Request() req,
        @Param('notificationId', ParseUUIDPipe) notificationId: string,
    ) {
        return this.notificationsService.markNotificationAsRead(req.user.id, notificationId);
    }

    @Put('mark-all-read')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200, description: 'All notifications marked as read' })
    async markAllNotificationsAsRead(@Request() req) {
        return this.notificationsService.markAllNotificationsAsRead(req.user.id);
    }

    @Delete(':notificationId')
    @ApiOperation({ summary: 'Delete notification' })
    @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    async deleteNotification(
        @Request() req,
        @Param('notificationId', ParseUUIDPipe) notificationId: string,
    ) {
        return this.notificationsService.deleteNotification(req.user.id, notificationId);
    }

    @Delete('read/all')
    @ApiOperation({ summary: 'Delete all read notifications' })
    @ApiResponse({ status: 200, description: 'Read notifications deleted successfully' })
    async deleteAllReadNotifications(@Request() req) {
        return this.notificationsService.deleteAllReadNotifications(req.user.id);
    }
}
