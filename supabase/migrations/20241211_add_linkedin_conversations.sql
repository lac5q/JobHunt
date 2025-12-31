-- Add linkedin_conversations column to store LinkedIn conversation data
-- Created: 2024-12-11
-- Applied manually via Supabase SQL Editor

ALTER TABLE job_search_data
ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN job_search_data.linkedin_conversations IS 'Stores LinkedIn conversation logs synced from Chrome extension';
