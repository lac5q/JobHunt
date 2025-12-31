const { chromium } = require('playwright');

async function runTests() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const results = {
        passed: [],
        failed: []
    };

    console.log('🧪 REGRESSION TEST SUITE\n');
    console.log('='.repeat(70));

    try {
        // TEST 1: Supabase credentials load
        console.log('\n[TEST 1] Supabase credentials should load from localStorage');
        await page.goto('file://' + __dirname + '/job-search-dashboard.html');
        await page.waitForLoadState('networkidle');

        await page.evaluate(() => {
            localStorage.setItem('supabaseUrl', 'https://dkufgfmwqsxecylyvidi.supabase.co');
            localStorage.setItem('supabaseKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g');
        });
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const creds = await page.evaluate(() => ({
            url: localStorage.getItem('supabaseUrl'),
            hasKey: !!localStorage.getItem('supabaseKey')
        }));

        if (creds.url && creds.hasKey) {
            results.passed.push('TEST 1: Credentials loaded ✓');
        } else {
            results.failed.push('TEST 1: Credentials missing ✗');
        }

        // TEST 2: Contacts load from Supabase
        console.log('[TEST 2] Contacts should load from Supabase');
        const contacts = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
        });

        if (contacts.length >= 15) {
            results.passed.push(`TEST 2: ${contacts.length} contacts loaded ✓`);
        } else {
            results.failed.push(`TEST 2: Only ${contacts.length} contacts loaded (expected 15+) ✗`);
        }

        // TEST 3: Contacts page renders
        console.log('[TEST 3] Contacts should render on Contacts tab');
        await page.click('[data-tab="contacts"]');
        await page.waitForTimeout(1000);

        const renderInfo = await page.evaluate(() => {
            const cards = document.querySelectorAll('.contact-card').length;
            const allContacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            const naCount = allContacts.filter(c => c.isNA).length;
            return { cards, naCount, total: allContacts.length };
        });

        // Should render all contacts minus those marked NA (which are hidden by default)
        const expectedRendered = renderInfo.total - renderInfo.naCount;
        if (renderInfo.cards === expectedRendered || renderInfo.cards >= 10) {
            results.passed.push(`TEST 3: ${renderInfo.cards} contact cards rendered (${renderInfo.naCount} NA hidden) ✓`);
        } else {
            results.failed.push(`TEST 3: Only ${renderInfo.cards} contact cards rendered (expected ${expectedRendered}) ✗`);
        }

        // TEST 4: Contact names display correctly
        console.log('[TEST 4] Contact names should not contain "undefined"');
        const names = await page.evaluate(() => {
            const cards = document.querySelectorAll('.contact-card-name');
            return Array.from(cards).slice(0, 10).map(el => el.textContent.trim());
        });

        const brokenNames = names.filter(n => n.includes('undefined'));
        if (brokenNames.length === 0) {
            results.passed.push('TEST 4: All names display correctly ✓');
        } else {
            results.failed.push(`TEST 4: ${brokenNames.length}/10 names contain "undefined" ✗`);
        }

        // TEST 5: Toggle NA function exists
        console.log('[TEST 5] toggleNA function should exist');
        const hasToggleNA = await page.evaluate(() => {
            return typeof toggleNA === 'function';
        });

        if (hasToggleNA) {
            results.passed.push('TEST 5: toggleNA function exists ✓');
        } else {
            results.failed.push('TEST 5: toggleNA function missing ✗');
        }

        // TEST 6: NA button exists on contact cards
        console.log('[TEST 6] NA button should exist on contact cards');
        const hasNAButton = await page.evaluate(() => {
            const firstCard = document.querySelector('.contact-card');
            if (!firstCard) return false;
            const naButton = Array.from(firstCard.querySelectorAll('button')).find(b =>
                b.textContent.includes('NA')
            );
            return !!naButton;
        });

        if (hasNAButton) {
            results.passed.push('TEST 6: NA button found on contact cards ✓');
        } else {
            results.failed.push('TEST 6: NA button missing from contact cards ✗');
        }

        // TEST 7: 'Show NA' filter exists
        console.log('[TEST 7] "Show NA" filter checkbox should exist');
        const hasShowNAFilter = await page.evaluate(() => {
            return !!document.getElementById('filter-show-na');
        });

        if (hasShowNAFilter) {
            results.passed.push('TEST 7: "Show NA" filter exists ✓');
        } else {
            results.failed.push('TEST 7: "Show NA" filter missing ✗');
        }

        // =====================================================================
        // AI PANEL INTEGRATION TESTS (Phase 1)
        // =====================================================================

        // TEST 8: AI panel exists in DOM
        console.log('[TEST 8] AI panel should exist in DOM');
        const hasPanel = await page.evaluate(() => {
            return !!document.getElementById('ai-panel');
        });

        if (hasPanel) {
            results.passed.push('TEST 8: AI panel exists in DOM ✓');
        } else {
            results.failed.push('TEST 8: AI panel missing from DOM ✗');
        }

        // TEST 9: Compose button exists on contact cards
        console.log('[TEST 9] Compose button should exist on contact cards');
        const hasComposeBtn = await page.evaluate(() => {
            const firstCard = document.querySelector('.contact-card');
            if (!firstCard) return false;
            const composeBtn = firstCard.querySelector('.btn-compose') ||
                             Array.from(firstCard.querySelectorAll('button')).find(b =>
                                 b.textContent.includes('Compose') || b.textContent.includes('📧')
                             );
            return !!composeBtn;
        });

        if (hasComposeBtn) {
            results.passed.push('TEST 9: Compose button found on contact cards ✓');
        } else {
            results.failed.push('TEST 9: Compose button missing from contact cards ✗');
        }

        // TEST 10: openAIPanel function exists
        console.log('[TEST 10] openAIPanel function should be defined');
        const hasOpenAIPanel = await page.evaluate(() => {
            return typeof openAIPanel === 'function';
        });

        if (hasOpenAIPanel) {
            results.passed.push('TEST 10: openAIPanel function exists ✓');
        } else {
            results.failed.push('TEST 10: openAIPanel function not defined ✗');
        }

        // TEST 11: AI panel components exist
        console.log('[TEST 11] AI panel should have required components');
        const panelComponents = await page.evaluate(() => {
            const panel = document.getElementById('ai-panel');
            if (!panel) return { exists: false };

            // Look for key components (flexible selectors)
            const hasContactContext = !!(
                panel.querySelector('#panel-contact-name, [data-field="contact-name"]') ||
                panel.querySelector('.ai-panel-contact-name, .contact-name')
            );

            const hasGenerateBtn = !!(
                panel.querySelector('#generate-button, [data-action="generate"]') ||
                panel.querySelector('.btn-generate')
            );

            const hasCloseBtn = !!(
                panel.querySelector('#ai-panel-close, [data-action="close-panel"]') ||
                panel.querySelector('.ai-panel-close, .btn-close')
            );

            const hasMessageOutput = !!(
                panel.querySelector('#generated-message, [data-field="generated-message"]') ||
                panel.querySelector('.generated-message, .message-output')
            );

            return {
                exists: true,
                hasContactContext,
                hasGenerateBtn,
                hasCloseBtn,
                hasMessageOutput
            };
        });

        if (panelComponents.exists) {
            const componentCount = [
                panelComponents.hasContactContext,
                panelComponents.hasGenerateBtn,
                panelComponents.hasCloseBtn,
                panelComponents.hasMessageOutput
            ].filter(Boolean).length;

            if (componentCount >= 3) {
                results.passed.push(`TEST 11: AI panel has ${componentCount}/4 key components ✓`);
            } else {
                results.failed.push(`TEST 11: AI panel missing components (only ${componentCount}/4 found) ✗`);
            }
        } else {
            results.failed.push('TEST 11: Cannot check panel components (panel missing) ✗');
        }

        // TEST 12: Message type and tone selectors exist
        console.log('[TEST 12] Message type and tone selectors should exist');
        const hasSelectors = await page.evaluate(() => {
            const panel = document.getElementById('ai-panel');
            if (!panel) return false;

            const messageType = panel.querySelector('#message-type, [name="message-type"], select[data-field="type"]');
            const messageTone = panel.querySelector('#message-tone, [name="message-tone"], select[data-field="tone"]');

            return !!(messageType && messageTone);
        });

        if (hasSelectors) {
            results.passed.push('TEST 12: Message type and tone selectors exist ✓');
        } else {
            results.failed.push('TEST 12: Message type or tone selectors missing ✗');
        }

        // TEST 13: Panel animation CSS exists
        console.log('[TEST 13] Panel should have transition/animation CSS');
        const hasAnimation = await page.evaluate(() => {
            const panel = document.getElementById('ai-panel');
            if (!panel) return false;

            const styles = window.getComputedStyle(panel);
            const hasTransition = styles.transition !== 'all 0s ease 0s' && styles.transition !== 'none';
            const hasTransform = styles.transform !== 'none' || panel.style.transform !== '';

            return hasTransition || hasTransform;
        });

        if (hasAnimation) {
            results.passed.push('TEST 13: Panel has animation CSS ✓');
        } else {
            results.failed.push('TEST 13: Panel missing animation CSS ✗');
        }

        // TEST 14: Quick smoke test - Try opening panel
        console.log('[TEST 14] Quick smoke test: Try opening AI panel');
        try {
            const firstComposeBtn = await page.locator('.contact-card .btn-compose, .contact-card button:has-text("Compose")').first();
            const btnCount = await firstComposeBtn.count();

            if (btnCount > 0) {
                await firstComposeBtn.click();
                await page.waitForTimeout(500);

                const panelOpened = await page.evaluate(() => {
                    const panel = document.getElementById('ai-panel');
                    if (!panel) return false;
                    return panel.classList.contains('open') ||
                           panel.style.display === 'block' ||
                           panel.style.display === 'flex' ||
                           panel.style.visibility === 'visible';
                });

                if (panelOpened) {
                    results.passed.push('TEST 14: AI panel opens successfully ✓');

                    // Close it for cleanliness
                    await page.click('#ai-panel-close, [data-action="close-panel"], .ai-panel-close').catch(() => {});
                } else {
                    results.failed.push('TEST 14: AI panel did not open when compose clicked ✗');
                }
            } else {
                results.failed.push('TEST 14: No compose button available to test ✗');
            }
        } catch (error) {
            results.failed.push(`TEST 14: Panel open test failed - ${error.message} ✗`);
        }

    } catch (error) {
        results.failed.push(`FATAL ERROR: ${error.message}`);
    }

    // Print results
    console.log('\n' + '='.repeat(70));
    console.log('TEST RESULTS');
    console.log('='.repeat(70));

    console.log('\n✅ PASSED:');
    results.passed.forEach(r => console.log('  ' + r));

    if (results.failed.length > 0) {
        console.log('\n❌ FAILED:');
        results.failed.forEach(r => console.log('  ' + r));
    }

    console.log('\n' + '='.repeat(70));
    console.log(`Summary: ${results.passed.length} passed, ${results.failed.length} failed`);
    console.log('='.repeat(70));

    await page.screenshot({ path: '/tmp/regression-test.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/regression-test.png');

    console.log('\nBrowser stays open for 20 seconds...');
    await page.waitForTimeout(20000);
    await browser.close();

    return results.failed.length === 0;
}

runTests().then(success => {
    process.exit(success ? 0 : 1);
});
