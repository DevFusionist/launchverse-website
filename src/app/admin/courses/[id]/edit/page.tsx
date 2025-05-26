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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseStatus } from '@prisma/client';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 week')
    .max(52, 'Duration cannot exceed 52 weeks'),
  fee: z.coerce
    .number()
    .min(0, 'Fee cannot be negative')
    .max(100000, 'Fee cannot exceed ₹1,00,000'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UPCOMING'] as const),
});

type FormData = z.infer<typeof formSchema>;

// Add these variants at the top level of the file, after imports
const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: courseData,
    error: courseError,
    isLoading: courseLoading,
  } = useSWR(
    params.id === 'new' ? null : `/api/admin/courses/${params.id}`,
    fetcher
  );

  console.log('Course Data:', courseData);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 4,
      fee: 0,
      status: 'UPCOMING',
    },
  });

  useEffect(() => {
    if (courseData?.course) {
      console.log('Setting form values:', courseData.course);
      const values = {
        title: courseData.course.title,
        description: courseData.course.description,
        duration: courseData.course.duration,
        fee: courseData.course.fee,
        status: courseData.course.status,
      };
      console.log('Resetting form with values:', values);
      form.reset(values);
    }
  }, [courseData, form]);

  console.log('Current form values:', form.getValues());

  if (status === 'loading' || courseLoading) {
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

  if (courseError && params.id !== 'new') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">Failed to load course details</p>
        </div>
      </div>
    );
  }

  if (params.id !== 'new' && !courseData?.course) {
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

  const onSubmit = async (values: FormData) => {
    try {
      setIsSubmitting(true);
      const url =
        params.id === 'new'
          ? '/api/admin/courses'
          : `/api/admin/courses/${params.id}`;

      const method = params.id === 'new' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to save course' };
      }

      toast({
        title: params.id === 'new' ? 'Course Created' : 'Course Updated',
        description:
          data.message || 'Course information has been saved successfully.',
      });

      router.push('/admin/courses');
    } catch (error: any) {
      console.error('Error saving course:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to save course',
      });
    } finally {
      setIsSubmitting(false);
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
              {params.id === 'new' ? 'Create New Course' : 'Edit Course'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground"
            >
              {params.id === 'new' ? 'Add a new course to the system' : 'Update course information'}
            </motion.p>
          </div>
          <MotionDiv
            variants={buttonVariants}
            whileHover={{ 
              scale: 1.05,
              rotate: -2,
              boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
            }}
            whileTap={{ 
              scale: 0.95,
              rotate: 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10 
            }}
            className="relative z-10"
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="group relative overflow-hidden"
            >
              <MotionDiv
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </MotionDiv>
              Back to Courses
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
              <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                Course Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div 
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <motion.div variants={fieldVariants}>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-full"
                              >
                                <Input
                                  {...field}
                                  className={cn(
                                    "w-full transition-all duration-200",
                                    "hover:border-primary/20 focus:border-primary/20",
                                    "focus:ring-1 focus:ring-primary/20"
                                  )}
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-full"
                              >
                                <Textarea
                                  {...field}
                                  className={cn(
                                    "w-full transition-all duration-200 min-h-[100px]",
                                    "hover:border-primary/20 focus:border-primary/20",
                                    "focus:ring-1 focus:ring-primary/20"
                                  )}
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div 
                      variants={fieldVariants}
                      className="grid gap-6 md:grid-cols-2"
                    >
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (weeks)</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-full"
                              >
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className={cn(
                                    "w-full transition-all duration-200",
                                    "hover:border-primary/20 focus:border-primary/20",
                                    "focus:ring-1 focus:ring-primary/20"
                                  )}
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fee (₹)</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-full"
                              >
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className={cn(
                                    "w-full transition-all duration-200",
                                    "hover:border-primary/20 focus:border-primary/20",
                                    "focus:ring-1 focus:ring-primary/20"
                                  )}
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <SelectTrigger className={cn(
                                    "w-full transition-all duration-200",
                                    "hover:border-primary/20 focus:border-primary/20",
                                    "focus:ring-1 focus:ring-primary/20"
                                  )}>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </MotionDiv>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="flex justify-end gap-4 pt-4"
                  >
                    <MotionDiv
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="group relative z-30"
                      >
                        Cancel
                      </Button>
                    </MotionDiv>

                    <MotionDiv
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative z-30"
                      >
                        {isSubmitting ? (
                          <MotionDiv
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Loader2 className="h-4 w-4" />
                          </MotionDiv>
                        ) : (
                          <MotionDiv
                            whileHover={{ rotate: 12 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="mr-2"
                          >
                            <Save className="h-4 w-4" />
                          </MotionDiv>
                        )}
                        {isSubmitting ? 'Saving...' : 'Save Course'}
                      </Button>
                    </MotionDiv>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
