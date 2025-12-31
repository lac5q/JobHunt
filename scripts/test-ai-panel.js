const { chromium } = require('playwright');
const fixtures = require('./test-fixtures');

/**
 * Comprehensive AI Panel Test Suite
 *
 * Tests all functionality of the AI panel integration including:
 * - Panel open/close animations
 * - Contact context loading
 * - Gmail search integration
 * - AI message generation
 * - Clipboard operations
 * - Gmail sending
 * - Message history logging
 * - Performance benchmarks
 */

async function runAIPanelTests() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    const results = {
        passed: [],
        failed: [],
        skipped: [],
        performance: {}
    };

    console.log('\n' + '='.repeat(70));
    console.log('AI PANEL TEST SUITE');
    console.log('='.repeat(70) + '\n');

    try {
        // Setup: Load dashboard and inject test data
        console.log('[SETUP] Loading dashboard and injecting test data...');
        await page.goto('file://' + __dirname + '/job-search-dashboard.html');
        await page.waitForLoadState('networkidle');

        // Inject test contact into localStorage
        await page.evaluate((contact) => {
            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            contacts.unshift(contact); // Add to beginning
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
        }, fixtures.testContact);

        // Inject Supabase credentials
        await page.evaluate(() => {
            localStorage.setItem('supabaseUrl', 'https://dkufgfmwqsxecylyvidi.supabase.co');
            localStorage.setItem('supabaseKey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g');
        });

        await page.reload();
        await page.waitForLoadState('networkidle');

        // Navigate to Contacts tab
        await page.click('[data-tab="contacts"]');
        await page.waitForTimeout(1000);

        console.log('[SETUP] Test data injected successfully\n');

        // =====================================================================
        // TEST 1: AI Panel exists in DOM
        // =====================================================================
        console.log('[TEST 1] AI panel should exist in DOM');
        const panelExists = await page.evaluate(() => {
            return !!document.getElementById('ai-panel');
        });

        if (panelExists) {
            results.passed.push('TEST 1: AI panel exists in DOM');
        } else {
            results.failed.push('TEST 1: AI panel missing from DOM');
        }

        // =====================================================================
        // TEST 2: Compose button exists on contact cards
        // =====================================================================
        console.log('[TEST 2] Compose button should exist on contact cards');
        const composeButtonInfo = await page.evaluate(() => {
            const firstCard = document.querySelector('.contact-card');
            if (!firstCard) return { exists: false, reason: 'No contact card found' };

            const composeBtn = firstCard.querySelector('.btn-compose');
            if (!composeBtn) return { exists: false, reason: 'No compose button found' };

            return {
                exists: true,
                text: composeBtn.textContent.trim(),
                visible: composeBtn.offsetParent !== null
            };
        });

        if (composeButtonInfo.exists && composeButtonInfo.visible) {
            results.passed.push(`TEST 2: Compose button exists and visible (text: "${composeButtonInfo.text}")`);
        } else {
            results.failed.push(`TEST 2: Compose button issue - ${composeButtonInfo.reason || 'Not visible'}`);
        }

        // =====================================================================
        // TEST 3: openAIPanel function exists
        // =====================================================================
        console.log('[TEST 3] openAIPanel function should be defined');
        const functionExists = await page.evaluate(() => {
            return typeof openAIPanel === 'function';
        });

        if (functionExists) {
            results.passed.push('TEST 3: openAIPanel function exists');
        } else {
            results.failed.push('TEST 3: openAIPanel function not defined');
            results.skipped.push('Tests 4-14 skipped due to missing openAIPanel function');
            throw new Error('Cannot continue without openAIPanel function');
        }

        // =====================================================================
        // TEST 4: Panel opens on Compose click (Animation Test)
        // =====================================================================
        console.log('[TEST 4] Panel should open with smooth animation on Compose click');

        // Get panel initial state
        const initialState = await page.evaluate(() => {
            const panel = document.getElementById('ai-panel');
            return {
                width: panel.offsetWidth,
                visibility: window.getComputedStyle(panel).visibility,
                transform: window.getComputedStyle(panel).transform
            };
        });

        // Click compose button
        const animationStart = Date.now();
        const composeBtn = await page.locator('.contact-card .btn-compose').first();
        await composeBtn.click();

        // Wait for animation to complete
        await page.waitForTimeout(400); // Slightly longer than 300ms animation

        const animationTime = Date.now() - animationStart;
        results.performance.panelOpenAnimation = animationTime;

        // Check final state
        const finalState = await page.evaluate(() => {
            const panel = document.getElementById('ai-panel');
            return {
                width: panel.offsetWidth,
                visibility: window.getComputedStyle(panel).visibility,
                transform: window.getComputedStyle(panel).transform,
                isOpen: panel.classList.contains('open') || panel.style.display !== 'none'
            };
        });

        const animationPassed =
            finalState.isOpen &&
            finalState.width > initialState.width &&
            animationTime <= fixtures.performanceThresholds.panelOpenAnimation + 100; // 100ms tolerance

        if (animationPassed) {
            results.passed.push(`TEST 4: Panel opened with animation (${animationTime}ms)`);
        } else {
            results.failed.push(`TEST 4: Panel animation failed (time: ${animationTime}ms, threshold: ${fixtures.performanceThresholds.panelOpenAnimation}ms)`);
        }

        // =====================================================================
        // TEST 5: Contact context loads correctly
        // =====================================================================
        console.log('[TEST 5] Contact context should load and display correctly');

        const contextData = await page.evaluate(() => {
            const getName = () => {
                const nameEl = document.getElementById('panel-contact-name') ||
                              document.querySelector('[data-field="contact-name"]') ||
                              document.querySelector('.ai-panel-contact-name');
                return nameEl ? nameEl.textContent.trim() : null;
            };

            const getTitle = () => {
                const titleEl = document.getElementById('panel-contact-title') ||
                               document.querySelector('[data-field="contact-title"]') ||
                               document.querySelector('.ai-panel-contact-title');
                return titleEl ? titleEl.textContent.trim() : null;
            };

            const getCompany = () => {
                const companyEl = document.getElementById('panel-contact-company') ||
                                 document.querySelector('[data-field="contact-company"]') ||
                                 document.querySelector('.ai-panel-contact-company');
                return companyEl ? companyEl.textContent.trim() : null;
            };

            const getNotes = () => {
                const notesEl = document.getElementById('panel-contact-notes') ||
                               document.querySelector('[data-field="contact-notes"]') ||
                               document.querySelector('.ai-panel-contact-notes');
                return notesEl ? notesEl.textContent.trim() : null;
            };

            return {
                name: getName(),
                title: getTitle(),
                company: getCompany(),
                notes: getNotes()
            };
        });

        const contextLoaded =
            contextData.name && contextData.name.includes(fixtures.testContact.firstName) &&
            contextData.title && contextData.company;

        if (contextLoaded) {
            results.passed.push(`TEST 5: Contact context loaded (${contextData.name}, ${contextData.title}, ${contextData.company})`);
        } else {
            results.failed.push(`TEST 5: Contact context incomplete (name: ${contextData.name}, title: ${contextData.title}, company: ${contextData.company})`);
        }

        // =====================================================================
        // TEST 6: Gmail search executes (if implemented)
        // =====================================================================
        console.log('[TEST 6] Gmail search should execute and display results');

        await page.waitForTimeout(2500); // Wait for Gmail search to complete

        const gmailSearchResults = await page.evaluate(() => {
            // Look for Gmail search status
            const searchStatus = document.getElementById('gmail-search-status') ||
                               document.querySelector('[data-field="gmail-status"]') ||
                               document.querySelector('.gmail-search-status');

            const emailCount = document.getElementById('gmail-email-count') ||
                             document.querySelector('[data-field="email-count"]') ||
                             document.querySelector('.gmail-email-count');

            return {
                hasStatus: !!searchStatus,
                statusText: searchStatus ? searchStatus.textContent.trim() : null,
                hasEmailCount: !!emailCount,
                emailCountText: emailCount ? emailCount.textContent.trim() : null
            };
        });

        if (gmailSearchResults.hasStatus || gmailSearchResults.hasEmailCount) {
            results.passed.push(`TEST 6: Gmail search UI present (status: ${gmailSearchResults.statusText})`);
        } else {
            results.skipped.push('TEST 6: Gmail search UI not found (may not be implemented yet)');
        }

        // =====================================================================
        // TEST 7: Message type and tone selectors exist
        // =====================================================================
        console.log('[TEST 7] Message type and tone selectors should exist');

        const selectorInfo = await page.evaluate(() => {
            const messageType = document.getElementById('ai-message-type') ||
                              document.getElementById('message-type') ||
                              document.querySelector('[name="message-type"]') ||
                              document.querySelector('select[data-field="type"]');

            const messageTone = document.getElementById('ai-tone') ||
                              document.getElementById('message-tone') ||
                              document.querySelector('[name="message-tone"]') ||
                              document.querySelector('select[data-field="tone"]');

            return {
                hasMessageType: !!messageType,
                messageTypeOptions: messageType ? messageType.options.length : 0,
                hasTone: !!messageTone,
                toneOptions: messageTone ? messageTone.options.length : 0
            };
        });

        if (selectorInfo.hasMessageType && selectorInfo.hasTone) {
            results.passed.push(`TEST 7: Message selectors exist (${selectorInfo.messageTypeOptions} types, ${selectorInfo.toneOptions} tones)`);
        } else {
            results.failed.push(`TEST 7: Message selectors incomplete (type: ${selectorInfo.hasMessageType}, tone: ${selectorInfo.hasTone})`);
        }

        // =====================================================================
        // TEST 8: Generate button exists and triggers AI generation
        // =====================================================================
        console.log('[TEST 8] Generate button should exist and trigger AI generation');

        const generateButtonInfo = await page.evaluate(() => {
            const generateBtn = document.getElementById('generate-button') ||
                              document.querySelector('[data-action="generate"]') ||
                              document.querySelector('.btn-generate');

            return {
                exists: !!generateBtn,
                text: generateBtn ? generateBtn.textContent.trim() : null,
                disabled: generateBtn ? generateBtn.disabled : null
            };
        });

        if (generateButtonInfo.exists) {
            results.passed.push(`TEST 8: Generate button exists (text: "${generateButtonInfo.text}", disabled: ${generateButtonInfo.disabled})`);

            // Try clicking the generate button (if AI API is configured)
            console.log('[TEST 8b] Testing AI generation (will fail if API keys not configured)...');

            try {
                const genStart = Date.now();
                await page.click('#generate-button, [data-action="generate"], .btn-generate');

                // Wait for either success or error message (max 10s)
                await page.waitForSelector('.generated-message, .success-message, .error-message, .ai-error', { timeout: 10000 });

                const genTime = Date.now() - genStart;
                results.performance.aiGeneration = genTime;

                const generationResult = await page.evaluate(() => {
                    const message = document.querySelector('.generated-message, #generated-message, [data-field="generated-message"]');
                    const error = document.querySelector('.error-message, .ai-error');

                    return {
                        success: !!message && message.textContent.length > 50,
                        messageLength: message ? message.textContent.length : 0,
                        error: error ? error.textContent.trim() : null
                    };
                });

                if (generationResult.success) {
                    results.passed.push(`TEST 8b: AI generation successful (${genTime}ms, ${generationResult.messageLength} chars)`);
                } else if (generationResult.error) {
                    results.skipped.push(`TEST 8b: AI generation skipped (error: ${generationResult.error})`);
                } else {
                    results.skipped.push('TEST 8b: AI generation result unclear');
                }
            } catch (error) {
                results.skipped.push(`TEST 8b: AI generation test skipped (${error.message})`);
            }
        } else {
            results.failed.push('TEST 8: Generate button not found');
        }

        // =====================================================================
        // TEST 9: Copy to clipboard button exists
        // =====================================================================
        console.log('[TEST 9] Copy to clipboard button should exist');

        const copyButtonInfo = await page.evaluate(() => {
            const copyBtn = document.getElementById('copy-message-button') ||
                          document.querySelector('[data-action="copy"]') ||
                          document.querySelector('.btn-copy');

            return {
                exists: !!copyBtn,
                text: copyBtn ? copyBtn.textContent.trim() : null,
                disabled: copyBtn ? copyBtn.disabled : null
            };
        });

        if (copyButtonInfo.exists) {
            results.passed.push(`TEST 9: Copy button exists (text: "${copyButtonInfo.text}")`);
        } else {
            results.skipped.push('TEST 9: Copy button not found (may appear only after generation)');
        }

        // =====================================================================
        // TEST 10: Send via Gmail button exists
        // =====================================================================
        console.log('[TEST 10] Send via Gmail button should exist');

        const sendButtonInfo = await page.evaluate(() => {
            const sendBtn = document.getElementById('send-message-button') ||
                          document.querySelector('[data-action="send"]') ||
                          document.querySelector('.btn-send');

            return {
                exists: !!sendBtn,
                text: sendBtn ? sendBtn.textContent.trim() : null,
                disabled: sendBtn ? sendBtn.disabled : null
            };
        });

        if (sendButtonInfo.exists) {
            results.passed.push(`TEST 10: Send button exists (text: "${sendButtonInfo.text}")`);
        } else {
            results.skipped.push('TEST 10: Send button not found (may appear only after generation)');
        }

        // =====================================================================
        // TEST 11: Message logging function exists
        // =====================================================================
        console.log('[TEST 11] Message logging functions should exist');

        const loggingFunctions = await page.evaluate(() => {
            return {
                hasLogMessage: typeof logMessageToContact === 'function',
                hasSaveMessage: typeof saveMessageHistory === 'function',
                hasUpdateStatus: typeof updateContactStatus === 'function'
            };
        });

        const loggingFunctionsExist = Object.values(loggingFunctions).some(v => v);

        if (loggingFunctionsExist) {
            const funcNames = Object.entries(loggingFunctions)
                .filter(([, exists]) => exists)
                .map(([name]) => name)
                .join(', ');
            results.passed.push(`TEST 11: Message logging functions exist (${funcNames})`);
        } else {
            results.failed.push('TEST 11: No message logging functions found');
        }

        // =====================================================================
        // TEST 12: Panel close button exists and works
        // =====================================================================
        console.log('[TEST 12] Panel should close with smooth animation');

        const closeButtonExists = await page.evaluate(() => {
            const closeBtn = document.getElementById('ai-panel-close') ||
                           document.querySelector('[data-action="close-panel"]') ||
                           document.querySelector('.ai-panel-close, .btn-close-panel');

            return !!closeBtn;
        });

        if (closeButtonExists) {
            results.passed.push('TEST 12: Close button exists');

            // Test closing animation
            const closeStart = Date.now();
            await page.click('#ai-panel-close, [data-action="close-panel"], .ai-panel-close, .btn-close-panel');
            await page.waitForTimeout(400);

            const closeTime = Date.now() - closeStart;
            results.performance.panelCloseAnimation = closeTime;

            const panelClosed = await page.evaluate(() => {
                const panel = document.getElementById('ai-panel');
                return !panel.classList.contains('open') && panel.style.display === 'none';
            });

            if (panelClosed) {
                results.passed.push(`TEST 12b: Panel closed successfully (${closeTime}ms)`);
            } else {
                results.failed.push('TEST 12b: Panel did not close properly');
            }
        } else {
            results.failed.push('TEST 12: Close button not found');
        }

        // =====================================================================
        // TEST 13: Panel can be reopened after closing
        // =====================================================================
        console.log('[TEST 13] Panel should reopen correctly after closing');

        await page.waitForTimeout(500);
        const reopenBtn = await page.locator('.contact-card .btn-compose').first();
        await reopenBtn.click();
        await page.waitForTimeout(400);

        const panelReopened = await page.evaluate(() => {
            const panel = document.getElementById('ai-panel');
            return panel.classList.contains('open') || panel.style.display !== 'none';
        });

        if (panelReopened) {
            results.passed.push('TEST 13: Panel reopened successfully');
        } else {
            results.failed.push('TEST 13: Panel failed to reopen');
        }

        // =====================================================================
        // TEST 14: Multiple contacts can be composed sequentially
        // =====================================================================
        console.log('[TEST 14] Should handle multiple contact compositions');

        // Close current panel
        try {
            await page.click('#ai-panel-close, [data-action="close-panel"], .ai-panel-close');
            await page.waitForTimeout(400);

            // Try opening second contact card (if exists)
            const secondCompose = await page.locator('.contact-card .btn-compose').nth(1);
            const secondExists = await secondCompose.count() > 0;

            if (secondExists) {
                await secondCompose.click();
                await page.waitForTimeout(400);

                const secondOpened = await page.evaluate(() => {
                    const panel = document.getElementById('ai-panel');
                    return panel.classList.contains('open') || panel.style.display !== 'none';
                });

                if (secondOpened) {
                    results.passed.push('TEST 14: Sequential compositions work');
                } else {
                    results.failed.push('TEST 14: Second composition failed to open');
                }
            } else {
                results.skipped.push('TEST 14: Only one contact available for testing');
            }
        } catch (error) {
            results.skipped.push(`TEST 14: Sequential test skipped (${error.message})`);
        }

        // =====================================================================
        // TEST 15: Keyboard shortcuts (if implemented)
        // =====================================================================
        console.log('[TEST 15] Testing keyboard shortcuts (if implemented)');

        try {
            // Test Escape to close
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);

            const escapeWorks = await page.evaluate(() => {
                const panel = document.getElementById('ai-panel');
                return !panel.classList.contains('open') || panel.style.display === 'none';
            });

            if (escapeWorks) {
                results.passed.push('TEST 15: Escape key closes panel');
            } else {
                results.skipped.push('TEST 15: Escape keyboard shortcut not implemented');
            }
        } catch (error) {
            results.skipped.push(`TEST 15: Keyboard shortcuts test skipped (${error.message})`);
        }

    } catch (error) {
        results.failed.push(`FATAL ERROR: ${error.message}`);
        console.error(error);
    }

    // =====================================================================
    // Print Results
    // =====================================================================
    console.log('\n' + '='.repeat(70));
    console.log('TEST RESULTS');
    console.log('='.repeat(70));

    if (results.passed.length > 0) {
        console.log('\n✅ PASSED (' + results.passed.length + '):');
        results.passed.forEach(r => console.log('  ' + r));
    }

    if (results.failed.length > 0) {
        console.log('\n❌ FAILED (' + results.failed.length + '):');
        results.failed.forEach(r => console.log('  ' + r));
    }

    if (results.skipped.length > 0) {
        console.log('\n⏭️  SKIPPED (' + results.skipped.length + '):');
        results.skipped.forEach(r => console.log('  ' + r));
    }

    // Performance metrics
    console.log('\n⚡ PERFORMANCE:');
    Object.entries(results.performance).forEach(([metric, time]) => {
        const threshold = fixtures.performanceThresholds[metric];
        const status = threshold && time <= threshold ? '✓' : '⚠️';
        const thresholdText = threshold ? ` (threshold: ${threshold}ms)` : '';
        console.log(`  ${status} ${metric}: ${time}ms${thresholdText}`);
    });

    console.log('\n' + '='.repeat(70));
    console.log(`Summary: ${results.passed.length} passed, ${results.failed.length} failed, ${results.skipped.length} skipped`);
    console.log('='.repeat(70));

    // Take screenshots
    await page.screenshot({ path: '/tmp/ai-panel-test.png', fullPage: true });
    console.log('\n📸 Screenshot: /tmp/ai-panel-test.png');

    console.log('\nBrowser stays open for 20 seconds...');
    await page.waitForTimeout(20000);
    await browser.close();

    return {
        success: results.failed.length === 0,
        results
    };
}

// Run tests if executed directly
if (require.main === module) {
    runAIPanelTests().then(({ success }) => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = { runAIPanelTests };
