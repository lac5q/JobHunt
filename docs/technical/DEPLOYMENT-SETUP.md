# Vercel Deployment Setup for LinkedIn CRM Extension

## Current Issue

The LinkedIn CRM Sync extension needs to call the `/api/linkedin-sync` endpoint, but it's currently protected by Vercel's deployment protection (requires authentication).

## Solution: Disable Deployment Protection

To allow the Chrome extension to access the API endpoint without authentication:

1. Go to https://vercel.com/luis-calderons-projects-9c5eea79/luis-jobhunt/settings/deployment-protection

2. **Disable** "Vercel Authentication" or set it to "Only for Preview Deployments"

3. This will allow the production API endpoint to be publicly accessible

## Alternative: Use Environment Variables for Bypass Token

If you want to keep deployment protection enabled, you can:

1. Get the bypass token from: https://vercel.com/luis-calderons-projects-9c5eea79/luis-jobhunt/settings/deployment-protection

2. Update the extension to include the bypass token in API calls

However, this is more complex and not recommended for this use case.

## After Disabling Protection

Once deployment protection is disabled, the API endpoint will be accessible at:

```
https://luis-jobhunt-4pbf7k0dk-luis-calderons-projects-9c5eea79.vercel.app/api/linkedin-sync
```

Test it with:

```bash
curl -X POST https://luis-jobhunt-4pbf7k0dk-luis-calderons-projects-9c5eea79.vercel.app/api/linkedin-sync \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"test-123","contactName":"Test","message":"Hello","timestamp":"2024-01-01T00:00:00Z","url":"https://linkedin.com"}'
```

## Security Note

The API endpoint only accepts LinkedIn conversation data and writes to your Supabase database. The Supabase ANON key is used, which has Row Level Security (RLS) enabled, so this is safe to expose publicly.
