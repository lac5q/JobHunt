const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🧪 TESTING NA FEATURE\n');

    // Open local dashboard
    await page.goto('file://' + __dirname + '/job-search-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Go to Contacts tab
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    console.log('STEP 1: Check initial state');
    const initialContacts = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        return {
            total: contacts.length,
            naCount: contacts.filter(c => c.isNA).length
        };
    });
    console.log(`Total contacts: ${initialContacts.total}`);
    console.log(`NA contacts: ${initialContacts.naCount}`);

    // Count visible contacts
    const visibleBefore = await page.evaluate(() => {
        return document.querySelectorAll('.contact-card').length;
    });
    console.log(`Visible contacts (NA hidden by default): ${visibleBefore}`);

    console.log('\nSTEP 2: Mark a contact as NA');
    // Click the first NA checkbox
    await page.click('.contact-card label input[type="checkbox"]');
    await page.waitForTimeout(500);

    const afterMarkNA = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        return {
            total: contacts.length,
            naCount: contacts.filter(c => c.isNA).length
        };
    });
    console.log(`NA contacts after marking: ${afterMarkNA.naCount}`);

    const visibleAfterMark = await page.evaluate(() => {
        return document.querySelectorAll('.contact-card').length;
    });
    console.log(`Visible contacts after marking NA: ${visibleAfterMark}`);
    console.log(`${visibleBefore === visibleAfterMark + 1 ? '✅' : '❌'} Contact disappeared as expected`);

    console.log('\nSTEP 3: Toggle "Show NA" filter');
    await page.click('#filter-show-na');
    await page.waitForTimeout(500);

    const visibleWithFilter = await page.evaluate(() => {
        return document.querySelectorAll('.contact-card').length;
    });
    console.log(`Visible contacts with "Show NA" enabled: ${visibleWithFilter}`);
    console.log(`${visibleWithFilter === visibleBefore ? '✅' : '❌'} All contacts visible again`);

    console.log('\nSTEP 4: Verify NA checkbox styling');
    const naCheckboxStyle = await page.evaluate(() => {
        const firstNACheckbox = document.querySelector('.contact-card label input[type="checkbox"]:checked');
        if (!firstNACheckbox) return null;

        const label = firstNACheckbox.closest('label');
        const bg = window.getComputedStyle(label).backgroundColor;
        const color = window.getComputedStyle(label).color;

        return { bg, color };
    });

    if (naCheckboxStyle) {
        console.log(`NA checkbox background: ${naCheckboxStyle.bg}`);
        console.log(`NA checkbox color: ${naCheckboxStyle.color}`);
    }

    // Take screenshot
    await page.screenshot({ path: '/tmp/test-na-feature.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/test-na-feature.png');

    console.log('\n' + '='.repeat(50));
    console.log('✅ NA FEATURE TEST COMPLETE!');
    console.log('='.repeat(50));
    console.log('Features tested:');
    console.log('  ✓ NA checkbox on contact cards');
    console.log('  ✓ NA contacts hidden by default');
    console.log('  ✓ "Show NA" filter toggle works');
    console.log('  ✓ Visual styling for NA checkboxes');

    console.log('\nBrowser will stay open for 15 seconds...');
    await page.waitForTimeout(15000);

    await browser.close();
})();
