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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generate Certificate</h1>
        <p className="text-muted-foreground">
          Create a new certificate for a student
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Certificate'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
