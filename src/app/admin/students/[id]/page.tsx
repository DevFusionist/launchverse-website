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
import { StudentStatus, EnrollmentStatus } from '@prisma/client';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import { SelectProps } from '@radix-ui/react-select';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusColors = {
  ACTIVE: 'bg-green-500/10 text-green-500',
  INACTIVE: 'bg-yellow-500/10 text-yellow-500',
  GRADUATED: 'bg-blue-500/10 text-blue-500',
  SUSPENDED_VIOLATION: 'bg-red-500/10 text-red-500',
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return null;
  }

  if (error || !data?.student) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">
            Failed to load student details
          </p>
        </div>
      </div>
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
      {/* Add New Enrollment Dialog */}
      <Dialog
        open={isNewEnrollmentDialogOpen}
        onOpenChange={setIsNewEnrollmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Enrollment</DialogTitle>
            <DialogDescription>
              Select a course to enroll the student in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Course</label>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
                disabled={isCreatingEnrollment}
              >
                <SelectTrigger>
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
              disabled={isCreatingEnrollment || !selectedCourseId}
            >
              {isCreatingEnrollment ? 'Creating...' : 'Create Enrollment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Status Change Confirmation Dialog */}
      <Dialog
        open={statusChangeDialog.isOpen}
        onOpenChange={(open) =>
          setStatusChangeDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the enrollment status to{' '}
              <span className="font-medium">
                {statusChangeDialog.newStatus?.replace('_', ' ').toLowerCase()}
              </span>
              ? This action may affect the student's record and cannot be easily
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setStatusChangeDialog({
                  isOpen: false,
                  enrollmentId: null,
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/students/${params.id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Student</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this student? This action
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
      </div>

      {/* Student Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select
                value={student.status}
                onValueChange={handleStudentStatusChange}
                disabled={Boolean(isUpdating)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p>{student.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Enrolled</label>
              <p>{new Date(student.enrolledAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Enrollments</p>
              <p className="text-2xl font-bold">{student._count.enrollments}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Certificates</p>
              <p className="text-2xl font-bold">
                {student._count.certificates}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Placements</p>
              <p className="text-2xl font-bold">{student._count.placements}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrollments</CardTitle>
          <Button size="sm" onClick={() => setIsNewEnrollmentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Enrollment
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.enrollments.map((enrollment: any) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.course.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={enrollment.status}
                        onValueChange={handleEnrollmentStatusChange(
                          enrollment.id
                        )}
                        disabled={isUpdating === enrollment.id}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ENROLLED">Enrolled</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      {isUpdating === enrollment.id && (
                        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(enrollment.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {enrollment.endDate
                      ? new Date(enrollment.endDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/admin/students/${params.id}/enrollments/${enrollment.id}`
                        )
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {student.enrollments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center">
                    No enrollments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Issued By</TableHead>
                <TableHead>Issued At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.certificates.map((certificate: any) => (
                <TableRow key={certificate.id}>
                  <TableCell className="font-mono">
                    {certificate.code}
                  </TableCell>
                  <TableCell>{certificate.course.title}</TableCell>
                  <TableCell>{certificate.issuedBy.name}</TableCell>
                  <TableCell>
                    {new Date(certificate.issuedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        certificate.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-red-500/10 text-red-500'
                      }
                    >
                      {certificate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/certificates/${certificate.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {student.certificates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    No certificates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Placements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Placements</CardTitle>
          {!student.placements.some(
            (placement: any) => placement.status === 'JOINED'
          ) && (
            <Button
              size="sm"
              onClick={() =>
                router.push(`/admin/placements/new?studentId=${params.id}`)
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Record Placement
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined At</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.placements.map((placement: any) => (
                <TableRow key={placement.id}>
                  <TableCell>{placement.company.name}</TableCell>
                  <TableCell>{placement.position}</TableCell>
                  <TableCell>₹{placement.package.toFixed(2)} LPA</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        placement.status === 'JOINED'
                          ? 'bg-green-500/10 text-green-500'
                          : placement.status === 'DECLINED'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-blue-500/10 text-blue-500'
                      }
                    >
                      {placement.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(placement.joiningDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{placement.createdBy.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/placements/${placement.id}`)
                      }
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {student.placements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    No placements found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
