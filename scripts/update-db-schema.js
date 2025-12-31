// Quick database schema updater using Supabase REST API
const SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTk4NzcsImV4cCI6MjA0ODQ5NTg3N30.uLIX7W5ygxWxOr0CWbIpKDeBL8rR7kOdkSZ6_5xXCp0';

async function updateSchema() {
    console.log('📊 Checking current schema...');
    
    // Fetch current data to see if column exists
    const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });
    
    const data = await response.json();
    console.log('Current data structure:', Object.keys(data[0] || {}));
    
    if (data[0] && 'linkedin_conversations' in data[0]) {
        console.log('✅ linkedin_conversations column already exists!');
    } else {
        console.log('⚠️  linkedin_conversations column NOT found');
        console.log('');
        console.log('Please run this SQL in your Supabase SQL Editor:');
        console.log('');
        console.log('ALTER TABLE job_search_data');
        console.log("ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;");
        console.log('');
        console.log('Or visit: https://supabase.com/dashboard/project/dkufgfmwqsxecylyvidi/sql/new');
    }
}

updateSchema().catch(console.error);
