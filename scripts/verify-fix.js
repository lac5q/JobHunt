const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('✅ VERIFYING FIX ON LIVE SITE\n');

    await page.goto('https://luis-jobhunt-avlob2n0a-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Go to Contacts tab
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    // Check card view
    const cardNames = await page.evaluate(() => {
        const cards = document.querySelectorAll('.contact-card');
        return Array.from(cards).slice(0, 10).map(card => {
            const nameEl = card.querySelector('.contact-card-name');
            return nameEl ? nameEl.textContent.trim() : 'NOT FOUND';
        });
    });

    console.log('CARD VIEW (first 10):');
    cardNames.forEach((name, i) => {
        const status = name.includes('undefined') ? '❌' : '✅';
        console.log(`  ${status} ${i+1}. ${name}`);
    });

    // Switch to table view
    await page.click('button:has-text("Table View")');
    await page.waitForTimeout(500);

    const tableNames = await page.evaluate(() => {
        const rows = document.querySelectorAll('#contacts-table-body tr');
        return Array.from(rows).slice(0, 10).map(row => {
            const nameCell = row.querySelector('td:first-child strong');
            return nameCell ? nameCell.textContent.trim() : 'NOT FOUND';
        });
    });

    console.log('\nTABLE VIEW (first 10):');
    tableNames.forEach((name, i) => {
        const status = name.includes('undefined') ? '❌' : '✅';
        console.log(`  ${status} ${i+1}. ${name}`);
    });

    const brokenCards = cardNames.filter(n => n.includes('undefined')).length;
    const brokenTable = tableNames.filter(n => n.includes('undefined')).length;

    console.log('\n' + '='.repeat(50));
    if (brokenCards === 0 && brokenTable === 0) {
        console.log('🎉 SUCCESS! ALL CONTACTS SHOWING PROPERLY!');
    } else {
        console.log('❌ STILL BROKEN:');
        console.log(`   Cards: ${brokenCards}/10 broken`);
        console.log(`   Table: ${brokenTable}/10 broken`);
    }
    console.log('='.repeat(50));

    await page.screenshot({ path: '/tmp/verified-fix.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/verified-fix.png');

    console.log('\nBrowser stays open for 10 seconds...');
    await page.waitForTimeout(10000);

    await browser.close();
})();
