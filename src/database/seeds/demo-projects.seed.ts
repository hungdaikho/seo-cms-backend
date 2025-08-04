import { DatabaseService } from '../database.service';

export async function seedDemoProjects(databaseService: DatabaseService) {
    console.log('🏗️ Seeding demo projects...');

    // Get first user to assign projects to
    const user = await databaseService.user.findFirst();

    if (!user) {
        console.log('⚠️ No users found. Please create a user first.');
        return;
    }

    const demoProjects = [
        {
            name: 'SEO Master Pro',
            domain: 'seomaster.pro',
            ownerId: user.id,
        },
        {
            name: 'Content Marketing Hub',
            domain: 'contentmarketing.hub',
            ownerId: user.id,
        },
        {
            name: 'Digital Growth Labs',
            domain: 'digitalgrowth.labs',
            ownerId: user.id,
        },
    ];

    for (const projectData of demoProjects) {
        const existingProject = await databaseService.project.findFirst({
            where: { domain: projectData.domain },
        });

        if (!existingProject) {
            const project = await databaseService.project.create({
                data: projectData,
            });
            console.log(`✅ Created project: ${project.name} (${project.domain})`);
        } else {
            console.log(`⚠️ Project already exists: ${projectData.name}`);
        }
    }

    console.log('🏗️ Demo projects seeded successfully');
}
