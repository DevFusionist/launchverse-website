import { Course } from "@/types/course";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import styles from "./CourseCard.module.css";

// Dynamically import CourseDetails with loading fallback
const CourseDetails = dynamic(() => import("./CourseDetails"), {
  loading: () => (
    <div className="animate-pulse">
      <div className="h-6 bg-neon-primary/10 dark:bg-neon-primary-dark/10 rounded w-3/4 mb-4" />
      <div className="h-4 bg-neon-primary/10 dark:bg-neon-primary-dark/10 rounded w-full mb-2" />
      <div className="h-4 bg-neon-primary/10 dark:bg-neon-primary-dark/10 rounded w-5/6" />
    </div>
  ),
});

// Dynamically import NeonButton
const NeonButton = dynamic(() => import("@/components/ui/NeonButton"), {
  loading: () => (
    <div className="h-8 bg-neon-primary/10 dark:bg-neon-primary-dark/10 rounded w-full" />
  ),
});

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const courseTitle = course.title.split(" (")[0];
  const exploreText = `Explore ${courseTitle}`;

  return (
    <div className={`${styles.card} group`} role="article">
      <div className="absolute inset-0 z-0">
        <Link
          href={`/courses/${course.slug}`}
          className={styles.cardLink}
          aria-label={`Learn more about ${courseTitle}`}
        />
      </div>
      <div className={styles.cardContent}>
        <CourseDetails course={course} variant="preview" />
        {!course.isComingSoon && (
          <div className="mt-4">
            <NeonButton
              href={`/courses/${course.slug}`}
              variant="secondary"
              size="sm"
              disabled={course.isComingSoon}
              aria-label={exploreText}
            >
              {course.isComingSoon ? "Coming Soon" : exploreText}
              {!course.isComingSoon && (
                <ArrowRightIcon
                  className="ml-1 h-4 w-4"
                  aria-hidden="true"
                  aria-label=""
                />
              )}
            </NeonButton>
          </div>
        )}
      </div>
    </div>
  );
}
