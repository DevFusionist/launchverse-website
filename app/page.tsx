import { Metadata } from "next";
import Head from "next/head";

import { PageClient } from "./page-client";
import {
  generateLocalBusinessSchema,
  generateFaqSchema,
} from "@/components/schema-markup";

export const metadata: Metadata = {
  title:
    "🎓 Best Computer Training Institute in Kolkata | Job-Oriented Courses at Launch Verse Academy",
  description:
    "Join Launch Verse Academy – Kolkata's leading computer training institute offering industry-ready courses in Web Development, MS Office, Graphic Design & more. 100% practical training & placement support. Enroll today!",
  keywords:
    "computer training institute in kolkata, best computer institute kolkata, job oriented computer courses, ms office training kolkata, web development training kolkata, graphic designing course kolkata, launch verse academy, top computer classes kolkata, affordable computer courses kolkata",
};

export default function Home() {
  // Generate schema markup
  const localBusinessSchema = generateLocalBusinessSchema({
    name: "Launch Verse Academy",
    image: "https://scriptauradev.com/logo.png",
    url: "https://scriptauradev.com",
    telephone: "+917001478078",
    email: "sacredwebdev@gmail.com",
    address: {
      streetAddress: "131/26 (Holding No), Tentul Tala Lane (East), Ward-2",
      addressLocality: "Mankundu",
      addressRegion: "Hooghly",
      postalCode: "712139",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 09:00-22:00",
    sameAs: [
      "https://www.facebook.com/launchverseacademy",
      "https://www.instagram.com/launchverseacademy",
      "https://www.linkedin.com/company/launchverseacademy",
    ],
    description: "Best Computer Training Institute in Kolkata",
  });

  const faqSchema = generateFaqSchema({
    questions: [
      {
        question: "What courses do you offer?",
        answer: "We offer comprehensive courses in Web Development, MS Office, Graphic Design, and more with practical training and placement support.",
      },
      {
        question: "What are your fees?",
        answer: "Our course fees are competitive and vary by program. Contact us for detailed pricing information.",
      },
      {
        question: "Do you provide placement assistance?",
        answer: "Yes, we provide 100% placement support including resume building, interview preparation, and direct company tie-ups.",
      },
      {
        question: "What are your timings?",
        answer: "We are open daily from 9:00 AM to 10:00 PM with flexible batch timings to suit your schedule.",
      },
    ],
  });

  const courses = [
    {
      id: "web-development",
      title: "Web Development",
      description: "Learn modern web development with HTML, CSS, JavaScript, and frameworks. Build real projects and deploy them online.",
      duration: "6-8 months",
      level: "Beginner to Advanced",
      price: "₹25,000",
      features: ["HTML5 & CSS3", "JavaScript & React", "Node.js & Express", "Database Management", "Deployment"],
      image: "/courses/web-development.jpg",
      _neonColor: "from-blue-500 to-cyan-500",
    },
    {
      id: "graphic-design",
      title: "Graphic Design",
      description: "Master graphic design tools and principles. Create stunning visuals for print and digital media.",
      duration: "4-6 months",
      level: "Beginner to Intermediate",
      price: "₹20,000",
      features: ["Adobe Photoshop", "Adobe Illustrator", "Design Principles", "Brand Identity", "Portfolio Building"],
      image: "/courses/graphic-design.jpg",
      _neonColor: "from-purple-500 to-pink-500",
    },
    {
      id: "ms-office",
      title: "MS Office & Computer Basics",
      description: "Master Microsoft Office applications and essential computer skills for professional success.",
      duration: "3-4 months",
      level: "Beginner",
      price: "₹15,000",
      features: ["MS Word", "MS Excel", "MS PowerPoint", "Computer Basics", "Internet & Email"],
      image: "/courses/ms-office.jpg",
      _neonColor: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    {
      value: 10000,
      title: "Graduates",
      icon: "🎓",
      neonColor: "from-blue-500 to-cyan-500",
      trend: { value: 15, isPositive: true },
      suffix: "+",
    },
    {
      value: 95,
      title: "Placement Rate",
      icon: "📈",
      neonColor: "from-green-500 to-emerald-500",
      trend: { value: 3, isPositive: true },
      suffix: "%",
    },
    {
      value: 50,
      title: "Expert Instructors",
      icon: "👨‍🏫",
      neonColor: "from-purple-500 to-pink-500",
      trend: { value: 8, isPositive: true },
      suffix: "+",
    },
    {
      value: 24,
      title: "Learning Support",
      icon: "🔄",
      neonColor: "from-orange-500 to-red-500",
      trend: { value: 0, isPositive: true },
      suffix: "/7",
    },
  ];

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
          type="application/ld+json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
          type="application/ld+json"
        />
      </Head>
      <PageClient courses={courses} stats={stats} />
    </>
  );
}
