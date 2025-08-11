import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';
import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto } from './dto/auth.dto';

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

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

        // Validate new password confirmation
        if (newPassword !== confirmPassword) {
            throw new BadRequestException('New password and confirmation do not match');
        }

        // Get user
        const user = await this.databaseService.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.databaseService.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return { message: 'Password changed successfully' };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;

        const user = await this.databaseService.user.findUnique({
            where: { email },
        });

        // Don't reveal if user exists or not for security
        if (!user) {
            return { message: 'If an account with that email exists, a password reset link has been sent.' };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save reset token
        await this.databaseService.passwordReset.create({
            data: {
                userId: user.id,
                token: resetToken,
                expiresAt: resetTokenExpiry,
            },
        });

        // TODO: Send email with reset link
        // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

        return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, newPassword, confirmPassword } = resetPasswordDto;

        // Validate password confirmation
        if (newPassword !== confirmPassword) {
            throw new BadRequestException('New password and confirmation do not match');
        }

        // Find valid reset token
        const resetRecord = await this.databaseService.passwordReset.findFirst({
            where: {
                token,
                expiresAt: { gte: new Date() },
                used: false,
            },
            include: { user: true },
        });

        if (!resetRecord) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and mark token as used
        await this.databaseService.$transaction([
            this.databaseService.user.update({
                where: { id: resetRecord.userId },
                data: { password: hashedPassword },
            }),
            this.databaseService.passwordReset.update({
                where: { id: resetRecord.id },
                data: { used: true },
            }),
        ]);

        return { message: 'Password reset successfully' };
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const { token } = verifyEmailDto;

        // Find valid verification token
        const verificationRecord = await this.databaseService.emailVerification.findFirst({
            where: {
                token,
                expiresAt: { gte: new Date() },
                used: false,
            },
            include: { user: true },
        });

        if (!verificationRecord) {
            throw new BadRequestException('Invalid or expired verification token');
        }

        // Update user email verification status and mark token as used
        await this.databaseService.$transaction([
            this.databaseService.user.update({
                where: { id: verificationRecord.userId },
                data: { emailVerified: true },
            }),
            this.databaseService.emailVerification.update({
                where: { id: verificationRecord.id },
                data: { used: true },
            }),
        ]);

        return { message: 'Email verified successfully' };
    }

    async resendVerification(resendVerificationDto: ResendVerificationDto) {
        const { email } = resendVerificationDto;

        const user = await this.databaseService.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { message: 'If an account with that email exists, a verification email has been sent.' };
        }

        if (user.emailVerified) {
            throw new BadRequestException('Email is already verified');
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 86400000); // 24 hours

        // Save verification token
        await this.databaseService.emailVerification.create({
            data: {
                userId: user.id,
                token: verificationToken,
                expiresAt: verificationTokenExpiry,
            },
        });

        // TODO: Send verification email
        // await this.emailService.sendVerificationEmail(user.email, verificationToken);

        return { message: 'If an account with that email exists, a verification email has been sent.' };
    }

    async getUserSessions(userId: string) {
        // This would require implementing session tracking in database
        // For now, return placeholder response
        return {
            sessions: [
                {
                    id: 'current',
                    device: 'Current Session',
                    location: 'Unknown',
                    lastActive: new Date(),
                    current: true,
                }
            ]
        };
    }

    async revokeSession(userId: string, sessionId: string) {
        // This would require implementing session tracking
        // For now, return placeholder response
        if (sessionId === 'current') {
            throw new BadRequestException('Cannot revoke current session');
        }

        return { message: 'Session revoked successfully' };
    }

    async revokeAllSessions(userId: string) {
        // This would require implementing session tracking
        // For now, return placeholder response
        return { message: 'All other sessions revoked successfully' };
    }
}
