// Job Capture Extension - Popup Script

// Default settings
const DEFAULT_DASHBOARD_URL = 'https://luiscalderon.vercel.app';
const DEFAULT_SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';
const DEFAULT_AI_API_KEY = ''; // Users must configure their own API key in settings
let currentJob = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupTabs();
    setupEventListeners();
    await extractJob();
    updateSessionCount();
    await loadSavedAIResults(); // Load any persisted AI results
});

// Setup all event listeners (required for Manifest V3 CSP)
function setupEventListeners() {
    // Save Job tab
    document.getElementById('save-job-btn').addEventListener('click', saveJob);
    document.getElementById('reextract-btn').addEventListener('click', extractJob);
    document.getElementById('read-desc-btn').addEventListener('click', readPageDescription);

    // AI Assistant tab
    document.getElementById('generate-answer-btn').addEventListener('click', generateAnswer);
    document.getElementById('generate-cover-btn').addEventListener('click', generateCoverLetter);
    document.getElementById('generate-resume-btn').addEventListener('click', generateResume);
    document.getElementById('copy-answer-btn').addEventListener('click', () => copyToClipboard('answer-result-text'));
    document.getElementById('copy-cover-btn').addEventListener('click', () => copyToClipboard('cover-letter-text'));
    document.getElementById('clear-answer-btn').addEventListener('click', () => clearAIResult('answer'));
    document.getElementById('clear-cover-btn').addEventListener('click', () => clearAIResult('cover'));
    document.getElementById('send-to-gdoc-btn').addEventListener('click', sendToGoogleDocs);

    // Settings tab
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    document.getElementById('test-connection-btn').addEventListener('click', testConnection);
    document.getElementById('export-jobs-btn').addEventListener('click', exportLocalJobs);
    document.getElementById('clear-local-btn').addEventListener('click', clearLocalJobs);

    // Character counter for answer generation
    const charLimitSelect = document.getElementById('answer-char-limit');
    const charCountDisplay = document.getElementById('answer-char-count');

    // Update counter display when limit changes
    charLimitSelect.addEventListener('change', () => {
        const answerText = document.getElementById('answer-result-text').textContent || '';
        updateCharCount(answerText.length, charLimitSelect.value);
    });

    // Monitor answer result text changes
    const observer = new MutationObserver(() => {
        const answerText = document.getElementById('answer-result-text').textContent || '';
        updateCharCount(answerText.length, charLimitSelect.value);
    });

    const answerResultEl = document.getElementById('answer-result-text');
    if (answerResultEl) {
        observer.observe(answerResultEl, { characterData: true, subtree: true, childList: true });
    }
}

// Update character count display
function updateCharCount(currentLength, limit) {
    const charCountDisplay = document.getElementById('answer-char-count');
    charCountDisplay.textContent = `${currentLength} / ${limit}`;

    // Change color if over limit
    if (currentLength > limit) {
        charCountDisplay.style.color = '#dc3545'; // Red
        charCountDisplay.style.fontWeight = 'bold';
    } else if (currentLength > limit * 0.9) {
        charCountDisplay.style.color = '#ffc107'; // Yellow/warning
        charCountDisplay.style.fontWeight = 'normal';
    } else {
        charCountDisplay.style.color = '#666';
        charCountDisplay.style.fontWeight = 'normal';
    }
}

// Tab navigation
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Load settings from storage (shared with LinkedIn CRM extension)
async function loadSettings() {
    const settings = await chrome.storage.sync.get([
        'aiProvider', 'aiApiKey', 'dashboardUrl', 'sessionJobCount'
    ]);

    if (settings.aiProvider) {
        document.getElementById('ai-provider').value = settings.aiProvider;
    }

    // Use saved API key or default
    const apiKey = settings.aiApiKey || DEFAULT_AI_API_KEY;
    document.getElementById('ai-api-key').value = apiKey;

    if (settings.dashboardUrl) {
        document.getElementById('dashboard-url').value = settings.dashboardUrl;
    }

    // Always force the correct credentials (hardcoded defaults)
    await chrome.storage.sync.set({
        supabaseUrl: DEFAULT_SUPABASE_URL,
        supabaseKey: DEFAULT_SUPABASE_KEY,
        aiApiKey: apiKey,
        aiProvider: settings.aiProvider || 'claude'
    });

    // Update pending count
    updatePendingCount();
}

// Save settings to storage
async function saveSettings() {
    const provider = document.getElementById('ai-provider').value;
    const apiKey = document.getElementById('ai-api-key').value;
    const dashboardUrl = document.getElementById('dashboard-url').value;

    await chrome.storage.sync.set({
        aiProvider: provider,
        aiApiKey: apiKey,
        dashboardUrl: dashboardUrl
    });

    showMessage('settings-message', 'Settings saved!', 'success');
}

