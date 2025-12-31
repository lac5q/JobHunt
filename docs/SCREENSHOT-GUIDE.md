# Screenshot Generation Guide

## Quick Start

```bash
# Test Playwright setup
npm run test:playwright

# Generate all screenshots (recommended - with error handling)
npm run screenshots:safe

# Generate all screenshots (original version)
npm run screenshots
```

## Available Scripts

### 1. Test Playwright Setup
**Command:** `npm run test:playwright`
**File:** `docs/test-playwright.js`
**Purpose:** Verify Playwright is installed and working correctly

**Output:**
```
Testing Playwright setup...

✓ Chromium browser launched successfully
✓ New page created
✓ Viewport set to 1920x1080
✓ Navigated to example.com
✓ Page title: "Example Domain"
✓ Browser closed successfully

🎉 Playwright is working correctly!
You can now run: npm run screenshots
```

### 2. Generate Screenshots (Safe Mode)
**Command:** `npm run screenshots:safe`
**File:** `docs/generate-screenshots-safe.js`
**Purpose:** Generate all documentation screenshots with comprehensive error handling

**Features:**
- Detailed progress logging with emojis
- Error recovery and graceful degradation
- File size reporting for each screenshot
- Success/failure summary
- Automatic directory creation
- Validation of file paths

**Output Example:**
```
╔════════════════════════════════════════════════════════════╗
║        Screenshot Generation for Job Search Dashboard      ║
╚════════════════════════════════════════════════════════════╝

✓ Created directory: /Users/lcalderon/github/JobHunt/docs/screenshots
✓ Browser launched

═══════════════════════════════════════════════════════════
  Desktop Screenshots (1920x1080)
═══════════════════════════════════════════════════════════

[1/12] Main Dashboard View
  ✓ Test data injected
  ✓ Main dashboard view (default tab)
    → 01-dashboard-main-desktop.png (245.3 KB)

[2/12] Contacts CRM View
  ✓ Contacts CRM with AI panel closed
    → 02-contacts-crm-desktop.png (198.7 KB)

...

═══════════════════════════════════════════════════════════
  Summary
═══════════════════════════════════════════════════════════

  Screenshots generated: 12/12
  Output directory: /Users/lcalderon/github/JobHunt/docs/screenshots

🎉 All screenshots generated successfully!

Next steps:
  1. Review screenshots in docs/screenshots/
  2. Use in documentation or presentations
  3. Set up visual regression testing (optional)
```

### 3. Generate Screenshots (Standard)
**Command:** `npm run screenshots`
**File:** `docs/generate-screenshots.js`
**Purpose:** Original screenshot generation script (simpler, less verbose)

## Screenshot Specifications

### Desktop Screenshots (1920x1080)

| # | Filename | Description |
|---|----------|-------------|
| 1 | `01-dashboard-main-desktop.png` | Main dashboard with stats, priority tasks, and quick actions |
| 2 | `02-contacts-crm-desktop.png` | Contacts CRM table view with AI panel closed |
| 3 | `03-ai-panel-open-desktop.png` | AI message generator panel with contact context loaded |
| 4 | `04-ai-panel-gmail-history-desktop.png` | AI panel showing Gmail message history with dual accounts |
| 5 | `05-message-generating-desktop.png` | Loading state during message generation |
| 6 | `06-message-generated-desktop.png` | Generated message with copy and Gmail buttons |
| 7 | `07-contact-modal-history-desktop.png` | Contact details modal with message history tab |
| 8 | `08-analytics-tab-desktop.png` | Analytics view with message performance metrics |

### Mobile Screenshots (375x667 - iPhone SE)

| # | Filename | Description |
|---|----------|-------------|
| 1 | `01-dashboard-main-mobile.png` | Mobile dashboard with responsive layout |
| 2 | `02-contacts-crm-mobile.png` | Mobile contacts CRM view |
| 3 | `03-ai-panel-open-mobile.png` | AI panel on mobile viewport |
| 4 | `04-contact-modal-mobile.png` | Contact modal on mobile |

## Test Data Injected

### Contacts (5 total)

1. **Sarah Johnson** - TechCorp, VP Product Management
   - Status: Responded
   - Tags: ross-alumni, fractional, hot-lead
   - Has message history

