import { Metadata } from "next";
import Head from "next/head";

import { CoursesClient } from "./courses-client";

import { generateCourseSchema } from "@/components/schema-markup";

export const metadata: Metadata = {
  title:
    "Top Computer Courses in Kolkata | Web Dev, Graphic Design, MS Office & More",
  description:
    "Explore the best computer courses in Kolkata at Launch Verse Academy – from WordPress Web Development and Graphic Designing to MS Office and Web Design. Practical training, flexible durations & career support.",
  keywords:
    "top computer courses kolkata, web development course kolkata, ms office course kolkata, graphic design training kolkata, affordable computer course kolkata, short term job oriented courses, launch verse academy courses",
  openGraph: {
    title:
      "Top Computer Courses in Kolkata | Web Dev, Graphic Design, MS Office & More",
    description:
      "Explore the best computer courses in Kolkata at Launch Verse Academy – from WordPress Web Development and Graphic Designing to MS Office and Web Design. Practical training, flexible durations & career support.",
    type: "website",
    url: "https://scriptauradev.com/courses",
    images: [
      {
        url: "/og-courses.jpg",
        width: 1200,
        height: 630,
        alt: "LaunchVerse Academy Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Top Computer Courses in Kolkata | Web Dev, Graphic Design, MS Office & More",
    description:
      "Explore the best computer courses in Kolkata at Launch Verse Academy – from WordPress Web Development and Graphic Designing to MS Office and Web Design. Practical training, flexible durations & career support.",
    images: ["/og-courses.jpg"],
  },
};

// This would typically come from a database or CMS
const courses = [
  {
    id: "web-development-wordpress",
    title: "Web Development (WordPress Focus)",
    description:
      "Master website building with WordPress CMS, learn SEO basics, performance optimization, and security. Perfect for beginners, freelancers, and business owners.",
    icon: "🌐",
    neonColor: "from-blue-500 to-purple-500",
    duration: "6-8 Months",
    fees: "₹7,000 – ₹11,000",
    learn: [
      "Website building",
      "WordPress CMS",
      "SEO basics",
      "Performance & security",
    ],
    idealFor: ["Beginners", "Freelancers", "Business Owners"],
  },
  {
    id: "web-designing",
    title: "Web Designing",
    description:
      "Learn HTML, CSS, Responsive Design, and Figma basics. Create beautiful and functional websites with modern design principles.",
    icon: "🎨",
    neonColor: "from-purple-500 to-pink-500",
    duration: "3-5 Months",
    fees: "₹5,000 – ₹8,000",
    learn: ["HTML", "CSS", "Responsive Design", "Figma basics"],
    idealFor: ["Creative minds", "UI/UX enthusiasts"],
  },
  {
    id: "graphic-designing",
    title: "Graphic Designing",
    description:
      "Master Photoshop, Illustrator, Logo Design, and Print Media. Create stunning visual content for digital and print platforms.",
    icon: "✨",
    neonColor: "from-orange-500 to-red-500",
    duration: "4-5 Months",
    fees: "₹6,000 – ₹10,000",
    learn: ["Photoshop", "Illustrator", "Logo Design", "Print Media"],
    idealFor: ["Artists", "Freelancers", "Social Media Marketers"],
  },
  {
    id: "ms-office",
    title: "MS Office (Basic to Advanced)",
    description:
      "Master Word, Excel (including Formulas and Pivot Tables), PowerPoint, and other Office tools for professional productivity.",
    icon: "📊",
    neonColor: "from-green-500 to-teal-500",
    duration: "3-6 Months",
    fees: "₹5,000 – ₹8,000",
    learn: [
      "Word",
      "Excel (Formulas, Pivot Tables)",
      "PowerPoint",
      "Office tools",
    ],
    idealFor: ["Students", "Job seekers", "Office workers"],
  },
];

export default function CoursesPage() {
  // Course Schema Data
  const courseSchemas = [
    {
      name: "Web Development Course",
      description:
        "Comprehensive Web Development course focusing on WordPress, HTML, CSS, and JavaScript. Ideal for beginners and freelancers.",
      provider: {
        name: "Launch Verse Academy",
        sameAs: "https://www.launchverseacademy.com",
      },
    },
    {
      name: "Web Designing Course",
      description:
        "Learn modern web design principles, tools, and techniques to create beautiful and responsive websites. Perfect for creative minds and UI/UX enthusiasts.",
      provider: {
        name: "Launch Verse Academy",
        sameAs: "https://www.launchverseacademy.com",
      },
    },
    {
      name: "Graphic Designing Course",
      description:
        "Master professional graphic design skills using industry-standard tools. Create stunning visual content for digital and print platforms.",
      provider: {
        name: "Launch Verse Academy",
        sameAs: "https://www.launchverseacademy.com",
      },
    },
    {
      name: "MS Office Course",
      description:
        "Master Microsoft Office suite including Word, Excel, PowerPoint, and more. Essential skills for professional productivity.",
      provider: {
        name: "Launch Verse Academy",
        sameAs: "https://www.launchverseacademy.com",
      },
    },
  ];

  // Generate schemas
  const courseSchemaScripts = courseSchemas.map((course) =>
    generateCourseSchema(course),
  );

  return (
    <>
      <Head>
        {courseSchemaScripts.map((schema, index) => (
          <script
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
            key={index}
            type="application/ld+json"
          />
        ))}
      </Head>
      <CoursesClient courses={courses} />
    </>
  );
}
