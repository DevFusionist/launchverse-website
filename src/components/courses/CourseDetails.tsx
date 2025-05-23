import { Course } from "@/types/course";
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

interface CourseDetailsProps {
  course: Course;
  variant?: "full" | "preview";
}

export default function CourseDetails({
  course,
  variant = "full",
}: CourseDetailsProps) {
  const CourseHighlights = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4">
        <CurrencyRupeeIcon className="h-6 w-6 text-neon-primary dark:text-neon-primary-dark" />
        <div>
          <p className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
            Course Fee
          </p>
          <p className="text-lg font-semibold text-neon-text-light dark:text-neon-text-dark">
            ₹{course.priceRange.min.toLocaleString()} – ₹
            {course.priceRange.max.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4">
        <ClockIcon className="h-6 w-6 text-neon-primary dark:text-neon-primary-dark" />
        <div>
          <p className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
            Duration
          </p>
          <p className="text-lg font-semibold text-neon-text-light dark:text-neon-text-dark">
            {course.duration.min}–{course.duration.max} {course.durationUnit}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4">
        <UserGroupIcon className="h-6 w-6 text-neon-primary dark:text-neon-primary-dark" />
        <div>
          <p className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
            Batch Size
          </p>
          <p className="text-lg font-semibold text-neon-text-light dark:text-neon-text-dark">
            Max 15 Students
          </p>
        </div>
      </div>
      <div className="flex items-center gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4">
        <AcademicCapIcon className="h-6 w-6 text-neon-primary dark:text-neon-primary-dark" />
        <div>
          <p className="text-sm font-medium text-neon-text-light/60 dark:text-neon-text-dark/60">
            Level
          </p>
          <p className="text-lg font-semibold text-neon-text-light dark:text-neon-text-dark">
            Beginner to Advanced
          </p>
        </div>
      </div>
    </div>
  );

  if (variant === "preview") {
    return (
      <div className="flex flex-col items-start">
        <div className="relative w-full">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-neon-text-light dark:text-neon-text-dark">
            {course.title}
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-neon-text-light/80 dark:text-neon-text-dark/80">
            {course.description}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-x-4 text-xs">
          <div className="text-neon-text-light/60 dark:text-neon-text-dark/60">
            <span className="font-medium text-neon-text-light dark:text-neon-text-dark">
              Price:
            </span>{" "}
            ₹{course.priceRange.min.toLocaleString()} – ₹
            {course.priceRange.max.toLocaleString()}
          </div>
          <div className="text-neon-text-light/60 dark:text-neon-text-dark/60">
            <span className="font-medium text-neon-text-light dark:text-neon-text-dark">
              Duration:
            </span>{" "}
            {course.duration.min}–{course.duration.max} {course.durationUnit}
          </div>
        </div>
        {course.isComingSoon && (
          <div className="mt-4">
            <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-400">
              Coming Soon
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight text-neon-text-light dark:text-neon-text-dark sm:text-5xl">
        {course.title}
      </h1>

      <CourseHighlights />

      {course.isComingSoon && (
        <div className="mt-4">
          <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-400">
            Coming Soon
          </span>
        </div>
      )}

      {/* Course Overview */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark">
          Course Overview
        </h2>
        <p className="mt-4 text-neon-text-light/80 dark:text-neon-text-dark/80">
          {course.description.split("\n\n")[0]}
        </p>
      </div>

      {/* Why Choose This Course */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark">
          Why Choose This Course?
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {course.description
            .split("Why Choose Our")[1]
            ?.split("What You'll Learn")[0]
            ?.split("•")
            .filter(Boolean)
            .map((point: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4"
              >
                <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-neon-primary dark:text-neon-primary-dark" />
                <p className="text-neon-text-light/80 dark:text-neon-text-dark/80">
                  {point.trim()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark">
          What You'll Learn
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {course.description
            .split("What You'll Learn:")[1]
            ?.split("Career Opportunities:")[0]
            ?.split("\n")
            .filter((line: string) => line.trim().startsWith("•"))
            .map((module: string, index: number) => {
              const [title = "", ...points] = module
                .split("\n")
                .filter(Boolean)
                .map((line: string) => line.replace(/^[•-]\s*/, "").trim());
              return (
                <div
                  key={index}
                  className="rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-6"
                >
                  <h3 className="font-semibold text-neon-text-light dark:text-neon-text-dark">
                    {title || "Module " + (index + 1)}
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {points.map((point: string, pointIndex: number) => (
                      <li
                        key={pointIndex}
                        className="flex items-start gap-x-2 text-neon-text-light/80 dark:text-neon-text-dark/80"
                      >
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neon-primary dark:bg-neon-primary-dark" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>

      {/* Career Opportunities */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark">
          Career Opportunities
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.description
            .split("Career Opportunities:")[1]
            ?.split("Why Choose Launch Verse Academy")[0]
            ?.split("\n")
            .filter((line: string) => line.trim().startsWith("•"))
            .map((career: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4"
              >
                <BriefcaseIcon className="h-6 w-6 text-neon-primary dark:text-neon-primary-dark" />
                <p className="text-neon-text-light/80 dark:text-neon-text-dark/80">
                  {career.replace(/^[•-]\s*/, "").trim()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Course Features */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark">
          Course Features
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.features?.map((feature: string, index: number) => (
            <div
              key={index}
              className="flex items-start gap-x-3 rounded-lg bg-neon-card-light dark:bg-neon-card-dark p-4"
            >
              <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-neon-primary dark:text-neon-primary-dark" />
              <p className="text-neon-text-light/80 dark:text-neon-text-dark/80">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 rounded-lg bg-neon-primary/10 dark:bg-neon-primary-dark/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-neon-text-light dark:text-neon-text-dark">
          Ready to Start Your Journey?
        </h2>
        <p className="mt-4 text-neon-text-light/80 dark:text-neon-text-dark/80">
          Join our community of successful professionals and take the first step
          towards a rewarding career!
        </p>
        <div className="mt-6">
          <a
            href="/contact"
            className="inline-flex items-center rounded-md bg-neon-primary dark:bg-neon-primary-dark px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-neon-primary/90 dark:hover:bg-neon-primary-dark/90"
          >
            Enroll Now
          </a>
        </div>
      </div>
    </div>
  );
}
