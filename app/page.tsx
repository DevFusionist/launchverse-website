import { Metadata } from "next";
import Head from "next/head";

import { CourseCard } from "@/components/course-card";
import { StatCard } from "@/components/stat-card";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { CTAButtons } from "@/components/cta-buttons";
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
  // Local Business Schema Data
  const localBusinessData = {
    name: "Launch Verse Academy",
    image: "https://www.launchverseacademy.com/logo.png",
    url: "https://www.launchverseacademy.com",
    telephone: "+91-7001478078",
    email: "sacredwebdev@gmail.com",
    address: {
      streetAddress: "131/26 Tentul Tala Lane (East), Ward-2, Mankundu",
      addressLocality: "Hooghly",
      addressRegion: "West Bengal",
      postalCode: "712139",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 09:00-22:00",
    sameAs: [
      "https://www.facebook.com/launchverseacademy",
      "https://www.instagram.com/launchverseacademy",
      "https://www.linkedin.com/company/launchverseacademy",
    ],
    description:
      "Launch Verse Academy is a premier computer training institute in Kolkata, offering courses in Web Development, Web Designing, Graphic Designing, and MS Office with practical training and placement support.",
  };

  // FAQ Schema Data
  const faqData = {
    questions: [
      {
        question: "What are the best computer courses for beginners in 2025?",
        answer:
          "At Launch Verse Academy, we offer beginner-friendly courses like Web Development (using WordPress), Graphic Designing, MS Office, and Web Designing. These courses are perfect for starting a career in IT and freelancing.",
      },
      {
        question: "Which computer course has the highest job opportunities?",
        answer:
          "Our WordPress Web Development and Graphic Designing courses are in high demand. They offer great freelancing and job opportunities both in India and abroad.",
      },
      {
        question:
          "How long does it take to complete a professional computer course?",
        answer:
          "Our professional courses take 3 to 8 months depending on the subject: MS Office (3-6 months), Web Designing (3-5 months), Graphic Designing (4-5 months), and WordPress Web Development (6-8 months).",
      },
      {
        question: "What are the fees for computer courses in India in 2025?",
        answer:
          "At Launch Verse Academy, our course fees range between ₹5,000 to ₹11,000. We also offer flexible payments and discounts on early enrollment.",
      },
      {
        question:
          "Do you provide a government-recognized certificate after course completion?",
        answer:
          "We provide a professional, verifiable certificate with QR code. You can verify the certificate online anytime using our website.",
      },
      {
        question: "How to verify a certificate issued by Launch Verse Academy?",
        answer:
          "Go to our Certificate Verification Page, enter the unique certificate ID, and get instant validation of authenticity.",
      },
      {
        question: "Do you offer job placement after course completion?",
        answer:
          "Yes, we offer 100% placement assistance for eligible students. Our team helps with resume building, interview preparation, and job referrals.",
      },
      {
        question:
          "Can I get freelancing work after completing a web development or graphic design course?",
        answer:
          "Absolutely! Our courses are designed to help students become job-ready or start earning through freelancing platforms like Fiverr, Upwork, and Freelancer.",
      },
      {
        question: "Which computer course is best for freelancing?",
        answer:
          "Courses like WordPress Web Development and Graphic Designing are the best for freelancing. We train students to create real-world projects and client portfolios.",
      },
      {
        question: "Where is Launch Verse Academy located?",
        answer:
          "We are located at 131/26 Tentul Tala Lane (East), Ward-2, Mankundu, Hooghly, West Bengal – 712139. Visit anytime between 9 AM to 10 PM.",
      },
      {
        question: "What are the office hours of Launch Verse Academy?",
        answer:
          "We are open every day from 9:00 AM to 10:00 PM, including weekends.",
      },
      {
        question: "How to contact Launch Verse Academy for admission?",
        answer:
          "You can call or WhatsApp us at: 7001478078 (Business) or 7508162363 (Personal).",
      },
      {
        question: "What is the fee structure for your computer courses?",
        answer:
          "Web Development (WordPress): ₹7,000 – ₹11,000, Web Designing: ₹5,000 – ₹8,000, Graphic Designing: ₹6,000 – ₹10,000, MS Office: ₹5,000 – ₹8,000. For batch-wise details, please contact us directly.",
      },
      {
        question: "Is there any EMI or part-payment option available?",
        answer:
          "Yes, we offer flexible EMI and installment options for eligible students. Contact our office to learn more.",
      },
      {
        question: "How to enroll in a computer course at Launch Verse Academy?",
        answer:
          "Enrollment is easy. You can walk into our center, WhatsApp us, or enroll through our upcoming online portal.",
      },
    ],
  };

  // Generate schemas
  const localBusinessSchema = generateLocalBusinessSchema(localBusinessData);
  const faqSchema = generateFaqSchema(faqData);

  const courses = [
    {
      title: "Web Development (WordPress)",
      description:
        "Master WordPress development and create professional websites with our comprehensive course covering themes, plugins, and custom development.",
      icon: "🌐",
      neonColor: "from-blue-500 to-purple-500",
      learnMoreRoute: "/courses/web-development-wordpress",
    },
    {
      title: "Web Designing",
      description:
        "Learn modern web design principles, tools, and techniques to create beautiful and responsive websites.",
      icon: "🎨",
      neonColor: "from-purple-500 to-pink-500",
      learnMoreRoute: "/courses/web-designing",
    },
    {
      title: "MS Office",
      description:
        "Master Microsoft Office suite including Word, Excel, PowerPoint, and more for professional productivity.",
      icon: "📊",
      neonColor: "from-green-500 to-teal-500",
      learnMoreRoute: "/courses/ms-office",
    },
    {
      title: "Graphic Designing",
      description:
        "Learn professional graphic design skills using industry-standard tools and create stunning visual content.",
      icon: "✨",
      neonColor: "from-orange-500 to-red-500",
      learnMoreRoute: "/courses/graphic-designing",
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

      <main className="flex flex-col items-center justify-center gap-8 py-8 md:py-16">
        {/* Hero Section */}
        <HeroSection />

        {/* CTA Buttons */}
        <CTAButtons />

        {/* Featured Courses */}
        <section
          aria-label="Featured courses"
          className="w-full max-w-6xl mt-8"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Our Professional Courses
          </h2>
          <p className="text-default-500 text-center mb-8 max-w-2xl mx-auto">
            Choose from our practical courses designed to help you succeed in
            the digital world. Each program includes hands-on training,
            industry-standard tools, and career support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section
          aria-label="Success metrics"
          className="w-full max-w-6xl mt-12"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Proven Track Record of Success
          </h2>
          <p className="text-default-500 text-center mb-8 max-w-2xl mx-auto">
            Join our community of successful tech professionals. Our
            comprehensive training programs and dedicated support have helped
            thousands achieve their career goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                {...{ ...stat, _neonColor: stat.neonColor }}
              />
            ))}
          </div>
        </section>

        {/* Trust Indicators */}
        <section
          aria-label="Trust indicators"
          className="w-full max-w-6xl mt-12 text-center"
        >
          <h2 className="text-2xl font-semibold mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              _neonColor="from-blue-500 to-cyan-500"
              description="Our curriculum is designed by industry experts and updated regularly to match current market demands."
              icon="��"
              title="Industry-Relevant Curriculum"
            />
            <FeatureCard
              _neonColor="from-purple-500 to-pink-500"
              description="Learn from experienced trainers who bring real-world expertise to the classroom."
              icon="👨‍🏫"
              title="Experienced Trainers"
            />
            <FeatureCard
              _neonColor="from-green-500 to-emerald-500"
              description="Get dedicated placement assistance, resume building, and interview preparation support."
              icon="💼"
              title="Placement Assistance"
            />
            <FeatureCard
              _neonColor="from-orange-500 to-red-500"
              description="Work on real-time projects that give you hands-on experience and a portfolio to showcase."
              icon="💻"
              title="Real-Time Projects"
            />
            <FeatureCard
              _neonColor="from-blue-500 to-purple-500"
              description="Choose from flexible batch timings between 9 AM to 10 PM to suit your schedule."
              icon="🕘"
              title="Flexible Batches"
            />
            <FeatureCard
              _neonColor="from-purple-500 to-pink-500"
              description="Join our community of satisfied students with a 5-star rating on Google."
              icon="🏆"
              title="5-Star Rated"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section
          aria-label="Frequently Asked Questions"
          className="w-full max-w-6xl mt-12"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-default-500 text-center mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our courses, certification,
            placement, and more.
          </p>
          <div className="grid gap-6">
            {faqData.questions.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  <span className="ml-6 flex-shrink-0">
                    <svg
                      className="h-6 w-6 transform group-open:rotate-180 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
