import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto } from './dto/auth.dto';
import { AuthResponseDto, ErrorResponseDto } from '../common/dto/response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Register new user with 14-day trial',
        description: `
Register a new user account with automatic 14-day trial activation.

**Trial Benefits:**
- Full Pro features for 14 days
- Up to 50 keywords tracking
- Up to 3 competitors
- Complete SEO audits
- Email support

**After Trial:**
- Automatic downgrade to Free plan (1 project, 25 keywords)
- Option to upgrade to paid plans
        `
    })
    @ApiBody({
        type: RegisterDto,
        examples: {
            basic: {
                summary: 'Basic Registration',
                description: 'Register with email, password, and name',
                value: {
                    email: 'john.doe@example.com',
                    password: 'SecurePassword123!',
                    name: 'John Doe',
                    website: 'example.com'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully with trial activated',
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 409,
        description: 'User already exists',
        type: ErrorResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error',
        type: ErrorResponseDto
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'User login',
        description: `
Authenticate user and return JWT access token.

**Returns:**
- User profile information
- JWT access token (expires in 30 days)
- Current subscription details
        `
    })
    @ApiBody({
        type: LoginDto,
        examples: {
            basic: {
                summary: 'User Login',
                description: 'Login with email and password',
                value: {
                    email: 'john.doe@example.com',
                    password: 'SecurePassword123!'
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Invalid credentials',
        type: ErrorResponseDto
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Change user password',
        description: 'Change password for authenticated user'
    })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error or passwords do not match',
        type: ErrorResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Current password is incorrect',
        type: ErrorResponseDto
    })
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(req.user.id, changePasswordDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Request password reset',
        description: 'Send password reset email to user'
    })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent (if email exists)'
    })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Reset password with token',
        description: 'Reset password using token from email'
    })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid token or passwords do not match',
        type: ErrorResponseDto
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify email address',
        description: 'Verify email using token from verification email'
    })
    @ApiResponse({
        status: 200,
        description: 'Email verified successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid or expired verification token',
        type: ErrorResponseDto
    })
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }

    @Post('resend-verification')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Resend email verification',
        description: 'Resend verification email to user'
    })
    @ApiResponse({
        status: 200,
        description: 'Verification email sent (if email exists and not verified)'
    })
    @ApiResponse({
        status: 400,
        description: 'Email is already verified',
        type: ErrorResponseDto
    })
    async resendVerification(@Body() resendVerificationDto: ResendVerificationDto) {
        return this.authService.resendVerification(resendVerificationDto);
    }
}
