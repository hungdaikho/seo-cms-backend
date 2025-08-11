import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    UseGuards,
    Request,
    Param,
    Query,
    ParseIntPipe,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { DeactivateAccountDto, DeleteAccountDto, ExportDataDto } from './dto/security.dto';
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
    @ApiOperation({ summary: 'Get user notifications (deprecated - use /notifications endpoint)' })
    @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
    async getNotifications(
        @Request() req,
        @Query('limit', ParseIntPipe) limit = 10,
    ) {
        return this.usersService.getNotifications(req.user.id, limit);
    }

    @Patch('notifications/:id/read')
    @ApiOperation({ summary: 'Mark notification as read (deprecated - use /notifications endpoint)' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    async markNotificationRead(@Request() req, @Param('id', ParseUUIDPipe) notificationId: string) {
        return this.usersService.markNotificationRead(req.user.id, notificationId);
    }

    @Post('deactivate')
    @ApiOperation({
        summary: 'Deactivate user account',
        description: 'Deactivate user account while preserving data for potential reactivation'
    })
    @ApiResponse({ status: 200, description: 'Account deactivated successfully' })
    @ApiResponse({ status: 401, description: 'Invalid password' })
    async deactivateAccount(@Request() req, @Body() deactivateAccountDto: DeactivateAccountDto) {
        return this.usersService.deactivateAccount(req.user.id, deactivateAccountDto);
    }

    @Delete('account')
    @ApiOperation({
        summary: 'Delete user account permanently',
        description: 'Request account deletion. Data will be anonymized/removed within 30 days.'
    })
    @ApiResponse({ status: 200, description: 'Account deletion requested' })
    @ApiResponse({ status: 400, description: 'Invalid confirmation or password' })
    async deleteAccount(@Request() req, @Body() deleteAccountDto: DeleteAccountDto) {
        return this.usersService.deleteAccount(req.user.id, deleteAccountDto);
    }

    @Post('export-data')
    @ApiOperation({
        summary: 'Export user data',
        description: 'Export all user data in JSON or CSV format for GDPR compliance'
    })
    @ApiResponse({ status: 200, description: 'Data exported successfully' })
    async exportData(@Request() req, @Body() exportDataDto: ExportDataDto) {
        return this.usersService.exportUserData(req.user.id, exportDataDto);
    }
}
