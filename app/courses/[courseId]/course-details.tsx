"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import {
  CheckCircle,
  Clock,
  Users,
  Award,
  BookOpen,
  Code,
  GraduationCap,
  Phone,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

type Instructor = {
  name: string;
  role: string;
  experience: string;
  expertise: string[];
};

type Module = {
  module: string;
  topics: string[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  icon: string;
  neonColor: string;
  duration: string;
  level: string;
  price: string;
  highlights: string[];
  curriculum: Module[];
  outcomes: string[];
  prerequisites: string[];
  instructors: Instructor[];
};

type CourseDetailsProps = {
  course: Course;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function CourseDetails({ course }: CourseDetailsProps) {
  const router = useRouter();

  const handleScheduleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/contact?source=course&course=" + course.id);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <CardContainer className="inter-var w-full max-w-4xl mx-auto">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-2xl p-6 border 
            before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
            after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
            [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
            [&:hover]:border-emerald-500/50
            transition-all duration-500"
          >
            <CardItem className="text-6xl text-center" translateZ="200">
              {course.icon}
            </CardItem>
            <CardItem
              className="text-4xl md:text-5xl font-bold mt-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              translateZ="150"
            >
              {course.title}
            </CardItem>
            <CardItem
              className="text-xl text-neutral-500 dark:text-neutral-300 max-w-3xl mx-auto mt-4 text-center"
              translateZ="180"
            >
              {course.description}
            </CardItem>
            <CardItem
              className="flex flex-wrap justify-center gap-4 mt-6"
              translateZ="120"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/30 backdrop-blur-md border border-white/10">
                <Clock className="w-5 h-5 text-primary" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/30 backdrop-blur-md border border-white/10">
                <Users className="w-5 h-5 text-primary" />
                <span>{course.level}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background/30 backdrop-blur-md border border-white/10">
                <Award className="w-5 h-5 text-primary" />
                <span>Certificate Included</span>
              </div>
            </CardItem>
            <CardItem className="flex justify-center mt-6" translateZ="100">
              <Button
                className="border-primary text-primary hover:bg-primary/10 transition-colors w-full max-w-xs"
                size="lg"
                startContent={<Phone className="w-5 h-5" />}
                variant="bordered"
                onClick={handleScheduleCall}
              >
                Schedule a Call
              </Button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.div>

      {/* Course Highlights */}
      <motion.div
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        initial="hidden"
        variants={containerVariants}
      >
        {course.highlights.map((highlight, index) => (
          <motion.div key={index} variants={itemVariants}>
            <CardContainer className="inter-var w-full">
              <CardBody
                className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
                before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
                after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
                [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
                [&:hover]:border-emerald-500/50
                transition-all duration-500"
              >
                <CardItem className="flex items-center gap-3" translateZ="150">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <span className="text-lg text-neutral-600 dark:text-white">
                    {highlight}
                  </span>
                </CardItem>
              </CardBody>
            </CardContainer>
          </motion.div>
        ))}
      </motion.div>

      {/* Curriculum */}
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {course.curriculum.map((module, index) => (
            <motion.div
              key={module.module}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var w-full">
                <CardBody
                  className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
                  before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
                  after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
                  [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
                  [&:hover]:border-emerald-500/50
                  transition-all duration-500"
                >
                  <CardItem translateZ="150">
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold text-neutral-600 dark:text-white">
                        {module.module}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="flex items-center gap-2"
                        >
                          <Code className="w-4 h-4 text-primary" />
                          <span className="text-neutral-500 dark:text-neutral-300">
                            {topic}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Learning Outcomes */}
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          What You&apos;ll Learn
        </h2>
        <CardContainer className="inter-var w-full max-w-4xl mx-auto">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
            after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
            [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
            [&:hover]:border-emerald-500/50
            transition-all duration-500"
          >
            <CardItem translateZ="150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <GraduationCap className="w-6 h-6 text-primary mt-1" />
                    <span className="text-neutral-500 dark:text-neutral-300">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.section>

      {/* Prerequisites */}
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">Prerequisites</h2>
        <CardContainer className="inter-var w-full max-w-4xl mx-auto">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
            after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
            [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
            [&:hover]:border-emerald-500/50
            transition-all duration-500"
          >
            <CardItem translateZ="150">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-neutral-500 dark:text-neutral-300">
                      {prerequisite}
                    </span>
                  </li>
                ))}
              </ul>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.section>

      {/* Instructors */}
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Meet Your Instructors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {course.instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var w-full">
                <CardBody
                  className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
                  before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
                  after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
                  [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
                  [&:hover]:border-emerald-500/50
                  transition-all duration-500"
                >
                  <CardItem translateZ="150">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-600 dark:text-white">
                          {instructor.name}
                        </h3>
                        <p className="text-primary">{instructor.role}</p>
                      </div>
                      <p className="text-neutral-500 dark:text-neutral-300">
                        {instructor.experience}
                      </p>
                      <div>
                        <h4 className="font-medium mb-2 text-neutral-600 dark:text-white">
                          Areas of Expertise:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {instructor.expertise.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <CardContainer className="inter-var w-full max-w-4xl mx-auto">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border 
            before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-emerald-500/40 before:via-blue-500/40 before:to-cyan-500/40 before:blur-3xl before:opacity-0 before:transition-opacity before:duration-500 group-hover/card:before:opacity-100 
            after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r after:from-emerald-500/30 after:via-blue-500/30 after:to-cyan-500/30 after:blur-2xl after:opacity-0 after:transition-opacity after:duration-500 group-hover/card:after:opacity-100
            [&:hover]:shadow-[0_0_30px_rgba(16,185,129,0.3)] [&:hover]:shadow-emerald-500/30
            [&:hover]:border-emerald-500/50
            transition-all duration-500"
          >
            <CardItem translateZ="150">
              <h2 className="text-3xl font-bold mb-4 text-neutral-600 dark:text-white">
                Ready to Start Your Journey?
              </h2>
              <p className="text-neutral-500 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
                Join our community of learners and take the first step towards
                your tech career. Our comprehensive training program and
                dedicated support will help you achieve your goals.
              </p>
              <Button
                className="border-primary text-primary hover:bg-primary/10 transition-colors w-full max-w-xs mx-auto"
                size="lg"
                startContent={<Phone className="w-5 h-5" />}
                variant="bordered"
                onClick={handleScheduleCall}
              >
                Schedule a Call
              </Button>
            </CardItem>
          </CardBody>
        </CardContainer>
      </motion.section>
    </div>
  );
}
