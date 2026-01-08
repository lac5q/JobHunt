# Complete Resume Code - Ready to Paste

This file contains ALL the code sections you need to update your resume with toggles, new experiences, and updated Executive Summary/About Me.

---

## PART 0: UPDATED EXECUTIVE SUMMARY & ABOUT ME (Replace existing text)

### Executive Summary Section - Replace entire highlight-box content:

```html
                    <div class="highlight-box">
                        <p style="margin-bottom: 15px;"><strong>Data-Driven Product Leader—PLG/Consumer/SMB Expert.</strong> Turn user insights into growth through analytics, experimentation, and AI. Equally comfortable managing teams OR being hands-on IC.</p>

                        <p style="margin-bottom: 15px;"><strong>Consumer product leader since 2013</strong> across iconic brands: TurboTax ($900M, 4M+ users), Ancestry ($800M subscriptions), eBay (global marketplace). Now run SketchPop - CPO. <strong>Core superpower: data-driven decision making</strong>—analyze user behavior, run experiments, use insights to ship features that drive conversion and retention. Distinguished by shipping AI/ML products BEFORE ChatGPT hype, then rapidly adopting modern LLMs. Rare combination of:</p>

                        <ul style="margin-left: 20px;">
                            <li><strong>Data-Driven Decision Making:</strong> Analyze user behavior across millions of sessions, run A/B tests, use cohort analysis and funnel optimization to prioritize ruthlessly—my core superpower. Track record: +2% checkout conversion at eBay ($100M+ lift), 30% mobile conversion lift at Ancestry, 5% revenue lift from abandon cart</li>
                            <li><strong>Product-Led Growth:</strong> Led $900M PLG business at Intuit with zero sales team—freemium models, self-serve onboarding, conversion optimization. Also led growth initiatives at Ancestry ($800M subscriptions) and eBay marketplace</li>
                            <li><strong>Consumer/SMB at Scale:</strong> Served 4M+ solopreneurs at TurboTax, millions of consumers at Ancestry and eBay—understand consumer behavior, retention, engagement metrics deeply across multiple product types</li>
                            <li><strong>AI/ML for Growth:</strong> Shipped 4 AI products to reduce friction and drive conversion at Intuit (pre-ChatGPT), deployed modern LLMs at SketchPop (40% cost reduction)</li>
                            <li><strong>Multi-Scale Experience:</strong> $900M enterprise (Intuit) → $800M consumer subscriptions (Ancestry) → Global marketplace (eBay) → $3M SMB (SketchPop)</li>
                        </ul>

                        <p style="margin-top: 15px;"><strong>Seeking:</strong> VP Product, Director Product, or Principal PM roles at PLG/consumer/SMB companies (Notion, Canva, Figma, Duolingo, Shopify) where data-driven decision making drives growth. Equally comfortable managing a team OR being the solo IC product hire—I thrive in both.</p>
                    </div>
```

### About Me Section - Replace all paragraphs:

