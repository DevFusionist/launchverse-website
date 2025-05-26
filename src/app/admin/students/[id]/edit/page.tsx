'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentStatus, EnrollmentStatus } from '@prisma/client';
import useSWR from 'swr';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import {
  AnimatedSection,
  fadeIn,
  slideIn,
  staggerContainer,
  staggerItem,
  MotionDiv,
  cardVariants,
  buttonVariants,
  iconVariants,
  PageTransition,
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  duration: number | { min: number; max: number };
}

interface CoursesResponse {
  courses: Course[];
}

interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  startDate: Date;
  endDate: Date | null;
  course: Course;
}

interface StudentWithDetails {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: StudentStatus;
  enrollments: Enrollment[];
  _count: {
    enrollments: number;
    certificates: number;
    placements: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'GRADUATED'] as const),
  courses: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

type CourseWithDuration = Course & {
  duration: number | { min: number; max: number };
};

export default function EditStudentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: studentData,
    error: studentError,
    isLoading: studentLoading,
  } = useSWR(
    params.id === 'new' ? null : `/api/admin/students/${params.id}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
    }
  );

  // Add console log to debug the fetched data
  useEffect(() => {
    console.log('Student Data:', studentData);
  }, [studentData]);

  const { data: courses } = useSWR<CoursesResponse>(
    '/api/admin/courses?status=ACTIVE',
    fetcher
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'ACTIVE' as const,
      courses: [],
    },
  });

  useEffect(() => {
    if (studentData?.student) {
      console.log('Setting form data with:', studentData.student);
      console.log('Current status value:', studentData.student.status);
      const formData: FormData = {
        name: studentData.student.name || '',
        email: studentData.student.email || '',
        phone: studentData.student.phone || '',
        status: studentData.student.status || 'ACTIVE',
        courses:
          studentData.student.enrollments?.map((e: Enrollment) => e.courseId) ||
          [],
      };
      console.log('Form data to be set:', formData);
      console.log('Status in formData:', formData.status);
      form.reset(formData);
      console.log('Form values after reset:', form.getValues());
    }
  }, [studentData, form]);

  if (status === 'loading' || studentLoading) {
    return (
      <PageTransition>
        <div className="container max-w-2xl py-8">
          <AnimatedSection variants={fadeIn} className="mb-8">
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
          </AnimatedSection>

          <Card className="relative z-0">
            <CardHeader>
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-6 w-48 bg-muted rounded-md"
              />
            </CardHeader>
            <CardContent>
              <MotionDiv
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <MotionDiv
                    key={index}
                    variants={staggerItem}
                    className="space-y-2"
                  >
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="h-5 w-24 bg-muted rounded-md"
                    />
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index + 0.1 }}
                      className="h-10 w-full bg-muted rounded-md"
                    />
                  </MotionDiv>
                ))}
                <MotionDiv
                  variants={buttonVariants}
                  className="h-10 w-24 bg-muted rounded-md mt-4"
                />
              </MotionDiv>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return null;
  }

  if (studentError && params.id !== 'new') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold transition-colors duration-200 hover:text-primary">
            Error
          </h2>
          <p className="text-muted-foreground transition-colors duration-200 hover:text-primary/80">
            Failed to load student details
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      const url =
        params.id === 'new'
          ? '/api/admin/students'
          : `/api/admin/students/${params.id}`;

      const method = params.id === 'new' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to save student' };
      }

      toast({
        title: params.id === 'new' ? 'Student Created' : 'Student Updated',
        description:
          data.message || 'Student information has been saved successfully.',
      });

      router.push('/admin/students');
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save student',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container max-w-2xl py-8">
        <AnimatedSection variants={fadeIn} className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            {params.id === 'new' ? 'Add New Student' : 'Edit Student'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            {params.id === 'new' ? 'Create a new student account' : 'Update student information'}
          </motion.p>
        </AnimatedSection>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="group-hover:text-primary transition-colors">
              {params.id === 'new' ? 'Add New Student' : 'Edit Student'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <MotionDiv
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <MotionDiv variants={staggerItem}>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                            Name
                          </FormLabel>
                          <FormControl>
                            <MotionDiv
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Input
                                {...field}
                                className={cn(
                                  'transition-all duration-200',
                                  'focus:border-primary/20 focus:ring-2 focus:ring-primary/20',
                                  'hover:border-primary/20',
                                  'group-hover:border-primary/20'
                                )}
                              />
                            </MotionDiv>
                          </FormControl>
                          <FormMessage className="transition-colors duration-200" />
                        </FormItem>
                      )}
                    />
                  </MotionDiv>

                  <MotionDiv variants={staggerItem}>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                            Email
                          </FormLabel>
                          <FormControl>
                            <MotionDiv
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Input
                                {...field}
                                type="email"
                                className={cn(
                                  'transition-all duration-200',
                                  'focus:border-primary/20 focus:ring-2 focus:ring-primary/20',
                                  'hover:border-primary/20',
                                  'group-hover:border-primary/20'
                                )}
                              />
                            </MotionDiv>
                          </FormControl>
                          <FormMessage className="transition-colors duration-200" />
                        </FormItem>
                      )}
                    />
                  </MotionDiv>

                  <MotionDiv variants={staggerItem}>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <MotionDiv
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <Input
                                {...field}
                                className={cn(
                                  'transition-all duration-200',
                                  'focus:border-primary/20 focus:ring-2 focus:ring-primary/20',
                                  'hover:border-primary/20',
                                  'group-hover:border-primary/20'
                                )}
                              />
                            </MotionDiv>
                          </FormControl>
                          <FormMessage className="transition-colors duration-200" />
                        </FormItem>
                      )}
                    />
                  </MotionDiv>

                  {params.id === 'new' && (
                    <MotionDiv variants={staggerItem}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                              Password
                            </FormLabel>
                            <FormControl>
                              <MotionDiv
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Input
                                  {...field}
                                  type="password"
                                  className={cn(
                                    'transition-all duration-200',
                                    'focus:border-primary/20 focus:ring-2 focus:ring-primary/20',
                                    'hover:border-primary/20',
                                    'group-hover:border-primary/20'
                                  )}
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage className="transition-colors duration-200" />
                          </FormItem>
                        )}
                      />
                    </MotionDiv>
                  )}

                  <MotionDiv variants={staggerItem}>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                            Status
                          </FormLabel>
                          <MotionDiv
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={params.id === 'new'}
                            >
                              <FormControl>
                                <SelectTrigger
                                  className={cn(
                                    'transition-all duration-200',
                                    'hover:border-primary/20 focus:border-primary/20',
                                    'group-hover:border-primary/20',
                                    'focus:ring-2 focus:ring-primary/20'
                                  )}
                                >
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="GRADUATED">Graduated</SelectItem>
                              </SelectContent>
                            </Select>
                          </MotionDiv>
                          <FormMessage className="transition-colors duration-200" />
                        </FormItem>
                      )}
                    />
                  </MotionDiv>

                  {courses?.courses && courses.courses.length > 0 && (
                    <MotionDiv variants={staggerItem}>
                      <FormField
                        control={form.control}
                        name="courses"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                                Enroll in Courses
                              </FormLabel>
                            </div>
                            <MotionDiv
                              initial={{ scale: 1 }}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <ScrollArea className="h-[200px] rounded-md border p-4 transition-all duration-200 hover:border-primary/20 group-hover:border-primary/20">
                                <MotionDiv
                                  variants={staggerContainer}
                                  initial="hidden"
                                  animate="show"
                                  className="space-y-4"
                                >
                                  {courses.courses.map((course, index) => (
                                    <MotionDiv
                                      key={course.id}
                                      variants={staggerItem}
                                      className="flex items-center space-x-2"
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <FormField
                                        key={course.id}
                                        control={form.control}
                                        name="courses"
                                        render={({ field }) => (
                                          <FormItem
                                            key={course.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <MotionDiv
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                              >
                                                <Checkbox
                                                  checked={field.value?.includes(course.id)}
                                                  onCheckedChange={(checked) => {
                                                    return checked
                                                      ? field.onChange([...(field.value || []), course.id])
                                                      : field.onChange(
                                                          field.value?.filter((value) => value !== course.id)
                                                        );
                                                  }}
                                                  className={cn(
                                                    'transition-all duration-200',
                                                    'hover:border-primary/20',
                                                    'group-hover:border-primary/20',
                                                    'focus:ring-2 focus:ring-primary/20'
                                                  )}
                                                />
                                              </MotionDiv>
                                            </FormControl>
                                            <FormLabel className="font-normal transition-colors duration-200 group-hover:text-primary/80">
                                              {course.title}
                                            </FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                    </MotionDiv>
                                  ))}
                                </MotionDiv>
                              </ScrollArea>
                            </MotionDiv>
                          </FormItem>
                        )}
                      />
                    </MotionDiv>
                  )}
                </MotionDiv>

                <div className="flex justify-end gap-4">
                  <MotionDiv
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05, rotate: -2, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.95, rotate: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="relative z-10"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className={cn(
                        'transition-all duration-200',
                        'hover:bg-muted hover:text-primary',
                        'active:scale-95'
                      )}
                    >
                      Cancel
                    </Button>
                  </MotionDiv>
                  <MotionDiv
                    variants={buttonVariants}
                    whileHover={{ scale: 1.05, rotate: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.95, rotate: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="relative z-10"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        'transition-all duration-200',
                        'hover:bg-primary/90',
                        'active:scale-95'
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <MotionDiv
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Loader2 className="h-4 w-4" />
                          </MotionDiv>
                          {params.id === 'new' ? 'Creating...' : 'Saving...'}
                        </>
                      ) : params.id === 'new' ? (
                        'Create Student'
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </MotionDiv>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
