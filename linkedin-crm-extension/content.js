// LinkedIn CRM Sync - Content Script
// Monitors LinkedIn messaging page and syncs conversations

// Silent mode - only log critical info
console.log('LinkedIn CRM Sync v1.4.1');

// Configuration with hardcoded defaults
const DEFAULT_SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

let syncEnabled = true;
let supabaseUrl = DEFAULT_SUPABASE_URL;
let supabaseKey = DEFAULT_SUPABASE_KEY;
let lastProcessedMessages = new Set();
let errorCount = 0;
let lastCheckTime = 0;
const CHECK_DEBOUNCE_MS = 5000; // Wait 5 seconds between checks
const MAX_ERRORS = 5; // Stop after 5 errors

// Load settings from storage (override defaults if set)
chrome.storage.sync.get(['syncEnabled', 'supabaseUrl', 'supabaseKey'], (result) => {
    syncEnabled = result.syncEnabled !== false; // Default to true
    if (result.supabaseUrl) supabaseUrl = result.supabaseUrl;
    if (result.supabaseKey) supabaseKey = result.supabaseKey;

    // Auto-save defaults if not already saved
    if (!result.supabaseUrl || !result.supabaseKey) {
        chrome.storage.sync.set({
            supabaseUrl: DEFAULT_SUPABASE_URL,
            supabaseKey: DEFAULT_SUPABASE_KEY
        });
    }

    // Load processed messages from local storage
    chrome.storage.local.get(['lastProcessedMessages'], (localResult) => {
        lastProcessedMessages = new Set(localResult.lastProcessedMessages || []);
        startMonitoring();
    });
});

// Listen for settings updates
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.syncEnabled) syncEnabled = changes.syncEnabled.newValue;
        if (changes.supabaseUrl) supabaseUrl = changes.supabaseUrl.newValue;
        if (changes.supabaseKey) supabaseKey = changes.supabaseKey.newValue;

        if (syncEnabled && supabaseUrl && supabaseKey) {
            startMonitoring();
        }
    }
});

