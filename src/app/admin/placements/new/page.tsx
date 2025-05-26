'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import useSWR from 'swr';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  companyId: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  package: z.string().min(1, 'Package is required'),
  offerDate: z.string().min(1, 'Offer date is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  notes: z.string().optional(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Add these variants at the top level of the file
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      delayChildren: 0.1
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
      damping: 20,
      duration: 0.2
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.2
    }
  }
};

export default function NewPlacementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const studentIdFromUrl = searchParams.get('studentId');

  const { data: formData } = useSWR<{
    students: { id: string; name: string; email: string }[];
    companies: { id: string; name: string }[];
  }>('/api/admin/placements/form-data', fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: '',
      studentId: studentIdFromUrl || '',
    },
  });

  // Update form value when URL changes
  useEffect(() => {
    if (studentIdFromUrl) {
      form.setValue('studentId', studentIdFromUrl);
    }
  }, [studentIdFromUrl, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/admin/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          package: parseFloat(values.package),
        }),
      });

      if (!response.ok) throw new Error('Failed to create placement');

      toast({
        title: 'Placement record created successfully',
      });
      router.push('/admin/placements');
    } catch (error) {
      toast({
        title: 'Failed to create placement record',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold"
          >
            Record New Placement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Add a new student placement record
          </motion.p>
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
                Placement Details
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
                    <motion.div 
                      variants={containerVariants}
                      className="grid gap-6 md:grid-cols-2"
                    >
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="studentId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Student</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
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
                                      <SelectValue placeholder="Select student" />
                                    </SelectTrigger>
                                  </MotionDiv>
                                </FormControl>
                                <SelectContent>
                                  {formData?.students.map((student) => (
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
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="companyId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <Select
                                onValueChange={field.onChange}
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
                                      <SelectValue placeholder="Select company" />
                                    </SelectTrigger>
                                  </MotionDiv>
                                </FormControl>
                                <SelectContent>
                                  {formData?.companies.map((company) => (
                                    <SelectItem key={company.id} value={company.id}>
                                      {company.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    placeholder="e.g. Software Engineer"
                                    className={cn(
                                      "w-full transition-all duration-200",
                                      "hover:border-primary/20 focus:border-primary/20",
                                      "focus:ring-1 focus:ring-primary/20"
                                    )}
                                    {...field}
                                  />
                                </MotionDiv>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="package"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Package (LPA)</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 12.5"
                                    className={cn(
                                      "w-full transition-all duration-200",
                                      "hover:border-primary/20 focus:border-primary/20",
                                      "focus:ring-1 focus:ring-primary/20"
                                    )}
                                    {...field}
                                  />
                                </MotionDiv>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="offerDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Offer Date</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    type="date"
                                    max={new Date().toISOString().split('T')[0]}
                                    className={cn(
                                      "w-full transition-all duration-200",
                                      "hover:border-primary/20 focus:border-primary/20",
                                      "focus:ring-1 focus:ring-primary/20"
                                    )}
                                    {...field}
                                  />
                                </MotionDiv>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={form.control}
                          name="joiningDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Joining Date</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className={cn(
                                      "w-full transition-all duration-200",
                                      "hover:border-primary/20 focus:border-primary/20",
                                      "focus:ring-1 focus:ring-primary/20"
                                    )}
                                    {...field}
                                  />
                                </MotionDiv>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-full"
                              >
                                <Textarea
                                  placeholder="Additional notes about the placement..."
                                  className={cn(
                                    "w-full h-24 transition-all duration-200",
                                    "hover:border-primary/20 focus:border-primary/20",
                                    "focus:ring-1 focus:ring-primary/20"
                                  )}
                                  {...field}
                                />
                              </MotionDiv>
                            </FormControl>
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
                        ) : null}
                        {isSubmitting ? 'Creating...' : 'Create Placement'}
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
