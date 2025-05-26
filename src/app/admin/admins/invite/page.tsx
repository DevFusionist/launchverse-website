'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminRole } from '@prisma/client';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const inviteAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.literal('ADMIN'),
});

type InviteAdminForm = z.infer<typeof inviteAdminSchema>;

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

export default function InviteAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InviteAdminForm>({
    resolver: zodResolver(inviteAdminSchema),
    defaultValues: {
      email: '',
      name: '',
      role: 'ADMIN',
    },
  });

  const onSubmit = async (data: InviteAdminForm) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/create/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to invite admin');
      }

      toast({
        title: 'Success',
        description: 'Admin invitation sent successfully',
      });
      router.push('/admin/admins');
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to invite admin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            Invite Admin
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground"
          >
            Send an invitation to a new admin
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
                Admin Invitation
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
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    placeholder="Full name"
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
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <MotionDiv
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="w-full"
                                >
                                  <Input
                                    type="email"
                                    placeholder="email@example.com"
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
                        {isLoading ? 'Sending Invitation...' : 'Send Invitation'}
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
