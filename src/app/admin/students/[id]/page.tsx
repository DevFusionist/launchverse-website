'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, Loader2, Users, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StudentStatus, EnrollmentStatus, Student } from '@prisma/client';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import { SelectProps } from '@radix-ui/react-select';
import {
  AnimatedSection,
  fadeIn,
  slideIn,
  staggerContainer,
  staggerItem,
  cardVariants,
  MotionDiv,
  buttonVariants,
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/ui/page-transition';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusColors: Record<StudentStatus, string> = {
  ACTIVE: 'bg-green-500/10 text-green-500',
  INACTIVE: 'bg-yellow-500/10 text-yellow-500',
  GRADUATED: 'bg-blue-500/10 text-blue-500',
  SUSPENDED_VIOLATION: 'bg-red-500/10 text-red-500',
};

type Enrollment = {
  id: string;
  course: {
    title: string;
  };
  status: EnrollmentStatus;
  startDate: string;
  endDate: string | null;
};

type StudentWithDetails = Student & {
  _count: {
    enrollments: number;
    certificates: number;
    placements: number;
  };
  enrollments: Enrollment[];
};

export default function StudentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isNewEnrollmentDialogOpen, setIsNewEnrollmentDialogOpen] =
    useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isCreatingEnrollment, setIsCreatingEnrollment] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    isOpen: boolean;
    enrollmentId: string | null;
    newStatus: EnrollmentStatus | null;
  }>({
    isOpen: false,
    enrollmentId: null,
    newStatus: null,
  });

  const { data, error, isLoading, mutate } = useSWR(
    `/api/admin/students/${params.id}`,
    fetcher
  );

  // Fetch available courses for enrollment
  const { data: coursesData } = useSWR(
    '/api/admin/courses?status=ACTIVE',
    fetcher
  );

  if (status === 'loading' || isLoading) {
    return (
      <PageTransition>
        <div className="container py-8">
          <AnimatedSection variants={fadeIn} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <MotionDiv
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-8 w-48 bg-muted rounded-md mb-2"
                />
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-4 w-64 bg-muted rounded-md"
                />
              </div>
              <MotionDiv
                variants={buttonVariants}
                className="h-10 w-24 bg-muted rounded-md"
              />
            </div>
          </AnimatedSection>

          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8 grid gap-4 md:grid-cols-3"
          >
            {[1, 2, 3].map((_, index) => (
              <MotionDiv
                key={index}
                variants={staggerItem}
                className="relative overflow-hidden rounded-lg border bg-card p-6"
              >
                <MotionDiv
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.2
                  }}
                />
                <div className="flex items-center justify-between mb-4">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-4 w-24 bg-muted rounded-md"
                  />
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="h-4 w-4 bg-muted rounded-full"
                  />
                </div>
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="h-8 w-16 bg-muted rounded-md"
                />
              </MotionDiv>
            ))}
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
        initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2"
          >
            {[1, 2].map((_, index) => (
              <MotionDiv
                key={index}
                variants={staggerItem}
                className="relative overflow-hidden rounded-lg border bg-card"
              >
                <MotionDiv
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.2
                  }}
                />
                <div className="p-6">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-6 w-32 bg-muted rounded-md mb-6"
                  />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, i) => (
                      <MotionDiv
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) + (i * 0.1) }}
                        className="h-4 w-full bg-muted rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </PageTransition>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return null;
  }

  if (error || !data?.student) {
    return (
      <AnimatedSection
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex min-h-screen items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold transition-colors duration-200 hover:text-primary">
            Error
          </h2>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-primary/80">
            Failed to load student details
          </p>
        </div>
      </AnimatedSection>
    );
  }

  const student = data.student;

  const handleStatusChange = async (
    enrollmentId: string,
    newStatus: EnrollmentStatus
  ) => {
    try {
      setIsUpdating(enrollmentId);
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          endDate:
            newStatus !== 'ENROLLED' ? new Date().toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { error: error.error || 'Failed to update enrollment status' };
      }

      // Show appropriate success message based on status change
      const statusMessages: Record<EnrollmentStatus, string> = {
        ENROLLED: 'Student enrolled in course',
        COMPLETED: 'Course marked as completed',
        CANCELLED: 'Student cancelled enrollment',
        TERMINATED_VIOLATION: 'Enrollment terminated due to violation',
      };
      toast({
        title: 'Status Updated',
        description: statusMessages[newStatus],
      });
      mutate(); // Refresh the data
    } catch (error: any) {
      console.error('Error updating enrollment status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.error || 'Failed to update enrollment status',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/students/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete student');

      router.push('/admin/students');
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEnrollmentStatusChange =
    (enrollmentId: string) => (value: string) => {
      // Prevent manual changes to TERMINATED_VIOLATION status
      if (value === 'TERMINATED_VIOLATION') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            'This status can only be set through certificate revocation',
        });
        return;
      }
      handleStatusChange(enrollmentId, value as EnrollmentStatus);
    };

  const confirmStatusChange = () => {
    if (statusChangeDialog.enrollmentId && statusChangeDialog.newStatus) {
      handleStatusChange(
        statusChangeDialog.enrollmentId,
        statusChangeDialog.newStatus
      );
    }
  };

  const handleStudentStatusChange = async (newStatus: StudentStatus) => {
    // Prevent manual changes to SUSPENDED_VIOLATION status
    if (newStatus === 'SUSPENDED_VIOLATION') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'This status can only be set through certificate revocation',
      });
      return;
    }

    try {
      setIsUpdating('student');
      const response = await fetch(`/api/admin/students/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { error: error.error || 'Failed to update student status' };
      }

      toast({
        title: 'Success',
        description: 'Student status updated successfully',
      });
      mutate();
    } catch (error: any) {
      console.error('Error updating student status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.error || 'Failed to update student status',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCreateEnrollment = async () => {
    if (!selectedCourseId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a course',
      });
      return;
    }

    try {
      setIsCreatingEnrollment(true);
      const response = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: params.id,
          courseId: selectedCourseId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create enrollment');
      }

      toast({
        title: 'Success',
        description: 'Student enrolled in course successfully',
      });

      // Reset form and close dialog
      setSelectedCourseId('');
      setIsNewEnrollmentDialogOpen(false);
      mutate(); // Refresh the data
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to create enrollment',
      });
    } finally {
      setIsCreatingEnrollment(false);
    }
  };

  return (
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection variants={fadeIn} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold"
              >
            {student.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground"
              >
                Student details and enrollment history
              </motion.p>
        </div>
        <div className="flex items-center gap-2">
              <MotionDiv
                variants={buttonVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotate: 2,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/students/${params.id}/edit`)}
                  className="group relative overflow-hidden"
                >
                  <MotionDiv
                    whileHover={{ rotate: 12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mr-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </MotionDiv>
                  Edit Student
                </Button>
              </MotionDiv>
              <MotionDiv
                variants={buttonVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotate: -2,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="group relative overflow-hidden"
                >
                  <MotionDiv
                    whileHover={{ rotate: -15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mr-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </MotionDiv>
                  Delete Student
                </Button>
              </MotionDiv>
            </div>
        </div>
      </AnimatedSection>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-8 grid gap-4 md:grid-cols-3"
        >
          <MotionDiv variants={staggerItem}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  Total Enrollments
                </CardTitle>
                <MotionDiv
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl font-bold"
                >
                  {student._count.enrollments}
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv variants={staggerItem}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  Total Certificates
                </CardTitle>
                <MotionDiv
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Award className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-bold"
                >
                  {student._count.certificates}
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv variants={staggerItem}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  Total Placements
              </CardTitle>
                <MotionDiv
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </MotionDiv>
            </CardHeader>
            <CardContent>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold"
                >
                  {student._count.placements}
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2"
        >
          <AnimatedSection variants={cardVariants}>
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.avatar && (
                  <MotionDiv
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative h-32 w-32 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={student.avatar}
                      alt={student.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      sizes="128px"
                    />
                  </MotionDiv>
                )}
                <MotionDiv variants={staggerItem} className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span>{' '}
                    <MotionDiv
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="inline-block"
                    >
                      <a
                        href={`mailto:${student.email}`}
                        className="text-blue-600 hover:underline transition-colors"
                      >
                        {student.email}
                      </a>
                    </MotionDiv>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{' '}
                    {student.phone || (
                      <span className="text-muted-foreground">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{' '}
                  <Badge
                    variant="secondary"
                    className={cn(
                        statusColors[student.status as StudentStatus],
                      'transition-all duration-200',
                      'group-hover:scale-105'
                    )}
                  >
                    {student.status.replace('_', ' ')}
                  </Badge>
                </div>
                </MotionDiv>
            </CardContent>
          </Card>
        </AnimatedSection>

          <AnimatedSection variants={cardVariants}>
            <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="group-hover:text-primary transition-colors">
                Enrollments
              </CardTitle>
              <Dialog
                open={isNewEnrollmentDialogOpen}
                onOpenChange={setIsNewEnrollmentDialogOpen}
              >
                <DialogTrigger asChild>
                    <MotionDiv
                      variants={buttonVariants}
                      whileHover={{ 
                        scale: 1.05,
                        rotate: 2,
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                  <Button
                    size="sm"
                        className="group/btn relative z-20"
                      >
                        <MotionDiv
                          whileHover={{ rotate: 90 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="mr-2"
                        >
                          <Plus className="h-4 w-4" />
                        </MotionDiv>
                    New Enrollment
                  </Button>
                    </MotionDiv>
                </DialogTrigger>
                <DialogContent
                  className={cn(
                    'transition-all duration-200',
                    'data-[state=open]:animate-in data-[state=closed]:animate-out',
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    'data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]'
                  )}
                >
                  <DialogHeader>
                    <DialogTitle className="transition-colors duration-200 group-hover:text-primary">
                      New Enrollment
                    </DialogTitle>
                    <DialogDescription className="transition-colors duration-200 group-hover:text-primary/80">
                      Select a course to enroll the student
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select
                      value={selectedCourseId}
                      onValueChange={setSelectedCourseId}
                      disabled={isCreatingEnrollment}
                    >
                      <SelectTrigger
                        className={cn(
                          'w-full transition-all duration-200',
                          'hover:border-primary/20 focus:border-primary/20'
                        )}
                      >
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {coursesData?.courses?.map((course: any) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsNewEnrollmentDialogOpen(false)}
                      className={cn(
                        'transition-all duration-200',
                        'hover:bg-muted hover:text-primary',
                        'active:scale-95'
                      )}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateEnrollment}
                      disabled={!selectedCourseId || isCreatingEnrollment}
                      className={cn(
                        'transition-all duration-200',
                        'hover:bg-primary/90',
                        'active:scale-95'
                      )}
                    >
                      {isCreatingEnrollment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Enrollment'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow>
                        <TableHead className="px-6 py-4">Course</TableHead>
                        <TableHead className="px-6 py-4">Status</TableHead>
                        <TableHead className="px-6 py-4">Start Date</TableHead>
                        <TableHead className="px-6 py-4">End Date</TableHead>
                        <TableHead className="px-6 py-4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.enrollments.map((enrollment: Enrollment, index: number) => (
                      <MotionTableRow
                        key={enrollment.id}
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        layout
                        transition={{
                          layout: { duration: 0.2 },
                          delay: index * 0.05,
                        }}
                        className="relative z-0"
                      >
                          <TableCell className="px-6 py-4 font-medium">
                            <MotionDiv
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {enrollment.course.title}
                            </MotionDiv>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'transition-all duration-200',
                                'group-hover/item:scale-105'
                              )}
                            >
                              {enrollment.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <MotionDiv
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {format(new Date(enrollment.startDate), 'MMM d, yyyy')}
                            </MotionDiv>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <MotionDiv
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {enrollment.endDate
                                ? format(new Date(enrollment.endDate), 'MMM d, yyyy')
                                : '-'}
                            </MotionDiv>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <MotionDiv
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Select
                                value={enrollment.status}
                                onValueChange={(value) =>
                                  setStatusChangeDialog({
                                    isOpen: true,
                                    enrollmentId: enrollment.id,
                                    newStatus: value as EnrollmentStatus,
                                  })
                                }
                                disabled={isUpdating === enrollment.id}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ENROLLED">Enrolled</SelectItem>
                                  <SelectItem value="COMPLETED">Completed</SelectItem>
                                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                  <SelectItem value="TERMINATED_VIOLATION">
                                    Terminated (Violation)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </MotionDiv>
                          </TableCell>
                      </MotionTableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
        </MotionDiv>
      </div>
    </PageTransition>
  );
}

const MotionTableRow = motion(TableRow);
