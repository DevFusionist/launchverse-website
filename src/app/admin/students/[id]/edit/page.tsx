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
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary transition-colors duration-200"></div>
      </div>
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
    <div className="container max-w-2xl py-8">
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="transition-colors duration-200 group-hover:text-primary">
            {params.id === 'new' ? 'Add New Student' : 'Edit Student'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={cn(
                            'transition-all duration-200',
                            'focus:border-primary/20 focus:ring-1 focus:ring-primary/20',
                            'hover:border-primary/20'
                          )}
                        />
                      </FormControl>
                      <FormMessage className="transition-colors duration-200" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className={cn(
                            'transition-all duration-200',
                            'focus:border-primary/20 focus:ring-1 focus:ring-primary/20',
                            'hover:border-primary/20'
                          )}
                        />
                      </FormControl>
                      <FormMessage className="transition-colors duration-200" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                        Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={cn(
                            'transition-all duration-200',
                            'focus:border-primary/20 focus:ring-1 focus:ring-primary/20',
                            'hover:border-primary/20'
                          )}
                        />
                      </FormControl>
                      <FormMessage className="transition-colors duration-200" />
                    </FormItem>
                  )}
                />

                {params.id === 'new' && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className={cn(
                              'transition-all duration-200',
                              'focus:border-primary/20 focus:ring-1 focus:ring-primary/20',
                              'hover:border-primary/20'
                            )}
                          />
                        </FormControl>
                        <FormMessage className="transition-colors duration-200" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="transition-colors duration-200 group-hover:text-primary/80">
                        Status
                      </FormLabel>
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
                              'group-hover:border-primary/20'
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
                      <FormMessage className="transition-colors duration-200" />
                    </FormItem>
                  )}
                />

                {courses?.courses && (
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
                        <ScrollArea className="h-[200px] rounded-md border p-4">
                          <div className="space-y-4">
                            {courses.courses.map((course) => (
                              <div
                                key={course.id}
                                className="flex items-center space-x-2"
                              >
                                <FormField
                                  key={course.id}
                                  control={form.control}
                                  name="courses"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={course.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(
                                              course.id
                                            )}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...(field.value || []),
                                                    course.id,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) =>
                                                        value !== course.id
                                                    )
                                                  );
                                            }}
                                            className={cn(
                                              'transition-all duration-200',
                                              'hover:border-primary/20',
                                              'group-hover:border-primary/20'
                                            )}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          {course.title}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-end gap-4">
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {params.id === 'new' ? 'Creating...' : 'Saving...'}
                    </>
                  ) : params.id === 'new' ? (
                    'Create Student'
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
