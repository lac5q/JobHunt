// Vercel Serverless Function for LinkedIn CRM Sync
// This bypasses CORS by acting as a proxy between the extension and Supabase

const SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

export default async function handler(req, res) {
    // Enable CORS for Chrome extension
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const messageData = req.body;
        console.log('Syncing message from:', messageData.contactName);

        // Fetch existing conversations
        const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Supabase GET failed: HTTP ${response.status}`);
        }

        const data = await response.json();
        let conversations = data[0]?.linkedin_conversations || [];

        // Add new conversation
        const conversationLog = {
            id: messageData.conversationId,
            contactName: messageData.contactName,
            lastMessage: messageData.message,
            timestamp: messageData.timestamp,
            url: messageData.url,
            syncedAt: new Date().toISOString()
        };

        // Prevent duplicates: Update if exists, insert if new
        const existingIndex = conversations.findIndex(c => c.id === messageData.conversationId);
        if (existingIndex >= 0) {
            // Update existing conversation
            conversations[existingIndex] = conversationLog;
        } else {
            // Check for duplicate by contact name as backup
            const nameMatch = conversations.findIndex(c =>
                c.contactName.toLowerCase() === messageData.contactName.toLowerCase()
            );

            if (nameMatch >= 0 && !conversations[nameMatch].id.startsWith('contact-')) {
                // Update if found by name and has real thread ID
                conversations[nameMatch] = conversationLog;
            } else {
                // Insert new conversation
                conversations.unshift(conversationLog);
            }
        }

        // Remove duplicates by ID (defensive)
        const seen = new Set();
        conversations = conversations.filter(c => {
            if (seen.has(c.id)) return false;
            seen.add(c.id);
            return true;
        });

        // Keep only last 500 conversations
        conversations = conversations.slice(0, 500);

        // Update Supabase
        const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                linkedin_conversations: conversations
            })
        });

        if (!updateResponse.ok) {
            throw new Error(`Supabase PATCH failed: HTTP ${updateResponse.status}`);
        }

        console.log('✅ Synced:', messageData.contactName);

        return res.status(200).json({
            success: true,
            conversationId: messageData.conversationId,
            totalConversations: conversations.length
        });

    } catch (error) {
        console.error('❌ Sync error:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
