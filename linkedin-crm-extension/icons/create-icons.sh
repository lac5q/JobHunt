#!/bin/bash
# Simple placeholder - these will be replaced with proper icons

# Create 16x16 icon (using ImageMagick if available, otherwise just create empty files)
if command -v convert &> /dev/null; then
    convert -size 16x16 xc:#0a66c2 -fill white -pointsize 12 -gravity center -annotate +0+0 "Li" icon16.png
    convert -size 48x48 xc:#0a66c2 -fill white -pointsize 32 -gravity center -annotate +0+0 "Li" icon48.png
    convert -size 128x128 xc:#0a66c2 -fill white -pointsize 96 -gravity center -annotate +0+0 "Li" icon128.png
else
    # Create empty placeholder files
    touch icon16.png icon48.png icon128.png
    echo "ImageMagick not found. Created placeholder icon files."
    echo "You can replace these with proper icons later."
fi
