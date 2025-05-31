import { AboutClient } from "./about-client";

export const metadata = {
  title: "About Us | Launch Verse Academy",
  description:
    "Learn about Launch Verse Academy's mission, vision, and the team behind your learning journey.",
};

export default function AboutPage() {
  // This could be fetched from a CMS or database in a real application
  const teamData = {
    mission:
      "To democratize tech education and empower individuals to build successful careers in technology.",
    vision:
      "A world where quality tech education is accessible to everyone, fostering innovation and growth.",
    values: [
      {
        title: "Excellence",
        description:
          "We maintain the highest standards in our curriculum and teaching methods.",
        icon: "⭐",
      },
      {
        title: "Innovation",
        description:
          "We continuously evolve our programs to stay ahead of industry trends.",
        icon: "💡",
      },
      {
        title: "Community",
        description:
          "We foster a supportive learning environment where students grow together.",
        icon: "🤝",
      },
      {
        title: "Accessibility",
        description:
          "We make quality education accessible to everyone, regardless of background.",
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
