#!/usr/bin/env node
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('linkedin-import-fixed.json', 'utf8'));

// Create minimal data - just contact info and last 5 outreach entries
const minimalContacts = data.contacts.map(c => ({
    id: c.id,
    name: c.name,
    title: c.title || '',
    company: c.company || '',
    email: c.email || '',
    source: 'linkedin',
    status: c.status || 'contacted',
    priority: 'medium',
    linkedin: c.linkedin || '',
    lastContacted: c.lastContacted,
    // Keep only last 5 outreach entries
    outreachHistory: (c.outreachHistory || []).slice(-5),
    // Keep only last 5 messages, with truncated body
    messageHistory: (c.messageHistory || []).slice(-5).map(m => ({
        id: m.id,
        date: m.date,
        type: m.type,
        body: (m.body || '').substring(0, 100),
        responded: m.responded
    }))
}));

const output = JSON.stringify(minimalContacts);
console.log('Minimal data size: ' + (output.length / 1024 / 1024).toFixed(2) + ' MB');
console.log('Contacts: ' + minimalContacts.length);

fs.writeFileSync('public-linkedin-import.json', output);
console.log('Saved to public-linkedin-import.json');
