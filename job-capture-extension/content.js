// Job Capture Extension - Content Script
// Extracts job data from job board pages

console.log('Job Capture Extension v1.7.2');

// Detect which job board we're on
function detectJobBoard() {
    const url = window.location.href;
    if (url.includes('linkedin.com/jobs')) return 'linkedin';
    if (url.includes('indeed.com')) return 'indeed';
    if (url.includes('glassdoor.com')) return 'glassdoor';
    return 'unknown';
}

// Extract job data from LinkedIn
function extractLinkedInJob() {
    try {
        // LinkedIn job details page selectors (updated for 2024+ UI)
        // Try multiple selector patterns - LinkedIn changes these frequently
        let title = '';
        const titleSelectors = [
            // Collections/search page selectors (right panel)
            '.jobs-details__main-content h1',
            '.job-details-jobs-unified-top-card__job-title h1',
            '.jobs-unified-top-card__job-title a',
            // Direct job view selectors
            'h1.job-details-jobs-unified-top-card__job-title',
            'h1.jobs-unified-top-card__job-title',
            'h2.job-details-jobs-unified-top-card__job-title',
            'h2.t-24.t-bold',
            '.job-details-jobs-unified-top-card__job-title h1',
            '.jobs-unified-top-card__job-title h1',
            'h1[class*="job-title"]',
            'h2[class*="job-title"]',
            '.jobs-details-top-card__job-title h1',
            '.artdeco-entity-lockup__title h1'
        ];

        for (const selector of titleSelectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                title = el.textContent.trim();
                console.log('Found title with selector:', selector, title);
                break;
            }
        }

        // Company name selectors
        let company = '';
        const companySelectors = [
            // Collections/search page selectors
            '.jobs-details__main-content .job-details-jobs-unified-top-card__company-name',
            '.jobs-details__main-content .job-details-jobs-unified-top-card__company-name a',
            '.jobs-unified-top-card__subtitle-primary-grouping .app-aware-link',
            // Direct job view selectors
            '.job-details-jobs-unified-top-card__company-name a',
            '.job-details-jobs-unified-top-card__company-name',
            '.jobs-unified-top-card__company-name a',
            '.jobs-unified-top-card__company-name',
            'a.app-aware-link[href*="/company/"]',
            '.jobs-details-top-card__company-info a',
            'span.artdeco-entity-lockup__subtitle a',
            'span[class*="company-name"]'
        ];

        for (const selector of companySelectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                company = el.textContent.trim();
                console.log('Found company with selector:', selector, company);
                break;
            }
        }

        // Location selectors
        let location = '';
        const locationSelectors = [
            // Collections/search page selectors
            '.jobs-details__main-content .job-details-jobs-unified-top-card__primary-description-container .tvm__text',
            '.jobs-unified-top-card__primary-description',
            // Direct job view selectors
            '.job-details-jobs-unified-top-card__primary-description-container .tvm__text',
            '.job-details-jobs-unified-top-card__bullet',
            '.jobs-unified-top-card__bullet',
            'span.tvm__text.tvm__text--low-emphasis',
            'span[class*="job-location"]',
            '.jobs-details-top-card__bullet'
        ];

        for (const selector of locationSelectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                const text = el.textContent.trim();
                // Skip if it looks like job metadata rather than location
                if (!text.includes('applicant') && !text.includes('hour') && !text.includes('day') && !text.includes('connection')) {
                    location = text;
                    console.log('Found location with selector:', selector, location);
                    break;
                }
            }
        }

        // Try to get job description
        let description = '';
        const descriptionSelectors = [
            '.jobs-description-content__text',
            '.jobs-description__content',
            'div[class*="description-content"]',
            '.jobs-box__html-content'
        ];

        for (const selector of descriptionSelectors) {
            const el = document.querySelector(selector);
            if (el?.textContent?.trim()) {
                description = el.textContent.trim().slice(0, 4000); // Increased for better AI context
                break;
            }
        }

        // Try to get location type from job insights or description
        let locationType = 'unknown';
        const insightsSelectors = [
            '.job-details-jobs-unified-top-card__job-insight',
            '.jobs-unified-top-card__job-insight',
            'li[class*="job-insight"]'
        ];

        let insightsText = '';
        for (const selector of insightsSelectors) {
            const el = document.querySelector(selector);
            if (el?.textContent) {
                insightsText = el.textContent.toLowerCase();
                break;
            }
        }

        // Check insights and description for work type
        const searchText = (insightsText + ' ' + description).toLowerCase();
        if (searchText.includes('remote')) locationType = 'remote';
        else if (searchText.includes('hybrid')) locationType = 'hybrid';
        else if (searchText.includes('on-site') || searchText.includes('onsite') || searchText.includes('in-person')) locationType = 'onsite';

        // Extract proper job URL - handle collections/search pages with currentJobId
        let jobUrl = window.location.href;
        const currentUrl = new URL(window.location.href);
        const currentJobId = currentUrl.searchParams.get('currentJobId');

        if (currentJobId) {
            // Convert collections/search URL to direct job URL
            jobUrl = `https://www.linkedin.com/jobs/view/${currentJobId}/`;
        } else if (!jobUrl.includes('/jobs/view/')) {
            // Try to find job ID in the URL path or from the page
            const jobIdMatch = jobUrl.match(/\/jobs\/[^\/]+\/(\d+)/);
            if (jobIdMatch) {
                jobUrl = `https://www.linkedin.com/jobs/view/${jobIdMatch[1]}/`;
            }
        }

        const result = {
            title: title || '',
            company: company || '',
            location: location || '',
            locationType,
            description,
            url: jobUrl,
            source: 'linkedin'
        };

        // Only log if we got at least some data
        if (title || company) {
            console.log('LinkedIn job extracted:', { title, company, location });
        }

        return result;
    } catch (e) {
        // Silently fail - don't spam console unless there's a real error
        if (e.message && !e.message.includes('querySelector')) {
            console.error('Error extracting LinkedIn job:', e);
        }
        return null;
    }
}

