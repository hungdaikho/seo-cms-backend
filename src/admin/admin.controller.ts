import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
    Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard, SuperAdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Dashboard
    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Dashboard statistics', type: AdminStatsDto })
    async getDashboardStats(): Promise<AdminStatsDto> {
        return this.adminService.getDashboardStats();
    }

    // User Management
    @Get('users')
    @ApiOperation({ summary: 'Get all users with pagination and filters' })
    @ApiResponse({ status: 200, description: 'List of users' })
    async getUsers(@Query() query: GetUsersQueryDto) {
        return this.adminService.getUsers(query);
    }

    @Get('users/:id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'User details' })
    async getUserById(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.getUserById(id);
    }

    @Put('users/:id')
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    async updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateData: UpdateUserDto
    ) {
        return this.adminService.updateUser(id, updateData);
    }

    @Delete('users/:id')
    @UseGuards(SuperAdminGuard)
    @ApiOperation({ summary: 'Delete user (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.deleteUser(id);
    }

    @Put('users/:id/activate')
    @ApiOperation({ summary: 'Activate user account' })
    @ApiResponse({ status: 200, description: 'User activated successfully' })
    async activateUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.activateUser(id);
    }

    @Put('users/:id/deactivate')
    @ApiOperation({ summary: 'Deactivate user account' })
    @ApiResponse({ status: 200, description: 'User deactivated successfully' })
    async deactivateUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.deactivateUser(id);
    }

    // Subscription Plan Management
    @Get('subscription-plans')
    @ApiOperation({ summary: 'Get all subscription plans' })
    @ApiResponse({ status: 200, description: 'List of subscription plans' })
    async getSubscriptionPlans() {
        return this.adminService.getSubscriptionPlans();
    }

    @Get('subscription-plans/:id')
    @ApiOperation({ summary: 'Get subscription plan by ID' })
    @ApiResponse({ status: 200, description: 'Subscription plan details' })
    async getSubscriptionPlanById(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.getSubscriptionPlanById(id);
    }

    @Post('subscription-plans')
    @UseGuards(SuperAdminGuard)
    @ApiOperation({ summary: 'Create new subscription plan (Super Admin only)' })
    @ApiResponse({ status: 201, description: 'Subscription plan created successfully' })
    async createSubscriptionPlan(@Body() planData: CreateSubscriptionPlanDto) {
        return this.adminService.createSubscriptionPlan(planData);
    }

    @Put('subscription-plans/:id')
    @UseGuards(SuperAdminGuard)
    @ApiOperation({ summary: 'Update subscription plan (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'Subscription plan updated successfully' })
    async updateSubscriptionPlan(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateData: UpdateSubscriptionPlanDto
    ) {
        return this.adminService.updateSubscriptionPlan(id, updateData);
    }

    @Delete('subscription-plans/:id')
    @UseGuards(SuperAdminGuard)
    @ApiOperation({ summary: 'Delete subscription plan (Super Admin only)' })
    @ApiResponse({ status: 200, description: 'Subscription plan deleted successfully' })
    async deleteSubscriptionPlan(@Param('id', ParseUUIDPipe) id: string) {
        return this.adminService.deleteSubscriptionPlan(id);
    }

    // User Subscription Management
    @Get('users/:userId/subscriptions')
    @ApiOperation({ summary: 'Get user subscriptions' })
    @ApiResponse({ status: 200, description: 'User subscription history' })
    async getUserSubscriptions(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.adminService.getUserSubscriptions(userId);
    }

    @Put('users/:userId/subscription')
    @ApiOperation({ summary: 'Update user subscription plan' })
    @ApiResponse({ status: 200, description: 'User subscription updated successfully' })
    async updateUserSubscription(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body() subscriptionData: UpdateUserSubscriptionDto
    ) {
        return this.adminService.updateUserSubscription(userId, subscriptionData);
    }

    @Put('users/:userId/subscriptions/:subscriptionId/cancel')
    @ApiOperation({ summary: 'Cancel user subscription' })
    @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
    async cancelUserSubscription(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('subscriptionId', ParseUUIDPipe) subscriptionId: string
    ) {
        return this.adminService.cancelUserSubscription(userId, subscriptionId);
    }

    // Initialize admin account (for development/deployment)
    @Post('init-admin')
    @UseGuards(SuperAdminGuard)
    @ApiOperation({ summary: 'Initialize default admin account (Super Admin only)' })
    @ApiResponse({ status: 201, description: 'Admin account created or already exists' })
    async initializeAdmin() {
        return this.adminService.createDefaultAdmin();
    }

    @Post('init-plans')
    @UseGuards(SuperAdminGuard)
    @ApiOperation({ summary: 'Initialize default subscription plans (Super Admin only)' })
    @ApiResponse({ status: 201, description: 'Default subscription plans created' })
    async initializePlans() {
        return this.adminService.createDefaultPlans();
    }

    // Admin Profile Management
    @Put('profile/password')
    @ApiOperation({
        summary: 'Update admin password',
        description: 'Allows admin users to change their password by providing current password and new password'
    })
    @ApiResponse({
        status: 200,
        description: 'Admin password updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Admin password updated successfully' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid current password or admin role required' })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    async updateAdminPassword(@Request() req, @Body() updateAdminPasswordDto: UpdateAdminPasswordDto) {
        return this.adminService.updateAdminPassword(req.user.id, updateAdminPasswordDto);
    }

    @Put('profile/email')
    @ApiOperation({
        summary: 'Update admin email',
        description: 'Allows admin users to change their email address by providing new email and password for verification'
    })
    @ApiResponse({
        status: 200,
        description: 'Admin email updated successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Admin email updated successfully. Please verify your new email address.' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Bad Request - Invalid password or admin role required' })
    @ApiResponse({ status: 404, description: 'Admin not found' })
    @ApiResponse({ status: 409, description: 'Conflict - Email is already in use' })
    async updateAdminEmail(@Request() req, @Body() updateAdminEmailDto: UpdateAdminEmailDto) {
        return this.adminService.updateAdminEmail(req.user.id, updateAdminEmailDto);
    }
}
