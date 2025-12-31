/**
 * Test Fixtures for AI Panel Testing
 *
 * Provides consistent mock data for testing the AI panel integration
 * across different test suites.
 */

// Test contact data
const testContact = {
    id: 'test-contact-123',
    name: 'Sarah Chen',
    firstName: 'Sarah',
    lastName: 'Chen',
    title: 'VP of Product',
    company: 'Stripe',
    email: 'sarah.chen@stripe.com',
    phone: '+1-555-0123',
    linkedin: 'https://linkedin.com/in/sarahchen',
    linkedInUrl: 'https://linkedin.com/in/sarahchen',
    source: 'ross-alumni',
    status: 'identified',
    addedDate: '2024-11-01T12:00:00Z',
    lastContact: null,
    followUp: null,
    notes: 'Met at Ross alumni event 2019. Interested in AI payment fraud detection.',
    messageHistory: [],
    outreach: [],
    isNA: false,
    createdAt: '2024-11-01T12:00:00Z',
    updatedAt: '2024-11-01T12:00:00Z'
};

// Mock Gmail history (personal account)
const mockGmailHistoryPersonal = [
    {
        id: '123abc',
        threadId: 'thread-123',
        subject: 'Re: Ross alumni mixer',
        date: '2024-10-15T14:30:00Z',
        snippet: 'Great seeing you at the event! Would love to catch up...',
        from: 'sarah.chen@stripe.com',
        to: 'lcalderon@gmail.com'
    },
    {
        id: '456def',
        threadId: 'thread-456',
        subject: 'Coffee chat next week?',
        date: '2024-09-20T09:15:00Z',
        snippet: 'Hey Luis, I heard you\'re exploring opportunities in AI...',
        from: 'lcalderon@gmail.com',
        to: 'sarah.chen@stripe.com'
    }
];

// Mock Gmail history (work account)
const mockGmailHistoryWork = [
    {
        id: '789ghi',
        threadId: 'thread-789',
        subject: 'TurboTax AI features',
        date: '2024-08-10T16:45:00Z',
        snippet: 'I saw your launch of the AI tax assistant - impressive work!',
        from: 'sarah.chen@stripe.com',
        to: 'luis@company.com'
    }
];

// Combined Gmail history (for dual account testing)
const mockGmailHistoryCombined = {
    personal: mockGmailHistoryPersonal,
    work: mockGmailHistoryWork,
    combined: [...mockGmailHistoryPersonal, ...mockGmailHistoryWork].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    ),
    stats: {
        totalEmails: 3,
        personalCount: 2,
        workCount: 1
    }
};

// Mock AI responses
const mockAIResponses = {
    claude: {
        message: `Hi Sarah,

Go Blue! It was great seeing you at the Ross alumni event back in 2019. I noticed your impressive work on Stripe's AI payment fraud detection features.

I'm currently exploring VP/Director PM opportunities in AI and would love to catch up over coffee. Given my experience leading Intuit's $900M Self-Employed business and shipping AI products pre-ChatGPT, I think we'd have a lot to discuss around AI-powered financial products.

Would you have 20 minutes next week for a quick chat?

Best,
Luis`,
        metadata: {
            provider: 'claude-sonnet-4',
            generationTime: 3200,
            tokensUsed: 450
        }
    },
    openai: {
        message: `Hi Sarah,

I hope this email finds you well! I saw your recent work on AI payment fraud detection at Stripe and was really impressed.

I'm reaching out because I'm currently exploring product leadership opportunities in AI/fintech. With my background leading the $900M TurboTax business at Intuit and shipping AI products, I'd love to learn more about what you're building at Stripe.

Would you be open to a brief coffee chat sometime next week?

Thanks,
Luis`,
        metadata: {
            provider: 'gpt-4o',
            generationTime: 2100,
            tokensUsed: 380
        }
    }
};

// Mock message types and tones
const messageTypes = [
    'email-followup',
    'initial-outreach',
    'thank-you',
    'meeting-request',
    'introduction'
];

const messageTones = [
    'professional-casual',
    'formal',
    'friendly',
    'direct'
];

