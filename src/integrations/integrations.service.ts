import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
    CreateIntegrationDto,
    UpdateIntegrationDto,
    GoogleSearchConsoleConnectDto,
    GoogleAnalyticsConnectDto,
    SyncIntegrationDto,
    IntegrationType
} from './dto/integration.dto';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as crypto from 'crypto';

@Injectable()
export class IntegrationsService {
    private readonly googleOAuthClient: OAuth2Client;
    private readonly encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-for-dev';

    constructor(private readonly db: DatabaseService) {
        this.googleOAuthClient = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );
    }

    async createIntegration(userId: string, createDto: CreateIntegrationDto) {
        const encryptedCredentials = createDto.credentials
            ? this.encryptCredentials(createDto.credentials)
            : undefined; return this.db.integration.create({
                data: {
                    userId,
                    projectId: createDto.projectId,
                    type: createDto.type,
                    config: createDto.config,
                    credentials: encryptedCredentials,
                    isActive: true,
                },
            });
    }

    async getUserIntegrations(userId: string) {
        const integrations = await this.db.integration.findMany({
            where: { userId },
            include: {
                project: {
                    select: { id: true, name: true, domain: true }
                }
            },
        });

        return integrations.map(integration => ({
            ...integration,
            credentials: undefined, // Never expose credentials
        }));
    }

    async getIntegrationById(userId: string, integrationId: string) {
        const integration = await this.db.integration.findFirst({
            where: { id: integrationId, userId },
            include: {
                project: {
                    select: { id: true, name: true, domain: true }
                }
            },
        });

        if (!integration) {
            throw new NotFoundException('Integration not found');
        }

        return {
            ...integration,
            credentials: undefined, // Never expose credentials
        };
    }

    async updateIntegration(userId: string, integrationId: string, updateDto: UpdateIntegrationDto) {
        const integration = await this.db.integration.findFirst({
            where: { id: integrationId, userId },
        });

        if (!integration) {
            throw new NotFoundException('Integration not found');
        }

        const encryptedCredentials = updateDto.credentials
            ? this.encryptCredentials(updateDto.credentials)
            : undefined;

        return this.db.integration.update({
            where: { id: integrationId },
            data: {
                config: updateDto.config,
                credentials: encryptedCredentials,
                isActive: updateDto.isActive,
            },
        });
    }

    async deleteIntegration(userId: string, integrationId: string) {
        const integration = await this.db.integration.findFirst({
            where: { id: integrationId, userId },
        });

        if (!integration) {
            throw new NotFoundException('Integration not found');
        }

        await this.db.integration.delete({
            where: { id: integrationId },
        });

        return { message: 'Integration deleted successfully' };
    }

    async connectGoogleSearchConsole(userId: string, connectDto: GoogleSearchConsoleConnectDto) {
        try {
            // Exchange authorization code for tokens
            const { tokens } = await this.googleOAuthClient.getToken(connectDto.authCode);
            this.googleOAuthClient.setCredentials(tokens);

            // Verify GSC access
            const searchconsole = google.searchconsole({ version: 'v1', auth: this.googleOAuthClient });
            const sites = await searchconsole.sites.list();

            const siteExists = sites.data.siteEntry?.some(site =>
                site.siteUrl === connectDto.propertyUrl
            );

            if (!siteExists) {
                throw new BadRequestException('Property not found or no access');
            }

            // Create integration
            return this.createIntegration(userId, {
                type: IntegrationType.GOOGLE_SEARCH_CONSOLE,
                projectId: connectDto.projectId,
                config: {
                    propertyUrl: connectDto.propertyUrl,
                },
                credentials: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    tokenType: tokens.token_type,
                    expiryDate: tokens.expiry_date,
                },
            });
        } catch (error) {
            throw new BadRequestException('Failed to connect Google Search Console: ' + error.message);
        }
    }

    async connectGoogleAnalytics(userId: string, connectDto: GoogleAnalyticsConnectDto) {
        try {
            // Exchange authorization code for tokens
            const { tokens } = await this.googleOAuthClient.getToken(connectDto.authCode);
            this.googleOAuthClient.setCredentials(tokens);

            // Verify GA access
            const analytics = google.analyticsreporting({ version: 'v4', auth: this.googleOAuthClient });

            // Test access by getting basic data
            await analytics.reports.batchGet({
                requestBody: {
                    reportRequests: [{
                        viewId: connectDto.propertyId,
                        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                        metrics: [{ expression: 'ga:sessions' }],
                        dimensions: [{ name: 'ga:date' }],
                    }],
                },
            });

            // Create integration
            return this.createIntegration(userId, {
                type: IntegrationType.GOOGLE_ANALYTICS,
                projectId: connectDto.projectId,
                config: {
                    propertyId: connectDto.propertyId,
                },
                credentials: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    tokenType: tokens.token_type,
                    expiryDate: tokens.expiry_date,
                },
            });
        } catch (error) {
            throw new BadRequestException('Failed to connect Google Analytics: ' + error.message);
        }
    }

    async syncIntegrationData(userId: string, integrationId: string, syncDto: SyncIntegrationDto) {
        const integration = await this.db.integration.findFirst({
            where: { id: integrationId, userId },
        });

        if (!integration) {
            throw new NotFoundException('Integration not found');
        }

        if (!integration.isActive) {
            throw new BadRequestException('Integration is not active');
        }

        if (!integration.credentials) {
            throw new BadRequestException('Integration credentials not found');
        }

        const credentials = this.decryptCredentials(integration.credentials as string);

        switch (integration.type) {
            case IntegrationType.GOOGLE_SEARCH_CONSOLE:
                return this.syncGSCData(integration, credentials, syncDto);

            case IntegrationType.GOOGLE_ANALYTICS:
                return this.syncGAData(integration, credentials, syncDto);

            default:
                throw new BadRequestException('Sync not supported for this integration type');
        }
    }

    private async syncGSCData(integration: any, credentials: any, syncDto: SyncIntegrationDto) {
        this.googleOAuthClient.setCredentials(credentials);
        const searchconsole = google.searchconsole({ version: 'v1', auth: this.googleOAuthClient });

        const startDate = syncDto.startDate || '7daysAgo';
        const endDate = syncDto.endDate || 'today';

        try {
            // Get search analytics data
            const response = await searchconsole.searchanalytics.query({
                siteUrl: integration.config.propertyUrl,
                requestBody: {
                    startDate,
                    endDate,
                    dimensions: ['query', 'page'],
                    rowLimit: 1000,
                },
            });

            // Store traffic data
            if (response.data.rows) {
                for (const row of response.data.rows) {
                    if (!row.keys || row.keys.length < 2) continue;

                    await this.db.trafficData.upsert({
                        where: {
                            projectId_source_date_page: {
                                projectId: integration.projectId,
                                source: 'gsc',
                                date: new Date(),
                                page: row.keys[1] || '',
                            },
                        },
                        update: {
                            clicks: row.clicks || 0,
                            impressions: row.impressions || 0,
                            ctr: row.ctr || 0,
                            position: row.position || 0,
                            query: row.keys[0] || '',
                        },
                        create: {
                            projectId: integration.projectId,
                            source: 'gsc',
                            date: new Date(),
                            page: row.keys[1] || '',
                            clicks: row.clicks || 0,
                            impressions: row.impressions || 0,
                            ctr: row.ctr || 0,
                            position: row.position || 0,
                            query: row.keys[0] || '',
                        },
                    });
                }
            }            // Update last sync
            await this.db.integration.update({
                where: { id: integration.id },
                data: { lastSync: new Date() },
            });

            return { message: 'GSC data synced successfully', rows: response.data.rows?.length || 0 };
        } catch (error) {
            throw new BadRequestException('Failed to sync GSC data: ' + error.message);
        }
    }

    private async syncGAData(integration: any, credentials: any, syncDto: SyncIntegrationDto) {
        this.googleOAuthClient.setCredentials(credentials);
        const analytics = google.analyticsreporting({ version: 'v4', auth: this.googleOAuthClient });

        const startDate = syncDto.startDate || '7daysAgo';
        const endDate = syncDto.endDate || 'today';

        try {
            const response = await analytics.reports.batchGet({
                requestBody: {
                    reportRequests: [{
                        viewId: integration.config.propertyId,
                        dateRanges: [{ startDate, endDate }],
                        metrics: [
                            { expression: 'ga:sessions' },
                            { expression: 'ga:users' },
                            { expression: 'ga:pageviews' },
                            { expression: 'ga:bounceRate' },
                            { expression: 'ga:avgSessionDuration' },
                        ],
                        dimensions: [
                            { name: 'ga:date' },
                            { name: 'ga:pagePath' },
                        ],
                    }],
                },
            });

            // Store traffic data
            if (response.data.reports?.[0]?.data?.rows) {
                for (const row of response.data.reports[0].data.rows) {
                    if (!row.dimensions || row.dimensions.length < 2) continue;
                    if (!row.metrics || !row.metrics[0] || !row.metrics[0].values || row.metrics[0].values.length < 5) continue;

                    const date = row.dimensions[0];
                    const page = row.dimensions[1];
                    const metrics = row.metrics[0].values;

                    await this.db.trafficData.upsert({
                        where: {
                            projectId_source_date_page: {
                                projectId: integration.projectId,
                                source: 'ga',
                                date: new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
                                page,
                            },
                        },
                        update: {
                            sessions: parseInt(metrics[0]) || 0,
                            users: parseInt(metrics[1]) || 0,
                            pageviews: parseInt(metrics[2]) || 0,
                            bounceRate: parseFloat(metrics[3]) || 0,
                            avgSessionDuration: parseFloat(metrics[4]) || 0,
                        },
                        create: {
                            projectId: integration.projectId,
                            source: 'ga',
                            date: new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
                            page,
                            sessions: parseInt(metrics[0]) || 0,
                            users: parseInt(metrics[1]) || 0,
                            pageviews: parseInt(metrics[2]) || 0,
                            bounceRate: parseFloat(metrics[3]) || 0,
                            avgSessionDuration: parseFloat(metrics[4]) || 0,
                        },
                    });
                }
            }

            // Update last sync
            await this.db.integration.update({
                where: { id: integration.id },
                data: { lastSync: new Date() },
            });

            return {
                message: 'GA data synced successfully',
                rows: response.data.reports?.[0]?.data?.rows?.length || 0
            };
        } catch (error) {
            throw new BadRequestException('Failed to sync GA data: ' + error.message);
        }
    }

    private encryptCredentials(credentials: any): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey.slice(0, 32), this.encryptionKey.slice(0, 16));
        let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    private decryptCredentials(encryptedCredentials: string): any {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey.slice(0, 32), this.encryptionKey.slice(0, 16));
        let decrypted = decipher.update(encryptedCredentials, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    async getGoogleAuthUrl() {
        const authUrl = this.googleOAuthClient.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/webmasters.readonly',
                'https://www.googleapis.com/auth/analytics.readonly',
            ],
        });

        return { authUrl };
    }
}
