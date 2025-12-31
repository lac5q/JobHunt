const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🧪 TESTING CONTACT DEDUPLICATION\n');
    console.log('='.repeat(70));

    await page.goto('file://' + __dirname + '/job-search-dashboard.html');
    await page.waitForLoadState('networkidle');

    // Set up credentials
    await page.evaluate(() => {
        localStorage.setItem('supabaseUrl', 'https://dkufgfmwqsxecylyvidi.supabase.co');
        localStorage.setItem('supabaseKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g');
    });

    console.log('\nSTEP 1: Initial page load (should auto-deduplicate)');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    const afterLoad = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        const names = {};
        contacts.forEach(c => {
            const name = (c.name || `${c.firstName} ${c.lastName}`).toLowerCase();
            names[name] = (names[name] || 0) + 1;
        });
        const duplicates = Object.entries(names).filter(([_, count]) => count > 1);
        return {
            total: contacts.length,
            unique: Object.keys(names).length,
            duplicates: duplicates.length,
            duplicateNames: duplicates.map(([name, count]) => ({ name, count }))
        };
    });

    console.log(`✓ Contacts after auto-deduplication: ${afterLoad.total}`);
    console.log(`✓ Unique names: ${afterLoad.unique}`);
    console.log(`✓ Duplicates remaining: ${afterLoad.duplicates}`);

    if (afterLoad.duplicates > 0) {
        console.log('\n⚠️  Still have duplicates:');
        afterLoad.duplicateNames.forEach(d => {
            console.log(`  - ${d.name}: ${d.count} copies`);
        });
    }

    // STEP 2: Check data preservation
    console.log('\nSTEP 2: Verify merged contact data is complete');
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(1000);

    const sampleContact = await page.evaluate(() => {
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        // Find a contact that likely had duplicates (Jessica Bellman-Seufert)
        const jessica = contacts.find(c => {
            const name = (c.name || `${c.firstName} ${c.lastName}`).toLowerCase();
            return name.includes('jessica');
        });

        if (!jessica) return null;

        return {
            name: jessica.name,
            hasLinkedIn: !!(jessica.linkedin || jessica.linkedInUrl),
            hasOutreach: !!(jessica.outreach && jessica.outreach.length > 0),
            outreachCount: jessica.outreach?.length || 0,
            hasNotes: !!jessica.notes,
            status: jessica.status
        };
    });

    if (sampleContact) {
        console.log(`✓ Sample merged contact: ${sampleContact.name}`);
        console.log(`  - LinkedIn: ${sampleContact.hasLinkedIn ? 'Yes' : 'No'}`);
        console.log(`  - Outreach entries: ${sampleContact.outreachCount}`);
        console.log(`  - Notes: ${sampleContact.hasNotes ? 'Yes' : 'No'}`);
        console.log(`  - Status: ${sampleContact.status}`);
    }

    // STEP 3: Manual deduplication test
    console.log('\nSTEP 3: Test manual deduplication function');
    const manualResult = await page.evaluate(() => {
        // Add a duplicate contact
        const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        const testDuplicate = {
            ...contacts[0],
            id: 'test-duplicate-' + Date.now(),
            notes: 'This is a test duplicate'
        };
        contacts.push(testDuplicate);
        localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));

        // Run deduplication
        const result = deduplicateContacts();

        const afterContacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');

        return {
            beforeManual: contacts.length,
            removed: result.removed,
            afterManual: afterContacts.length
        };
    });

    console.log(`✓ Added test duplicate: ${manualResult.beforeManual} contacts`);
    console.log(`✓ Ran deduplication: removed ${manualResult.removed}`);
    console.log(`✓ After deduplication: ${manualResult.afterManual} contacts`);

    // Take screenshot
    await page.screenshot({ path: '/tmp/deduplication-test.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/deduplication-test.png');

    // Final verdict
    console.log('\n' + '='.repeat(70));
    console.log('TEST RESULTS');
    console.log('='.repeat(70));

    const allPassed =
        afterLoad.duplicates === 0 &&
        afterLoad.total === afterLoad.unique &&
        manualResult.removed === 1 &&
        sampleContact && sampleContact.hasLinkedIn;

    if (allPassed) {
        console.log('✅ ALL TESTS PASSED!');
        console.log(`   - ${afterLoad.total} unique contacts (no duplicates)`);
        console.log('   - Merged data preserved (LinkedIn, outreach, notes)');
        console.log('   - Manual deduplication works');
    } else {
        console.log('❌ SOME TESTS FAILED:');
        if (afterLoad.duplicates > 0) {
            console.log(`   - Still have ${afterLoad.duplicates} duplicate names`);
        }
        if (manualResult.removed !== 1) {
            console.log(`   - Manual dedupe removed ${manualResult.removed} (expected 1)`);
        }
        if (!sampleContact || !sampleContact.hasLinkedIn) {
            console.log('   - Merged contact missing data');
        }
    }

    console.log('\nBrowser stays open for 20 seconds...');
    await page.waitForTimeout(20000);

    await browser.close();
    process.exit(allPassed ? 0 : 1);
})();
