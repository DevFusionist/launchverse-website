import { Metadata } from "next";

import { AboutClient } from "./about-client";

export const metadata: Metadata = {
  title:
    "About Launch Verse Academy | Trusted Computer Institute in Kolkata Since 2023",
  description:
    "Know more about Launch Verse Academy – a trusted name in computer education in Kolkata. Learn how our expert faculty, real-world curriculum, and student-first approach help you launch a successful career in IT & design.",
  keywords:
    "about launch verse academy, best computer institute faculty kolkata, career-oriented computer education, computer institute with placement in kolkata, institute for beginners and professionals, job training institute kolkata",
};

export default function AboutPage() {
  // This could be fetched from a CMS or database in a real application
  const teamData = {
    mission:
      "To make career-ready digital skills accessible to everyone in an affordable, job-focused format.",
    vision:
      "To empower every student with the skills and confidence to succeed in today's digital world.",
    values: [
      {
        title: "Excellence",
        description:
          "We maintain the highest standards in our curriculum and teaching methods to ensure student success.",
        icon: "⭐",
      },
      {
        title: "Practical Learning",
        description:
          "We believe in 'Learn by Doing', offering hands-on training that prepares students for real-world challenges.",
        icon: "💡",
      },
      {
        title: "Student Success",
        description:
          "We are committed to each student's success, providing personalized support and career guidance.",
        icon: "🎯",
      },
      {
        title: "Industry Alignment",
        description:
          "Our courses are designed to meet current industry demands and prepare students for immediate employment.",
        icon: "🌍",
      },
    ],
    team: [
      {
        name: "Rajesh Kumar",
        role: "CEO & Co-founder",
        bio: "Former tech lead with 12+ years of experience in web development and education technology. Passionate about making quality education accessible to all.",
        icon: "👨‍💼",
        expertise: [
          "Leadership",
          "Web Development",
          "Education Technology",
          "Business Strategy",
        ],
      },
      {
        name: "Priya Sharma",
        role: "CTO",
        bio: "Full-stack developer with expertise in WordPress and web technologies. Previously led development teams at major tech companies.",
        icon: "👩‍💻",
        expertise: [
          "WordPress",
          "Web Development",
          "System Architecture",
          "Team Leadership",
        ],
      },
      {
        name: "Arjun Patel",
        role: "Head of Design",
        bio: "Award-winning designer with expertise in UI/UX and graphic design. Focused on creating intuitive and engaging learning experiences.",
        icon: "🎨",
        expertise: [
          "UI/UX Design",
          "Graphic Design",
          "Brand Identity",
          "Design Systems",
        ],
      },
      {
        name: "Neha Gupta",
        role: "Lead Instructor",
        bio: "Experienced educator with a background in computer science. Dedicated to creating effective and engaging learning experiences.",
        icon: "👩‍🏫",
        expertise: [
          "Web Design",
          "UI/UX",
          "Teaching",
          "Curriculum Development",
        ],
      },
      {
        name: "Vikram Singh",
        role: "Technical Lead",
        bio: "Full-stack developer specializing in WordPress and modern web technologies. Passionate about building scalable applications.",
        icon: "👨‍🔧",
        expertise: ["WordPress", "PHP", "JavaScript", "System Architecture"],
      },
      {
        name: "Ananya Reddy",
        role: "Content Director",
        bio: "Former teacher turned content creator. Dedicated to developing engaging and effective learning materials.",
        icon: "📝",
        expertise: [
          "Content Creation",
          "Educational Design",
          "Digital Marketing",
          "SEO",
        ],
      },
      {
        name: "Rahul Verma",
        role: "Student Success Manager",
        bio: "Career counselor with expertise in tech industry placement. Focused on helping students achieve their career goals.",
        icon: "🎯",
        expertise: [
          "Career Counseling",
          "Placement",
          "Student Support",
          "Industry Relations",
        ],
      },
      {
        name: "Meera Kapoor",
        role: "Quality Assurance Lead",
        bio: "Quality assurance expert with a focus on educational standards and student satisfaction.",
        icon: "✨",
        expertise: [
          "Quality Assurance",
          "Process Improvement",
          "Student Feedback",
          "Standards Compliance",
        ],
      },
    ],
    stats: [
      {
        value: "10K+",
        label: "Students Trained",
      },
      {
        value: "95%",
        label: "Employment Rate",
      },
      {
        value: "50+",
        label: "Industry Partners",
      },
      {
        value: "4.9/5",
        label: "Student Satisfaction",
      },
    ],
  };

  return <AboutClient {...teamData} />;
}
