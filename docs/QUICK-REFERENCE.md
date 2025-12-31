# Screenshot Automation - Quick Reference

## Commands

```bash
# Test Playwright setup
npm run test:playwright

# Generate screenshots (RECOMMENDED - with error handling)
npm run screenshots:safe

# Generate screenshots (original version)
npm run screenshots
```

## Output Location

```
/Users/lcalderon/github/JobHunt/docs/screenshots/
```

## Files Generated

### Desktop (1920x1080) - 8 files
- `01-dashboard-main-desktop.png` - Main dashboard
- `02-contacts-crm-desktop.png` - Contacts CRM
- `03-ai-panel-open-desktop.png` - AI panel open
- `04-ai-panel-gmail-history-desktop.png` - Gmail history
- `05-message-generating-desktop.png` - Loading state
- `06-message-generated-desktop.png` - Generated message
- `07-contact-modal-history-desktop.png` - Contact modal
- `08-analytics-tab-desktop.png` - Analytics view

### Mobile (375x667) - 4 files
- `01-dashboard-main-mobile.png` - Mobile dashboard
- `02-contacts-crm-mobile.png` - Mobile contacts
- `03-ai-panel-open-mobile.png` - Mobile AI panel
- `04-contact-modal-mobile.png` - Mobile modal

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Playwright not installed" | `npm install && npx playwright install chromium` |
| "Dashboard file not found" | Run from project root: `cd /Users/lcalderon/github/JobHunt` |
| Screenshots blank | Increase wait times in script (change 1000 to 2000) |
| Permission error | `mkdir -p docs/screenshots && chmod 755 docs/screenshots` |

## Test Data

- **5 contacts** (varied statuses: responded, call-scheduled, interview-scheduled, no-response)
- **2 Gmail accounts** (luis.calderon@gmail.com, lcalderon@umich.edu)
- **Message history** for Sarah Johnson (2 messages) and Michael Chen (1 message)
- **Progress metrics** (start date: 2025-12-01, responses: 2, calls: 1, interviews: 1)

## Customization Quick Tips

### Change viewport size
```javascript
await page.setViewportSize({ width: 1920, height: 1080 });
```

### Add screenshot
```javascript
await takeScreenshot(page, 'filename.png', 'Description');
```

### Add test contact
```javascript
const testContacts = [
  { name: 'Name', company: 'Company', /* ... */ }
];
```

### Increase animation delay
```javascript
await page.waitForTimeout(2000); // 2 seconds
```

## Documentation Files

- `/Users/lcalderon/github/JobHunt/docs/README-screenshots.md` - Technical details
- `/Users/lcalderon/github/JobHunt/docs/SCREENSHOT-GUIDE.md` - Comprehensive guide
- `/Users/lcalderon/github/JobHunt/docs/screenshot-automation-summary.md` - Implementation summary
- `/Users/lcalderon/github/JobHunt/docs/QUICK-REFERENCE.md` - This file

## Performance

- **Execution time:** 15-20 seconds
- **Total file size:** ~2-3 MB
- **Memory usage:** ~200-300 MB

## CI/CD Integration

```yaml
# GitHub Actions example
- run: npm install
- run: npx playwright install chromium
- run: npm run screenshots:safe
- uses: actions/upload-artifact@v3
  with:
    name: screenshots
    path: docs/screenshots/
```

## Need Help?

1. Run test script: `npm run test:playwright`
2. Use safe mode: `npm run screenshots:safe` (detailed error messages)
3. Check console output for warnings
4. Review full guide: `docs/SCREENSHOT-GUIDE.md`
