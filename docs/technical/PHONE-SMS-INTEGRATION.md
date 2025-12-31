# iPhone & Mac Phone/SMS Integration
## Job Search CRM

**Date**: December 13, 2025
**Status**: Implementation Ready
**Platform**: iPhone + Mac only

---

## Overview

This guide explains how to integrate your **personal iPhone texts and phone logs** into the CRM using native Apple features (no third-party apps required).

**What you'll get**:
- ✅ Full iMessage + SMS history synced to CRM
- ✅ Call logs with duration and timestamps
- ✅ Automatic contact matching by phone number
- ✅ Updates to lastContact, messageHistory, and outreach arrays
- ✅ 100% local processing (privacy-first)

---

## Prerequisites

**You need**:
- iPhone with iMessage/SMS
- Mac computer with macOS (Messages app synced via iCloud)
- iCloud sync enabled (Settings → [Your Name] → iCloud → Messages ON)

**Verify Messages sync**:
1. Open Messages app on Mac
2. Check that recent iPhone texts appear
3. If not, go to Messages → Settings → iMessage → Enable Messages in iCloud

---

## Part 1: iMessage & SMS Export

### Option A: Direct Database Query (Recommended)

macOS stores all Messages in a SQLite database. We can query it directly.

**1. Create export script**

Save as `~/export-messages.sh`:

```bash
#!/bin/bash
# Export iMessages to JSON for CRM import

DB="$HOME/Library/Messages/chat.db"
OUTPUT="$HOME/Downloads/imessages-export-$(date +%Y-%m-%d).json"

# Query Messages database
sqlite3 "$DB" <<'EOF' | jq -R -s -c 'split("\n") | map(select(length > 0) | split("|")) | map({
  contact: .[0],
  phone: .[1],
  message: .[2],
  date: .[3],
  direction: (if .[4] == "0" then "incoming" else "outgoing" end)
})' > "$OUTPUT"

SELECT
  COALESCE(handle.id, 'Unknown') as contact,
  handle.id as phone,
  message.text as message,
  datetime(message.date/1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') as date,
  message.is_from_me as direction
FROM message
LEFT JOIN handle ON message.handle_id = handle.ROWID
WHERE message.date >= strftime('%s', 'now', '-90 days') * 1000000000
  AND message.text IS NOT NULL
ORDER BY message.date DESC;
EOF

echo "✓ Exported to: $OUTPUT"
echo "$(jq length "$OUTPUT") messages exported"
```

**2. Make executable and run**:

```bash
chmod +x ~/export-messages.sh
~/export-messages.sh
```

**Output**: `~/Downloads/imessages-export-YYYY-MM-DD.json`

### Option B: AppleScript Export (Alternative)

If database query doesn't work, use AppleScript:

**1. Create AppleScript**

Save as `~/export-imessages.scpt`:

```applescript
-- Export recent messages from Messages app
use scripting additions

set outputList to {}
set todayDate to current date
set ninetyDaysAgo to todayDate - (90 * days)

tell application "Messages"
    repeat with aChat in every chat
        try
            set chatParticipants to participants of aChat
            repeat with aPerson in chatParticipants
                set personID to id of aPerson
                set personName to name of aPerson

                -- Get messages from this chat
                set chatMessages to messages of aChat
                repeat with aMessage in chatMessages
                    try
                        set msgDate to date sent of aMessage
                        if msgDate > ninetyDaysAgo then
                            set msgText to text of aMessage
                            set msgDirection to direction of aMessage

                            set msgRecord to {|contact|:personName, |phone|:personID, |message|:msgText, |date|:msgDate as string, |direction|:msgDirection as string}
                            set end of outputList to msgRecord
                        end if
                    end try
                end repeat
            end repeat
        end try
    end repeat
end tell

return outputList
```

**2. Create shell wrapper**

Save as `~/export-messages-applescript.sh`:

```bash
#!/bin/bash
OUTPUT="$HOME/Downloads/imessages-export-$(date +%Y-%m-%d).json"

osascript ~/export-imessages.scpt | \
  perl -pe 's/\{/\n{/g' | \
  jq -Rs 'split("\n") | map(select(length > 0))' > "$OUTPUT"

echo "✓ Exported to: $OUTPUT"
```

