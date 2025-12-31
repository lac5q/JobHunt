# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal job search command center for Luis Calderon targeting VP/Director/Principal PM roles. The project consists of:

- **Interactive HTML dashboard** (`job-search-dashboard.html`) - Main job search tracker with CRM, AI-powered tools, LinkedIn post generator, and thought leadership tracking
- **Resume/CV page** (`resume.html`) - Professional resume with copy-to-clipboard functionality for LinkedIn sections
- **Chrome extension** (`linkedin-crm-extension/`) - LinkedIn conversation sync (use sparingly)
- **Supporting tools** - Network explorer, AI tools, LinkedIn data analyzer

## Folder Structure

```
JobHunt/
├── job-search-dashboard.html    # Main dashboard (deployed to /)
├── resume.html                  # Professional resume
├── printable-resume.html        # Print-optimized resume
├── Luis-Calderon-Resume.pdf     # PDF version
├──
├── # Core Modules
├── ai-panel.js                  # AI assistant panel logic
├── sync-manager.js              # Supabase sync module
├── gmail-client.js              # Gmail integration
├── dual-gmail-client.js         # Dual Gmail support
├── connections-data.js          # LinkedIn connections data
├── target-companies.js          # Target company list
├──
├── # Additional Tools
├── ai-tools.html                # Standalone AI tools page
├── network-explorer.html        # LinkedIn network visualization
├── analyze-linkedin-data.html   # LinkedIn data analysis
├── db-admin.html                # Database admin interface
├──
├── # Documentation
├── docs/
│   ├── strategy/                # Job search strategy docs
│   ├── linkedin/                # LinkedIn content & guides
│   ├── resume/                  # Resume-related docs
│   ├── technical/               # Technical setup guides
│   └── testing/                 # Test plans & results
├──
├── # Scripts & Utilities
├── scripts/                     # All utility scripts
│   ├── import-linkedin-archive.js
│   ├── setup-supabase.sh
│   ├── run-all-tests.js
│   └── ...
├──
├── # Data & Integrations
├── linkedin-archives/           # LinkedIn data exports & imports
├── linkedin-crm-extension/      # Chrome extension for LinkedIn sync
├── data/                        # Misc data files
├── supabase/                    # Supabase config
├── tests/                       # Test files
├── resumes/                     # Resume variations
├──
├── # Config
├── vercel.json                  # Vercel deployment config
├── package.json                 # Node dependencies
└── archive/                     # Old/deprecated files
```

## Tech Stack

- Static HTML/CSS/JavaScript (no build system)
- Deployed to Vercel as static files
- Uses browser localStorage for local persistence
- Optional Supabase integration for cross-browser/device sync
- Optional AI integration (Claude API / OpenAI API)

## Commands

### Local Development
```bash
# Open dashboard locally
open job-search-dashboard.html

# Open resume locally
open resume.html
```

### Deployment
```bash
# Deploy to Vercel (requires vercel CLI)
vercel --prod
```

The `vercel.json` configures routing so `/` serves `job-search-dashboard.html`.

### Scripts
```bash
# Import LinkedIn archive data
node scripts/import-linkedin-archive.js

# Run tests
node scripts/run-all-tests.js

# Setup Supabase
./scripts/setup-supabase.sh
```

## Architecture

### Dashboard (`job-search-dashboard.html`)
- Self-contained single HTML file with embedded CSS and JavaScript
- Progress tracking via `localStorage.getItem('jobSearchProgress')`
- CRM with contact management, message templates, and conversation tracking
- AI-powered features: message generation, post generator, outreach assistant
- LinkedIn Post Generator with 6 post type templates
- Thought leadership tracking with daily/weekly/monthly goals
- Task checkboxes auto-save state
- Calculates days active from stored start date

### Resume (`resume.html`)
- Self-contained single HTML file with embedded CSS and JavaScript
- `copyLinkedInFormat()` function provides pre-formatted text for LinkedIn sections
- `copySectionToClipboard()` for generic section copying
- Print-friendly CSS (`@media print`)

### Chrome Extension (`linkedin-crm-extension/`)
- Manual sync of LinkedIn conversations to CRM
- **WARNING**: Use sparingly - LinkedIn may restrict automated tools
- See `linkedin-crm-extension/WARNING.md` for usage guidelines

### Key Documents
- `docs/strategy/MASTER-PROJECT-PLAN.md` - Complete 90-day strategy
- `docs/linkedin/LINKEDIN-SECTIONS-BREAKDOWN.md` - Copy-paste ready LinkedIn content
- `docs/strategy/YOUR-AI-COMPETITIVE-ADVANTAGE.md` - Positioning for interviews
- `docs/technical/PRODUCT-SPEC.md` - Technical product specification

## Cloud Sync (Optional)

The dashboard supports optional Supabase sync for cross-browser/device data persistence:

1. Click "Settings" button in dashboard header
2. Enter Supabase project URL and anon API key
3. Data will auto-sync on every change

See `docs/technical/SUPABASE-SETUP.md` for detailed setup instructions.

### Sync Architecture
- `sync-manager.js` - Shared sync module used by all pages
- Data synced: contacts, progress, message templates, reviewed contacts
- Conflict resolution: Latest timestamp wins
- Offline support: Works offline, syncs when online

## AI Integration (Optional)

The dashboard supports AI-powered features via Claude or OpenAI APIs:

1. Click "Settings" button in dashboard header
2. Choose AI provider (Claude or OpenAI)
3. Enter API key
4. Use AI features: message generation, post generator, outreach optimization

## Writing Style Rules

When generating any content (LinkedIn posts, messages, resume bullets, outreach emails):

- **NO AI telltale phrases**: Avoid "I'm excited to", "I'm thrilled", "passionate about", "leverage", "delve into", "navigate", "foster", "craft", "landscape", "synergy", "game-changer", "cutting-edge"
- **NO excessive exclamation marks** or over-enthusiasm
- **NO formulaic structures** like "As a [role], I [verb]..." or numbered lists unless specifically requested
- **Sound human**: Use contractions, occasional sentence fragments, natural rhythm
- **Be direct**: Say what you mean without hedging ("I think maybe we could possibly...")
- **Vary sentence length**: Mix short punchy sentences with longer ones
- **Skip the preamble**: Don't start with "Great question!" or "I'd be happy to help"

## Important Notes

- Data works offline (localStorage) with optional cloud sync via Supabase
- Both HTML files are designed to work standalone without dependencies
- Sync is configured once and shared across all pages via localStorage credentials
- LinkedIn extension should be used sparingly to avoid account restrictions
- AI features require API keys configured in Settings