// Test Supabase connection
async function testConnection() {
    const btn = document.getElementById('test-connection-btn');
    const statusEl = document.getElementById('connection-status');

    btn.disabled = true;
    btn.textContent = 'Testing...';
    statusEl.style.display = 'block';
    statusEl.className = 'connection-status';
    statusEl.textContent = 'Connecting to Supabase...';

    try {
        const settings = await chrome.storage.sync.get(['supabaseUrl', 'supabaseKey']);
        const supabaseUrl = settings.supabaseUrl || DEFAULT_SUPABASE_URL;
        const supabaseKey = settings.supabaseKey || DEFAULT_SUPABASE_KEY;

        // Test 1: Can we reach Supabase?
        let response;
        try {
            response = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main&select=id,jobs`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
        } catch (networkError) {
            throw { type: 'network', message: 'Cannot reach Supabase server. Check your internet connection or if the project is paused.' };
        }

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw { type: 'parse', message: `Invalid response: ${responseText.slice(0, 100)}` };
        }

        // Check for error responses
        if (data.message) {
            if (data.message.includes('Invalid API key')) {
                throw { type: 'auth', message: 'Invalid API key. Get a new key from Supabase Dashboard > Settings > API.' };
            }
            if (data.code === '42703' || data.message.includes('does not exist')) {
                throw { type: 'schema', message: `The 'jobs' column is missing.\n\nRun this SQL in Supabase:\nALTER TABLE job_search_data ADD COLUMN jobs JSONB DEFAULT '[]'::jsonb;` };
            }
            throw { type: 'api', message: data.message };
        }

        if (!response.ok) {
            throw { type: 'http', message: `HTTP ${response.status}: ${responseText.slice(0, 100)}` };
        }

        // Check if we got data
        if (!Array.isArray(data) || data.length === 0) {
            throw { type: 'nodata', message: 'No data found. The job_search_data table may be empty or missing.' };
        }

        // Check if jobs column exists
        const row = data[0];
        if (!('jobs' in row)) {
            throw { type: 'schema', message: `The 'jobs' column is missing.\n\nRun this SQL in Supabase:\nALTER TABLE job_search_data ADD COLUMN jobs JSONB DEFAULT '[]'::jsonb;` };
        }

        // Success!
        const jobCount = Array.isArray(row.jobs) ? row.jobs.length : 0;
        statusEl.className = 'connection-status success';
        statusEl.textContent = `✅ Connected successfully!\n\nDatabase: ${supabaseUrl.split('//')[1]}\nJobs in database: ${jobCount}`;

    } catch (error) {
        statusEl.className = 'connection-status error';
        if (error.type === 'schema') {
            statusEl.className = 'connection-status warning';
        }
        statusEl.textContent = `❌ ${error.message || error}`;
    } finally {
        btn.disabled = false;
        btn.textContent = 'Test Connection';
    }
}

// Extract job from current page
async function extractJob() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Try to extract using content script (LinkedIn, Indeed, Glassdoor)
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_JOB' });

            if (response && response.success && response.job) {
                currentJob = response.job;
                populateJobForm(response.job);
                updateSourceBadge(response.board);
                return;
            }
        } catch (e) {
            console.log('Content script not available, trying generic extraction');
        }

        // Try generic extraction for any page
        try {
            const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: extractGenericJobData
            });

            if (result && result.result) {
                const job = result.result;
                job.url = tab.url;
                job.source = 'manual';
                currentJob = job;
                populateJobForm(job);
                updateSourceBadge('manual');
                return;
            }
        } catch (e) {
            console.log('Generic extraction failed:', e);
        }

        // Final fallback to manual entry
        currentJob = {
            title: '',
            company: '',
            location: '',
            locationType: 'unknown',
            url: tab.url,
            source: 'manual',
            description: ''
        };
        document.getElementById('job-url').value = tab.url;
        updateSourceBadge('manual');

    } catch (error) {
        console.error('Extract error:', error);
        updateSourceBadge('manual');
    }
}

// Generic job data extraction (runs in page context)
function extractGenericJobData() {
    const data = {
        title: '',
        company: '',
        location: '',
        locationType: 'unknown',
        description: ''
    };

    // Try to extract job title from common patterns
    const titleSelectors = [
        'h1', // Most common - main heading
        'h2', // Secondary heading
        '[data-testid*="title"]',
        '[class*="job-title"]',
        '[class*="jobTitle"]',
        '[class*="JobTitle"]',
        '.posting-headline h2',
        '.job-header h1',
        '[class*="posting"] h1',
        '[class*="posting"] h2'
    ];

    for (const selector of titleSelectors) {
        const el = document.querySelector(selector);
        if (el) {
            const text = el.textContent.trim();
            // Filter out navigation items and very short/long text
            if (text.length > 5 && text.length < 150 &&
                !text.toLowerCase().includes('back to') &&
                !text.toLowerCase().includes('sign in') &&
                !text.toLowerCase().includes('menu')) {
                data.title = text;
                break;
            }
        }
    }

    // Try to extract company name from various sources
    const companySelectors = [
        '[class*="company-name"]',
        '[class*="companyName"]',
        '[class*="CompanyName"]',
        '[data-testid*="company"]',
        '.company',
        'meta[property="og:site_name"]',
        '[class*="logo"] + *', // Text next to logo
        'header a[href="/"]' // Main logo link
    ];

    for (const selector of companySelectors) {
        const el = document.querySelector(selector);
        if (el) {
            const text = el.content || el.textContent || el.alt || el.title;
            if (text && text.trim().length > 1 && text.trim().length < 50) {
                data.company = text.trim();
                break;
            }
        }
    }

    // If no company found, try to get from URL
    if (!data.company) {
        const url = window.location.hostname;
        // Extract company from URL like about.nextdoor.com -> Nextdoor
        const match = url.match(/(?:about\.|www\.|jobs\.|careers\.)?([a-z0-9-]+)\.(?:com|org|io|co|net)/i);
        if (match && match[1]) {
            data.company = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        }
    }

    // Try to extract location - look for common patterns
    const locationPatterns = [
        // Elements with location in class/id
        '[class*="location" i]',
        '[id*="location" i]',
        '[data-testid*="location"]',
        // Elements near location icons
        'svg[class*="location"] ~ *',
        '[class*="icon-location"] ~ *',
        // Greenhouse ATS pattern
        '.location'
    ];

    for (const selector of locationPatterns) {
        try {
            const el = document.querySelector(selector);
            if (el && el.textContent.trim().length > 2 && el.textContent.trim().length < 100) {
                data.location = el.textContent.trim();
                break;
            }
        } catch (e) {
            // Invalid selector, skip
        }
    }

    // If no location found, search for Remote/Hybrid keywords near title
    if (!data.location) {
        const mainContent = document.querySelector('main, article, [role="main"]');
        if (mainContent) {
            const text = mainContent.innerText;
            // Look for location patterns like "US Remote", "San Francisco, CA", etc.
            const locationMatch = text.match(/(?:^|\n)([A-Z][A-Za-z\s,]+(?:Remote|Hybrid|On-site|Onsite))/m) ||
                                  text.match(/(Remote|Hybrid)(?:\s*-\s*|\s+)(US|USA|United States|Worldwide|Global)?/i) ||
                                  text.match(/([A-Z][a-z]+(?:,\s*[A-Z]{2})?)\s*(?:\||$)/m);
            if (locationMatch) {
                data.location = locationMatch[0].trim().slice(0, 50);
            }
        }
    }

    // Check for remote indicators
    const pageText = document.body.innerText.toLowerCase();
    if (data.location.toLowerCase().includes('remote')) {
        data.locationType = 'remote';
    } else if (pageText.includes('hybrid')) {
        data.locationType = 'hybrid';
    } else if (pageText.includes('on-site') || pageText.includes('onsite') || pageText.includes('in-office')) {
        data.locationType = 'onsite';
    }

    // Try to get description from main content
    const descSelectors = [
        '[class*="description" i]',
        '[class*="job-details" i]',
        '[class*="posting-content" i]',
        '[data-testid*="description"]',
        'main',
        'article',
        '.content',
        '#content'
    ];

    for (const selector of descSelectors) {
        try {
            const el = document.querySelector(selector);
            if (el && el.innerText.length > 200) {
                data.description = el.innerText.slice(0, 3000);
                break;
            }
        } catch (e) {
            // Skip invalid selector
        }
    }

    return data;
}

// Populate form with job data
function populateJobForm(job) {
    document.getElementById('job-title').value = job.title || '';
    document.getElementById('job-company').value = job.company || '';
    document.getElementById('job-location').value = job.location || '';
    document.getElementById('job-location-type').value = job.locationType || 'unknown';
    document.getElementById('job-url').value = job.url || '';
    document.getElementById('job-source').value = job.source || 'manual';
    document.getElementById('job-description').value = job.description || '';
}

// Update source badge
function updateSourceBadge(source) {
    const badge = document.getElementById('source-badge');
    const labels = {
        linkedin: 'LinkedIn',
        indeed: 'Indeed',
        glassdoor: 'Glassdoor',
        manual: 'Manual Entry',
        unknown: 'Manual Entry'
    };
    badge.textContent = labels[source] || 'Manual Entry';
    badge.className = 'source-badge ' + source;
}

// Read job description from current page
async function readPageDescription() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Execute script to extract text from page
        const [result] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                // Try common job description selectors
                const selectors = [
                    // Generic job description containers
                    '[data-testid="job-description"]',
                    '.job-description',
                    '.description',
                    '#job-description',
                    '[class*="JobDescription"]',
                    '[class*="job-description"]',
                    '[class*="jobDescription"]',
                    // Greenhouse (common ATS)
                    '#content',
                    '.content',
                    // Lever
                    '.posting-description',
                    // Workday
                    '.job-posting-content',
                    // Main content areas
                    'main',
                    'article',
                    '[role="main"]'
                ];

                for (const selector of selectors) {
                    const el = document.querySelector(selector);
                    if (el && el.innerText.length > 200) {
                        return el.innerText.slice(0, 3000); // Limit to 3000 chars
                    }
                }

                // Fallback: get body text
                return document.body.innerText.slice(0, 3000);
            }
        });

        if (result && result.result) {
            document.getElementById('job-description').value = result.result;
            showMessage('save-message', 'Job description captured!', 'success');
        }
    } catch (error) {
        console.error('Read description error:', error);
        showMessage('save-message', 'Could not read page. Try manually.', 'error');
    }
}

// Save job directly to Supabase (same pattern as LinkedIn CRM extension)
async function saveJob() {
    const title = document.getElementById('job-title').value.trim();
    const company = document.getElementById('job-company').value.trim();

    if (!title || !company) {
        showMessage('save-message', 'Title and Company are required', 'error');
        return;
    }

    const jobData = {
        id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        company,
        companyNormalized: normalizeCompany(company),
        location: document.getElementById('job-location').value.trim(),
        locationType: document.getElementById('job-location-type').value,
        status: document.getElementById('job-status').value,
        salary: document.getElementById('job-salary').value.trim(),
        url: document.getElementById('job-url').value || '',
        source: document.getElementById('job-source').value || 'manual',
        description: document.getElementById('job-description').value,
        capturedAt: new Date().toISOString(),
        appliedAt: document.getElementById('job-status').value === 'applied' ? new Date().toISOString() : null,
        statusHistory: [{
            status: document.getElementById('job-status').value,
            date: new Date().toISOString(),
            notes: 'Job captured via extension'
        }],
        matchedContactIds: [],
        contactCount: 0,
        priority: 'medium',
        isArchived: false
    };

    const btn = document.getElementById('save-job-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        // Get Supabase credentials (shared with LinkedIn extension)
        const settings = await chrome.storage.sync.get(['supabaseUrl', 'supabaseKey']);
        const supabaseUrl = settings.supabaseUrl || DEFAULT_SUPABASE_URL;
        const supabaseKey = settings.supabaseKey || DEFAULT_SUPABASE_KEY;

        // Fetch existing jobs from Supabase
        let getResponse;
        try {
            getResponse = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main&select=jobs`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
        } catch (networkError) {
            throw new Error(`Network error: Cannot reach Supabase. Check your internet connection.`);
        }

        // Parse response and check for errors
        const responseText = await getResponse.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid response from Supabase: ${responseText.slice(0, 100)}`);
        }

        // Check for Supabase error responses
        if (data.code || data.message) {
            if (data.code === '42703' || data.message?.includes('does not exist')) {
                throw new Error(`Database column missing. Run SQL in Supabase: ALTER TABLE job_search_data ADD COLUMN jobs JSONB DEFAULT '[]'::jsonb;`);
            }
            if (data.message?.includes('Invalid API key')) {
                throw new Error(`Invalid API key. Update your Supabase anon key in Settings.`);
            }
            if (data.code === 'PGRST301') {
                throw new Error(`Table not found. The job_search_data table may not exist.`);
            }
            throw new Error(`Supabase error: ${data.message || data.code}`);
        }

        if (!getResponse.ok) {
            throw new Error(`Supabase error (${getResponse.status}): ${responseText.slice(0, 100)}`);
        }

        let jobs = Array.isArray(data) && data[0]?.jobs ? data[0].jobs : [];

        // Check for duplicate by URL
        if (jobData.url) {
            const existing = jobs.find(j => j.url === jobData.url);
            if (existing) {
                showMessage('save-message', 'Job already saved!', 'error');
                btn.disabled = false;
                btn.textContent = 'Save Job';
                return;
            }
        }

        // Add new job to beginning
        jobs.unshift(jobData);

        // Update Supabase
        const updateResponse = await fetch(`${supabaseUrl}/rest/v1/job_search_data?id=eq.main`, {
            method: 'PATCH',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ jobs })
        });

        if (!updateResponse.ok) {
            const updateError = await updateResponse.text();
            throw new Error(`Failed to save: ${updateError.slice(0, 100)}`);
        }

        showMessage('save-message', 'Job saved to database!', 'success');
        incrementSessionCount();
        currentJob = jobData;
        console.log('✅ Job saved:', jobData.title, '@', jobData.company);

    } catch (error) {
        console.error('Supabase save error:', error);

        // Show specific error message
        const errorMsg = error.message || 'Unknown error';

        // Save locally as fallback
        try {
            const { localJobs = [] } = await chrome.storage.local.get(['localJobs']);
            localJobs.unshift(jobData);
            await chrome.storage.local.set({ localJobs });
            updatePendingCount();

            // Show both the error and that it was saved locally
            showMessage('save-message', `⚠️ ${errorMsg} — Saved locally (${localJobs.length} pending)`, 'error');
            incrementSessionCount();
            currentJob = jobData;
        } catch (localError) {
            showMessage('save-message', `❌ ${errorMsg}`, 'error');
        }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save Job';
    }
}

// Normalize company name for matching
function normalizeCompany(name) {
    if (!name) return '';
    return name.toLowerCase()
        .replace(/\b(inc|llc|corp|corporation|ltd|limited|co|company|technologies|tech|software|solutions|group|holdings|enterprises)\b\.?/gi, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

// Generate answer for application question
async function generateAnswer() {
    const question = document.getElementById('app-question').value.trim();
    if (!question) {
        showAIError('Please enter a question');
        return;
    }

    const settings = await chrome.storage.sync.get(['aiProvider', 'aiApiKey', 'dashboardUrl']);
    // Use default API key if not set
    const apiKey = settings.aiApiKey || DEFAULT_AI_API_KEY;
    if (!apiKey) {
        showAIError('Please configure your API key in Settings');
        return;
    }
    settings.aiApiKey = apiKey; // Ensure we use the key

    // Get current job info
    const jobTitle = document.getElementById('job-title').value || 'the role';
    const jobCompany = document.getElementById('job-company').value || 'the company';
    const jobDescription = document.getElementById('job-description').value || '';

    // Get character limit
    const charLimit = document.getElementById('answer-char-limit').value;

    // Build prompt
    const relevantExp = getRelevantExperience(question + ' ' + jobDescription);
    const prompt = `You are helping ${USER_PROFILE.name} answer a job application question.

Job: ${jobTitle} at ${jobCompany}
${jobDescription ? `Job Description Summary: ${jobDescription.slice(0, 500)}...` : ''}

Candidate Background:
- ${USER_PROFILE.summary}
- Key achievements: ${USER_PROFILE.achievements.slice(0, 4).join(', ')}
- Relevant experience: ${relevantExp.join('; ')}

Question: "${question}"

Write a compelling, authentic answer (2-3 paragraphs).

CRITICAL: Your answer MUST be ${charLimit} characters or less. This is a hard limit.

Important guidelines:
- Sound human, not AI-generated
- NO phrases like "I'm excited to", "I'm thrilled", "passionate about", "leverage", "delve into"
- Be specific and connect experience to the role
- Use concrete numbers and results where possible
- Keep it concise but impactful
- MUST be under ${charLimit} characters total`;

    await callAI(prompt, 'answer-result', 'answer-result-text', settings);
}

// Generate cover letter
async function generateCoverLetter() {
    const settings = await chrome.storage.sync.get(['aiProvider', 'aiApiKey', 'dashboardUrl']);
    // Use default API key if not set
    const apiKey = settings.aiApiKey || DEFAULT_AI_API_KEY;
    if (!apiKey) {
        showAIError('Please configure your API key in Settings');
        return;
    }
    settings.aiApiKey = apiKey;

    const jobTitle = document.getElementById('job-title').value;
    const jobCompany = document.getElementById('job-company').value;
    const jobDescription = document.getElementById('job-description').value || '';
    const focusInstructions = document.getElementById('cover-letter-focus').value.trim();

    if (!jobTitle || !jobCompany) {
        showAIError('Please extract or enter job details first');
        return;
    }

    // Build focus section if provided
    let focusSection = '';
    if (focusInstructions) {
        focusSection = `
IMPORTANT FOCUS INSTRUCTIONS FROM THE CANDIDATE:
${focusInstructions}

Make sure to emphasize these specific areas in the cover letter.
`;
    }

    const prompt = `Write a cover letter for ${USER_PROFILE.name} applying to ${jobTitle} at ${jobCompany}.

${jobDescription ? `Job Description: ${jobDescription.slice(0, 800)}` : ''}

Candidate:
- ${USER_PROFILE.summary}
- Key achievements: ${USER_PROFILE.achievements.join(', ')}
- Education: ${USER_PROFILE.education}
- AI expertise: ${USER_PROFILE.whyAI}
${focusSection}
Format: 3-4 paragraphs, professional but warm.

Important guidelines:
- NO clichés or AI-telltale phrases
- NO "I'm excited to", "I'm thrilled", "passionate about"
- Highlight 2-3 specific achievements that match job requirements
- Show genuine interest without being sycophantic
- End with clear interest and call to action
- Keep under 400 words`;

    await callAI(prompt, 'cover-letter-result', 'cover-letter-text', settings);
}

// Call AI API
async function callAI(prompt, resultBoxId, resultTextId, settings) {
    const loadingEl = document.getElementById('ai-loading');
    const errorEl = document.getElementById('ai-error');
    const resultBox = document.getElementById(resultBoxId);

    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    resultBox.style.display = 'none';

    try {
        const baseUrl = settings.dashboardUrl || DEFAULT_DASHBOARD_URL;

        const response = await fetch(`${baseUrl}/api/ai-generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                apiKey: settings.aiApiKey,
                provider: settings.aiProvider || 'claude',
                maxTokens: 1024
            })
        });

        const result = await response.json();

        if (result.success && result.text) {
            document.getElementById(resultTextId).textContent = result.text;
            resultBox.style.display = 'block';

            // Persist the result so it survives popup close
            const storageKey = resultBoxId === 'answer-result' ? 'savedAnswer' : 'savedCoverLetter';
            const questionKey = resultBoxId === 'answer-result' ? 'savedAnswerQuestion' : null;
            const jobTitle = document.getElementById('job-title').value;
            const jobCompany = document.getElementById('job-company').value;

            const dataToSave = {
                [storageKey]: {
                    text: result.text,
                    jobTitle,
                    jobCompany,
                    timestamp: Date.now()
                }
            };

            // Also save the question for answers
            if (questionKey) {
                dataToSave[storageKey].question = document.getElementById('app-question').value;
            }

            await chrome.storage.local.set(dataToSave);
            console.log(`✅ AI result saved to storage: ${storageKey}`);
        } else {
            throw new Error(result.error || 'Failed to generate text');
        }
    } catch (error) {
        console.error('AI error:', error);
        showAIError(error.message || 'Failed to generate text');
    } finally {
        loadingEl.style.display = 'none';
    }
}