```html
                    <p style="margin-bottom: 15px;">I'm a data-driven product leader who turns user insights into growth. Equally comfortable managing a team OR being the solo IC product hire. <strong>Consumer product leader since 2013</strong> across TurboTax, Ancestry, eBay—deep AI/ML expertise, proven conversion optimization.</p>

                    <p style="margin-bottom: 15px;">At Intuit, I led the $900M TurboTax Self-Employed business as Principal/Group PM serving 4M+ solopreneurs, freelancers, gig workers. Managed 4 PMs while staying hands-on—drove 10-15% CAGR ($100-150M annual growth) through data-driven decisions, A/B testing, and shipped 4 AI/ML products that reduced friction and improved conversion.</p>

                    <p style="margin-bottom: 15px;"><strong>My superpower: using data analysis to make the right product calls.</strong> At TurboTax, analyzed user behavior across millions of sessions to identify drop-offs, then shipped AI features that increased completion rates. At Ancestry, led growth initiatives achieving 30% mobile conversion lift and 5% revenue boost from abandon cart. At eBay, drove $100M+ business lift through 2% checkout optimization. Pure PLG motion—no sales team, self-serve at scale.</p>

                    <p style="margin-bottom: 15px;">As CPO of SketchPop ($3M consumer e-commerce, 20% margins), I wear many hats: solo product leader working with engineers, plus marketing, operations, finance. Acquired through Epilogue Capital (my investment firm focused on consumer/SMB businesses). Use AI as decision-making partner—design experiences, automate tasks, optimize funnels. I write specs, analyze data, work with engineers daily, ship fast.</p>

                    <p style="margin-bottom: 15px;">I thrive in both leadership and IC roles. Led product teams at Intuit (4 PMs) and eBay (6+ analysts), now solo product leader at SketchPop—what matters is shipping great products and building great culture.</p>

                    <p style="margin-bottom: 15px;"><strong>What I bring:</strong></p>
                    <ul style="margin-left: 20px; margin-bottom: 15px;">
                        <li><strong>Data-Driven Decision Making:</strong> Track record of conversion wins—+2% at eBay ($100M+), 30% at Ancestry, 5% revenue lift—my core superpower</li>
                        <li><strong>Product-Led Growth:</strong> Led PLG at scale (TurboTax $900M, Ancestry $800M, eBay marketplace)—freemium, self-serve, optimization</li>
                        <li><strong>AI/ML for Growth:</strong> Shipped 4 AI products at Intuit (pre-ChatGPT); use AI as force multiplier at SketchPop</li>
                        <li><strong>Consumer at Scale:</strong> Led products serving millions across TurboTax (4M+ users), Ancestry, eBay marketplace since 2013</li>
                        <li><strong>Hands-On Execution:</strong> Work with engineering, write specs, define requirements, ship products personally</li>
                        <li><strong>Team & Culture:</strong> Hire and scale PM teams (Intuit, eBay) while building great culture</li>
                    </ul>

                    <p style="margin-bottom: 15px;"><strong>Currently seeking:</strong> VP Product, Director Product, or Principal PM roles at PLG/consumer/SMB companies where data-driven decision making drives growth. Open to managing a team OR being solo IC hire—I thrive in both.</p>

                    <p style="margin-bottom: 15px;"><strong>Ideal fit:</strong> PLG companies (Notion, Canva, Figma), consumer products (Duolingo, Grammarly), SMB tools (Shopify, Faire) building AI products. I work best where product leaders are hands-on, data-obsessed, culture matters.</p>

                    <p><strong>Location:</strong> San Diego preferred, open to remote, willing to travel to LA/SF.</p>
```

---

## PART 1: CSS TO ADD (Insert before `</style>` tag)

Search for the `</style>` closing tag in resume.html and add this CSS RIGHT BEFORE it:

```css
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
```

---

## PART 2: TOGGLE CONTROL PANEL (Insert after `<h2>Professional Experience</h2>`)

Find the line with `<h2>Professional Experience</h2>` and add this RIGHT AFTER the section-header div closes:

```html
                    <!-- EXPERIENCE TOGGLES -->
                    <div class="toggle-section">
                        <h3>📋 Select Experiences to Include on Resume</h3>
                        <div class="toggle-controls">
                            <button onclick="toggleAllExperiences(true)">✅ Select All</button>
                            <button onclick="toggleAllExperiences(false)">❌ Deselect All</button>
                            <button onclick="toggleRecommended()">⭐ Recommended Only</button>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-intuit')">
                                <input type="checkbox" id="toggle-intuit" checked onchange="toggleExperience('intuit-experience', this.checked)">
                                <label for="toggle-intuit">⭐ Intuit (2021-2024)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-sketchpop')">
                                <input type="checkbox" id="toggle-sketchpop" checked onchange="toggleExperience('sketchpop-experience', this.checked)">
                                <label for="toggle-sketchpop">⭐ SketchPop (Current)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-growthalchemylab')">
                                <input type="checkbox" id="toggle-growthalchemylab" checked onchange="toggleExperience('growthalchemylab-experience', this.checked)">
                                <label for="toggle-growthalchemylab">⭐ GrowthAlchemyLab (Current)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-epilogue')">
                                <input type="checkbox" id="toggle-epilogue" checked onchange="toggleExperience('epilogue-experience', this.checked)">
                                <label for="toggle-epilogue">⭐ Epilogue Capital (2018-Present)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-ancestry')">
                                <input type="checkbox" id="toggle-ancestry" checked onchange="toggleExperience('ancestry-experience', this.checked)">
                                <label for="toggle-ancestry">⭐ Ancestry (2016-2017)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-ebay')">
                                <input type="checkbox" id="toggle-ebay" checked onchange="toggleExperience('ebay-experience', this.checked)">
                                <label for="toggle-ebay">⭐ eBay (2013-2015)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-doctorcom')">
                                <input type="checkbox" id="toggle-doctorcom" onchange="toggleExperience('doctorcom-experience', this.checked)">
                                <label for="toggle-doctorcom">Doctor.com (2017-2018)</label>
                            </div>

                            <div class="experience-toggle" onclick="toggleCheckbox('toggle-tile')">
                                <input type="checkbox" id="toggle-tile" onchange="toggleExperience('tile-experience', this.checked)">
                                <label for="toggle-tile">Tile (2015-2016)</label>
                            </div>
                        </div>
                    </div>
```

