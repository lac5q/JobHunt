const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SUPABASE_URL = 'https://dkufgfmwqsxecylyvidi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NjAxODMsImV4cCI6MjA0OTUzNjE4M30.sRjuUO41AoN9lqCWmRKjxVDN48rVWnNyIz8n2ShdHqE';

(async () => {
    console.log('📦 CHECKING SUPABASE DATABASE\n');

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/job_search_data?id=eq.main`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            return;
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.log('❌ No data found in Supabase!');
            return;
        }

        const record = data[0];

        console.log('✅ Data found in Supabase:\n');
        console.log('Fields:');
        console.log(`  - contacts: ${record.contacts?.length || 0}`);
        console.log(`  - linkedin_conversations: ${record.linkedin_conversations?.length || 0}`);
        console.log(`  - applications: ${record.applications?.length || 0}`);
        console.log(`  - progress: ${record.progress ? Object.keys(record.progress).length : 0} keys`);

        if (record.contacts && record.contacts.length > 0) {
            console.log('\nFirst 10 contacts in Supabase:');
            record.contacts.slice(0, 10).forEach((c, i) => {
                console.log(`  ${i + 1}. ${c.name || `${c.firstName} ${c.lastName}` || 'NO NAME'} - ${c.company || 'NO COMPANY'}`);
            });
        }

        if (record.linkedin_conversations && record.linkedin_conversations.length > 0) {
            console.log(`\n✅ ${record.linkedin_conversations.length} LinkedIn conversations ready to import`);
            console.log('Sample:');
            record.linkedin_conversations.slice(0, 5).forEach((conv, i) => {
                console.log(`  ${i + 1}. ${conv.contactName || 'NO NAME'} - ${conv.lastMessage?.substring(0, 50) || 'NO MESSAGE'}...`);
            });
        }

        console.log('\n' + '='.repeat(60));
        console.log('DIAGNOSIS:');
        console.log('='.repeat(60));

        if (record.contacts && record.contacts.length > 0) {
            console.log('✅ Contacts exist in Supabase');
            console.log('   → Dashboard should load these on startup');
        } else if (record.linkedin_conversations && record.linkedin_conversations.length > 0) {
            console.log('⚠️  No contacts, but LinkedIn conversations exist');
            console.log('   → Dashboard needs to convert LinkedIn conversations to contacts');
        } else {
            console.log('❌ No contacts OR LinkedIn conversations in Supabase');
            console.log('   → Data might have been lost');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