// Extract job data from Indeed
function extractIndeedJob() {
    try {
        const title = document.querySelector('[data-testid="jobsearch-JobInfoHeader-title"]')?.textContent.trim() ||
                     document.querySelector('.jobsearch-JobInfoHeader-title')?.textContent.trim() ||
                     document.querySelector('h1.icl-u-xs-mb--xs')?.textContent.trim();

        const company = document.querySelector('[data-testid="inlineHeader-companyName"]')?.textContent.trim() ||
                       document.querySelector('.jobsearch-InlineCompanyRating-companyHeader')?.textContent.trim() ||
                       document.querySelector('.icl-u-lg-mr--sm')?.textContent.trim();

        const location = document.querySelector('[data-testid="inlineHeader-companyLocation"]')?.textContent.trim() ||
                        document.querySelector('.jobsearch-JobInfoHeader-subtitle > div:last-child')?.textContent.trim() ||
                        document.querySelector('.icl-u-xs-mt--xs')?.textContent.trim();

        const descriptionEl = document.querySelector('#jobDescriptionText') ||
                             document.querySelector('.jobsearch-jobDescriptionText');
        const description = descriptionEl?.textContent.trim().slice(0, 4000) || ''; // Increased for better AI context

        let locationType = 'unknown';
        const jobText = (document.body.textContent || '').toLowerCase();
        if (jobText.includes('remote')) locationType = 'remote';
        else if (jobText.includes('hybrid')) locationType = 'hybrid';

        return {
            title: title || '',
            company: company || '',
            location: location || '',
            locationType,
            description,
            url: window.location.href,
            source: 'indeed'
        };
    } catch (e) {
        console.error('Error extracting Indeed job:', e);
        return null;
    }
}

// Extract job data from Glassdoor
function extractGlassdoorJob() {
    try {
        const title = document.querySelector('[data-test="job-title"]')?.textContent.trim() ||
                     document.querySelector('.css-1vg6q84')?.textContent.trim() ||
                     document.querySelector('.jobViewJobTitle')?.textContent.trim();

        const company = document.querySelector('[data-test="employer-name"]')?.textContent.trim() ||
                       document.querySelector('.css-87uc0g')?.textContent.trim() ||
                       document.querySelector('.jobViewCompanyName')?.textContent.trim();

        const location = document.querySelector('[data-test="location"]')?.textContent.trim() ||
                        document.querySelector('.css-56kyx5')?.textContent.trim() ||
                        document.querySelector('.jobViewJobLocation')?.textContent.trim();

        const descriptionEl = document.querySelector('[data-test="job-description"]') ||
                             document.querySelector('.jobDescriptionContent');
        const description = descriptionEl?.textContent.trim().slice(0, 4000) || ''; // Increased for better AI context

        let locationType = 'unknown';
        if (description.toLowerCase().includes('remote')) locationType = 'remote';
        else if (description.toLowerCase().includes('hybrid')) locationType = 'hybrid';

        return {
            title: title || '',
            company: company || '',
            location: location || '',
            locationType,
            description,
            url: window.location.href,
            source: 'glassdoor'
        };
    } catch (e) {
        console.error('Error extracting Glassdoor job:', e);
        return null;
    }
}

// Extract job based on current page
function extractJobData() {
    const board = detectJobBoard();

    switch (board) {
        case 'linkedin':
            return extractLinkedInJob();
        case 'indeed':
            return extractIndeedJob();
        case 'glassdoor':
            return extractGlassdoorJob();
        default:
            // Try generic extraction for unknown sites
            return extractGenericJob();
    }
}

// Generic job extraction for any page
function extractGenericJob() {
    try {
        // Try common patterns
        const title = document.querySelector('h1')?.textContent.trim() ||
                     document.title.split('|')[0].trim() ||
                     document.title.split('-')[0].trim();

        // Look for company in meta tags or structured data
        let company = '';
        const orgSchema = document.querySelector('script[type="application/ld+json"]');
        if (orgSchema) {
            try {
                const data = JSON.parse(orgSchema.textContent);
                company = data.hiringOrganization?.name || data.employer?.name || '';
            } catch (e) {}
        }

        return {
            title: title || '',
            company: company || '',
            location: '',
            locationType: 'unknown',
            description: '',
            url: window.location.href,
            source: 'other'
        };
    } catch (e) {
        return null;
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXTRACT_JOB') {
        const jobData = extractJobData();
        sendResponse({ success: !!jobData, job: jobData, board: detectJobBoard() });
    }
    return true;
});
