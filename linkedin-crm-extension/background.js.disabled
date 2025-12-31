// LinkedIn CRM Sync - Background Service Worker

console.log('LinkedIn CRM Sync: Background service worker started');

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SYNC_LINKEDIN_MESSAGE') {
        syncToSupabase(request.data)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep message channel open for async response
    }

    if (request.type === 'TEST_CONNECTION') {
        testSupabaseConnection()
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep message channel open for async response
    }
});

async function testSupabaseConnection() {
    const DEFAULT_SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
    const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

    const settings = await chrome.storage.sync.get(['supabaseUrl', 'supabaseKey']);
    const supabaseUrl = settings.supabaseUrl || DEFAULT_SUPABASE_URL;
    const supabaseKey = settings.supabaseKey || DEFAULT_SUPABASE_KEY;

    const response = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return true;
}

async function syncToSupabase(messageData) {
    // Default credentials - saved in code
    const DEFAULT_SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
    const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

    // Get Supabase credentials from storage (or use defaults)
    const settings = await chrome.storage.sync.get(['supabaseUrl', 'supabaseKey']);

    const supabaseUrl = settings.supabaseUrl || DEFAULT_SUPABASE_URL;
    const supabaseKey = settings.supabaseKey || DEFAULT_SUPABASE_KEY;

    // Get existing data
    const response = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch existing data');
    }

    const data = await response.json();
    const currentData = data[0] || { id: 'main' };

    // Get or create linkedin_conversations array
    let linkedinConversations = currentData.linkedin_conversations || [];

    // Add new conversation log
    const conversationLog = {
        id: messageData.conversationId,
        contactName: messageData.contactName,
        lastMessage: messageData.message,
        timestamp: messageData.timestamp,
        url: messageData.url,
        syncedAt: new Date().toISOString()
    };

    // Check if conversation already exists
    const existingIndex = linkedinConversations.findIndex(c => c.id === messageData.conversationId);

    if (existingIndex >= 0) {
        // Update existing
        linkedinConversations[existingIndex] = conversationLog;
    } else {
        // Add new
        linkedinConversations.unshift(conversationLog);
    }

    // Keep only last 500 conversations
    linkedinConversations = linkedinConversations.slice(0, 500);

    // Update Supabase
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
        method: 'PATCH',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({
            linkedin_conversations: linkedinConversations
        })
    });

    if (!updateResponse.ok) {
        throw new Error('Failed to update Supabase');
    }

    console.log('Synced LinkedIn message to Supabase:', messageData.contactName);

    // Also try to match with existing contact in CRM
    await updateContactInCRM(messageData);

    return true;
}

async function updateContactInCRM(messageData) {
    try {
        // Default credentials - saved in code
        const DEFAULT_SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
        const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

        const settings = await chrome.storage.sync.get(['supabaseUrl', 'supabaseKey']);
        const supabaseUrl = settings.supabaseUrl || DEFAULT_SUPABASE_URL;
        const supabaseKey = settings.supabaseKey || DEFAULT_SUPABASE_KEY;

        // Get existing contacts
        const response = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        const data = await response.json();
        const contacts = data[0]?.contacts || [];

        // Try to find matching contact by name
        const contactIndex = contacts.findIndex(c => {
            const fullName = `${c['First Name']} ${c['Last Name']}`.toLowerCase();
            return fullName.includes(messageData.contactName.toLowerCase()) ||
                   messageData.contactName.toLowerCase().includes(fullName);
        });

        if (contactIndex >= 0) {
            // Update contact with last LinkedIn interaction
            contacts[contactIndex].lastLinkedInMessage = messageData.message;
            contacts[contactIndex].lastLinkedInContact = messageData.timestamp;
            contacts[contactIndex].linkedInConversationId = messageData.conversationId;

            // Update in Supabase
            await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
                method: 'PATCH',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contacts })
            });

            console.log('Updated contact in CRM:', contacts[contactIndex]['First Name'], contacts[contactIndex]['Last Name']);
        }
    } catch (error) {
        console.error('Error updating contact in CRM:', error);
        // Don't throw - conversation was still logged
    }
}

// Show notification when new message is synced
chrome.notifications?.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'LinkedIn CRM Sync',
    message: 'New LinkedIn conversation synced to your CRM'
});
