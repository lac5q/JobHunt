const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Test data for realistic screenshots
const testContacts = [
  {
    name: 'Sarah Johnson',
    company: 'TechCorp',
    title: 'VP Product Management',
    email: 'sarah.johnson@techcorp.com',
    phone: '(415) 555-0123',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    relationship: 'Ross Alumni',
    lastContact: '2025-12-10',
    status: 'responded',
    notes: 'Connected through Ross network. Interested in fractional PM work.',
    tags: ['ross-alumni', 'fractional', 'hot-lead']
  },
  {
    name: 'Michael Chen',
    company: 'InnovateLabs',
    title: 'Chief Product Officer',
    email: 'mchen@innovatelabs.com',
    phone: '(650) 555-0198',
    linkedin: 'https://linkedin.com/in/michaelchen',
    relationship: 'Industry Connection',
    lastContact: '2025-12-08',
    status: 'call-scheduled',
    notes: 'Call scheduled for Dec 15. Discussed AI/ML product strategy.',
    tags: ['ai-ml', 'call-scheduled', 'warm-lead']
  },
  {
    name: 'Jennifer Martinez',
    company: 'DataDrive Inc',
    title: 'Director of Product',
    email: 'jmartinez@datadrive.io',
    phone: '(408) 555-0167',
    linkedin: 'https://linkedin.com/in/jennifermartinez',
    relationship: 'Former Colleague',
    lastContact: '2025-12-05',
    status: 'no-response',
    notes: 'Sent intro message. Follow up in 1 week.',
    tags: ['product-analytics', 'follow-up-needed']
  },
  {
    name: 'David Park',
    company: 'CloudScale',
    title: 'VP of Engineering',
    email: 'dpark@cloudscale.com',
    phone: '(925) 555-0145',
    linkedin: 'https://linkedin.com/in/davidpark',
    relationship: 'Ross Alumni',
    lastContact: '2025-12-11',
    status: 'interview-scheduled',
    notes: 'Interview scheduled for Dec 18. Principal PM role.',
    tags: ['ross-alumni', 'interview', 'hot-lead']
  },
  {
    name: 'Amanda Rodriguez',
    company: 'FinTech Solutions',
    title: 'Head of Product',
    email: 'arodriguez@fintechsolutions.com',
    phone: '(510) 555-0189',
    linkedin: 'https://linkedin.com/in/amandarodriguez',
    relationship: 'LinkedIn Connection',
    lastContact: '2025-12-09',
    status: 'responded',
    notes: 'Interested in discussing fractional opportunities.',
    tags: ['fintech', 'fractional', 'warm-lead']
  }
];

const testMessages = {
  'Sarah Johnson': [
    {
      date: '2025-12-10T10:30:00',
      type: 'sent',
      subject: 'Ross Alumni - Fractional PM Opportunities',
      content: 'Hi Sarah, Hope you\'re doing well! I noticed we\'re both Ross alums and wanted to reach out about potential fractional PM opportunities...',
      gmailAccount: 'luis.calderon@gmail.com'
    },
    {
      date: '2025-12-10T14:45:00',
      type: 'received',
      subject: 'Re: Ross Alumni - Fractional PM Opportunities',
      content: 'Hi Luis! Great to connect with a fellow Wolverine. We\'re actually looking for someone with your background. Let\'s chat next week.',
      gmailAccount: 'luis.calderon@gmail.com'
    }
  ],
  'Michael Chen': [
    {
      date: '2025-12-08T09:15:00',
      type: 'sent',
      subject: 'AI/ML Product Strategy Discussion',
      content: 'Hi Michael, I\'ve been following InnovateLabs\' work in AI/ML and would love to discuss potential collaboration opportunities...',
      gmailAccount: 'lcalderon@umich.edu'
    }
  ]
};

async function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