// Show AI error
function showAIError(message) {
    const errorEl = document.getElementById('ai-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

// Load saved AI results from storage (persists across popup closes)
async function loadSavedAIResults() {
    try {
        const { savedAnswer, savedCoverLetter } = await chrome.storage.local.get(['savedAnswer', 'savedCoverLetter']);

        // Load saved answer if exists
        if (savedAnswer && savedAnswer.text) {
            document.getElementById('answer-result-text').textContent = savedAnswer.text;
            document.getElementById('answer-result').style.display = 'block';

            // Also restore the question
            if (savedAnswer.question) {
                document.getElementById('app-question').value = savedAnswer.question;
            }

            console.log('📖 Loaded saved answer for:', savedAnswer.jobTitle, '@', savedAnswer.jobCompany);
        }

        // Load saved cover letter if exists
        if (savedCoverLetter && savedCoverLetter.text) {
            document.getElementById('cover-letter-text').textContent = savedCoverLetter.text;
            document.getElementById('cover-letter-result').style.display = 'block';

            console.log('📖 Loaded saved cover letter for:', savedCoverLetter.jobTitle, '@', savedCoverLetter.jobCompany);
        }
    } catch (error) {
        console.error('Error loading saved AI results:', error);
    }
}

// Clear saved AI result
async function clearAIResult(type) {
    try {
        if (type === 'answer') {
            await chrome.storage.local.remove(['savedAnswer']);
            document.getElementById('answer-result').style.display = 'none';
            document.getElementById('answer-result-text').textContent = '';
            document.getElementById('app-question').value = '';
            console.log('🗑️ Cleared saved answer');
        } else if (type === 'cover') {
            await chrome.storage.local.remove(['savedCoverLetter']);
            document.getElementById('cover-letter-result').style.display = 'none';
            document.getElementById('cover-letter-text').textContent = '';
            console.log('🗑️ Cleared saved cover letter');
        }
    } catch (error) {
        console.error('Error clearing AI result:', error);
    }
}

// Copy to clipboard
async function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    try {
        await navigator.clipboard.writeText(text);

        // Visual feedback - find the copy button in the same result box
        const resultBox = document.getElementById(elementId).closest('.result-box');
        const btn = resultBox ? resultBox.querySelector('.btn-copy') : null;
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 1500);
        }
    } catch (error) {
        console.error('Copy failed:', error);
    }
}

