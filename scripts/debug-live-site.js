const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🔍 DEBUGGING LIVE SITE - Full Investigation\n');

    // Enable console logging
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warning') {
            console.log(`[BROWSER ${type.toUpperCase()}]:`, msg.text());
        }
    });

    await page.goto('https://luis-jobhunt-4dhbsmjcp-luis-calderons-projects-9c5eea79.vercel.app');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('STEP 1: Check if cleanup function exists');
    const hasCleanup = await page.evaluate(() => {
        return typeof cleanupBrokenContacts === 'function';
    });
    console.log('cleanupBrokenContacts exists:', hasCleanup);

    console.log('\nSTEP 2: Check localStorage contacts BEFORE anything');
    const beforeContacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });
    console.log('Contacts in localStorage:', beforeContacts.length);
    console.log('Sample:', beforeContacts.slice(0, 3).map(c => ({name: c.name, source: c.source})));

    console.log('\nSTEP 3: Go to Contacts tab and check what renders');
    await page.click('[data-tab="contacts"]');
    await page.waitForTimeout(2000);

    // Check if table or cards are visible
    const tableVisible = await page.locator('#contacts-table-body').isVisible();
    const cardsVisible = await page.locator('#crm-cards-view').isVisible();
    console.log('Table visible:', tableVisible);
    console.log('Cards visible:', cardsVisible);

    // Get rendered contact names from the page
    if (tableVisible) {
        const tableNames = await page.evaluate(() => {
            const rows = document.querySelectorAll('#contacts-table-body tr');
            return Array.from(rows).slice(0, 10).map(row => {
                const nameCell = row.querySelector('td:first-child');
                return nameCell ? nameCell.textContent.trim() : 'NO NAME CELL';
            });
        });
        console.log('\nRendered in TABLE (first 10):');
        tableNames.forEach((name, i) => console.log(`  ${i+1}. ${name}`));
    }

    if (cardsVisible) {
        const cardNames = await page.evaluate(() => {
            const cards = document.querySelectorAll('.contact-card');
            return Array.from(cards).slice(0, 10).map(card => {
                const nameEl = card.querySelector('.contact-card-name, h3');
                return nameEl ? nameEl.textContent.trim() : 'NO NAME ELEMENT';
            });
        });
        console.log('\nRendered in CARDS (first 10):');
        cardNames.forEach((name, i) => console.log(`  ${i+1}. ${name}`));
    }

    console.log('\nSTEP 4: Check Supabase connection');
    const supabaseCheck = await page.evaluate(async () => {
        const url = localStorage.getItem('supabaseUrl');
        const key = localStorage.getItem('supabaseKey');

        if (!url || !key) {
            return { error: 'No Supabase credentials in localStorage' };
        }

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
                hasData: !!data[0],
                linkedinConversations: data[0]?.linkedin_conversations?.length || 0,
                contacts: data[0]?.contacts?.length || 0
            };
        } catch (e) {
            return { error: e.message };
        }
    });

    console.log('Supabase check:', supabaseCheck);

    console.log('\nSTEP 5: Manually trigger importLinkedInConversations');
    const importResult = await page.evaluate(async () => {
        if (typeof SyncManager === 'undefined') {
            return { error: 'SyncManager not defined' };
        }

        const url = localStorage.getItem('supabaseUrl');
        const key = localStorage.getItem('supabaseKey');

        const response = await fetch(`${url}/rest/v1/job_search_data?id=eq.main`, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        const data = await response.json();
        const conversations = data[0]?.linkedin_conversations || [];

        console.log('About to import', conversations.length, 'conversations');

        if (typeof SyncManager.importLinkedInConversations === 'function') {
            SyncManager.importLinkedInConversations(conversations);
            return { imported: true, count: conversations.length };
        } else {
            return { error: 'importLinkedInConversations not a function' };
        }
    });

    console.log('Import result:', importResult);

    console.log('\nSTEP 6: Check localStorage AFTER import');
    await page.waitForTimeout(1000);
    const afterContacts = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
    });
    console.log('Contacts after import:', afterContacts.length);
    console.log('First 5:', afterContacts.slice(0, 5).map(c => c.name));

    // Take screenshot
    await page.screenshot({ path: '/tmp/debug-live.png', fullPage: true });
    console.log('\n📸 Screenshot saved to /tmp/debug-live.png');

    console.log('\n' + '='.repeat(60));
    console.log('DIAGNOSIS');
    console.log('='.repeat(60));

    const broken = afterContacts.filter(c => !c.name || c.name.includes('undefined'));
    console.log(`Total contacts: ${afterContacts.length}`);
    console.log(`Valid: ${afterContacts.length - broken.length}`);
    console.log(`Broken: ${broken.length}`);

    console.log('\nBrowser stays open for 20 seconds...');
    await page.waitForTimeout(20000);

    await browser.close();
})();
