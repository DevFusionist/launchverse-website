import { Metadata } from "next";

import { CoursesClient } from "./courses-client";

export const metadata: Metadata = {
  title: "Courses | LaunchVerse Academy",
  description:
    "Explore our practical courses in Web Development (WordPress), Web Designing, MS Office, and Graphic Designing. Start your journey to professional success with industry-aligned training.",
  keywords:
    "WordPress development, web design, MS Office training, graphic design, digital skills, professional training, LaunchVerse Academy",
  openGraph: {
    title: "Courses | LaunchVerse Academy",
    description:
      "Explore our practical courses in Web Development (WordPress), Web Designing, MS Office, and Graphic Designing. Start your journey to professional success with industry-aligned training.",
    type: "website",
    url: "https://launchverse.academy/courses",
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
    title: "Courses | LaunchVerse Academy",
    description:
      "Explore our practical courses in Web Development (WordPress), Web Designing, MS Office, and Graphic Designing. Start your journey to professional success with industry-aligned training.",
    images: ["/og-courses.jpg"],
  },
};

// This would typically come from a database or CMS
const courses = [
  {
    id: "web-development-wordpress",
    title: "Web Development (WordPress)",
    description:
      "Master WordPress development and create professional websites with our comprehensive course covering themes, plugins, and custom development.",
    icon: "🌐",
    neonColor: "from-blue-500 to-purple-500",
  },
  {
    id: "web-designing",
    title: "Web Designing",
    description:
      "Learn modern web design principles, tools, and techniques to create beautiful and responsive websites.",
    icon: "🎨",
    neonColor: "from-purple-500 to-pink-500",
  },
  {
    id: "ms-office",
    title: "MS Office",
    description:
      "Master Microsoft Office suite including Word, Excel, PowerPoint, and more for professional productivity.",
    icon: "📊",
    neonColor: "from-green-500 to-teal-500",
  },
  {
    id: "graphic-designing",
    title: "Graphic Designing",
    description:
      "Learn professional graphic design skills using industry-standard tools and create stunning visual content.",
    icon: "✨",
    neonColor: "from-orange-500 to-red-500",
  },
];

export default function CoursesPage() {
  return <CoursesClient courses={courses} />;
}
