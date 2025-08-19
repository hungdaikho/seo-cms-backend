import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto, GoogleUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
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

        // Generate email verification token
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

        // Send verification email
        try {
            await this.emailService.sendVerificationEmail(user.email, verificationToken);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Don't throw error as user registration should succeed even if email fails
        }

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

        // NOTE: Welcome email will be sent after email verification
        // Not sending welcome email here to avoid confusion

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

        // Check if user has password (not OAuth user)
        if (!user.password) {
            throw new UnauthorizedException('Please use Google login for this account');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Check if email is verified (skip for OAuth users who don't have password)
        if (!user.emailVerified && user.password) {
            throw new UnauthorizedException('Please verify your email before logging in');
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

        // Check if user has password (not OAuth user)
        if (!user.password) {
            throw new BadRequestException('Cannot change password for OAuth accounts');
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

        // Send password reset email
        try {
            await this.emailService.sendPasswordResetEmail(user.email, resetToken);
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            // Don't throw error to maintain security (don't reveal if user exists)
        }

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
                data: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                },
            }),
            this.databaseService.emailVerification.update({
                where: { id: verificationRecord.id },
                data: { used: true },
            }),
        ]);

        // Send welcome email after successful verification
        try {
            await this.emailService.sendWelcomeEmail(verificationRecord.user.email, verificationRecord.user.name);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            // Don't throw error as verification already succeeded
        }

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

        // Send verification email
        try {
            await this.emailService.sendVerificationEmail(user.email, verificationToken);
        } catch (error) {
            console.error('Failed to send verification email:', error);
            // Don't throw error to maintain security (don't reveal if user exists)
        }

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

    async googleLogin(googleUser: GoogleUserDto) {
        console.log('AuthService.googleLogin called with:', googleUser);

        // Validate required fields
        if (!googleUser.email) {
            throw new BadRequestException('Email is required from Google profile');
        }

        if (!googleUser.googleId) {
            throw new BadRequestException('Google ID is required');
        }

        // Check if user already exists with this Google ID
        let user = await this.databaseService.user.findFirst({
            where: {
                OR: [
                    { googleId: googleUser.googleId },
                    { email: googleUser.email },
                ]
            },
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
            // Create new user from Google profile
            const fullName = `${googleUser.firstName || ''} ${googleUser.lastName || ''}`.trim() || 'Google User';

            user = await this.databaseService.user.create({
                data: {
                    email: googleUser.email,
                    name: fullName,
                    googleId: googleUser.googleId,
                    profilePicture: googleUser.picture || null,
                    emailVerified: true, // Google emails are pre-verified
                    password: '', // Empty password for OAuth users
                },
                include: {
                    subscriptions: {
                        where: { status: { in: ['active', 'trial'] } },
                        include: { plan: true },
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });

            // Create trial subscription for new Google users
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

                // Refresh user data to include new subscription
                user = await this.databaseService.user.findUnique({
                    where: { id: user.id },
                    include: {
                        subscriptions: {
                            where: { status: { in: ['active', 'trial'] } },
                            include: { plan: true },
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                        },
                    },
                });
            }

            // Send welcome email for new Google users
            if (user) {
                try {
                    await this.emailService.sendWelcomeEmail(user.email, user.name);
                } catch (error) {
                    console.error('Failed to send welcome email to Google user:', error);
                    // Don't throw error as registration already succeeded
                }
            }
        } else {
            // Update existing user with Google info if not already set
            if (!user.googleId) {
                user = await this.databaseService.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: googleUser.googleId,
                        profilePicture: googleUser.picture,
                        emailVerified: true,
                    },
                    include: {
                        subscriptions: {
                            where: { status: { in: ['active', 'trial'] } },
                            include: { plan: true },
                            orderBy: { createdAt: 'desc' },
                            take: 1,
                        },
                    },
                });
            }
        }

        if (!user) {
            throw new UnauthorizedException('Failed to authenticate with Google');
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
                profilePicture: user.profilePicture,
                emailVerified: user.emailVerified,
            },
            subscription: user.subscriptions?.[0] || null,
            accessToken,
        };
    }
}
