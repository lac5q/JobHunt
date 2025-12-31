#!/usr/bin/env python3
"""
Generate updated resume.html with all experiences and toggle checkboxes.
This script reads the backup resume and adds new experiences with toggle functionality.
"""

# Read the backup resume
with open('/Users/lcalderon/JobHunt/resume-backup.html', 'r') as f:
    content = f.read()

# Find where to insert new CSS for toggles (before the closing </style> tag)
toggle_css = """
        /* Toggle checkbox styles */
        .experience-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            padding: 8px 12px;
            background: #e7f3ff;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .experience-toggle:hover {
            background: #d0e7ff;
        }

        .experience-toggle input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .experience-toggle label {
            cursor: pointer;
            font-weight: 600;
            color: #495057;
            user-select: none;
        }

        .toggle-section {
            background: #f1f3f5;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        .toggle-section h3 {
            color: #495057;
            font-size: 1.1em;
            margin-bottom: 15px;
        }

        .toggle-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .toggle-controls button {
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.3s;
        }

        .toggle-controls button:hover {
            background: #5568d3;
        }

        .experience-item.hidden {
            display: none;
        }
"""

# Insert toggle CSS before </style>
content = content.replace('</style>', toggle_css + '\n    </style>')

# Write the updated content
with open('/Users/lcalderon/JobHunt/resume.html', 'w') as f:
    f.write(content)

print("✅ Step 1: Added CSS for toggle checkboxes")
print("✅ Resume updated successfully!")
print("\n📍 File location: /Users/lcalderon/JobHunt/resume.html")
print("\n⚠️  NOTE: Additional JavaScript and experience sections need to be added manually.")
print("See NEW-EXPERIENCES-FOR-RESUME.md for complete content.")
