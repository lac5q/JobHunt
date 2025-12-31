-- Add linkedin_conversations column to job_search_data table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/dkufgfmwqsxecylyvidi/sql

ALTER TABLE job_search_data
ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;

-- Verify it was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'job_search_data'
AND column_name = 'linkedin_conversations';
