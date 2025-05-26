'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Download, BookOpen, Award, GraduationCap, Clock, Calendar, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  code: string;
  course: {
    title: string;
  };
  issuedAt: string;
  status: 'ACTIVE' | 'REVOKED';
}

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

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/student/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const response = await fetch('/api/student/certificates');
        if (!response.ok) throw new Error('Failed to fetch certificates');
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load certificates',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchCertificates();
    }
  }, [status]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/student/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load stats',
          variant: 'destructive',
        });
      }
    }

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const response = await fetch('/api/student/enrollments');
        if (!response.ok) throw new Error('Failed to fetch enrollments');
        const data = await response.json();
        setEnrollments(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load enrollments',
          variant: 'destructive',
        });
      }
    }

    if (status === 'authenticated') {
      fetchEnrollments();
    }
  }, [status]);

  const handleDownload = async (certificateId: string) => {
    try {
      setDownloadingId(certificateId);

      // First, get the certificate details
      const certResponse = await fetch(
        `/api/student/certificates/${certificateId}`
      );
      if (!certResponse.ok) {
        throw new Error('Failed to fetch certificate details');
      }
      const certData = await certResponse.json();

      // Then generate the PDF with all required fields
      const response = await fetch(`/api/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificateId: certData.id,
          name: session?.user?.name,
          course: certData.course.title,
          date: new Date(certData.issuedAt).toLocaleDateString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate certificate');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certData.code}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Certificate downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download certificate',
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            Welcome back, {session?.user?.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Here's an overview of your learning journey
          </motion.p>
        </AnimatedSection>

        <AnimatedSection
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Enrolled Courses
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
                  {stats?.enrolledCourses || 0}
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Certificates
                </CardTitle>
                <MotionDiv
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Award className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-2xl font-bold"
                >
                  {stats?.certificates || 0}
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Completed Courses
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
                  {stats?.completedCourses || 0}
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium transition-colors duration-200 group-hover:text-primary">
                  Learning Hours
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
                  {stats?.learningHours || 0}
                </MotionDiv>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-semibold"
            >
              Your Courses
            </motion.h2>

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
                Failed to load courses
              </AnimatedSection>
            ) : !enrollments?.length ? (
              <AnimatedSection
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="text-center text-muted-foreground"
              >
                You haven't enrolled in any courses yet
              </AnimatedSection>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {enrollments.map((enrollment, index) => (
                    <motion.div
                      key={enrollment.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <Card className="h-full transition-all duration-300">
                        <CardHeader>
                          <CardTitle className="line-clamp-2 transition-colors duration-200 group-hover:text-primary">
                            {enrollment.course.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {enrollment.course.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Started {format(new Date(enrollment.createdAt), 'MMM d, yyyy')}</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  enrollment.status === 'COMPLETED' && 'bg-green-500/10 text-green-500',
                                  enrollment.status === 'IN_PROGRESS' && 'bg-blue-500/10 text-blue-500',
                                  enrollment.status === 'NOT_STARTED' && 'bg-gray-500/10 text-gray-500',
                                  'transition-all duration-200 group-hover:scale-105'
                                )}
                              >
                                {enrollment.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <MotionDiv
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Button
                                variant="ghost"
                                className="w-full justify-between group-hover:text-primary"
                                onClick={() => router.push(`/courses/${enrollment.course.id}`)}
                              >
                                Continue Learning
                                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                              </Button>
                            </MotionDiv>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
