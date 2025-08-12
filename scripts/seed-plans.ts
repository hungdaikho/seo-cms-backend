import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSubscriptionPlans() {
    console.log('🌱 Seeding subscription plans...');

    const plans = [
        {
            name: 'Free Trial',
            slug: 'trial',
            description: 'Free trial with basic features',
            price: 0,
            yearlyPrice: 0,
            currency: 'USD',
            features: {
                projects: 1,
                keywords: 50,
                audits: 1,
                competitors: 3,
                api_requests: 10,
                support: 'email'
            },
            limits: {
                projects: 1,
                keywords_tracking: 50,
                api_requests_daily: 10,
                api_requests_monthly: 300,
                audits_monthly: 1,
                competitors_tracking: 3,
                backlinks_monitoring: 100
            },
            isActive: true,
            sortOrder: 1
        },
        {
            name: 'Starter',
            slug: 'starter',
            description: 'Perfect for small businesses and freelancers',
            price: 29.99,
            yearlyPrice: 299.99,
            currency: 'USD',
            features: {
                projects: 5,
                keywords: 500,
                audits: 10,
                competitors: 10,
                api_requests: 50,
                support: 'email',
                reports: 'basic'
            },
            limits: {
                projects: 5,
                keywords_tracking: 500,
                api_requests_daily: 50,
                api_requests_monthly: 1500,
                audits_monthly: 10,
                competitors_tracking: 10,
                backlinks_monitoring: 1000
            },
            isActive: true,
            sortOrder: 2
        },
        {
            name: 'Professional',
            slug: 'professional',
            description: 'Ideal for growing businesses and agencies',
            price: 79.99,
            yearlyPrice: 799.99,
            currency: 'USD',
            features: {
                projects: 25,
                keywords: 2500,
                audits: 50,
                competitors: 25,
                api_requests: 200,
                support: 'priority',
                reports: 'advanced',
                white_label: true
            },
            limits: {
                projects: 25,
                keywords_tracking: 2500,
                api_requests_daily: 200,
                api_requests_monthly: 6000,
                audits_monthly: 50,
                competitors_tracking: 25,
                backlinks_monitoring: 10000
            },
            isActive: true,
            sortOrder: 3
        },
        {
            name: 'Agency',
            slug: 'agency',
            description: 'For large agencies and enterprises',
            price: 199.99,
            yearlyPrice: 1999.99,
            currency: 'USD',
            features: {
                projects: 100,
                keywords: 10000,
                audits: 200,
                competitors: 100,
                api_requests: 1000,
                support: 'dedicated',
                reports: 'custom',
                white_label: true,
                multi_user: true,
                custom_integrations: true
            },
            limits: {
                projects: 100,
                keywords_tracking: 10000,
                api_requests_daily: 1000,
                api_requests_monthly: 30000,
                audits_monthly: 200,
                competitors_tracking: 100,
                backlinks_monitoring: 100000
            },
            isActive: true,
            sortOrder: 4
        }
    ];

    for (const planData of plans) {
        const existingPlan = await prisma.subscriptionPlan.findUnique({
            where: { slug: planData.slug }
        });

        if (!existingPlan) {
            await prisma.subscriptionPlan.create({
                data: planData
            });
            console.log(`✅ Created plan: ${planData.name}`);
        } else {
            console.log(`⚠️  Plan already exists: ${planData.name}`);
        }
    }
}

async function main() {
    try {
        await seedSubscriptionPlans();
        console.log('🎉 Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

if (require.main === module) {
    main();
}

export { seedSubscriptionPlans };