// Send cover letter to Google Docs
async function sendToGoogleDocs() {
    const coverLetterText = document.getElementById('cover-letter-text').textContent;
    const btn = document.getElementById('send-to-gdoc-btn');

    if (!coverLetterText) {
        showAIError('No cover letter to send. Generate one first.');
        return;
    }

    try {
        // Get job details for the document title
        const jobTitle = document.getElementById('job-title').value || 'Position';
        const jobCompany = document.getElementById('job-company').value || 'Company';

        // Copy cover letter to clipboard
        await navigator.clipboard.writeText(coverLetterText);

        // Visual feedback
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';

        // Open new Google Doc
        // Note: We can't pre-fill the doc content, but we can open a new doc
        // and the user just needs to paste (Cmd/Ctrl+V)
        chrome.tabs.create({ url: 'https://docs.new' });

        // Show instruction message
        setTimeout(() => {
            btn.textContent = originalText;
        }, 3000);

        // Show a helpful status message
        const statusEl = document.getElementById('ai-error');
        statusEl.style.display = 'block';
        statusEl.style.background = '#e8f5e9';
        statusEl.style.color = '#2e7d32';
        statusEl.textContent = `✅ Cover letter copied! Paste (Cmd/Ctrl+V) into the new Google Doc. Suggested title: "Cover Letter - ${jobTitle} at ${jobCompany}"`;

        setTimeout(() => {
            statusEl.style.display = 'none';
            statusEl.style.background = '';
            statusEl.style.color = '';
        }, 8000);

    } catch (error) {
        console.error('Send to Google Docs failed:', error);
        showAIError('Failed to copy. Please copy manually and open docs.new');
    }
}

