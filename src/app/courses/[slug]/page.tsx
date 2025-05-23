import { Metadata } from "next";
import { Suspense } from "react";
import { Course as CourseType } from "@/types/course";
import CourseClient from "./CourseClient";
import CourseLoading from "./loading";

// Add revalidation time of 1 hour
export const revalidate = 3600;

async function getCourseBySlug(slug: string): Promise<CourseType | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/${slug}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch course");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  const priceRange = `₹${course.priceRange.min.toLocaleString()} – ₹${course.priceRange.max.toLocaleString()}`;
  const duration = `${course.duration.min}–${course.duration.max} ${course.durationUnit}`;

  // Convert dates to ISO string directly since we know they are strings from serialization
  const publishedTime = course.createdAt;
  const modifiedTime = course.updatedAt;

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: ["Launch Verse Academy"],
      tags: ["course", "training", "education", course.title.toLowerCase()],
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
    },
    alternates: {
      canonical: `/courses/${course.slug}`,
    },
    other: {
      "course:price": priceRange,
      "course:duration": duration,
      "course:status": course.isComingSoon ? "coming-soon" : "available",
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  return (
    <Suspense fallback={<CourseLoading />}>
      <CourseContent params={params} />
    </Suspense>
  );
}

async function CourseContent({ params }: PageProps) {
  const course = await getCourseBySlug(params.slug);
  return <CourseClient initialCourse={course} />;
}
