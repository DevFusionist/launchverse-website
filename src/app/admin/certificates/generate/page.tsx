'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import {
  AnimatedSection,
  fadeIn,
  slideIn,
  staggerContainer,
  staggerItem,
  cardVariants,
  MotionDiv,
  buttonVariants,
  iconVariants,
  PageTransition,
} from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  courseId: z.string().min(1, 'Please select a course'),
});

type FormData = z.infer<typeof formSchema>;

export default function GenerateCertificatePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: students } = useSWR<{
    students: Array<{ id: string; name: string; email: string }>;
  }>('/api/admin/students', fetcher);

  const { data: courses } = useSWR<{
    courses: Array<{ id: string; title: string }>;
  }>('/api/admin/courses', fetcher);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <PageTransition>
        <div className="container mx-auto py-8">
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

          <AnimatedSection variants={slideIn}>
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-6 w-48 bg-muted rounded-md mb-2"
                />
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-4 w-96 bg-muted rounded-md"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="h-4 w-20 bg-muted rounded-md"
                    />
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="h-10 w-full bg-muted rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="h-4 w-20 bg-muted rounded-md"
                    />
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="h-10 w-full bg-muted rounded-md"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="h-10 w-24 bg-muted rounded-md"
                    />
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="h-10 w-40 bg-muted rounded-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </PageTransition>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/admin/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw { message: result.error || 'Failed to generate certificate' };
      }

      toast({
        title: 'Certificate Generated',
        description:
          'Certificate has been generated successfully. Student status has been updated to GRADUATED and course enrollment status to COMPLETED.',
      });
      router.push(`/admin/certificates`);
    } catch (error: any) {
      console.error('Error generating certificate:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate certificate',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8">
        <AnimatedSection variants={fadeIn} className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            Generate Certificate
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Create a new certificate for a student
          </motion.p>
        </AnimatedSection>

        <AnimatedSection variants={slideIn}>
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">Certificate Details</CardTitle>
              <CardDescription>
                Select a student and course to generate a certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student</FormLabel>
                        <MotionDiv
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                                <SelectValue placeholder="Select a student" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {students?.students.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name} ({student.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </MotionDiv>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course</FormLabel>
                        <MotionDiv
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
                                <SelectValue placeholder="Select a course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courses?.courses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </MotionDiv>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <MotionDiv
                      variants={buttonVariants}
                      whileHover={{ scale: 1.05, rotate: -2, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                      whileTap={{ scale: 0.95, rotate: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </MotionDiv>
                    <MotionDiv
                      variants={buttonVariants}
                      whileHover={{ scale: 1.05, rotate: 2, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                      whileTap={{ scale: 0.95, rotate: -1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <Button
                        type="submit"
                        disabled={isGenerating}
                        className={cn(
                          'transition-all duration-200',
                          'hover:bg-primary/90',
                          'active:scale-95'
                        )}
                      >
                        {isGenerating ? (
                          <>
                            <MotionDiv
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Loader2 className="h-4 w-4" />
                            </MotionDiv>
                            Generating...
                          </>
                        ) : (
                          'Generate Certificate'
                        )}
                      </Button>
                    </MotionDiv>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
