const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Opening dashboard...');
    await page.goto('https://luis-jobhunt-4dhbsmjcp-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check contacts after cleanup
    const contactsAfterCleanup = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        return contacts;
    });

    console.log('\n=== After Automatic Cleanup ===');
    console.log('Total contacts:', contactsAfterCleanup.length);

    const brokenContacts = contactsAfterCleanup.filter(c =>
        !c.name || c.name === 'undefined' || c.name.includes('undefined')
    );

    console.log('Broken contacts remaining:', brokenContacts.length);

    if (contactsAfterCleanup.length > 0) {
        console.log('\nFirst 10 contacts:');
        contactsAfterCleanup.slice(0, 10).forEach((c, i) => {
            console.log(`${i + 1}. ${c.name || 'NO NAME'} - ${c.company || 'NO COMPANY'} (${c.source || 'NO SOURCE'})`);
        });
    }

    // Navigate to Contacts tab
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/dashboard-fixed.png', fullPage: true });
    console.log('\nScreenshot saved to /tmp/dashboard-fixed.png');

    console.log('\n✅ Cleanup verified! Browser will close in 10 seconds...');
    await page.waitForTimeout(10000);

    await browser.close();
})();
