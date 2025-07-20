import { DatabaseService } from '../database.service';

export async function seedSubscriptionPlans(databaseService: DatabaseService) {
    const plans = [
        {
            name: 'Free Trial',
            slug: 'trial',
            description: '14-day free trial with full Pro features',
            price: 0.00,
            yearlyPrice: 0.00,
            currency: 'USD',
            features: [
                'Full Pro features for 14 days',
                'Up to 50 keywords tracking',
                'Up to 3 competitors',
                'Daily ranking updates',
                'Complete SEO audits',
                'Email support'
            ],
            limits: {
                projects: 5,
                keywords_tracking: 50,
                api_requests_daily: 100,
                api_requests_monthly: 3000,
                audits_monthly: 5,
                competitors_tracking: 3,
                backlinks_monitoring: 1000
            },
            isActive: true,
            sortOrder: 0,
        },
        {
            name: 'Free',
            slug: 'free',
            description: 'Basic SEO tracking for small websites',
            price: 0.00,
            yearlyPrice: 0.00,
            currency: 'USD',
            features: [
                '1 project',
                '25 keywords tracking',
                'Basic reports',
                'Community support'
            ],
            limits: {
                projects: 1,
                keywords_tracking: 25,
                api_requests_daily: 10,
                api_requests_monthly: 300,
                audits_monthly: 1,
                competitors_tracking: 1,
                backlinks_monitoring: 100
            },
            isActive: true,
            sortOrder: 1,
        },
        {
            name: 'Starter',
            slug: 'starter',
            description: 'Perfect for small businesses and bloggers',
            price: 29.00,
            yearlyPrice: 23.20, // 20% discount
            currency: 'USD',
            features: [
                '5 projects',
                '250 keywords tracking',
                'Weekly reports',
                'Email support',
                'Basic competitor analysis'
            ],
            limits: {
                projects: 5,
                keywords_tracking: 250,
                api_requests_daily: 50,
                api_requests_monthly: 1500,
                audits_monthly: 3,
                competitors_tracking: 3,
                backlinks_monitoring: 500
            },
            isActive: true,
            sortOrder: 2,
        },
        {
            name: 'Professional',
            slug: 'professional',
            description: 'Advanced SEO tools for growing businesses',
            price: 79.00,
            yearlyPrice: 63.20, // 20% discount
            currency: 'USD',
            features: [
                '15 projects',
                '1,000 keywords tracking',
                'Daily reports',
                'Advanced competitor analysis',
                'Priority email support',
                'Custom integrations'
            ],
            limits: {
                projects: 15,
                keywords_tracking: 1000,
                api_requests_daily: 200,
                api_requests_monthly: 6000,
                audits_monthly: 10,
                competitors_tracking: 10,
                backlinks_monitoring: 2000
            },
            isActive: true,
            sortOrder: 3,
        },
        {
            name: 'Agency',
            slug: 'agency',
            description: 'Enterprise solution for agencies and large businesses',
            price: 159.00,
            yearlyPrice: 127.20, // 20% discount
            currency: 'USD',
            features: [
                '50 projects',
                '5,000 keywords tracking',
                'White-label reports',
                'Priority support',
                'Custom branding',
                'API access',
                'Team collaboration'
            ],
            limits: {
                projects: 50,
                keywords_tracking: 5000,
                api_requests_daily: 1000,
                api_requests_monthly: 30000,
                audits_monthly: 50,
                competitors_tracking: 50,
                backlinks_monitoring: 10000
            },
            isActive: true,
            sortOrder: 4,
        },
    ];

    for (const plan of plans) {
        await databaseService.subscriptionPlan.upsert({
            where: { slug: plan.slug },
            update: plan,
            create: plan,
        });
    }

    console.log('Subscription plans seeded successfully');
}
