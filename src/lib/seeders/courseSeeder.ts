import Course from "../../models/Course.js";
import connectDB from "../db/mongodb.js";

const courses = [
  {
    title: "Professional WordPress Development Course",
    description: `Transform your career with our industry-leading WordPress Development Course in Chandannagar. In today's digital-first world, WordPress powers over 43% of all websites globally (W3Techs, 2024), with over 75 million active websites and growing at 12% annually. The WordPress ecosystem generates over $596 billion in economic activity worldwide, creating massive opportunities for skilled developers. Our comprehensive training program is designed to take you from beginner to professional WordPress developer, with a focus on real-world applications and industry best practices.

What is WordPress Development?
WordPress development is the art of creating, customizing, and managing websites using the WordPress platform. It combines web design, programming, and digital marketing skills to build professional websites, e-commerce stores, and custom web applications. As a WordPress developer, you'll learn to create stunning websites, implement complex functionalities, and manage online businesses for clients worldwide.

Industry Statistics & Market Demand:
• WordPress powers 43.1% of all websites globally (W3Techs, 2024)
• 75+ million active WordPress websites worldwide
• 12% annual growth in WordPress adoption
• 50,000+ new WordPress plugins added annually
• 8,000+ free WordPress themes available
• 60% of websites using CMS choose WordPress
• 90% of e-commerce websites use WooCommerce
• 70% of WordPress developers report increased demand
• 45% of businesses plan to increase WordPress development budgets
• 85% of WordPress developers work remotely

Why Choose Our WordPress Development Course?
• Industry-Aligned Curriculum: Our course is constantly updated to match current industry standards and emerging technologies
• Expert-Led Training: Learn from certified WordPress developers with 5+ years of industry experience
• Hands-on Project Development: Build 5+ real websites and applications for your portfolio
• Job-Ready Skills: Master both technical and soft skills needed for professional success
• Flexible Learning: Balance theory with practical implementation through our structured learning approach
• Placement Support: 100% placement assistance with our network of 50+ hiring partners
• Industry Projects: Work on real client projects from day one
• Small Batch Learning: Maximum 15 students per batch for personalized attention
• Lifetime Support: Access to course updates and industry insights forever
• Modern Infrastructure: Learn in our state-of-the-art computer lab with high-speed internet

What You'll Learn:
• Advanced WordPress Theme Development
  - Custom theme creation from scratch using Underscores
  - Responsive design implementation with Bootstrap 5
  - Theme customization and optimization
  - Child theme development
  - Custom template development
• Custom Plugin Development
  - Plugin architecture and best practices
  - Custom functionality implementation
  - Plugin security and performance
  - WooCommerce extension development
  - REST API integration
• WooCommerce Integration & Customization
  - E-commerce store setup and management
  - Payment gateway integration (Razorpay, Stripe, PayPal)
  - Product management and customization
  - Advanced shipping and tax rules
  - Subscription and membership systems
• WordPress Security & Performance Optimization
  - Security best practices and implementation
  - Performance optimization techniques
  - Caching and database optimization
  - SSL implementation
  - Malware protection and removal
• Responsive Design & Mobile-First Development
  - Modern CSS frameworks (Tailwind CSS, Bootstrap 5)
  - Mobile-first design principles
  - Cross-device compatibility
  - Progressive Web Apps (PWA)
  - AMP implementation
• SEO Best Practices for WordPress
  - On-page SEO optimization
  - Technical SEO implementation
  - Analytics and tracking setup
  - Schema markup
  - Local SEO optimization
• Custom Post Types & Taxonomies
  - Advanced content organization
  - Custom data structures
  - Content management optimization
  - Custom fields (ACF Pro)
  - Custom taxonomies
• WordPress REST API Integration
  - API development and consumption
  - Headless WordPress implementation
  - Modern web application development
  - React/Next.js integration
  - Mobile app development
• Database Management & Optimization
  - Database design and optimization
  - Query optimization
  - Data migration and backup
  - MySQL optimization
  - Database security

Tools & Technologies You'll Master:
• WordPress Core & Gutenberg
• PHP 8.x & MySQL
• HTML5, CSS3, JavaScript (ES6+)
• React.js & Next.js
• Tailwind CSS & Bootstrap 5
• Git & GitHub
• VS Code & Dev Tools
• WP-CLI & Composer
• Docker & Local Development
• Advanced Custom Fields Pro
• WooCommerce & Payment Gateways
• SEO Tools (Yoast, Rank Math)
• Performance Tools (GTmetrix, PageSpeed)
• Security Tools (Wordfence, Sucuri)
• Analytics Tools (Google Analytics, Search Console)

Career Opportunities & Salary Ranges:
• WordPress Developer
  - Junior: ₹3-5 LPA
  - Mid-level: ₹5-8 LPA
  - Senior: ₹8-15 LPA
  - Lead: ₹15-25 LPA
• Web Developer
  - Junior: ₹4-6 LPA
  - Mid-level: ₹6-10 LPA
  - Senior: ₹10-15 LPA
  - Lead: ₹15-25 LPA
• E-commerce Developer
  - Junior: ₹4-7 LPA
  - Mid-level: ₹7-12 LPA
  - Senior: ₹12-18 LPA
  - Lead: ₹18-30 LPA
• Freelance WordPress Developer
  - Beginner: ₹500-1000/hour
  - Intermediate: ₹1000-1500/hour
  - Expert: ₹1500-2000+/hour
• Technical Consultant
  - Junior: ₹5-8 LPA
  - Mid-level: ₹8-15 LPA
  - Senior: ₹15-25 LPA
  - Lead: ₹25-40 LPA

Why Choose Launch Verse Academy?
• Industry-Recognized Certification
• 100% Practical Training with 5+ Live Projects
• 100% Placement Assistance with 50+ Hiring Partners
• Lifetime Support & Course Updates
• Small Batch Sizes (Max 15 Students)
• Flexible Timings (Morning/Evening Batches)
• Modern Infrastructure with High-Speed Internet
• Expert Mentorship from Industry Professionals
• Regular Industry Expert Sessions
• Free Domain & Hosting for Practice
• Interview Preparation & Mock Interviews
• Resume Building & Portfolio Development
• Freelance Guidance & Business Setup
• Regular Industry Updates & Workshops
• Access to Premium WordPress Tools
• Job Guarantee Program Available
• EMI Options for Course Fee
• Weekend Batches Available
• Online Support 24/7
• Alumni Network Access

Our graduates have successfully secured positions at leading companies like:
• TCS, Infosys, Wipro
• Accenture, Cognizant
• HCL, Tech Mahindra
• Startups & Digital Agencies
• Freelance Platforms (Upwork, Fiverr)

Join our community of 1000+ successful WordPress developers and start your journey to a rewarding career in web development!`,
    priceRange: {
      min: 11000,
      max: 15000,
    },
    duration: {
      min: 6,
      max: 8,
    },
    durationUnit: "months",
    isActive: true,
    isComingSoon: false,
    features: [
      "Industry-standard curriculum",
      "Hands-on project development",
      "Live website deployment",
      "E-commerce integration",
      "Custom theme development",
      "Plugin development",
      "SEO optimization",
      "Performance optimization",
      "Security best practices",
      "Career guidance",
      "Job placement assistance",
      "Certificate of completion",
      "Lifetime support",
      "Free domain & hosting for practice",
      "Regular assessments",
      "Industry expert sessions",
      "Portfolio development",
      "Interview preparation",
      "Resume building",
      "Freelance guidance",
      "Job guarantee program",
      "EMI options available",
      "Weekend batches",
      "24/7 online support",
      "Alumni network access",
      "Premium tools access",
      "Mock interviews",
      "Business setup guidance",
      "Industry workshops",
      "Hiring partner network",
    ],
  },
  {
    title: "Web Design & Development Masterclass",
    description: `Launch your career in web design and development with our comprehensive masterclass in Chandannagar. In today's digital age, web development skills are in high demand, with over 1.8 billion websites online and growing. Our course is designed to transform beginners into professional web developers, combining creative design with technical expertise.

Why Choose Our Web Design & Development Masterclass?
• Comprehensive Curriculum: Covering both design and development aspects
• Industry-Standard Tools: Learn using the latest technologies and frameworks
• Project-Based Learning: Build real websites from day one
• Career-Focused Training: Develop both technical and soft skills
• Expert Mentorship: Learn from experienced professionals

What You'll Learn:
• Modern Web Design Principles
  - UI/UX design fundamentals
  - Color theory and typography
  - Layout and composition
  - Design systems and patterns
• HTML5 & CSS3 Mastery
  - Semantic HTML
  - Advanced CSS techniques
  - CSS Grid and Flexbox
  - CSS animations and transitions
• JavaScript & jQuery
  - Modern JavaScript (ES6+)
  - DOM manipulation
  - Event handling
  - AJAX and APIs
• Responsive Design
  - Mobile-first approach
  - Media queries
  - Responsive frameworks
  - Cross-device testing
• UI/UX Design Fundamentals
  - User research
  - Wireframing
  - Prototyping
  - User testing
• Bootstrap Framework
  - Grid system
  - Components
  - Customization
  - Responsive utilities
• WordPress Integration
  - Theme development
  - Plugin usage
  - Content management
  - Customization
• Website Performance Optimization
  - Speed optimization
  - Image optimization
  - Code minification
  - Caching strategies
• Cross-browser Compatibility
  - Browser testing
  - Feature detection
  - Fallback solutions
  - Progressive enhancement
• Mobile-First Development
  - Mobile design principles
  - Touch interactions
  - Mobile performance
  - PWA basics
• Web Accessibility Standards
  - WCAG guidelines
  - ARIA attributes
  - Screen reader compatibility
  - Keyboard navigation
• SEO Fundamentals
  - On-page SEO
  - Technical SEO
  - Analytics
  - Search console
• Version Control with Git
  - Repository management
  - Branching strategies
  - Collaboration
  - Deployment
• Web Hosting & Deployment
  - Domain management
  - Hosting setup
  - SSL implementation
  - Deployment workflows
• Portfolio Development
  - Project showcase
  - Case studies
  - Personal branding
  - Online presence

Career Opportunities:
• Web Designer (₹3-7 LPA)
• Front-end Developer (₹4-10 LPA)
• UI/UX Designer (₹4-12 LPA)
• Full-stack Developer (₹5-15 LPA)
• Freelance Web Developer (₹500-2000/hour)

Why Choose Launch Verse Academy?
• Industry-Recognized Certification
• 100% Practical Training
• Live Project Development
• Placement Assistance
• Lifetime Support
• Small Batch Sizes
• Flexible Timings
• Modern Infrastructure
• Expert Mentorship
• Regular Industry Updates

Our graduates have successfully secured positions at leading tech companies and established successful freelance careers. Join our community of successful web developers and start your journey to a rewarding career in web development!`,
    priceRange: {
      min: 8000,
      max: 12000,
    },
    duration: {
      min: 3,
      max: 5,
    },
    durationUnit: "months",
    isActive: true,
    isComingSoon: false,
    features: [
      "Modern design tools training",
      "Responsive design projects",
      "Portfolio development",
      "Live website creation",
      "UI/UX design principles",
      "Front-end development",
      "Back-end integration",
      "Website optimization",
      "SEO implementation",
      "Career counseling",
      "Job placement support",
      "Industry certification",
      "Project-based learning",
      "Regular workshops",
      "Design resources access",
      "Industry expert sessions",
      "Interview preparation",
      "Resume building",
      "Freelance guidance",
      "GitHub portfolio",
    ],
  },
  {
    title: "Graphic Design & Digital Marketing Course",
    description: `Master the art of visual communication and digital marketing with our comprehensive training program in Chandannagar. In today's digital-first world, businesses are constantly seeking skilled graphic designers and digital marketers to create compelling content and drive growth. Our course combines creative design with strategic marketing to prepare you for success in the digital industry.

Why Choose Our Graphic Design & Digital Marketing Course?
• Industry-Relevant Skills: Learn the most in-demand design and marketing tools
• Creative & Strategic Approach: Balance artistic skills with marketing strategy
• Project-Based Learning: Work on real client projects
• Career-Focused Training: Develop both technical and business skills
• Expert Mentorship: Learn from industry professionals

What You'll Learn:
• Adobe Creative Suite Mastery
  - Photoshop: Image editing and manipulation
  - Illustrator: Vector graphics and logo design
  - InDesign: Layout and publication design
  - Premiere Pro: Video editing and motion graphics
• Brand Identity Design
  - Logo design
  - Brand guidelines
  - Visual identity systems
  - Brand strategy
• Social Media Graphics
  - Platform-specific design
  - Content creation
  - Visual storytelling
  - Engagement optimization
• Print & Digital Design
  - Print media design
  - Digital media design
  - Responsive design
  - Cross-platform consistency
• Motion Graphics
  - Animation basics
  - Motion design
  - Video editing
  - Visual effects
• Digital Marketing Fundamentals
  - Marketing strategy
  - Content marketing
  - Social media marketing
  - Email marketing
• Social Media Marketing
  - Platform management
  - Content strategy
  - Community management
  - Analytics and reporting
• Content Marketing
  - Content strategy
  - Copywriting
  - Blog writing
  - Content optimization
• Email Marketing
  - Campaign creation
  - List management
  - Automation
  - Analytics
• SEO & SEM Basics
  - Keyword research
  - On-page SEO
  - PPC advertising
  - Analytics
• Analytics & Reporting
  - Google Analytics
  - Social media analytics
  - Campaign tracking
  - Performance reporting
• Portfolio Development
  - Project showcase
  - Case studies
  - Personal branding
  - Online presence
• Client Project Management
  - Client communication
  - Project planning
  - Time management
  - Budget management

Career Opportunities:
• Graphic Designer (₹3-8 LPA)
• Digital Marketing Specialist (₹4-10 LPA)
• Social Media Manager (₹4-12 LPA)
• Content Creator (₹3-9 LPA)
• Freelance Designer (₹500-2000/hour)

Why Choose Launch Verse Academy?
• Industry-Recognized Certification
• 100% Practical Training
• Live Project Development
• Placement Assistance
• Lifetime Support
• Small Batch Sizes
• Flexible Timings
• Modern Infrastructure
• Expert Mentorship
• Regular Industry Updates

Our graduates have successfully secured positions at leading design agencies, marketing firms, and established successful freelance careers. Join our community of successful designers and marketers and start your journey to a rewarding career in the creative industry!`,
    priceRange: {
      min: 9000,
      max: 13000,
    },
    duration: {
      min: 4,
      max: 5,
    },
    durationUnit: "months",
    isActive: true,
    isComingSoon: false,
    features: [
      "Adobe Creative Suite training",
      "Portfolio development",
      "Real client projects",
      "Social media marketing",
      "Content creation",
      "Brand identity design",
      "Print & digital design",
      "Motion graphics",
      "Digital marketing tools",
      "Analytics training",
      "Career guidance",
      "Job placement support",
      "Industry certification",
      "Design resources",
      "Marketing tools access",
      "Industry expert sessions",
      "Interview preparation",
      "Resume building",
      "Freelance guidance",
      "Client management training",
    ],
  },
  {
    title: "Advanced MS Office & Business Skills",
    description: `Master Microsoft Office and essential business skills with our comprehensive training program in Chandannagar. In today's competitive job market, proficiency in MS Office and business skills is essential for career success. Our course is designed to take you from basic to advanced levels, preparing you for professional success in any industry.

Why Choose Our MS Office & Business Skills Course?
• Industry-Standard Training: Learn the most in-demand office skills
• Practical Application: Focus on real-world business scenarios
• Career-Focused: Develop both technical and soft skills
• Expert-Led: Learn from certified Microsoft Office specialists
• Flexible Learning: Balance theory with practical implementation

What You'll Learn:
• Microsoft Office Suite
  - Word: Advanced Document Creation
    • Professional document formatting
    • Mail merge and automation
    • Advanced tables and graphics
    • Document collaboration
  - Excel: Data Analysis & Formulas
    • Advanced formulas and functions
    • Data visualization
    • Pivot tables and charts
    • Business analytics
  - PowerPoint: Professional Presentations
    • Advanced slide design
    • Animation and transitions
    • Presentation delivery
    • Business storytelling
  - Outlook: Email Management
    • Advanced email organization
    • Calendar management
    • Task tracking
    • Business communication
  - Access: Database Management
    • Database design
    • Query creation
    • Form development
    • Report generation
• Business Communication
  - Professional writing
  - Business correspondence
  - Meeting management
  - Presentation skills
• Data Analysis & Visualization
  - Data interpretation
  - Chart creation
  - Business reporting
  - Data-driven decisions
• Business Presentations
  - Presentation design
  - Public speaking
  - Audience engagement
  - Visual communication
• Report Writing
  - Business reports
  - Technical documentation
  - Executive summaries
  - Data presentation
• Project Management
  - Project planning
  - Task management
  - Resource allocation
  - Progress tracking
• Business Documentation
  - Document templates
  - Standard operating procedures
  - Policy documentation
  - Business forms
• Office Automation
  - Workflow automation
  - Process optimization
  - Time-saving techniques
  - Efficiency tools
• Professional Email Writing
  - Business email etiquette
  - Email templates
  - Follow-up strategies
  - Professional tone
• Business Etiquette
  - Professional conduct
  - Workplace communication
  - Meeting etiquette
  - Business networking
• Time Management
  - Priority setting
  - Task organization
  - Deadline management
  - Productivity tools
• Team Collaboration Tools
  - Microsoft Teams
  - SharePoint
  - OneDrive
  - Collaboration best practices

Career Opportunities:
• Office Administrator (₹2-5 LPA)
• Executive Assistant (₹3-6 LPA)
• Data Entry Specialist (₹2-4 LPA)
• Business Analyst (₹4-8 LPA)
• Project Coordinator (₹3-7 LPA)

Why Choose Launch Verse Academy?
• Microsoft Office Certification
• 100% Practical Training
• Industry Projects
• Placement Assistance
• Lifetime Support
• Small Batch Sizes
• Flexible Timings
• Modern Infrastructure
• Expert Mentorship
• Regular Industry Updates

Our graduates have successfully secured positions at leading companies across various industries. Join our community of successful professionals and start your journey to a rewarding career in business administration!`,
    priceRange: {
      min: 5000,
      max: 8000,
    },
    duration: {
      min: 2,
      max: 3,
    },
    durationUnit: "months",
    isActive: true,
    isComingSoon: false,
    features: [
      "MS Office certification",
      "Practical assignments",
      "Business communication",
      "Data analysis skills",
      "Presentation skills",
      "Report writing",
      "Project management",
      "Office automation",
      "Email management",
      "Business documentation",
      "Career guidance",
      "Job placement support",
      "Industry certification",
      "Regular assessments",
      "Practice materials",
      "Industry expert sessions",
      "Interview preparation",
      "Resume building",
      "Business etiquette training",
      "Team collaboration tools",
    ],
  },
];

