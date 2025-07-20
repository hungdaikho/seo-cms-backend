import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getProfile(userId: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                timezone: true,
                avatarUrl: true,
                emailVerified: true,
                lastLoginAt: true,
                createdAt: true,
                subscriptions: {
                    where: { status: { in: ['active', 'trial'] } },
                    include: { plan: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            ...user,
            subscription: user.subscriptions[0] || null,
        };
    }

    async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.databaseService.user.update({
            where: { id: userId },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                timezone: true,
                avatarUrl: true,
                emailVerified: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async getUserUsage(userId: string) {
        const usage = await this.databaseService.subscriptionUsage.findMany({
            where: { userId },
            include: {
                subscription: {
                    include: { plan: true },
                },
            },
        });

        return usage.map(item => ({
            type: item.usageType,
            current: item.currentUsage,
            limit: item.limitValue,
            percentage: Math.round((item.currentUsage / item.limitValue) * 100),
            resetDate: item.resetDate,
        }));
    }

    async getNotifications(userId: string, limit = 10) {
        return this.databaseService.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async markNotificationRead(userId: string, notificationId: string) {
        return this.databaseService.notification.update({
            where: {
                id: notificationId,
                userId, // Ensure user can only update their own notifications
            },
            data: { isRead: true },
        });
    }
}
