# Job Capture Extension

Chrome extension to capture job listings and use AI to help with applications.

## Features

- **Auto-extract jobs** from LinkedIn, Indeed, Glassdoor
- **Manual entry** for any webpage
- **Save to CRM** - syncs with your Job Search Dashboard
- **AI Question Answerer** - paste any application question, get a personalized answer
- **AI Cover Letter Generator** - one-click cover letters using your background

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this `job-capture-extension` folder

## Setup

1. Click the extension icon
2. Go to **Settings** tab
3. Enter your AI API key (Claude or OpenAI)
4. Dashboard URL should be pre-filled (change if you self-host)

## Usage

### Capture a Job
1. Navigate to any job listing page
2. Click the extension icon
3. Job details are auto-extracted (or enter manually)
4. Click "Save Job"
5. Job appears in your dashboard's Jobs tab

### AI Application Assistant
1. Save or enter a job first
2. Go to the **AI Assistant** tab
3. Paste any application question → "Generate Answer"
4. Or click "Generate Cover Letter"
5. Copy the result to paste into your application

## Customization

Edit `profile.js` to update your background information for AI responses:
- Summary, experience, skills
- Achievements and education
- Target roles

## Files

```
job-capture-extension/
├── manifest.json    # Extension config
├── popup.html/js/css # Main UI
├── content.js       # Page extraction scripts
├── profile.js       # Your background for AI
└── icons/           # Extension icons
```

## Privacy

- Your API key is stored locally in Chrome storage
- Job data syncs to your own Supabase database
- No external analytics or tracking