// Export the seeding function
export async function seedCourses() {
  try {
    await connectDB();
    const existingCourses = await Course.find({});

    if (existingCourses.length > 0) {
      return; // Skip if courses exist
    }

    const insertedCourses = await Course.insertMany(courses);
    return insertedCourses.length;
  } catch (error) {
    console.error("Error seeding courses:", error);
    throw error;
  }
}

export async function resetAndSeedCourses() {
  try {
    await connectDB();
    await Course.deleteMany({});
    const insertedCourses = await Course.insertMany(courses);
    return insertedCourses.length;
  } catch (error) {
    console.error("Error seeding courses:", error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (process.argv[1] === import.meta.url) {
  (async () => {
    try {
      await connectDB();
      console.log("Connected to MongoDB");

      // Check if courses already exist
      const existingCourses = await Course.find({});
      if (existingCourses.length > 0) {
        console.log("Courses already exist in the database. Skipping seeding.");
        return existingCourses;
      }

      // Insert new courses
      const insertedCourses = await Course.insertMany(courses);
      console.log(`Successfully seeded ${insertedCourses.length} courses`);
      console.log("Course seeding completed");
      process.exit(0);
    } catch (error: unknown) {
      console.error("Error seeding courses:", error);
      process.exit(1);
    }
  })();
}