---

## PART 3: NEW EXPERIENCE SECTIONS (Insert after GrowthAlchemyLab experience)

Add these 5 new experience sections after the `</div>` that closes the GrowthAlchemyLab experience:

```html
                    <!-- Epilogue Capital -->
                    <div class="experience-item" id="epilogue-experience">
                        <div class="experience-header">
                            <div class="experience-title">
                                <h3>Managing Partner</h3>
                                <div class="company">Epilogue Capital</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button class="copy-section-btn" onclick="copyLinkedInFormat('epilogue', this)" title="LinkedIn-optimized format">💼 LinkedIn</button>
                                <button class="copy-section-btn" onclick="copySectionToClipboard('epilogue-experience', this)">📋 Copy</button>
                                <div class="date">2018 - Present | San Diego, CA</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 10px; font-style: italic; color: #667eea;">Founded investment firm focused on acquiring and operating profitable consumer/SMB businesses. Hands-on operator approach combining product leadership with business management.</p>

                        <strong>Portfolio Management & Operations:</strong>
                        <ul>
                            <li><strong>SketchPop Acquisition & Growth:</strong> Acquired custom art e-commerce business, scaled to $3M revenue with 20% margins through AI-powered product innovation and operational improvements</li>
                            <li><strong>Data-Driven Investment Thesis:</strong> Focus on consumer/SMB businesses with strong unit economics where product improvements and AI can drive growth</li>
                            <li><strong>Hands-On Product Leadership:</strong> Act as product leader/CEO for portfolio companies, applying product management expertise to drive growth</li>
                            <li><strong>Operational Improvements:</strong> Implement data analytics, AI automation, conversion optimization, retention strategies across portfolio companies</li>
                        </ul>

                        <p style="margin-top: 10px;"><strong>Skills:</strong> M&A, Business Operations, Product Strategy, Consumer/SMB Expertise, P&L Management, Growth Strategy</p>
                    </div>

                    <!-- Ancestry -->
                    <div class="experience-item" id="ancestry-experience">
                        <div class="experience-header">
                            <div class="experience-title">
                                <h3>Director of Product Management - Growth</h3>
                                <div class="company">Ancestry</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button class="copy-section-btn" onclick="copyLinkedInFormat('ancestry', this)" title="LinkedIn-optimized format">💼 LinkedIn</button>
                                <button class="copy-section-btn" onclick="copySectionToClipboard('ancestry-experience', this)">📋 Copy</button>
                                <div class="date">2016 - 2017 | San Francisco Bay Area</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 10px; font-style: italic; color: #667eea;">Director of Product for $800M consumer subscription business. Led acquisition, conversion, and growth initiatives for top-of-funnel product experiences and shopping cart optimization.</p>

                        <strong>Product-Led Growth & Conversion Optimization:</strong>
                        <ul>
                            <li><strong>Abandon Cart Feature:</strong> Built, tested, and rolled out abandon cart email campaign resulting in 5% revenue lift—data-driven approach to win-back users</li>
                            <li><strong>Mobile Conversion Optimization:</strong> Led mobile app conversion initiative achieving 30% lift in mobile app subscriptions through improved onboarding flow and checkout experience</li>
                            <li><strong>Shopping Experience Innovation:</strong> Designed and shipped new product shopping experiences that improved top-of-funnel conversion and customer acquisition</li>
                            <li><strong>Customer Journey Mapping:</strong> Launched customer advocacy initiative documenting end-to-end journey with key metrics and pricing across product experience</li>
                        </ul>

                        <strong>Cross-Functional Leadership:</strong>
                        <ul>
                            <li>Collaborated with Finance, Product, Marketing, Member Services to identify growth opportunities and address friction points</li>
                            <li>Defined go-to-market strategy and coordinated integrated marketing planning for subscription business</li>
                            <li>Used data analysis and A/B testing to optimize conversion funnel and maximize subscription revenue</li>
                        </ul>

                        <p style="margin-top: 10px;"><strong>Skills:</strong> Consumer Subscriptions, Conversion Optimization, Mobile Product Management, Growth Strategy, A/B Testing, Product-Led Growth</p>
                    </div>

                    <!-- eBay -->
                    <div class="experience-item" id="ebay-experience">
                        <div class="experience-header">
                            <div class="experience-title">
                                <h3>Product Leader - Payments & Customer Connection</h3>
                                <div class="company">eBay Marketplaces</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button class="copy-section-btn" onclick="copyLinkedInFormat('ebay', this)" title="LinkedIn-optimized format">💼 LinkedIn</button>
                                <button class="copy-section-btn" onclick="copySectionToClipboard('ebay-experience', this)">📋 Copy</button>
                                <div class="date">2013 - 2015 | San Francisco Bay Area</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 10px; font-style: italic; color: #667eea;">Product leader for eBay Payments (checkout, cart, installments) and Customer Connection (My eBay, sign-in, registration) serving massive consumer marketplace at scale.</p>

                        <strong>Consumer Marketplace at Scale:</strong>
                        <ul>
                            <li><strong>Conversion Optimization:</strong> Led checkout optimization initiatives achieving +2% checkout conversion improvement—drove $100M+ business lift through data-driven improvements</li>
                            <li><strong>Operational Excellence:</strong> Reduced checkout defects by 33% through improved quality processes and user experience testing</li>
                            <li><strong>Mobile & Site Experiences:</strong> Shipped features across mobile and web platforms serving millions of buyers in global marketplace</li>
                            <li><strong>Customer Satisfaction:</strong> Improved NPS scores through better payment experiences and customer registration flows</li>
                        </ul>

                        <strong>Data-Driven Product Analytics Leadership:</strong>
                        <ul>
                            <li><strong>Global Payments Analytics:</strong> Led analytics team providing strategic insights for checkout/cart product decisions—conducted A/B tests, analyzed data, delivered actionable findings</li>
                            <li><strong>Team Leadership:</strong> Managed team of 6+ analysts and managers supporting product releases and optimization initiatives</li>
                            <li><strong>Metrics & KPIs:</strong> Recommended, tracked, and advised on key business and product metrics for payments and checkout experiences</li>
                            <li><strong>Cross-Functional Collaboration:</strong> Partnered with product management, development, and business units to ensure timely releases and achieve business objectives</li>
                        </ul>

                        <p style="margin-top: 10px;"><strong>Skills:</strong> Consumer Marketplaces, E-commerce, Payments, Checkout Optimization, Data Analytics, Team Leadership, A/B Testing, Conversion Funnels</p>
                    </div>

                    <!-- Doctor.com -->
                    <div class="experience-item hidden" id="doctorcom-experience">
                        <div class="experience-header">
                            <div class="experience-title">
                                <h3>Director of Product Management</h3>
                                <div class="company">Doctor.com</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button class="copy-section-btn" onclick="copyLinkedInFormat('doctorcom', this)" title="LinkedIn-optimized format">💼 LinkedIn</button>
                                <button class="copy-section-btn" onclick="copySectionToClipboard('doctorcom-experience', this)">📋 Copy</button>
                                <div class="date">2017 - 2018 | San Francisco Bay Area</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 10px; font-style: italic; color: #667eea;">Director of Product responsible for product analytics, publisher operations, and reporting platforms serving healthcare providers.</p>

                        <strong>Product Analytics & Reporting:</strong>
                        <ul>
                            <li><strong>Provider Engagement Platform:</strong> Conceptualized, designed, and launched personalized reporting platform increasing engagement 15% and improving retention</li>
                            <li><strong>Analytics Infrastructure:</strong> Developed core analytics metrics, dashboards, and 2018 product OKRs—defined reporting architecture and mentored analysts</li>
                            <li><strong>Product Strategy:</strong> Defined user personas and value propositions to improve product messaging and feature prioritization</li>
                            <li><strong>Enterprise Integration:</strong> Spearheaded enterprise-wide project integrating provider data with partners—improved data accuracy and insights</li>
                        </ul>

                        <p style="margin-top: 10px;"><strong>Skills:</strong> Product Analytics, Reporting Platforms, Healthcare Technology, Data Architecture, Team Leadership</p>
                    </div>

                    <!-- Tile -->
                    <div class="experience-item hidden" id="tile-experience">
                        <div class="experience-header">
                            <div class="experience-title">
                                <h3>Growth Product Leader - Subscription Innovation</h3>
                                <div class="company">Tile</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button class="copy-section-btn" onclick="copyLinkedInFormat('tile', this)" title="LinkedIn-optimized format">💼 LinkedIn</button>
                                <button class="copy-section-btn" onclick="copySectionToClipboard('tile-experience', this)">📋 Copy</button>
                                <div class="date">2015 - 2016 | San Francisco Bay Area</div>
                            </div>
                        </div>
                        <p style="margin-bottom: 10px; font-style: italic; color: #667eea;">Growth product leader/advisor defining and launching innovative hardware-as-a-service subscription/renewal program for consumer IoT product.</p>

                        <strong>Subscription Business Model Innovation:</strong>
                        <ul>
                            <li><strong>Business Case & Strategy:</strong> Developed business case, financial model, and go-to-market strategy for hardware-as-a-service subscription program</li>
                            <li><strong>Product & Marketing:</strong> Defined market requirements, product requirements, marketing plan, and communications calendar for subscription launch</li>
                            <li><strong>Customer Insights:</strong> Conducted extensive qualitative and quantitative A/B testing to gather customer insights and optimize conversion</li>
                            <li><strong>Creative Management:</strong> Managed creative talent to develop packaging, product collateral, and marketing materials</li>
                        </ul>

                        <p style="margin-top: 10px;"><strong>Skills:</strong> Consumer Hardware, Subscription Business Models, Growth Strategy, A/B Testing, Go-to-Market Planning</p>
                    </div>
```

