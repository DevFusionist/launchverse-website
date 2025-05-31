import { Metadata } from "next";

import { CourseCard } from "@/components/course-card";
import { StatCard } from "@/components/stat-card";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { CTAButtons } from "@/components/cta-buttons";

export const metadata: Metadata = {
  title: "Launch Your Tech Career | Expert-Led Tech Training & Certification",
  description:
    "Transform your career with industry-aligned tech courses in Full Stack Development, Data Science, AI, and Cloud Computing. Join 10,000+ successful graduates with 95% placement rate.",
  keywords:
    "tech training, coding bootcamp, full stack development, data science, AI training, cloud computing, career transition, tech certification, software development, machine learning",
};

export default function Home() {
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
    <main className="flex flex-col items-center justify-center gap-8 py-8 md:py-16">
      {/* Hero Section */}
      <HeroSection />

      {/* CTA Buttons */}
      <CTAButtons />

      {/* Featured Courses */}
      <section aria-label="Featured courses" className="w-full max-w-6xl mt-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Our Professional Courses
        </h2>
        <p className="text-default-500 text-center mb-8 max-w-2xl mx-auto">
          Choose from our practical courses designed to help you succeed in the
          digital world. Each program includes hands-on training,
          industry-standard tools, and career support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section aria-label="Success metrics" className="w-full max-w-6xl mt-12">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Proven Track Record of Success
        </h2>
        <p className="text-default-500 text-center mb-8 max-w-2xl mx-auto">
          Join our community of successful tech professionals. Our comprehensive
          training programs and dedicated support have helped thousands achieve
          their career goals.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...{ ...stat, _neonColor: stat.neonColor }} />
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section
        aria-label="Trust indicators"
        className="w-full max-w-6xl mt-12 text-center"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Why Choose LaunchVerse Academy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            description="Stay ahead with curriculum designed by industry experts and updated regularly to match current tech trends."
            icon="📚"
            _neonColor="from-blue-500 to-cyan-500"
            title="Industry-Aligned Curriculum"
          />
          <FeatureCard
            description="Get personalized career guidance, resume building, interview preparation, and job placement assistance."
            icon="🎯"
            _neonColor="from-purple-500 to-pink-500"
            title="Career Support"
          />
          <FeatureCard
            description="Learn at your own pace with flexible schedules, live sessions, and 24/7 access to learning resources."
            icon="⏰"
            _neonColor="from-green-500 to-emerald-500"
            title="Flexible Learning"
          />
        </div>
      </section>
    </main>
  );
}
