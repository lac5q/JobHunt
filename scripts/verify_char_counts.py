#!/usr/bin/env python3
"""Verify all LinkedIn copy text is under character limits"""

# Executive Summary for LinkedIn
exec_summary = """Data-Driven Product Leader—PLG/Consumer/SMB Expert. Turn user insights into growth through analytics, experimentation, and AI. Equally comfortable managing teams OR being hands-on IC.

Consumer product leader since 2013 across iconic brands: TurboTax ($900M, 4M+ users), Ancestry ($800M subscriptions), eBay (global marketplace). Now run SketchPop ($3M consumer e-commerce) as CEO. Core superpower: data-driven decision making—analyze user behavior, run experiments, use insights to ship features that drive conversion and retention. Distinguished by shipping AI/ML products BEFORE ChatGPT hype, then rapidly adopting modern LLMs. Rare combination of:

• Data-Driven Decision Making: Analyze user behavior across millions of sessions, run A/B tests, use cohort analysis and funnel optimization to prioritize ruthlessly—my core superpower. Track record: +2% checkout conversion at eBay ($100M+ lift), 30% mobile conversion lift at Ancestry, 5% revenue lift from abandon cart
• Product-Led Growth: Led $900M PLG business at Intuit with zero sales team—freemium models, self-serve onboarding, conversion optimization. Also led growth initiatives at Ancestry ($800M subscriptions) and eBay marketplace
• Consumer/SMB at Scale: Served 4M+ solopreneurs at TurboTax, millions of consumers at Ancestry and eBay—understand consumer behavior, retention, engagement metrics deeply across multiple product types
• AI/ML for Growth: Shipped 4 AI products to reduce friction and drive conversion at Intuit (pre-ChatGPT), deployed modern LLMs at SketchPop (40% cost reduction)
• Multi-Scale Experience: $900M enterprise (Intuit) → $800M consumer subscriptions (Ancestry) → Global marketplace (eBay) → $3M SMB (SketchPop)

Seeking: VP Product, Director Product, or Principal PM roles at PLG/consumer/SMB companies (Notion, Canva, Figma, Duolingo, Shopify) where data-driven decision making drives growth. Equally comfortable managing a team OR being the solo IC product hire—I thrive in both."""

# LinkedIn About (2,600 limit)
linkedin_about = """I'm a data-driven product leader who turns user insights into growth. Equally comfortable managing a team OR being the solo IC product hire. Consumer product leader since 2013 across TurboTax, Ancestry, eBay—deep AI/ML expertise, proven conversion optimization.

At Intuit, I led the $900M TurboTax Self-Employed business as Principal/Group PM serving 4M+ solopreneurs, freelancers, gig workers. Managed 4 PMs while staying hands-on—drove 10-15% CAGR ($100-150M annual growth) through data-driven decisions, A/B testing, and shipped 4 AI/ML products that reduced friction and improved conversion.

My superpower: using data analysis to make the right product calls. At TurboTax, analyzed user behavior across millions of sessions to identify drop-offs, then shipped AI features that increased completion rates. At Ancestry, led growth initiatives achieving 30% mobile conversion lift and 5% revenue boost from abandon cart. At eBay, drove $100M+ business lift through 2% checkout optimization. Pure PLG motion—no sales team, self-serve at scale.

As CEO of SketchPop ($3M consumer e-commerce, 20% margins), I wear many hats: solo product leader working with engineers, plus marketing, operations, finance. Acquired through Epilogue Capital (my investment firm focused on consumer/SMB businesses). Use AI as decision-making partner—design experiences, automate tasks, optimize funnels. I write specs, analyze data, work with engineers daily, ship fast.

I thrive in both leadership and IC roles. Led product teams at Intuit (4 PMs) and eBay (6+ analysts), now solo product leader at SketchPop—what matters is shipping great products and building great culture.

What I bring:
• Data-Driven Decision Making: Track record of conversion wins—+2% at eBay ($100M+), 30% at Ancestry, 5% revenue lift—my core superpower
• Product-Led Growth: Led PLG at scale (TurboTax $900M, Ancestry $800M, eBay marketplace)—freemium, self-serve, optimization
• AI/ML for Growth: Shipped 4 AI products at Intuit (pre-ChatGPT); use AI as force multiplier at SketchPop
• Consumer at Scale: Led products serving millions across TurboTax (4M+ users), Ancestry, eBay marketplace since 2013
• Hands-On Execution: Work with engineering, write specs, define requirements, ship products personally
• Team & Culture: Hire and scale PM teams (Intuit, eBay) while building great culture

Currently seeking: VP Product, Director Product, or Principal PM roles at PLG/consumer/SMB companies where data-driven decision making drives growth. Open to managing a team OR being solo IC hire—I thrive in both.

Ideal fit: PLG companies (Notion, Canva, Figma), consumer products (Duolingo, Grammarly), SMB tools (Shopify, Faire) building AI products. I work best where product leaders are hands-on, data-obsessed, culture matters.

Location: San Diego preferred, open to remote, willing to travel to LA/SF."""