---

## PART 4: JAVASCRIPT FUNCTIONS (Add inside the `<script>` tag)

Find the `copyLinkedInFormat()` function and **REPLACE** the existing 'executive-summary' and 'linkedin-about' cases, then add the new experience cases BEFORE the final `}` of that function:

### UPDATE Executive Summary and LinkedIn About cases:

```javascript
            if (jobType === 'executive-summary') {
                text = `Data-Driven Product Leader—PLG/Consumer/SMB Expert. Turn user insights into growth through analytics, experimentation, and AI. Equally comfortable managing teams OR being hands-on IC.

Consumer product leader since 2013 across iconic brands: TurboTax ($900M, 4M+ users), Ancestry ($800M subscriptions), eBay (global marketplace). Now run SketchPop - CPO. Core superpower: data-driven decision making—analyze user behavior, run experiments, use insights to ship features that drive conversion and retention. Distinguished by shipping AI/ML products BEFORE ChatGPT hype, then rapidly adopting modern LLMs. Rare combination of:

• Data-Driven Decision Making: Analyze user behavior across millions of sessions, run A/B tests, use cohort analysis and funnel optimization to prioritize ruthlessly—my core superpower. Track record: +2% checkout conversion at eBay ($100M+ lift), 30% mobile conversion lift at Ancestry, 5% revenue lift from abandon cart
• Product-Led Growth: Led $900M PLG business at Intuit with zero sales team—freemium models, self-serve onboarding, conversion optimization. Also led growth initiatives at Ancestry ($800M subscriptions) and eBay marketplace
• Consumer/SMB at Scale: Served 4M+ solopreneurs at TurboTax, millions of consumers at Ancestry and eBay—understand consumer behavior, retention, engagement metrics deeply across multiple product types
• AI/ML for Growth: Shipped 4 AI products to reduce friction and drive conversion at Intuit (pre-ChatGPT), deployed modern LLMs at SketchPop (40% cost reduction)
• Multi-Scale Experience: $900M enterprise (Intuit) → $800M consumer subscriptions (Ancestry) → Global marketplace (eBay) → $3M SMB (SketchPop)

