# Supabase API Access Fix Guide

## Problem

The Supabase anon key is being rejected with "Invalid API key" error, preventing automated database operations.

## Root Cause

**Row Level Security (RLS) policies** are likely missing or misconfigured. Your browser-based dashboards work because they're using cached authentication, but command-line/script access is being blocked.

## Solution

### Step 1: Check RLS Policies

Go to your Supabase dashboard → Authentication → Policies

Check if `job_search_data` table has RLS policies that allow:
- SELECT for anon role
- INSERT for anon role
- UPDATE for anon role

### Step 2: Fix RLS Policies

Run this SQL in Supabase SQL Editor to allow anon access:

```sql
-- Enable RLS if not already enabled
ALTER TABLE job_search_data ENABLE ROW LEVEL SECURITY;

-- Allow anon users to SELECT
CREATE POLICY "Allow anon select on job_search_data"
ON job_search_data
FOR SELECT
TO anon
USING (true);

-- Allow anon users to INSERT
CREATE POLICY "Allow anon insert on job_search_data"
ON job_search_data
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anon users to UPDATE
CREATE POLICY "Allow anon update on job_search_data"
ON job_search_data
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Allow anon users to DELETE (optional, uncomment if needed)
-- CREATE POLICY "Allow anon delete on job_search_data"
-- ON job_search_data
-- FOR DELETE
-- TO anon
-- USING (true);
```

### Step 3: Add LinkedIn Conversations Column

After fixing RLS, run:

```sql
ALTER TABLE job_search_data
ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;
```

### Step 4: Verify Access

Test that the API key works:

```bash
node update-db-schema.js
```

If you see "linkedin_conversations column already exists!" then it's working!

## Alternative: Use Service Role Key

If you want Claude to have full database access for automated operations, you can:

1. Get your Service Role Key from Supabase → Settings → API
2. Add it to `.env.local`:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```
3. **Warning**: Service role key bypasses RLS - only use in trusted environments

## Why This Happened

In your previous apps, you either:
1. Had RLS disabled entirely
2. Or had these policies already set up
3. Or used authenticated users instead of anon access

This is the first time we've tried to use the anon key for write operations from outside the browser.

## Quick Fix Summary

**Run this one SQL block and you're done:**

```sql
-- Fix RLS policies
ALTER TABLE job_search_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow anon select" ON job_search_data FOR SELECT TO anon USING (true);
CREATE POLICY IF NOT EXISTS "Allow anon insert" ON job_search_data FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow anon update" ON job_search_data FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Add new column
ALTER TABLE job_search_data ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;
```

**That's it!** After running that SQL, I'll be able to manage your database automatically going forward.
