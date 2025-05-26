'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
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
import {
  CourseStatus,
  Enrollment,
  Certificate,
  EnrollmentStatus,
} from '@prisma/client';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type CourseWithRelations = {
  course: {
    id: string;
    title: string;
    description: string;
    duration: number;
    fee: number;
    status: CourseStatus;
    createdAt: string;
    updatedAt: string;
    _count: {
      enrollments: number;
      certificates: number;
    };
    enrollments: (Enrollment & {
      student: {
        id: string;
        name: string;
        email: string;
      };
    })[];
    certificates: (Certificate & {
      student: {
        id: string;
        name: string;
      };
      issuedBy: {
        id: string;
        name: string;
      };
    })[];
  };
};

export default function CourseDetailsPage({
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
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isCreatingEnrollment, setIsCreatingEnrollment] = useState(false);
  const [statusChangeDialog, setStatusChangeDialog] = useState<{
    isOpen: boolean;
    newStatus: CourseStatus | null;
  }>({
    isOpen: false,
    newStatus: null,
  });

  const { data, error, isLoading, mutate } = useSWR<CourseWithRelations>(
    `/api/admin/courses/${params.id}`,
    fetcher
  );

  // Fetch available students for enrollment
  const { data: studentsData } = useSWR(
    '/api/admin/students?status=ACTIVE',
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

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">Failed to load course details</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (value: string) => {
    // Open confirmation dialog instead of changing immediately
    setStatusChangeDialog({
      isOpen: true,
      newStatus: value as CourseStatus,
    });
  };

  const confirmStatusChange = async () => {
    if (!statusChangeDialog.newStatus) return;

    try {
      setIsUpdating('status');
      const response = await fetch(`/api/admin/courses/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusChangeDialog.newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update course status');
      }

      toast({
        title: 'Status Updated',
        description: `Course status has been updated to ${statusChangeDialog.newStatus.toLowerCase()}`,
      });
      mutate();
    } catch (error: any) {
      console.error('Error updating course status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update course status',
      });
    } finally {
      setIsUpdating(null);
      setStatusChangeDialog({ isOpen: false, newStatus: null });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete course');

      router.push('/admin/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleCreateEnrollment = async () => {
    if (!selectedStudentId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a student',
      });
      return;
    }

    try {
      setIsCreatingEnrollment(true);
      const response = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudentId,
          courseId: params.id,
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
      setSelectedStudentId('');
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

  const statusColors = {
    ACTIVE: 'bg-green-500/10 text-green-500',
    INACTIVE: 'bg-red-500/10 text-red-500',
    UPCOMING: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <div className="space-y-8 p-8">
      {/* Add Status Change Confirmation Dialog */}
      <Dialog
        open={statusChangeDialog.isOpen}
        onOpenChange={(open) =>
          setStatusChangeDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the course status to{' '}
              <span className="font-medium">
                {statusChangeDialog.newStatus?.toLowerCase()}
              </span>
              ? This action may affect student enrollments and cannot be easily
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setStatusChangeDialog({
                  isOpen: false,
                  newStatus: null,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={confirmStatusChange}
              disabled={Boolean(isUpdating)}
            >
              {isUpdating ? 'Updating...' : 'Confirm Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Enrollment Dialog */}
      <Dialog
        open={isNewEnrollmentDialogOpen}
        onOpenChange={setIsNewEnrollmentDialogOpen}
      >
        <DialogContent className="transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogHeader>
            <DialogTitle>New Enrollment</DialogTitle>
            <DialogDescription>
              Select a student to enroll in this course.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Student</label>
              <Select
                value={selectedStudentId}
                onValueChange={setSelectedStudentId}
                disabled={isCreatingEnrollment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {studentsData?.students?.map((student: any) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewEnrollmentDialogOpen(false)}
              disabled={isCreatingEnrollment}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEnrollment}
              disabled={isCreatingEnrollment || !selectedStudentId}
            >
              {isCreatingEnrollment ? 'Creating...' : 'Create Enrollment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <AnimatedSection
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold transition-colors duration-200 hover:text-primary">
            {data.course.title}
          </h1>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-primary/80">
            {data.course.description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatedSection
            variants={cardVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/courses/${params.id}/edit`)}
              className="group relative z-30 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
            >
              <Pencil className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
              Edit
            </Button>
          </AnimatedSection>

          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <AnimatedSection
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button
                  variant="destructive"
                  className="group relative z-30 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                >
                  <Trash2 className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                  Delete
                </Button>
              </AnimatedSection>
            </DialogTrigger>
            <DialogContent className="transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <DialogHeader>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this course? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AnimatedSection>

      {/* Course Info */}
      <div className="grid gap-6 md:grid-cols-2">
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
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative z-20">
                <label className="text-sm font-medium transition-colors duration-200 group-hover:text-primary/80">Status</label>
                <div className="flex items-center gap-2">
                  <Select
                    value={data.course.status}
                    onValueChange={handleStatusChange}
                    disabled={Boolean(isUpdating)}
                  >
                    <SelectTrigger className="transition-all duration-200 hover:border-primary/20 focus:border-primary/20 focus:ring-1 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating === 'status' && (
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary transition-colors duration-200"></div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <p>{data.course.duration} weeks</p>
              </div>
              <div>
                <label className="text-sm font-medium">Fee</label>
                <p>
                  ₹
                  {data.course.fee.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Created</label>
                <p>{new Date(data.course.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

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
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Enrollments</p>
                <p className="text-2xl font-bold">
                  {data.course._count.enrollments}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Certificates Issued</p>
                <p className="text-2xl font-bold">
                  {data.course._count.certificates}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Active Enrollments</p>
                <p className="text-2xl font-bold">
                  {
                    data.course.enrollments.filter((e) => e.status === 'ENROLLED')
                      .length
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">
                  {
                    data.course.enrollments.filter(
                      (e) => e.status === 'COMPLETED'
                    ).length
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {/* Enrollments */}
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
            <AnimatedSection
              variants={cardVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <Button
                size="sm"
                onClick={() => setIsNewEnrollmentDialogOpen(true)}
                className="group relative z-30 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
              >
                <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                New Enrollment
              </Button>
            </AnimatedSection>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Student</TableHead>
                    <TableHead className="px-6">Email</TableHead>
                    <TableHead className="px-6">Status</TableHead>
                    <TableHead className="px-6">Start Date</TableHead>
                    <TableHead className="px-6">End Date</TableHead>
                    <TableHead className="px-6 pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.course.enrollments.map((enrollment) => (
                    <TableRow
                      key={enrollment.id}
                      className="group/item transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-medium px-6 py-4 transition-colors duration-200 group-hover/item:text-primary">
                        {enrollment.student.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 transition-colors duration-200 group-hover/item:text-primary/80">
                        {enrollment.student.email}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            enrollment.status === 'ENROLLED'
                              ? 'bg-green-500/10 text-green-500'
                              : enrollment.status === 'COMPLETED'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-yellow-500/10 text-yellow-500',
                            'transition-all duration-200 group-hover/item:scale-105'
                          )}
                        >
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 transition-colors duration-200 group-hover/item:text-primary/80">
                        {new Date(enrollment.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4 transition-colors duration-200 group-hover/item:text-primary/80">
                        {enrollment.endDate
                          ? new Date(enrollment.endDate).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell className="px-6 py-4 pr-8">
                        <AnimatedSection
                          variants={cardVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className="relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/students/${enrollment.student.id}`)
                            }
                            className="group relative z-30 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                          >
                            View Student
                          </Button>
                        </AnimatedSection>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.course.enrollments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        No enrollments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Certificates */}
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
              Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="px-6">Code</TableHead>
                    <TableHead className="px-6">Student</TableHead>
                    <TableHead className="px-6">Issued By</TableHead>
                    <TableHead className="px-6">Issued At</TableHead>
                    <TableHead className="px-6">Status</TableHead>
                    <TableHead className="px-6 pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.course.certificates.map((certificate) => (
                    <TableRow
                      key={certificate.id}
                      className="group/item transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-mono px-6 py-4 transition-colors duration-200 group-hover/item:text-primary">
                        {certificate.code}
                      </TableCell>
                      <TableCell className="px-6 py-4 transition-colors duration-200 group-hover/item:text-primary/80">
                        {certificate.student.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 transition-colors duration-200 group-hover/item:text-primary/80">
                        {certificate.issuedBy.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 transition-colors duration-200 group-hover/item:text-primary/80">
                        {new Date(certificate.issuedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className={cn(
                            certificate.status === 'ACTIVE'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500',
                            'transition-all duration-200 group-hover/item:scale-105'
                          )}
                        >
                          {certificate.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 pr-8">
                        <AnimatedSection
                          variants={cardVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          className="relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/certificates/${certificate.id}`)
                            }
                            className="group relative z-30 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                          >
                            View Details
                          </Button>
                        </AnimatedSection>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.course.certificates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center">
                        No certificates found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
