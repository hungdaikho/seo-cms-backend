export const EmailTemplates = {
    getBaseTemplate(content: string, title: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6; 
                    color: #333; 
                    background-color: #f8fafc;
                }
                .email-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background-color: #ffffff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; 
                    padding: 30px 20px; 
                    text-align: center; 
                }
                .header h1 { 
                    font-size: 28px; 
                    font-weight: 600; 
                    margin-bottom: 8px;
                }
                .header p { 
                    font-size: 16px; 
                    opacity: 0.9;
                }
                .content { 
                    padding: 40px 30px; 
                    background-color: #ffffff; 
                }
                .button { 
                    display: inline-block; 
                    padding: 14px 28px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white !important; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    font-weight: 600;
                    text-align: center;
                    transition: transform 0.2s ease;
                }
                .button:hover {
                    transform: translateY(-2px);
                }
                .footer { 
                    padding: 30px 20px; 
                    text-align: center; 
                    color: #6b7280; 
                    font-size: 14px; 
                    background-color: #f9fafb;
                    border-top: 1px solid #e5e7eb;
                }
                .warning, .info { 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                }
                .warning { 
                    background-color: #fef3cd; 
                    border-left: 4px solid #f59e0b; 
                    color: #92400e;
                }
                .info { 
                    background-color: #dbeafe; 
                    border-left: 4px solid #3b82f6; 
                    color: #1e40af;
                }
                .feature-list {
                    list-style: none;
                    padding: 0;
                }
                .feature-list li {
                    padding: 12px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .feature-list li:last-child {
                    border-bottom: none;
                }
                .feature-icon {
                    display: inline-block;
                    width: 20px;
                    margin-right: 10px;
                }
                @media (max-width: 600px) {
                    .email-container { margin: 0 10px; }
                    .content { padding: 30px 20px; }
                    .header { padding: 25px 20px; }
                    .button { display: block; width: 100%; }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                ${content}
                <div class="footer">
                    <p><strong>SEO CMS Platform</strong></p>
                    <p>© 2025 SEO CMS. All rights reserved.</p>
                    <p style="margin-top: 15px;">
                        Need help? Contact us at <a href="mailto:support@seocms.com" style="color: #667eea;">support@seocms.com</a>
                    </p>
                    <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
                        This email was sent to you because you have an account with SEO CMS Platform.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
    },

    passwordReset(resetUrl: string): string {
        const content = `
            <div class="header">
                <h1>🔒 Password Reset</h1>
                <p>Secure your account with a new password</p>
            </div>
            <div class="content">
                <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
                <p style="margin-bottom: 20px;">We received a request to reset your password for your SEO CMS account.</p>
                <p style="margin-bottom: 30px;">Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Reset My Password</a>
                </div>
                
                <div class="warning">
                    <h4 style="margin-bottom: 10px;">⚠️ Important Security Information:</h4>
                    <ul style="margin-left: 20px;">
                        <li>This link will expire in <strong>1 hour</strong></li>
                        <li>The link can only be used <strong>once</strong></li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Your password will remain unchanged until you complete the reset</li>
                    </ul>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="word-break: break-all; color: #667eea; font-size: 14px; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                    ${resetUrl}
                </p>
            </div>
        `;
        return this.getBaseTemplate(content, 'Reset Your Password - SEO CMS');
    },

    emailVerification(verificationUrl: string): string {
        const content = `
            <div class="header">
                <h1>✨ Welcome to SEO CMS!</h1>
                <p>Verify your email to get started</p>
            </div>
            <div class="content">
                <h2 style="color: #1f2937; margin-bottom: 20px;">Verify Your Email Address</h2>
                <p style="margin-bottom: 20px;">Thank you for joining SEO CMS! We're excited to have you on board.</p>
                <p style="margin-bottom: 30px;">To complete your registration and access all features, please verify your email address:</p>
                
                <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verify My Email</a>
                </div>
                
                <div class="info">
                    <h4 style="margin-bottom: 10px;">📋 What happens after verification?</h4>
                    <ul style="margin-left: 20px;">
                        <li>Full access to all SEO tools and features</li>
                        <li>Ability to create and manage projects</li>
                        <li>Access to keyword tracking and analysis</li>
                        <li>Detailed SEO audit reports</li>
                    </ul>
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                    If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="word-break: break-all; color: #667eea; font-size: 14px; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
                    ${verificationUrl}
                </p>
                
                <p style="margin-top: 20px; font-size: 14px; color: #9ca3af;">
                    <strong>Note:</strong> This verification link will expire in 24 hours.
                </p>
            </div>
        `;
        return this.getBaseTemplate(content, 'Verify Your Email - SEO CMS');
    },

    welcome(name: string, dashboardUrl: string): string {
        const content = `
            <div class="header">
                <h1>🚀 Welcome Aboard!</h1>
                <p>Your SEO journey starts here</p>
            </div>
            <div class="content">
                <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}!</h2>
                <p style="margin-bottom: 30px; font-size: 16px;">
                    Welcome to SEO CMS Platform! We're thrilled to have you join our community of SEO professionals and digital marketers.
                </p>
                
                <h3 style="color: #1f2937; margin-bottom: 20px;">🎯 What you can do with SEO CMS:</h3>
                
                <ul class="feature-list">
                    <li><span class="feature-icon">🔍</span><strong>SEO Audits:</strong> Comprehensive website analysis with actionable recommendations</li>
                    <li><span class="feature-icon">📊</span><strong>Rank Tracking:</strong> Monitor your keyword positions across all major search engines</li>
                    <li><span class="feature-icon">🔗</span><strong>Backlink Analysis:</strong> Track and analyze your link profile for better authority</li>
                    <li><span class="feature-icon">🎯</span><strong>Keyword Research:</strong> Discover high-value keywords and content opportunities</li>
                    <li><span class="feature-icon">🏆</span><strong>Competitor Analysis:</strong> Stay ahead with detailed competitor insights</li>
                    <li><span class="feature-icon">📈</span><strong>Traffic Analytics:</strong> Understand your organic search performance</li>
                </ul>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${dashboardUrl}" class="button">Explore Your Dashboard</a>
                </div>
                
                <div class="info">
                    <h4 style="margin-bottom: 15px;">💡 Quick Start Tips:</h4>
                    <ol style="margin-left: 20px;">
                        <li>Create your first project by adding your website</li>
                        <li>Set up keyword tracking for your target terms</li>
                        <li>Run a comprehensive SEO audit</li>
                        <li>Explore competitor analysis tools</li>
                    </ol>
                </div>
                
                <p style="margin-top: 30px; text-align: center; color: #6b7280;">
                    Questions? Our support team is here to help you succeed!
                </p>
            </div>
        `;
        return this.getBaseTemplate(content, 'Welcome to SEO CMS Platform!');
    }
};
