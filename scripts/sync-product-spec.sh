#!/bin/bash

# Sync PRODUCT-SPEC.md to Obsidian vault
# Auto-runs after git commits that modify PRODUCT-SPEC.md

REPO="/Users/lcalderon/github/JobHunt"
OBSIDIAN="/Users/lcalderon/Library/Mobile Documents/iCloud~md~obsidian/Documents/JobHunt/JobHunt"

echo "🔄 Syncing PRODUCT-SPEC.md to Obsidian..."

# Copy spec
cp "$REPO/PRODUCT-SPEC.md" "$OBSIDIAN/PRODUCT-SPEC.md"

# Copy screenshots if they exist
if [ -d "$REPO/docs/screenshots" ]; then
  mkdir -p "$OBSIDIAN/attachments"
  cp -r "$REPO/docs/screenshots/"* "$OBSIDIAN/attachments/" 2>/dev/null || true
  echo "📸 Screenshots synced"
fi

echo "✅ Synced to Obsidian vault"
echo "   Spec: $OBSIDIAN/PRODUCT-SPEC.md"
