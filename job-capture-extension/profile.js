// User Profile - Complete background data for AI-generated responses and targeted resumes
// Update this with your own background for personalized answers

const USER_PROFILE = {
    name: "Luis Calderon",
    email: "luis@calderon.com",
    phone: "703.786.7899",
    location: "San Diego, CA",
    linkedin: "linkedin.com/in/luiscalderonmba",

    tagline: "Data-Driven Product Leader | PLG/Consumer/SMB Expert | AI/ML Pioneer",

    summary: "Data-Driven Product Leader—PLG/Consumer/SMB Expert. Turn user insights into growth through analytics, experimentation, and AI. Hands-on with RAG systems, vector databases, and knowledge graphs. Consumer product leader since 2013 across iconic brands: TurboTax ($900M, 4M+ users), Ancestry ($800M subscriptions), eBay (global marketplace). Now run SketchPop ($3M consumer e-commerce) as CPO.",

    // Full experience entries for resume
    experience: [
        {
            company: "Intuit",
            role: "Principal Product Manager (Group PM) - AI/ML Products",
            location: "Mountain View, CA",
            period: "2021 - 2024",
            description: "Led $900M TurboTax Self-Employed business as Principal/Group PM serving 4M+ solopreneurs. Managed team of 4 PMs and delivered 10-15% CAGR ($100-150M annual growth) through data-driven product decisions and AI-powered innovation.",
            highlights: [
                "Led $900M TurboTax Self-Employed business delivering 10-15% CAGR ($100-150M annual growth) through PLG strategy",
                "Shipped 4 AI/ML products to 4M+ users including Expense AI and Deduction Finder, increasing conversion 12%",
                "Built pure PLG motion with freemium model and self-service onboarding, eliminating need for sales team",
                "Drove product decisions through cohort analysis, A/B testing, and funnel optimization across millions of sessions",
                "Hired and mentored team of 4 PMs focused on AI/ML product development and experimentation"
            ],
            keywords: ["PLG", "AI/ML", "data-driven", "consumer", "freemium", "A/B testing", "team leadership"]
        },
        {
            company: "SketchPop LLC",
            role: "Chief Product Officer (CPO) - AI-Powered E-commerce",
            location: "San Diego, CA",
            period: "2024 - Present",
            description: "CPO of $3M consumer e-commerce (20% margins, 30-person team). Solo product leader plus marketing, operations, finance. Built advanced AI systems including dual-RAG architecture and knowledge graphs.",
            highlights: [
                "Scaled e-commerce business to $3M revenue with 20% margins through product-led improvements",
                "Architected dual-RAG chatbot with PostgreSQL vector search across product catalog and support knowledge base, improving customer resolution accuracy 25%",
                "Built dynamic email system with AI-generated personalized content, increasing open rates and driving repeat purchases",
                "Analyzed user funnels identifying drop-offs, shipped optimizations increasing checkout conversion 18%",
                "Built custom Shopify integrations automating order workflows and reducing manual processing 60%"
            ],
            keywords: ["e-commerce", "AI", "Shopify", "consumer", "LLM", "startup", "P&L", "RAG", "vector database"]
        },
        {
            company: "GrowthAlchemyLab",
            role: "Founder & Principal Consultant",
            location: "Remote",
            period: "2024 - Present",
            description: "Founded AI/ML product consulting practice advising consumer, e-commerce, and PLG companies on AI strategy and implementation. Hands-on with RAG systems, knowledge graphs, and LLM orchestration.",
            highlights: [
                "Advise consumer/PLG companies on AI strategy, delivering product roadmaps driving 30-50% cost reduction",
                "Built Neo4j-powered marketing knowledge management system enabling semantic search across campaigns, assets, and performance data",
                "Deployed RAG-based AI chatbots with vector databases for multiple clients, improving response accuracy 20-30%",
                "Architect AI agent frameworks with hands-on prompt engineering, LLM orchestration, and retrieval pipelines"
            ],
            keywords: ["AI consulting", "LLM", "strategy", "consumer", "e-commerce", "RAG", "Neo4j", "knowledge graph"]
        },
        {
            company: "Doctor.com",
            role: "Director of Product Management",
            location: "San Francisco Bay Area",
            period: "2017 - 2018",
            description: "Director of Product responsible for product analytics, publisher operations, and reporting platforms serving healthcare providers.",
            highlights: [
                "Launched personalized reporting platform increasing provider engagement 15% and improving retention",
                "Developed core analytics metrics, dashboards, and 2018 product OKRs defining reporting architecture",
                "Defined user personas and value propositions improving product messaging and feature prioritization",
                "Spearheaded enterprise-wide project integrating provider data with partners improving data accuracy"
            ],
            keywords: ["analytics", "reporting", "healthcare", "B2B", "data architecture", "engagement"]
        },
        {
            company: "Ancestry",
            role: "Director of Product Management - Growth",
            location: "San Francisco Bay Area",
            period: "2016 - 2017",
            description: "Director of Product for $800M consumer subscription business. Led acquisition, conversion, and growth initiatives.",
            highlights: [
                "Led mobile app conversion initiative achieving 30% lift in subscriptions through UX optimization",
                "Built abandon cart email campaign delivering 5% revenue lift on $800M subscription business",
                "Redesigned product shopping experience improving top-of-funnel conversion 22%",
                "Partnered with Finance, Product, Marketing to identify and prioritize growth opportunities"
            ],
            keywords: ["subscriptions", "mobile", "conversion", "growth", "consumer"]
        },
        {
            company: "Tile",
            role: "Growth Product Leader - Subscription Innovation",
            location: "San Francisco Bay Area",
            period: "2015 - 2016",
            description: "Growth product leader/advisor defining and launching innovative hardware-as-a-service subscription/renewal program for consumer IoT product.",
            highlights: [
                "Developed business case, financial model, and go-to-market strategy for hardware-as-a-service subscription program",
                "Defined market requirements, product requirements, and marketing plan for subscription launch",
                "Conducted extensive qualitative and quantitative A/B testing to optimize conversion",
                "Managed creative talent to develop packaging, product collateral, and marketing materials"
            ],
            keywords: ["subscriptions", "consumer hardware", "IoT", "growth", "A/B testing", "go-to-market"]
        },
        {
            company: "eBay Marketplaces",
            role: "Product Leader - Payments & Customer Connection",
            location: "San Francisco Bay Area",
            period: "2013 - 2015",
            description: "Product leader for eBay Payments (checkout, cart, installments) and Customer Connection serving massive consumer marketplace at scale.",
            highlights: [
                "Led checkout optimization achieving 2% conversion lift driving $100M+ incremental revenue",
                "Reduced checkout defects 33% through improved QA processes and cross-team collaboration",
                "Managed team of 6+ analysts supporting data-driven product releases at global scale",
                "Shipped payment features across mobile and web serving hundreds of millions of users"
            ],
            keywords: ["marketplace", "payments", "checkout", "conversion", "analytics", "team leadership"]
        },
        {
            company: "Epilogue Capital",
            role: "Managing Partner",
            location: "San Diego, CA",
            period: "2018 - Present",
            description: "Founded investment firm focused on acquiring and operating profitable consumer/SMB businesses.",
            highlights: [
                "Acquired and scaled SketchPop to $3M revenue achieving 20% margins through operational excellence",
                "Provide hands-on product leadership for portfolio companies driving growth through data and AI",
                "Identify acquisition targets where product improvements and AI integration unlock value"
            ],
            keywords: ["M&A", "operations", "P&L", "consumer", "SMB"]
        }
    ],

    education: [
        {
            degree: "MBA & MS (Dual Degree)",
            school: "University of Michigan - Ross School of Business",
            year: "2011",
            details: "GMAT: 720 (Top 4%) | Focus: Strategy, Product Management, Technology"
        },
        {
            degree: "BS Electrical Engineering",
            school: "University of Virginia",
            year: "2003",
            details: ""
        }
    ],

    skills: {
        "AI & Machine Learning": [
            "AI/ML Product Management",
            "Large Language Models (LLMs)",
            "RAG Architecture & Vector Search",
            "Prompt Engineering",
            "GPT-4 / Claude / Gemini",
            "AI Agent Architecture",
            "Knowledge Graphs (Neo4j)"
        ],
        "Product Management": [
            "Product-Led Growth (PLG)",
            "Data-Driven Decision Making",
            "A/B Testing & Experimentation",
            "User Research",
            "Agile / Scrum",
            "0-to-1 Product Development"
        ],
        "Data & Analytics": [
            "SQL & Data Querying",
            "Funnel Analysis",
            "Cohort Analysis",
            "Metrics & KPI Development",
            "Customer Analytics"
        ],
        "Leadership": [
            "Team Building & Mentorship",
            "Cross-functional Leadership",
            "Stakeholder Management",
            "P&L Management"
        ]
    },

    achievements: [
        "Led $900M business delivering 10-15% CAGR through PLG and AI/ML innovation",
        "Shipped 4 AI/ML products to 4M+ users before ChatGPT era (2021-2024)",
        "Built dual-RAG chatbot with PostgreSQL vector search, improving resolution accuracy 25%",
        "Architected Neo4j knowledge graph for marketing intelligence and semantic search",
        "Drove 2% checkout conversion lift generating $100M+ revenue at eBay",
        "Increased mobile subscriptions 30% through UX optimization at Ancestry"
    ],

    targetRoles: [
        "VP of Product",
        "Director of Product",
        "Principal Product Manager",
        "Head of Product (AI/ML)",
        "Group Product Manager"
    ],

    whyAI: "Shipped AI/ML products at Intuit 2021-2024 BEFORE ChatGPT hype, now hands-on with RAG architectures (dual vector databases on PostgreSQL), knowledge graphs (Neo4j), and LLM orchestration—rare combination bridging traditional ML + cutting-edge AI implementation."
};

