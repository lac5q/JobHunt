# Supabase Setup for Cross-Browser Sync

This guide will help you set up Supabase to sync your job search data across all your browsers and devices.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization (or create one)
4. Enter project details:
   - **Name:** `job-search-tracker` (or any name you like)
   - **Database Password:** Generate a strong password and save it
   - **Region:** Choose closest to you
5. Click "Create new project" and wait ~2 minutes for setup

## Step 2: Create the Database Table

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Paste this SQL and click "Run":

```sql
-- Create the job search data table
CREATE TABLE job_search_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    contacts JSONB DEFAULT '[]'::jsonb,
    progress JSONB DEFAULT '{}'::jsonb,
    message_templates JSONB DEFAULT '[]'::jsonb,
    reviewed_contacts JSONB DEFAULT '[]'::jsonb,
    network_explorer_filters JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row
INSERT INTO job_search_data (id) VALUES ('main')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE job_search_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations with anon key (your data is private via project isolation)
CREATE POLICY "Allow all operations" ON job_search_data
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create function to auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating timestamp
CREATE TRIGGER update_job_search_data_updated_at
    BEFORE UPDATE ON job_search_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

## Step 3: Get Your API Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Configure Your Dashboard

1. Open your Job Search Dashboard
2. Click the **Settings** button (gear icon in top-right)
3. Enter your Supabase URL and API Key
4. Click "Save & Connect"
5. Your data will now sync automatically!

## How Sync Works

- **Auto-save:** Every time you make a change, it saves to Supabase
- **Auto-load:** When you open the dashboard on any device, it loads from Supabase
- **Conflict resolution:** Latest changes win (based on timestamp)
- **Offline support:** Works offline, syncs when back online

## Security Notes

- Your Supabase project is private to you
- The anon key only works for your specific project
- Data is encrypted in transit (HTTPS)
- You can delete your project anytime to remove all data

## Troubleshooting

**"Failed to connect"**
- Double-check your URL and API key
- Make sure the SQL was run successfully

**"Data not syncing"**
- Check browser console for errors
- Try clicking "Sync Now" in settings

**"Lost local data"**
- If you had data before setting up sync, use "Export Data" first
- Then set up sync and "Import Data" to merge
