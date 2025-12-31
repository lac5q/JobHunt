#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple CSV parser
function parseCSV(text) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentLine.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (currentField || currentLine.length > 0) {
                currentLine.push(currentField.trim());
                if (currentLine.some(f => f.length > 0)) {
                    lines.push(currentLine);
                }
                currentLine = [];
                currentField = '';
            }
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
        } else {
            currentField += char;
        }
    }

    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        if (currentLine.some(f => f.length > 0)) {
            lines.push(currentLine);
        }
    }

    return lines;
}

// Load existing contacts
const contactsPath = path.join(process.env.HOME, 'Library', 'Application Support', 'Google', 'Chrome', 'Default', 'Local Storage', 'leveldb');
let contacts = [];

// For now, we'll create a JSON file that can be imported
console.log('📂 LinkedIn Archive Import Script\n');

// Import Connections
console.log('Step 1: Importing Connections.csv...');
const connectionsText = fs.readFileSync('linkedin-archives/Connections.csv', 'utf-8');
const connectionsLines = parseCSV(connectionsText);
const connectionsHeaders = connectionsLines[0].map(h => h.toLowerCase().trim());

const firstNameIdx = connectionsHeaders.findIndex(h => h.includes('first name'));
const lastNameIdx = connectionsHeaders.findIndex(h => h.includes('last name'));
const companyIdx = connectionsHeaders.findIndex(h => h.includes('company'));
const positionIdx = connectionsHeaders.findIndex(h => h.includes('position'));
const emailIdx = connectionsHeaders.findIndex(h => h.includes('email'));
const connectedOnIdx = connectionsHeaders.findIndex(h => h.includes('connected on'));

let newContactsCount = 0;

for (let i = 1; i < connectionsLines.length; i++) {
    const row = connectionsLines[i];
    const firstName = row[firstNameIdx] || '';
    const lastName = row[lastNameIdx] || '';
    const name = `${firstName} ${lastName}`.trim();

    if (!name) continue;

    const company = companyIdx !== -1 ? row[companyIdx] : '';
    const position = positionIdx !== -1 ? row[positionIdx] : '';
    const email = emailIdx !== -1 ? row[emailIdx] : '';
    const connectedOn = connectedOnIdx !== -1 ? row[connectedOnIdx] : '';

    // Check if already exists
    const existing = contacts.find(c =>
        c.name.toLowerCase() === name.toLowerCase() ||
        (email && c.email && c.email.toLowerCase() === email.toLowerCase())
    );

    if (!existing) {
        contacts.push({
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: name,
            title: position || '',
            company: company || '',
            email: email || '',
            phone: '',
            source: 'linkedin',
            status: 'not-contacted',
            priority: 'medium',
            notes: '',
            tags: [],
            outreach: [],
            lastContact: connectedOn ? new Date(connectedOn).toISOString() : null,
            messageHistory: [],
            linkedInUrl: ''
        });
        newContactsCount++;
    } else {
        // Update existing
        if (company && !existing.company) existing.company = company;
        if (position && !existing.title) existing.title = position;
        if (email && !existing.email) existing.email = email;
    }
}

console.log(`✓ ${newContactsCount} new connections imported`);

// Import Messages
console.log('\nStep 2: Importing messages.csv...');
const messagesText = fs.readFileSync('linkedin-archives/messages.csv', 'utf-8');
const messagesLines = parseCSV(messagesText);
const messagesHeaders = messagesLines[0].map(h => h.toLowerCase().trim());

const fromIdx = messagesHeaders.indexOf('from');
const toIdx = messagesHeaders.indexOf('to');
const dateIdx = messagesHeaders.indexOf('date');
const contentIdx = messagesHeaders.indexOf('content');
const senderUrlIdx = messagesHeaders.findIndex(h => h.includes('sender profile url'));
const recipientUrlsIdx = messagesHeaders.findIndex(h => h.includes('recipient profile url'));

const myName = 'Luis Calderon';
let messagesImported = 0;
const updatedContactIds = new Set();

console.log(`Processing ${messagesLines.length - 1} messages...`);

for (let i = 1; i < messagesLines.length; i++) {
    const row = messagesLines[i];
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

    if (!otherPersonName) continue;

    // Find or create contact
    let contact = contacts.find(c =>
        c.name.toLowerCase() === otherPersonName.toLowerCase() ||
        (otherPersonUrl && c.linkedInUrl && c.linkedInUrl === otherPersonUrl)
    );

    if (!contact) {
        contact = {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: otherPersonName,
            title: '',
            company: '',
            email: '',
            phone: '',
            source: 'linkedin',
            status: isFromMe ? 'contacted' : 'not-contacted',
            priority: 'medium',
            notes: '',
            tags: [],
            outreach: [],
            lastContact: new Date(date).toISOString(),
            messageHistory: [],
            linkedInUrl: otherPersonUrl || ''
        };
        contacts.push(contact);
    }

    if (!contact.messageHistory) contact.messageHistory = [];
    if (!contact.outreach) contact.outreach = [];

    const messageDate = new Date(date).toISOString();

    // Check duplicate
    const exists = contact.messageHistory.some(m =>
        m.date === messageDate && m.body === content
    );

    if (!exists) {
        contact.messageHistory.push({
            id: `linkedin-msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: messageDate,
            type: 'linkedin-message',
            subject: 'LinkedIn Message',
            body: content,
            sentVia: 'linkedin',
            aiGenerated: false,
            responded: !isFromMe,
            responseDate: !isFromMe ? messageDate : null
        });

        contact.outreach.push({
            type: isFromMe ? 'linkedin-message-sent' : 'linkedin-message-received',
            date: messageDate,
            notes: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            channel: 'linkedin-messaging'
        });

        const msgDate = new Date(messageDate);
        const currentLastContact = contact.lastContact ? new Date(contact.lastContact) : new Date(0);
        if (msgDate > currentLastContact) {
            contact.lastContact = messageDate;
        }

        if (isFromMe && contact.status === 'not-contacted') {
            contact.status = 'contacted';
        }

        messagesImported++;
        updatedContactIds.add(contact.id);
    }

    // Progress indicator
    if (i % 1000 === 0) {
        console.log(`  Processed ${i}/${messagesLines.length - 1} messages...`);
    }
}

console.log(`✓ ${messagesImported} messages imported`);
console.log(`✓ ${updatedContactIds.size} contacts updated with messages`);

// Save to JSON file
const outputPath = 'linkedin-import-output.json';
const output = {
    contacts: contacts,
    importSummary: {
        totalContacts: contacts.length,
        newConnectionsImported: newContactsCount,
        messagesImported: messagesImported,
        contactsWithMessages: updatedContactIds.size,
        importDate: new Date().toISOString()
    }
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`\n✅ Import Complete!`);
console.log(`   Output saved to: ${outputPath}`);
console.log(`\nImport Summary:`);
console.log(`   Total contacts: ${contacts.length}`);
console.log(`   New connections: ${newContactsCount}`);
console.log(`   Messages imported: ${messagesImported}`);
console.log(`   Contacts with messages: ${updatedContactIds.size}`);
console.log(`\nNext step: Import this JSON file via the dashboard Settings → Import JSON button`);
