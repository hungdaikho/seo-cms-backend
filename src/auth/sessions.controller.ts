import { Controller, Get, Delete, UseGuards, Request, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('auth/sessions')
export class SessionsController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    @ApiOperation({
        summary: 'Get user sessions',
        description: 'Get all active sessions for the current user'
    })
    @ApiResponse({ status: 200, description: 'Sessions retrieved successfully' })
    async getSessions(@Request() req) {
        return this.authService.getUserSessions(req.user.id);
    }

    @Delete(':sessionId')
    @ApiOperation({
        summary: 'Revoke specific session',
        description: 'Revoke a specific session by ID'
    })
    @ApiResponse({ status: 200, description: 'Session revoked successfully' })
    @ApiResponse({ status: 400, description: 'Cannot revoke current session' })
    async revokeSession(@Request() req, @Param('sessionId', ParseUUIDPipe) sessionId: string) {
        return this.authService.revokeSession(req.user.id, sessionId);
    }

    @Delete()
    @ApiOperation({
        summary: 'Revoke all other sessions',
        description: 'Revoke all sessions except the current one'
    })
    @ApiResponse({ status: 200, description: 'All other sessions revoked successfully' })
    async revokeAllSessions(@Request() req) {
        return this.authService.revokeAllSessions(req.user.id);
    }
}