function startMonitoring() {
    // Monitor for messaging page
    const observer = new MutationObserver((mutations) => {
        if (isMessagingPage()) {
            checkForNewMessages();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check
    if (isMessagingPage()) {
        checkForNewMessages();
    }

    // Periodic check every 30 seconds (reduced frequency)
    setInterval(() => {
        if (isMessagingPage()) {
            checkForNewMessages();
        }
    }, 30000);
}

function isMessagingPage() {
    return window.location.href.includes('linkedin.com/messaging');
}

function checkForNewMessages() {
    // Debounce: Don't check too frequently
    const now = Date.now();
    if (now - lastCheckTime < CHECK_DEBOUNCE_MS) {
        return;
    }
    lastCheckTime = now;

    // Stop if too many errors (silent)
    if (errorCount >= MAX_ERRORS) {
        return;
    }

    // LinkedIn messaging structure (may need updates if LinkedIn changes their DOM)
    const conversationThreads = document.querySelectorAll('.msg-conversation-listitem');

    let newCount = 0;
    let alreadyProcessedCount = 0;

    conversationThreads.forEach((thread) => {
        const contactName = extractContactName(thread);
        const lastMessage = extractLastMessage(thread);
        const timestamp = extractTimestamp(thread);
        const conversationId = extractConversationId(thread);

        if (contactName && lastMessage && conversationId && !lastProcessedMessages.has(conversationId)) {
            newCount++;

            // Mark as processed
            lastProcessedMessages.add(conversationId);
            saveProcessedMessages();

            // Sync to CRM
            syncMessageToCRM({
                contactName,
                message: lastMessage,
                timestamp,
                conversationId,
                url: window.location.href
            });
        } else if (conversationId && lastProcessedMessages.has(conversationId)) {
            alreadyProcessedCount++;
        }
    });

    // Silent mode - no logging
}

function extractContactName(threadElement) {
    try {
        const nameElement = threadElement.querySelector('.msg-conversation-listitem__participant-names');
        return nameElement ? nameElement.textContent.trim() : null;
    } catch (e) {
        console.error('Error extracting contact name:', e);
        return null;
    }
}

function extractLastMessage(threadElement) {
    try {
        // Try multiple selectors (LinkedIn updates their DOM frequently)
        const messageElement =
            threadElement.querySelector('.msg-conversation-card__message-snippet') ||
            threadElement.querySelector('.msg-conversation-listitem__message-snippet') ||
            threadElement.querySelector('[class*="message-snippet"]');

        return messageElement ? messageElement.textContent.trim() : null;
    } catch (e) {
        console.error('Error extracting message:', e);
        return null;
    }
}

function extractTimestamp(threadElement) {
    try {
        const timeElement = threadElement.querySelector('time');
        return timeElement ? timeElement.getAttribute('datetime') || new Date().toISOString() : new Date().toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
}

function extractConversationId(threadElement) {
    try {
        // Try to get thread ID from href (most reliable)
        const link = threadElement.querySelector('a[href*="messaging"]');
        if (link) {
            const href = link.getAttribute('href');
            const match = href.match(/messaging\/thread\/([^/?&#]+)/);
            if (match) {
                const threadId = match[1];
                // Validate it's a real LinkedIn thread ID (alphanumeric, 20+ chars)
                if (threadId.length > 15 && /^[a-zA-Z0-9_-]+$/.test(threadId)) {
                    return threadId;
                }
            }
        }

        // Try to get from data attributes
        const controlId = threadElement.getAttribute('data-control-id') ||
                         threadElement.getAttribute('data-view-name') ||
                         threadElement.getAttribute('id');
        if (controlId && controlId.length > 10) return controlId;

        // Fallback: use contact name (stable but less unique)
        const contactName = extractContactName(threadElement);
        if (contactName) {
            // Create stable ID from contact name
            return `contact-${contactName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
        }

        return null;
    } catch (e) {
        return null;
    }
}

function saveProcessedMessages() {
    // Keep only last 100 messages to avoid quota issues
    const messagesArray = Array.from(lastProcessedMessages).slice(-100);

    // Use local storage instead of sync to avoid quota limits
    chrome.storage.local.set({ lastProcessedMessages: messagesArray }).catch(err => {
        console.warn('Failed to save processed messages:', err);
        // If still fails, just keep in memory
    });
}

// API endpoint for syncing (Vercel serverless function)
const SYNC_API_ENDPOINT = 'https://luiscalderon.vercel.app/api/linkedin-sync';

async function syncMessageToCRM(messageData) {
    try {
        const response = await fetch(SYNC_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        const result = await response.json();

        // Increment session sync count
        incrementSessionCount();

        // Silent mode - only log on first sync or every 10th sync
        if (errorCount > 0 || Math.random() < 0.1) {
            console.log(`✓ ${messageData.contactName}`);
        }
        errorCount = 0;

    } catch (error) {
        errorCount++;
        // Only log first error and max error state
        if (errorCount === 1 || errorCount >= MAX_ERRORS) {
            console.error(`❌ Sync error (${errorCount}/${MAX_ERRORS}):`, error.message);
        }
    }
}

// Track session sync count (resets when browser closes)
async function incrementSessionCount() {
    try {
        const { sessionSyncCount = 0 } = await chrome.storage.session.get(['sessionSyncCount']);
        await chrome.storage.session.set({ sessionSyncCount: sessionSyncCount + 1 });

        // Also update last sync time
        await chrome.storage.sync.set({ lastSync: new Date().toISOString() });
    } catch (e) {
        // Session storage may not be available in all contexts
        console.warn('Could not update session count:', e);
    }
}

function showNotification(message) {
    // Create subtle notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0a66c2, #0073b1);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 999999;
        font-family: -apple-system, system-ui, sans-serif;
        font-size: 14px;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = '✓ ' + message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS animations disabled to prevent ERR_FAILED errors
// const style = document.createElement('style');
// style.textContent = `
//     @keyframes slideIn {
//         from { transform: translateX(100%); opacity: 0; }
//         to { transform: translateX(0); opacity: 1; }
//     }
//     @keyframes slideOut {
//         from { transform: translateX(0); opacity: 1; }
//         to { transform: translateX(100%); opacity: 0; }
//     }
// `;
// document.head.appendChild(style);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_CURRENT_CONVERSATION') {
        const conversation = extractCurrentConversation();
        sendResponse({ conversation });
    }

    if (request.type === 'CLEAR_PROCESSED_MESSAGES') {
        lastProcessedMessages.clear();
        chrome.storage.sync.set({ lastProcessedMessages: [] });
        sendResponse({ success: true });
    }

    if (request.type === 'FORCE_CHECK') {
        checkForNewMessages();
        sendResponse({ success: true });
    }

    return true;
});

// Debug helper (silent mode)
window.linkedInCRMDebug = {
    clearCache: () => {
        lastProcessedMessages.clear();
        chrome.storage.local.set({ lastProcessedMessages: [] });
        errorCount = 0;
        return 'Cleared cache and reset errors';
    },
    forceCheck: () => {
        lastCheckTime = 0;
        checkForNewMessages();
        return 'Forced check initiated';
    },
    showStats: () => {
        return {
            processedMessages: lastProcessedMessages.size,
            errorCount,
            maxErrors: MAX_ERRORS,
            syncEnabled,
            hasCredentials: !!(supabaseUrl && supabaseKey),
            paused: errorCount >= MAX_ERRORS
        };
    },
    resetErrors: () => {
        errorCount = 0;
        return 'Errors reset';
    }
};

function extractCurrentConversation() {
    // Extract full conversation if user is viewing a thread
    const messages = [];
    const messageElements = document.querySelectorAll('.msg-s-message-list__event');

    messageElements.forEach(msgEl => {
        try {
            const sender = msgEl.querySelector('.msg-s-message-group__profile-link')?.textContent.trim();
            const text = msgEl.querySelector('.msg-s-event-listitem__body')?.textContent.trim();
            const time = msgEl.querySelector('time')?.getAttribute('datetime');

            if (sender && text) {
                messages.push({ sender, text, time });
            }
        } catch (e) {
            console.error('Error extracting message:', e);
        }
    });

    return messages;
}
