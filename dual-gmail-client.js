// Dual Gmail Client - Supports Personal + Work Gmail Accounts
// Extends gmail-client.js to support two independent OAuth flows

// Default OAuth Client ID - hardcoded for reliability
const DEFAULT_GMAIL_CLIENT_ID = '498437118126-70s5vk26mu4aj62dv0kqgrad35d1ejt0.apps.googleusercontent.com';

const DualGmailClient = {
    accounts: {
        personal: {
            clientId: DEFAULT_GMAIL_CLIENT_ID,
            accessToken: null,
            tokenClient: null,
            email: null,
            enabled: true,
            lastUsed: null
        },
        work: {
            clientId: DEFAULT_GMAIL_CLIENT_ID,
            accessToken: null,
            tokenClient: null,
            email: null,
            enabled: true,
            lastUsed: null
        }
    },

    // Initialize from localStorage
    init() {
        // Load Google Identity Services if not already loaded
        if (!document.getElementById('gis-script')) {
            const script = document.createElement('script');
            script.id = 'gis-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        // Also set the legacy localStorage key for backward compatibility
        if (!localStorage.getItem('gmailClientId')) {
            localStorage.setItem('gmailClientId', DEFAULT_GMAIL_CLIENT_ID);
        }

        // Load stored account configurations
        const stored = localStorage.getItem('gmailAccounts');
        if (stored) {
            const config = JSON.parse(stored);

            // Restore personal account
            if (config.personal) {
                // Always use default client ID, but restore other settings
                this.accounts.personal.clientId = DEFAULT_GMAIL_CLIENT_ID;
                this.accounts.personal.accessToken = config.personal.accessToken;
                this.accounts.personal.email = config.personal.email;
                this.accounts.personal.enabled = config.personal.enabled !== false; // Default to true
                this.accounts.personal.lastUsed = config.personal.lastUsed;

                // Check if token is still valid
                const expiry = config.personal.tokenExpiry;
                if (expiry && new Date(expiry) < new Date()) {
                    this.accounts.personal.accessToken = null; // Expired
                }
            }

            // Restore work account
            if (config.work) {
                // Always use default client ID, but restore other settings
                this.accounts.work.clientId = DEFAULT_GMAIL_CLIENT_ID;
                this.accounts.work.accessToken = config.work.accessToken;
                this.accounts.work.email = config.work.email;
                this.accounts.work.enabled = config.work.enabled !== false; // Default to true
                this.accounts.work.lastUsed = config.work.lastUsed;

                // Check if token is still valid
                const expiry = config.work.tokenExpiry;
                if (expiry && new Date(expiry) < new Date()) {
                    this.accounts.work.accessToken = null; // Expired
                }
            }
        }

        return this.getAccountStatus();
    },

    // Get status of both accounts
    getAccountStatus() {
        return {
            personal: {
                enabled: this.accounts.personal.enabled,
                connected: !!this.accounts.personal.accessToken,
                email: this.accounts.personal.email
            },
            work: {
                enabled: this.accounts.work.enabled,
                connected: !!this.accounts.work.accessToken,
                email: this.accounts.work.email
            }
        };
    },

    // Configure a specific account (personal or work)
    configureAccount(accountType, clientId) {
        if (!['personal', 'work'].includes(accountType)) {
            throw new Error('Account type must be "personal" or "work"');
        }

        this.accounts[accountType].clientId = clientId;
        this.accounts[accountType].enabled = true;
        this.saveConfiguration();
    },

    // Authorize a specific account
    async authorizeAccount(accountType) {
        if (!['personal', 'work'].includes(accountType)) {
            throw new Error('Account type must be "personal" or "work"');
        }

        const account = this.accounts[accountType];

        if (!account.clientId) {
            throw new Error(`${accountType} account not configured. Set client ID first.`);
        }

        return new Promise((resolve, reject) => {
            account.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: account.clientId,
                scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
                callback: async (response) => {
                    if (response.error) {
                        reject(response.error);
                        return;
                    }

                    account.accessToken = response.access_token;
                    account.lastUsed = new Date().toISOString();

                    // Get user's email address
                    try {
                        const userInfo = await this.getUserInfo(accountType);
                        account.email = userInfo.email;
                    } catch (error) {
                        console.warn('Could not fetch user email:', error);
                    }

                    this.saveConfiguration();
                    resolve(account.accessToken);
                },
            });

            account.tokenClient.requestAccessToken();
        });
    },

    // Get user info (email) for an account
    async getUserInfo(accountType) {
        const account = this.accounts[accountType];

        if (!account.accessToken) {
            throw new Error('Account not authorized');
        }

        const response = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: {
                    'Authorization': `Bearer ${account.accessToken}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get user info');
        }

        return await response.json();
    },

    // Save configuration to localStorage
    saveConfiguration() {
        const config = {
            personal: {
                clientId: this.accounts.personal.clientId,
                accessToken: this.accounts.personal.accessToken,
                tokenExpiry: this.accounts.personal.accessToken ?
                    new Date(Date.now() + 3600000).toISOString() : null, // 1 hour
                email: this.accounts.personal.email,
                enabled: this.accounts.personal.enabled,
                lastUsed: this.accounts.personal.lastUsed
            },
            work: {
                clientId: this.accounts.work.clientId,
                accessToken: this.accounts.work.accessToken,
                tokenExpiry: this.accounts.work.accessToken ?
                    new Date(Date.now() + 3600000).toISOString() : null,
                email: this.accounts.work.email,
                enabled: this.accounts.work.enabled,
                lastUsed: this.accounts.work.lastUsed
            }
        };

        localStorage.setItem('gmailAccounts', JSON.stringify(config));
    },

    // Search messages in a specific account with retry logic for rate limits
    async searchAccountMessages(accountType, query, maxResults = 10, retryCount = 0) {
        const account = this.accounts[accountType];

        if (!account.enabled) {
            return { messages: [], count: 0, account: accountType };
        }

        if (!account.accessToken) {
            console.warn(`${accountType} account not authorized, skipping search`);
            return { messages: [], count: 0, account: accountType, needsAuth: true };
        }

        try {
            const response = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
                {
                    headers: {
                        'Authorization': `Bearer ${account.accessToken}`,
                    }
                }
            );

            if (!response.ok) {
                // Handle token expiry (401)
                if (response.status === 401) {
                    account.accessToken = null;
                    this.saveConfiguration();
                    return {
                        messages: [],
                        count: 0,
                        account: accountType,
                        error: 'Token expired. Please reconnect your Gmail account.',
                        needsAuth: true
                    };
                }

                // Handle rate limit (429)
                if (response.status === 429) {
                    // Exponential backoff: try up to 3 times
                    if (retryCount < 3) {
                        const waitTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                        console.log(`Rate limited on ${accountType}. Retrying in ${waitTime}ms...`);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        return this.searchAccountMessages(accountType, query, maxResults, retryCount + 1);
                    } else {
                        return {
                            messages: [],
                            count: 0,
                            account: accountType,
                            error: 'Gmail API rate limit reached. Please try again in a few minutes.',
                            rateLimited: true
                        };
                    }
                }

                // Handle quota exceeded (403)
                if (response.status === 403) {
                    const errorData = await response.json().catch(() => ({}));
                    if (errorData.error?.message?.includes('quota')) {
                        return {
                            messages: [],
                            count: 0,
                            account: accountType,
                            error: 'Gmail API quota exceeded. Please try again later or check your API limits.',
                            quotaExceeded: true
                        };
                    }
                }

                throw new Error(`Gmail search failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.messages) {
                const messages = await Promise.all(
                    data.messages.map(msg => this.getAccountMessage(accountType, msg.id))
                );

                return {
                    messages: messages.filter(m => m !== null),
                    count: messages.length,
                    account: accountType
                };
            }

            return { messages: [], count: 0, account: accountType };
        } catch (error) {
            console.error(`Error searching ${accountType} Gmail:`, error);
            return {
                messages: [],
                count: 0,
                account: accountType,
                error: error.message || 'Failed to search Gmail'
            };
        }
    },

    // Get a specific message from an account
    async getAccountMessage(accountType, messageId) {
        const account = this.accounts[accountType];

        if (!account.accessToken) {
            return null;
        }

        try {
            const response = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
                {
                    headers: {
                        'Authorization': `Bearer ${account.accessToken}`,
                    }
                }
            );

            if (!response.ok) {
                return null;
            }

            const message = await response.json();

            // Parse message
            const headers = message.payload.headers;
            const getHeader = (name) => {
                const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
                return header ? header.value : '';
            };

            return {
                id: message.id,
                threadId: message.threadId,
                subject: getHeader('Subject'),
                from: getHeader('From'),
                to: getHeader('To'),
                date: new Date(parseInt(message.internalDate)).toISOString(),
                snippet: message.snippet,
                account: accountType, // Tag with account type
                accountLabel: accountType === 'personal' ? '📧 Personal' : '💼 Work'
            };
        } catch (error) {
            console.error(`Error getting message from ${accountType}:`, error);
            return null;
        }
    },

    // Search BOTH accounts in parallel
    async searchAllAccounts(query, maxResults = 10) {
        const searches = [];

        if (this.accounts.personal.enabled) {
            searches.push(this.searchAccountMessages('personal', query, maxResults));
        }

        if (this.accounts.work.enabled) {
            searches.push(this.searchAccountMessages('work', query, maxResults));
        }

        if (searches.length === 0) {
            return {
                personal: { messages: [], count: 0 },
                work: { messages: [], count: 0 },
                combined: [],
                totalCount: 0
            };
        }

        const results = await Promise.all(searches);

        const personalResult = results.find(r => r.account === 'personal') || { messages: [], count: 0 };
        const workResult = results.find(r => r.account === 'work') || { messages: [], count: 0 };

        // Combine and sort by date
        const combined = [...personalResult.messages, ...workResult.messages]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        return {
            personal: personalResult,
            work: workResult,
            combined: combined,
            totalCount: combined.length,
            stats: {
                personalCount: personalResult.count,
                workCount: workResult.count
            }
        };
    },

    // Get contact history from both accounts
    async getContactHistoryDual(email, name) {
        // Build search query - handle missing email gracefully
        const queryParts = [];

        // Add email-based search if email exists
        if (email && email.trim() && !email.includes('undefined')) {
            queryParts.push(`from:${email}`);
            queryParts.push(`to:${email}`);
        }

        // Add name-based search if name exists
        if (name && name.trim()) {
            // Search for name in from/to fields and also in email body/subject
            queryParts.push(`from:"${name}"`);
            queryParts.push(`to:"${name}"`);
            queryParts.push(`"${name}"`); // Also search email content for the name
        }

        // If no valid search terms, return empty results
        if (queryParts.length === 0) {
            return {
                personal: { messages: [], count: 0, error: null },
                work: { messages: [], count: 0, error: null },
                combined: [],
                totalCount: 0,
                stats: { personalCount: 0, workCount: 0 },
                summarized: 'No email or name provided for search.'
            };
        }

        const query = queryParts.join(' OR ');

        const results = await this.searchAllAccounts(query, 20);

        return {
            ...results,
            summarized: this.summarizeForAI(results)
        };
    },

    // Summarize email history for AI prompts
    summarizeForAI(dualHistory) {
        const { personal, work, totalCount, stats } = dualHistory;

        if (totalCount === 0) {
            return 'No email history found with this contact.';
        }

        let summary = `Email History (${totalCount} total):\n`;

        if (stats.personalCount > 0) {
            summary += `📧 Personal: ${stats.personalCount} emails\n`;
        }

        if (stats.workCount > 0) {
            summary += `💼 Work: ${stats.workCount} emails\n`;
        }

        summary += '\nRecent emails:\n';

        // Show most recent 5 emails
        dualHistory.combined.slice(0, 5).forEach((msg, idx) => {
            const date = new Date(msg.date).toLocaleDateString();
            summary += `${idx + 1}. [${msg.accountLabel}] ${date}: ${msg.subject}\n`;
            if (msg.snippet) {
                summary += `   "${msg.snippet.substring(0, 80)}..."\n`;
            }
        });

        return summary;
    },

    // Send email from specific account with error handling
    async sendEmailFrom(accountType, to, subject, body, retryCount = 0) {
        const account = this.accounts[accountType];

        if (!account.enabled || !account.accessToken) {
            throw new Error(`${accountType} account not connected. Please reconnect in Settings.`);
        }

        // Create raw email (RFC 2822 format)
        const email = [
            `To: ${to}`,
            `Subject: ${subject}`,
            'Content-Type: text/html; charset=utf-8',
            '',
            body
        ].join('\r\n');

        // Base64url encode
        const encodedEmail = btoa(unescape(encodeURIComponent(email)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            const response = await fetch(
                'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${account.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ raw: encodedEmail })
                }
            );

            if (!response.ok) {
                // Handle token expiry
                if (response.status === 401) {
                    account.accessToken = null;
                    this.saveConfiguration();
                    throw new Error('Gmail session expired. Please reconnect your Gmail account in Settings.');
                }

                // Handle rate limits with retry
                if (response.status === 429 && retryCount < 3) {
                    const waitTime = Math.pow(2, retryCount) * 1000;
                    console.log(`Rate limited when sending. Retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return this.sendEmailFrom(accountType, to, subject, body, retryCount + 1);
                }

                // Handle quota exceeded
                if (response.status === 403) {
                    const errorData = await response.json().catch(() => ({}));
                    if (errorData.error?.message?.includes('quota')) {
                        throw new Error('Gmail API quota exceeded. Please try again later.');
                    }
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Failed to send email: ${response.status} ${response.statusText}`);
            }

            account.lastUsed = new Date().toISOString();
            this.saveConfiguration();

            return await response.json();
        } catch (error) {
            // Enhance network errors
            if (error.message.includes('fetch')) {
                throw new Error('Network error. Please check your internet connection and try again.');
            }
            throw error;
        }
    },

    // Disconnect an account
    disconnectAccount(accountType) {
        if (!['personal', 'work'].includes(accountType)) {
            throw new Error('Account type must be "personal" or "work"');
        }

        this.accounts[accountType].accessToken = null;
        this.accounts[accountType].email = null;
        this.accounts[accountType].enabled = false;
        this.saveConfiguration();
    }
};

// Backward compatibility: expose single-account interface using personal account
const GmailClient = {
    get accessToken() {
        return DualGmailClient.accounts.personal.accessToken;
    },

    set accessToken(value) {
        DualGmailClient.accounts.personal.accessToken = value;
    },

    init(clientId) {
        DualGmailClient.configureAccount('personal', clientId);
        return DualGmailClient.init();
    },

    async authorize() {
        return await DualGmailClient.authorizeAccount('personal');
    },

    async searchMessages(query, maxResults = 10) {
        const result = await DualGmailClient.searchAccountMessages('personal', query, maxResults);
        return result.messages;
    },

    async getContactHistory(email, name) {
        const result = await DualGmailClient.getContactHistoryDual(email, name);
        return {
            messages: result.personal.messages,
            count: result.personal.count,
            summarized: result.summarized
        };
    },

    async sendEmail(to, subject, body) {
        return await DualGmailClient.sendEmailFrom('personal', to, subject, body);
    }
};

// Make both available globally
window.DualGmailClient = DualGmailClient;
window.GmailClient = GmailClient;

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DualGmailClient.init();
    });
} else {
    DualGmailClient.init();
}
