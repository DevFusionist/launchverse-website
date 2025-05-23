"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { staggerContainer, textReveal } from "@/lib/animations";
import AnimatedLayout from "@/components/ui/AnimatedLayout";
import AnimatedCard from "@/components/ui/AnimatedCard";
import NeonButton from "@/components/ui/NeonButton";
import Script from "next/script";
import { Course } from "@/types/course";
import CourseDetails from "@/components/courses/CourseDetails";

interface CoursesPageProps {
  courses: Course[];
  isLoading?: boolean;
}

function CoursesJsonLd({ courses }: { courses: Course[] }) {
  const coursesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((course, index) => ({
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
          price: course.priceRange.min.toString(),
          priceValidUntil: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
          availability: course.isComingSoon
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
        },
        timeToComplete: `P${course.duration.min}${course.durationUnit.charAt(
          0
        )}`,
        educationalLevel: "Beginner to Advanced",
        educationalCredentialAwarded: "Certificate of Completion",
        url: `https://scriptauradev.com/courses/${course.slug}`,
      },
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of courses does Launch Verse Academy offer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Launch Verse Academy offers comprehensive courses in Web Development (WordPress), Web Designing, Graphic Designing, and MS Office. Our courses are designed to be practical and job-oriented, with prices ranging from ₹5,000 to ₹11,000.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to complete a course at Launch Verse Academy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Course durations vary: Web Development (6-8 months), Web Designing (3-5 months), and Graphic Designing (4-5 months). Each course is designed to provide thorough training while accommodating different learning paces.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need prior experience to join these courses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No prior experience is required. Our courses are designed to take you from beginner to professional level, with expert instructors guiding you through each step of the learning process.",
        },
      },
      {
        "@type": "Question",
        name: "What is included in the course fee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The course fee includes comprehensive training materials, hands-on projects, certification, and career support including resume building and interview preparation.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer job placement assistance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we provide comprehensive career support including resume building, interview preparation, and job placement assistance to help our students launch their careers in the tech industry.",
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="courses-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
      />
      <Script
        id="courses-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

export default function CoursesPage({
  courses,
  isLoading = false,
}: CoursesPageProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-primary"></div>
      </div>
    );
  }

  return (
    <>
      <CoursesJsonLd courses={courses} />
      <AnimatedLayout className="section-gradient py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={textReveal}
          >
            <h1 className="text-3xl font-bold tracking-tight gradient-text sm:text-4xl">
              Explore Our Professional Training Courses
            </h1>
            <p className="mt-2 text-lg leading-8 text-neon-text-light/80 dark:text-neon-text-dark/80">
              Choose from our wide range of courses designed to help you succeed
              in the digital world.
            </p>
          </motion.div>

          {courses.length === 0 ? (
            <motion.div className="mt-16 text-center" variants={textReveal}>
              <h2 className="text-xl font-semibold text-neon-text-light dark:text-neon-text-dark">
                No Courses Available
              </h2>
              <p className="mt-2 text-neon-text-light/60 dark:text-neon-text-dark/60">
                We are currently updating our course catalog. Please check back
                soon.
              </p>
            </motion.div>
          ) : (
            <>
              <h2 className="sr-only">Available Courses</h2>
              <motion.div
                className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                variants={staggerContainer}
              >
                {courses.map((course) => (
                  <AnimatedCard
                    key={course._id}
                    className="flex flex-col items-start rounded-lg border border-neon-primary/20 dark:border-neon-primary-dark/20 bg-gradient-to-br from-white via-neon-primary/5 to-neon-accent/10 dark:bg-neon-card-dark p-6 relative group shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="absolute inset-0 z-0">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="block w-full h-full cursor-pointer"
                      />
                    </div>
                    <div className="relative z-10 w-full">
                      <CourseDetails course={course} variant="preview" />
                      {!course.isComingSoon && (
                        <div className="mt-4">
                          <NeonButton
                            href={`/courses/${course.slug}`}
                            variant="secondary"
                            size="sm"
                            disabled={course.isComingSoon}
                          >
                            {course.isComingSoon ? "Coming Soon" : "Learn more"}
                            {!course.isComingSoon && (
                              <ArrowRightIcon
                                className="ml-1 h-4 w-4"
                                aria-hidden="true"
                              />
                            )}
                          </NeonButton>
                        </div>
                      )}
                    </div>
                  </AnimatedCard>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </AnimatedLayout>
    </>
  );
}
