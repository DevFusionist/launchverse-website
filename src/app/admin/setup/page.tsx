'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
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
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const setupAdminSchema = z
  .object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SetupAdminForm = z.infer<typeof setupAdminSchema>;

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

export default function SetupAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const form = useForm<SetupAdminForm>({
    resolver: zodResolver(setupAdminSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast({
        title: 'Error',
        description: 'Invalid or missing invitation token',
        variant: 'destructive',
      });
      router.push('/admin/login');
      return;
    }

    // Fetch invitation details
    fetch(`/api/admin/create/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setInvitation(data.invitation);
      })
      .catch((error) => {
        toast({
          title: 'Error',
          description: error.message || 'Failed to verify invitation',
          variant: 'destructive',
        });
        router.push('/admin/login');
      });
  }, [searchParams, router, toast]);

  const onSubmit = async (data: SetupAdminForm) => {
    try {
      setIsLoading(true);
      const token = searchParams.get('token');
      const response = await fetch('/api/admin/create/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          otp: data.otp,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set up account');
      }

      toast({
        title: 'Success',
        description: 'Account set up successfully. You can now log in.',
      });
      router.push('/admin/login');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to set up account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Verifying invitation...</h1>
          <p className="text-muted-foreground">
            Please wait while we verify your invitation.
          </p>
        </div>
      </div>
    );
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
            Initial Setup
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Complete the initial setup to get started
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
                Admin Account Setup
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
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>OTP</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
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
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    type="password"
                                    placeholder="Enter your password"
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
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    type="password"
                                    placeholder="Confirm your password"
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
                        type="submit"
                        disabled={isLoading}
                        className="group relative z-30"
                      >
                        {isLoading ? (
                          <MotionDiv
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Loader2 className="h-4 w-4" />
                          </MotionDiv>
                        ) : null}
                        {isLoading ? 'Setting Up Account...' : 'Set Up Account'}
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
