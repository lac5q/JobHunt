#!/usr/bin/env node
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('linkedin-import-fixed.json', 'utf8'));

// Compress contacts - keep only essential fields
const compressedContacts = data.contacts.map(c => {
    // Keep only last 8 messages, very short
    const msgs = (c.messageHistory || []).slice(-8).map(m => ({
        d: m.date,
        b: m.body.substring(0, 80),
        r: m.responded ? 1 : 0
    }));

    // Keep only last 8 outreach
    const out = (c.outreachHistory || []).slice(-8).map(o => ({
        t: o.type,
        d: o.date
    }));

    return {
        id: c.id,
        name: c.name,
        title: c.title || '',
        company: c.company || '',
        email: c.email || '',
        source: 'linkedin',
        status: c.status,
        priority: 'medium',
        linkedin: c.linkedin || '',
        lastContacted: c.lastContacted,
        msgs: msgs,
        out: out
    };
});

const jsonStr = JSON.stringify(compressedContacts);
console.log('Compressed size: ' + (jsonStr.length / 1024 / 1024).toFixed(2) + ' MB');
console.log('Contacts: ' + compressedContacts.length);

fs.writeFileSync('linkedin-import-compressed.json', jsonStr);
console.log('Saved to linkedin-import-compressed.json');
