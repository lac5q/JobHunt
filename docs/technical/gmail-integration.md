# Gmail Integration Setup

## Quick Setup (Using Gmail in Dashboard)

I'll integrate Gmail using a client-side OAuth flow so you can:
1. Search your email history with any contact
2. Get conversation context automatically
3. Generate personalized emails based on past conversations
4. Send emails directly from the dashboard

## Step 1: Create Gmail API Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Name: "Job Search Dashboard"
5. Authorized JavaScript origins:
   - `https://luis-jobhunt-b055mbvx7-luis-calderons-projects-9c5eea79.vercel.app`
   - `http://localhost:8000` (for local testing)
6. Authorized redirect URIs:
   - `https://luis-jobhunt-b055mbvx7-luis-calderons-projects-9c5eea79.vercel.app`
   - `http://localhost:8000`
7. Click "Create"
8. Copy the **Client ID** (starts with something like `123456789-xxx.apps.googleusercontent.com`)

## Step 2: Enable Gmail API

1. Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com
2. Click "Enable"

## What You'll Be Able to Do

### Email Search
```javascript
// Search for all emails with Ben from GetApril
searchGmail("from:ben@getapril.com OR to:ben@getapril.com")
```

### Context-Aware Outreach
When you click "Email Contact" on any contact:
1. Automatically searches your Gmail for past conversations
2. Summarizes your relationship and last conversation
3. Generates personalized catch-up email
4. Lets you edit and send directly

### Example Flow
1. You see "Ben - GetApril" in Network Explorer
2. Click "Generate Outreach Email"
3. System searches: "from:ben@getapril.com OR to:ben@getapril.com"
4. AI reads your last 5 emails with Ben
5. Generates: "Hey Ben, hope you're doing well! Last we chatted you mentioned..."
6. You review, edit, click "Send"
7. Email sent from your Gmail ✅
