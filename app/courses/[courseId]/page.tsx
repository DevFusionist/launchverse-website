import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetails } from "./course-details";

// This would typically come from a database or CMS
const courses = [
  {
    id: "web-development-wordpress",
    title: "Web Development (WordPress)",
    description:
      "Master WordPress development and create professional websites with our comprehensive course covering themes, plugins, and custom development.",
    icon: "🌐",
    neonColor: "from-blue-500 to-purple-500",
    duration: "3 months",
    level: "Beginner to Intermediate",
    price: "₹24,999",
    highlights: [
      "Hands-on WordPress development",
      "Theme customization",
      "Plugin development",
      "E-commerce integration",
      "Website deployment",
    ],
    curriculum: [
      {
        module: "WordPress Fundamentals",
        topics: [
          "WordPress Installation & Setup",
          "Dashboard Navigation",
          "Posts & Pages Management",
          "Media Library",
          "User Management",
          "Settings & Configuration",
        ],
      },
      {
        module: "Theme Development",
        topics: [
          "Theme Structure",
          "Template Files",
          "Custom Templates",
          "Theme Customization",
          "Responsive Design",
          "Child Themes",
        ],
      },
      {
        module: "Plugin Development",
        topics: [
          "Plugin Basics",
          "Custom Post Types",
          "Custom Fields",
          "Shortcodes",
          "Widgets Development",
          "Plugin Security",
        ],
      },
    ],
    outcomes: [
      "Create professional WordPress websites",
      "Develop custom themes and plugins",
      "Implement e-commerce solutions",
      "Optimize website performance",
      "Manage WordPress security",
      "Deploy websites to production",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Understanding of HTML/CSS",
      "Basic PHP knowledge",
      "No prior WordPress experience required",
    ],
    instructors: [
      {
        name: "Rajesh Kumar",
        role: "Lead WordPress Developer",
        experience: "8+ years in WordPress Development",
        expertise: [
          "WordPress",
          "PHP",
          "Theme Development",
          "Plugin Development",
        ],
      },
      {
        name: "Priya Sharma",
        role: "Senior Web Developer",
        experience: "6+ years in Web Development",
        expertise: ["WordPress", "UI/UX", "E-commerce", "Website Optimization"],
      },
    ],
  },
  {
    id: "web-designing",
    title: "Web Designing",
    description:
      "Learn modern web design principles, tools, and techniques to create beautiful and responsive websites.",
    icon: "🎨",
    neonColor: "from-purple-500 to-pink-500",
    duration: "3 months",
    level: "Beginner to Intermediate",
    price: "₹19,999",
    highlights: [
      "Modern design principles",
      "Responsive design",
      "UI/UX fundamentals",
      "Design tools mastery",
      "Portfolio development",
    ],
    curriculum: [
      {
        module: "Design Fundamentals",
        topics: [
          "Color Theory",
          "Typography",
          "Layout Principles",
          "Visual Hierarchy",
          "Design Psychology",
          "Brand Identity",
        ],
      },
      {
        module: "Web Design Tools",
        topics: [
          "Adobe XD",
          "Figma",
          "Photoshop Basics",
          "Illustrator Basics",
          "Wireframing",
          "Prototyping",
        ],
      },
      {
        module: "Responsive Design",
        topics: [
          "Mobile-First Design",
          "Grid Systems",
          "Flexbox & CSS Grid",
          "Media Queries",
          "Responsive Images",
          "Cross-browser Testing",
        ],
      },
    ],
    outcomes: [
      "Create modern website designs",
      "Design responsive layouts",
      "Use industry-standard tools",
      "Build design systems",
      "Create user-friendly interfaces",
      "Develop a professional portfolio",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Creative mindset",
      "Interest in design",
      "No prior design experience required",
    ],
    instructors: [
      {
        name: "Neha Gupta",
        role: "Lead UI/UX Designer",
        experience: "7+ years in Web Design",
        expertise: [
          "UI/UX",
          "Responsive Design",
          "Design Systems",
          "User Research",
        ],
      },
      {
        name: "Arjun Patel",
        role: "Senior Web Designer",
        experience: "5+ years in Digital Design",
        expertise: [
          "Visual Design",
          "Typography",
          "Brand Design",
          "Design Tools",
        ],
      },
    ],
  },
  {
    id: "ms-office",
    title: "MS Office",
    description:
      "Master Microsoft Office suite including Word, Excel, PowerPoint, and more for professional productivity.",
    icon: "📊",
    neonColor: "from-green-500 to-teal-500",
    duration: "2 months",
    level: "Beginner to Advanced",
    price: "₹14,999",
    highlights: [
      "Complete MS Office suite",
      "Practical applications",
      "Industry-standard skills",
      "Certification preparation",
      "Real-world projects",
    ],
    curriculum: [
      {
        module: "Microsoft Word",
        topics: [
          "Document Creation",
          "Formatting & Styles",
          "Tables & Graphics",
          "Mail Merge",
          "Document Review",
          "Advanced Features",
        ],
      },
      {
        module: "Microsoft Excel",
        topics: [
          "Spreadsheet Basics",
          "Formulas & Functions",
          "Data Analysis",
          "Charts & Graphs",
          "Pivot Tables",
          "Macros & Automation",
        ],
      },
      {
        module: "Microsoft PowerPoint",
        topics: [
          "Presentation Design",
          "Slide Master",
          "Animations & Transitions",
          "Multimedia Integration",
          "Presentation Delivery",
          "Advanced Features",
        ],
      },
    ],
    outcomes: [
      "Create professional documents",
      "Analyze data effectively",
      "Design engaging presentations",
      "Automate office tasks",
      "Use advanced features",
      "Prepare for certification",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Windows operating system familiarity",
      "No prior MS Office experience required",
    ],
    instructors: [
      {
        name: "Priya Sharma",
        role: "MS Office Specialist",
        experience: "10+ years in Office Training",
        expertise: [
          "MS Office",
          "Data Analysis",
          "Office Automation",
          "Training",
        ],
      },
      {
        name: "Rajesh Kumar",
        role: "Senior Office Trainer",
        experience: "8+ years in Corporate Training",
        expertise: [
          "MS Office",
          "Business Applications",
          "Productivity Tools",
          "Certification",
        ],
      },
    ],
  },
  {
    id: "graphic-designing",
    title: "Graphic Designing",
    description:
      "Learn professional graphic design skills using industry-standard tools and create stunning visual content.",
    icon: "✨",
    neonColor: "from-orange-500 to-red-500",
    duration: "4 months",
    level: "Beginner to Advanced",
    price: "₹29,999",
    highlights: [
      "Industry-standard tools",
      "Portfolio development",
      "Print & digital design",
      "Brand identity design",
      "Project-based learning",
    ],
    curriculum: [
      {
        module: "Design Fundamentals",
        topics: [
          "Color Theory",
          "Typography",
          "Layout Design",
          "Composition",
          "Visual Hierarchy",
          "Design Principles",
        ],
      },
      {
        module: "Adobe Creative Suite",
        topics: [
          "Photoshop",
          "Illustrator",
          "InDesign",
          "Image Editing",
          "Vector Graphics",
          "Page Layout",
        ],
      },
      {
        module: "Specialized Design",
        topics: [
          "Logo Design",
          "Brand Identity",
          "Print Design",
          "Digital Design",
          "Social Media Graphics",
          "Packaging Design",
        ],
      },
    ],
    outcomes: [
      "Create professional designs",
      "Master design software",
      "Develop brand identities",
      "Design for print and digital",
      "Build a strong portfolio",
      "Work with design briefs",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Creative mindset",
      "Interest in design",
      "No prior design experience required",
    ],
    instructors: [
      {
        name: "Arjun Patel",
        role: "Lead Graphic Designer",
        experience: "12+ years in Graphic Design",
        expertise: [
          "Brand Design",
          "Print Design",
          "Digital Design",
          "Adobe Creative Suite",
        ],
      },
      {
        name: "Neha Gupta",
        role: "Senior Visual Designer",
        experience: "8+ years in Visual Design",
        expertise: [
          "UI Design",
          "Illustration",
          "Typography",
          "Design Systems",
        ],
      },
    ],
  },
];

export async function generateMetadata(props: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await props.params;

  console.log("courseId", courseId);
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return {
      title: "Course Not Found | LaunchVerse Academy",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${course.title} | LaunchVerse Academy`,
    description: course.description,
    keywords: `${course.title}, ${course.curriculum.map((m) => m.module).join(", ")}, tech training, LaunchVerse Academy`,
    openGraph: {
      title: `${course.title} | LaunchVerse Academy`,
      description: course.description,
      type: "website",
      url: `https://launchverse.academy/courses/${course.id}`,
      images: [
        {
          url: `/og-${course.id}.jpg`,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} | LaunchVerse Academy`,
      description: course.description,
      images: [`/og-${course.id}.jpg`],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    notFound();
  }

  return <CourseDetails course={course} />;
}
