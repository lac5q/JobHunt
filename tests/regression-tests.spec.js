/**
 * Regression Test Suite
 * Job Search CRM with AI Integration
 *
 * Automated tests using Playwright to catch regressions
 * Run with: npx playwright test tests/regression-tests.spec.js
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = 'http://localhost:8080'; // Change to production URL when needed
const TEST_TIMEOUT = 30000; // 30 seconds per test

// Test fixtures - realistic data
const testContact = {
    firstName: 'Sarah',
    lastName: 'Chen',
    title: 'VP of Product',
    company: 'Stripe',
    email: 'sarah.chen@stripe.com',
    linkedin: 'https://linkedin.com/in/sarahchen',
    source: 'ross-alumni',
    status: 'identified',
    notes: 'Met at Ross alumni event 2019'
};

const linkedInMessage = {
    id: 'linkedin-test-123',
    contactName: 'Sarah Chen',
    lastMessage: 'Hi Luis! Great catching up at the event.',
    timestamp: new Date().toISOString(),
    url: 'https://linkedin.com/messaging/thread/test-thread',
    syncedAt: new Date().toISOString()
};

test.describe('LinkedIn Message Sync', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Clear localStorage for clean state
        await page.evaluate(() => {
            localStorage.clear();
        });
    });

    test('should create new contact from LinkedIn message', async ({ page }) => {
        // Inject LinkedIn conversation data
        await page.evaluate((message) => {
            const data = [{
                linkedin_conversations: [message]
            }];
            window.SyncManager.importLinkedInConversations(data[0].linkedin_conversations);
        }, linkedInMessage);

        // Wait for UI to update
        await page.waitForTimeout(1000);

        // Verify contact was created
        const contactCard = await page.locator('.contact-card').filter({ hasText: 'Sarah Chen' });
        await expect(contactCard).toBeVisible();

        // Verify contact has correct status
        const statusBadge = contactCard.locator('.contact-status-badge');
        await expect(statusBadge).toHaveText('contacted');

        // Open contact modal
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Check Message History tab
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Verify message appears in history
        const messageHistory = page.locator('#message-history-list');
        await expect(messageHistory).toContainText('LinkedIn Message');
        await expect(messageHistory).toContainText(linkedInMessage.lastMessage);

        // Verify message count badge
        const countBadge = page.locator('#message-count-badge');
        await expect(countBadge).toHaveText('1');
    });

    test('should update existing contact with LinkedIn message', async ({ page }) => {
        // First, create a contact
        await page.evaluate((contact) => {
            const contacts = [{
                id: 'test-123',
                firstName: contact.firstName,
                lastName: contact.lastName,
                name: `${contact.firstName} ${contact.lastName}`,
                title: contact.title,
                company: contact.company,
                email: contact.email,
                linkedin: contact.linkedin,
                source: contact.source,
                status: contact.status,
                notes: contact.notes,
                addedDate: new Date().toISOString(),
                messageHistory: [],
                outreach: []
            }];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
            if (typeof updateAllDisplays === 'function') {
                updateAllDisplays();
            }
        }, testContact);

        await page.waitForTimeout(1000);

        // Now sync LinkedIn message
        await page.evaluate((message) => {
            const data = [{
                linkedin_conversations: [message]
            }];
            window.SyncManager.importLinkedInConversations(data[0].linkedin_conversations);
        }, linkedInMessage);

        await page.waitForTimeout(1000);

        // Open contact modal
        const contactCard = await page.locator('.contact-card').filter({ hasText: 'Sarah Chen' });
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Check Message History
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Verify message was added
        const countBadge = page.locator('#message-count-badge');
        await expect(countBadge).toHaveText('1');

        const messageHistory = page.locator('#message-history-list');
        await expect(messageHistory).toContainText('LinkedIn Message');
        await expect(messageHistory).toContainText(linkedInMessage.lastMessage);

        // Verify last contact date was updated
        await page.click('#contact-details-tab');
        await page.waitForTimeout(500);

        const lastContactValue = await page.evaluate(() => {
            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            return contacts[0]?.lastContact;
        });
        expect(lastContactValue).toBeTruthy();
    });

    test('should prevent duplicate LinkedIn messages', async ({ page }) => {
        // Sync same message twice
        await page.evaluate((message) => {
            const data = [{
                linkedin_conversations: [message]
            }];
            // First sync
            window.SyncManager.importLinkedInConversations(data[0].linkedin_conversations);
            // Second sync (duplicate)
            window.SyncManager.importLinkedInConversations(data[0].linkedin_conversations);
        }, linkedInMessage);

        await page.waitForTimeout(1000);

        // Open contact modal
        const contactCard = await page.locator('.contact-card').filter({ hasText: 'Sarah Chen' });
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Check Message History
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Verify only 1 message (no duplicates)
        const countBadge = page.locator('#message-count-badge');
        await expect(countBadge).toHaveText('1');

        const messageCards = await page.locator('#message-history-list > div').count();
        expect(messageCards).toBe(1);
    });
});

test.describe('AI Panel Integration', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Clear and setup test data
        await page.evaluate((contact) => {
            localStorage.clear();
            const contacts = [{
                id: 'test-123',
                firstName: contact.firstName,
                lastName: contact.lastName,
                name: `${contact.firstName} ${contact.lastName}`,
                title: contact.title,
                company: contact.company,
                email: contact.email,
                linkedin: contact.linkedin,
                source: contact.source,
                status: contact.status,
                notes: contact.notes,
                addedDate: new Date().toISOString(),
                messageHistory: [],
                outreach: []
            }];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
            if (typeof updateAllDisplays === 'function') {
                updateAllDisplays();
            }
        }, testContact);

        await page.waitForTimeout(1000);
    });

    test('should open AI panel from compose button', async ({ page }) => {
        // Click compose button
        const composeBtn = page.locator('.btn-compose').first();
        await composeBtn.click();

        // Wait for panel animation
        await page.waitForTimeout(500);

        // Verify panel is visible
        const aiPanel = page.locator('#ai-panel');
        await expect(aiPanel).toHaveClass(/open/);

        // Verify contact context is displayed
        const contactName = page.locator('#panel-contact-name');
        await expect(contactName).toContainText('Sarah Chen');

        const contactTitle = page.locator('#panel-contact-title');
        await expect(contactTitle).toContainText('VP of Product');

        const contactCompany = page.locator('#panel-contact-company');
        await expect(contactCompany).toContainText('Stripe');
    });

    test('should open AI panel with Cmd+K shortcut', async ({ page }) => {
        // Press Cmd+K (or Ctrl+K on Windows)
        const isMac = process.platform === 'darwin';
        await page.keyboard.press(isMac ? 'Meta+KeyK' : 'Control+KeyK');

        // Wait for panel animation
        await page.waitForTimeout(500);

        // Verify panel is visible
        const aiPanel = page.locator('#ai-panel');
        await expect(aiPanel).toHaveClass(/open/);
    });

    test('should close AI panel with Escape key', async ({ page }) => {
        // Open panel first
        const composeBtn = page.locator('.btn-compose').first();
        await composeBtn.click();
        await page.waitForTimeout(500);

        // Press Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Verify panel is hidden
        const aiPanel = page.locator('#ai-panel');
        await expect(aiPanel).not.toHaveClass(/open/);
    });

    test('should close AI panel with X button', async ({ page }) => {
        // Open panel
        const composeBtn = page.locator('.btn-compose').first();
        await composeBtn.click();
        await page.waitForTimeout(500);

        // Click close button
        await page.click('#ai-panel-close');
        await page.waitForTimeout(500);

        // Verify panel is hidden
        const aiPanel = page.locator('#ai-panel');
        await expect(aiPanel).not.toHaveClass(/open/);
    });

    test('should show error when AI not configured', async ({ page }) => {
        // Open AI panel
        const composeBtn = page.locator('.btn-compose').first();
        await composeBtn.click();
        await page.waitForTimeout(500);

        // Try to generate without API key
        await page.click('#generate-button');
        await page.waitForTimeout(1000);

        // Verify error message
        const output = page.locator('#ai-output');
        await expect(output).toContainText('AI not configured');
        await expect(output).toContainText('Please add your AI API key');

        // Verify "Open Settings" button exists
        const settingsBtn = output.locator('button', { hasText: 'Open Settings' });
        await expect(settingsBtn).toBeVisible();
    });
});

test.describe('Message History & Response Tracking', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Setup contact with message history
        await page.evaluate((contact) => {
            localStorage.clear();
            const contacts = [{
                id: 'test-123',
                firstName: contact.firstName,
                lastName: contact.lastName,
                name: `${contact.firstName} ${contact.lastName}`,
                title: contact.title,
                company: contact.company,
                email: contact.email,
                messageHistory: [
                    {
                        id: 'msg-1',
                        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                        type: 'email-followup',
                        subject: 'Re: Product opportunity',
                        body: 'Hi Sarah, following up on our conversation...',
                        sentVia: 'personal',
                        aiGenerated: true,
                        responded: false,
                        responseDate: null
                    },
                    {
                        id: 'msg-2',
                        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                        type: 'linkedin-message',
                        subject: 'LinkedIn Message',
                        body: 'Great seeing you at the event!',
                        sentVia: 'linkedin',
                        aiGenerated: false,
                        responded: true,
                        responseDate: new Date(Date.now() - 86400000).toISOString()
                    }
                ],
                outreach: []
            }];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
            if (typeof updateAllDisplays === 'function') {
                updateAllDisplays();
            }
        }, testContact);

        await page.waitForTimeout(1000);
    });

    test('should display message history timeline', async ({ page }) => {
        // Open contact modal
        const contactCard = await page.locator('.contact-card').first();
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Switch to Message History tab
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Verify message count badge
        const countBadge = page.locator('#message-count-badge');
        await expect(countBadge).toHaveText('2');

        // Verify both messages are displayed
        const messageList = page.locator('#message-history-list');
        await expect(messageList).toContainText('Re: Product opportunity');
        await expect(messageList).toContainText('Great seeing you at the event');

        // Verify message icons
        await expect(messageList).toContainText('📧'); // Personal email
        await expect(messageList).toContainText('🔗'); // LinkedIn
    });

    test('should toggle response status', async ({ page }) => {
        // Open contact modal
        const contactCard = await page.locator('.contact-card').first();
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Switch to Message History tab
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Find first message (unresponded)
        const firstMessageToggle = page.locator('#message-history-list button').first();
        await expect(firstMessageToggle).toContainText('Mark as Responded');

        // Click to mark as responded
        await firstMessageToggle.click();
        await page.waitForTimeout(500);

        // Verify status changed
        await expect(firstMessageToggle).toContainText('✓ Responded');

        // Verify data was saved
        const messageData = await page.evaluate(() => {
            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            return contacts[0]?.messageHistory[0];
        });
        expect(messageData.responded).toBe(true);
        expect(messageData.responseDate).toBeTruthy();

        // Click again to mark as unresponded
        await firstMessageToggle.click();
        await page.waitForTimeout(500);

        await expect(firstMessageToggle).toContainText('Mark as Responded');
    });

    test('should show empty state when no messages', async ({ page }) => {
        // Update contact to have no messages
        await page.evaluate(() => {
            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            contacts[0].messageHistory = [];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
            if (typeof updateAllDisplays === 'function') {
                updateAllDisplays();
            }
        });

        await page.waitForTimeout(1000);

        // Open contact modal
        const contactCard = await page.locator('.contact-card').first();
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Switch to Message History tab
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Verify empty state
        const countBadge = page.locator('#message-count-badge');
        await expect(countBadge).toHaveText('0');

        const messageList = page.locator('#message-history-list');
        await expect(messageList).toContainText('No messages sent yet');
    });
});

test.describe('Analytics Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Setup multiple contacts with varied message history
        await page.evaluate(() => {
            localStorage.clear();
            const contacts = [
                {
                    id: 'contact-1',
                    name: 'Sarah Chen',
                    messageHistory: [
                        {
                            id: 'msg-1',
                            date: new Date().toISOString(),
                            type: 'email-followup',
                            subject: 'Follow up',
                            body: 'Test',
                            sentVia: 'personal',
                            aiGenerated: true,
                            responded: true,
                            responseDate: new Date().toISOString()
                        }
                    ]
                },
                {
                    id: 'contact-2',
                    name: 'John Smith',
                    messageHistory: [
                        {
                            id: 'msg-2',
                            date: new Date().toISOString(),
                            type: 'linkedin-message',
                            subject: 'LinkedIn',
                            body: 'Test',
                            sentVia: 'linkedin',
                            aiGenerated: false,
                            responded: false,
                            responseDate: null
                        },
                        {
                            id: 'msg-3',
                            date: new Date().toISOString(),
                            type: 'initial-outreach',
                            subject: 'Introduction',
                            body: 'Test',
                            sentVia: 'work',
                            aiGenerated: true,
                            responded: false,
                            responseDate: null
                        }
                    ]
                }
            ];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
        });

        await page.waitForTimeout(1000);
    });

    test('should display correct message analytics', async ({ page }) => {
        // Navigate to Analytics tab
        await page.click('text=Analytics');
        await page.waitForTimeout(1000);

        // Scroll to message analytics section
        const analyticsSection = page.locator('#message-analytics');
        await analyticsSection.scrollIntoViewIfNeeded();

        // Verify Total Messages
        const totalMessages = analyticsSection.locator('div', { hasText: 'Total Messages' });
        await expect(totalMessages).toContainText('3');

        // Verify AI Generated count
        const aiGenerated = analyticsSection.locator('div', { hasText: 'AI Generated' });
        await expect(aiGenerated).toContainText('2');

        // Verify Response Rate (1 out of 3 = 33%)
        const responseRate = analyticsSection.locator('div', { hasText: 'Response Rate' });
        await expect(responseRate).toContainText('33%');
    });

    test('should update analytics when response status changes', async ({ page }) => {
        // Navigate to Analytics tab first to get baseline
        await page.click('text=Analytics');
        await page.waitForTimeout(1000);

        // Go to Contacts tab
        await page.click('text=CRM');
        await page.waitForTimeout(500);

        // Open first contact
        const contactCard = await page.locator('.contact-card').first();
        await contactCard.click();
        await page.waitForSelector('#contact-modal.active');

        // Switch to Message History tab
        await page.click('#message-history-tab');
        await page.waitForTimeout(500);

        // Toggle response on first message
        const toggleBtn = page.locator('#message-history-list button').first();
        await toggleBtn.click();
        await page.waitForTimeout(500);

        // Close modal
        await page.click('#contact-modal .modal-header button');
        await page.waitForTimeout(500);

        // Go back to Analytics
        await page.click('text=Analytics');
        await page.waitForTimeout(1000);

        // Verify response rate updated (should be 67% now: 2/3)
        const analyticsSection = page.locator('#message-analytics');
        const responseRate = analyticsSection.locator('div', { hasText: 'Response Rate' });
        await expect(responseRate).toContainText('67%');
    });
});

test.describe('Mobile Responsive Design', () => {
    test.use({
        viewport: { width: 375, height: 667 } // iPhone SE size
    });

    test('should display mobile AI panel correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Setup test contact
        await page.evaluate(() => {
            localStorage.clear();
            const contacts = [{
                id: 'test-123',
                name: 'Sarah Chen',
                title: 'VP of Product',
                company: 'Stripe',
                email: 'sarah@stripe.com'
            }];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
            if (typeof updateAllDisplays === 'function') {
                updateAllDisplays();
            }
        });

        await page.waitForTimeout(1000);

        // Click compose button
        const composeBtn = page.locator('.btn-compose').first();
        await composeBtn.click();
        await page.waitForTimeout(500);

        // Verify backdrop is visible
        const backdrop = page.locator('#ai-panel-backdrop');
        await expect(backdrop).toHaveClass(/open/);

        // Verify panel is full-screen
        const aiPanel = page.locator('#ai-panel');
        const panelBox = await aiPanel.boundingBox();
        expect(panelBox?.width).toBeGreaterThanOrEqual(375); // Full width
        expect(panelBox?.height).toBeGreaterThanOrEqual(667); // Full height

        // Verify close button is large enough (48px x 48px)
        const closeBtn = page.locator('#ai-panel-close');
        const closeBox = await closeBtn.boundingBox();
        expect(closeBox?.width).toBeGreaterThanOrEqual(48);
        expect(closeBox?.height).toBeGreaterThanOrEqual(48);

        // Verify body scroll is locked
        const bodyOverflow = await page.evaluate(() => {
            return document.body.style.overflow;
        });
        expect(bodyOverflow).toBe('hidden');
    });

    test('should have adequate touch targets on mobile', async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Setup test contact
        await page.evaluate(() => {
            localStorage.clear();
            const contacts = [{
                id: 'test-123',
                name: 'Sarah Chen',
                title: 'VP of Product',
                company: 'Stripe',
                email: 'sarah@stripe.com'
            }];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
            if (typeof updateAllDisplays === 'function') {
                updateAllDisplays();
            }
        });

        await page.waitForTimeout(1000);

        // Check compose button size (should be >= 44px)
        const composeBtn = page.locator('.btn-compose').first();
        const composeBox = await composeBtn.boundingBox();
        expect(composeBox?.height).toBeGreaterThanOrEqual(44);

        // Open AI panel
        await composeBtn.click();
        await page.waitForTimeout(500);

        // Check generate button size
        const generateBtn = page.locator('#generate-button');
        const generateBox = await generateBtn.boundingBox();
        expect(generateBox?.height).toBeGreaterThanOrEqual(44);
    });
});

test.describe('Data Persistence', () => {
    test('should persist changes to localStorage', async ({ page }) => {
        await page.goto(`${BASE_URL}/job-search-dashboard.html`);
        await page.waitForLoadState('networkidle');

        // Clear and add test contact
        await page.evaluate(() => {
            localStorage.clear();
            const contacts = [{
                id: 'test-123',
                name: 'Sarah Chen',
                messageHistory: []
            }];
            localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
        });

        // Sync LinkedIn message
        await page.evaluate(() => {
            const message = {
                id: 'linkedin-test-123',
                contactName: 'Sarah Chen',
                lastMessage: 'Test message',
                timestamp: new Date().toISOString(),
                syncedAt: new Date().toISOString()
            };
            window.SyncManager.importLinkedInConversations([message]);
        });

        await page.waitForTimeout(1000);

        // Verify data in localStorage
        const savedData = await page.evaluate(() => {
            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            return contacts[0];
        });

        expect(savedData.messageHistory).toHaveLength(1);
        expect(savedData.messageHistory[0].type).toBe('linkedin-message');
        expect(savedData.messageHistory[0].body).toBe('Test message');

        // Reload page
        await page.reload();
        await page.waitForLoadState('networkidle');

        // Verify data persisted
        const reloadedData = await page.evaluate(() => {
            const contacts = JSON.parse(localStorage.getItem('jobSearchContacts') || '[]');
            return contacts[0];
        });

        expect(reloadedData.messageHistory).toHaveLength(1);
        expect(reloadedData.messageHistory[0].body).toBe('Test message');
    });
});
