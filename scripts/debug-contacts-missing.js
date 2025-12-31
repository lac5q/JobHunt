const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔍 DEBUGGING MISSING CONTACTS\n');

    // Check LOCAL file first
    await page.goto('file://' + __dirname + '/job-search-dashboard.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('STEP 1: Check localStorage contacts');
    const localContacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });
    console.log(`Total contacts in localStorage: ${localContacts.length}`);
    if (localContacts.length > 0) {
        console.log('First 5:', localContacts.slice(0, 5).map(c => c.name || 'NO NAME'));
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

    console.log('\nSTEP 4: Check how many contacts pass filter');
    const filterDebug = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        const searchTerm = document.getElementById('search-contacts').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        const sourceFilter = document.getElementById('filter-source').value;
        const showNA = document.getElementById('filter-show-na').checked;

        const results = contacts.map(c => {
            const matchesSearch = !searchTerm ||
                `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm) ||
                c.company?.toLowerCase().includes(searchTerm) ||
                c.title?.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || c.status === statusFilter;
            const matchesSource = !sourceFilter || c.source === sourceFilter;
            const matchesNA = showNA || !c.isNA;

            return {
                name: c.name || `${c.firstName} ${c.lastName}`,
                isNA: c.isNA,
                matchesSearch,
                matchesStatus,
                matchesSource,
                matchesNA,
                passes: matchesSearch && matchesStatus && matchesSource && matchesNA
            };
        });

        return {
            total: contacts.length,
            passing: results.filter(r => r.passes).length,
            failing: results.filter(r => !r.passes),
            sample: results.slice(0, 5)
        };
    });

    console.log(`Total: ${filterDebug.total}, Passing filter: ${filterDebug.passing}`);
    console.log('\nFirst 5 contacts filter check:');
    filterDebug.sample.forEach((c, i) => {
        console.log(`  ${i+1}. ${c.name}`);
        console.log(`     isNA: ${c.isNA}, matchesNA: ${c.matchesNA}, passes: ${c.passes}`);
    });

    if (filterDebug.failing.length > 0) {
        console.log('\nFailing contacts:');
        filterDebug.failing.slice(0, 10).forEach((c, i) => {
            console.log(`  ${i+1}. ${c.name} - Reason: ${!c.matchesNA ? 'NA filter' : !c.matchesSearch ? 'search' : !c.matchesStatus ? 'status' : 'source'}`);
        });
    }

    console.log('\nSTEP 5: Check rendered contacts');
    const renderedCount = await page.evaluate(() => {
        return document.querySelectorAll('.contact-card').length;
    });
    console.log(`Rendered contact cards: ${renderedCount}`);

    // Take screenshot
    await page.screenshot({ path: '/tmp/debug-missing-contacts.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/debug-missing-contacts.png');

    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS');
    console.log('='.repeat(60));

    if (localContacts.length === 0) {
        console.log('❌ NO CONTACTS IN LOCALSTORAGE!');
    } else if (renderedCount === 0) {
        console.log('❌ CONTACTS IN STORAGE BUT NOT RENDERING!');
        console.log(`   ${filterDebug.total} contacts in storage`);
        console.log(`   ${filterDebug.passing} passing filter`);
        console.log(`   0 rendered`);
    } else {
        console.log('✅ Everything looks OK');
    }

    console.log('\nBrowser stays open for 30 seconds...');
    await page.waitForTimeout(30000);

    await browser.close();
})();
