'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MotionDiv,
  PageTransition,
  AnimatedSection,
  staggerContainer,
  staggerItem,
  cardVariants,
  buttonVariants,
  iconVariants,
  fadeIn,
} from '@/components/ui/motion';

const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  description: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  contactPersonEmail: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  logo: z.string().optional(),
  logoFile: z.any().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CompanyFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const companyId = searchParams.get('id');
  const isEditMode = !!companyId;
  console.log('isEditMode', isEditMode);
  const { data: companyData, error: companyError } = useSWR<{
    company: CompanyFormValues;
  }>(isEditMode ? `/api/admin/companies/${companyId}` : null, fetcher);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      website: '',
      description: '',
      industry: '',
      location: '',
      logo: '',
    },
  });

  // Update form with company data when in edit mode
  useEffect(() => {
    if (isEditMode && companyData?.company) {
      form.reset(companyData.company);
    }
  }, [isEditMode, companyData, form]);

  if (status === 'loading' || (isEditMode && !companyData && !companyError)) {
    return (
      <PageTransition>
        <div className="container py-8">
          <AnimatedSection variants={fadeIn} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
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
              </div>
              <MotionDiv
                variants={buttonVariants}
                className="h-10 w-24 bg-muted rounded-md"
              />
            </div>
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
              <div className="grid gap-6">
                {/* Logo Upload Skeleton */}
                <div className="space-y-2">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-5 w-24 bg-muted rounded-md"
                  />
                  <div className="flex items-center gap-4">
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="h-24 w-24 bg-muted rounded-lg"
                    />
                    <div className="space-y-2">
                      <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-10 w-32 bg-muted rounded-md"
                      />
                      <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="h-4 w-48 bg-muted rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Fields Skeleton */}
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="space-y-2">
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
                    </div>
                  ))}
                </div>

                {/* Description Field Skeleton */}
                <div className="space-y-2 md:col-span-2">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="h-5 w-24 bg-muted rounded-md"
                  />
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="h-32 w-full bg-muted rounded-md"
                  />
                </div>

                {/* Submit Button Skeleton */}
                <div className="flex justify-end gap-4">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="h-10 w-24 bg-muted rounded-md"
                  />
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="h-10 w-32 bg-muted rounded-md"
                  />
                </div>
              </div>
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

  if (isEditMode && companyError) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          Failed to load company details
        </div>
      </div>
    );
  }

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      form.setValue('logo', data.url);
      toast({
        title: 'Logo Uploaded',
        description: 'Company logo has been uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Failed to upload logo',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    const logoUrl = form.watch('logo');
    if (!logoUrl) return;

    try {
      setIsUploading(true);
      const response = await fetch(
        `/api/upload?url=${encodeURIComponent(logoUrl)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete logo');
      }

      form.setValue('logo', '');
      form.setValue('logoFile', undefined);
      toast({
        title: 'Logo Deleted',
        description: 'Company logo has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Error deleting logo:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: error.message || 'Failed to delete logo',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CompanyFormValues) => {
    try {
      setIsSubmitting(true);

      // If there's a new logo file, upload it first and wait for the URL
      let logoUrl = data.logo;
      if (data.logoFile) {
        const formData = new FormData();
        formData.append('file', data.logoFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload logo');
        }

        const uploadData = await uploadResponse.json();
        logoUrl = uploadData.url;
      }

      const url = isEditMode
        ? `/api/admin/companies/${companyId}`
        : '/api/admin/companies';

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          website: data.website,
          description: data.description,
          industry: data.industry,
          location: data.location,
          contactPersonEmail: data.contactPersonEmail,
          logo: logoUrl, // Use the uploaded logo URL
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw {
          message:
            result.error ||
            `Failed to ${isEditMode ? 'update' : 'create'} company`,
        };
      }

      toast({
        title: isEditMode ? 'Company Updated' : 'Company Created',
        description: `Company has been ${isEditMode ? 'updated' : 'created'} successfully.`,
      });

      router.push('/admin/companies');
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? 'updating' : 'creating'} company:`,
        error
      );
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} company`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="container py-8">
        <AnimatedSection variants={fadeIn} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold"
              >
                {isEditMode ? 'Edit Company' : 'Add New Company'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground"
              >
                {isEditMode ? 'Update company information' : 'Create a new company profile'}
              </motion.p>
            </div>
            <MotionDiv
              variants={buttonVariants}
              whileHover={{ 
                scale: 1.05,
                rotate: -2,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="group relative overflow-hidden"
              >
                <MotionDiv
                  whileHover={{ x: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mr-2"
                >
                  <X className="h-4 w-4" />
                </MotionDiv>
                Cancel
              </Button>
            </MotionDiv>
          </div>
        </AnimatedSection>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <AnimatedSection variants={cardVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <MotionDiv variants={staggerItem} className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Input 
                                  {...field} 
                                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Input 
                                  {...field} 
                                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Input 
                                  {...field} 
                                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Input 
                                  {...field} 
                                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPersonEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person Email</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Input 
                                  {...field} 
                                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <MotionDiv
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <Textarea 
                                  {...field} 
                                  className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                                />
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Company Logo</FormLabel>
                            <FormControl>
                              <MotionDiv
                                variants={cardVariants}
                                className="flex items-center gap-4"
                              >
                                {field.value ? (
                                  <MotionDiv
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="relative h-24 w-24 overflow-hidden rounded-lg border"
                                  >
                                    <Image
                                      src={field.value}
                                      alt="Company logo"
                                      fill
                                      className="object-cover"
                                    />
                                    <MotionDiv
                                      whileHover={{ opacity: 1 }}
                                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity"
                                    >
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={handleDeleteLogo}
                                        disabled={isUploading}
                                        className="h-8 w-8"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </MotionDiv>
                                  </MotionDiv>
                                ) : (
                                  <MotionDiv
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  >
                                    <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed transition-colors hover:border-primary/50 hover:bg-primary/5">
                                      <MotionDiv
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="text-muted-foreground group-hover:text-primary"
                                      >
                                        <Upload className="h-8 w-8" />
                                      </MotionDiv>
                                      <input
                                        type="file"
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            form.setValue('logoFile', file);
                                            handleLogoUpload(file);
                                          }
                                        }}
                                        disabled={isUploading}
                                      />
                                    </label>
                                  </MotionDiv>
                                )}
                                {isUploading && (
                                  <MotionDiv
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                  >
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading...
                                  </MotionDiv>
                                )}
                              </MotionDiv>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </MotionDiv>

                    <MotionDiv
                      variants={staggerItem}
                      className="flex justify-end gap-4"
                    >
                      <MotionDiv
                        variants={buttonVariants}
                        whileHover={{ 
                          scale: 1.05,
                          rotate: -2,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.back()}
                          className="group relative overflow-hidden"
                        >
                          <MotionDiv
                            whileHover={{ x: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            className="mr-2"
                          >
                            <X className="h-4 w-4" />
                          </MotionDiv>
                          Cancel
                        </Button>
                      </MotionDiv>

                      <MotionDiv
                        variants={buttonVariants}
                        whileHover={{ 
                          scale: 1.05,
                          rotate: 2,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
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
                          <span className="relative z-10">
                            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Company' : 'Create Company'}
                          </span>
                          <MotionDiv
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ 
                              duration: 0.8,
                              ease: "easeInOut",
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                          />
                        </Button>
                      </MotionDiv>
                    </MotionDiv>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </AnimatedSection>
        </MotionDiv>
      </div>
    </PageTransition>
  );
}
