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
import { StudentStatus, Student } from '@prisma/client';
import useSWR from 'swr';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Eye, Trash2, Search as SearchIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusColors: Record<StudentStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  GRADUATED: 'bg-blue-100 text-blue-800',
  SUSPENDED_VIOLATION: 'bg-red-100 text-red-800',
};

type StudentWithCounts = Student & {
  _count: {
    enrollments: number;
    certificates: number;
    placements: number;
  };
  enrollments: {
    course: {
      title: string;
    };
    status: string;
  }[];
};

type StudentsResponse = {
  students: StudentWithCounts[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
};

export default function StudentsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'ALL'>(
    'ALL'
  );
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
  const apiUrl = `/api/admin/students?page=${page}&limit=10${
    debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''
  }${statusFilter !== 'ALL' ? `&status=${statusFilter}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<StudentsResponse>(
    apiUrl,
    fetcher
  );

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary transition-colors duration-200"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return null;
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as StudentStatus | 'ALL');
    setPage(1); // Reset to first page on filter change
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to delete student' };
      }

      toast({
        title: 'Student Deleted',
        description: 'Student has been deleted successfully.',
      });
      mutate(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete student',
      });
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold transition-colors duration-200 hover:text-primary">
          Students
        </h1>
        <Button
          onClick={() => router.push('/admin/students/new')}
          className={cn(
            'group relative transition-all duration-200',
            'hover:scale-105 hover:shadow-md',
            'active:scale-95'
          )}
        >
          <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          Add New Student
        </Button>
      </div>

      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="transition-colors duration-200 group-hover:text-primary">
              Student List
            </CardTitle>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    'pl-9 transition-all duration-200',
                    'focus:border-primary/20 focus:ring-1 focus:ring-primary/20',
                    'hover:border-primary/20'
                  )}
                />
              </div>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger
                  className={cn(
                    'w-[180px] transition-all duration-200',
                    'hover:border-primary/20 focus:border-primary/20',
                    'group-hover:border-primary/20'
                  )}
                >
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                  <SelectItem value="SUSPENDED_VIOLATION">
                    Suspended (Violation)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 transition-colors duration-200 group-hover:text-red-600">
              Failed to load students
            </div>
          ) : !data ? (
            <div className="text-center text-muted-foreground transition-colors duration-200 group-hover:text-primary/80">
              No students found
            </div>
          ) : (
            <div className="w-full overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Name</TableHead>
                    <TableHead className="w-[25%]">Email</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[10%] text-center">
                      Enrollments
                    </TableHead>
                    <TableHead className="w-[10%] text-center">
                      Certificates
                    </TableHead>
                    <TableHead className="w-[10%] text-center">
                      Placements
                    </TableHead>
                    <TableHead className="w-[10%] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.students.map((student) => (
                    <TableRow
                      key={student.id}
                      onClick={() =>
                        router.push(`/admin/students/${student.id}`)
                      }
                      className={cn(
                        'group/item transition-all duration-200',
                        'hover:bg-muted/50',
                        'active:scale-[0.98]'
                      )}
                    >
                      <TableCell className="font-medium transition-colors duration-200 group-hover/item:text-primary">
                        {student.name}
                      </TableCell>
                      <TableCell className="transition-colors duration-200 group-hover/item:text-primary/80">
                        {student.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            statusColors[student.status],
                            'transition-all duration-200',
                            'group-hover/item:scale-105'
                          )}
                        >
                          {student.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center transition-colors duration-200 group-hover/item:text-primary/80">
                        {student._count.enrollments}
                      </TableCell>
                      <TableCell className="text-center transition-colors duration-200 group-hover/item:text-primary/80">
                        {student._count.certificates}
                      </TableCell>
                      <TableCell className="text-center transition-colors duration-200 group-hover/item:text-primary/80">
                        {student._count.placements}
                      </TableCell>
                      <TableCell>
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              router.push(`/admin/students/${student.id}`);
                            }}
                            className={cn(
                              'transition-all duration-200',
                              'hover:bg-primary/10 hover:text-primary',
                              'active:scale-95'
                            )}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDelete(student.id);
                            }}
                            className={cn(
                              'transition-all duration-200',
                              'hover:bg-destructive/10 hover:text-destructive',
                              'active:scale-95'
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
