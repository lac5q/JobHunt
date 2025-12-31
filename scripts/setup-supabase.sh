#!/bin/bash

# Supabase Database Setup Script
# This script adds required columns to your job_search_data table

SUPABASE_URL="https://dkufgfmwqsxecylyvidi.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWZnZm13cXN4ZWN5bHl2aWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MTk4NzcsImV4cCI6MjA0ODQ5NTg3N30.uLIX7W5ygxWxOr0CWbIpKDeBL8rR7kOdkSZ6_5xXCp0"
DB_PASSWORD="wxb_reu!xkr@MAF7umq"

echo "🚀 Setting up Supabase database..."
echo ""

# Try using Supabase REST API with raw SQL
echo "Adding linkedin_conversations column via SQL..."

# Use the connection pooler with proper escaping
PGPASSWORD="${DB_PASSWORD}" psql \
  -h aws-0-us-west-1.pooler.supabase.com \
  -p 6543 \
  -U postgres.dkufgfmwqsxecylyvidi \
  -d postgres \
  -c "ALTER TABLE job_search_data ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;"

if [ $? -eq 0 ]; then
  echo "✅ linkedin_conversations column added successfully!"
else
  echo "❌ Failed to add column. You may need to run this SQL manually in Supabase SQL Editor:"
  echo ""
  echo "ALTER TABLE job_search_data ADD COLUMN IF NOT EXISTS linkedin_conversations JSONB DEFAULT '[]'::jsonb;"
fi

echo ""
echo "Next steps:"
echo "1. Install the Chrome extension from linkedin-crm-extension/"
echo "2. Configure it with your Supabase credentials"
echo "3. Start syncing LinkedIn conversations!"