Seeking: VP Product, Director Product, or Principal PM roles at PLG/consumer/SMB companies (Notion, Canva, Figma, Duolingo, Shopify) where data-driven decision making drives growth. Equally comfortable managing a team OR being the solo IC product hire—I thrive in both.`;
            } else if (jobType === 'linkedin-about') {
                text = `I'm a data-driven product leader who turns user insights into growth. Equally comfortable managing a team OR being the solo IC product hire. Consumer product leader since 2013 across TurboTax, Ancestry, eBay—deep AI/ML expertise, proven conversion optimization.

At Intuit, I led the $900M TurboTax Self-Employed business as Principal/Group PM serving 4M+ solopreneurs, freelancers, gig workers. Managed 4 PMs while staying hands-on—drove 10-15% CAGR ($100-150M annual growth) through data-driven decisions, A/B testing, and shipped 4 AI/ML products that reduced friction and improved conversion.

My superpower: using data analysis to make the right product calls. At TurboTax, analyzed user behavior across millions of sessions to identify drop-offs, then shipped AI features that increased completion rates. At Ancestry, led growth initiatives achieving 30% mobile conversion lift and 5% revenue boost from abandon cart. At eBay, drove $100M+ business lift through 2% checkout optimization. Pure PLG motion—no sales team, self-serve at scale.

