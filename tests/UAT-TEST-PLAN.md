# User Acceptance Testing (UAT) Plan
## Job Search CRM with AI Integration

**Version**: 1.0
**Date**: December 13, 2025
**Tester**: [Your Name]
**Environment**: Production (https://luis-jobhunt-ndsbbttpo-luis-calderons-projects-9c5eea79.vercel.app)

---

## Test Scenarios

### 1. LinkedIn Message Sync Integration

#### 1.1 Sync New LinkedIn Messages to Existing Contact
**Objective**: Verify LinkedIn messages update existing contact records

**Prerequisites**:
- LinkedIn CRM Extension installed and active
- At least 1 existing contact in CRM (e.g., "Sarah Chen")
- Active LinkedIn conversation with that contact

**Steps**:
1. Go to LinkedIn messaging (https://linkedin.com/messaging)
2. Send a message to an existing contact
3. Wait 30 seconds for extension to detect (or open extension popup and click "Force Sync")
4. Return to Job Search Dashboard
5. Click "🔄 Sync LinkedIn" button in Settings
6. Wait for notification

**Expected Results**:
- [ ] Notification shows "✓ LinkedIn Sync complete: 0 new, 1 updated contacts"
- [ ] Contact card shows updated "Last Contact" date
- [ ] Opening contact modal → "Message History" tab shows new LinkedIn message
- [ ] Message has icon "🔗" for LinkedIn
- [ ] Message type is "LinkedIn Message"
- [ ] Message body shows the actual message text
- [ ] Message shows correct timestamp
- [ ] Analytics dashboard updates (Total Messages count increases)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 1.2 Sync New LinkedIn Messages to New Contact
**Objective**: Verify LinkedIn messages create new contact records

**Prerequisites**:
- LinkedIn CRM Extension installed
- LinkedIn conversation with someone NOT in CRM

**Steps**:
1. Start a new conversation on LinkedIn with someone not in your CRM
2. Send initial message
3. Wait 30 seconds (or force sync via extension popup)
4. Return to Job Search Dashboard
5. Click "🔄 Sync LinkedIn" button
6. Wait for notification

**Expected Results**:
- [ ] Notification shows "✓ LinkedIn Sync complete: 1 new, 0 updated contacts"
- [ ] New contact appears in CRM with name from LinkedIn
- [ ] Contact has source = "linkedin"
- [ ] Contact status = "contacted"
- [ ] Last Contact date = today
- [ ] Message History tab shows 1 LinkedIn message
- [ ] Outreach array has 1 entry (type: linkedin)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 1.3 Prevent Duplicate Messages
**Objective**: Verify same LinkedIn message doesn't get synced twice

**Prerequisites**:
- LinkedIn message already synced to contact

**Steps**:
1. Click "🔄 Sync LinkedIn" button again (without sending new messages)
2. Wait for notification

**Expected Results**:
- [ ] Notification shows "0 new, 0 updated" OR doesn't show
- [ ] No duplicate messages in Message History
- [ ] Message count doesn't increase

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

### 2. AI Message Generation

#### 2.1 Generate AI Message from Contact Card
**Objective**: Verify AI panel opens and generates contextual message

**Prerequisites**:
- AI API key configured (Claude or OpenAI)
- At least 1 contact with email address

**Steps**:
1. Find a contact card
2. Click "📧 Compose" button
3. AI panel should slide in from right
4. Select Message Type: "Email Follow-up"
5. Select Tone: "Professional Casual"
6. Click "Generate Message"

**Expected Results**:
- [ ] AI panel slides in smoothly (300ms animation)
- [ ] Contact context displays (name, title, company, notes)
- [ ] Gmail history section attempts to load (may show "No Gmail configured")
- [ ] Loading spinner shows during generation
- [ ] Generated message appears within 5 seconds
- [ ] Message is personalized (mentions contact's name/company)
- [ ] Copy, Send, Save Draft buttons appear
- [ ] Message references contact's background/notes if available

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 2.2 Keyboard Shortcut - Open AI Panel
**Objective**: Verify Cmd/Ctrl+K shortcut opens AI panel

**Prerequisites**:
- At least 1 contact in CRM
- No modals currently open

**Steps**:
1. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows)
2. Observe AI panel

**Expected Results**:
- [ ] AI panel opens immediately
- [ ] Loads first contact from list
- [ ] Contact context displays
- [ ] No browser search bar appears (default prevented)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 2.3 Keyboard Shortcut - Close AI Panel
**Objective**: Verify Escape key closes AI panel

**Prerequisites**:
- AI panel is open

**Steps**:
1. Press **Escape** key
2. Observe AI panel

**Expected Results**:
- [ ] AI panel slides closed
- [ ] Panel fully hidden within 300ms

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 2.4 Keyboard Shortcut - Generate Message
**Objective**: Verify Cmd/Ctrl+Enter generates message

**Prerequisites**:
- AI panel open
- Focus in "Additional Context" textarea

**Steps**:
1. Type some additional context in textarea
2. Press **Cmd+Enter** (Mac) or **Ctrl+Enter** (Windows)
3. Observe message generation

**Expected Results**:
- [ ] Message generation starts immediately
- [ ] Loading spinner appears
- [ ] Generated message includes the additional context

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

### 3. Error Handling & Retry Logic

#### 3.1 AI API Error - Invalid Key
**Objective**: Verify user-friendly error when API key is invalid

**Prerequisites**:
- Invalid AI API key in Settings (or no key)

**Steps**:
1. Open AI panel
2. Click "Generate Message"

**Expected Results**:
- [ ] Yellow warning box appears
- [ ] Message says "AI not configured"
- [ ] Instructions: "Please add your AI API key in Settings"
- [ ] "Open Settings" button is clickable
- [ ] Clicking button opens Settings modal

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 3.2 Gmail API Error - Token Expired
**Objective**: Verify graceful handling of expired Gmail token

**Prerequisites**:
- Gmail connected but token expired (can simulate by manually clearing token in localStorage)

**Steps**:
1. In browser console: `localStorage.removeItem('gmailAccounts')` or modify token to expired
2. Open AI panel (which tries to load Gmail history)
3. Observe error handling

**Expected Results**:
- [ ] Gmail section shows error message
- [ ] Error says "Token expired. Please reconnect your Gmail account"
- [ ] Provides actionable guidance
- [ ] AI panel still functions (can generate messages without Gmail history)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 3.3 Network Error - Retry Logic
**Objective**: Verify exponential backoff retry on network errors

**Prerequisites**:
- AI API configured correctly
- Simulate network issues (disconnect WiFi briefly during generation)

**Steps**:
1. Open AI panel
2. Start generating message
3. Immediately disconnect WiFi/network
4. Wait 10 seconds
5. Reconnect network
6. Observe behavior

**Expected Results**:
- [ ] System attempts retry (up to 3 times)
- [ ] Exponential backoff: waits 1s, then 2s, then 4s
- [ ] If all retries fail, shows error message
- [ ] Error message: "Failed after 3 attempts: [error details]"
- [ ] User can click "Try Again" button

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

### 4. Mobile Responsive Design

#### 4.1 Mobile AI Panel - Slide from Bottom
**Objective**: Verify AI panel works on mobile (or narrow browser window)

**Prerequisites**:
- Browser window resized to < 768px width, OR test on actual mobile device

**Steps**:
1. Resize browser to 375px x 667px (iPhone SE size)
2. Click "📧 Compose" on any contact
3. Observe AI panel animation

**Expected Results**:
- [ ] Backdrop overlay appears (semi-transparent black)
- [ ] AI panel slides up from bottom (not from right)
- [ ] Panel is full-screen (100vw x 100vh)
- [ ] Background page scroll is locked
- [ ] Close button is large enough to tap (48px x 48px)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 4.2 Mobile Touch Targets
**Objective**: Verify all buttons meet 44px minimum touch target size

**Prerequisites**:
- Mobile device or browser DevTools mobile emulation

**Steps**:
1. Open AI panel on mobile
2. Inspect touch target sizes (use browser DevTools)
3. Try tapping all buttons

**Expected Results**:
- [ ] Close button (X): >= 48px x 48px
- [ ] Compose button: >= 44px x 44px
- [ ] Generate button: >= 44px height
- [ ] Copy/Send/Save buttons: >= 44px height
- [ ] All buttons easily tappable with thumb

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 4.3 Mobile Input Focus - No Auto-Zoom
**Objective**: Verify iOS Safari doesn't auto-zoom on input focus

**Prerequisites**:
- iPhone with Safari (or Safari simulation in DevTools)

**Steps**:
1. Open AI panel on mobile
2. Tap into "Additional Context" textarea
3. Observe zoom behavior

**Expected Results**:
- [ ] Page does NOT auto-zoom in
- [ ] Font size is 16px (prevents iOS zoom)
- [ ] Keyboard appears without zoom
- [ ] Text is still readable

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

### 5. Message History & Analytics

#### 5.1 View Message History Timeline
**Objective**: Verify message history displays correctly in contact modal

**Prerequisites**:
- At least 1 contact with messageHistory entries (from LinkedIn sync or AI generated)

**Steps**:
1. Click on contact card to open modal
2. Click "Message History" tab
3. Observe timeline display

**Expected Results**:
- [ ] Tab switches to Message History view
- [ ] Badge shows message count (e.g., "Message History (3)")
- [ ] Messages sorted by date (newest first)
- [ ] Each message shows:
  - [ ] Account icon (📧 Personal, 💼 Work, or 🔗 LinkedIn)
  - [ ] Date/time
  - [ ] Message type (e.g., "Email Follow-up", "LinkedIn Message")
  - [ ] Body preview (first 100 characters)
  - [ ] "Mark as Responded" toggle button

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 5.2 Toggle Message Response Status
**Objective**: Verify marking messages as responded/unresponded

**Prerequisites**:
- Contact with at least 1 message in history

**Steps**:
1. Open contact modal → Message History tab
2. Find a message with "Mark as Responded" button
3. Click button

**Expected Results**:
- [ ] Button changes to "✓ Responded"
- [ ] Button style changes (green background)
- [ ] Response date is set to current date/time
- [ ] Analytics dashboard updates (if visible)

4. Click "✓ Responded" button again

**Expected Results**:
- [ ] Button changes back to "Mark as Responded"
- [ ] Button style reverts (gray background)
- [ ] Response date is cleared (null)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 5.3 Analytics Dashboard - Message Stats
**Objective**: Verify analytics dashboard shows accurate message statistics

**Prerequisites**:
- Multiple contacts with messageHistory entries
- Mix of AI-generated and LinkedIn messages
- Some messages marked as responded

**Steps**:
1. Navigate to "Analytics" tab
2. Scroll to "Message Analytics" section
3. Review all stat cards

**Expected Results**:
- [ ] **Total Messages** card shows correct count
- [ ] **AI Generated** count matches messages with aiGenerated: true
- [ ] **Response Rate** percentage is accurate (responded / total * 100)
- [ ] **Personal vs Work vs LinkedIn** breakdown is correct
- [ ] Message breakdown table shows counts by type
- [ ] Table shows: Email Follow-up, Initial Outreach, LinkedIn Message, etc.

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

### 6. Data Persistence & Sync

#### 6.1 Supabase Cloud Sync
**Objective**: Verify changes sync to Supabase cloud

**Prerequisites**:
- Supabase configured in Settings
- Internet connection

**Steps**:
1. Add a new contact OR update existing contact
2. Click "🔄 Sync to Cloud" button in Settings
3. Wait for notification

**Expected Results**:
- [ ] Notification: "✓ Synced to cloud"
- [ ] Last sync timestamp updates
- [ ] Open browser DevTools → Network tab
- [ ] PATCH request to Supabase should show 200 OK

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 6.2 localStorage Persistence
**Objective**: Verify changes persist across page reloads

**Prerequisites**:
- At least 1 contact with messageHistory

**Steps**:
1. Note the message count in a contact's history
2. Refresh the page (F5 or Cmd+R)
3. Open the same contact modal → Message History tab

**Expected Results**:
- [ ] All messages still present
- [ ] Message count unchanged
- [ ] Response status preserved
- [ ] Message details intact

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

### 7. Edge Cases & Boundary Conditions

#### 7.1 Contact with No Messages
**Objective**: Verify graceful handling of empty message history

**Prerequisites**:
- Contact with NO messageHistory entries

**Steps**:
1. Open contact modal → Message History tab

**Expected Results**:
- [ ] Badge shows "Message History (0)"
- [ ] Empty state message: "No messages sent yet"
- [ ] No errors in console

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 7.2 Very Long Message Body
**Objective**: Verify UI handles long message bodies gracefully

**Prerequisites**:
- Ability to generate or import a message with 1000+ character body

**Steps**:
1. Generate AI message with very detailed context (or paste long text)
2. View in message history

**Expected Results**:
- [ ] Message preview truncates at 100 characters + "..."
- [ ] UI doesn't break or overflow
- [ ] Full message is stored in data (check in console)

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

#### 7.3 Contact Name with Special Characters
**Objective**: Verify system handles names with accents, apostrophes, etc.

**Prerequisites**:
- Create contact with name like "François O'Brien-García"

**Steps**:
1. Sync LinkedIn message for this contact
2. View message history
3. Generate AI message

**Expected Results**:
- [ ] Name matching works correctly (case-insensitive)
- [ ] No duplicate contacts created
- [ ] AI-generated message includes full name correctly
- [ ] No encoding issues or garbled characters

**Actual Results**:
- [ ] Pass / [ ] Fail
**Notes**: _______________________________________________

---

## Summary

**Total Test Cases**: 23
**Passed**: _____
**Failed**: _____
**Blocked**: _____
**Not Tested**: _____

**Pass Rate**: _____%

**Critical Issues Found**:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Recommendations**:
_______________________________________________
_______________________________________________
_______________________________________________

**Sign-off**:
- Tester: _______________  Date: _______________
- Product Owner: _______________  Date: _______________
