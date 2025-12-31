const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔍 CHECKING LIVE DEPLOYED SITE\n');

    await page.goto('https://luis-jobhunt-fvg3bdpvq-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('STEP 1: Check localStorage contacts');
    const localContacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });
    console.log(`Total contacts in localStorage: ${localContacts.length}`);
    if (localContacts.length > 0) {
        console.log('First 10 names:', localContacts.slice(0, 10).map(c => c.name || `${c.firstName} ${c.lastName}`));
    }

    console.log('\nSTEP 2: Go to Contacts tab');
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    console.log('\nSTEP 3: Check filter states');
    const filterStates = await page.evaluate(() => {
        return {
            search: document.getElementById('search-contacts')?.value || '',
            statusFilter: document.getElementById('filter-status')?.value || '',
            sourceFilter: document.getElementById('filter-source')?.value || '',
            showNA: document.getElementById('filter-show-na')?.checked || false
        };
    });
    console.log('Filters:', filterStates);

    console.log('\nSTEP 4: Check rendered contacts');
    const renderedCount = await page.evaluate(() => {
        return document.querySelectorAll('.contact-card').length;
    });
    console.log(`Rendered contact cards: ${renderedCount}`);

    console.log('\nSTEP 5: Check filter logic');
    const filterAnalysis = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        const showNA = document.getElementById('filter-show-na').checked;

        const naCount = contacts.filter(c => c.isNA).length;
        const nonNACount = contacts.filter(c => !c.isNA).length;

        return {
            totalContacts: contacts.length,
            naCount,
            nonNACount,
            showNAChecked: showNA,
            shouldShow: showNA ? contacts.length : nonNACount
        };
    });
    console.log('Filter analysis:', filterAnalysis);

    // Take screenshot
    await page.screenshot({ path: '/tmp/live-site-check.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/live-site-check.png');

    console.log('\n' + '='.repeat(60));
    if (localContacts.length === 0) {
        console.log('❌ NO CONTACTS ON LIVE SITE EITHER!');
        console.log('   This means contacts were lost during sync or deployment');
    } else if (renderedCount === 0 && localContacts.length > 0) {
        console.log('❌ CONTACTS EXIST BUT NOT RENDERING!');
        console.log(`   Expected to show: ${filterAnalysis.shouldShow} contacts`);
        console.log(`   Actually showing: ${renderedCount} contacts`);
        console.log('   → Filter bug detected!');
    } else {
        console.log('✅ Live site working correctly');
    }
    console.log('='.repeat(60));

    console.log('\nBrowser stays open for 30 seconds...');
    await page.waitForTimeout(30000);

    await browser.close();
})();