2. **Michael Chen** - InnovateLabs, Chief Product Officer
   - Status: Call Scheduled
   - Tags: ai-ml, call-scheduled, warm-lead
   - Has message history

3. **Jennifer Martinez** - DataDrive Inc, Director of Product
   - Status: No Response
   - Tags: product-analytics, follow-up-needed

4. **David Park** - CloudScale, VP of Engineering
   - Status: Interview Scheduled
   - Tags: ross-alumni, interview, hot-lead

5. **Amanda Rodriguez** - FinTech Solutions, Head of Product
   - Status: Responded
   - Tags: fintech, fractional, warm-lead

### Message History

**Sarah Johnson** - 2 messages (sent/received conversation)
- Demonstrates dual Gmail account usage
- Shows complete conversation thread

**Michael Chen** - 1 message (sent)
- Uses secondary email (lcalderon@umich.edu)

### Progress Metrics

- Start Date: 2025-12-01
- Total Contacts: 5
- Responses: 2
- Calls Scheduled: 1
- Interviews: 1
- Offers: 0

## Customization

### Change Viewport Sizes

Edit the viewport settings in either script:

```javascript
// For desktop screenshots
await page.setViewportSize({ width: 1920, height: 1080 });

// For mobile screenshots
await page.setViewportSize({ width: 375, height: 667 });
```

**Common viewport sizes:**
- Desktop: 1920x1080, 1440x900, 1366x768
- Tablet: 768x1024 (iPad), 1024x768 (iPad landscape)
- Mobile: 375x667 (iPhone SE), 390x844 (iPhone 12), 414x896 (iPhone 11)

### Add More Test Contacts

Modify the `testContacts` array in either script:

```javascript
const testContacts = [
  {
    name: 'John Doe',
    company: 'Example Corp',
    title: 'Senior PM',
    email: 'john@example.com',
    phone: '(555) 555-5555',
    linkedin: 'https://linkedin.com/in/johndoe',
    relationship: 'Former Colleague',
    lastContact: '2025-12-12',
    status: 'responded', // or 'no-response', 'call-scheduled', 'interview-scheduled'
    notes: 'Met at conference. Interested in fractional work.',
    tags: ['tag1', 'tag2', 'tag3']
  },
  // ... more contacts
];
```

### Add Message History

Add to the `testMessages` object:

```javascript
const testMessages = {
  'John Doe': [
    {
      date: '2025-12-12T10:00:00',
      type: 'sent', // or 'received'
      subject: 'Message Subject',
      content: 'Message body...',
      gmailAccount: 'luis.calderon@gmail.com' // or 'lcalderon@umich.edu'
    }
  ]
};
```

### Capture Additional Views

Add new screenshot sections in the script:

```javascript
// Example: Capture Pipeline view
console.log('[9/12] Pipeline View');
await safeClick(desktopPage, 'button[data-tab="pipeline"]', 'Pipeline tab');
await desktopPage.waitForTimeout(800);
totalCount++;
if (await takeScreenshot(
  desktopPage,
  '09-pipeline-view-desktop.png',
  'Pipeline view with kanban board'
)) {
  successCount++;
}
console.log();
```

### Adjust Animation Delays

Modify `waitForTimeout` values if animations take longer:

```javascript
await desktopPage.waitForTimeout(1000); // Wait 1 second
await desktopPage.waitForTimeout(2000); // Wait 2 seconds
```

## Troubleshooting

### Error: "Playwright is not installed"

**Solution:**
```bash
npm install
npx playwright install chromium
```

### Error: "Dashboard file not found"

**Cause:** Script expects `job-search-dashboard.html` in parent directory

**Solution:** Ensure you're running from the project root:
```bash
cd /Users/lcalderon/github/JobHunt
npm run screenshots:safe
```

### Error: "Cannot find module 'playwright'"

**Solution:**
```bash
npm install playwright@^1.57.0
```

### Screenshots are blank or incomplete

**Causes:**
- Animations haven't completed
- Elements not rendered yet
- JavaScript errors in dashboard

**Solutions:**
1. Increase wait times:
   ```javascript
   await page.waitForTimeout(2000); // Increase to 2 seconds
   ```

