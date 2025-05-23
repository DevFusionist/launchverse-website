"use client";

import Script from "next/script";
import { Course as CourseType } from "@/types/course";
import CourseDetails from "@/components/courses/CourseDetails";
import { useTransition } from "react";

function CourseJsonLd({ course }: { course: CourseType }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Launch Verse Academy",
      sameAs: process.env.NEXT_PUBLIC_SITE_URL || "https://scriptauradev.com",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: course.priceRange.min,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability: course.isComingSoon
        ? "https://schema.org/PreOrder"
        : "https://schema.org/InStock",
    },
    timeToComplete: `P${course.duration.min}${course.durationUnit
      .charAt(0)
      .toUpperCase()}`,
    educationalLevel: "Beginner to Advanced",
    educationalCredentialAwarded: "Certificate of Completion",
    datePublished: course.createdAt,
    dateModified: course.updatedAt,
  };

  return (
    <Script
      id="course-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function CourseClient({
  initialCourse,
}: {
  initialCourse: CourseType | null;
}) {
  const [isPending, startTransition] = useTransition();

  if (!initialCourse) {
    return (
      <div className="bg-neon-background-light dark:bg-neon-background-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-5xl">
              Course Not Found
            </h1>
            <p className="mt-4 text-lg text-neon-text-light/80 dark:text-neon-text-dark/80">
              The course you&apos;re looking for doesn&apos;t exist or is no
              longer available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CourseJsonLd course={initialCourse} />
      <div className="bg-neon-background-light dark:bg-neon-background-dark py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isPending ? (
            <div className="opacity-50 transition-opacity duration-200">
              <CourseDetails course={initialCourse} variant="full" />
            </div>
          ) : (
            <CourseDetails course={initialCourse} variant="full" />
          )}
        </div>
      </div>
    </>
  );
}
