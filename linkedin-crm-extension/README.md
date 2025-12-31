# LinkedIn CRM Sync v1.3.0

Automatically syncs LinkedIn conversations to your Job Search CRM (Supabase).

## Features

✅ **Zero Config** - Works immediately with hardcoded credentials
✅ **Smart Deduplication** - Prevents duplicate syncs using stable conversation IDs
✅ **Efficient** - Checks every 30s, syncs only new messages
✅ **Visual Feedback** - Green notifications for successful syncs

## Quick Start

1. **Load Extension:**
   ```
   chrome://extensions/ → Enable Developer Mode → Load unpacked → Select folder
   ```

2. **Visit LinkedIn:**
   ```
   https://www.linkedin.com/messaging/
   ```

3. **Done!** Extension auto-syncs conversations.

## Verification

- **Console:** `F12` → Look for `✓ Contact Name` logs
- **Supabase:** [View synced data](https://supabase.com/dashboard/project/dkufgfmwqsxecylyvidi/editor)
- **Notifications:** Green popups in bottom-right corner

## Architecture

```
LinkedIn Page → Content Script → Vercel API → Supabase
```

1. **Monitors** LinkedIn messaging page (`content.js`)
2. **Extracts** contact name, message, timestamp from DOM
3. **Syncs** via Vercel serverless function (bypasses CORS)
4. **Stores** in `job_search_data.linkedin_conversations` JSONB column

## Debug Commands

Open console (`F12`) on LinkedIn:

```javascript
window.linkedInCRMDebug.showStats()    // View status
window.linkedInCRMDebug.forceCheck()   // Force sync now
window.linkedInCRMDebug.clearCache()   // Clear processed IDs
window.linkedInCRMDebug.resetErrors()  // Reset error count
```

## Troubleshooting

**No syncs happening?**
1. Check console: `F12` → Look for `📬 New:` logs
2. Verify page: Must be on `linkedin.com/messaging/`
3. Run: `window.linkedInCRMDebug.showStats()`

**Too many errors?**
- Extension pauses after 5 consecutive errors
- Reload page or run `window.linkedInCRMDebug.resetErrors()`

**Seeing duplicates?**
- Fixed in v1.3.0
- Clear cache: `window.linkedInCRMDebug.clearCache()`

## Configuration (Advanced)

**Credentials are hardcoded** in:
- `content.js:7-8`
- `popup.js:11-12`
- `background.js:23-24,46-47,127-128`

Change if needed, then bump version in `manifest.json`.

## Version History

**v1.3.0** (2025-12-12)
- Fixed duplicate syncs with stable conversation IDs
- Reduced logging (succinct)
- 30s check interval (was 10s)
- Improved efficiency

**v1.2.4** - Hardcoded defaults for auto-config
**v1.2.3** - Updated API endpoint + Supabase keys
**v1.2.2** - Initial working version with serverless API