2. Wait for specific elements:
   ```javascript
   await page.waitForSelector('.contact-row', { timeout: 5000 });
   ```

3. Check browser console for errors:
   ```javascript
   page.on('console', msg => console.log('PAGE LOG:', msg.text()));
   ```

### Screenshots too large

**Solution:** Reduce quality or change format:
```javascript
await page.screenshot({
  path: filepath,
  quality: 80, // For JPEG only (0-100)
  type: 'jpeg' // Change from PNG to JPEG
});
```

### Modal or AI panel not opening

**Cause:** Selector changed or element not found

**Solution:** Use the safe mode script which has error handling:
```bash
npm run screenshots:safe
```

Check console output for warnings like:
```
⚠ Could not click .contact-row:first-child .open-ai-btn: element not found
```

## Advanced Usage

### Run in Different Browsers

Modify the browser launch:

```javascript
// Firefox
const { firefox } = require('playwright');
const browser = await firefox.launch({ headless: true });

// WebKit (Safari)
const { webkit } = require('playwright');
const browser = await webkit.launch({ headless: true });
```

### Run with Visible Browser (Debug Mode)

Change `headless` setting:

```javascript
const browser = await chromium.launch({ headless: false, slowMo: 100 });
```

### Save Screenshots with Timestamp

Modify filename generation:

```javascript
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `${timestamp}-dashboard-main.png`;
```

### Capture Full Page Screenshots

Change screenshot options:

```javascript
await page.screenshot({
  path: filepath,
  fullPage: true // Capture entire scrollable page
});
```

### Capture Specific Elements Only

Screenshot a single element:

```javascript
const element = await page.locator('.ai-panel');
await element.screenshot({ path: 'ai-panel-only.png' });
```

## Integration with CI/CD

### GitHub Actions Example

Create `.github/workflows/screenshots.yml`:

```yaml
name: Generate Screenshots

on:
  push:
    branches: [main, master]
  workflow_dispatch:

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Generate screenshots
        run: npm run screenshots:safe

      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: docs/screenshots/
          retention-days: 30
```

## Performance Metrics

- **Execution time:** ~15-20 seconds for all 12 screenshots
- **File sizes:** 100-500 KB per screenshot (PNG format)
- **Total size:** ~2-3 MB for complete set
- **Memory usage:** ~200-300 MB during execution

## File Structure

```
/Users/lcalderon/github/JobHunt/
├── docs/
│   ├── generate-screenshots.js          # Original script
│   ├── generate-screenshots-safe.js     # Enhanced script with error handling
│   ├── test-playwright.js               # Setup verification script
│   ├── README-screenshots.md            # Detailed documentation
│   ├── SCREENSHOT-GUIDE.md             # This file
│   └── screenshots/                     # Output directory
│       ├── 01-dashboard-main-desktop.png
│       ├── 02-contacts-crm-desktop.png
│       ├── ...
│       └── 04-contact-modal-mobile.png
├── job-search-dashboard.html            # Dashboard being captured
└── package.json                         # npm scripts
```

## Best Practices

1. **Run safe mode first:** Use `npm run screenshots:safe` for detailed error reporting
2. **Check test data:** Verify test contacts appear realistic and complete
3. **Review each screenshot:** Manually verify screenshots after generation
4. **Keep scripts updated:** Update selectors if dashboard HTML changes
5. **Version control:** Commit scripts but consider .gitignore for screenshots
6. **Documentation:** Update this guide when adding new screenshot scenarios
7. **Consistent viewports:** Use standard device sizes for better documentation

## Next Steps

After generating screenshots:

1. **Review Quality:** Open each screenshot and verify clarity and content
2. **Update Documentation:** Use screenshots in README.md or wiki
3. **Share with Team:** Include in presentations or design reviews
4. **Visual Regression:** Consider tools like Percy or Chromatic for automated testing
5. **Accessibility:** Use screenshots to validate accessible design patterns
6. **Marketing:** Use for promotional materials or case studies

## Support

If you encounter issues not covered here:

1. Check Playwright documentation: https://playwright.dev
2. Review console output from safe mode script
3. Run test script: `npm run test:playwright`
4. Verify dashboard loads correctly in browser: `open job-search-dashboard.html`
