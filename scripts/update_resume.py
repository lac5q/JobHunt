#!/usr/bin/env python3
"""
Automatically update resume.html with all new content:
- Updated Executive Summary and About Me
- 5 new experiences
- Toggle checkboxes
- Updated JavaScript
"""

import re

# Read the resume file
with open('/Users/lcalderon/JobHunt/resume.html', 'r') as f:
    content = f.read()

print("Starting resume update...")

# ============================================================================
# STEP 1: Update Executive Summary paragraph
# ============================================================================
old_exec_para = r'<p style="margin-bottom: 15px;">Led TurboTax Self-Employed \(\$900M, 4M\+ users\) as Principal/Group PM managing 4 PMs while staying hands-on\. Pure PLG motion—no sales team, self-serve at scale\. Now run SketchPop \(\$3M consumer e-commerce\) as CEO\. <strong>Core superpower: data-driven decision making</strong>—analyze user behavior, run experiments, use insights to ship features that drive conversion and retention\. Distinguished by shipping AI/ML products BEFORE ChatGPT hype, then rapidly adopting modern LLMs\. Rare combination of:</p>'

new_exec_para = '<p style="margin-bottom: 15px;"><strong>Consumer product leader since 2013</strong> across iconic brands: TurboTax ($900M, 4M+ users), Ancestry ($800M subscriptions), eBay (global marketplace). Now run SketchPop ($3M consumer e-commerce) as CEO. <strong>Core superpower: data-driven decision making</strong>—analyze user behavior, run experiments, use insights to ship features that drive conversion and retention. Distinguished by shipping AI/ML products BEFORE ChatGPT hype, then rapidly adopting modern LLMs. Rare combination of:</p>'

content = re.sub(old_exec_para, new_exec_para, content, flags=re.DOTALL)
print("✓ Updated Executive Summary first paragraph")

# ============================================================================
# STEP 2: Update Executive Summary bullets
# ============================================================================
old_bullets = r'<li><strong>Data-Driven Decision Making:</strong> Analyze user behavior across millions of sessions, run A/B tests, use cohort analysis and funnel optimization to prioritize ruthlessly—my core superpower</li>\s*<li><strong>Product-Led Growth:</strong> Led \$900M PLG business with zero sales team—freemium models, self-serve onboarding, conversion optimization, viral loops</li>\s*<li><strong>Consumer/SMB at Scale:</strong> Served 4M\+ solopreneurs/freelancers at TurboTax, understand consumer behavior, retention, engagement metrics deeply</li>\s*<li><strong>AI/ML for Growth:</strong> Shipped 4 AI products to reduce friction and drive conversion at Intuit \(pre-ChatGPT\), deployed modern LLMs at SketchPop \(40% cost reduction\)</li>\s*<li><strong>E-commerce Expertise:</strong> Run \$3M consumer e-commerce business, deep Shopify knowledge, conversion funnel optimization, retention analysis</li>'

new_bullets = '''<li><strong>Data-Driven Decision Making:</strong> Analyze user behavior across millions of sessions, run A/B tests, use cohort analysis and funnel optimization to prioritize ruthlessly—my core superpower. Track record: +2% checkout conversion at eBay ($100M+ lift), 30% mobile conversion lift at Ancestry, 5% revenue lift from abandon cart</li>
                            <li><strong>Product-Led Growth:</strong> Led $900M PLG business at Intuit with zero sales team—freemium models, self-serve onboarding, conversion optimization. Also led growth initiatives at Ancestry ($800M subscriptions) and eBay marketplace</li>
                            <li><strong>Consumer/SMB at Scale:</strong> Served 4M+ solopreneurs at TurboTax, millions of consumers at Ancestry and eBay—understand consumer behavior, retention, engagement metrics deeply across multiple product types</li>
                            <li><strong>AI/ML for Growth:</strong> Shipped 4 AI products to reduce friction and drive conversion at Intuit (pre-ChatGPT), deployed modern LLMs at SketchPop (40% cost reduction)</li>
                            <li><strong>Multi-Scale Experience:</strong> $900M enterprise (Intuit) → $800M consumer subscriptions (Ancestry) → Global marketplace (eBay) → $3M SMB (SketchPop)</li>'''

content = re.sub(old_bullets, new_bullets, content, flags=re.DOTALL)
print("✓ Updated Executive Summary bullets")

# ============================================================================
# STEP 3: Update About Me section opening
# ============================================================================
old_about_opening = r'<p style="margin-bottom: 15px;">I\'m a data-driven product leader who turns user insights into growth\. Equally comfortable managing a team OR being the solo IC product hire\. Consumer/SMB scale experience \(millions of users\), deep AI/ML expertise, product-led growth execution\.</p>'

new_about_opening = '<p style="margin-bottom: 15px;">I\'m a data-driven product leader who turns user insights into growth. Equally comfortable managing a team OR being the solo IC product hire. <strong>Consumer product leader since 2013</strong> across TurboTax, Ancestry, eBay—deep AI/ML expertise, proven conversion optimization.</p>'

content = re.sub(old_about_opening, new_about_opening, content)
print("✓ Updated About Me opening")

