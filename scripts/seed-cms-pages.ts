import { PrismaClient, PageType, PageStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCmsPages() {
  console.log('🌱 Seeding CMS pages...');

  const defaultPages = [
    {
      title: 'About Us',
      slug: 'about-us',
      pageType: PageType.about_us,
      content: `
        <h2>About RankTracker Pro</h2>
        <p>RankTracker Pro is a comprehensive SEO management platform designed to help businesses and digital marketers track their search engine rankings, analyze competitors, and optimize their online presence.</p>
        
        <h3>Our Mission</h3>
        <p>We are committed to providing powerful, easy-to-use SEO tools that help our clients achieve better search engine visibility and drive organic traffic to their websites.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Real-time keyword rank tracking</li>
          <li>Comprehensive competitor analysis</li>
          <li>Website audit and optimization recommendations</li>
          <li>Backlink monitoring and analysis</li>
          <li>Traffic analytics and reporting</li>
          <li>AI-powered content optimization</li>
        </ul>
        
        <h3>Why Choose Us</h3>
        <p>With years of experience in the SEO industry, our team understands the challenges businesses face in improving their online visibility. We've built RankTracker Pro to be the all-in-one solution you need to succeed in search.</p>
      `,
      excerpt:
        'Learn about RankTracker Pro and our mission to help businesses improve their search engine rankings.',
      metaTitle: 'About RankTracker Pro - SEO Management Platform',
      metaDescription:
        'Discover RankTracker Pro, the comprehensive SEO platform helping businesses track rankings, analyze competitors, and optimize their online presence.',
      metaKeywords:
        'SEO platform, rank tracking, competitor analysis, about us',
      status: PageStatus.published,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      pageType: PageType.privacy_policy,
      content: `
        <h2>Privacy Policy</h2>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
        
        <h4>Personal Information</h4>
        <ul>
          <li>Name and email address</li>
          <li>Company information</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Communication preferences</li>
        </ul>
        
        <h4>Usage Data</h4>
        <ul>
          <li>Information about how you use our service</li>
          <li>Log data and analytics</li>
          <li>Device and browser information</li>
        </ul>
        
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor and analyze trends and usage</li>
        </ul>
        
        <h3>3. Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.</p>
        
        <h3>4. Data Security</h3>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>5. Your Rights</h3>
        <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
        
        <h3>6. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@ranktrackerprp.com</p>
      `,
      excerpt:
        'Our privacy policy explains how we collect, use, and protect your personal information.',
      metaTitle: 'Privacy Policy - RankTracker Pro',
      metaDescription:
        'Read our privacy policy to understand how RankTracker Pro collects, uses, and protects your personal information.',
      metaKeywords: 'privacy policy, data protection, personal information',
      status: PageStatus.published,
    },
    {
      title: 'Legal Information',
      slug: 'legal-info',
      pageType: PageType.legal_info,
      content: `
        <h2>Legal Information</h2>
        
        <h3>Company Information</h3>
        <p>
          <strong>Company Name:</strong> RankTracker Pro Ltd.<br>
          <strong>Registration Number:</strong> 12345678<br>
          <strong>Address:</strong> 123 Business Street, Tech City, TC 12345<br>
          <strong>Email:</strong> legal@ranktrackerprp.com
        </p>
        
        <h3>Intellectual Property</h3>
        <p>All content, trademarks, and intellectual property on this website are owned by RankTracker Pro Ltd. or our licensors. Unauthorized use is prohibited.</p>
        
        <h3>Limitation of Liability</h3>
        <p>RankTracker Pro provides SEO tools and analytics "as is" without warranty. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
        
        <h3>Governing Law</h3>
        <p>These terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.</p>
        
        <h3>Copyright Notice</h3>
        <p>© 2025 RankTracker Pro Ltd. All rights reserved.</p>
      `,
      excerpt:
        'Legal information including company details, intellectual property, and liability terms.',
      metaTitle: 'Legal Information - RankTracker Pro',
      metaDescription:
        'Legal information for RankTracker Pro including company details, intellectual property rights, and terms.',
      metaKeywords: 'legal information, company details, intellectual property',
      status: PageStatus.published,
    },
    {
      title: 'Security Information',
      slug: 'security-info',
      pageType: PageType.security_info,
      content: `
        <h2>Security Information</h2>
        
        <h3>Data Protection</h3>
        <p>At RankTracker Pro, we take the security of your data seriously. We implement industry-standard security measures to protect your information.</p>
        
        <h3>Security Measures</h3>
        <ul>
          <li><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3</li>
          <li><strong>Secure Storage:</strong> Data at rest is encrypted using AES-256</li>
          <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
          <li><strong>Regular Audits:</strong> Regular security audits and penetration testing</li>
          <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
        </ul>
        
        <h3>Account Security</h3>
        <p>To keep your account secure:</p>
        <ul>
          <li>Use a strong, unique password</li>
          <li>Enable two-factor authentication</li>
          <li>Regularly review your account activity</li>
          <li>Log out from public computers</li>
          <li>Keep your contact information updated</li>
        </ul>
        
        <h3>Data Backup</h3>
        <p>We maintain regular backups of your data to ensure business continuity and disaster recovery.</p>
        
        <h3>Compliance</h3>
        <p>Our security practices comply with:</p>
        <ul>
          <li>GDPR (General Data Protection Regulation)</li>
          <li>SOC 2 Type II standards</li>
          <li>ISO 27001 information security management</li>
        </ul>
        
        <h3>Report Security Issues</h3>
        <p>If you discover a security vulnerability, please report it to security@ranktrackerprp.com</p>
      `,
      excerpt:
        'Information about our security measures and data protection practices.',
      metaTitle: 'Security Information - RankTracker Pro',
      metaDescription:
        "Learn about RankTracker Pro's security measures, data protection, and compliance standards.",
      metaKeywords: 'security, data protection, encryption, compliance',
      status: PageStatus.published,
    },
    {
      title: 'Contact Us',
      slug: 'contact-us',
      pageType: PageType.contact_us,
      content: `
        <h2>Contact Us</h2>
        <p>Get in touch with our team for support, sales inquiries, or general questions.</p>
        
        <h3>Support</h3>
        <p>Need help with your account or have technical questions?</p>
        <ul>
          <li><strong>Email:</strong> support@ranktrackerprp.com</li>
          <li><strong>Response Time:</strong> Within 24 hours</li>
          <li><strong>Available:</strong> Monday - Friday, 9 AM - 6 PM EST</li>
        </ul>
        
        <h3>Sales</h3>
        <p>Interested in our services or need a custom plan?</p>
        <ul>
          <li><strong>Email:</strong> sales@ranktrackerprp.com</li>
          <li><strong>Phone:</strong> +1 (555) 123-4567</li>
          <li><strong>Available:</strong> Monday - Friday, 8 AM - 8 PM EST</li>
        </ul>
        
        <h3>Business Address</h3>
        <p>
          RankTracker Pro Ltd.<br>
          123 Business Street<br>
          Tech City, TC 12345<br>
          United States
        </p>
        
        <h3>Contact Form</h3>
        <p>Use the form below to send us a message, and we'll get back to you as soon as possible.</p>
        
        <div id="contact-form-placeholder">
          <!-- Contact form will be rendered here by the frontend -->
        </div>
      `,
      excerpt: 'Contact information and support details for RankTracker Pro.',
      metaTitle: 'Contact Us - RankTracker Pro',
      metaDescription:
        'Contact RankTracker Pro for support, sales inquiries, or general questions. Multiple ways to reach our team.',
      metaKeywords: 'contact, support, sales, customer service',
      status: PageStatus.published,
    },
  ];

  for (const pageData of defaultPages) {
    try {
      const existingPage = await prisma.cmsPage.findUnique({
        where: { slug: pageData.slug },
      });

      if (!existingPage) {
        await prisma.cmsPage.create({
          data: {
            ...pageData,
            isSystem: true,
            sortOrder: defaultPages.indexOf(pageData),
          },
        });
        console.log(`✅ Created page: ${pageData.title}`);
      } else {
        console.log(`⏭️  Page already exists: ${pageData.title}`);
      }
    } catch (error) {
      console.error(`❌ Error creating page ${pageData.title}:`, error);
    }
  }

  console.log('✅ CMS pages seeding completed!');
}

// Run the seed function if called directly
if (require.main === module) {
  seedCmsPages()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedCmsPages };
