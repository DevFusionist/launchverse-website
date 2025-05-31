// components/course-card.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type CourseCardProps = {
  title: string;
  description: string;
  icon: string;
  neonColor: string;
  learnMoreRoute?: string;
  enrollRoute?: string;
};

const CourseCard = ({
  title,
  description,
  icon,
  neonColor,
  learnMoreRoute = "#",
  enrollRoute = "#",
}: CourseCardProps) => {
  return (
    <CardContainer className="inter-var w-full">
      <CardBody
        className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-2xl p-4 border flex flex-col items-center justify-center gap-3
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
        after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
        [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
        [&:hover]:border-emerald-500/50
        transition-all duration-500"
      >
        <CardItem className="text-4xl text-center w-full" translateZ="200">
          {icon}
        </CardItem>

        <CardItem
          className="text-xl font-bold text-neutral-600 dark:text-white mt-2 text-center w-full"
          translateZ="150"
        >
          {title}
        </CardItem>

        <CardItem
          className="text-sm max-w-xs mt-2 text-center dark:text-neutral-300 w-full"
          translateZ="180"
        >
          {description}
        </CardItem>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4 w-full">
          <Link className="block w-full sm:w-auto" href={learnMoreRoute}>
            <CardItem
              className="px-4 py-2 rounded-2xl text-sm font-normal text-cyan-400 dark:text-cyan-300 transition-all duration-300 text-center w-full
                relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-cyan-500/30 before:via-blue-500/30 before:to-indigo-500/30 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-r after:from-cyan-400/20 after:via-blue-400/20 after:to-indigo-400/20 after:blur-lg after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
                hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:shadow-cyan-400/50
                border border-cyan-500/30 hover:border-cyan-400/50
                hover:bg-gradient-to-r hover:from-cyan-500/10 hover:via-blue-500/10 hover:to-indigo-500/10"
              translateZ="100"
            >
              Learn More →
            </CardItem>
          </Link>
          <Link className="block w-full sm:w-auto" href={`/contact?source=course&course=${title}`}>
            <CardItem
              className="px-4 py-2 rounded-2xl text-sm font-bold text-white transition-all duration-300 text-center w-full
                relative before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-pink-500/40 before:via-purple-500/40 before:to-indigo-500/40 before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-r after:from-pink-400/30 after:via-purple-400/30 after:to-indigo-400/30 after:blur-lg after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
                hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:shadow-pink-500/60
                border border-pink-500/40 hover:border-pink-400/60
                bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600
                hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500
                hover:scale-[1.02]"
              translateZ="100"
            >
              Enroll Now
            </CardItem>
          </Link>
        </div>
      </CardBody>
    </CardContainer>
  );
};

type CourseGridProps = {
  courses: CourseCardProps[];
};

export const CourseGrid = ({ courses }: CourseGridProps) => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="space-y-8">
        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Our Courses
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[300px] mx-auto"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard {...course} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export { CourseCard };
