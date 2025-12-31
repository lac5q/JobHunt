const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔧 TESTING CONTACT RESTORATION\n');

    await page.goto('file://' + __dirname + '/job-search-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('STEP 1: Check Supabase credentials');
    const creds = await page.evaluate(() => {
        return {
            url: localStorage.getItem('supabaseUrl'),
            hasKey: !!localStorage.getItem('supabaseKey')
        };
    });
    console.log('Supabase URL:', creds.url);
    console.log('Has API key:', creds.hasKey);

    console.log('\nSTEP 2: Check if SyncManager initialized');
    const syncStatus = await page.evaluate(() => {
        if (typeof SyncManager === 'undefined') return { error: 'Not defined' };

        return {
            configured: SyncManager.isConfigured(),
            url: SyncManager.supabaseUrl,
            hasDefaults: !!(SyncManager.DEFAULT_SUPABASE_URL && SyncManager.DEFAULT_SUPABASE_KEY)
        };
    });
    console.log('SyncManager:', syncStatus);

    console.log('\nSTEP 3: Wait for initial cloud load');
    await page.waitForTimeout(3000);

    const contactsAfterLoad = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });
    console.log(`Contacts loaded from Supabase: ${contactsAfterLoad.length}`);

    if (contactsAfterLoad.length > 0) {
        console.log('First 10:', contactsAfterLoad.slice(0, 10).map(c => c.name || `${c.firstName} ${c.lastName}`));
    }

    console.log('\nSTEP 4: Go to Contacts tab and check rendering');
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    const rendered = await page.evaluate(() => {
        return document.querySelectorAll('.contact-card').length;
    });
    console.log(`Rendered contacts: ${rendered}`);

    const filterState = await page.evaluate(() => {
        return {
            showNA: document.getElementById('filter-show-na')?.checked
        };
    });
    console.log('Show NA filter:', filterState.showNA);

    await page.screenshot({ path: '/tmp/restoration-test.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/restoration-test.png');

    console.log('\n' + '='.repeat(60));
    if (contactsAfterLoad.length === 0) {
        console.log('❌ STILL NO CONTACTS - Supabase sync failed');
    } else if (rendered === 0 && contactsAfterLoad.length > 0) {
        console.log('❌ CONTACTS IN STORAGE BUT NOT RENDERING');
        console.log(`   ${contactsAfterLoad.length} in storage, ${rendered} rendered`);
    } else {
        console.log('✅ SUCCESS! Contacts restored and rendering');
        console.log(`   ${contactsAfterLoad.length} contacts loaded`);
        console.log(`   ${rendered} contacts visible`);
    }
    console.log('='.repeat(60));

    console.log('\nBrowser stays open for 30 seconds...');
    await page.waitForTimeout(30000);

    await browser.close();
})();