// Helper to get relevant experience for a role
function getRelevantExperience(jobDescription) {
    const desc = jobDescription.toLowerCase();
    let relevant = [];

    USER_PROFILE.experience.forEach(exp => {
        const matchScore = exp.keywords.filter(kw => desc.includes(kw.toLowerCase())).length;
        if (matchScore > 0) {
            relevant.push({
                ...exp,
                matchScore
            });
        }
    });

    // Sort by match score and return top highlights
    relevant.sort((a, b) => b.matchScore - a.matchScore);

    if (relevant.length > 0) {
        return relevant.slice(0, 3).flatMap(exp =>
            exp.highlights.slice(0, 2).map(h => `${exp.company}: ${h}`)
        );
    }

    return [USER_PROFILE.summary];
}

// Get experiences sorted by relevance to job description
function getRelevantExperiencesFull(jobDescription) {
    const desc = jobDescription.toLowerCase();

    return USER_PROFILE.experience.map(exp => {
        const matchScore = exp.keywords.filter(kw => desc.includes(kw.toLowerCase())).length;
        return { ...exp, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
}

// Get top skills relevant to job
function getRelevantSkills(jobDescription) {
    const desc = jobDescription.toLowerCase();
    let relevantSkills = [];

    Object.entries(USER_PROFILE.skills).forEach(([category, skills]) => {
        skills.forEach(skill => {
            if (desc.includes(skill.toLowerCase()) ||
                skill.toLowerCase().split(' ').some(word => desc.includes(word))) {
                relevantSkills.push(skill);
            }
        });
    });

    // If few matches, include core skills
    if (relevantSkills.length < 6) {
        relevantSkills = [
            ...relevantSkills,
            "Product-Led Growth (PLG)",
            "Data-Driven Decision Making",
            "A/B Testing & Experimentation",
            "AI/ML Product Management",
            "Cross-functional Leadership"
        ];
    }

    return [...new Set(relevantSkills)].slice(0, 12);
}
