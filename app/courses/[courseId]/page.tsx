import { Metadata } from "next";
import { notFound } from "next/navigation";
import Head from "next/head";

import CourseDetails from "./course-details";

import { generateCourseSchema } from "@/components/schema-markup";

// This would typically come from a database or CMS
export const courses = [
  {
    id: "web-development-wordpress",
    title: "Web Development Course in Chandannagar",
    description:
      "Master frontend & backend development with live projects at Launch Verse Academy. Industry-ready training with certification & job assistance. Learn HTML5, CSS3, JavaScript, PHP, MySQL, WordPress, and more.",
    icon: "🌐",
    neonColor: "from-blue-500 to-purple-500",
    duration: "6-8 Months",
    level: "Beginner to Advanced",
    price: "₹7,000 – ₹11,000",
    highlights: [
      "Govt. certified training institute in Chandannagar",
      "Industry-level curriculum by working professionals",
      "Real-life project exposure & weekly evaluations",
      "100% practical, classroom + digital hybrid learning",
      "Certification, career counseling & job assistance",
      "Personal mentorship & extended support",
    ],
    curriculum: [
      {
        title: "Frontend Development",
        topics: [
          "HTML5 & CSS3 Fundamentals",
          "Bootstrap Framework",
          "JavaScript & jQuery",
          "Responsive Web Design",
          "UI/UX Principles",
          "Cross-browser Compatibility",
        ],
      },
      {
        title: "Backend Development",
        topics: [
          "PHP Programming",
          "MySQL Database",
          "API Development",
          "WordPress Development",
          "Security Best Practices",
          "Performance Optimization",
        ],
      },
      {
        title: "Tools & Deployment",
        topics: [
          "Git & GitHub",
          "cPanel & FTP",
          "SEO Fundamentals",
          "Website Hosting",
          "Domain Management",
          "Website Maintenance",
        ],
      },
    ],
    outcomes: [
      "Build responsive, modern websites",
      "Develop dynamic web applications",
      "Create and manage databases",
      "Deploy and maintain websites",
      "Implement security best practices",
      "Start a career in web development",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "No prior coding experience required",
      "Dedication to learn and practice",
      "Own laptop (recommended)",
    ],
    instructors: [
      {
        name: "Rajesh Kumar",
        role: "Lead Web Developer",
        bio: "8+ years in Web Development",
        image: "/instructors/rajesh.jpg",
      },
      {
        name: "Priya Sharma",
        role: "Senior Frontend Developer",
        bio: "6+ years in Web Development",
        image: "/instructors/priya.jpg",
      },
    ],
    benefits: {
      batchSize: "4-6 students",
      liveProjects: true,
      jobAssistance: true,
      govtCertification: true,
      personalizedMentorship: true,
      extendedSupport: true,
    },
    reviews: [
      {
        name: "Sourav Bera",
        role: "Alumni",
        rating: 5,
        comment:
          "Best institute in Chandannagar! I got placed as a junior web developer after this course.",
      },
    ],
    faqs: [
      {
        question: "What is the duration of the course?",
        answer: "6 to 8 months depending on the track you choose.",
      },
      {
        question: "Do you provide certification?",
        answer:
          "Yes. You'll get a Govt. approved certificate with a unique verification code.",
      },
      {
        question: "Will I build live websites?",
        answer: "Yes! You'll create real websites and deploy them online.",
      },
      {
        question: "Is there placement support?",
        answer:
          "We assist with resume prep, interview training, and direct tie-ups with local agencies and IT companies.",
      },
    ],
    enrollment: {
      address: "131/26 Tentul Tala Lane (East), Mankundu, Hooghly – 712139",
      phone: ["7001478078", "7508162363"],
      timing: "9 AM – 10 PM",
      whatsapp: true,
    },
  },
  {
    id: "web-designing",
    title: "Web Design Course in Kolkata | Launch Verse Academy",
    description:
      "Join the best Web Design Course in Kolkata. Learn HTML5, CSS3, JavaScript & more. 100% practical training & job assistance. Enroll today!",
    icon: "🎨",
    neonColor: "from-purple-500 to-pink-500",
    duration: "4-5 Months",
    level: "Beginner to Advanced",
    price: "₹5,000 – ₹8,000",
    highlights: [
      "Best web design institute in Kolkata",
      "100% practical training with live projects",
      "Industry-standard curriculum",
      "Portfolio development & job assistance",
      "Flexible batch timings",
      "Govt. certified training",
    ],
    curriculum: [
      {
        title: "Web Design Fundamentals",
        topics: [
          "HTML5 & CSS3 Basics",
          "Responsive Web Design",
          "JavaScript Fundamentals",
          "Bootstrap Framework",
          "UI/UX Principles",
          "Cross-browser Compatibility",
        ],
      },
      {
        title: "Design Tools & Software",
        topics: [
          "Adobe Photoshop",
          "Adobe Illustrator",
          "Figma & Canva",
          "Wireframing & Prototyping",
          "Design Systems",
          "Visual Design",
        ],
      },
      {
        title: "Advanced Web Design",
        topics: [
          "Modern CSS (Flexbox & Grid)",
          "JavaScript & jQuery",
          "WordPress Basics",
          "Website Optimization",
          "Portfolio Creation",
          "Freelancing Tips",
        ],
      },
    ],
    outcomes: [
      "Create responsive, modern websites",
      "Master industry-standard design tools",
      "Build professional portfolios",
      "Understand UI/UX principles",
      "Optimize websites for performance",
      "Start a career in web design",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Creative mindset",
      "No prior coding experience required",
      "Own laptop (recommended)",
    ],
    instructors: [
      {
        name: "Neha Gupta",
        role: "Lead UI/UX Designer",
        bio: "7+ years in Web Design",
        image: "/instructors/neha.jpg",
      },
      {
        name: "Arjun Patel",
        role: "Senior Web Designer",
        bio: "5+ years in Digital Design",
        image: "/instructors/arjun.jpg",
      },
    ],
    benefits: {
      batchSize: "4-6 students",
      liveProjects: true,
      jobAssistance: true,
      govtCertification: true,
      personalizedMentorship: true,
      extendedSupport: true,
    },
    reviews: [
      {
        name: "Rahul Das",
        role: "Alumni",
        rating: 5,
        comment:
          "Best web design course in Kolkata! The practical training and portfolio development helped me start my freelancing career.",
      },
    ],
    faqs: [
      {
        question: "What is the web design course fee in Kolkata?",
        answer:
          "Our web design course fee ranges from ₹5,000 to ₹8,000, making it one of the most affordable web design courses in Kolkata.",
      },
      {
        question: "Is this a government certified web design course?",
        answer:
          "Yes, we are a government certified training institute offering web design courses with a valid certificate and unique verification code.",
      },
      {
        question: "Do you provide job assistance after the course?",
        answer:
          "Yes, we offer 100% placement assistance including resume preparation, interview training, and direct tie-ups with web design agencies.",
      },
      {
        question: "Can beginners join this web design course?",
        answer:
          "Absolutely! Our web design course is designed for beginners. Basic computer knowledge is sufficient to start learning.",
      },
      {
        question: "What tools will I learn in this course?",
        answer:
          "You'll learn industry-standard tools including HTML5, CSS3, JavaScript, Photoshop, Illustrator, Figma, and Canva.",
      },
    ],
    enrollment: {
      address: "131/26 Tentul Tala Lane (East), Mankundu, Hooghly – 712139",
      phone: ["7001478078", "7508162363"],
      timing: "9 AM – 10 PM",
      whatsapp: true,
    },
  },
  {
    id: "ms-office",
    title:
      "MS Office Course in Kolkata – Launch Verse Academy | Certificate & Placement",
    description:
      "Join the best MS Office course in Kolkata at Launch Verse Academy. Learn Word, Excel, PowerPoint, Outlook & more. Affordable fees. Certificate & job support available.",
    icon: "📊",
    neonColor: "from-green-500 to-teal-500",
    duration: "3-6 Months",
    level: "Beginner to Advanced",
    price: "₹5,000 – ₹8,000",
    highlights: [
      "Best MS Office training institute in Kolkata",
      "100% practical training with live projects",
      "Industry-standard curriculum",
      "Certificate & job assistance",
      "Flexible batch timings",
      "Govt. certified training",
    ],
    curriculum: [
      {
        title: "MS Word (Beginner to Advanced)",
        topics: [
          "Document Creation & Formatting",
          "Tables, Charts & Graphics",
          "Mail Merge & Templates",
          "Advanced Formatting",
          "Document Review & Collaboration",
          "Professional Document Design",
        ],
      },
      {
        title: "MS Excel (Complete Training)",
        topics: [
          "Basic to Advanced Formulas",
          "Data Analysis & Visualization",
          "Pivot Tables & Charts",
          "Macros & Automation",
          "Business Applications",
          "Financial Modeling",
        ],
      },
      {
        title: "MS PowerPoint & Outlook",
        topics: [
          "Professional Presentations",
          "Slide Master & Templates",
          "Animations & Transitions",
          "Email Management",
          "Calendar & Task Management",
          "Business Communication",
        ],
      },
    ],
    outcomes: [
      "Master MS Office applications professionally",
      "Create business documents efficiently",
      "Analyze data using advanced Excel",
      "Design engaging presentations",
      "Manage emails and schedules effectively",
      "Start a career in office administration",
    ],
    prerequisites: [
      "Basic computer knowledge",
      "Windows operating system familiarity",
      "No prior MS Office experience required",
      "Own laptop (recommended)",
    ],
    instructors: [
      {
        name: "Priya Sharma",
        role: "MS Office Specialist",
        bio: "10+ years in Office Training",
        image: "/instructors/priya.jpg",
      },
      {
        name: "Rajesh Kumar",
        role: "Senior Office Trainer",
        bio: "8+ years in Corporate Training",
        image: "/instructors/rajesh.jpg",
      },
    ],
    benefits: {
      batchSize: "4-6 students",
      liveProjects: true,
      jobAssistance: true,
      govtCertification: true,
      personalizedMentorship: true,
      extendedSupport: true,
    },
    reviews: [
      {
        name: "Amit Sen",
        role: "Alumni",
        rating: 5,
        comment:
          "Best MS Office course in Kolkata! The practical training and certification helped me secure a job as an office administrator.",
      },
    ],
    faqs: [
      {
        question: "What is the cost of MS Office course in Kolkata?",
        answer:
          "Our MS Office course fees range between ₹5,000 – ₹8,000 depending on batch timing and duration (3–6 months).",
      },
      {
        question: "Which is the best MS Office course in Kolkata?",
        answer:
          "Launch Verse Academy is rated among the top MS Office training institutes offering practical learning, certification, and placement support.",
      },
      {
        question: "What is covered in the MS Office course?",
        answer:
          "The course includes MS Word, Excel, PowerPoint, Outlook, file management, internet basics, and more. We cover everything from basic to advanced features.",
      },
      {
        question: "Is job placement available after the MS Office course?",
        answer:
          "Yes, we offer placement assistance after successful course completion, including resume preparation and interview training.",
      },
      {
        question: "Is this MS Office course suitable for beginners?",
        answer:
          "Absolutely! Our course is designed for beginners. Basic computer knowledge is sufficient to start learning.",
      },
      {
        question: "Do you provide a certificate after the course?",
        answer:
          "Yes, you'll receive a government-approved certificate with a unique verification code upon successful completion.",
      },
    ],
    enrollment: {
      address: "131/26 Tentul Tala Lane (East), Mankundu, Hooghly – 712139",
      phone: ["7001478078", "7508162363"],
      timing: "9 AM – 10 PM",
      whatsapp: true,
    },
  },
  {
    id: "graphic-designing",
    title: "Graphic Design Course in Kolkata",
    description:
      "Launch your creative career with our Graphic Design Course in Kolkata. Learn Photoshop, Illustrator, UI/UX, and more from experts. Offline & Online classes available. Get certified and placed with 100% job assistance.",
    icon: "✨",
    neonColor: "from-orange-500 to-red-500",
    duration: "4-6 Months",
    level: "Beginner to Advanced",
    price: "₹6,000 – ₹10,000",
    highlights: [
      "Industry-standard curriculum (Photoshop, Illustrator, etc.)",
      "Live projects & real-world assignments",
      "Portfolio development",
      "Flexible batch timings",
      "Offline & online training",
      "100% placement assistance",
    ],
    curriculum: [
      {
        title: "Design Fundamentals",
        topics: [
          "Color Theory & Typography",
          "Layout & Composition",
          "Visual Hierarchy",
          "Design Principles",
          "Brand Identity",
          "Design Psychology",
        ],
      },
      {
        title: "Adobe Creative Suite",
        topics: [
          "Adobe Photoshop",
          "Adobe Illustrator",
          "CorelDRAW",
          "Image Editing",
          "Vector Graphics",
          "Digital Illustration",
        ],
      },
      {
        title: "Professional Design",
        topics: [
          "Logo Design",
          "UI/UX Design Basics",
          "Print & Digital Media",
          "Social Media Graphics",
          "Portfolio Creation",
          "Freelancing Tips",
        ],
      },
    ],
    outcomes: [
      "Create professional designs using industry tools",
      "Develop brand identities and logos",
      "Design for both print and digital media",
      "Build a strong design portfolio",
      "Understand UI/UX design principles",
      "Start a career in graphic design",
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
        bio: "12+ years in Graphic Design",
        image: "/instructors/arjun.jpg",
      },
      {
        name: "Neha Gupta",
        role: "Senior Visual Designer",
        bio: "8+ years in Visual Design",
        image: "/instructors/neha.jpg",
      },
    ],
    benefits: {
      batchSize: "4-6 students",
      liveProjects: true,
      jobAssistance: true,
      govtCertification: true,
      personalizedMentorship: true,
      extendedSupport: true,
    },
    reviews: [
      {
        name: "Priya Sharma",
        role: "Alumni",
        rating: 5,
        comment:
          "Best graphic design course in Kolkata! The practical training and portfolio development helped me land my dream job.",
      },
    ],
    faqs: [
      {
        question: "What is the course fee?",
        answer:
          "The course fee ranges from ₹6,000 to ₹10,000 depending on the track you choose.",
      },
      {
        question: "Will I get a certificate?",
        answer:
          "Yes, you'll receive a Govt. approved certificate with a unique QR code for verification.",
      },
      {
        question: "Do you provide job assistance?",
        answer:
          "Yes, we offer 100% placement assistance including resume preparation, interview training, and direct tie-ups with design agencies.",
      },
      {
        question: "Do I need any prior knowledge?",
        answer:
          "No prior design experience is required. Basic computer knowledge and a creative mindset are sufficient.",
      },
    ],
    enrollment: {
      address: "131/26 Tentul Tala Lane (East), Mankundu, Hooghly – 712139",
      phone: ["7001478078", "7508162363"],
      timing: "9 AM – 10 PM",
      whatsapp: true,
    },
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
    keywords: `${course.title}, ${course.curriculum.map((m) => m.title).join(", ")}, tech training, LaunchVerse Academy`,
    openGraph: {
      title: `${course.title} | LaunchVerse Academy`,
      description: course.description,
      type: "website",
      url: `https://scriptauradev.com/courses/${course.id}`,
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

  // Generate course schema
  const courseSchema = generateCourseSchema({
    name: course.title,
    description: course.description,
    provider: {
      name: "Launch Verse Academy",
      sameAs: "https://www.launchverseacademy.com",
    },
  });

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseSchema),
          }}
          type="application/ld+json"
        />
      </Head>
      <CourseDetails course={course} />
    </>
  );
}
