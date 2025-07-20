import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Get('plans')
    @ApiOperation({ summary: 'Get available subscription plans' })
    @ApiResponse({ status: 200, description: 'Plans retrieved successfully' })
    async getPlans() {
        return this.subscriptionsService.getPlans();
    }

    @Get('current')
    @ApiOperation({ summary: 'Get current user subscription' })
    @ApiResponse({ status: 200, description: 'Current subscription retrieved successfully' })
    async getCurrentSubscription(@Request() req) {
        return this.subscriptionsService.getCurrentSubscription(req.user.id);
    }

    @Post()
    @ApiOperation({ summary: 'Create new subscription' })
    @ApiResponse({ status: 201, description: 'Subscription created successfully' })
    @ApiResponse({ status: 400, description: 'User already has active subscription' })
    async createSubscription(@Request() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
        return this.subscriptionsService.createSubscription(req.user.id, createSubscriptionDto);
    }

    @Patch()
    @ApiOperation({ summary: 'Update subscription (upgrade/downgrade)' })
    @ApiResponse({ status: 200, description: 'Subscription updated successfully' })
    async updateSubscription(@Request() req, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
        return this.subscriptionsService.updateSubscription(req.user.id, updateSubscriptionDto);
    }

    @Delete()
    @ApiOperation({ summary: 'Cancel subscription' })
    @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
    async cancelSubscription(@Request() req) {
        return this.subscriptionsService.cancelSubscription(req.user.id);
    }

    @Get('history')
    @ApiOperation({ summary: 'Get subscription history' })
    @ApiResponse({ status: 200, description: 'Subscription history retrieved successfully' })
    async getSubscriptionHistory(@Request() req, @Query() paginationDto: PaginationDto) {
        return this.subscriptionsService.getSubscriptionHistory(req.user.id, paginationDto);
    }

    @Get('payments')
    @ApiOperation({ summary: 'Get payment history' })
    @ApiResponse({ status: 200, description: 'Payment history retrieved successfully' })
    async getPaymentHistory(@Request() req, @Query() paginationDto: PaginationDto) {
        return this.subscriptionsService.getPaymentHistory(req.user.id, paginationDto);
    }
}
