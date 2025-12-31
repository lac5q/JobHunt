# Job Search Command Center

A self-hosted job search dashboard with CRM, AI tools, and progress tracking. Built for senior PM roles but adaptable to any job search.

**Live Demo:** [luiscalderon.vercel.app](https://luiscalderon.vercel.app)

## Features

### Dashboard & Tracking
- Real-time progress metrics (days active, applications, interviews)
- 4-phase timeline: Setup → Volume → Interviews → Close
- Weekly goal tracking with auto-save
- Works offline (localStorage) with optional Supabase cloud sync

### CRM
- Contact management for recruiters, hiring managers, connections
- Conversation history and message tracking
- Smart duplicate detection and merging
- CSV/JSON import/export
- LinkedIn archive import (Connections.csv + messages.csv)

### AI Tools (requires API key)
- Message generator with context-aware outreach
- LinkedIn post generator (6 templates: Tool Review, Insight, Framework, etc.)
- Outreach optimizer for improving cold messages
- Supports Claude or OpenAI

### Chrome Extension
- Syncs LinkedIn conversations to CRM
- Located in `linkedin-crm-extension/`
- Use sparingly to avoid LinkedIn restrictions

## Quick Start

```bash
# Local - just open in browser
open job-search-dashboard.html

# Deploy to Vercel
vercel --prod
```

## Project Structure

```
├── job-search-dashboard.html   # Main dashboard (single file, no build)
├── resume.html                 # Resume with copy-to-clipboard
├── ai-panel.js                 # AI assistant module
├── sync-manager.js             # Supabase sync module
├── api/                        # Vercel serverless functions
├── linkedin-crm-extension/     # Chrome extension
├── docs/                       # Strategy, LinkedIn content, technical guides
├── scripts/                    # Utility scripts
└── resumes/                    # Alternative resume formats
```

## Tech Stack

- Static HTML/CSS/JS (no framework, no build step)
- Vercel for hosting
- Supabase for optional cloud sync
- Claude/OpenAI API for AI features

## Configuration

Click **Settings** in the dashboard to configure:
- Supabase URL + anon key (for cross-device sync)
- AI provider (Claude or OpenAI) + API key

## License

MIT
