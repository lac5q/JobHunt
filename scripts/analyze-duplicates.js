const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔍 ANALYZING DUPLICATES IN CRM\n');
    console.log('='.repeat(70));

    await page.goto('file://' + __dirname + '/job-search-dashboard.html');
    await page.waitForLoadState('networkidle');

    // Set up credentials
    await page.evaluate(() => {
        localStorage.setItem('supabaseUrl', 'https://dkufgfmwqsxecylyvidi.supabase.co');
        localStorage.setItem('supabaseKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g');
    });

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    const analysis = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');

        // Group by normalized name
        const nameGroups = {};
        contacts.forEach(c => {
            const name = (c.name || `${c.firstName} ${c.lastName}`).toLowerCase().trim();
            if (!nameGroups[name]) {
                nameGroups[name] = [];
            }
            nameGroups[name].push(c);
        });

        // Find duplicates
        const duplicates = {};
        Object.entries(nameGroups).forEach(([name, contacts]) => {
            if (contacts.length > 1) {
                duplicates[name] = contacts;
            }
        });

        // Analyze duplicate data
        const duplicateAnalysis = Object.entries(duplicates).map(([name, contacts]) => {
            const fields = {
                name: name,
                count: contacts.length,
                sources: [...new Set(contacts.map(c => c.source))],
                companies: [...new Set(contacts.map(c => c.company).filter(Boolean))],
                emails: [...new Set(contacts.map(c => c.email).filter(Boolean))],
                linkedInUrls: [...new Set(contacts.map(c => c.linkedInUrl || c.linkedin).filter(Boolean))],
                statuses: [...new Set(contacts.map(c => c.status))],
                hasOutreach: contacts.some(c => c.outreach && c.outreach.length > 0),
                totalOutreach: contacts.reduce((sum, c) => sum + (c.outreach?.length || 0), 0)
            };
            return fields;
        });

        return {
            total: contacts.length,
            unique: Object.keys(nameGroups).length,
            duplicateCount: Object.keys(duplicates).length,
            duplicates: duplicateAnalysis.sort((a, b) => b.count - a.count)
        };
    });

    console.log('\nSTATISTICS:');
    console.log(`Total contacts: ${analysis.total}`);
    console.log(`Unique names: ${analysis.unique}`);
    console.log(`Duplicate names: ${analysis.duplicateCount}`);
    console.log(`Wasted entries: ${analysis.total - analysis.unique}`);

    console.log('\n\nTOP DUPLICATES:');
    console.log('='.repeat(70));

    analysis.duplicates.slice(0, 15).forEach((dup, i) => {
        console.log(`\n${i + 1}. ${dup.name} (${dup.count} copies)`);
        console.log(`   Sources: ${dup.sources.join(', ')}`);
        console.log(`   Companies: ${dup.companies.length > 0 ? dup.companies.join(', ') : 'NONE'}`);
        console.log(`   Emails: ${dup.emails.length > 0 ? dup.emails.join(', ') : 'NONE'}`);
        console.log(`   LinkedIn: ${dup.linkedInUrls.length > 0 ? 'Yes' : 'No'}`);
        console.log(`   Outreach: ${dup.totalOutreach} entries across ${dup.count} copies`);
    });

    await page.screenshot({ path: '/tmp/duplicate-analysis.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/duplicate-analysis.png');

    console.log('\nBrowser stays open for 20 seconds...');
    await page.waitForTimeout(20000);

    await browser.close();
})();
