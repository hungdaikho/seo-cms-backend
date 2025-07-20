import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthResponseDto, ErrorResponseDto } from '../common/dto/response.dto';

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
}