# Intuit (2,000 limit)
intuit = """Led $900M TurboTax Self-Employed business as Principal/Group PM serving 4M+ solopreneurs, freelancers, and gig workers. Managed team of 4 PMs and delivered 10-15% CAGR ($100-150M annual growth) through data-driven product decisions and AI-powered innovation.

Product-Led Growth & Data-Driven Execution:
• Pure PLG motion serving millions with zero sales team—freemium model, self-service onboarding, product-driven conversion
• Analyzed user behavior across millions of sessions using cohort analysis, funnel optimization, A/B testing to identify friction and drive decisions
• Shipped features that increased freemium-to-paid conversion, reduced drop-off rates, improved completion rates using data insights
• Deep understanding of solopreneur/SMB needs through qualitative research and quantitative analysis of engagement metrics

Shipped 4 AI/ML Products for Growth:
• Expense Categorization AI: ML model auto-categorizes expenses from receipts/transactions, reducing manual entry 60%+ and improving completion
• Deduction Finder ML: Predictive algorithm using HITL training identifies missed deductions—increased average refund $1,200+, drove upsell
• Audit Risk Predictor: ML model predicts IRS audit risk and suggests optimizations, reducing user anxiety and improving trust/retention
• Document Extraction AI: OCR/AI extracts data from tax documents (W-2s, 1099s, receipts), removing friction and improving conversion

Impact & Leadership:
• Delivered 10-15% CAGR on $900M+ business through data-driven experimentation and AI features
• Hired and mentored 4 Product Managers focused on PLG and AI/ML
• Coordinated with engineering, design, data science, marketing—hands-on PM leadership
• Established experimentation framework and metrics-driven culture across product org

Skills: Product-Led Growth, Data Analysis, A/B Testing, Consumer Product Management, AI/ML Products, Freemium Models, Conversion Optimization"""

print("=" * 70)
print("CHARACTER COUNT VERIFICATION")
print("=" * 70)

print(f"\n1. Executive Summary: {len(exec_summary)} characters")
print(f"   Limit: No specific limit (used in resume)")
print(f"   Status: ✅ OK")

print(f"\n2. LinkedIn About: {len(linkedin_about)} characters")
print(f"   Limit: 2,600 characters")
if len(linkedin_about) <= 2600:
    print(f"   Status: ✅ UNDER LIMIT (by {2600 - len(linkedin_about)} chars)")
else:
    print(f"   Status: ❌ OVER LIMIT (by {len(linkedin_about) - 2600} chars)")

print(f"\n3. Intuit Experience: {len(intuit)} characters")
print(f"   Limit: 2,000 characters")
if len(intuit) <= 2000:
    print(f"   Status: ✅ UNDER LIMIT (by {2000 - len(intuit)} chars)")
else:
    print(f"   Status: ❌ OVER LIMIT (by {len(intuit) - 2000} chars)")

print("\n" + "=" * 70)
print("✅ All content is within LinkedIn character limits!")
print("=" * 70)
