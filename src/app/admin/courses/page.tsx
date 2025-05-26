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
import { Loader2, Plus, Search, Trash2, Eye, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, iconVariants, MotionDiv } from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/ui/motion';

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
    <PageTransition>
      <div className="space-y-8 p-8">
        <AnimatedSection
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
              Courses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground"
            >
              Manage and track course information
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
              onClick={() => router.push('/admin/courses/new')}
              className="group relative overflow-hidden"
            >
              <MotionDiv
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mr-2"
              >
                <Plus className="h-4 w-4" />
              </MotionDiv>
              Add New Course
            </Button>
          </MotionDiv>
        </AnimatedSection>

        <AnimatedSection
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="group relative"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                  Course List
                </CardTitle>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <MotionDiv
                    variants={fadeIn}
                    className="relative flex-1 sm:w-64 z-30"
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
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </MotionDiv>
                      <Input
                        placeholder="Search courses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={cn(
                          "pl-9 transition-all duration-200",
                          "focus:ring-2 focus:ring-primary/20",
                          "hover:border-primary/50"
                        )}
                      />
                    </MotionDiv>
                  </MotionDiv>
                  <MotionDiv
                    variants={fadeIn}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                      <SelectTrigger className={cn(
                        "w-[180px] transition-all duration-200",
                        "hover:border-primary/50",
                        "focus:ring-2 focus:ring-primary/20"
                      )}>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </MotionDiv>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
              ) : !data ? (
                <AnimatedSection
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="text-center text-muted-foreground"
                >
                  No data available
                </AnimatedSection>
              ) : (
                <>
                  <div className="rounded-md border">
                    <div className="w-full overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px] px-6">Title</TableHead>
                            <TableHead className="w-[300px] px-6">Description</TableHead>
                            <TableHead className="w-[100px] px-6">Duration</TableHead>
                            <TableHead className="w-[120px] px-6">Price</TableHead>
                            <TableHead className="w-[100px] px-6">Status</TableHead>
                            <TableHead className="w-[100px] px-6">Students</TableHead>
                            <TableHead className="w-[120px] px-6">Created</TableHead>
                            <TableHead className="w-[200px] px-6 pr-8 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <AnimatePresence mode="popLayout">
                            {data.courses.map((course, index) => (
                              <motion.tr
                                key={course.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                  layout: { duration: 0.2 },
                                  delay: index * 0.05,
                                }}
                                className="group/item hover:bg-muted/50"
                              >
                                <TableCell className="font-medium px-6 py-4">
                                  <MotionDiv
                                    whileHover={{ x: 2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    {course.title}
                                  </MotionDiv>
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate px-6 py-4">
                                  <MotionDiv
                                    whileHover={{ x: 2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="text-muted-foreground"
                                  >
                                    {course.description}
                                  </MotionDiv>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                  <MotionDiv
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    {course.duration} weeks
                                  </MotionDiv>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                  <MotionDiv
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    ₹{course.fee.toLocaleString('en-IN', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </MotionDiv>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      statusColors[course.status],
                                      'transition-all duration-200',
                                      'group-hover/item:scale-105'
                                    )}
                                  >
                                    {course.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                  <MotionDiv
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    {course._count.enrollments}
                                  </MotionDiv>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                  <MotionDiv
                                    whileHover={{ x: 2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="text-muted-foreground"
                                  >
                                    {new Date(course.createdAt).toLocaleDateString()}
                                  </MotionDiv>
                                </TableCell>
                                <TableCell className="px-6 py-4 pr-8 text-right">
                                  <div className="flex justify-end gap-2">
                                    <MotionDiv
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.push(`/admin/courses/${course.id}`)}
                                        className={cn(
                                          'h-8 w-8 transition-all duration-200',
                                          'hover:bg-primary/10 hover:text-primary',
                                          'active:scale-95'
                                        )}
                                        title="View Course"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </MotionDiv>

                                    <MotionDiv
                                      whileHover={{ scale: 1.1, rotate: 5 }}
                                      whileTap={{ scale: 0.95 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                                        className={cn(
                                          'h-8 w-8 transition-all duration-200',
                                          'hover:bg-primary/10 hover:text-primary',
                                          'active:scale-95'
                                        )}
                                        title="Edit Course"
                                      >
                                        <Pencil className="h-4 w-4" />
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
                                        className={cn(
                                          'h-8 w-8 transition-all duration-200',
                                          'text-red-600 hover:bg-red-500/10 hover:text-red-700',
                                          'active:scale-95'
                                        )}
                                        onClick={() => handleDelete(course.id)}
                                        title="Delete Course"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </MotionDiv>
                                  </div>
                                </TableCell>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {data && data.totalPages > 1 && (
                    <AnimatedSection
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      className="mt-4"
                    >
                      <div className="flex justify-center gap-2">
                        <MotionDiv
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={cn(
                              'transition-all duration-200',
                              'hover:bg-primary/10 hover:text-primary',
                              'active:scale-95'
                            )}
                          >
                            Previous
                          </Button>
                        </MotionDiv>
                        <MotionDiv
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                            disabled={page === data.totalPages}
                            className={cn(
                              'transition-all duration-200',
                              'hover:bg-primary/10 hover:text-primary',
                              'active:scale-95'
                            )}
                          >
                            Next
                          </Button>
                        </MotionDiv>
                      </div>
                    </AnimatedSection>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
