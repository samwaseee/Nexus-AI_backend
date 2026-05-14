const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.model";
import Gig from "../models/Gig.model";
import Review from "../models/Review.model";
import BlogPost from "../models/BlogPost.model";
import Dispute from "../models/Dispute.model";
import Order from "../models/Order.model";

dotenv.config();


const MONGO_URI = process.env.MONGO_URI!;

async function seed() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Gig.deleteMany({}),
      Review.deleteMany({}),
      BlogPost.deleteMany({}),
      Dispute.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // ─── Create Users ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash("Demo@1234", 12);

    const [admin, client, ...freelancers] = await User.insertMany([
      {
        name: "Alex Admin",
        email: "admin@nexusai.com",
        password: hashedPassword,
        role: "admin",
        provider: "local",
        isVerified: true,
        isActive: true,
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=admin",
        headline: "Platform Administrator",
        bio: "Managing the NexusAI platform to ensure the best experience for all users.",
        skills: ["Platform Management", "User Support"],
      },
      {
        name: "Chris Client",
        email: "client@nexusai.com",
        password: hashedPassword,
        role: "client",
        provider: "local",
        isVerified: true,
        isActive: true,
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=client",
        headline: "Tech Startup Founder",
        bio: "Building the next generation of SaaS products. Always looking for top talent.",
        location: "San Francisco, CA",
      },
      {
        name: "Sarah Developer",
        email: "user@nexusai.com",
        password: hashedPassword,
        role: "freelancer",
        provider: "local",
        isVerified: true,
        isActive: true,
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=sarah",
        headline: "Full-Stack Developer | React & Node.js Expert",
        bio: "5+ years building scalable web applications. Passionate about clean code and great UX.",
        skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
        hourlyRate: 75,
        availability: "available",
        location: "Remote",
        portfolioUrl: "https://sarahdev.example.com",
        linkedinUrl: "https://linkedin.com/in/sarahdev",
      },
      {
        name: "Marcus Designer",
        email: "marcus@nexusai.com",
        password: hashedPassword,
        role: "freelancer",
        provider: "local",
        isVerified: true,
        isActive: true,
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=marcus",
        headline: "UI/UX Designer | Product Design Specialist",
        bio: "Crafting beautiful and intuitive digital experiences for 6+ years. Figma expert.",
        skills: ["Figma", "UI Design", "UX Research", "Prototyping", "TailwindCSS"],
        hourlyRate: 85,
        availability: "available",
        location: "Remote",
      },
      {
        name: "Priya DataSci",
        email: "priya@nexusai.com",
        password: hashedPassword,
        role: "freelancer",
        provider: "local",
        isVerified: true,
        isActive: true,
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=priya",
        headline: "Data Scientist | ML Engineer",
        bio: "Turning raw data into actionable business insights. Python, TensorFlow, and AWS certified.",
        skills: ["Python", "Machine Learning", "TensorFlow", "AWS", "PostgreSQL"],
        hourlyRate: 95,
        availability: "available",
        location: "Remote",
      },
      {
        name: "Jake DevOps",
        email: "jake@nexusai.com",
        password: hashedPassword,
        role: "freelancer",
        provider: "local",
        isVerified: true,
        isActive: true,
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=jake",
        headline: "DevOps Engineer | Cloud Architecture Expert",
        bio: "Building resilient cloud infrastructure on AWS, GCP, and Azure. Docker & Kubernetes pro.",
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
        hourlyRate: 90,
        availability: "busy",
        location: "Remote",
      },
    ]);

    console.log(`✅ Created ${freelancers.length + 2} users`);

    // ─── Create 12 Gigs ──────────────────────────────────────────────────────
    const gigData = [
      {
        title: "Full-Stack Next.js Web Application Development",
        slug: "fullstack-nextjs-web-application-development",
        shortDescription: "I'll build your complete web app with Next.js, TypeScript, and MongoDB.",
        description: `I specialize in building production-grade web applications using the modern JavaScript stack. My deliverables include:\n\n- Next.js 14 with App Router and TypeScript\n- RESTful or GraphQL API with Express.js\n- MongoDB with Mongoose ORM\n- Authentication (JWT + OAuth)\n- Responsive Tailwind CSS UI\n- Deployed to Vercel + Railway\n- Full source code + documentation\n\nI have delivered 50+ projects with 5-star ratings. Let's bring your idea to life.`,
        category: "Web Development",
        tags: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB"],
        skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
        freelancer: freelancers[0]._id, // Sarah
        images: ["https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800"],
        startingPrice: 299,
        packages: {
          basic: { name: "Starter", description: "Landing page with up to 5 sections", price: 299, deliveryDays: 7, revisions: 2, features: ["Responsive design", "Contact form", "SEO basics", "1 month support"] },
          standard: { name: "Professional", description: "Full web app with auth and dashboard", price: 799, deliveryDays: 14, revisions: 5, features: ["Everything in Starter", "User auth", "Admin dashboard", "API integration"] },
          premium: { name: "Enterprise", description: "Complex app with AI features", price: 1999, deliveryDays: 30, revisions: 10, features: ["Everything in Pro", "AI features", "Payment integration"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 5, status: "active",
        averageRating: 4.9, totalReviews: 47, totalOrders: 52, aiDemandScore: 92, trendingScore: 88,
      },
      {
        title: "Professional UI/UX Design for Mobile & Web Apps",
        slug: "professional-ui-ux-design-mobile-web-apps",
        shortDescription: "Beautiful, user-centered designs in Figma with full design systems.",
        description: `Premium UI/UX design services that convert visitors into users. I deliver:\n\n- User research and persona creation\n- Wireframes and user flow diagrams\n- High-fidelity Figma mockups\n- Interactive prototypes\n- Complete design system with components`,
        category: "UI/UX Design",
        tags: ["Figma", "UI Design", "UX Research", "Mobile Design", "Design System"],
        skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
        freelancer: freelancers[1]._id, // Marcus
        images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"],
        startingPrice: 199,
        packages: {
          basic: { name: "Starter", description: "Up to 5 screens designed in Figma", price: 199, deliveryDays: 5, revisions: 2, features: ["5 screens", "Mobile responsive", "Source file"] },
          standard: { name: "Professional", description: "Complete app design up to 20 screens", price: 599, deliveryDays: 10, revisions: 5, features: ["20 screens", "Design system", "Prototype"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 3, status: "active",
        averageRating: 4.8, totalReviews: 33, totalOrders: 38, aiDemandScore: 85, trendingScore: 79,
      },
      {
        title: "Machine Learning Model Development & Deployment",
        slug: "machine-learning-model-development-deployment",
        shortDescription: "Custom ML models built, trained, and deployed to production.",
        description: `End-to-end machine learning solutions for your business:\n\n- Data preprocessing and feature engineering\n- Model selection and training\n- Hyperparameter tuning\n- REST API deployment with FastAPI`,
        category: "AI & Machine Learning",
        tags: ["Python", "Machine Learning", "TensorFlow", "AI", "Data Science"],
        skills: ["Python", "Machine Learning", "TensorFlow", "AWS"],
        freelancer: freelancers[2]._id, // Priya
        images: ["https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800"],
        startingPrice: 499,
        packages: {
          basic: { name: "Prototype", description: "Proof of concept ML model", price: 499, deliveryDays: 7, revisions: 2, features: ["Data analysis", "Model training", "Jupyter notebook"] },
          premium: { name: "Production", description: "Full ML pipeline with API", price: 2499, deliveryDays: 21, revisions: 5, features: ["REST API", "Cloud deployment", "Monitoring"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 3, status: "active",
        averageRating: 4.7, totalReviews: 21, totalOrders: 24, aiDemandScore: 96, trendingScore: 94,
      },
      {
        title: "AWS Cloud Architecture & DevOps Pipeline Setup",
        slug: "aws-cloud-architecture-devops-setup",
        shortDescription: "Complete AWS infrastructure with CI/CD, Docker, and auto-scaling.",
        description: `I'll architect and deploy your entire cloud infrastructure:\n\n- AWS VPC, EC2, ECS, or EKS setup\n- CI/CD pipeline with GitHub Actions\n- Docker containerization\n- Kubernetes orchestration`,
        category: "DevOps & Cloud",
        tags: ["AWS", "Docker", "Kubernetes", "DevOps", "CI/CD"],
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
        freelancer: freelancers[3]._id, // Jake
        images: ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800"],
        startingPrice: 399,
        packages: {
          basic: { name: "Starter", description: "Basic VPS setup with Docker and CI/CD", price: 399, deliveryDays: 5, revisions: 2, features: ["Docker setup", "GitHub Actions", "Basic monitoring"] },
          standard: { name: "Professional", description: "Full AWS production environment", price: 1299, deliveryDays: 14, revisions: 3, features: ["AWS setup", "Auto-scaling", "Load balancer"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 2, status: "active",
        averageRating: 4.6, totalReviews: 15, totalOrders: 17, aiDemandScore: 88, trendingScore: 82,
      },
      {
        title: "React Native Mobile App Development iOS & Android",
        slug: "react-native-mobile-app-development-ios-android",
        shortDescription: "Cross-platform mobile apps for iOS and Android with React Native.",
        description: "Professional React Native development for iOS and Android. Includes navigation, state management, API integration, push notifications, and App Store submission.",
        category: "Mobile Development",
        tags: ["React Native", "iOS", "Android", "TypeScript", "Mobile"],
        skills: ["React Native", "TypeScript", "iOS", "Android"],
        freelancer: freelancers[0]._id, // Sarah
        images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800"],
        startingPrice: 349,
        packages: {
          basic: { name: "MVP", description: "Basic app with core features", price: 349, deliveryDays: 14, revisions: 3, features: ["5 screens", "API integration", "iOS & Android"] },
          premium: { name: "Full App", description: "Complete app with all features", price: 1499, deliveryDays: 30, revisions: 5, features: ["Unlimited screens", "Push notifications", "App Store submission"] },
        },
        experienceLevel: "intermediate", deliveryTime: "2_weeks", revisions: 3, status: "active",
        averageRating: 4.5, totalReviews: 18, totalOrders: 20, aiDemandScore: 84, trendingScore: 76,
      },
      {
        title: "Python Django REST API Backend Development",
        slug: "python-django-rest-api-backend-development",
        shortDescription: "Scalable Django REST APIs with PostgreSQL and Redis caching.",
        description: "Full backend development with Django REST Framework, PostgreSQL, Redis, Celery for async tasks, JWT authentication, and comprehensive API documentation.",
        category: "Web Development",
        tags: ["Python", "Django", "REST API", "PostgreSQL", "Redis"],
        skills: ["Python", "Django", "PostgreSQL", "Redis"],
        freelancer: freelancers[2]._id, // Priya
        images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"],
        startingPrice: 249,
        packages: {
          basic: { name: "Basic API", description: "Simple REST API with CRUD", price: 249, deliveryDays: 5, revisions: 2, features: ["CRUD endpoints", "JWT auth", "API docs"] },
          standard: { name: "Full Backend", description: "Complete backend with all features", price: 799, deliveryDays: 14, revisions: 4, features: ["Redis caching", "Celery tasks", "Admin panel"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 3, status: "active",
        averageRating: 4.8, totalReviews: 29, totalOrders: 31, aiDemandScore: 87, trendingScore: 80,
      },
      {
        title: "Blockchain Smart Contract Development on Ethereum",
        slug: "blockchain-smart-contract-development-ethereum",
        shortDescription: "Solidity smart contracts for DeFi, NFTs, and Web3 applications.",
        description: "Expert Solidity development for Ethereum and EVM-compatible chains. DeFi protocols, NFT contracts, DAOs, token launches, and full Web3 frontend integration.",
        category: "Blockchain",
        tags: ["Solidity", "Ethereum", "Web3", "NFT", "DeFi"],
        skills: ["Solidity", "Ethereum", "Web3.js", "Hardhat"],
        freelancer: freelancers[1]._id, // Marcus
        images: ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800"],
        startingPrice: 599,
        packages: {
          basic: { name: "Simple Contract", description: "Single smart contract with tests", price: 599, deliveryDays: 7, revisions: 2, features: ["1 contract", "Unit tests", "Deployment script"] },
          premium: { name: "Full DApp", description: "Complete DApp with frontend", price: 2999, deliveryDays: 21, revisions: 5, features: ["Multiple contracts", "Web3 frontend", "Mainnet deployment"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 2, status: "active",
        averageRating: 4.7, totalReviews: 12, totalOrders: 14, aiDemandScore: 79, trendingScore: 85,
      },
      {
        title: "Data Science & Analytics Dashboard with Python",
        slug: "data-science-analytics-dashboard-python",
        shortDescription: "Interactive data dashboards with Python, Pandas, and Plotly.",
        description: "End-to-end data analysis and visualization using Python, Pandas, NumPy, Matplotlib, and Plotly. Interactive dashboards, statistical analysis, and business intelligence reports.",
        category: "Data Science",
        tags: ["Python", "Data Science", "Pandas", "Plotly", "Analytics"],
        skills: ["Python", "Pandas", "Data Science", "Plotly"],
        freelancer: freelancers[2]._id, // Priya
        images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"],
        startingPrice: 199,
        packages: {
          basic: { name: "Analysis", description: "Data analysis with visualizations", price: 199, deliveryDays: 3, revisions: 2, features: ["Data cleaning", "5 charts", "PDF report"] },
          standard: { name: "Dashboard", description: "Interactive web dashboard", price: 699, deliveryDays: 10, revisions: 3, features: ["Interactive charts", "Filters", "Hosted dashboard"] },
        },
        experienceLevel: "intermediate", deliveryTime: "3_days", revisions: 2, status: "active",
        averageRating: 4.9, totalReviews: 38, totalOrders: 42, aiDemandScore: 91, trendingScore: 88,
      },
      {
        title: "Cybersecurity Penetration Testing",
        slug: "cybersecurity-penetration-testing",
        shortDescription: "Professional pen testing for web apps, APIs, and network infrastructure.",
        description: "Comprehensive security assessments including OWASP Top 10 testing, network vulnerability scanning, API security testing, and detailed remediation reports.",
        category: "Cybersecurity",
        tags: ["Cybersecurity", "Penetration Testing", "OWASP", "Security"],
        skills: ["Cybersecurity", "Penetration Testing", "Kali Linux", "Burp Suite"],
        freelancer: freelancers[3]._id, // Jake
        images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800"],
        startingPrice: 449,
        packages: {
          basic: { name: "Web App Scan", description: "OWASP Top 10 security scan", price: 449, deliveryDays: 5, revisions: 1, features: ["OWASP scan", "Vulnerability report"] },
          premium: { name: "Full Assessment", description: "Complete security audit", price: 1999, deliveryDays: 14, revisions: 2, features: ["Full pen test", "Network scan", "API testing", "Re-test included"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 1, status: "active",
        averageRating: 4.8, totalReviews: 9, totalOrders: 10, aiDemandScore: 82, trendingScore: 74,
      },
      {
        title: "SEO Content Writing & Blog Strategy for Tech Startups",
        slug: "seo-content-writing-blog-strategy-tech-startups",
        shortDescription: "SEO-optimized technical content that ranks and converts.",
        description: "Expert technical content writing for SaaS and tech companies. SEO research, keyword strategy, long-form blog posts, developer documentation, and content calendars.",
        category: "Content Writing",
        tags: ["Content Writing", "SEO", "Blog", "Technical Writing"],
        skills: ["Content Writing", "SEO", "Technical Writing", "Copywriting"],
        freelancer: freelancers[0]._id, // Sarah
        images: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800"],
        startingPrice: 99,
        packages: {
          basic: { name: "Single Post", description: "1 SEO-optimized blog post 1500 words", price: 99, deliveryDays: 3, revisions: 2, features: ["Keyword research", "1500 words", "Internal linking"] },
          standard: { name: "Content Pack", description: "5 blog posts with strategy", price: 399, deliveryDays: 14, revisions: 3, features: ["5 posts", "Content calendar", "SEO audit"] },
        },
        experienceLevel: "intermediate", deliveryTime: "3_days", revisions: 2, status: "active",
        averageRating: 4.6, totalReviews: 44, totalOrders: 50, aiDemandScore: 72, trendingScore: 68,
      },
      {
        title: "Digital Marketing Strategy & Google Ads Management",
        slug: "digital-marketing-strategy-google-ads-management",
        shortDescription: "Data-driven Google Ads and Meta campaigns that maximize ROI.",
        description: "Full-funnel digital marketing including Google Ads, Meta Ads, campaign strategy, A/B testing, conversion optimization, and monthly performance reporting.",
        category: "Digital Marketing",
        tags: ["Digital Marketing", "Google Ads", "Meta Ads", "PPC", "ROI"],
        skills: ["Google Ads", "Meta Ads", "Digital Marketing", "Analytics"],
        freelancer: freelancers[1]._id, // Marcus
        images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"],
        startingPrice: 299,
        packages: {
          basic: { name: "Audit", description: "Ads account audit and strategy", price: 299, deliveryDays: 5, revisions: 1, features: ["Account audit", "Competitor analysis", "Strategy document"] },
          standard: { name: "Management", description: "1 month full ads management", price: 999, deliveryDays: 30, revisions: 2, features: ["Campaign setup", "Daily optimization", "Weekly reports"] },
        },
        experienceLevel: "expert", deliveryTime: "1_week", revisions: 2, status: "active",
        averageRating: 4.5, totalReviews: 22, totalOrders: 25, aiDemandScore: 75, trendingScore: 71,
      },
      {
        title: "Figma to React — Pixel Perfect Frontend Implementation",
        slug: "figma-to-react-pixel-perfect-frontend",
        shortDescription: "Turn your Figma designs into production-ready React components.",
        description: "Expert frontend development converting Figma designs to clean, responsive React components using TypeScript, TailwindCSS, and Framer Motion animations.",
        category: "Web Development",
        tags: ["React", "Figma", "TypeScript", "TailwindCSS", "Frontend"],
        skills: ["React", "TypeScript", "TailwindCSS", "Figma"],
        freelancer: freelancers[3]._id, // Jake
        images: ["https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=800"],
        startingPrice: 149,
        packages: {
          basic: { name: "Starter", description: "Up to 3 pages converted", price: 149, deliveryDays: 3, revisions: 2, features: ["3 pages", "Responsive", "Clean code"] },
          standard: { name: "Full Project", description: "Complete design to code", price: 599, deliveryDays: 10, revisions: 5, features: ["Unlimited pages", "Animations", "Component library"] },
        },
        experienceLevel: "expert", deliveryTime: "3_days", revisions: 3, status: "active",
        averageRating: 4.9, totalReviews: 31, totalOrders: 35, aiDemandScore: 89, trendingScore: 92,
      },
    ];

    const gigs = await Gig.insertMany(gigData);
    console.log(`✅ Created ${gigs.length} gigs`);

    // ─── Create Reviews ───────────────────────────────────────────────────
    await Review.insertMany([
      {
        gig: gigs[0]._id, // Connected to Sarah's Full-Stack Gig
        reviewer: client._id,
        freelancer: freelancers[0]._id,
        rating: 5,
        title: "Exceptional work, delivered ahead of schedule!",
        comment: "Sarah built our entire SaaS dashboard in under 2 weeks. Clean code, great communication, and the design was pixel-perfect. Will hire again without hesitation.",
        isVerifiedPurchase: true,
      },
      {
        gig: gigs[1]._id, // Connected to Marcus's UI/UX Gig
        reviewer: client._id,
        freelancer: freelancers[1]._id,
        rating: 5,
        title: "Best designer I've worked with on this platform",
        comment: "Marcus completely transformed our product's UX. Our App Store rating went from 3.2 to 4.7 after his redesign. The Figma files were incredibly detailed.",
        isVerifiedPurchase: true,
      },
      {
        gig: gigs[2]._id, // Connected to Priya's ML Gig
        reviewer: client._id,
        freelancer: freelancers[2]._id,
        rating: 5,
        title: "Deep ML knowledge and excellent delivery",
        comment: "Priya built a recommendation engine that increased our user engagement by 34%. She explained every decision clearly and provided excellent documentation.",
        isVerifiedPurchase: true,
      },
    ]);
    console.log("✅ Created reviews");

    // ─── Create Blog Posts ────────────────────────────────────────────────
    await BlogPost.insertMany([
      {
        title: "How to Land Your First $1,000 Freelance Client in 30 Days",
        slug: "land-first-1000-freelance-client-30-days",
        excerpt: "The step-by-step playbook for new freelancers to go from zero to first paying client using strategic positioning and AI-powered pitches.",
        content: `# How to Land Your First $1,000 Freelance Client in 30 Days\n\nStarting a freelance career can feel overwhelming. Here's a proven 30-day plan...\n\n## Week 1: Foundation\n\nBefore pitching anyone, you need a compelling profile that does the selling for you. Use NexusAI's Pitch Builder to generate a professional bio in minutes...\n\n## Week 2: Targeting\n\nStop spray-and-praying. Use AI Smart Recommendations to identify exactly which gig categories have high demand and low competition for your specific skills...`,
        category: "Career Growth",
        tags: ["freelancing", "career", "tips", "AI", "clients"],
        author: admin._id,
        status: "published",
        readTime: 8,
        views: 1247,
        publishedAt: new Date("2025-03-15"),
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      },
      {
        title: "The 10 Most In-Demand Freelance Skills in 2025",
        slug: "most-in-demand-freelance-skills-2025",
        excerpt: "Based on NexusAI platform data analyzing 50,000+ gig postings, here are the skills commanding the highest rates and lowest competition.",
        content: `# The 10 Most In-Demand Freelance Skills in 2025\n\nWe analyzed 50,000+ gigs posted on NexusAI to find which skills are commanding premium rates...\n\n## 1. AI & Prompt Engineering\n\nWith AI tools exploding in adoption, clients need experts who can build and optimize AI pipelines. Average rate: $120/hr...\n\n## 2. Next.js & React Development\n\nThe go-to stack for modern web apps. Demand up 43% year-over-year...`,
        category: "Industry Insights",
        tags: ["skills", "2025", "trends", "AI", "development"],
        author: admin._id,
        status: "published",
        readTime: 6,
        views: 3892,
        publishedAt: new Date("2025-04-01"),
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      },
      {
        title: "How AI is Transforming the Freelance Economy",
        slug: "ai-transforming-freelance-economy",
        excerpt: "AI isn't replacing freelancers — it's creating an entirely new class of AI-native freelancers who earn 2x more than their peers.",
        content: `# How AI is Transforming the Freelance Economy\n\nThe narrative that AI will replace freelancers is wrong. Here's what's actually happening...\n\n## The AI-Native Freelancer\n\nFreelancers who integrate AI tools into their workflow are reporting 40-60% productivity gains, allowing them to take on more clients without sacrificing quality...`,
        category: "AI & Technology",
        tags: ["AI", "freelancing", "future of work", "technology"],
        author: admin._id,
        status: "published",
        readTime: 7,
        views: 2156,
        publishedAt: new Date("2025-04-20"),
        coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
      },
    ]);
    console.log("✅ Created blog posts");

    const disputes = await Dispute.insertMany([
      {
        orderId: "ORD-982374A",
        client: client._id,
        freelancer: freelancers[3]._id, // Jake
        reason: "Freelancer missed the cloud migration deadline by 4 days without communication. I want a refund.",
        amount: 399,
        status: "open",
      },
      {
        orderId: "ORD-125689B",
        client: client._id,
        freelancer: freelancers[1]._id, // Marcus
        reason: "Client is demanding 15 additional screens that were not in the original scope of the Figma project. Refuses to release escrow.",
        amount: 599,
        status: "open",
      },
      {
        orderId: "ORD-882233C",
        client: client._id,
        freelancer: freelancers[2]._id, // Priya
        reason: "The machine learning model's accuracy is only 60%, but the contract stipulated a minimum of 85% accuracy.",
        amount: 2499,
        status: "open",
      },
      {
        orderId: "ORD-554411D",
        client: client._id,
        freelancer: freelancers[0]._id, // Sarah
        reason: "The deployed Next.js app is completely broken on mobile devices. Freelancer refuses to fix the CSS bugs.",
        amount: 799,
        status: "open",
      },
      {
        orderId: "ORD-999888E",
        client: client._id,
        freelancer: freelancers[3]._id, // Jake
        reason: "The AWS configuration was done incorrectly, resulting in a $400 unexpected server bill for my company.",
        amount: 1299,
        status: "open",
      },
      {
        orderId: "ORD-773344F",
        client: client._id,
        freelancer: freelancers[0]._id, // Sarah
        reason: "Code was delivered perfectly and deployed to production, but client went completely unresponsive during the final payment milestone approval.",
        amount: 1499,
        status: "resolved_freelancer", // Historical data, won't show in active queue
      },
      {
        orderId: "ORD-112233G",
        client: client._id,
        freelancer: freelancers[1]._id, // Marcus
        reason: "The designer submitted a logo that was 100% plagiarized from a stock website.",
        amount: 199,
        status: "resolved_client", // Historical data, won't show in active queue
      }
    ]);
    console.log(`✅ Created ${disputes.length} disputes (5 Open, 2 Resolved)`);

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    const orders = await Order.insertMany([
      {
        orderNumber: "ORD-982374A", // Matches the dispute we made earlier!
        gig: gigs[3]._id,
        client: client._id,
        freelancer: freelancers[3]._id, // Jake
        title: "AWS Cloud Architecture Migration",
        amount: 399,
        status: "in_dispute",
        deadline: lastWeek,
      },
      {
        orderNumber: "ORD-554411D", 
        gig: gigs[0]._id,
        client: client._id,
        freelancer: freelancers[0]._id, // Sarah
        title: "Full-Stack Next.js Dashboard",
        amount: 799,
        status: "in_progress",
        deadline: nextWeek,
      },
      {
        orderNumber: "ORD-112233G",
        gig: gigs[1]._id,
        client: client._id,
        freelancer: freelancers[1]._id, // Marcus
        title: "Mobile App UI Design (10 Screens)",
        amount: 599,
        status: "completed",
        deadline: lastWeek,
      }
    ]);
    console.log(`✅ Created ${orders.length} orders`);

    console.log("\n🎉 Seed complete! Your database is fully populated.");
    console.log("──────────────────────────────────────────");
    console.log("📧 Admin:    admin@nexusai.com  / Demo@1234");
    console.log("📧 User:     user@nexusai.com   / Demo@1234");
    console.log("📧 Client:   client@nexusai.com / Demo@1234");
    console.log("──────────────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();