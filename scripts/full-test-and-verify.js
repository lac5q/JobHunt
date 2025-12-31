const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🧪 FULL INTEGRATION TEST\n');
    console.log('='.repeat(60));

    // STEP 1: Set up credentials in localStorage
    console.log('\nSTEP 1: Initialize Supabase credentials');
    await page.goto('file://' + __dirname + '/job-search-dashboard.html');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
        const SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

        localStorage.setItem('supabaseUrl', SUPABASE_URL);
        localStorage.setItem('supabaseKey', SUPABASE_KEY);
    });
    console.log('✓ Credentials saved to localStorage');

    // STEP 2: Reload page to trigger sync
    console.log('\nSTEP 2: Reload page to trigger Supabase sync');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Wait for cloud load

    // STEP 3: Check if contacts loaded
    console.log('\nSTEP 3: Check contacts loaded from Supabase');
    const contacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });
    console.log(`✓ Contacts in localStorage: ${contacts.length}`);

    if (contacts.length > 0) {
        console.log('  First 10:');
        contacts.slice(0, 10).forEach((c, i) => {
            console.log(`    ${i + 1}. ${c.name || `${c.firstName} ${c.lastName}`}`);
        });
    }

    // STEP 4: Navigate to Contacts tab
    console.log('\nSTEP 4: Navigate to Contacts tab');
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    // STEP 5: Check rendering
    console.log('\nSTEP 5: Verify contacts rendering');
    const rendered = await page.evaluate(() => {
        const cards = document.querySelectorAll('.contact-card');
        return {
            cardCount: cards.length,
            firstFiveNames: Array.from(cards).slice(0, 5).map(card => {
                const nameEl = card.querySelector('.contact-card-name');
                return nameEl ? nameEl.textContent.trim() : 'NO NAME';
            })
        };
    });

    console.log(`✓ Rendered contact cards: ${rendered.cardCount}`);
    if (rendered.firstFiveNames.length > 0) {
        console.log('  Showing:');
        rendered.firstFiveNames.forEach((name, i) => {
            const status = name.includes('undefined') ? '❌' : '✅';
            console.log(`    ${status} ${i + 1}. ${name}`);
        });
    }

    // STEP 6: Take screenshot
    await page.screenshot({ path: '/tmp/full-test-result.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/full-test-result.png');

    // STEP 7: Final verdict
    console.log('\n' + '='.repeat(60));
    console.log('RESULTS');
    console.log('='.repeat(60));

    const brokenNames = rendered.firstFiveNames.filter(n => n.includes('undefined')).length;

    if (contacts.length === 0) {
        console.log('❌ FAILED: No contacts loaded from Supabase');
    } else if (rendered.cardCount === 0) {
        console.log('❌ FAILED: Contacts in storage but not rendering');
        console.log(`   ${contacts.length} in storage, 0 rendered`);
    } else if (brokenNames > 0) {
        console.log('❌ FAILED: Contacts rendering with broken names');
        console.log(`   ${brokenNames}/${rendered.firstFiveNames.length} have undefined names`);
    } else {
        console.log('✅ SUCCESS! Everything working correctly');
        console.log(`   ${contacts.length} contacts loaded`);
        console.log(`   ${rendered.cardCount} contacts rendering`);
        console.log('   All names displaying correctly');
    }

    console.log('\nBrowser stays open for 30 seconds...');
    await page.waitForTimeout(30000);

    await browser.close();
})();
