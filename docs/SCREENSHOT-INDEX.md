# Screenshot Index

Visual reference guide for all generated screenshots. Screenshots are saved to `/Users/lcalderon/github/JobHunt/docs/screenshots/`

## Desktop Screenshots (1920x1080)

### 1. Main Dashboard View
**File:** `01-dashboard-main-desktop.png`
**Tab:** Dashboard
**Elements Visible:**
- Header with gradient (Luis's Job Search Dashboard - GET PAID FAST)
- Alert banner with follow-up reminders
- 6 stat cards: Days Active, Total Contacts, Response Rate, Calls Scheduled, Interviews, Offers
- Tab navigation (Dashboard, Contacts CRM, Pipeline, Analytics, Resources, AI Tools)
- Priority box with weekly focus and action items
- Daily schedule with time-blocked tasks
- Quick actions grid

**Test Data:**
- Days Active: Calculated from 2025-12-01
- Total Contacts: 5
- Response Rate: 40%
- Calls Scheduled: 1
- Interviews: 1
- Offers: 0

---

### 2. Contacts CRM View
**File:** `02-contacts-crm-desktop.png`
**Tab:** Contacts CRM
**Elements Visible:**
- Contacts header with "Add Contact" button
- CRM table with columns: Name, Company, Title, Status, Last Contact, Actions
- 5 contact rows with varied statuses
- AI panel trigger buttons (lightning bolt icon)
- AI panel in closed state (not visible)

**Test Data:**
- Sarah Johnson (TechCorp) - Responded - Ross Alumni
- Michael Chen (InnovateLabs) - Call Scheduled - Industry Connection
- Jennifer Martinez (DataDrive Inc) - No Response - Former Colleague
- David Park (CloudScale) - Interview Scheduled - Ross Alumni
- Amanda Rodriguez (FinTech Solutions) - Responded - LinkedIn Connection

---

### 3. AI Panel Open with Contact Context
**File:** `03-ai-panel-open-desktop.png`
**Tab:** Contacts CRM
**Elements Visible:**
- Contacts CRM table (left side)
- AI Message Generator panel (right side, slide-in)
- Contact context section showing selected contact details
- Message template selector
- Tone selector
- Generate Message button
- Empty output area

**Test Data:**
- Selected contact: Sarah Johnson (first contact row clicked)
- Contact context: Name, company, title, relationship, notes loaded
- Panel state: Open, no message generated yet

---

### 4. AI Panel with Gmail History
**File:** `04-ai-panel-gmail-history-desktop.png`
**Tab:** Contacts CRM
**Elements Visible:**
- AI panel with contact context
- Gmail message history section (expanded)
- 2 Gmail accounts shown: luis.calderon@gmail.com, lcalderon@umich.edu
- Message thread for Sarah Johnson:
  - Sent message (Subject: Ross Alumni - Fractional PM Opportunities)
  - Received response (Subject: Re: Ross Alumni - Fractional PM Opportunities)
- Message timestamps and account labels

**Test Data:**
- Contact: Sarah Johnson
- Messages: 2 (1 sent on 2025-12-10 10:30, 1 received on 2025-12-10 14:45)
- Accounts: Both Gmail accounts visible
- Thread: Complete conversation visible

---

### 5. Message Generation Loading State
**File:** `05-message-generating-desktop.png`
**Tab:** Contacts CRM
**Elements Visible:**
- AI panel with contact context
- Generate Message button in disabled state (text: "Generating...")
- Loading spinner in output area
- Text: "Generating your personalized message..."
- Button opacity reduced to 0.6

**Test Data:**
- State: Simulated loading (DOM manipulation)
- Contact: Sarah Johnson
- Animation: Spinning loader visible

---

### 6. Generated Message Display
**File:** `06-message-generated-desktop.png`
**Tab:** Contacts CRM
**Elements Visible:**
- AI panel with contact context
- Generated message section with:
  - Header: "Generated Message"
  - Subject line: "Fellow Wolverine - Exploring Fractional PM Opportunities"
  - Full message body (personalized for Sarah Johnson)
  - Action buttons: "Copy to Clipboard" (purple), "Open in Gmail" (green)
- Generate Message button re-enabled

**Test Data:**
- Message content: ~150 words, personalized to Sarah Johnson
- Mentions: Ross connection, fractional PM opportunities, AI/ML expertise
- Format: Professional, warm, action-oriented (call request)
- Buttons: Both visible and styled

---

### 7. Contact Modal with Message History
**File:** `07-contact-modal-history-desktop.png`
**Tab:** Contacts CRM
**Elements Visible:**
- Contact Details Modal (overlay)
- Modal tabs: Contact Details, Message History (active)
- Message History tab showing:
  - 2 messages for Sarah Johnson
  - Message cards with subject, date, type (sent/received), content preview
  - Gmail account labels
- Modal close button (X)

**Test Data:**
- Contact: Sarah Johnson
- Tab: Message History (switched from Contact Details)
- Messages: Same 2 messages as in AI panel Gmail history
- Layout: Stacked message cards with alternating styling

---

### 8. Analytics Tab
**File:** `08-analytics-tab-desktop.png`
**Tab:** Analytics
**Elements Visible:**
- Analytics header
- Message performance metrics:
  - Total messages sent
  - Response rate
  - Average response time
  - Messages by status (charts/graphs)
- Contact engagement metrics
- Timeline visualizations
- Filter controls

**Test Data:**
- Total messages: Calculated from message history
- Response rate: Based on 5 contacts, 2 responses (40%)
- Charts: Populated with test contact data
- Trends: Based on injected last contact dates

---

## Mobile Screenshots (375x667)

### 9. Mobile Dashboard View
**File:** `01-dashboard-main-mobile.png`
**Tab:** Dashboard
**Elements Visible:**
- Responsive header (stacked layout)
- Stat cards (single column, full width)
- Tab navigation (horizontal scroll)
- Priority box (full width)
- Daily schedule (mobile-optimized)
- Quick actions grid (2 columns)

**Test Data:** Same as desktop dashboard

**Responsive Features:**
- Single column layout
- Larger touch targets
- Horizontal scrollable tabs
- Condensed spacing

---

### 10. Mobile Contacts CRM
**File:** `02-contacts-crm-mobile.png`
**Tab:** Contacts CRM
**Elements Visible:**
- Add Contact button (full width or prominent)
- Contact cards (instead of table)
- Each card shows: name, company, status badge
- AI panel trigger on each card
- Vertical scrolling list

**Test Data:** Same 5 contacts as desktop

**Responsive Features:**
- Card-based layout (not table)
- Larger tap targets for buttons
- Status badges more prominent
- Optimized for thumb navigation

---

### 11. Mobile AI Panel
**File:** `03-ai-panel-open-mobile.png`
**Tab:** Contacts CRM
**Elements Visible:**
- AI panel slides in from bottom or right
- Takes full screen or near-full screen
- Contact context at top
- Message template selector (mobile-optimized dropdown)
- Generate button (full width)
- Close/back button prominent

**Test Data:**
- Contact: Sarah Johnson
- Panel: Full-screen overlay on mobile

**Responsive Features:**
- Full-screen or slide-up drawer
- Large close button
- Touch-optimized controls
- Vertical scrolling for long content

---

### 12. Mobile Contact Modal
**File:** `04-contact-modal-mobile.png`
**Tab:** Contacts CRM
**Elements Visible:**
- Full-screen modal
- Contact Details / Message History tabs (horizontal)
- Tab content (currently on Message History)
- Message cards stacked vertically
- Close button in header

**Test Data:**
- Contact: Sarah Johnson
- Messages: 2 messages visible

**Responsive Features:**
- Full-screen takeover
- Tab switcher at top
- Message cards full width
- Bottom padding for thumb zone

---

## Screenshot Specifications

### Image Details

| Property | Desktop | Mobile |
|----------|---------|--------|
| **Viewport** | 1920x1080 | 375x667 |
| **Device** | Full HD desktop | iPhone SE |
| **Format** | PNG | PNG |
| **Color Depth** | 24-bit RGB | 24-bit RGB |
| **Avg File Size** | 200-300 KB | 100-200 KB |
| **DPI** | 72 (screen) | 72 (screen) |

### Coverage Matrix

| Feature | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Dashboard | ✓ | ✓ | Main landing view |
| Contacts CRM | ✓ | ✓ | Table vs cards |
| AI Panel | ✓ | ✓ | Slide-in panel |
| Gmail History | ✓ | - | Desktop only |
| Loading State | ✓ | - | Desktop only |
| Generated Message | ✓ | - | Desktop only |
| Contact Modal | ✓ | ✓ | Details + history |
| Analytics | ✓ | - | Desktop only |

### Testing States Captured

| State | Description | Screenshots |
|-------|-------------|-------------|
| **Default** | Initial load, no interactions | 1, 2, 9, 10 |
| **Interactive** | Panel/modal open | 3, 4, 11, 12 |
| **Loading** | Async operation in progress | 5 |
| **Loaded** | Data/content displayed | 4, 6, 7, 8 |
| **Responsive** | Mobile layout adaptations | 9, 10, 11, 12 |

## Usage in Documentation

### README.md Example

```markdown
## Dashboard Features

![Dashboard Overview](docs/screenshots/01-dashboard-main-desktop.png)
*Main dashboard showing stats, priorities, and daily schedule*

### AI-Powered Message Generation

![AI Message Generator](docs/screenshots/06-message-generated-desktop.png)
*Generate personalized outreach messages with AI assistance*
```

### Presentation Slides

- Use desktop screenshots for feature demonstrations
- Use mobile screenshots to show responsive design
- Combine before/after (e.g., #3 and #6 for AI workflow)

### Design Reviews

- Show contact modal (#7) for UX feedback
- Show analytics (#8) for data visualization review
- Show mobile views (#9-12) for responsive design validation

### User Documentation

- Use annotated versions of screenshots to highlight features
- Create step-by-step guides using screenshot sequence
- Build interactive tutorials using screenshots as frames

## Automation Details

### Screenshot Timing

| Screenshot | Wait Time (ms) | Reason |
|------------|----------------|--------|
| 1, 9 | 1000 | Page load + data injection |
| 2, 10 | 800 | Tab switch animation |
| 3, 11 | 800 | Panel slide-in animation |
| 4 | 1500 | Panel + accordion expansion |
| 5 | 500 | DOM update only |
| 6 | 500 | DOM update only |
| 7, 12 | 1300 | Modal open + tab switch |
| 8 | 800 | Tab switch animation |

### Selector Reliability

| Element | Selector | Type | Reliability |
|---------|----------|------|-------------|
| Contacts Tab | `button[data-tab="contacts"]` | Attribute | High |
| AI Panel Button | `.contact-row:first-child .open-ai-btn` | Class | High |
| AI Panel Close | `#ai-panel-close` | ID | High |
| History Tab | `#message-history-tab` | ID | High |
| Modal Close | `.modal-close` | Class | Medium |
| Analytics Tab | `button[data-tab="analytics"]` | Attribute | High |

## Maintenance Checklist

When dashboard HTML changes:

- [ ] Verify all selectors still work
- [ ] Check animation timings (adjust wait times if needed)
- [ ] Update test data if structure changes
- [ ] Re-run screenshot generation
- [ ] Compare new vs old screenshots
- [ ] Update this index if new views added

## Visual Regression Testing

To use these screenshots for visual regression:

1. **Baseline:** Generate initial screenshots (current run)
2. **Make changes:** Update dashboard code
3. **Compare:** Generate new screenshots
4. **Diff:** Use image comparison tool (e.g., `pixelmatch`)
5. **Review:** Manually verify intentional vs unintentional changes

### Recommended Tools

- **Percy:** Automated visual testing platform
- **Chromatic:** Storybook-integrated visual testing
- **BackstopJS:** Open-source visual regression tool
- **Pixelmatch:** Pixel-level image comparison library

---

**Generated by:** Playwright 1.57.0
**Last Run:** To be executed
**Next Run:** On-demand or via CI/CD
**Maintenance:** Update quarterly or on major dashboard changes
