// Gmail Client-Side Integration
// Uses Google Identity Services (GIS) for OAuth

const GmailClient = {
    clientId: null,
    accessToken: null,
    tokenClient: null,

    // Initialize Gmail client
    init(clientId) {
        this.clientId = clientId;

        // Load Google Identity Services
        if (!document.getElementById('gis-script')) {
            const script = document.createElement('script');
            script.id = 'gis-script';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        // Check if already authorized
        this.accessToken = localStorage.getItem('gmailAccessToken');
        const tokenExpiry = localStorage.getItem('gmailTokenExpiry');

        if (this.accessToken && tokenExpiry && new Date(tokenExpiry) > new Date()) {
            return true; // Already authorized
        }

        return false;
    },

    // Authorize user
    async authorize() {
        return new Promise((resolve, reject) => {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.clientId,
                scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send',
                callback: (response) => {
                    if (response.error) {
                        reject(response.error);
                        return;
                    }

                    this.accessToken = response.access_token;

                    // Store token (expires in 1 hour)
                    const expiry = new Date();
                    expiry.setHours(expiry.getHours() + 1);
                    localStorage.setItem('gmailAccessToken', this.accessToken);
                    localStorage.setItem('gmailTokenExpiry', expiry.toISOString());

                    resolve(this.accessToken);
                },
            });

            this.tokenClient.requestAccessToken();
        });
    },

    // Search Gmail messages
    async searchMessages(query, maxResults = 10) {
        if (!this.accessToken) {
            await this.authorize();
        }

        const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to search Gmail');
        }

        const data = await response.json();

        // Fetch full message details
        if (data.messages) {
            const messages = await Promise.all(
                data.messages.map(msg => this.getMessage(msg.id))
            );
            return messages;
        }

        return [];
    },

    // Get a specific message
    async getMessage(messageId) {
        const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get message');
        }

        const message = await response.json();
        return this.parseMessage(message);
    },

    // Parse message to extract useful info
    parseMessage(message) {
        const headers = message.payload.headers;
        const getHeader = (name) => {
            const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
            return header ? header.value : '';
        };

        let body = '';
        if (message.payload.body.data) {
            body = atob(message.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (message.payload.parts) {
            const textPart = message.payload.parts.find(p => p.mimeType === 'text/plain');
            if (textPart && textPart.body.data) {
                body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
            }
        }

        return {
            id: message.id,
            threadId: message.threadId,
            from: getHeader('From'),
            to: getHeader('To'),
            subject: getHeader('Subject'),
            date: getHeader('Date'),
            body: body,
            snippet: message.snippet
        };
    },

    // Get conversation thread
    async getThread(threadId) {
        const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`,
            {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get thread');
        }

        const thread = await response.json();
        return thread.messages.map(msg => this.parseMessage(msg));
    },

    // Search for conversations with a contact
    async getContactHistory(email, name = '') {
        const queries = [
            `from:${email} OR to:${email}`,
        ];

        if (name) {
            queries.push(`from:"${name}" OR to:"${name}"`);
        }

        const messages = await this.searchMessages(queries[0], 20);

        // Group by thread
        const threads = {};
        messages.forEach(msg => {
            if (!threads[msg.threadId]) {
                threads[msg.threadId] = [];
            }
            threads[msg.threadId].push(msg);
        });

        return {
            messages: messages,
            threads: Object.values(threads),
            mostRecent: messages[0],
            count: messages.length
        };
    },

    // Send email
    async sendEmail(to, subject, body, threadId = null) {
        if (!this.accessToken) {
            await this.authorize();
        }

        // Create RFC 2822 formatted message
        const email = [
            `To: ${to}`,
            `Subject: ${subject}`,
            threadId ? `In-Reply-To: ${threadId}` : '',
            threadId ? `References: ${threadId}` : '',
            'Content-Type: text/plain; charset="UTF-8"',
            '',
            body
        ].filter(line => line).join('\r\n');

        // Encode to base64url
        const encodedEmail = btoa(email)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const response = await fetch(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raw: encodedEmail,
                    threadId: threadId
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error.message || 'Failed to send email');
        }

        return await response.json();
    },

    // Summarize conversation for AI context
    summarizeForAI(history) {
        if (!history.messages || history.messages.length === 0) {
            return "No previous email conversation found.";
        }

        const summary = [
            `Email History with Contact (${history.count} emails total):`,
            '',
            `Most Recent Email (${new Date(history.mostRecent.date).toLocaleDateString()}):`,
            `Subject: ${history.mostRecent.subject}`,
            `Preview: ${history.mostRecent.snippet}`,
            '',
            'Recent Topics:'
        ];

        // Extract subjects from last 5 emails
        history.messages.slice(0, 5).forEach((msg, i) => {
            summary.push(`${i + 1}. ${msg.subject} (${new Date(msg.date).toLocaleDateString()})`);
        });

        return summary.join('\n');
    }
};

// Auto-initialize if client ID is configured
window.addEventListener('load', () => {
    const clientId = localStorage.getItem('gmailClientId');
    if (clientId) {
        GmailClient.init(clientId);
    }
});
