import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, name, website } = registerDto;

        // Check if user already exists
        const existingUser = await this.databaseService.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with 14-day trial
        const user = await this.databaseService.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        // Create trial subscription
        const trialPlan = await this.databaseService.subscriptionPlan.findFirst({
            where: { slug: 'trial' },
        });

        if (trialPlan) {
            const trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + 14);

            await this.databaseService.userSubscription.create({
                data: {
                    userId: user.id,
                    planId: trialPlan.id,
                    status: 'trial',
                    startedAt: new Date(),
                    trialEndsAt: trialEnd,
                    expiresAt: trialEnd,
                },
            });
        }

        // Generate JWT token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user
        const user = await this.databaseService.user.findUnique({
            where: { email },
            include: {
                subscriptions: {
                    where: { status: { in: ['active', 'trial'] } },
                    include: { plan: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Update last login
        await this.databaseService.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate JWT token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                subscription: user.subscriptions[0] || null,
            },
            accessToken,
        };
    }

    async validateUser(userId: string) {
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
            include: {
                subscriptions: {
                    where: { status: { in: ['active', 'trial'] } },
                    include: { plan: true },
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!user || !user.isActive) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            subscription: user.subscriptions[0] || null,
        };
    }
}
