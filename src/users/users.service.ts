import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateUserDto } from './dto/user.dto';
import { DeactivateAccountDto, DeleteAccountDto, ExportDataDto } from './dto/security.dto';
import * as bcrypt from 'bcryptjs';

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
                role: true,
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

    async deactivateAccount(userId: string, deactivateAccountDto: DeactivateAccountDto) {
        const { password, reason } = deactivateAccountDto;

        // Verify password
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user has password (not OAuth user)
        if (!user.password) {
            throw new BadRequestException('Cannot deactivate OAuth accounts');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Deactivate account
        await this.databaseService.user.update({
            where: { id: userId },
            data: {
                isActive: false,
                // Optionally store deactivation reason in a separate table
            },
        });

        // Cancel active subscriptions
        await this.databaseService.userSubscription.updateMany({
            where: {
                userId,
                status: { in: ['active', 'trial'] }
            },
            data: { status: 'cancelled' },
        });

        return { message: 'Account deactivated successfully' };
    }

    async deleteAccount(userId: string, deleteAccountDto: DeleteAccountDto) {
        const { password, confirmation, reason } = deleteAccountDto;

        if (confirmation !== 'DELETE') {
            throw new BadRequestException('Confirmation must be "DELETE"');
        }

        // Verify password
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if user has password (not OAuth user)
        if (!user.password) {
            throw new BadRequestException('Cannot delete OAuth accounts');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // TODO: Implement soft delete or anonymization instead of hard delete
        // For now, just deactivate the account
        await this.databaseService.user.update({
            where: { id: userId },
            data: {
                isActive: false,
                email: `deleted_${Date.now()}@deleted.local`,
                name: 'Deleted User',
            },
        });

        return { message: 'Account deletion requested. Data will be permanently removed within 30 days.' };
    }

    async exportUserData(userId: string, exportDataDto: ExportDataDto) {
        const { dataTypes = ['profile', 'projects', 'keywords'], format = 'json' } = exportDataDto;

        const exportData: any = {};

        if (dataTypes.includes('profile')) {
            exportData.profile = await this.databaseService.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    timezone: true,
                    emailVerified: true,
                    createdAt: true,
                    lastLoginAt: true,
                },
            });
        }

        if (dataTypes.includes('projects')) {
            exportData.projects = await this.databaseService.project.findMany({
                where: { ownerId: userId },
                include: {
                    keywords: true,
                    competitors: true,
                },
            });
        }

        if (dataTypes.includes('subscriptions')) {
            exportData.subscriptions = await this.databaseService.userSubscription.findMany({
                where: { userId },
                include: { plan: true },
            });
        }

        if (dataTypes.includes('reports')) {
            exportData.reports = await this.databaseService.report.findMany({
                where: { userId },
            });
        }

        // TODO: Implement CSV export if format is 'csv'
        // For now, always return JSON

        return {
            data: exportData,
            exportedAt: new Date(),
            format,
            requestedTypes: dataTypes,
        };
    }
}
