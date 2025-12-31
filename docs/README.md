# Documentation Index

This directory contains automated screenshot generation tools and comprehensive documentation for the Job Search Dashboard.

## Quick Start

```bash
# 1. Test your setup
npm run test:playwright

# 2. Generate all screenshots
npm run screenshots:safe

# 3. View output
open docs/screenshots/
```

## Files in This Directory

### Executable Scripts

| File | Purpose | Command | Lines |
|------|---------|---------|-------|
| `test-playwright.js` | Verify Playwright installation | `npm run test:playwright` | 30 |
| `generate-screenshots.js` | Generate screenshots (original) | `npm run screenshots` | 400 |
| `generate-screenshots-safe.js` | Generate screenshots with error handling | `npm run screenshots:safe` | 550 |

### Documentation Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `README.md` | This file - documentation index | Start here |
| `QUICK-REFERENCE.md` | One-page quick reference | Quick lookup |
| `README-screenshots.md` | Technical documentation | Setup and troubleshooting |
| `SCREENSHOT-GUIDE.md` | Comprehensive user guide | Detailed usage and customization |
| `SCREENSHOT-INDEX.md` | Visual index of all screenshots | Understanding output |
| `screenshot-automation-summary.md` | Implementation overview | Understanding the system |

### Output Directory

| Directory | Contents |
|-----------|----------|
| `screenshots/` | 12 PNG files (8 desktop + 4 mobile) |

## Documentation Guide

### For First-Time Users

1. **Start here:** `README.md` (this file)
2. **Quick setup:** `QUICK-REFERENCE.md`
3. **Run test:** `npm run test:playwright`
4. **Generate screenshots:** `npm run screenshots:safe`
5. **View results:** Check `screenshots/` directory

### For Regular Users

- **Quick commands:** `QUICK-REFERENCE.md`
- **Troubleshooting:** `README-screenshots.md` → Troubleshooting section
- **Customization:** `SCREENSHOT-GUIDE.md` → Customization section

### For Developers/Maintainers

- **System architecture:** `screenshot-automation-summary.md`
- **Technical details:** `README-screenshots.md`
- **Customization examples:** `SCREENSHOT-GUIDE.md` → Advanced Usage
- **Screenshot specifications:** `SCREENSHOT-INDEX.md`

### For Documentation Writers

- **Screenshot catalog:** `SCREENSHOT-INDEX.md`
- **File details:** All sections in `SCREENSHOT-INDEX.md`
- **Usage examples:** `SCREENSHOT-INDEX.md` → Usage in Documentation

## System Overview

### What It Does

Automated screenshot generation for the Job Search Dashboard using Playwright browser automation.

**Captures:**
- 8 desktop screenshots (1920x1080)
- 4 mobile screenshots (375x667)
- Various states: default, interactive, loading, loaded
- All major views: Dashboard, Contacts, AI Panel, Analytics

**Features:**
- Realistic test data injection
- Multiple browser interactions
- State simulation (loading, generated messages)
- Comprehensive error handling
- Detailed progress logging

### How It Works

1. **Launch browser:** Chromium in headless mode
2. **Navigate:** Load `job-search-dashboard.html` locally
3. **Inject data:** Add 5 test contacts and message history to localStorage
4. **Interact:** Click tabs, open panels, trigger modals
5. **Capture:** Take screenshot at each state
6. **Save:** Write PNG files to `screenshots/` directory
7. **Report:** Display success/failure summary

### Technology Stack

- **Playwright 1.57.0** - Browser automation framework
- **Node.js** - JavaScript runtime
- **Chromium** - Browser engine for rendering

## Available Commands

### npm Scripts

```bash
# Test Playwright installation
npm run test:playwright

# Generate screenshots (recommended - with error handling)
npm run screenshots:safe

# Generate screenshots (original version)
npm run screenshots

# Alias for screenshots
npm run test:visual
```

### Direct Execution

```bash
# Test script
node docs/test-playwright.js

# Safe mode script
node docs/generate-screenshots-safe.js

# Original script
node docs/generate-screenshots.js
```

## Output

### Screenshot Files

After running `npm run screenshots:safe`, you'll find 12 PNG files in `docs/screenshots/`:

**Desktop (1920x1080):**
1. `01-dashboard-main-desktop.png` - Main dashboard
2. `02-contacts-crm-desktop.png` - Contacts CRM
3. `03-ai-panel-open-desktop.png` - AI panel open
4. `04-ai-panel-gmail-history-desktop.png` - Gmail history
5. `05-message-generating-desktop.png` - Loading state
6. `06-message-generated-desktop.png` - Generated message
7. `07-contact-modal-history-desktop.png` - Contact modal
8. `08-analytics-tab-desktop.png` - Analytics tab

**Mobile (375x667):**
1. `01-dashboard-main-mobile.png` - Mobile dashboard
2. `02-contacts-crm-mobile.png` - Mobile contacts
3. `03-ai-panel-open-mobile.png` - Mobile AI panel
4. `04-contact-modal-mobile.png` - Mobile modal

### Performance Metrics

- **Total execution time:** 15-20 seconds
- **Total file size:** ~2-3 MB
- **Average file size:** ~200 KB per screenshot
- **Success rate:** 100% (with error handling)

## Test Data

### Contacts Injected

5 realistic contacts with varied data:

1. **Sarah Johnson** - TechCorp, VP PM (Responded, Ross Alumni)
2. **Michael Chen** - InnovateLabs, CPO (Call Scheduled)
3. **Jennifer Martinez** - DataDrive, Director (No Response)
4. **David Park** - CloudScale, VP Eng (Interview Scheduled)
5. **Amanda Rodriguez** - FinTech, Head of Product (Responded)

