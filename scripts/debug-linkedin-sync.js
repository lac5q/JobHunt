const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to dashboard
    console.log('Opening dashboard...');
    await page.goto('https://luis-jobhunt-7flyauxj9-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');

    // Check if Supabase is configured
    const supabaseUrl = await page.evaluate(() => localStorage.getItem('supabaseUrl'));
    const supabaseKey = await page.evaluate(() => localStorage.getItem('supabaseKey'));
    console.log('Supabase configured:', !!supabaseUrl, !!supabaseKey);

    // Check localStorage contacts
    const localContacts = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        console.log('LocalStorage contacts:', contacts.length);
        if (contacts.length > 0) {
            console.log('First contact:', contacts[0]);
        }
        return contacts;
    });

    console.log('\n=== LocalStorage Contacts ===');
    console.log('Total:', localContacts.length);
    if (localContacts.length > 0) {
        console.log('Sample contact:', JSON.stringify(localContacts[0], null, 2));
    }

    // Fetch Supabase data directly
    console.log('\n=== Fetching from Supabase ===');
    const supabaseData = await page.evaluate(async () => {
        const url = localStorage.getItem('supabaseUrl');
        const key = localStorage.getItem('supabaseKey');

        const response = await fetch(`${url}/rest/v1/job_search_data?id=eq.main`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        const data = await response.json();
        const linkedinConversations = data[0]?.linkedin_conversations || [];

        console.log('LinkedIn conversations from Supabase:', linkedinConversations.length);
        if (linkedinConversations.length > 0) {
            console.log('First conversation:', linkedinConversations[0]);
        }

        return linkedinConversations;
    });

    console.log('Supabase LinkedIn conversations:', supabaseData.length);
    if (supabaseData.length > 0) {
        console.log('Sample conversation:', JSON.stringify(supabaseData[0], null, 2));
    }

    // Click Sync LinkedIn button
    console.log('\n=== Clicking Sync LinkedIn ===');

    // Wait for Contacts tab
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    // Click Sync LinkedIn button
    const syncButton = await page.locator('button:has-text("Sync LinkedIn")').first();
    if (await syncButton.isVisible()) {
        console.log('Clicking Sync LinkedIn button...');
        await syncButton.click();
        await page.waitForTimeout(3000); // Wait for sync
    } else {
        console.log('Sync LinkedIn button not found');
    }

    // Check localStorage contacts again after sync
    const contactsAfterSync = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        console.log('Contacts after sync:', contacts.length);
        return contacts;
    });

    console.log('\n=== After Sync ===');
    console.log('Total contacts:', contactsAfterSync.length);
    if (contactsAfterSync.length > 0) {
        console.log('First 3 contacts:');
        contactsAfterSync.slice(0, 3).forEach((c, i) => {
            console.log(`${i + 1}. Name: "${c.name}" | Company: "${c.company}" | Status: "${c.status}"`);
        });
    }

    // Check console for errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Browser error:', msg.text());
        }
    });

    // Take screenshot
    await page.screenshot({ path: '/tmp/dashboard-debug.png', fullPage: true });
    console.log('\nScreenshot saved to /tmp/dashboard-debug.png');

    // Keep browser open for inspection
    console.log('\nBrowser will stay open for 30 seconds for inspection...');
    await page.waitForTimeout(30000);

    await browser.close();
})();