As CPO of SketchPop ($3M consumer e-commerce, 20% margins), I wear many hats: solo product leader working with engineers, plus marketing, operations, finance. Acquired through Epilogue Capital (my investment firm focused on consumer/SMB businesses). Use AI as decision-making partner—design experiences, automate tasks, optimize funnels. I write specs, analyze data, work with engineers daily, ship fast.

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

Location: San Diego preferred, open to remote, willing to travel to LA/SF.`;
```

### ADD New Experience cases:

```javascript
            } else if (jobType === 'epilogue') {
                text = `Founded investment firm focused on acquiring and operating profitable consumer/SMB businesses. Hands-on operator approach combining product leadership with business management.

Portfolio Management & Operations:
• SketchPop Acquisition & Growth: Acquired custom art e-commerce business, scaled to $3M revenue with 20% margins through AI-powered product innovation and operational improvements
• Data-Driven Investment Thesis: Focus on consumer/SMB businesses with strong unit economics where product improvements and AI can drive growth
• Hands-On Product Leadership: Act as product leader/CEO for portfolio companies, applying product management expertise to drive growth
• Operational Improvements: Implement data analytics, AI automation, conversion optimization, retention strategies across portfolio companies

Skills: M&A, Business Operations, Product Strategy, Consumer/SMB Expertise, P&L Management, Growth Strategy`;
            } else if (jobType === 'ancestry') {
                text = `Director of Product for $800M consumer subscription business. Led acquisition, conversion, and growth initiatives for top-of-funnel product experiences and shopping cart optimization.

Product-Led Growth & Conversion Optimization:
• Abandon Cart Feature: Built, tested, and rolled out abandon cart email campaign resulting in 5% revenue lift—data-driven approach to win-back users
• Mobile Conversion Optimization: Led mobile app conversion initiative achieving 30% lift in mobile app subscriptions through improved onboarding flow and checkout experience
• Shopping Experience Innovation: Designed and shipped new product shopping experiences that improved top-of-funnel conversion and customer acquisition
• Customer Journey Mapping: Launched customer advocacy initiative documenting end-to-end journey with key metrics and pricing across product experience

Cross-Functional Leadership:
• Collaborated with Finance, Product, Marketing, Member Services to identify growth opportunities and address friction points
• Defined go-to-market strategy and coordinated integrated marketing planning for subscription business
• Used data analysis and A/B testing to optimize conversion funnel and maximize subscription revenue

Skills: Consumer Subscriptions, Conversion Optimization, Mobile Product Management, Growth Strategy, A/B Testing, Product-Led Growth`;
            } else if (jobType === 'ebay') {
                text = `Product leader for eBay Payments (checkout, cart, installments) and Customer Connection (My eBay, sign-in, registration) serving massive consumer marketplace at scale.

Consumer Marketplace at Scale:
• Conversion Optimization: Led checkout optimization initiatives achieving +2% checkout conversion improvement—drove $100M+ business lift through data-driven improvements
• Operational Excellence: Reduced checkout defects by 33% through improved quality processes and user experience testing
• Mobile & Site Experiences: Shipped features across mobile and web platforms serving millions of buyers in global marketplace
• Customer Satisfaction: Improved NPS scores through better payment experiences and customer registration flows