**3. Run**:

```bash
chmod +x ~/export-messages-applescript.sh
~/export-messages-applescript.sh
```

---

## Part 2: Call Log Export

Use iOS Shortcuts to export call history.

### Create iOS Shortcut

**1. Open Shortcuts app on iPhone**

**2. Create new shortcut with these actions**:

1. **Find Contacts** → All Contacts
2. **Get Phone Numbers** from Contacts (get all numbers)
3. **Text** → Set variable "allPhones"
4. **Get Call History** → Last 90 days
5. **Repeat** with each call:
   - Get "Call Recipient" from call
   - Get "Call Duration" from call
   - Get "Call Date" from call
   - Get "Call Direction" from call (incoming/outgoing)
   - **Dictionary** with keys:
     - contact: Call Recipient
     - phone: Call Recipient Phone
     - date: Call Date
     - duration: Call Duration (seconds)
     - direction: Call Direction
   - Add to variable "callLogArray"
6. **Get Dictionary Value** → callLogArray
7. **Convert** to JSON
8. **Save File** → iCloud Drive/JobHunt/call-log-YYYY-MM-DD.json

**3. Name shortcut**: "Export Call Log to JobHunt"

**4. Run shortcut**:
- Open Shortcuts app
- Tap "Export Call Log to JobHunt"
- Wait for completion
- Check iCloud Drive/JobHunt/ folder

---

## Part 3: Import to CRM

### Add Import Buttons to Dashboard

I'll add two import buttons to the Settings modal:

**1. Import iMessages/SMS button**:
- Opens file picker
- Reads JSON from `export-messages.sh`
- Matches contacts by phone number (normalize: remove +1, spaces, dashes)
- Fallback match by contact name
- Adds to messageHistory array
- Updates lastContact date
- Updates outreach array

