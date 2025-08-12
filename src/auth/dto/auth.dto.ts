import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongPassword123!' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'example.com', required: false })
    @IsOptional()
    @IsString()
    website?: string;
}

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'StrongPassword123!' })
    @IsString()
    password: string;
}

export class UpdateProfileDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    timezone?: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'CurrentPassword123!' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'NewPassword123!' })
    @IsString()
    @MinLength(6)
    newPassword: string;

    @ApiProperty({ example: 'NewPassword123!' })
    @IsString()
    confirmPassword: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'reset-token-from-email' })
    @IsString()
    token: string;

    @ApiProperty({ example: 'NewPassword123!' })
    @IsString()
    @MinLength(6)
    newPassword: string;

    @ApiProperty({ example: 'NewPassword123!' })
    @IsString()
    confirmPassword: string;
}

export class VerifyEmailDto {
    @ApiProperty({ example: 'verification-token-from-email' })
    @IsString()
    token: string;
}

export class ResendVerificationDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
}

export class GoogleUserDto {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
    refreshToken?: string;
}
