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
import { motion, AnimatePresence } from 'framer-motion';
import {
  MotionDiv,
  PageTransition,
  AnimatedSection,
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
  iconVariants,
  fadeIn,
  slideIn,
} from '@/components/ui/motion';
import Image from 'next/image';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusColors: Record<StudentStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  GRADUATED: 'bg-blue-100 text-blue-800',
  SUSPENDED_VIOLATION: 'bg-red-100 text-red-800',
};

type StudentWithCounts = Student & {
  avatar?: string | null;
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

const MotionTableRow = motion(TableRow);

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
      <PageTransition>
        <div className="container py-8">
          <AnimatedSection variants={fadeIn} className="mb-8 flex items-center justify-between">
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
              className="h-10 w-32 bg-muted rounded-md"
            />
          </AnimatedSection>

          {/* Stats Overview Skeleton */}
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {[1, 2, 3, 4].map((_, index) => (
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

          {/* Table Skeleton */}
          <AnimatedSection variants={fadeIn}>
            <Card className="relative z-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-6 w-32 bg-muted rounded-md"
                  />
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-10 w-72 bg-muted rounded-md"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[25%]">Name</TableHead>
                        <TableHead className="w-[25%]">Email</TableHead>
                        <TableHead className="w-[10%]">Status</TableHead>
                        <TableHead className="w-[10%] text-center">Enrollments</TableHead>
                        <TableHead className="w-[10%] text-center">Certificates</TableHead>
                        <TableHead className="w-[10%] text-center">Placements</TableHead>
                        <TableHead className="w-[10%] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <MotionTableRow
                          key={index}
                          variants={cardVariants}
                          initial="initial"
                          animate="show"
                          transition={{ delay: index * 0.1 }}
                          className="relative z-0"
                        >
                          <TableCell className="w-[300px]">
                            <div className="flex items-center gap-2">
                              <MotionDiv className="h-8 w-8 bg-muted rounded-full" />
                              <div className="space-y-2">
                                <MotionDiv className="h-4 w-32 bg-muted rounded-md" />
                                <MotionDiv className="h-3 w-48 bg-muted rounded-md" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <MotionDiv className="h-4 w-24 bg-muted rounded-md" />
                          </TableCell>
                          <TableCell>
                            <MotionDiv className="h-4 w-28 bg-muted rounded-md" />
                          </TableCell>
                          <TableCell className="text-center">
                            <MotionDiv className="h-4 w-12 bg-muted rounded-md mx-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            <MotionDiv className="h-4 w-12 bg-muted rounded-md mx-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            <MotionDiv className="h-4 w-12 bg-muted rounded-md mx-auto" />
                          </TableCell>
                          <TableCell className="text-right">
                            <MotionDiv className="h-8 w-8 bg-muted rounded-md ml-auto" />
                          </TableCell>
                        </MotionTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
      </div>
      </PageTransition>
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
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection variants={fadeIn} className="mb-8 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
          Students
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground"
            >
              Manage and track student information
            </motion.p>
          </div>
          <MotionDiv
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              rotate: 2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
            whileTap={{ 
              scale: 0.95,
              rotate: -1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10 
            }}
            className="relative z-10"
          >
        <Button
          onClick={() => router.push('/admin/students/new')}
              className="group relative overflow-hidden"
            >
              <MotionDiv
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mr-2"
              >
                <Plus className="h-4 w-4" />
              </MotionDiv>
              Add Student
        </Button>
          </MotionDiv>
        </AnimatedSection>

        <AnimatedSection variants={slideIn}>
          <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="group-hover:text-primary transition-colors">Student List</CardTitle>
                <div className="flex items-center gap-4">
                  <MotionDiv
                    variants={fadeIn}
                    className="relative w-72 z-20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <MotionDiv
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <MotionDiv
                        initial={{ opacity: 0.5 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute left-2 top-2.5"
                      >
                        <SearchIcon className="h-4 w-4 text-muted-foreground" />
                      </MotionDiv>
                <Input
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                      />
                    </MotionDiv>
                  </MotionDiv>
                  <MotionDiv
                    variants={fadeIn}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Select
                      value={statusFilter}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-[180px] transition-all duration-200 hover:border-primary/50">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                </SelectContent>
              </Select>
                  </MotionDiv>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
                  <MotionDiv
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                  </MotionDiv>
            </div>
          ) : error ? (
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-500"
                >
              Failed to load students
                </MotionDiv>
          ) : !data ? (
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-muted-foreground"
                >
              No students found
                </MotionDiv>
          ) : (
                <div className="rounded-md border w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Name</TableHead>
                    <TableHead className="w-[25%]">Email</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                        <TableHead className="w-[10%] text-center">Enrollments</TableHead>
                        <TableHead className="w-[10%] text-center">Certificates</TableHead>
                        <TableHead className="w-[10%] text-center">Placements</TableHead>
                        <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                      {data.students.map((student, index) => (
                        <MotionTableRow
                      key={student.id}
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
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <MotionDiv
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="relative h-10 w-10 overflow-hidden rounded-full"
                              >
                                {student.avatar ? (
                                  <Image
                                    src={student.avatar}
                                    alt={student.name}
                                    fill
                                    className="object-cover transition-transform duration-200 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                    {student.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </MotionDiv>
                              <div className="min-w-0 flex-1">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <div className="font-medium truncate" title={student.name}>{student.name}</div>
                                </MotionDiv>
                                <MotionDiv
                                  whileHover={{ x: 2, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="inline-block"
                                >
                                  <span className="text-sm text-muted-foreground truncate block">
                        {student.email}
                                  </span>
                                </MotionDiv>
                              </div>
                            </div>
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
                          <TableCell className="text-center">
                            <MotionDiv
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                        {student._count.enrollments}
                            </MotionDiv>
                      </TableCell>
                          <TableCell className="text-center">
                            <MotionDiv
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                        {student._count.certificates}
                            </MotionDiv>
                      </TableCell>
                          <TableCell className="text-center">
                            <MotionDiv
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                        {student._count.placements}
                            </MotionDiv>
                      </TableCell>
                      <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <MotionDiv
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                              </MotionDiv>
                              <MotionDiv
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
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
                              </MotionDiv>
                        </div>
                      </TableCell>
                        </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </AnimatedSection>
    </div>
    </PageTransition>
  );
}
