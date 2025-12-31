# Screenshot Generation Documentation

## Overview

Automated screenshot generation for the Job Search Dashboard using Playwright. This script captures comprehensive views of the dashboard across desktop and mobile viewports for documentation purposes.

## Prerequisites

- Node.js 18+ installed
- Playwright installed (`npm install`)

## Running Screenshot Generation

```bash
# From project root
npm run screenshots

# Or directly
node docs/generate-screenshots.js
```

## Generated Screenshots

### Desktop (1920x1080)

1. **01-dashboard-main-desktop.png** - Main dashboard view with stats and priority tasks
2. **02-contacts-crm-desktop.png** - Contacts CRM view with AI panel closed
3. **03-ai-panel-open-desktop.png** - AI message generator panel open with contact context
4. **04-ai-panel-gmail-history-desktop.png** - AI panel showing Gmail message history with dual accounts
5. **05-message-generating-desktop.png** - Message generation loading state
6. **06-message-generated-desktop.png** - Generated message with copy and send options
7. **07-contact-modal-history-desktop.png** - Contact modal showing message history tab
8. **08-analytics-tab-desktop.png** - Analytics view with message performance metrics

### Mobile (375x667)

1. **01-dashboard-main-mobile.png** - Mobile dashboard view
2. **02-contacts-crm-mobile.png** - Mobile contacts CRM
3. **03-ai-panel-open-mobile.png** - AI panel on mobile
4. **04-contact-modal-mobile.png** - Contact modal on mobile

## Test Data

The script injects realistic test data including:

- **5 sample contacts** with various statuses (responded, call-scheduled, interview-scheduled, no-response)
- **Message history** for select contacts showing sent/received Gmail conversations
- **Dual Gmail accounts** (luis.calderon@gmail.com and lcalderon@umich.edu)
- **Progress metrics** showing 5 contacts, responses, calls, and interviews

## Screenshot Features

- **Realistic data**: All screenshots use injected test data that mimics real usage
- **Animation delays**: Script waits for CSS animations to complete (500-1000ms)
- **Full-page captures**: Desktop screenshots capture full viewport
- **Mobile responsive**: Mobile screenshots use iPhone SE viewport dimensions
- **State simulation**: Loading states and interactions are simulated via DOM manipulation

## Customization

### Changing Viewport Sizes

Edit the `setViewportSize` calls in `generate-screenshots.js`:

```javascript
// Desktop
await page.setViewportSize({ width: 1920, height: 1080 });

// Mobile
await page.setViewportSize({ width: 375, height: 667 });
```

### Adding More Test Data

Modify the `testContacts` and `testMessages` arrays in `generate-screenshots.js`:

```javascript
const testContacts = [
  {
    name: 'Your Name',
    company: 'Company Name',
    title: 'Job Title',
    // ... other fields
  }
];
```

### Adding New Screenshots

Add new screenshot captures after the existing ones:

```javascript
// Example: Capture pipeline view
await desktopPage.click('button[data-tab="pipeline"]');
await desktopPage.waitForTimeout(800);
await takeScreenshot(
  desktopPage,
  '09-pipeline-view-desktop.png',
  'Pipeline view with kanban board'
);
```

## Troubleshooting

### Screenshot Directory Not Found

Ensure the screenshots directory exists:

```bash
mkdir -p /Users/lcalderon/github/JobHunt/docs/screenshots
```

### Playwright Not Installed

Install Playwright and its dependencies:

```bash
npm install
npx playwright install chromium
```

### File Path Issues

The script uses absolute paths to ensure reliability. If you move the project, update the path in the script:

```javascript
const dashboardPath = path.join(__dirname, '..', 'job-search-dashboard.html');
```

### Timeout Errors

Increase timeouts if animations take longer:

```javascript
await desktopPage.waitForTimeout(2000); // Increase from 1000ms to 2000ms
```

## Output Location

All screenshots are saved to:
```
/Users/lcalderon/github/JobHunt/docs/screenshots/
```

## Screenshot Naming Convention

- Format: `{number}-{description}-{viewport}.png`
- Number: Sequential order (01, 02, 03...)
- Description: Kebab-case description
- Viewport: Either `desktop` or `mobile`

## Integration with CI/CD

To run screenshots in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Generate Screenshots
  run: |
    npm install
    npm run screenshots

- name: Upload Screenshots
  uses: actions/upload-artifact@v3
  with:
    name: screenshots
    path: docs/screenshots/
```

## Performance

- **Execution time**: ~15-20 seconds for all 12 screenshots
- **File sizes**: ~100-500KB per screenshot (PNG format)
- **Total size**: ~2-3MB for all screenshots

## Browser Testing

The script uses Chromium by default. To test with other browsers:

```javascript
// Firefox
const browser = await firefox.launch({ headless: true });

// WebKit (Safari)
const browser = await webkit.launch({ headless: true });
```

## Next Steps

1. Run the screenshot generation script
2. Review screenshots in `/docs/screenshots/`
3. Use screenshots in documentation, README, or presentations
4. Automate screenshot generation in CI/CD for regression testing
5. Consider adding visual regression testing with Percy or Chromatic
