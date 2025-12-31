const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🔧 FORCE FIXING LinkedIn Contacts...\n');

    await page.goto('https://luis-jobhunt-4dhbsmjcp-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // STEP 1: Clear ALL broken contacts
    console.log('STEP 1: Clearing broken contacts...');
    await page.evaluate(() => {
        localStorage.removeItem('jobSearchContacts');
        console.log('✓ Cleared localStorage contacts');
    });

    // STEP 2: Fetch LinkedIn conversations from Supabase directly
    console.log('\nSTEP 2: Fetching LinkedIn conversations from Supabase...');
    const linkedinData = await page.evaluate(async () => {
        const url = 'https://dkufgfmwqsxecylyvidi.supabase.co';
        const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

        const response = await fetch(`${url}/rest/v1/job_search_data?id=eq.main`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        const data = await response.json();
        return data[0]?.linkedin_conversations || [];
    });

    console.log(`✓ Fetched ${linkedinData.length} LinkedIn conversations`);

    // STEP 3: Convert to proper contact format and save
    console.log('\nSTEP 3: Converting to contacts...');
    const contacts = await page.evaluate((conversations) => {
        const newContacts = conversations.map((conv, index) => {
            const contactName = conv.contactName || `Contact ${index + 1}`;

            return {
                id: conv.id || `linkedin-${Date.now()}-${index}`,
                name: contactName,
                company: '',
                title: '',
                email: '',
                linkedin: conv.url || '',
                linkedInUrl: conv.url || '',
                source: 'linkedin',
                status: 'contacted',
                addedDate: conv.timestamp || conv.syncedAt || new Date().toISOString(),
                lastContact: conv.timestamp || conv.syncedAt || new Date().toISOString(),
                notes: `LinkedIn: ${conv.lastMessage || '(No message)'}`,
                outreach: [{
                    type: 'linkedin',
                    date: conv.timestamp || conv.syncedAt || new Date().toISOString(),
                    notes: conv.lastMessage || '(No message)'
                }]
            };
        });

        // Save to localStorage
        localStorage.setItem('jobSearchContacts', JSON.stringify(newContacts));
        console.log(`✓ Saved ${newContacts.length} contacts to localStorage`);

        return newContacts;
    }, linkedinData);

    console.log(`✓ Created ${contacts.length} valid contacts`);
    console.log('\nFirst 5 contacts:');
    contacts.slice(0, 5).forEach((c, i) => {
        console.log(`  ${i + 1}. ${c.name} (${c.source})`);
    });

    // STEP 4: Reload page
    console.log('\nSTEP 4: Reloading page...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // STEP 5: Navigate to Contacts tab
    console.log('\nSTEP 5: Opening Contacts tab...');
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    // STEP 6: Verify
    const finalContacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });

    console.log('\n' + '='.repeat(50));
    console.log('✅ FINAL RESULT');
    console.log('='.repeat(50));
    console.log(`Total contacts: ${finalContacts.length}`);
    console.log(`Valid names: ${finalContacts.filter(c => c.name && !c.name.includes('undefined')).length}`);
    console.log(`Broken: ${finalContacts.filter(c => !c.name || c.name.includes('undefined')).length}`);

    // Take screenshot
    await page.screenshot({ path: '/tmp/fixed-contacts.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/fixed-contacts.png');

    console.log('\n🎉 DONE! Check your dashboard now.');
    console.log('Browser will stay open for 15 seconds...\n');

    await page.waitForTimeout(15000);
    await browser.close();
})();
