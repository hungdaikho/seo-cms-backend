import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
    GetUsersQueryDto,
    UpdateUserDto,
    CreateSubscriptionPlanDto,
    UpdateSubscriptionPlanDto,
    UpdateUserSubscriptionDto,
    AdminStatsDto,
    UpdateAdminPasswordDto,
    UpdateAdminEmailDto
} from './dto/admin.dto';
import { UserRole, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
    constructor(private readonly databaseService: DatabaseService) { }

    // User Management
    async getUsers(query: GetUsersQueryDto) {
        const { page = 1, limit = 10, search, role, isActive } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const [users, total] = await Promise.all([
            this.databaseService.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    subscriptions: {
                        include: {
                            plan: true
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    },
                    _count: {
                        select: {
                            projects: true,
                            payments: true
                        }
                    }
                }
            }),
            this.databaseService.user.count({ where })
        ]);

        return {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getUserById(id: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id },
            include: {
                subscriptions: {
                    include: {
                        plan: true,
                        payments: true
                    }
                },
                projects: true,
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                _count: {
                    select: {
                        projects: true,
                        notifications: true,
                        reports: true
                    }
                }
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateUser(id: string, updateData: UpdateUserDto) {
        const existingUser = await this.databaseService.user.findUnique({
            where: { id }
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Check email uniqueness if email is being updated
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await this.databaseService.user.findUnique({
                where: { email: updateData.email }
            });

            if (emailExists) {
                throw new ConflictException('Email already exists');
            }
        }

        return this.databaseService.user.update({
            where: { id },
            data: updateData
        });
    }

    async deleteUser(id: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.role === UserRole.super_admin) {
            throw new BadRequestException('Cannot delete super admin user');
        }

        return this.databaseService.user.delete({
            where: { id }
        });
    }

    async activateUser(id: string) {
        return this.updateUser(id, { isActive: true });
    }

    async deactivateUser(id: string) {
        return this.updateUser(id, { isActive: false });
    }

    // Subscription Plan Management
    async getSubscriptionPlans() {
        return this.databaseService.subscriptionPlan.findMany({
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: {
                    select: {
                        subscriptions: true
                    }
                }
            }
        });
    }

    async getSubscriptionPlanById(id: string) {
        const plan = await this.databaseService.subscriptionPlan.findUnique({
            where: { id },
            include: {
                subscriptions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                name: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        subscriptions: true
                    }
                }
            }
        });

        if (!plan) {
            throw new NotFoundException('Subscription plan not found');
        }

        return plan;
    }

    async createSubscriptionPlan(planData: CreateSubscriptionPlanDto) {
        // Check slug uniqueness
        const existingPlan = await this.databaseService.subscriptionPlan.findUnique({
            where: { slug: planData.slug }
        });

        if (existingPlan) {
            throw new ConflictException('Plan with this slug already exists');
        }

        return this.databaseService.subscriptionPlan.create({
            data: planData
        });
    }

    async updateSubscriptionPlan(id: string, updateData: UpdateSubscriptionPlanDto) {
        const existingPlan = await this.databaseService.subscriptionPlan.findUnique({
            where: { id }
        });

        if (!existingPlan) {
            throw new NotFoundException('Subscription plan not found');
        }

        return this.databaseService.subscriptionPlan.update({
            where: { id },
            data: updateData
        });
    }

    async deleteSubscriptionPlan(id: string) {
        const plan = await this.databaseService.subscriptionPlan.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        subscriptions: true
                    }
                }
            }
        });

        if (!plan) {
            throw new NotFoundException('Subscription plan not found');
        }

        if (plan._count.subscriptions > 0) {
            throw new BadRequestException('Cannot delete plan with active subscriptions');
        }

        return this.databaseService.subscriptionPlan.delete({
            where: { id }
        });
    }

    // User Subscription Management
    async getUserSubscriptions(userId: string) {
        return this.databaseService.userSubscription.findMany({
            where: { userId },
            include: {
                plan: true,
                payments: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateUserSubscription(userId: string, subscriptionData: UpdateUserSubscriptionDto) {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const plan = await this.databaseService.subscriptionPlan.findUnique({
            where: { id: subscriptionData.planId }
        });

        if (!plan) {
            throw new NotFoundException('Subscription plan not found');
        }

        // Get current active subscription
        const currentSubscription = await this.databaseService.userSubscription.findFirst({
            where: {
                userId,
                status: SubscriptionStatus.active
            }
        });

        // Cancel current subscription if exists
        if (currentSubscription) {
            await this.databaseService.userSubscription.update({
                where: { id: currentSubscription.id },
                data: {
                    status: SubscriptionStatus.cancelled,
                    cancelledAt: new Date()
                }
            });
        }

        // Create new subscription
        const expiresAt = subscriptionData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default

        return this.databaseService.userSubscription.create({
            data: {
                userId,
                planId: subscriptionData.planId,
                status: subscriptionData.status || SubscriptionStatus.active,
                startedAt: new Date(),
                expiresAt,
                billingCycle: 'monthly'
            },
            include: {
                plan: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }

    async cancelUserSubscription(userId: string, subscriptionId: string) {
        const subscription = await this.databaseService.userSubscription.findFirst({
            where: {
                id: subscriptionId,
                userId
            }
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        return this.databaseService.userSubscription.update({
            where: { id: subscriptionId },
            data: {
                status: SubscriptionStatus.cancelled,
                cancelledAt: new Date()
            }
        });
    }

    // Dashboard Statistics
    async getDashboardStats(): Promise<AdminStatsDto> {
        const [
            totalUsers,
            activeUsers,
            totalSubscriptions,
            activeSubscriptions,
            expiredSubscriptions,
            totalRevenue,
            monthlyRevenue
        ] = await Promise.all([
            this.databaseService.user.count(),
            this.databaseService.user.count({ where: { isActive: true } }),
            this.databaseService.userSubscription.count(),
            this.databaseService.userSubscription.count({
                where: { status: SubscriptionStatus.active }
            }),
            this.databaseService.userSubscription.count({
                where: { status: SubscriptionStatus.expired }
            }),
            this.databaseService.paymentHistory.aggregate({
                where: { status: 'completed' },
                _sum: { amount: true }
            }),
            this.databaseService.paymentHistory.aggregate({
                where: {
                    status: 'completed',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                },
                _sum: { amount: true }
            })
        ]);

        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            totalSubscriptions,
            activeSubscriptions,
            expiredSubscriptions,
            totalRevenue: Number(totalRevenue._sum.amount || 0),
            monthlyRevenue: Number(monthlyRevenue._sum.amount || 0)
        };
    }

    // Initialize admin account
    async createDefaultAdmin() {
        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'Admin1234';

        // Check if admin already exists
        const existingAdmin = await this.databaseService.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log('Admin account already exists');
            return existingAdmin;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const admin = await this.databaseService.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'System Administrator',
                role: UserRole.super_admin,
                isActive: true,
                emailVerified: true,
                emailVerifiedAt: new Date()
            }
        });

        console.log('Default admin account created:', adminEmail);
        return admin;
    }

    // Initialize default subscription plans
    async createDefaultPlans() {
        const plans = [
            {
                name: 'Free Trial',
                slug: 'trial',
                description: 'Free trial with basic features',
                price: 0,
                yearlyPrice: 0,
                currency: 'USD',
                features: {
                    projects: 1,
                    keywords: 50,
                    audits: 1,
                    competitors: 3,
                    api_requests: 10,
                    support: 'email'
                },
                limits: {
                    projects: 1,
                    keywords_tracking: 50,
                    api_requests_daily: 10,
                    api_requests_monthly: 300,
                    audits_monthly: 1,
                    competitors_tracking: 3,
                    backlinks_monitoring: 100
                },
                isActive: true,
                sortOrder: 1
            },
            {
                name: 'Starter',
                slug: 'starter',
                description: 'Perfect for small businesses and freelancers',
                price: 29.99,
                yearlyPrice: 299.99,
                currency: 'USD',
                features: {
                    projects: 5,
                    keywords: 500,
                    audits: 10,
                    competitors: 10,
                    api_requests: 50,
                    support: 'email',
                    reports: 'basic'
                },
                limits: {
                    projects: 5,
                    keywords_tracking: 500,
                    api_requests_daily: 50,
                    api_requests_monthly: 1500,
                    audits_monthly: 10,
                    competitors_tracking: 10,
                    backlinks_monitoring: 1000
                },
                isActive: true,
                sortOrder: 2
            },
            {
                name: 'Professional',
                slug: 'professional',
                description: 'Ideal for growing businesses and agencies',
                price: 79.99,
                yearlyPrice: 799.99,
                currency: 'USD',
                features: {
                    projects: 25,
                    keywords: 2500,
                    audits: 50,
                    competitors: 25,
                    api_requests: 200,
                    support: 'priority',
                    reports: 'advanced',
                    white_label: true
                },
                limits: {
                    projects: 25,
                    keywords_tracking: 2500,
                    api_requests_daily: 200,
                    api_requests_monthly: 6000,
                    audits_monthly: 50,
                    competitors_tracking: 25,
                    backlinks_monitoring: 10000
                },
                isActive: true,
                sortOrder: 3
            },
            {
                name: 'Agency',
                slug: 'agency',
                description: 'For large agencies and enterprises',
                price: 199.99,
                yearlyPrice: 1999.99,
                currency: 'USD',
                features: {
                    projects: 100,
                    keywords: 10000,
                    audits: 200,
                    competitors: 100,
                    api_requests: 1000,
                    support: 'dedicated',
                    reports: 'custom',
                    white_label: true,
                    multi_user: true,
                    custom_integrations: true
                },
                limits: {
                    projects: 100,
                    keywords_tracking: 10000,
                    api_requests_daily: 1000,
                    api_requests_monthly: 30000,
                    audits_monthly: 200,
                    competitors_tracking: 100,
                    backlinks_monitoring: 100000
                },
                isActive: true,
                sortOrder: 4
            }
        ];

        const createdPlans: any[] = [];

        for (const planData of plans) {
            const existingPlan = await this.databaseService.subscriptionPlan.findUnique({
                where: { slug: planData.slug }
            });

            if (!existingPlan) {
                const plan = await this.databaseService.subscriptionPlan.create({
                    data: planData
                });
                createdPlans.push(plan);
                console.log(`✅ Created plan: ${planData.name}`);
            } else {
                console.log(`⚠️  Plan already exists: ${planData.name}`);
            }
        }

        return createdPlans;
    }

    // Admin Profile Management
    async updateAdminPassword(adminId: string, updateAdminPasswordDto: UpdateAdminPasswordDto) {
        const { currentPassword, newPassword } = updateAdminPasswordDto;

        // Get admin user
        const admin = await this.databaseService.user.findUnique({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        // Verify admin role
        if (admin.role !== 'admin' && admin.role !== 'super_admin') {
            throw new BadRequestException('Only admin users can use this endpoint');
        }

        // Check if admin has password (not OAuth user)
        if (!admin.password) {
            throw new BadRequestException('Cannot change password for OAuth accounts');
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.databaseService.user.update({
            where: { id: adminId },
            data: { password: hashedNewPassword },
        });

        return { message: 'Admin password updated successfully' };
    }

    async updateAdminEmail(adminId: string, updateAdminEmailDto: UpdateAdminEmailDto) {
        const { email, password } = updateAdminEmailDto;

        // Get admin user
        const admin = await this.databaseService.user.findUnique({
            where: { id: adminId },
        });

        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        // Verify admin role
        if (admin.role !== 'admin' && admin.role !== 'super_admin') {
            throw new BadRequestException('Only admin users can use this endpoint');
        }

        // Check if admin has password (not OAuth user)
        if (!admin.password) {
            throw new BadRequestException('Cannot change email for OAuth accounts without password verification');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Password is incorrect');
        }

        // Check if email is already in use
        const existingUser = await this.databaseService.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.id !== adminId) {
            throw new ConflictException('Email is already in use');
        }

        // Update email
        await this.databaseService.user.update({
            where: { id: adminId },
            data: {
                email,
                emailVerified: false // Email needs to be verified again
            },
        });

        return { message: 'Admin email updated successfully. Please verify your new email address.' };
    }
}