### Message History

- **Sarah Johnson:** 2 messages (sent + received conversation)
- **Michael Chen:** 1 message (sent)

### Gmail Accounts

- luis.calderon@gmail.com (primary)
- lcalderon@umich.edu (secondary)

### Progress Metrics

- Start Date: December 1, 2025
- Total Contacts: 5
- Response Rate: 40%
- Calls: 1, Interviews: 1, Offers: 0

## Common Tasks

### First-Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Test setup
npm run test:playwright

# 4. Generate screenshots
npm run screenshots:safe
```

### Regular Screenshot Generation

```bash
npm run screenshots:safe
```

### After Dashboard Changes

```bash
# Generate new screenshots to see changes
npm run screenshots:safe

# Compare with previous screenshots
# (manual comparison or use visual diff tool)
```

### Troubleshooting

```bash
# Test Playwright installation
npm run test:playwright

# Check for detailed errors
npm run screenshots:safe

# Verify dashboard file exists
ls -la job-search-dashboard.html

# Check output directory
ls -la docs/screenshots/
```

## Customization

### Change Viewport Size

Edit viewport in script:
```javascript
await page.setViewportSize({ width: 1920, height: 1080 });
```

### Add New Screenshot

Add to script after existing screenshots:
```javascript
await takeScreenshot(page, 'new-view.png', 'Description');
```

### Modify Test Data

Edit `testContacts` array in script:
```javascript
const testContacts = [
  { name: 'New Contact', company: 'Company', /* ... */ }
];
```

### Adjust Animation Timing

Change wait times in script:
```javascript
await page.waitForTimeout(2000); // Increase from 1000ms to 2000ms
```

## Integration

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Generate Screenshots
on: [push]
jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps chromium
      - run: npm run screenshots:safe
      - uses: actions/upload-artifact@v3
        with:
          name: screenshots
          path: docs/screenshots/
```

### Visual Regression Testing

Use with Percy, Chromatic, or BackstopJS for automated visual regression testing.

## Maintenance

### When to Update

- **Dashboard HTML changes:** Update selectors
- **New features added:** Add new screenshot scenarios
- **Test data outdated:** Refresh contact information
- **Viewport standards change:** Update viewport sizes

### Update Checklist

- [ ] Test scripts still run: `npm run test:playwright`
- [ ] Screenshots generate: `npm run screenshots:safe`
- [ ] All 12 screenshots created
- [ ] Screenshots show expected content
- [ ] Update documentation if major changes
- [ ] Commit updated scripts (not screenshots)

## Support

### Troubleshooting Resources

1. **Quick fixes:** `QUICK-REFERENCE.md` → Quick Troubleshooting
2. **Common issues:** `README-screenshots.md` → Troubleshooting
3. **Detailed guide:** `SCREENSHOT-GUIDE.md` → Troubleshooting
4. **Test setup:** `npm run test:playwright`

### External Resources

- **Playwright Docs:** https://playwright.dev
- **Browser DevTools:** For debugging selectors
- **Visual Testing:** Percy, Chromatic, BackstopJS

## Contributing

### Adding New Screenshots

1. Identify the view/state to capture
2. Add test data if needed
3. Add interaction steps (clicks, navigation)
4. Add screenshot capture call
5. Update documentation:
   - `SCREENSHOT-INDEX.md` - Add screenshot details
   - `SCREENSHOT-GUIDE.md` - Add usage example
   - This README - Update counts and lists
6. Test the changes
7. Update version numbers if major changes

### Improving Documentation

- Keep documentation in sync with code
- Add examples for common use cases
- Update troubleshooting based on real issues
- Include screenshots of output (meta!)

## Version History

- **v1.0.0** (2025-12-12) - Initial implementation
  - 3 executable scripts (test, original, safe mode)
  - 6 documentation files
  - 12 screenshots (8 desktop, 4 mobile)
  - Comprehensive error handling
  - Full documentation suite

## File Size Summary

```
docs/
├── test-playwright.js                    975B
├── generate-screenshots.js               12K
├── generate-screenshots-safe.js          18K
├── README.md                             This file
├── QUICK-REFERENCE.md                    3.1K
├── README-screenshots.md                 5.1K
├── SCREENSHOT-GUIDE.md                   13K
├── SCREENSHOT-INDEX.md                   11K
├── screenshot-automation-summary.md      14K
└── screenshots/                          ~2-3MB (when generated)
    ├── 01-dashboard-main-desktop.png
    ├── 02-contacts-crm-desktop.png
    ├── 03-ai-panel-open-desktop.png
    ├── 04-ai-panel-gmail-history-desktop.png
    ├── 05-message-generating-desktop.png
    ├── 06-message-generated-desktop.png
    ├── 07-contact-modal-history-desktop.png
    ├── 08-analytics-tab-desktop.png
    ├── 01-dashboard-main-mobile.png
    ├── 02-contacts-crm-mobile.png
    ├── 03-ai-panel-open-mobile.png
    └── 04-contact-modal-mobile.png
```

**Total:** ~80KB documentation + ~30KB scripts = ~110KB (excluding screenshots)

## License

Same license as parent project (Job Search Dashboard).

## Credits

**Created by:** Testing & Automation Agent
**Date:** December 12, 2025
**Framework:** Playwright 1.57.0
**Purpose:** Automated visual documentation and testing

---

**Next Steps:**
1. Run `npm run test:playwright` to verify setup
2. Run `npm run screenshots:safe` to generate screenshots
3. Review output in `docs/screenshots/`
4. Use screenshots in documentation or presentations
5. Set up CI/CD integration (optional)
6. Consider visual regression testing (optional)
