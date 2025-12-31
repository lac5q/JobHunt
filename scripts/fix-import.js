#!/usr/bin/env node
const fs = require('fs');

// Simple CSV parser
function parseCSV(text) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuotes) {
            if (char === '"' && nextChar === '"') {
                currentField += '"';
                i++;
            } else if (char === '"') {
                inQuotes = false;
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                currentLine.push(currentField.trim());
                currentField = '';
            } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                currentLine.push(currentField.trim());
                if (currentLine.some(f => f)) lines.push(currentLine);
                currentLine = [];
                currentField = '';
                if (char === '\r') i++;
            } else {
                currentField += char;
            }
        }
    }
    if (currentField || currentLine.length) {
        currentLine.push(currentField.trim());
        if (currentLine.some(f => f)) lines.push(currentLine);
    }
    return lines;
}

// Step 1: Load connections to get title/company
console.log('📂 Loading connections...');
const connectionsText = fs.readFileSync('linkedin-archives/Connections.csv', 'utf8');
const connLines = parseCSV(connectionsText);

// Find header row (skip notes)
let headerIdx = connLines.findIndex(l => l[0] === 'First Name');
if (headerIdx === -1) headerIdx = 2;

const connectionsByName = {};
for (let i = headerIdx + 1; i < connLines.length; i++) {
    const row = connLines[i];
    if (row.length >= 6) {
        const firstName = row[0] || '';
        const lastName = row[1] || '';
        const url = row[2] || '';
        const email = row[3] || '';
        const company = row[4] || '';
        const position = row[5] || '';

        const fullName = (firstName + ' ' + lastName).trim();
        if (fullName) {
            connectionsByName[fullName.toLowerCase()] = {
                name: fullName,
                linkedin: url,
                email: email,
                company: company,
                title: position
            };
        }
    }
}
console.log('  Found ' + Object.keys(connectionsByName).length + ' connections');

// Step 2: Load messages
console.log('📂 Loading messages...');
const messagesText = fs.readFileSync('linkedin-archives/messages.csv', 'utf8');
const msgLines = parseCSV(messagesText);

const msgHeaders = msgLines[0].map(h => h.toLowerCase().trim());
const fromIdx = msgHeaders.indexOf('from');
const toIdx = msgHeaders.indexOf('to');
const dateIdx = msgHeaders.indexOf('date');
const contentIdx = msgHeaders.indexOf('content');
const senderUrlIdx = msgHeaders.findIndex(h => h.includes('sender profile url'));
const recipientUrlsIdx = msgHeaders.findIndex(h => h.includes('recipient profile url'));

const myName = 'Luis Calderon';
const contactsMap = {};

console.log('  Processing messages...');
for (let i = 1; i < msgLines.length; i++) {
    const row = msgLines[i];
    const from = row[fromIdx] || '';
    const to = row[toIdx] || '';
    const date = row[dateIdx] || '';
    const content = row[contentIdx] || '';
    const senderUrl = senderUrlIdx !== -1 ? row[senderUrlIdx] : '';
    const recipientUrls = recipientUrlsIdx !== -1 ? row[recipientUrlsIdx] : '';

    if (!content || !from || !to || !date) continue;

    const isFromMe = from.trim() === myName;
    const otherPersonName = isFromMe ? to.trim() : from.trim();
    const otherPersonUrl = isFromMe ? recipientUrls : senderUrl;

    if (!otherPersonName || otherPersonName === myName) continue;

    const key = otherPersonName.toLowerCase();

    if (!contactsMap[key]) {
        // Get connection info if available
        const connInfo = connectionsByName[key] || {};

        contactsMap[key] = {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: otherPersonName,
            title: connInfo.title || '',
            company: connInfo.company || '',
            email: connInfo.email || '',
            phone: '',
            source: 'linkedin',
            status: 'contacted',
            priority: 'medium',
            notes: '',
            tags: [],
            linkedin: connInfo.linkedin || otherPersonUrl || '',
            lastContacted: null,
            outreachHistory: [],
            messageHistory: []
        };
    }

    const contact = contactsMap[key];
    const msgDate = new Date(date).toISOString();

    // Check for duplicate
    const exists = contact.messageHistory.some(m =>
        m.date === msgDate && m.body.substring(0, 50) === content.substring(0, 50)
    );

    if (!exists) {
        // Add to messageHistory (keep body short for localStorage)
        contact.messageHistory.push({
            id: 'li-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            date: msgDate,
            type: 'linkedin-message',
            subject: 'LinkedIn Message',
            body: content.substring(0, 150),
            sentVia: 'linkedin',
            aiGenerated: false,
            responded: !isFromMe
        });

        // Add to outreachHistory
        contact.outreachHistory.push({
            type: isFromMe ? 'linkedin' : 'response',
            date: msgDate,
            notes: content.substring(0, 80)
        });

        // Update lastContacted
        if (!contact.lastContacted || new Date(msgDate) > new Date(contact.lastContacted)) {
            contact.lastContacted = msgDate;
        }

        // Update status based on responses
        if (!isFromMe && contact.status === 'contacted') {
            contact.status = 'responded';
        }
    }

    if (i % 1000 === 0) console.log('  Processed ' + i + '/' + msgLines.length + ' messages...');
}

// Convert to array and sort by last contact
let contacts = Object.values(contactsMap);

// Sort messages and outreach chronologically
contacts.forEach(c => {
    c.messageHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    c.outreachHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Keep only last 15 messages to save space
    if (c.messageHistory.length > 15) {
        c.messageHistory = c.messageHistory.slice(-15);
    }
    if (c.outreachHistory.length > 15) {
        c.outreachHistory = c.outreachHistory.slice(-15);
    }
});

// Sort contacts by last contacted
contacts.sort((a, b) => {
    if (!a.lastContacted) return 1;
    if (!b.lastContacted) return -1;
    return new Date(b.lastContacted) - new Date(a.lastContacted);
});

console.log('\n✅ Processed ' + contacts.length + ' contacts');
console.log('   With title/company: ' + contacts.filter(c => c.title || c.company).length);

// Calculate stats
const stats = {
    totalContacts: contacts.length,
    withTitle: contacts.filter(c => c.title).length,
    withCompany: contacts.filter(c => c.company).length,
    withMessages: contacts.filter(c => c.messageHistory.length > 0).length
};

// Save
const output = { contacts, stats };
const jsonStr = JSON.stringify(output);
console.log('   JSON size: ' + (jsonStr.length / 1024 / 1024).toFixed(2) + ' MB');

fs.writeFileSync('linkedin-import-fixed.json', jsonStr);
console.log('   Saved to linkedin-import-fixed.json');
