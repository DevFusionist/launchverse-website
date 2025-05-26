'use client';

import { useRouter } from 'next/navigation';
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
import useSWR, { mutate } from 'swr';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Loader2, Pencil, Save, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  companyId: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  package: z.string().min(1, 'Package is required'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(['OFFERED', 'JOINED', 'DECLINED']),
  notes: z.string().optional(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusColors: Record<string, string> = {
  OFFERED: 'bg-blue-100 text-blue-800',
  JOINED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
};

// Update these variants at the top level of the file
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

export default function PlacementDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: placement,
    error,
    isLoading,
  } = useSWR<{
    placement: {
      id: string;
      student: { id: string; name: string; email: string };
      company: { id: string; name: string; logo?: string };
      createdBy: { name: string };
      createdAt: string;
      updatedAt: string;
      position: string;
      package: number;
      joiningDate: string;
      status: 'OFFERED' | 'JOINED' | 'DECLINED';
      notes?: string;
    };
    students: { id: string; name: string; email: string }[];
    companies: { id: string; name: string }[];
  }>(`/api/admin/placements/${params.id}`, fetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: placement?.placement
      ? {
          ...placement.placement,
          package: placement.placement.package.toString(),
          joiningDate: placement.placement.joiningDate.split('T')[0],
        }
      : undefined,
  });

  // Update form when placement data changes
  useEffect(() => {
    if (placement?.placement) {
      form.reset({
        ...placement.placement,
        package: placement.placement.package.toString(),
        joiningDate: placement.placement.joiningDate.split('T')[0],
      });
    }
  }, [placement, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/placements/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          package: parseFloat(values.package),
        }),
      });

      if (!response.ok) throw new Error('Failed to update placement');

      // Revalidate the placement data
      await mutate(`/api/admin/placements/${params.id}`);

      toast({
        title: 'Placement record updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Failed to update placement record',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/placements/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete placement');

      toast({
        title: 'Placement record deleted successfully',
      });
      router.push('/admin/placements');
    } catch (error) {
      toast({
        title: 'Failed to delete placement record',
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !placement) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          Failed to load placement details
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
          className="mb-8 flex items-center justify-between"
        >
          <div className="space-y-1">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
              Placement Details
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground"
            >
              View and manage placement information
            </motion.p>
          </div>
          <div className="flex gap-4">
            {!isEditing && (
              <>
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
                >
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="group relative overflow-hidden"
                  >
                    <MotionDiv
                      whileHover={{ rotate: 12 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="mr-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </MotionDiv>
                    Edit Details
                  </Button>
                </MotionDiv>

                <Dialog>
                  <DialogTrigger asChild>
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
                    >
                      <Button
                        variant="destructive"
                        className="group relative overflow-hidden"
                      >
                        <MotionDiv
                          whileHover={{ rotate: -12 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="mr-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </MotionDiv>
                        Delete
                      </Button>
                    </MotionDiv>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Placement Record</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this placement record?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <MotionDiv
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? (
                            <MotionDiv
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <Loader2 className="h-4 w-4" />
                            </MotionDiv>
                          ) : null}
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </MotionDiv>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
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
                Placement Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
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
                                        <SelectValue placeholder="Select student" />
                                      </SelectTrigger>
                                    </MotionDiv>
                                  </FormControl>
                                  <SelectContent>
                                    {placement.students.map((student) => (
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
                                    {placement.companies.map((company) => (
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
                                      {...field}
                                      value={field.value?.toString()}
                                      onChange={(e) => field.onChange(e.target.value)}
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
                                      {...field}
                                      value={field.value?.split('T')[0]}
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

                        <motion.div variants={itemVariants}>
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
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
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                    </MotionDiv>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="OFFERED">Offered</SelectItem>
                                    <SelectItem value="JOINED">Joined</SelectItem>
                                    <SelectItem value="DECLINED">Declined</SelectItem>
                                  </SelectContent>
                                </Select>
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
                                    className={cn(
                                      "w-full h-24 transition-all duration-200",
                                      "hover:border-primary/20 focus:border-primary/20",
                                      "focus:ring-1 focus:ring-primary/20"
                                    )}
                                    {...field}
                                    value={field.value || ''}
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
                          onClick={() => setIsEditing(false)}
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
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </MotionDiv>
                    </motion.div>
                  </form>
                </Form>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  <motion.div 
                    variants={containerVariants}
                    className="grid gap-6 md:grid-cols-2"
                  >
                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Student
                          </h3>
                          <div className="mt-1">
                            <div className="font-medium">
                              {placement.placement.student.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {placement.placement.student.email}
                            </div>
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Company
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            {placement.placement.company.logo && (
                              <img
                                src={placement.placement.company.logo}
                                alt={placement.placement.company.name}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                            )}
                            <span className="font-medium">
                              {placement.placement.company.name}
                            </span>
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Position
                          </h3>
                          <div className="mt-1 font-medium">
                            {placement.placement.position}
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Package
                          </h3>
                          <div className="mt-1 font-medium">
                            ₹{placement.placement.package.toFixed(2)} LPA
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Joining Date
                          </h3>
                          <div className="mt-1 font-medium">
                            {format(new Date(placement.placement.joiningDate), 'PP')}
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Status
                          </h3>
                          <div className="mt-1">
                            <Badge
                              variant="secondary"
                              className={cn(
                                statusColors[placement.placement.status],
                                'transition-all duration-200'
                              )}
                            >
                              {placement.placement.status}
                            </Badge>
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>
                  </motion.div>

                  {placement.placement.notes && (
                    <motion.div variants={itemVariants}>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Notes
                      </h3>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="mt-1 text-sm text-muted-foreground"
                      >
                        {placement.placement.notes}
                      </MotionDiv>
                    </motion.div>
                  )}

                  <motion.div 
                    variants={containerVariants}
                    className="grid gap-6 md:grid-cols-2"
                  >
                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Created By
                          </h3>
                          <div className="mt-1 font-medium">
                            {placement.placement.createdBy.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(placement.placement.createdAt), 'PPp')}
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">
                            Last Updated
                          </h3>
                          <div className="mt-1 font-medium">
                            {format(new Date(placement.placement.updatedAt), 'PPp')}
                          </div>
                        </div>
                      </MotionDiv>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
