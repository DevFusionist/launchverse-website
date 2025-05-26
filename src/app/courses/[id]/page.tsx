'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  staggerContainer,
  staggerItem,
  buttonVariants,
  iconVariants,
  MotionDiv,
  PageTransition,
} from '@/components/ui/motion';
import {
  AnimatedButton,
  AnimatedIcon,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';
import { ROUTES } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Clock, Users, GraduationCap, ChevronRight, CheckCircle2, BookOpen, Award, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

// Update the course type to match the actual data structure
type Course = {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  category: string;
  fee: number;
  status: 'ACTIVE' | 'UPCOMING' | 'INACTIVE';
  overview: string;
  learningObjectives: string[];
  curriculum: Array<{
    title: string;
    description: string;
  }>;
  nextBatchStart: string;
  _count: {
    enrollments: number;
    certificates: number;
  };
};

// Add these variants at the top level of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.3
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

export default function CourseDetailsPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch course');
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        setError('Failed to load course details');
        toast({
          title: 'Error',
          description: 'Failed to load course details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [params.id]);

  const handleEnroll = async () => {
    if (!course) return;
    
    try {
      setIsEnrolling(true);
      const response = await fetch('/api/student/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to enroll');

      toast({
        title: 'Success',
        description: 'Successfully enrolled in the course',
      });
      router.push('/student/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enroll in the course',
        variant: 'destructive',
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <PageTransition>
      <div className="container py-8">
        {isLoading ? (
          <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="flex justify-center py-8"
          >
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-muted-foreground" />
            </MotionDiv>
          </AnimatedSection>
        ) : error ? (
          <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-red-500"
          >
            Failed to load course details
          </AnimatedSection>
        ) : !course ? (
            <AnimatedSection
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-muted-foreground"
          >
            Course not found
            </AnimatedSection>
        ) : (
          <div className="space-y-8">
            <AnimatedSection
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold"
              >
                {course.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground"
              >
                {course.description}
              </motion.p>
            </AnimatedSection>

            <AnimatedSection
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              <motion.div variants={itemVariants}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                      Duration
                    </CardTitle>
                    <MotionDiv
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </MotionDiv>
                  </CardHeader>
                  <CardContent>
                    <MotionDiv
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-2xl font-bold"
                    >
                      {course.duration} weeks
                    </MotionDiv>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                      Students
                    </CardTitle>
                    <MotionDiv
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </MotionDiv>
                  </CardHeader>
                  <CardContent>
                    <MotionDiv
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-2xl font-bold"
                    >
                      {course._count.enrollments}
                    </MotionDiv>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                      Graduates
                    </CardTitle>
                    <MotionDiv
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <GraduationCap className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </MotionDiv>
                  </CardHeader>
                  <CardContent>
                    <MotionDiv
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-2xl font-bold"
                    >
                      {course._count.certificates}
                    </MotionDiv>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                      Level
                    </CardTitle>
                    <MotionDiv
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <BookOpen className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </MotionDiv>
                  </CardHeader>
                  <CardContent>
                    <MotionDiv
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-2xl font-bold"
                    >
                  {course.level}
                    </MotionDiv>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>

            <div className="grid gap-8 md:grid-cols-3">
              <AnimatedSection
                variants={slideIn}
                initial="hidden"
                animate="visible"
                className="md:col-span-2 space-y-6"
              >
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                      Course Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="prose prose-sm max-w-none"
                    >
                      {course.overview}
                    </motion.div>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                      What You'll Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.ul
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      {course.learningObjectives.map((objective, index) => (
                        <motion.li
                          key={index}
                          variants={itemVariants}
                          className="flex items-start gap-2"
                        >
                          <MotionDiv
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </MotionDiv>
                          <span>{objective}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                    <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                      Curriculum
                    </CardTitle>
              </CardHeader>
              <CardContent>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {course.curriculum.map((module, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="rounded-lg border p-4 transition-all duration-200 hover:border-primary/50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Module {index + 1}: {module.title}</h4>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                            </div>
                            <MotionDiv
                              whileHover={{ rotate: 90 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </MotionDiv>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>

              <AnimatedSection
                variants={slideIn}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <Card className="sticky top-8 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                    <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                      Enroll Now
                    </CardTitle>
              </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-2xl font-bold">
                        <span>Course Fee</span>
                        <MotionDiv
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          ₹{course.fee.toLocaleString('en-IN')}
                        </MotionDiv>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Includes lifetime access and certificate
                      </p>
                    </div>

                    <div className="space-y-4">
                      <MotionDiv
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button
                          className="w-full"
                          size="lg"
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                        >
                          {isEnrolling ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            'Enroll Now'
                          )}
                        </Button>
                      </MotionDiv>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Next batch starts in {course.nextBatchStart}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>Certificate included</span>
                        </div>
                      </div>
                    </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
          </div>
        )}
    </div>
    </PageTransition>
  );
}