**2. Import Call Log button**:
- Reads JSON from iOS Shortcut output
- Matches contacts by phone number
- Adds to outreach array with call duration
- Updates lastContact date
- Does NOT add to messageHistory (calls don't have message content)

### Import Logic

**Phone number normalization**:
```javascript
function normalizePhone(phone) {
  if (!phone) return '';
  // Remove country code, spaces, dashes, parentheses
  return phone.replace(/[\+\s\-\(\)]/g, '').slice(-10);
}
```

**Match contacts by phone**:
```javascript
function findContactByPhone(phone) {
  const normalized = normalizePhone(phone);
  return contacts.find(c =>
    normalizePhone(c.phone) === normalized
  );
}
```

**Message import**:
```javascript
async function importMessages() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    const text = await file.text();
    const messages = JSON.parse(text);

    let imported = 0;
    let updated = 0;

    messages.forEach(msg => {
      // Try phone match first, then name
      let contact = findContactByPhone(msg.phone);
      if (!contact) {
        contact = findContactByName(msg.contact);
      }

      if (contact) {
        // Initialize arrays
        if (!contact.messageHistory) contact.messageHistory = [];
        if (!contact.outreach) contact.outreach = [];

        // Check for duplicate
        const exists = contact.messageHistory.some(m =>
          m.date === msg.date && m.body === msg.message
        );

        if (!exists) {
          // Add to messageHistory
          contact.messageHistory.push({
            id: `sms-${Date.now()}-${Math.random()}`,
            date: msg.date,
            type: 'sms-message',
            subject: 'Text Message',
            body: msg.message,
            sentVia: 'iphone',
            aiGenerated: false,
            responded: msg.direction === 'incoming',
            responseDate: msg.direction === 'incoming' ? msg.date : null
          });

          // Add to outreach
          contact.outreach.push({
            type: msg.direction === 'incoming' ? 'received-sms' : 'sent-sms',
            date: msg.date,
            notes: msg.message.substring(0, 100) + '...',
            channel: 'sms'
          });

          // Update lastContact
          if (new Date(msg.date) > new Date(contact.lastContact || 0)) {
            contact.lastContact = msg.date;
          }

          imported++;
        }
        updated++;
      }
    });

    saveContacts(contacts);
    updateAllDisplays();

    alert(`✓ SMS Import Complete\n${imported} new messages\n${updated} contacts updated`);
  };

  fileInput.click();
}
```

**Call log import**:
```javascript
async function importCallLog() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';

  fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    const text = await file.text();
    const calls = JSON.parse(text);

    let imported = 0;

    calls.forEach(call => {
      const contact = findContactByPhone(call.phone) || findContactByName(call.contact);

      if (contact) {
        if (!contact.outreach) contact.outreach = [];

        // Check for duplicate
        const exists = contact.outreach.some(o =>
          o.date === call.date && o.type.includes('call')
        );

        if (!exists) {
          // Add to outreach
          const minutes = Math.floor(call.duration / 60);
          const seconds = call.duration % 60;

          contact.outreach.push({
            type: call.direction === 'incoming' ? 'received-call' : 'placed-call',
            date: call.date,
            notes: `${call.direction} call - ${minutes}m ${seconds}s`,
            channel: 'phone'
          });

          // Update lastContact
          if (new Date(call.date) > new Date(contact.lastContact || 0)) {
            contact.lastContact = call.date;
          }

          imported++;
        }
      }
    });

    saveContacts(contacts);
    updateAllDisplays();

    alert(`✓ Call Log Import Complete\n${imported} calls logged`);
  };

  fileInput.click();
}
```

---

## Part 4: Automation

### Weekly iMessage Export (Mac)

**1. Create LaunchAgent plist**

Save as `~/Library/LaunchAgents/com.jobhunt.messages-export.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.jobhunt.messages-export</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/lcalderon/export-messages.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Weekday</key>
        <integer>0</integer>
        <key>Hour</key>
        <integer>9</integer>
        <key>Minute</integer>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/messages-export.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/messages-export.error.log</string>
</dict>
</plist>
```

**2. Load LaunchAgent**:

```bash
launchctl load ~/Library/LaunchAgents/com.jobhunt.messages-export.plist
```

**Now runs**: Every Sunday at 9:00 AM

### Weekly Call Log Export (iPhone)

**1. In Shortcuts app**:
- Open your "Export Call Log" shortcut
- Tap "..." menu
- Enable "Run as Automation"

**2. Create Personal Automation**:
- Open Shortcuts → Automation tab
- Tap "+" → Personal Automation
- Choose "Time of Day"
- Set to "Weekly" → Sunday 9:00 AM
- Add action: "Run Shortcut" → "Export Call Log to JobHunt"
- Disable "Ask Before Running"

**Now runs**: Every Sunday at 9:00 AM automatically

---

## Part 5: Implementation Checklist

### Phase 1: Manual Import (Today - 2 hours)

- [ ] Create `~/export-messages.sh` script on Mac
- [ ] Run script to test (should create JSON file)
- [ ] Create iOS Shortcut for call log export
- [ ] Run shortcut to test (should save to iCloud Drive)
- [ ] Add "Import SMS" button to dashboard Settings
- [ ] Add "Import Call Log" button to dashboard Settings
- [ ] Test SMS import with sample file
- [ ] Test call log import with sample file
- [ ] Verify contacts updated correctly
- [ ] Verify UI shows new messages/calls

### Phase 2: Automated Export (Next Week - 1 hour)

- [ ] Create LaunchAgent plist for weekly iMessage export
- [ ] Load LaunchAgent and test
- [ ] Enable iOS Shortcut automation for call log
- [ ] Test automation runs on schedule
- [ ] Verify exports appear in correct location

### Phase 3: Polish (Optional - 1 hour)

- [ ] Add import progress indicator
- [ ] Add detailed import report (show duplicates skipped)
- [ ] Add filter to exclude group chats (SMS import)
- [ ] Add date range selector (last 30/60/90 days)
- [ ] Add "Auto-import from iCloud Drive" feature
- [ ] Add duplicate detection warnings

---

## Expected Results

After implementation:

**SMS/iMessage Import**:
- Every text message becomes a messageHistory entry
- Contact lastContact dates update automatically
- Outreach array tracks sent vs received
- See full conversation history in contact modal

**Call Log Import**:
- Every phone call becomes an outreach entry
- Shows call direction (incoming/outgoing)
- Shows call duration
- Contact lastContact dates update
- Analytics show "phone" as outreach channel

**Example Contact Record**:

```javascript
{
  name: "Sarah Chen",
  phone: "+1-415-555-1234",
  lastContact: "2024-12-10T14:30:00Z", // Updated from latest text

  messageHistory: [
    {
      id: "sms-1702141234",
      date: "2024-12-10T14:30:00Z",
      type: "sms-message",
      subject: "Text Message",
      body: "Thanks for connecting! Let's chat next week.",
      sentVia: "iphone",
      aiGenerated: false,
      responded: true,
      responseDate: "2024-12-10T15:00:00Z"
    },
    // ... more messages
  ],

  outreach: [
    {
      type: "sent-sms",
      date: "2024-12-10T14:30:00Z",
      notes: "Thanks for connecting! Let's...",
      channel: "sms"
    },
    {
      type: "placed-call",
      date: "2024-12-08T10:15:00Z",
      notes: "outgoing call - 12m 34s",
      channel: "phone"
    },
    // ... more outreach
  ]
}
```

---

## Privacy & Security

**✅ Safe**:
- All processing happens locally on your Mac
- No data sent to third-party servers
- Messages database is read-only (never modified)
- Exported JSON files stay in your Downloads folder
- You control when imports happen

**⚠️ Important**:
- Never commit exported JSON files to Git (already in .gitignore)
- Delete old exports after importing (keep last 2-3 for backup)
- Exported files contain sensitive personal data
- If sharing device, encrypt exports: `zip -e messages.zip messages.json`

---

## Troubleshooting

### "Permission denied" error on Messages database

**Solution**:
```bash
# Grant Terminal full disk access
# System Settings → Privacy & Security → Full Disk Access
# Add Terminal.app
```

### Messages database query returns empty

**Fix**: Use AppleScript export method instead (Option B above)

### iOS Shortcut can't access call history

**Solution**:
- Settings → Privacy & Security → Phone → Shortcuts → Enable
- Re-run shortcut

### Phone numbers not matching contacts

**Check**:
- Contact phone field format: "+1-415-555-1234" or "(415) 555-1234"
- Script normalizes to last 10 digits
- If international number (not +1), modify normalization logic

### Duplicate messages on re-import

**This is prevented** - the import logic checks for existing messages by date + body before adding.

---

## Future Enhancements

**Possible additions**:

1. **Auto-import from iCloud Drive**:
   - Dashboard checks iCloud Drive folder every 5 minutes
   - Auto-imports new export files
   - Moves imported files to "processed" subfolder

2. **Group chat filtering**:
   - Detect group chats (multiple participants)
   - Skip group messages (or create separate import)
   - Only import 1-on-1 conversations

3. **Message sentiment analysis**:
   - Use AI to detect tone (positive/negative/neutral)
   - Tag messages with sentiment
   - Show sentiment trends in analytics

4. **Call recording transcripts**:
   - If using call recording app
   - Import transcripts as message content
   - Search call conversations like SMS

5. **Contact photo sync**:
   - Extract contact photos from macOS Contacts
   - Display in CRM contact cards

---

## Summary

**What you'll do**:
1. Run `export-messages.sh` on Mac (gets all texts from last 90 days)
2. Run iOS Shortcut on iPhone (gets call log from last 90 days)
3. Upload JSON files via CRM Settings buttons
4. See all contacts updated with messages, calls, lastContact dates

**Time investment**:
- Initial setup: 2 hours
- Weekly maintenance: 2 minutes (upload 2 files)
- With automation: 0 minutes (runs automatically)

**Cost**: $0 (uses native Apple features)

**Privacy**: 100% local processing, no cloud services

---

**Ready to implement?** I can add the import buttons to your dashboard now. Let me know!
