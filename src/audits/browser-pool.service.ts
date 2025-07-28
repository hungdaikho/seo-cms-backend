import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
import { Browser, Page } from 'puppeteer';

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

@Injectable()
export class BrowserPoolService implements OnApplicationShutdown {
    private readonly logger = new Logger(BrowserPoolService.name);
    private browsers: Browser[] = [];
    private readonly maxBrowsers = 3; // Limit concurrent browsers
    private readonly maxPagesPerBrowser = 5;
    private currentBrowserIndex = 0;
    private isInitialized = false;

    constructor() {
        this.initializeBrowserPool();
    }

    async onApplicationShutdown() {
        await this.closeAllBrowsers();
    }

    private async initializeBrowserPool(): Promise<void> {
        try {
            this.logger.log('Initializing browser pool...');

            // Create initial browser instance
            const browser = await this.createBrowser();
            this.browsers.push(browser);

            this.isInitialized = true;
            this.logger.log(`Browser pool initialized with ${this.browsers.length} browsers`);
        } catch (error) {
            this.logger.error('Failed to initialize browser pool:', error);
            throw error;
        }
    }

    private async createBrowser(): Promise<Browser> {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--window-size=1920,1080'
            ],
            defaultViewport: {
                width: 1920,
                height: 1080,
            },
        });

        // Handle browser disconnections
        browser.on('disconnected', () => {
            this.logger.warn('Browser disconnected, removing from pool');
            this.removeBrowser(browser);
        });

        return browser;
    }

    async getBrowser(): Promise<Browser> {
        if (!this.isInitialized) {
            await this.initializeBrowserPool();
        }

        // Clean up closed browsers
        this.browsers = this.browsers.filter(browser => browser.isConnected());

        // If no browsers available, create one
        if (this.browsers.length === 0) {
            const browser = await this.createBrowser();
            this.browsers.push(browser);
            return browser;
        }

        // Round-robin browser selection
        const browser = this.browsers[this.currentBrowserIndex % this.browsers.length];
        this.currentBrowserIndex = (this.currentBrowserIndex + 1) % this.browsers.length;

        // Check if browser is still connected
        if (!browser.isConnected()) {
            this.removeBrowser(browser);
            return this.getBrowser(); // Recursive call to get another browser
        }

        // Check if browser has too many pages open
        const pages = await browser.pages();
        if (pages.length > this.maxPagesPerBrowser) {
            // Close extra pages
            const pagesToClose = pages.slice(this.maxPagesPerBrowser);
            await Promise.all(pagesToClose.map(page => page.close().catch(() => { })));
        }

        return browser;
    }

    async getNewPage(): Promise<{ page: Page; browser: Browser }> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        // Set default page configurations
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 RankTracker/1.0');

        // Set viewport for consistent results
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });

        // Block unnecessary resources to speed up loading
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (['image', 'font', 'media'].includes(resourceType)) {
                request.abort();
            } else {
                request.continue();
            }
        });

        // Set timeouts
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);

        return { page, browser };
    }

    async getMobilePage(): Promise<{ page: Page; browser: Browser }> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        // Emulate mobile device
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1');
        await page.setViewport({
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
        });

        return { page, browser };
    }

    private removeBrowser(browserToRemove: Browser): void {
        this.browsers = this.browsers.filter(browser => browser !== browserToRemove);
        browserToRemove.close().catch(() => { });
    }

    async expandBrowserPool(): Promise<void> {
        if (this.browsers.length >= this.maxBrowsers) {
            return;
        }

        try {
            const browser = await this.createBrowser();
            this.browsers.push(browser);
            this.logger.log(`Browser pool expanded to ${this.browsers.length} browsers`);
        } catch (error) {
            this.logger.error('Failed to expand browser pool:', error);
        }
    }

    async closeAllBrowsers(): Promise<void> {
        this.logger.log('Closing all browsers in pool...');

        await Promise.all(
            this.browsers.map(async (browser) => {
                try {
                    await browser.close();
                } catch (error) {
                    this.logger.warn('Error closing browser:', error);
                }
            })
        );

        this.browsers = [];
        this.logger.log('All browsers closed');
    }

    getPoolStatus(): { totalBrowsers: number; activeBrowsers: number } {
        const activeBrowsers = this.browsers.filter(browser => browser.isConnected()).length;
        return {
            totalBrowsers: this.browsers.length,
            activeBrowsers,
        };
    }
}