async function injectTestData(page) {
  try {
    await page.evaluate((contacts) => {
      localStorage.setItem('jobSearchContacts', JSON.stringify(contacts));
      localStorage.setItem('jobSearchProgress', JSON.stringify({
        startDate: '2025-12-01',
        totalContacts: contacts.length,
        responses: contacts.filter(c => c.status === 'responded').length,
        calls: contacts.filter(c => c.status === 'call-scheduled').length,
        interviews: contacts.filter(c => c.status === 'interview-scheduled').length,
        offers: 0
      }));
    }, testContacts);
    console.log('  ✓ Test data injected');
  } catch (error) {
    console.error('  ✗ Failed to inject test data:', error.message);
    throw error;
  }
}

async function injectMessageHistory(page, contactName) {
  if (testMessages[contactName]) {
    try {
      await page.evaluate((data) => {
        const { contactName, messages } = data;
        const key = `messageHistory_${contactName}`;
        localStorage.setItem(key, JSON.stringify(messages));
      }, { contactName, messages: testMessages[contactName] });
      console.log(`  ✓ Message history injected for ${contactName}`);
    } catch (error) {
      console.error(`  ✗ Failed to inject message history for ${contactName}:`, error.message);
    }
  }
}

async function takeScreenshot(page, filename, description) {
  try {
    const filepath = path.join(__dirname, 'screenshots', filename);
    await page.screenshot({ path: filepath, fullPage: false });
    const stats = fs.statSync(filepath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`  ✓ ${description}`);
    console.log(`    → ${filename} (${sizeKB} KB)`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to capture ${filename}:`, error.message);
    return false;
  }
}

async function safeClick(page, selector, description = '') {
  try {
    await page.click(selector, { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn(`  ⚠ Could not click ${description || selector}: ${error.message}`);
    return false;
  }
}

async function generateScreenshots() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        Screenshot Generation for Job Search Dashboard      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const screenshotsDir = path.join(__dirname, 'screenshots');
  await ensureDirectoryExists(screenshotsDir);

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    console.log('✓ Browser launched\n');
  } catch (error) {
    console.error('✗ Failed to launch browser:', error.message);
    console.error('\nMake sure Playwright is installed:');
    console.error('  npm install');
    console.error('  npx playwright install chromium');
    process.exit(1);
  }

  const dashboardPath = path.join(__dirname, '..', 'job-search-dashboard.html');

  if (!fs.existsSync(dashboardPath)) {
    console.error(`✗ Dashboard file not found: ${dashboardPath}`);
    await browser.close();
    process.exit(1);
  }

  const fileUrl = `file://${dashboardPath}`;
  console.log(`Dashboard URL: ${fileUrl}\n`);

  let successCount = 0;
  let totalCount = 0;

  // Desktop screenshots
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Desktop Screenshots (1920x1080)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1920, height: 1080 });

  try {
    // 1. Main dashboard view
    console.log('[1/12] Main Dashboard View');
    await desktopPage.goto(fileUrl, { waitUntil: 'networkidle' });
    await injectTestData(desktopPage);
    await desktopPage.reload({ waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(1000);
    totalCount++;
    if (await takeScreenshot(desktopPage, '01-dashboard-main-desktop.png', 'Main dashboard view (default tab)')) {
      successCount++;
    }
    console.log();

    // 2. Contacts CRM
    console.log('[2/12] Contacts CRM View');
    if (await safeClick(desktopPage, 'button[data-tab="contacts"]', 'Contacts tab')) {
      await desktopPage.waitForTimeout(800);
      totalCount++;
      if (await takeScreenshot(desktopPage, '02-contacts-crm-desktop.png', 'Contacts CRM with AI panel closed')) {
        successCount++;
      }
    }
    console.log();

    // 3. AI Panel Open
    console.log('[3/12] AI Panel Open');
    const contactRow = await desktopPage.locator('.contact-row:first-child .open-ai-btn').count();
    if (contactRow > 0) {
      await safeClick(desktopPage, '.contact-row:first-child .open-ai-btn', 'AI panel button');
      await desktopPage.waitForTimeout(800);
      totalCount++;
      if (await takeScreenshot(desktopPage, '03-ai-panel-open-desktop.png', 'AI panel open with contact context')) {
        successCount++;
      }
    } else {
      console.log('  ⚠ No contact rows found, skipping AI panel screenshot');
    }
    console.log();

    // 4. Gmail History
    console.log('[4/12] Gmail History View');
    await injectMessageHistory(desktopPage, 'Sarah Johnson');
    await desktopPage.reload({ waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(500);
    await safeClick(desktopPage, 'button[data-tab="contacts"]');
    await desktopPage.waitForTimeout(500);
    await safeClick(desktopPage, '.contact-row:first-child .open-ai-btn');
    await desktopPage.waitForTimeout(1000);

    const gmailSection = await desktopPage.locator('#gmail-history-container summary').count();
    if (gmailSection > 0) {
      await safeClick(desktopPage, '#gmail-history-container summary', 'Gmail history');
      await desktopPage.waitForTimeout(500);
    }
    totalCount++;
    if (await takeScreenshot(desktopPage, '04-ai-panel-gmail-history-desktop.png', 'AI panel with Gmail history')) {
      successCount++;
    }
    console.log();

    // 5. Message Generating
    console.log('[5/12] Message Generation (Loading)');
    await desktopPage.evaluate(() => {
      const generateBtn = document.querySelector('#ai-generate-btn');
      if (generateBtn) {
        generateBtn.textContent = 'Generating...';
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.6';
      }
      const output = document.querySelector('#ai-output-area');
      if (output) {
        output.innerHTML = '<div style="display: flex; align-items: center; gap: 10px; color: #667eea;"><div style="width: 20px; height: 20px; border: 3px solid #667eea; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div><span>Generating your personalized message...</span></div>';
      }
    });
    await desktopPage.waitForTimeout(500);
    totalCount++;
    if (await takeScreenshot(desktopPage, '05-message-generating-desktop.png', 'Message generation loading state')) {
      successCount++;
    }
    console.log();

    // 6. Message Generated
    console.log('[6/12] Generated Message');
    await desktopPage.evaluate(() => {
      const output = document.querySelector('#ai-output-area');
      if (output) {
        output.innerHTML = `
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
            <h4 style="margin-bottom: 12px; color: #667eea;">Generated Message</h4>
            <p style="margin-bottom: 12px;">Subject: Fellow Wolverine - Exploring Fractional PM Opportunities</p>
            <div style="white-space: pre-wrap; line-height: 1.6;">Hi Sarah,

I hope this message finds you well! I noticed we're both part of the Ross family, and I wanted to reach out about potential fractional PM opportunities.

With 15+ years of experience in AI/ML product strategy and a track record of driving 8-figure revenue growth, I'm exploring fractional consulting engagements while building my full-time pipeline.

I'd love to learn more about TechCorp's product initiatives and discuss how my expertise in data analytics and AI could add value to your team.

Would you be open to a brief call next week?

Best regards,
Luis Calderon</div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <button style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px;">Copy to Clipboard</button>
              <button style="background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer;">Open in Gmail</button>
            </div>
          </div>
        `;
      }
      const generateBtn = document.querySelector('#ai-generate-btn');
      if (generateBtn) {
        generateBtn.textContent = 'Generate Message';
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
      }
    });
    await desktopPage.waitForTimeout(500);
    totalCount++;
    if (await takeScreenshot(desktopPage, '06-message-generated-desktop.png', 'Generated message displayed')) {
      successCount++;
    }
    console.log();

    // 7. Contact Modal
    console.log('[7/12] Contact Modal with History');
    await safeClick(desktopPage, '#ai-panel-close', 'Close AI panel');
    await desktopPage.waitForTimeout(500);
    await safeClick(desktopPage, '.contact-row:first-child', 'First contact row');
    await desktopPage.waitForTimeout(800);

    const historyTab = await desktopPage.locator('#message-history-tab').count();
    if (historyTab > 0) {
      await safeClick(desktopPage, '#message-history-tab', 'Message history tab');
      await desktopPage.waitForTimeout(500);
    }
    totalCount++;
    if (await takeScreenshot(desktopPage, '07-contact-modal-history-desktop.png', 'Contact modal with message history')) {
      successCount++;
    }
    console.log();

    // Close modal
    await safeClick(desktopPage, '.modal-close', 'Close modal');
    await desktopPage.waitForTimeout(500);

    // 8. Analytics
    console.log('[8/12] Analytics View');
    await safeClick(desktopPage, 'button[data-tab="analytics"]', 'Analytics tab');
    await desktopPage.waitForTimeout(800);
    totalCount++;
    if (await takeScreenshot(desktopPage, '08-analytics-tab-desktop.png', 'Analytics tab view')) {
      successCount++;
    }
    console.log();

    await desktopPage.close();

    // Mobile screenshots
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  Mobile Screenshots (375x667)');
    console.log('═══════════════════════════════════════════════════════════\n');

    const mobilePage = await browser.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });

    // 9. Mobile Dashboard
    console.log('[9/12] Mobile Dashboard');
    await mobilePage.goto(fileUrl, { waitUntil: 'networkidle' });
    await injectTestData(mobilePage);
    await mobilePage.reload({ waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);
    totalCount++;
    if (await takeScreenshot(mobilePage, '01-dashboard-main-mobile.png', 'Main dashboard (mobile)')) {
      successCount++;
    }
    console.log();

    // 10. Mobile Contacts
    console.log('[10/12] Mobile Contacts CRM');
    await safeClick(mobilePage, 'button[data-tab="contacts"]', 'Contacts tab');
    await mobilePage.waitForTimeout(800);
    totalCount++;
    if (await takeScreenshot(mobilePage, '02-contacts-crm-mobile.png', 'Contacts CRM (mobile)')) {
      successCount++;
    }
    console.log();

    // 11. Mobile AI Panel
    console.log('[11/12] Mobile AI Panel');
    const mobileContactRow = await mobilePage.locator('.contact-row:first-child .open-ai-btn').count();
    if (mobileContactRow > 0) {
      await safeClick(mobilePage, '.contact-row:first-child .open-ai-btn', 'AI panel');
      await mobilePage.waitForTimeout(800);
      totalCount++;
      if (await takeScreenshot(mobilePage, '03-ai-panel-open-mobile.png', 'AI panel (mobile)')) {
        successCount++;
      }
    }
    console.log();

    // 12. Mobile Contact Modal
    console.log('[12/12] Mobile Contact Modal');
    await safeClick(mobilePage, '#ai-panel-close', 'Close AI panel');
    await mobilePage.waitForTimeout(500);
    await safeClick(mobilePage, '.contact-row:first-child', 'First contact');
    await mobilePage.waitForTimeout(800);
    totalCount++;
    if (await takeScreenshot(mobilePage, '04-contact-modal-mobile.png', 'Contact modal (mobile)')) {
      successCount++;
    }
    console.log();

    await mobilePage.close();

  } catch (error) {
    console.error('\n✗ Error during screenshot generation:', error.message);
    console.error(error.stack);
  }

  await browser.close();

  // Summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Summary');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`  Screenshots generated: ${successCount}/${totalCount}`);
  console.log(`  Output directory: ${screenshotsDir}\n`);

  if (successCount === totalCount) {
    console.log('🎉 All screenshots generated successfully!\n');
  } else {
    console.log(`⚠  ${totalCount - successCount} screenshot(s) failed\n`);
  }

  console.log('Next steps:');
  console.log('  1. Review screenshots in docs/screenshots/');
  console.log('  2. Use in documentation or presentations');
  console.log('  3. Set up visual regression testing (optional)\n');
}

// Run the screenshot generation
generateScreenshots().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
