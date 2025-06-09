"use client";

import { useEffect } from "react";
import { CourseCard } from "@/components/course-card";
import { StatCard } from "@/components/stat-card";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { CTAButtons } from "@/components/cta-buttons";
import { trackPageView, trackButtonClick } from "@/lib/analytics";

interface PageClientProps {
  courses: any[];
  stats: any[];
}

export function PageClient({ courses, stats }: PageClientProps) {
  // Track page view
  useEffect(() => {
    trackPageView("/", "🎓 Best Computer Training Institute in Kolkata | Job-Oriented Courses at Launch Verse Academy");
  }, []);

  return (
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
        className="w-full max-w-6xl mt-12"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Why Students Choose Launch Verse Academy
        </h2>
        <p className="text-default-500 text-center mb-8 max-w-2xl mx-auto">
          Our commitment to quality education and student success sets us apart
          from other training institutes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎯"
            title="Job-Oriented Training"
            description="Our courses are designed with industry requirements in mind, ensuring you're ready for real-world challenges."
            _neonColor="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon="👨‍🏫"
            title="Expert Instructors"
            description="Learn from experienced professionals who have worked in the industry and understand current trends."
            _neonColor="from-green-500 to-emerald-500"
          />
          <FeatureCard
            icon="💼"
            title="Placement Support"
            description="We provide comprehensive placement assistance, including resume building and interview preparation."
            _neonColor="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon="🔄"
            title="Flexible Learning"
            description="Choose from different batch timings and learning modes to fit your schedule and preferences."
            _neonColor="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon="📚"
            title="Practical Approach"
            description="Focus on hands-on training with real projects that you can showcase in your portfolio."
            _neonColor="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            icon="🏆"
            title="Certification"
            description="Earn industry-recognized certificates that validate your skills and enhance your career prospects."
            _neonColor="from-yellow-500 to-orange-500"
          />
        </div>
      </section>
    </main>
  );
} 