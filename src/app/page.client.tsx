"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, textReveal } from "@/lib/animations";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnimatedCard from "@/components/ui/AnimatedCard";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import NeonButton from "@/components/ui/NeonButton";
import Script from "next/script";

// Data constants
const features = [
  {
    name: "Expert Instructors",
    description:
      "Learn from industry professionals with years of real-world experience.",
  },
  {
    name: "Hands-on Projects",
    description: "Build real projects that you can showcase in your portfolio.",
  },
  {
    name: "Career Support",
    description:
      "Get help with resume building, interview preparation, and job placement.",
  },
];

const testimonials = [
  {
    content:
      "The course was comprehensive and well-structured. I landed my dream job within a month of completing the program!",
    name: "Sarah Johnson",
    role: "Web Developer",
  },
  {
    content:
      "The instructors are amazing and always available to help. The hands-on projects really helped me understand the concepts better.",
    name: "Michael Chen",
    role: "Software Engineer",
  },
  {
    content:
      "I had no prior experience in tech, but the course made it easy to learn. Now I'm working as a full-stack developer!",
    name: "Priya Sharma",
    role: "Full-stack Developer",
  },
];

const featuredCourses = [
  {
    title: "Web Development (WordPress)",
    description:
      "Learn to build modern websites using WordPress and essential web technologies.",
    price: "₹7,000 – ₹11,000",
    duration: "6–8 months",
    href: "/courses/web-development",
  },
  {
    title: "Web Designing",
    description:
      "Master the art of creating beautiful and responsive web designs.",
    price: "₹5,000 – ₹8,000",
    duration: "3–5 months",
    href: "/courses/web-designing",
  },
  {
    title: "Graphic Designing",
    description: "Create stunning visual designs for print and digital media.",
    price: "₹6,000 – ₹10,000",
    duration: "4–5 months",
    href: "/courses/graphic-designing",
  },
];