# ============================================================================
# STEP 4: Update About Me superpower paragraph
# ============================================================================
old_superpower = r'<p style="margin-bottom: 15px;">My superpower: using data analysis to make the right product calls\. At TurboTax, I analyzed user behavior across millions of sessions to identify drop-offs, then shipped AI features \(expense categorization, deduction finder\) that increased completion rates and drove freemium-to-paid conversion\. Pure PLG motion—no sales team, self-serve at scale\.</p>'

new_superpower = '<p style="margin-bottom: 15px;"><strong>My superpower: using data analysis to make the right product calls.</strong> At TurboTax, analyzed user behavior across millions of sessions to identify drop-offs, then shipped AI features that increased completion rates. At Ancestry, led growth initiatives achieving 30% mobile conversion lift and 5% revenue boost from abandon cart. At eBay, drove $100M+ business lift through 2% checkout optimization. Pure PLG motion—no sales team, self-serve at scale.</p>'

content = re.sub(old_superpower, new_superpower, content)
print("✓ Updated About Me superpower paragraph")

# ============================================================================
# STEP 5: Update About Me SketchPop paragraph
# ============================================================================
old_sketchpop_para = r'<p style="margin-bottom: 15px;">As CEO of SketchPop \(\$3M consumer e-commerce, 20% margins\), I wear many hats: solo product leader working with engineers, plus marketing, operations, finance\. Use AI as decision-making partner—design experiences, automate tasks, optimize funnels\. I write specs, analyze data, work with engineers daily, ship fast\.</p>'

new_sketchpop_para = '<p style="margin-bottom: 15px;">As CEO of SketchPop ($3M consumer e-commerce, 20% margins), I wear many hats: solo product leader working with engineers, plus marketing, operations, finance. Acquired through Epilogue Capital (my investment firm focused on consumer/SMB businesses). Use AI as decision-making partner—design experiences, automate tasks, optimize funnels. I write specs, analyze data, work with engineers daily, ship fast.</p>'

content = re.sub(old_sketchpop_para, new_sketchpop_para, content)
print("✓ Updated About Me SketchPop paragraph")

# ============================================================================
# STEP 6: Update About Me leadership paragraph
# ============================================================================
old_leadership = r'<p style="margin-bottom: 15px;">I thrive in both leadership and IC roles\. Equally comfortable as CEO of a portfolio company \(SketchPop\) or managing a product team serving millions \(Intuit\)—what matters is shipping great products and building great culture\.</p>'

new_leadership = '<p style="margin-bottom: 15px;">I thrive in both leadership and IC roles. Led product teams at Intuit (4 PMs) and eBay (6+ analysts), now solo product leader at SketchPop—what matters is shipping great products and building great culture.</p>'

content = re.sub(old_leadership, new_leadership, content)
print("✓ Updated About Me leadership paragraph")

# ============================================================================
# STEP 7: Update About Me "What I bring" bullets
# ============================================================================
old_what_i_bring = r'<li>Data-Driven Decision Making: Analyze user behavior, run experiments, prioritize ruthlessly—my core superpower</li>\s*<li>Product-Led Growth: Self-serve onboarding, freemium models, conversion optimization—millions of users</li>\s*<li>AI/ML for Growth: Shipped 4 AI products at Intuit \(pre-ChatGPT\); use AI as force multiplier at SketchPop</li>\s*<li>Consumer/SMB Scale: Led products serving 4M\+ users—understand behavior, retention, engagement</li>\s*<li>Hands-On Execution: Work with engineering, write specs, define requirements, ship products personally</li>\s*<li>Team Building & Culture: Hire and scale PM teams while building great culture</li>'

new_what_i_bring = '''<li><strong>Data-Driven Decision Making:</strong> Track record of conversion wins—+2% at eBay ($100M+), 30% at Ancestry, 5% revenue lift—my core superpower</li>
                        <li><strong>Product-Led Growth:</strong> Led PLG at scale (TurboTax $900M, Ancestry $800M, eBay marketplace)—freemium, self-serve, optimization</li>
                        <li><strong>AI/ML for Growth:</strong> Shipped 4 AI products at Intuit (pre-ChatGPT); use AI as force multiplier at SketchPop</li>
                        <li><strong>Consumer at Scale:</strong> Led products serving millions across TurboTax (4M+ users), Ancestry, eBay marketplace since 2013</li>
                        <li><strong>Hands-On Execution:</strong> Work with engineering, write specs, define requirements, ship products personally</li>
                        <li><strong>Team & Culture:</strong> Hire and scale PM teams (Intuit, eBay) while building great culture</li>'''

content = re.sub(old_what_i_bring, new_what_i_bring, content, flags=re.DOTALL)
print("✓ Updated About Me 'What I bring' bullets")

# Write the updated content
with open('/Users/lcalderon/JobHunt/resume.html', 'w') as f:
    f.write(content)

print("\n✅ Resume updated successfully!")
print("📍 File: /Users/lcalderon/JobHunt/resume.html")
print("\nNext steps:")
print("1. Open resume.html in browser to verify changes")
print("2. Run Part 2 of update to add new experiences and toggles")
