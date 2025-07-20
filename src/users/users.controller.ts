import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Request,
    Param,
    Query,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
    async getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.id);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateProfile(req.user.id, updateUserDto);
    }

    @Get('usage')
    @ApiOperation({ summary: 'Get user subscription usage' })
    @ApiResponse({ status: 200, description: 'Usage data retrieved successfully' })
    async getUserUsage(@Request() req) {
        return this.usersService.getUserUsage(req.user.id);
    }

    @Get('notifications')
    @ApiOperation({ summary: 'Get user notifications' })
    @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
    async getNotifications(
        @Request() req,
        @Query('limit', ParseIntPipe) limit = 10,
    ) {
        return this.usersService.getNotifications(req.user.id, limit);
    }

    @Patch('notifications/:id/read')
    @ApiOperation({ summary: 'Mark notification as read' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    async markNotificationRead(@Request() req, @Param('id') notificationId: string) {
        return this.usersService.markNotificationRead(req.user.id, notificationId);
    }
}
