const { chromium } = require('playwright');
const path = require('path');

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

async function injectTestData(page) {
  await page.evaluate((contacts) => {
    // Initialize localStorage with test data
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
}

async function injectMessageHistory(page, contactName) {
  if (testMessages[contactName]) {
    await page.evaluate((data) => {
      const { contactName, messages } = data;
      const key = `messageHistory_${contactName}`;
      localStorage.setItem(key, JSON.stringify(messages));
    }, { contactName, messages: testMessages[contactName] });
  }
}

async function takeScreenshot(page, filename, description) {
  const filepath = path.join(__dirname, 'screenshots', filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`✓ Captured: ${description} -> ${filename}`);
}

async function generateScreenshots() {
  console.log('Starting screenshot generation...\n');

  const browser = await chromium.launch({ headless: true });
  const dashboardPath = path.join(__dirname, '..', 'job-search-dashboard.html');
  const fileUrl = `file://${dashboardPath}`;

  // Desktop screenshots
  console.log('=== Desktop Screenshots (1920x1080) ===\n');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1920, height: 1080 });

  // 1. Main dashboard view
  await desktopPage.goto(fileUrl);
  await injectTestData(desktopPage);
  await desktopPage.reload();
  await desktopPage.waitForTimeout(1000); // Let animations complete
  await takeScreenshot(
    desktopPage,
    '01-dashboard-main-desktop.png',
    'Main dashboard view (default tab)'
  );

  // 2. Contacts CRM with AI panel closed
  await desktopPage.click('button[data-tab="contacts"]');
  await desktopPage.waitForTimeout(800);
  await takeScreenshot(
    desktopPage,
    '02-contacts-crm-desktop.png',
    'Contacts CRM with AI panel closed'
  );

  // 3. Open AI panel with contact context loaded
  await desktopPage.click('.contact-row:first-child .open-ai-btn');
  await desktopPage.waitForTimeout(800);
  await takeScreenshot(
    desktopPage,
    '03-ai-panel-open-desktop.png',
    'AI panel open with contact context loaded'
  );

  // 4. AI panel with Gmail history showing dual accounts
  // Inject message history for the first contact
  await injectMessageHistory(desktopPage, 'Sarah Johnson');
  await desktopPage.reload();
  await desktopPage.waitForTimeout(500);
  await desktopPage.click('button[data-tab="contacts"]');
  await desktopPage.waitForTimeout(500);
  await desktopPage.click('.contact-row:first-child .open-ai-btn');
  await desktopPage.waitForTimeout(1000);

  // Expand Gmail history section
  const gmailSectionExists = await desktopPage.locator('#gmail-history-container').count() > 0;
  if (gmailSectionExists) {
    await desktopPage.click('#gmail-history-container summary');
    await desktopPage.waitForTimeout(500);
  }

  await takeScreenshot(
    desktopPage,
    '04-ai-panel-gmail-history-desktop.png',
    'AI panel with Gmail history showing dual accounts'
  );

  // 5. Message generation in progress (loading state)
  await desktopPage.evaluate(() => {
    // Simulate loading state
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
  await takeScreenshot(
    desktopPage,
    '05-message-generating-desktop.png',
    'Message generation in progress (loading state)'
  );

  // 6. Generated message displayed
  await desktopPage.evaluate(() => {
    const output = document.querySelector('#ai-output-area');
    if (output) {
      output.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
          <h4 style="margin-bottom: 12px; color: #667eea;">Generated Message</h4>
          <p style="margin-bottom: 12px;">Subject: Fellow Wolverine - Exploring Fractional PM Opportunities</p>
          <div style="white-space: pre-wrap; line-height: 1.6;">
Hi Sarah,

I hope this message finds you well! I noticed we're both part of the Ross family, and I wanted to reach out about potential fractional PM opportunities.

With 15+ years of experience in AI/ML product strategy and a track record of driving 8-figure revenue growth, I'm exploring fractional consulting engagements while building my full-time pipeline.

I'd love to learn more about TechCorp's product initiatives and discuss how my expertise in data analytics and AI could add value to your team.

Would you be open to a brief call next week?

Best regards,
Luis Calderon
          </div>
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
  await takeScreenshot(
    desktopPage,
    '06-message-generated-desktop.png',
    'Generated message displayed'
  );

  // 7. Contact modal with message history tab
  await desktopPage.click('#ai-panel-close');
  await desktopPage.waitForTimeout(500);
  await desktopPage.click('.contact-row:first-child');
  await desktopPage.waitForTimeout(800);

  // Switch to message history tab
  const historyTab = await desktopPage.locator('#message-history-tab').count();
  if (historyTab > 0) {
    await desktopPage.click('#message-history-tab');
    await desktopPage.waitForTimeout(500);
  }

  await takeScreenshot(
    desktopPage,
    '07-contact-modal-history-desktop.png',
    'Contact modal with message history tab'
  );

  // Close modal
  await desktopPage.click('.modal-close');
  await desktopPage.waitForTimeout(500);

  // 8. Analytics tab showing message analytics
  await desktopPage.click('button[data-tab="analytics"]');
  await desktopPage.waitForTimeout(800);
  await takeScreenshot(
    desktopPage,
    '08-analytics-tab-desktop.png',
    'Analytics tab showing message analytics'
  );

  await desktopPage.close();

  // Mobile screenshots
  console.log('\n=== Mobile Screenshots (375x667) ===\n');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 667 });

  // 1. Main dashboard view (mobile)
  await mobilePage.goto(fileUrl);
  await injectTestData(mobilePage);
  await mobilePage.reload();
  await mobilePage.waitForTimeout(1000);
  await takeScreenshot(
    mobilePage,
    '01-dashboard-main-mobile.png',
    'Main dashboard view (mobile)'
  );

  // 2. Contacts CRM (mobile)
  await mobilePage.click('button[data-tab="contacts"]');
  await mobilePage.waitForTimeout(800);
  await takeScreenshot(
    mobilePage,
    '02-contacts-crm-mobile.png',
    'Contacts CRM (mobile)'
  );

  // 3. AI panel open (mobile)
  await mobilePage.click('.contact-row:first-child .open-ai-btn');
  await mobilePage.waitForTimeout(800);
  await takeScreenshot(
    mobilePage,
    '03-ai-panel-open-mobile.png',
    'AI panel open (mobile)'
  );

  // 4. Contact modal (mobile)
  await mobilePage.click('#ai-panel-close');
  await mobilePage.waitForTimeout(500);
  await mobilePage.click('.contact-row:first-child');
  await mobilePage.waitForTimeout(800);
  await takeScreenshot(
    mobilePage,
    '04-contact-modal-mobile.png',
    'Contact modal (mobile)'
  );

  await mobilePage.close();

  console.log('\n=== Screenshot Generation Complete ===');
  console.log(`Total screenshots: 12`);
  console.log(`Location: /Users/lcalderon/github/JobHunt/docs/screenshots/`);

  await browser.close();
}

// Run the screenshot generation
generateScreenshots().catch((error) => {
  console.error('Error generating screenshots:', error);
  process.exit(1);
});
