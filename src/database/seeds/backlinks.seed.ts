import { DatabaseService } from '../database.service';
import { LinkType } from '@prisma/client';

export async function seedBacklinks(databaseService: DatabaseService) {
    console.log('🔗 Seeding backlinks...');

    // Get existing projects to link backlinks to
    const projects = await databaseService.project.findMany({
        take: 3, // Seed for first 3 projects
    });

    if (projects.length === 0) {
        console.log('⚠️ No projects found. Please seed projects first.');
        return;
    }

    // Realistic authority domains and their scores
    const authorityDomains = [
        { domain: 'techcrunch.com', authority: 92 },
        { domain: 'mashable.com', authority: 87 },
        { domain: 'forbes.com', authority: 95 },
        { domain: 'entrepreneur.com', authority: 84 },
        { domain: 'hubspot.com', authority: 89 },
        { domain: 'moz.com', authority: 86 },
        { domain: 'searchengineland.com', authority: 83 },
        { domain: 'semrush.com', authority: 88 },
        { domain: 'ahrefs.com', authority: 85 },
        { domain: 'backlinko.com', authority: 79 },
        { domain: 'neilpatel.com', authority: 82 },
        { domain: 'contentmarketinginstitute.com', authority: 78 },
        { domain: 'copyblogger.com', authority: 75 },
        { domain: 'quicksprout.com', authority: 73 },
        { domain: 'socialmediaexaminer.com', authority: 77 },
        { domain: 'buffer.com', authority: 81 },
        { domain: 'hootsuite.com', authority: 80 },
        { domain: 'sproutsocial.com', authority: 76 },
        { domain: 'salesforce.com', authority: 93 },
        { domain: 'marketo.com', authority: 74 },
        { domain: 'mailchimp.com', authority: 83 },
        { domain: 'constantcontact.com', authority: 71 },
        { domain: 'wistia.com', authority: 72 },
        { domain: 'vimeo.com', authority: 85 },
        { domain: 'medium.com', authority: 90 },
        { domain: 'dev.to', authority: 68 },
        { domain: 'hackernoon.com', authority: 69 },
        { domain: 'producthunt.com', authority: 78 },
        { domain: 'github.com', authority: 96 },
        { domain: 'stackoverflow.com', authority: 91 },
        { domain: 'reddit.com', authority: 94 },
        { domain: 'quora.com', authority: 87 },
        { domain: 'linkedin.com', authority: 97 },
        { domain: 'twitter.com', authority: 99 },
        { domain: 'facebook.com', authority: 100 },
        { domain: 'youtube.com', authority: 100 },
        { domain: 'wikipedia.org', authority: 98 },
        { domain: 'bbc.com', authority: 95 },
        { domain: 'cnn.com', authority: 93 },
        { domain: 'theguardian.com', authority: 92 },
        { domain: 'nytimes.com', authority: 96 },
        { domain: 'wsj.com', authority: 94 },
        { domain: 'reuters.com', authority: 90 },
        { domain: 'bloomberg.com', authority: 91 },
        { domain: 'techradar.com', authority: 74 },
        { domain: 'cnet.com', authority: 82 },
        { domain: 'wired.com', authority: 85 },
        { domain: 'theverge.com', authority: 83 },
        { domain: 'engadget.com', authority: 79 },
        { domain: 'gizmodo.com', authority: 76 },
        { domain: 'lifehacker.com', authority: 77 }
    ];

    // Common anchor texts for SEO/marketing content
    const anchorTexts = [
        'SEO tools',
        'best SEO software',
        'keyword research',
        'digital marketing platform',
        'rank tracking tool',
        'backlink analysis',
        'content optimization',
        'website audit',
        'competitor analysis',
        'SERP tracking',
        'link building tools',
        'organic traffic growth',
        'search engine optimization',
        'marketing analytics',
        'SEO reporting',
        'technical SEO',
        'local SEO',
        'mobile SEO',
        'voice search optimization',
        'schema markup',
        'page speed optimization',
        'core web vitals',
        'on-page SEO',
        'off-page SEO',
        'white hat SEO',
        'SEO audit tool',
        'keyword difficulty',
        'search volume',
        'ranking factors',
        'algorithm updates',
        'Google Search Console',
        'Google Analytics',
        'conversion optimization',
        'user experience',
        'bounce rate optimization',
        'click-through rate',
        'meta descriptions',
        'title tags',
        'header optimization',
        'internal linking',
        'sitemap optimization',
        'robots.txt',
        'canonical URLs',
        'duplicate content',
        'content marketing',
        'blog optimization',
        'featured snippets',
        'rich snippets',
        'knowledge graph',
        'local business SEO'
    ];

    // Target pages for each project
    const getTargetPages = (projectDomain: string) => [
        `https://${projectDomain}/`,
        `https://${projectDomain}/seo-tools`,
        `https://${projectDomain}/keyword-research`,
        `https://${projectDomain}/rank-tracking`,
        `https://${projectDomain}/backlink-analysis`,
        `https://${projectDomain}/competitor-analysis`,
        `https://${projectDomain}/website-audit`,
        `https://${projectDomain}/content-optimization`,
        `https://${projectDomain}/local-seo`,
        `https://${projectDomain}/technical-seo`,
        `https://${projectDomain}/blog/seo-guide`,
        `https://${projectDomain}/blog/link-building`,
        `https://${projectDomain}/blog/content-marketing`,
        `https://${projectDomain}/features`,
        `https://${projectDomain}/pricing`,
        `https://${projectDomain}/about`,
        `https://${projectDomain}/contact`,
        `https://${projectDomain}/case-studies`,
        `https://${projectDomain}/resources`,
        `https://${projectDomain}/documentation`
    ];

    const backlinksToCreate: Array<{
        projectId: string;
        sourceDomain: string;
        targetUrl: string;
        anchorText: string | null;
        linkType: LinkType;
        authorityScore: number;
        isActive: boolean;
        discoveredAt: Date;
    }> = [];

    for (const project of projects) {
        const targetPages = getTargetPages(project.domain);
        const numBacklinks = Math.floor(Math.random() * 100) + 50; // 50-150 backlinks per project

        for (let i = 0; i < numBacklinks; i++) {
            const randomDomain = authorityDomains[Math.floor(Math.random() * authorityDomains.length)];
            const randomTargetPage = targetPages[Math.floor(Math.random() * targetPages.length)];
            const randomAnchor = Math.random() > 0.3 ? anchorTexts[Math.floor(Math.random() * anchorTexts.length)] : null;

            // Generate realistic discovery dates over the past 360 days
            const daysAgo = Math.floor(Math.random() * 360);
            const discoveredAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

            // 85% follow, 15% nofollow (realistic ratio)
            const linkType = Math.random() < 0.85 ? LinkType.follow : LinkType.nofollow;

            // 95% active links (some may be lost over time)
            const isActive = Math.random() < 0.95;

            // Add some variation to authority scores (-5 to +5)
            const authorityVariation = Math.floor(Math.random() * 11) - 5;
            const finalAuthority = Math.max(1, Math.min(100, randomDomain.authority + authorityVariation));

            backlinksToCreate.push({
                projectId: project.id,
                sourceDomain: randomDomain.domain,
                targetUrl: randomTargetPage,
                anchorText: randomAnchor,
                linkType: linkType,
                authorityScore: finalAuthority,
                isActive: isActive,
                discoveredAt: discoveredAt,
            });
        }
    }

    // Check for existing backlinks to avoid duplicates
    const existingBacklinks = await databaseService.backlink.findMany({
        select: {
            projectId: true,
            sourceDomain: true,
            targetUrl: true,
        },
    });

    const existingKeys = new Set(
        existingBacklinks.map(bl => `${bl.projectId}-${bl.sourceDomain}-${bl.targetUrl}`)
    );

    // Filter out duplicates
    const uniqueBacklinks = backlinksToCreate.filter(bl =>
        !existingKeys.has(`${bl.projectId}-${bl.sourceDomain}-${bl.targetUrl}`)
    );

    if (uniqueBacklinks.length === 0) {
        console.log('⚠️ All backlinks already exist, skipping...');
        return;
    }

    // Batch create backlinks
    const batchSize = 100;
    let created = 0;

    for (let i = 0; i < uniqueBacklinks.length; i += batchSize) {
        const batch = uniqueBacklinks.slice(i, i + batchSize);

        try {
            await databaseService.backlink.createMany({
                data: batch,
                skipDuplicates: true,
            });
            created += batch.length;
            console.log(`📊 Created ${batch.length} backlinks (${created}/${uniqueBacklinks.length})`);
        } catch (error) {
            console.error(`❌ Error creating batch ${i / batchSize + 1}:`, error);
        }
    }

    console.log(`✅ Successfully seeded ${created} backlinks across ${projects.length} projects`);

    // Print summary for each project
    for (const project of projects) {
        const projectBacklinks = await databaseService.backlink.count({
            where: { projectId: project.id },
        });

        const activeBacklinks = await databaseService.backlink.count({
            where: { projectId: project.id, isActive: true },
        });

        const avgAuthority = await databaseService.backlink.aggregate({
            where: {
                projectId: project.id,
                authorityScore: { not: null },
            },
            _avg: {
                authorityScore: true,
            },
        });

        console.log(`📈 Project "${project.name}": ${projectBacklinks} total backlinks, ${activeBacklinks} active, avg authority: ${avgAuthority._avg.authorityScore?.toFixed(1) || 'N/A'}`);
    }
}
