import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailTemplates } from './templates/email-templates';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.createTransporter();
    }

    private createTransporter() {
        const smtpHost = this.configService.get<string>('SMTP_HOST');
        const smtpPort = this.configService.get<number>('SMTP_PORT');
        const smtpUser = this.configService.get<string>('SMTP_USER');
        const smtpPass = this.configService.get<string>('SMTP_PASS');

        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
            this.logger.warn('SMTP configuration is missing. Email features will be disabled.');
            return;
        }

        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        // Verify connection configuration
        this.transporter.verify((error, success) => {
            if (error) {
                this.logger.error('SMTP connection failed:', error);
            } else {
                this.logger.log('SMTP server is ready to take our messages');
            }
        });
    }

    async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('SMTP not configured. Password reset email not sent.');
            return;
        }

        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: this.configService.get<string>('SMTP_USER'),
            to: email,
            subject: 'Reset Your Password - SEO BOOST',
            html: EmailTemplates.passwordReset(resetUrl),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Password reset email sent to ${email}`);
        } catch (error) {
            this.logger.error('Failed to send password reset email:', error);
            throw new Error('Failed to send password reset email');
        }
    }

    async sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('SMTP not configured. Verification email not sent.');
            return;
        }

        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: this.configService.get<string>('SMTP_USER'),
            to: email,
            subject: 'Verify Your Email - SEO BOOST',
            html: EmailTemplates.emailVerification(verificationUrl),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Verification email sent to ${email}`);
        } catch (error) {
            this.logger.error('Failed to send verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('SMTP not configured. Welcome email not sent.');
            return;
        }

        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

        const mailOptions = {
            from: this.configService.get<string>('SMTP_USER'),
            to: email,
            subject: 'Welcome to SEO BOOST Platform!',
            html: EmailTemplates.welcome(name, frontendUrl),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Welcome email sent to ${email}`);
        } catch (error) {
            this.logger.error('Failed to send welcome email:', error);
            // Don't throw error for welcome email as it's not critical
        }
    }
}