function HomePageJsonLd() {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Launch Verse Academy",
    image: "https://scriptauradev.com/logo.png",
    url: "https://scriptauradev.com",
    telephone: "+91-7001478078",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Chandannagar",
      addressLocality: "Chandannagar",
      addressRegion: "West Bengal",
      postalCode: "712136",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 09:00-22:00",
    description:
      "Launch Verse Academy offers practical training in Web Development, Graphic Designing, Web Designing, and MS Office. Get certified and launch your career today.",
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featuredCourses.map((course, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: {
          "@type": "Organization",
          name: "Launch Verse Academy",
          sameAs: "https://scriptauradev.com",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: course.price.split("–")[0].replace(/[^0-9]/g, ""),
          priceValidUntil: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
          availability: "https://schema.org/InStock",
        },
        timeToComplete: `P${course.duration
          .split("–")[0]
          .replace(/[^0-9]/g, "")}M`,
        educationalLevel: "Beginner to Advanced",
        educationalCredentialAwarded: "Certificate of Completion",
        url: `https://scriptauradev.com${course.href}`,
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What courses do you offer at Launch Verse Academy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer comprehensive courses in Web Development (WordPress), Web Designing, and Graphic Designing. Our courses are designed to be practical and job-oriented, with prices ranging from ₹5,000 to ₹11,000.",
        },
      },
      {
        "@type": "Question",
        name: "How long are the courses at Launch Verse Academy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our course durations vary: Web Development (6-8 months), Web Designing (3-5 months), and Graphic Designing (4-5 months). Each course is designed to provide thorough training while accommodating different learning paces.",
        },
      },
      {
        "@type": "Question",
        name: "Do you provide job placement assistance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we provide comprehensive career support including resume building, interview preparation, and job placement assistance to help our students launch their careers in the tech industry.",
        },
      },
      {
        "@type": "Question",
        name: "What are the class timings at Launch Verse Academy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our institute is open from 9:00 AM to 10:00 PM, seven days a week. We offer flexible batch timings to accommodate different schedules.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need prior experience to join your courses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No prior experience is required. Our courses are designed to take you from beginner to professional level, with expert instructors guiding you through each step of the learning process.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="local-business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <Script
        id="course-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

export default function HomeClient() {
  return (
    <>
      <HomePageJsonLd />
      <AnimatedLayout>
        <div className="relative isolate">
          {/* Hero Section */}
          <motion.div
            className="relative px-6 pt-14 lg:px-8"
            variants={textReveal}
            initial="hidden"
            animate="show"
          >
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
              <motion.h1
                className="text-4xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-6xl"
                variants={textReveal}
              >
                Best Web Development, Graphic Designing & MS Office Courses in
                Chandannagar
              </motion.h1>
              <motion.p
                className="mt-6 text-lg leading-8 text-neon-text-light/80 dark:text-neon-text-dark/80"
                variants={textReveal}
              >
                Join our comprehensive courses designed to help you master the
                skills needed for a successful career in technology.
              </motion.p>
              <motion.div
                className="mt-10 flex items-center justify-center gap-x-6"
                variants={textReveal}
              >
                <Link
                  href="/courses"
                  className="rounded-md bg-neon-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neon-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-primary"
                >
                  Browse Courses
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-semibold leading-6 text-neon-text-light dark:text-neon-text-dark"
                >
                  Contact Us <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={textReveal}
            >
              <h2 className="text-base font-semibold leading-7 text-neon-primary dark:text-neon-primary-dark">
                Why Choose Us
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-4xl">
                Everything you need to succeed
              </p>
              <p className="mt-6 text-lg leading-8 text-neon-text-light/80 dark:text-neon-text-dark/80">
                We provide comprehensive training and support to help you launch
                your career in technology.
              </p>
            </motion.div>

            <motion.dl
              className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3"
              variants={staggerContainer}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.name}
                  variants={staggerItem}
                  className="flex flex-col"
                >
                  <dt className="text-base font-semibold leading-7 text-neon-text-light dark:text-neon-text-dark">
                    {feature.name}
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-neon-text-light/80 dark:text-neon-text-dark/80">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={textReveal}
            >
              <h2 className="text-base font-semibold leading-7 text-neon-primary dark:text-neon-primary-dark">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-4xl">
                What our students say
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
              variants={staggerContainer}
            >
              {testimonials.map((testimonial) => (
                <AnimatedCard
                  key={testimonial.name}
                  className="flex flex-col justify-between rounded-lg border border-neon-primary/20 dark:border-neon-primary-dark/20 bg-neon-card-light dark:bg-neon-card-dark p-8"
                >
                  <p className="text-base leading-7 text-neon-text-light/80 dark:text-neon-text-dark/80">
                    {testimonial.content}
                  </p>
                  <div className="mt-6 text-sm">
                    <p className="font-semibold text-neon-text-light dark:text-neon-text-dark">
                      {testimonial.name}
                    </p>
                    <p
                      className="text-neon-text-light/60 dark:text-neon-text-dark/60"
                      aria-label={`Role: ${testimonial.role}`}
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </AnimatedCard>
              ))}
            </motion.div>
          </motion.div>

          {/* Featured Courses Section */}
          <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-4xl">
                Featured Courses
              </h2>
              <p className="mt-2 text-lg leading-8 text-neon-text-light/80 dark:text-neon-text-dark/80">
                Choose from our wide range of courses designed to help you
                succeed in the digital world.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:max-w-none lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <article
                  key={course.title}
                  className="relative flex flex-col items-start bg-neon-card-light dark:bg-neon-card-dark p-6 rounded-lg border border-neon-primary/20 dark:border-neon-primary-dark/20 hover:shadow-neon-sm transition-shadow"
                >
                  <div className="flex flex-col items-start w-full">
                    <h3 className="text-lg font-semibold leading-6 text-neon-text-light dark:text-neon-text-dark group-hover:text-neon-primary dark:group-hover:text-neon-primary-dark">
                      {course.title}
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-neon-text-light/80 dark:text-neon-text-dark/80">
                      {course.description}
                    </p>
                    <div className="mt-4 flex items-center gap-x-4 text-xs text-neon-text-light/60 dark:text-neon-text-dark/60">
                      <span>
                        <strong>Price:</strong> {course.price}
                      </span>
                      <span>
                        <strong>Duration:</strong> {course.duration}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link href={course.href} className="block">
                        <NeonButton
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Learn more
                          <ArrowRightIcon
                            className="ml-1 h-4 w-4"
                            aria-hidden="true"
                          />
                        </NeonButton>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="bg-neon-card-light dark:bg-neon-card-dark p-8 rounded-lg border border-neon-primary/20 dark:border-neon-primary-dark/20">
                <NeonButton href="/courses" variant="primary" size="md">
                  View All Courses
                </NeonButton>
              </div>
            </div>
          </div>
        </div>
      </AnimatedLayout>
    </>
  );
}