// Mock Gmail OAuth configuration
const mockGmailConfig = {
    personal: {
        clientId: '123456789.apps.googleusercontent.com',
        accessToken: 'ya29.a0AfB_byC_MOCK_TOKEN_PERSONAL',
        tokenExpiry: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        email: 'lcalderon@gmail.com',
        enabled: true,
        lastUsed: new Date().toISOString()
    },
    work: {
        clientId: '987654321.apps.googleusercontent.com',
        accessToken: 'ya29.a0AfB_byD_MOCK_TOKEN_WORK',
        tokenExpiry: new Date(Date.now() + 3600000).toISOString(),
        email: 'luis@company.com',
        enabled: true,
        lastUsed: new Date().toISOString()
    }
};

// Mock AI configuration
const mockAIConfig = {
    claude: {
        provider: 'claude',
        apiKey: 'sk-ant-api03-MOCK_KEY_CLAUDE',
        model: 'claude-sonnet-4-20250514'
    },
    openai: {
        provider: 'openai',
        apiKey: 'sk-proj-MOCK_KEY_OPENAI',
        model: 'gpt-4o'
    }
};

// Expected message history entry after send (for validation)
const expectedMessageHistoryEntry = {
    type: 'email-followup',
    subject: 'Re: Ross alumni mixer',
    sentVia: 'personal',
    aiGenerated: true,
    responded: false,
    responseDate: null
};

// Expected outreach entry after send (for validation)
const expectedOutreachEntry = {
    type: 'email',
    channel: 'personal-gmail'
};

// Multiple test contacts for batch testing
const testContacts = [
    testContact,
    {
        ...testContact,
        id: 'test-contact-456',
        name: 'John Smith',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@openai.com',
        company: 'OpenAI',
        title: 'Director of Product',
        source: 'linkedin'
    },
    {
        ...testContact,
        id: 'test-contact-789',
        name: 'Emily Rodriguez',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.r@anthropic.com',
        company: 'Anthropic',
        title: 'Principal PM',
        source: 'referral'
    }
];

// Test selectors (for Playwright)
const selectors = {
    // Contact cards
    contactCard: '.contact-card',
    contactCardName: '.contact-card-name',
    composeButton: '.btn-compose',

    // AI Panel
    aiPanel: '#ai-panel',
    aiPanelOverlay: '#ai-panel-overlay',
    aiPanelClose: '#ai-panel-close',

    // Contact context display
    panelContactName: '#panel-contact-name',
    panelContactTitle: '#panel-contact-title',
    panelContactCompany: '#panel-contact-company',
    panelContactNotes: '#panel-contact-notes',

    // Gmail search results
    gmailSearchStatus: '#gmail-search-status',
    gmailEmailCount: '#gmail-email-count',
    gmailEmailList: '#gmail-email-list',

    // Message generation
    messageTypeSelect: '#ai-message-type',
    messageToneSelect: '#ai-tone',
    additionalContextInput: '#additional-context',
    generateButton: '#generate-button',
    generatingLoader: '#generating-loader',

    // Generated message output
    generatedMessage: '#generated-message',
    messageSubject: '#message-subject',
    messageBody: '#message-body',

    // Actions
    copyButton: '#copy-message-button',
    sendButton: '#send-message-button',
    saveDraftButton: '#save-draft-button',

    // Status messages
    successMessage: '.success-message',
    errorMessage: '.error-message',

    // Contact modal
    contactModal: '#contact-modal',
    messageHistoryTab: '#message-history-tab',
    messageHistoryList: '#message-history-list'
};

// Performance thresholds (in milliseconds)
const performanceThresholds = {
    panelOpenAnimation: 300,
    panelCloseAnimation: 300,
    gmailSearchSingle: 1500,
    gmailSearchDual: 2000,
    aiGenerationClaude: 5000,
    aiGenerationOpenAI: 3000,
    messageLogging: 500,
    supabaseSync: 1000
};

// Export all fixtures
module.exports = {
    testContact,
    testContacts,
    mockGmailHistoryPersonal,
    mockGmailHistoryWork,
    mockGmailHistoryCombined,
    mockAIResponses,
    messageTypes,
    messageTones,
    mockGmailConfig,
    mockAIConfig,
    expectedMessageHistoryEntry,
    expectedOutreachEntry,
    selectors,
    performanceThresholds
};
