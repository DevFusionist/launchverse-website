'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseStatus, Course } from '@prisma/client';
import useSWR from 'swr';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type CourseWithCounts = Course & {
  _count: {
    enrollments: number;
    certificates: number;
  };
};

type CoursesResponse = {
  courses: CourseWithCounts[];
  total: number;
  page: number;
  totalPages: number;
};

const statusColors = {
  ACTIVE: 'bg-green-500/10 text-green-500',
  INACTIVE: 'bg-red-500/10 text-red-500',
  UPCOMING: 'bg-blue-500/10 text-blue-500',
};

export default function CoursesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Build API URL with query params
  const apiUrl = `/api/admin/courses?page=${page}&limit=10${
    debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''
  }${statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<CoursesResponse>(
    apiUrl,
    fetcher
  );

  if (status === 'loading') {
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

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as CourseStatus | 'ALL');
    setPage(1); // Reset to first page on filter change
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to delete course' };
      }

      toast({
        title: 'Course Deleted',
        description: 'Course has been deleted successfully.',
      });
      mutate(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete course',
      });
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Courses</CardTitle>
          <Button onClick={() => router.push('/admin/courses/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load courses
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Certificates</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.courses.map((course: CourseWithCounts) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {course.description}
                        </TableCell>
                        <TableCell>{course.duration} weeks</TableCell>
                        <TableCell>${course.fee.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColors[course.status]}
                          >
                            {course.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{course._count.enrollments}</TableCell>
                        <TableCell>{course._count.certificates}</TableCell>
                        <TableCell>
                          {format(new Date(course.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/courses/${course.id}`)
                            }
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/courses/${course.id}/edit`)
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(course.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {data?.courses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="py-8 text-center">
                          No courses found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {data.courses.length} of {data.total} courses
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(data.totalPages, p + 1))
                      }
                      disabled={page === data.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