Data-Driven Product Analytics Leadership:
• Global Payments Analytics: Led analytics team providing strategic insights for checkout/cart product decisions—conducted A/B tests, analyzed data, delivered actionable findings
• Team Leadership: Managed team of 6+ analysts and managers supporting product releases and optimization initiatives
• Metrics & KPIs: Recommended, tracked, and advised on key business and product metrics for payments and checkout experiences
• Cross-Functional Collaboration: Partnered with product management, development, and business units to ensure timely releases and achieve business objectives

Skills: Consumer Marketplaces, E-commerce, Payments, Checkout Optimization, Data Analytics, Team Leadership, A/B Testing, Conversion Funnels`;
            } else if (jobType === 'doctorcom') {
                text = `Director of Product responsible for product analytics, publisher operations, and reporting platforms serving healthcare providers.

Product Analytics & Reporting:
• Provider Engagement Platform: Conceptualized, designed, and launched personalized reporting platform increasing engagement 15% and improving retention
• Analytics Infrastructure: Developed core analytics metrics, dashboards, and 2018 product OKRs—defined reporting architecture and mentored analysts
• Product Strategy: Defined user personas and value propositions to improve product messaging and feature prioritization
• Enterprise Integration: Spearheaded enterprise-wide project integrating provider data with partners—improved data accuracy and insights

Skills: Product Analytics, Reporting Platforms, Healthcare Technology, Data Architecture, Team Leadership`;
            } else if (jobType === 'tile') {
                text = `Growth product leader/advisor defining and launching innovative hardware-as-a-service subscription/renewal program for consumer IoT product.

Subscription Business Model Innovation:
• Business Case & Strategy: Developed business case, financial model, and go-to-market strategy for hardware-as-a-service subscription program
• Product & Marketing: Defined market requirements, product requirements, marketing plan, and communications calendar for subscription launch
• Customer Insights: Conducted extensive qualitative and quantitative A/B testing to gather customer insights and optimize conversion
• Creative Management: Managed creative talent to develop packaging, product collateral, and marketing materials

Skills: Consumer Hardware, Subscription Business Models, Growth Strategy, A/B Testing, Go-to-Market Planning`;
```

Then add these NEW FUNCTIONS at the end of the `<script>` section, before the closing `</script>` tag:

```javascript
        function toggleExperience(experienceId, isChecked) {
            const element = document.getElementById(experienceId);
            if (element) {
                if (isChecked) {
                    element.classList.remove('hidden');
                } else {
                    element.classList.add('hidden');
                }
            }
        }

        function toggleCheckbox(checkboxId) {
            const checkbox = document.getElementById(checkboxId);
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        }

        function toggleAllExperiences(checked) {
            const checkboxes = document.querySelectorAll('.experience-toggle input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = checked;
                cb.dispatchEvent(new Event('change'));
            });
        }

        function toggleRecommended() {
            // Recommended experiences (⭐)
            const recommended = ['toggle-intuit', 'toggle-sketchpop', 'toggle-growthalchemylab',
                               'toggle-epilogue', 'toggle-ancestry', 'toggle-ebay'];

            const allCheckboxes = document.querySelectorAll('.experience-toggle input[type="checkbox"]');
            allCheckboxes.forEach(cb => {
                cb.checked = recommended.includes(cb.id);
                cb.dispatchEvent(new Event('change'));
            });
        }
```

Also update the `copySectionToClipboard()` function - add these lines at the beginning, right after the `const clone = section.cloneNode(true);` line:

```javascript
            // Remove hidden experience items
            const hiddenItems = clone.querySelectorAll('.experience-item.hidden');
            hiddenItems.forEach(item => item.remove());

            // Remove toggle section if copying experience section
            const toggleSection = clone.querySelector('.toggle-section');
            if (toggleSection) toggleSection.remove();
```

---

## 🎯 QUICK ASSEMBLY INSTRUCTIONS:

1. Open `/Users/lcalderon/JobHunt/resume-backup.html` in text editor
2. Save as `/Users/lcalderon/JobHunt/resume.html`
3. Add PART 1 (CSS) before `</style>`
4. Add PART 2 (Toggle controls) after Professional Experience header
5. Add PART 3 (5 new experiences) after GrowthAlchemyLab experience
6. Add PART 4 (JavaScript) - add cases to copyLinkedInFormat() + add new functions
7. Save and test in browser

---

All done! Your resume will now have toggleable experiences with LinkedIn copy buttons for all 8 positions.
