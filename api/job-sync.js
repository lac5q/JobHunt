// Vercel Serverless Function for Job Tracking Sync
// Handles CRUD operations for job applications

const SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0OTIxMTgsImV4cCI6MjA4MTA2ODExOH0.GPdoDd7z5nuGx-oQ2l6CQX-fdz7T4CdUpG_PwORZB_g';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET - Fetch all jobs
        if (req.method === 'GET') {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main&select=jobs`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Supabase GET error:', response.status, errorText);
                // If jobs column doesn't exist, return empty array
                if (errorText.includes('jobs') || response.status === 400) {
                    return res.status(200).json({ success: true, jobs: [], needsColumn: true });
                }
                throw new Error(`Supabase GET failed: HTTP ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const jobs = data[0]?.jobs || [];

            return res.status(200).json({ success: true, jobs });
        }

        // POST - Add new job
        if (req.method === 'POST') {
            const jobData = req.body;

            // Validate required fields
            if (!jobData.title || !jobData.company) {
                return res.status(400).json({
                    success: false,
                    error: 'Title and company are required'
                });
            }

            // Fetch existing jobs
            const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main&select=jobs`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Supabase GET error:', response.status, errorText);
                // If jobs column doesn't exist, provide instructions
                if (errorText.includes('jobs') || response.status === 400) {
                    return res.status(500).json({
                        success: false,
                        error: 'Jobs column not found in database. Please add it via Supabase SQL: ALTER TABLE job_search_data ADD COLUMN IF NOT EXISTS jobs JSONB DEFAULT \'[]\'::jsonb;',
                        needsColumn: true
                    });
                }
                throw new Error(`Supabase GET failed: HTTP ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            let jobs = data[0]?.jobs || [];

            // Check for duplicate by URL
            if (jobData.url) {
                const existingByUrl = jobs.find(j => j.url === jobData.url);
                if (existingByUrl) {
                    return res.status(409).json({
                        success: false,
                        error: 'Job already exists',
                        existingJob: existingByUrl
                    });
                }
            }

            // Create job object
            const newJob = {
                id: jobData.id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                url: jobData.url || '',
                source: jobData.source || 'manual',
                title: jobData.title,
                company: jobData.company,
                companyNormalized: normalizeCompany(jobData.company),
                location: jobData.location || '',
                locationType: jobData.locationType || 'unknown',
                salary: jobData.salary || null,
                description: jobData.description || '',
                status: jobData.status || 'saved',
                statusHistory: [{
                    status: jobData.status || 'saved',
                    date: new Date().toISOString(),
                    notes: 'Job captured'
                }],
                capturedAt: new Date().toISOString(),
                appliedAt: jobData.status === 'applied' ? new Date().toISOString() : null,
                notes: jobData.notes || '',
                matchedContactIds: [],
                contactCount: 0,
                priority: jobData.priority || 'medium',
                isArchived: false
            };

            // Add to beginning of array
            jobs.unshift(newJob);

            // Update Supabase
            const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ jobs })
            });

            if (!updateResponse.ok) {
                throw new Error(`Supabase PATCH failed: HTTP ${updateResponse.status}`);
            }

            console.log('✅ Job saved:', newJob.title, '@', newJob.company);

            return res.status(201).json({
                success: true,
                job: newJob,
                totalJobs: jobs.length
            });
        }

        // PATCH - Update existing job
        if (req.method === 'PATCH') {
            const { id, ...updates } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Job ID is required'
                });
            }

            // Fetch existing jobs
            const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`Supabase GET failed: HTTP ${response.status}`);
            }

            const data = await response.json();
            let jobs = data[0]?.jobs || [];

            // Find and update job
            const jobIndex = jobs.findIndex(j => j.id === id);
            if (jobIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found'
                });
            }

            const existingJob = jobs[jobIndex];

            // Handle status change
            if (updates.status && updates.status !== existingJob.status) {
                const statusEntry = {
                    status: updates.status,
                    date: new Date().toISOString(),
                    notes: updates.statusNote || `Status changed to ${updates.status}`
                };
                existingJob.statusHistory = existingJob.statusHistory || [];
                existingJob.statusHistory.push(statusEntry);

                // Set appliedAt if moving to applied
                if (updates.status === 'applied' && !existingJob.appliedAt) {
                    existingJob.appliedAt = new Date().toISOString();
                }
            }

            // Update company normalized if company changed
            if (updates.company) {
                updates.companyNormalized = normalizeCompany(updates.company);
            }

            // Merge updates
            jobs[jobIndex] = { ...existingJob, ...updates, updatedAt: new Date().toISOString() };

            // Update Supabase
            const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ jobs })
            });

            if (!updateResponse.ok) {
                throw new Error(`Supabase PATCH failed: HTTP ${updateResponse.status}`);
            }

            console.log('✅ Job updated:', jobs[jobIndex].title);

            return res.status(200).json({
                success: true,
                job: jobs[jobIndex]
            });
        }

        // DELETE - Remove job (soft delete via archive)
        if (req.method === 'DELETE') {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Job ID is required'
                });
            }

            // Fetch existing jobs
            const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`Supabase GET failed: HTTP ${response.status}`);
            }

            const data = await response.json();
            let jobs = data[0]?.jobs || [];

            // Find and archive job
            const jobIndex = jobs.findIndex(j => j.id === id);
            if (jobIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Job not found'
                });
            }

            jobs[jobIndex].isArchived = true;
            jobs[jobIndex].archivedAt = new Date().toISOString();

            // Update Supabase
            const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({ jobs })
            });

            if (!updateResponse.ok) {
                throw new Error(`Supabase PATCH failed: HTTP ${updateResponse.status}`);
            }

            console.log('✅ Job archived:', jobs[jobIndex].title);

            return res.status(200).json({
                success: true,
                message: 'Job archived'
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('❌ Job sync error:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack,
            name: error.name
        });
    }
}

// Helper: Normalize company name for matching
function normalizeCompany(name) {
    if (!name) return '';
    return name.toLowerCase()
        .replace(/\b(inc|llc|corp|corporation|ltd|limited|co|company|technologies|tech|software|solutions|group|holdings|enterprises)\b\.?/gi, '')
        .replace(/[^a-z0-9]/g, '')
        .trim();
}
