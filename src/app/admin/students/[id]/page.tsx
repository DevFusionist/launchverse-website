'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
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
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
      <AnimatedSection
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex min-h-screen items-center justify-center"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary transition-colors duration-200"></div>
      </AnimatedSection>
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
    <div className="space-y-8 p-8">
     <AnimatedSection
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold transition-colors duration-200 hover:text-primary">
            {student.name}
          </h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-primary/80">
            {student.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/students/${params.id}/edit`)}
            className={cn(
              'group relative transition-all duration-200',
              'hover:scale-105 hover:shadow-md',
              'active:scale-95'
            )}
          >
            <Pencil className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
            Edit Student
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className={cn(
                  'group relative transition-all duration-200',
                  'hover:scale-105 hover:shadow-md',
                  'active:scale-95'
                )}
              >
                <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                Delete Student
              </Button>
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
                  Delete Student
                </DialogTitle>
                <DialogDescription className="transition-colors duration-200 group-hover:text-primary/80">
                  Are you sure you want to delete this student? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className={cn(
                    'transition-all duration-200',
                    'hover:bg-muted hover:text-primary',
                    'active:scale-95'
                  )}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className={cn(
                    'transition-all duration-200',
                    'hover:bg-destructive/90',
                    'active:scale-95'
                  )}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>
      <div className="grid gap-8 md:grid-cols-2">
        <AnimatedSection
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="group relative"
        >
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary/80">
                    Status
                  </span>
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
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary/80">
                    Phone
                  </span>
                  <p className="transition-colors duration-200 group-hover:text-primary/80">
                    {student.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset ring-primary/10 transition-opacity duration-200 group-hover:opacity-100" />
        </AnimatedSection>

        <AnimatedSection
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="group relative"
        >
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                Enrollments
              </CardTitle>
              <Dialog
                open={isNewEnrollmentDialogOpen}
                onOpenChange={setIsNewEnrollmentDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className={cn(
                      'group/btn relative transition-all duration-200',
                      'hover:scale-105 hover:shadow-md',
                      'active:scale-95'
                    )}
                  >
                    <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-90" />
                    New Enrollment
                  </Button>
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
            <CardContent>
              <div className="w-full overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="transition-colors duration-200 hover:bg-muted/50">
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.enrollments.map((enrollment: Enrollment) => (
                      <TableRow
                        key={enrollment.id}
                        className={cn(
                          'group/item transition-all duration-200',
                          'hover:bg-muted/50',
                          'active:scale-[0.98]'
                        )}
                      >
                        <TableCell className="font-medium transition-colors duration-200 group-hover/item:text-primary">
                          {enrollment.course.title}
                        </TableCell>
                        <TableCell>
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
                        <TableCell className="transition-colors duration-200 group-hover/item:text-primary/80">
                          {format(
                            new Date(enrollment.startDate),
                            'MMM d, yyyy'
                          )}
                        </TableCell>
                        <TableCell className="transition-colors duration-200 group-hover/item:text-primary/80">
                          {enrollment.endDate
                            ? format(
                                new Date(enrollment.endDate),
                                'MMM d, yyyy'
                              )
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={enrollment.status}
                            onValueChange={handleEnrollmentStatusChange(
                              enrollment.id
                            )}
                            disabled={isUpdating === enrollment.id}
                          >
                            <SelectTrigger
                              className={cn(
                                'w-[140px]',
                                'hover:border-primary/20 focus:border-primary/20',
                                'group-hover/item:border-primary/20',
                                'cursor-pointer'
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="ENROLLED"
                                className="cursor-pointer"
                              >
                                Enrolled
                              </SelectItem>
                              <SelectItem
                                value="COMPLETED"
                                className="cursor-pointer"
                              >
                                Completed
                              </SelectItem>
                              <SelectItem
                                value="CANCELLED"
                                className="cursor-pointer"
                              >
                                Cancelled
                              </SelectItem>
                              <SelectItem
                                value="TERMINATED_VIOLATION"
                                className="cursor-pointer"
                              >
                                Terminated (Violation)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <div className="absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset ring-primary/10 transition-opacity duration-200 group-hover:opacity-100" />
        </AnimatedSection>
      </div>
    </div>
  );
}
