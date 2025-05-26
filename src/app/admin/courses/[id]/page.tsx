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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
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
        <DialogContent>
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
        <DialogContent>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{data.course.title}</h1>
          <p className="text-muted-foreground">{data.course.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/courses/${params.id}/edit`)}
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
      </div>

      {/* Course Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center gap-2">
                <Select
                  value={data.course.status}
                  onValueChange={handleStatusChange}
                  disabled={Boolean(isUpdating)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                {isUpdating === 'status' && (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Duration</label>
              <p>{data.course.duration} weeks</p>
            </div>
            <div>
              <label className="text-sm font-medium">Fee</label>
              <p>${data.course.fee.toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Created</label>
              <p>{new Date(data.course.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
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
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.course.enrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">
                    {enrollment.student.name}
                  </TableCell>
                  <TableCell>{enrollment.student.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        enrollment.status === 'ENROLLED'
                          ? 'bg-green-500/10 text-green-500'
                          : enrollment.status === 'COMPLETED'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                      }
                    >
                      {enrollment.status}
                    </Badge>
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
                        router.push(`/admin/students/${enrollment.student.id}`)
                      }
                    >
                      View Student
                    </Button>
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
                <TableHead>Student</TableHead>
                <TableHead>Issued By</TableHead>
                <TableHead>Issued At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.course.certificates.map((certificate) => (
                <TableRow key={certificate.id}>
                  <TableCell className="font-mono">
                    {certificate.code}
                  </TableCell>
                  <TableCell>{certificate.student.name}</TableCell>
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
              {data.course.certificates.length === 0 && (
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
    </div>
  );
}
