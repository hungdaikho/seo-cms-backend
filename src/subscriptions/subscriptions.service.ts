import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class SubscriptionsService {
    constructor(private readonly databaseService: DatabaseService) { }

    async getPlans() {
        return this.databaseService.subscriptionPlan.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async getCurrentSubscription(userId: string) {
        const subscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trial'] },
            },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
        });

        return subscription;
    }

    async createSubscription(userId: string, createSubscriptionDto: CreateSubscriptionDto) {
        const { planId, billingCycle, paymentMethodId } = createSubscriptionDto;

        // Check if plan exists
        const plan = await this.databaseService.subscriptionPlan.findUnique({
            where: { id: planId },
        });

        if (!plan) {
            throw new NotFoundException('Subscription plan not found');
        }

        // Check if user already has an active subscription
        const existingSubscription = await this.getCurrentSubscription(userId);
        if (existingSubscription && existingSubscription.status === 'active') {
            throw new BadRequestException('User already has an active subscription');
        }

        // Calculate pricing based on billing cycle
        const price = billingCycle === 'yearly' ? plan.yearlyPrice || plan.price : plan.price;
        const expiresAt = new Date();
        if (billingCycle === 'yearly') {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        // Create subscription
        const subscription = await this.databaseService.userSubscription.create({
            data: {
                userId,
                planId,
                billingCycle,
                status: 'active',
                startedAt: new Date(),
                expiresAt,
                paymentMethod: paymentMethodId,
            },
            include: { plan: true },
        });

        // Initialize usage tracking
        if (plan.limits) {
            const limits = plan.limits as any;
            for (const [usageType, limitValue] of Object.entries(limits)) {
                await this.databaseService.subscriptionUsage.create({
                    data: {
                        userId,
                        subscriptionId: subscription.id,
                        usageType: usageType as any,
                        limitValue: limitValue as number,
                        currentUsage: 0,
                    },
                });
            }
        }

        return subscription;
    }

    async updateSubscription(userId: string, updateSubscriptionDto: UpdateSubscriptionDto) {
        const currentSubscription = await this.getCurrentSubscription(userId);

        if (!currentSubscription) {
            throw new NotFoundException('No active subscription found');
        }

        const updateData: any = {};

        if (updateSubscriptionDto.planId) {
            const newPlan = await this.databaseService.subscriptionPlan.findUnique({
                where: { id: updateSubscriptionDto.planId },
            });

            if (!newPlan) {
                throw new NotFoundException('New subscription plan not found');
            }

            updateData.planId = updateSubscriptionDto.planId;
        }

        if (updateSubscriptionDto.billingCycle) {
            updateData.billingCycle = updateSubscriptionDto.billingCycle;

            // Recalculate expiry date
            const expiresAt = new Date();
            if (updateSubscriptionDto.billingCycle === 'yearly') {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            } else {
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            }
            updateData.expiresAt = expiresAt;
        }

        return this.databaseService.userSubscription.update({
            where: { id: currentSubscription.id },
            data: updateData,
            include: { plan: true },
        });
    }

    async cancelSubscription(userId: string) {
        const subscription = await this.getCurrentSubscription(userId);

        if (!subscription) {
            throw new NotFoundException('No active subscription found');
        }

        return this.databaseService.userSubscription.update({
            where: { id: subscription.id },
            data: {
                status: 'cancelled',
                cancelledAt: new Date(),
                autoRenewal: false,
            },
        });
    }

    async getSubscriptionHistory(userId: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const [subscriptions, total] = await Promise.all([
            this.databaseService.userSubscription.findMany({
                where: { userId },
                include: { plan: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.databaseService.userSubscription.count({
                where: { userId },
            }),
        ]);

        return {
            data: subscriptions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getPaymentHistory(userId: string, paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            this.databaseService.paymentHistory.findMany({
                where: { userId },
                include: { subscription: { include: { plan: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.databaseService.paymentHistory.count({
                where: { userId },
            }),
        ]);

        return {
            data: payments,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
