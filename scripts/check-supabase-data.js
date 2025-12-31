const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔍 CHECKING SUPABASE DATA\n');

    await page.goto('https://luis-jobhunt-fvg3bdpvq-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('STEP 1: Fetch data from Supabase');
    const supabaseData = await page.evaluate(async () => {
        const url = 'https://dkufgfmwqsxecylyvidi.supabase.co';
        const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NjAxODMsImV4cCI6MjA0OTUzNjE4M30.sRjuUO41AoN9lqCWmRKjxVDN48rVWnNyIz8n2ShdHqE';

        try {
            const response = await fetch(`${url}/rest/v1/job_search_data?id=eq.main`, {
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`
                }
            });

            if (!response.ok) {
                return { error: `HTTP ${response.status}` };
            }

            const data = await response.json();

            return {
                hasData: data && data.length > 0,
                contacts: data[0]?.contacts?.length || 0,
                linkedinConversations: data[0]?.linkedin_conversations?.length || 0,
                applications: data[0]?.applications?.length || 0,
                progress: data[0]?.progress ? Object.keys(data[0].progress).length : 0
            };
        } catch (e) {
            return { error: e.message };
        }
    });

    console.log('Supabase data:', supabaseData);

    if (supabaseData.error) {
        console.log('\n❌ ERROR fetching from Supabase:', supabaseData.error);
    } else if (!supabaseData.hasData) {
        console.log('\n❌ NO DATA IN SUPABASE!');
    } else {
        console.log('\n✅ Data exists in Supabase:');
        console.log(`   Contacts: ${supabaseData.contacts}`);
        console.log(`   LinkedIn Conversations: ${supabaseData.linkedinConversations}`);
        console.log(`   Applications: ${supabaseData.applications}`);
        console.log(`   Progress entries: ${supabaseData.progress}`);

        if (supabaseData.linkedinConversations > 0) {
            console.log('\n🔄 LinkedIn conversations exist - should import to contacts!');
        }
    }

    console.log('\nSTEP 2: Check if SyncManager exists and is configured');
    const syncCheck = await page.evaluate(() => {
        return {
            exists: typeof SyncManager !== 'undefined',
            configured: typeof SyncManager !== 'undefined' && SyncManager.isConfigured ? SyncManager.isConfigured() : null,
            url: localStorage.getItem('supabaseUrl'),
            hasKey: !!localStorage.getItem('supabaseKey')
        };
    });
    console.log('SyncManager:', syncCheck);

    console.log('\nSTEP 3: Manually trigger loadFromCloud');
    const loadResult = await page.evaluate(async () => {
        if (typeof SyncManager === 'undefined') {
            return { error: 'SyncManager not defined' };
        }

        try {
            await SyncManager.loadFromCloud();

            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            return {
                success: true,
                contactsLoaded: contacts.length
            };
        } catch (e) {
            return { error: e.message };
        }
    });

    console.log('Load result:', loadResult);

    const finalContacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]').length;
    });
    console.log(`\nFinal contacts in localStorage: ${finalContacts}`);

    await page.screenshot({ path: '/tmp/supabase-check.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/supabase-check.png');

    console.log('\nBrowser stays open for 30 seconds...');
    await page.waitForTimeout(30000);

    await browser.close();
})();
