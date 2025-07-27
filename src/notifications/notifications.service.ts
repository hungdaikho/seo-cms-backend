import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async createNotification(userId: string, createNotificationDto: CreateNotificationDto) {
        return this.databaseService.notification.create({
            data: {
                userId,
                type: createNotificationDto.type,
                title: createNotificationDto.title,
                message: createNotificationDto.message,
            },
        });
    }

    async getUserNotifications(userId: string, limit: number = 20, unreadOnly: boolean = false) {
        const where: any = { userId };

        if (unreadOnly) {
            where.isRead = false;
        }

        const notifications = await this.databaseService.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        const unreadCount = await this.databaseService.notification.count({
            where: { userId, isRead: false },
        });

        return {
            notifications,
            unreadCount,
        };
    }

    async getNotificationById(userId: string, notificationId: string) {
        const notification = await this.databaseService.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return notification;
    }

    async markNotificationAsRead(userId: string, notificationId: string) {
        const notification = await this.databaseService.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return this.databaseService.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }

    async markAllNotificationsAsRead(userId: string) {
        const result = await this.databaseService.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });

        return {
            message: `${result.count} notifications marked as read`,
            count: result.count,
        };
    }

    async deleteNotification(userId: string, notificationId: string) {
        const notification = await this.databaseService.notification.findFirst({
            where: { id: notificationId, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        await this.databaseService.notification.delete({
            where: { id: notificationId },
        });

        return { message: 'Notification deleted successfully' };
    }

    async deleteAllReadNotifications(userId: string) {
        const result = await this.databaseService.notification.deleteMany({
            where: { userId, isRead: true },
        });

        return {
            message: `${result.count} read notifications deleted`,
            count: result.count,
        };
    }

    // Helper method for system notifications
    async createSystemNotification(userId: string, type: NotificationType, title: string, message?: string) {
        return this.createNotification(userId, { type, title, message });
    }

    // Helper method for bulk notifications
    async createBulkNotifications(userIds: string[], type: NotificationType, title: string, message?: string) {
        const notifications = userIds.map(userId => ({
            userId,
            type,
            title,
            message,
        }));

        return this.databaseService.notification.createMany({
            data: notifications,
        });
    }
}
