import { DatabaseService } from '../src/database/database.service';
import { seedSubscriptionPlans } from '../src/database/seeds/subscription-plans.seed';

async function main() {
    const databaseService = new DatabaseService();

    try {
        await databaseService.$connect();
        console.log('🔗 Connected to database');

        // Seed subscription plans
        await seedSubscriptionPlans(databaseService);

        console.log('✅ Database seeded successfully');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await databaseService.$disconnect();
    }
}

main();