// Show message
function showMessage(elementId, text, type) {
    const el = document.getElementById(elementId);
    el.textContent = text;
    el.className = `message ${type}`;
    el.style.display = 'block';

    setTimeout(() => el.style.display = 'none', 3000);
}

// Session count
async function updateSessionCount() {
    try {
        const { sessionJobCount = 0 } = await chrome.storage.session.get(['sessionJobCount']);
        document.getElementById('session-count').textContent = sessionJobCount;
    } catch (e) {
        document.getElementById('session-count').textContent = '0';
    }
}

async function incrementSessionCount() {
    try {
        const { sessionJobCount = 0 } = await chrome.storage.session.get(['sessionJobCount']);
        await chrome.storage.session.set({ sessionJobCount: sessionJobCount + 1 });
        document.getElementById('session-count').textContent = sessionJobCount + 1;
    } catch (e) {
        console.warn('Could not update session count');
    }
}

// Update pending sync count display
async function updatePendingCount() {
    try {
        const { localJobs = [] } = await chrome.storage.local.get(['localJobs']);
        document.getElementById('pending-count').textContent = localJobs.length;
    } catch (e) {
        document.getElementById('pending-count').textContent = '0';
    }
}

// Export local jobs as JSON
async function exportLocalJobs() {
    try {
        const { localJobs = [] } = await chrome.storage.local.get(['localJobs']);
        if (localJobs.length === 0) {
            showMessage('settings-message', 'No local jobs to export', 'error');
            return;
        }

        const blob = new Blob([JSON.stringify(localJobs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jobs-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showMessage('settings-message', `Exported ${localJobs.length} jobs`, 'success');
    } catch (e) {
        showMessage('settings-message', 'Export failed: ' + e.message, 'error');
    }
}

// Clear local jobs
async function clearLocalJobs() {
    try {
        await chrome.storage.local.set({ localJobs: [] });
        updatePendingCount();
        showMessage('settings-message', 'Local jobs cleared', 'success');
    } catch (e) {
        showMessage('settings-message', 'Clear failed: ' + e.message, 'error');
    }
}

// Generate targeted resume PDF
async function generateResume() {
    const statusEl = document.getElementById('resume-status');
    const btn = document.getElementById('generate-resume-btn');
    const useAI = document.getElementById('resume-ai-optimize').checked;
    const customPrompt = document.getElementById('resume-custom-prompt').value.trim();

    const jobTitle = document.getElementById('job-title').value;
    const jobCompany = document.getElementById('job-company').value;
    const jobDescription = document.getElementById('job-description').value || '';

    if (!jobTitle || !jobCompany) {
        statusEl.textContent = '⚠️ Please extract or enter job details first';
        statusEl.className = 'resume-status error';
        statusEl.style.display = 'block';
        return;
    }

    btn.disabled = true;
    statusEl.textContent = '📄 Generating targeted resume...';
    statusEl.className = 'resume-status generating';
    statusEl.style.display = 'block';

    try {
        // Get relevant experiences sorted by match score
        let experiences = getRelevantExperiencesFull(jobDescription);

        // Get additionally selected experiences
        const additionalSelect = document.getElementById('resume-additional-experience');
        const selectedCompanies = Array.from(additionalSelect.selectedOptions).map(opt => opt.value);

        // Add manually selected experiences that aren't already in the list
        if (selectedCompanies.length > 0) {
            const existingCompanies = new Set(experiences.map(exp => exp.company));
            selectedCompanies.forEach(company => {
                if (!existingCompanies.has(company)) {
                    const additionalExp = USER_PROFILE.experience.find(exp => exp.company === company);
                    if (additionalExp) {
                        experiences.push({ ...additionalExp, matchScore: 0 });
                    }
                }
            });
        }

        let optimizedHighlights = null;

        // Optionally use AI to optimize bullet points
        if (useAI && jobDescription) {
            statusEl.textContent = '🤖 AI-optimizing bullet points for this role...';

            const settings = await chrome.storage.sync.get(['aiProvider', 'aiApiKey', 'dashboardUrl']);
            const apiKey = settings.aiApiKey || DEFAULT_AI_API_KEY;
            if (apiKey) {
                settings.aiApiKey = apiKey;
                try {
                    optimizedHighlights = await optimizeResumeWithAI(experiences, jobDescription, customPrompt, settings);
                } catch (aiError) {
                    console.warn('AI optimization failed, using original:', aiError);
                }
            }
        }

        statusEl.textContent = '🎨 Creating beautiful resume...';

        // Sort experiences chronologically (most recent first)
        let sortedExperiences = [...experiences].sort((a, b) => {
            const getEndYear = (period) => {
                if (period.includes('Present')) return 9999;
                const match = period.match(/(\d{4})\s*$/);
                return match ? parseInt(match[1]) : 0;
            };
            return getEndYear(b.period) - getEndYear(a.period);
        });

        // Apply AI-optimized highlights if available
        if (optimizedHighlights) {
            sortedExperiences = sortedExperiences.map(exp => {
                const optimized = optimizedHighlights.find(o => o.company === exp.company);
                if (optimized) {
                    return { ...exp, highlights: optimized.highlights };
                }
                return exp;
            });
        }

        // Save resume data to storage for the template page to read
        await chrome.storage.local.set({
            resumeData: {
                targetJobTitle: jobTitle,
                targetCompany: jobCompany,
                experiences: sortedExperiences,
                profile: USER_PROFILE
            }
        });

        // Open the resume template page
        const templateUrl = chrome.runtime.getURL('resume-template.html');
        chrome.tabs.create({ url: templateUrl });

        statusEl.innerHTML = '✅ Resume generated! <strong>Press Ctrl/Cmd+P to save as PDF</strong>';
        statusEl.className = 'resume-status success';

    } catch (error) {
        console.error('Resume generation error:', error);
        statusEl.textContent = '❌ Error: ' + error.message;
        statusEl.className = 'resume-status error';
    } finally {
        btn.disabled = false;
    }
}

// Optimize resume highlights with AI
async function optimizeResumeWithAI(experiences, jobDescription, customPrompt, settings) {
    const baseUrl = settings.dashboardUrl || DEFAULT_DASHBOARD_URL;

    // Get top 3 experiences' highlights to optimize
    const topExperiences = experiences.slice(0, 3);
    const highlightsToOptimize = topExperiences.map(exp => ({
        company: exp.company,
        role: exp.role,
        highlights: exp.highlights
    }));

    const customInstructions = customPrompt ? `\n\nADDITIONAL CUSTOM INSTRUCTIONS:\n${customPrompt}\n` : '';

    const prompt = `You are optimizing resume bullet points for a specific job. Rewrite using the STAR framework (Situation/Task → Action → Result) while matching job requirements.

Job Description:
${jobDescription.slice(0, 1000)}

Current Experience Highlights:
${JSON.stringify(highlightsToOptimize, null, 2)}
${customInstructions}
IMPORTANT RULES:
- Use STAR framework: [Action verb] + [what you did] + [quantified result]
- Example: "Led checkout redesign reducing cart abandonment 15% and driving $2M incremental revenue"
- Example: "Built ML recommendation engine increasing user engagement 40% across 4M monthly users"
- Keep all facts, numbers, and achievements accurate - DO NOT invent metrics
- Use keywords from the job description where they naturally fit
- Start each bullet with a strong action verb (Led, Built, Shipped, Drove, Reduced, Increased, Launched, Designed, Optimized)
- Keep each bullet 12-18 words - concise but complete
- Focus on IMPACT and RESULTS, not just activities
- Return ONLY a JSON array in this exact format:
[
  { "company": "CompanyName", "highlights": ["bullet1", "bullet2", ...] },
  ...
]

Return ONLY the JSON, no other text.`;

    const response = await fetch(`${baseUrl}/api/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            apiKey: settings.aiApiKey,
            provider: settings.aiProvider || 'claude',
            maxTokens: 1500
        })
    });

    const result = await response.json();
    if (result.success && result.text) {
        // Parse the JSON from AI response
        const jsonMatch = result.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    }
    return null;
}
