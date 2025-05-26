'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWR from 'swr';
import { format } from 'date-fns';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building2, Users, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Company = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  industry?: string;
  location?: string;
  totalPlacements: number;
  averagePackage: number;
  activeStudents: number;
  createdAt: string;
  updatedAt: string;
  placements: Array<{
    id: string;
    student: {
      id: string;
      name: string;
      email: string;
    };
    position: string;
    package: number;
    joiningDate: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  }>;
};

export default function CompanyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, isLoading } = useSWR<{ company: Company }>(
    `/api/admin/companies/${params.id}`,
    fetcher
  );

  if (status === 'loading' || isLoading) {
    return (
      <PageTransition>
        <div className="container py-8">
          <MotionDiv
            variants={fadeIn}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <MotionDiv
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-8 w-64 bg-muted rounded-md mb-2"
            />
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-4 w-48 bg-muted rounded-md"
            />
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8 grid gap-4 md:grid-cols-3"
          >
            {[1, 2, 3].map((_, index) => (
              <MotionDiv
                key={index}
                variants={staggerItem}
                className="relative overflow-hidden rounded-lg border bg-card p-6"
              >
                <MotionDiv
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.2
                  }}
                />
                <div className="flex items-center justify-between mb-4">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-4 w-24 bg-muted rounded-md"
                  />
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="h-4 w-4 bg-muted rounded-full"
                  />
                </div>
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="h-8 w-16 bg-muted rounded-md"
                />
              </MotionDiv>
            ))}
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid gap-8 md:grid-cols-2"
          >
            {[1, 2].map((_, index) => (
              <MotionDiv
                key={index}
                variants={staggerItem}
                className="relative overflow-hidden rounded-lg border bg-card"
              >
                <MotionDiv
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.2
                  }}
                />
                <div className="p-6">
                  <MotionDiv
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="h-6 w-32 bg-muted rounded-md mb-6"
                  />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, i) => (
                      <MotionDiv
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) + (i * 0.1) }}
                        className="h-4 w-full bg-muted rounded-md"
                      />
                    ))}
                  </div>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </PageTransition>
    );
  }

  if (status === 'unauthenticated') {
    router.replace('/admin/login');
    return null;
  }

  if (error || !data) {
    return (
      <div className="container py-8">
        <div className="text-center text-red-500">
          Failed to load company details
        </div>
      </div>
    );
  }

  const { company } = data;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/companies/${params.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw { message: result.error || 'Failed to delete company' };
      }

      toast({
        title: 'Company Deleted',
        description: 'Company has been deleted successfully.',
      });

      router.push('/admin/companies');
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete company',
      });
    } finally {
      setIsDeleting(false);
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
                {company.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground"
              >
                Company details and placement history
              </motion.p>
            </div>
            <div className="flex gap-2">
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
                  variant="outline"
                  onClick={() => router.push(`/admin/companies/new?id=${params.id}`)}
                  className="group relative overflow-hidden"
                >
                  <MotionDiv
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="mr-2"
                  >
                    <Edit className="h-4 w-4" />
                  </MotionDiv>
                  Edit Company
                </Button>
              </MotionDiv>

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
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="group relative overflow-hidden"
                >
                  {isDeleting ? (
                    <MotionDiv
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Loader2 className="h-4 w-4" />
                    </MotionDiv>
                  ) : (
                    <MotionDiv
                      whileHover={{ rotate: -15 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="mr-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </MotionDiv>
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete Company'}
                </Button>
              </MotionDiv>
            </div>
          </div>
        </AnimatedSection>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-8 grid gap-4 md:grid-cols-3"
        >
          <MotionDiv variants={staggerItem}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  Total Placements
                </CardTitle>
                <MotionDiv
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl font-bold"
                >
                  {company.totalPlacements}
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv variants={staggerItem}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  Average Package
                </CardTitle>
                <MotionDiv
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-bold"
                >
                  ₹{company.averagePackage.toFixed(2)} LPA
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv variants={staggerItem}>
            <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <MotionDiv
                className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  Active Students
                </CardTitle>
                <MotionDiv
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </MotionDiv>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold"
                >
                  {company.activeStudents}
                </MotionDiv>
              </CardContent>
            </Card>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2"
        >
          <AnimatedSection variants={cardVariants}>
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.logo && (
                  <MotionDiv
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="relative h-32 w-32 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      sizes="128px"
                    />
                  </MotionDiv>
                )}
                <MotionDiv variants={staggerItem} className="space-y-2">
                  <div>
                    <span className="font-medium">Website:</span>{' '}
                    {company.website ? (
                      <MotionDiv
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="inline-block"
                      >
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline transition-colors"
                        >
                          {company.website}
                        </a>
                      </MotionDiv>
                    ) : (
                      <span className="text-muted-foreground">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Industry:</span>{' '}
                    {company.industry || (
                      <span className="text-muted-foreground">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{' '}
                    {company.location || (
                      <span className="text-muted-foreground">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{' '}
                    {company.description || (
                      <span className="text-muted-foreground">Not provided</span>
                    )}
                  </div>
                </MotionDiv>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection variants={cardVariants}>
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">Placement History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-auto max-h-[400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableHead className="w-[250px] min-w-[250px]">Student</TableHead>
                        <TableHead className="w-[180px] min-w-[180px]">Position</TableHead>
                        <TableHead className="w-[120px] min-w-[120px] text-right">Package</TableHead>
                        <TableHead className="w-[140px] min-w-[140px] text-center">Joining Date</TableHead>
                        <TableHead className="w-[120px] min-w-[120px] text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {company.placements.map((placement, index) => (
                        <MotionDiv
                          key={placement.id}
                          variants={staggerItem}
                          initial="hidden"
                          animate="show"
                          transition={{ delay: index * 0.1 }}
                        >
                          <TableRow className="group hover:bg-muted/50 transition-colors">
                            <TableCell className="w-[250px] min-w-[250px]">
                              <div className="flex flex-col gap-1">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="font-medium truncate"
                                  title={placement.student.name}
                                >
                                  {placement.student.name}
                                </MotionDiv>
                                <div className="text-sm text-muted-foreground truncate" title={placement.student.email}>
                                  {placement.student.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="w-[180px] min-w-[180px]">
                              <div className="truncate" title={placement.position}>
                                {placement.position}
                              </div>
                            </TableCell>
                            <TableCell className="w-[120px] min-w-[120px] text-right tabular-nums">
                              ₹{placement.package} LPA
                            </TableCell>
                            <TableCell className="w-[140px] min-w-[140px] text-center">
                              {format(new Date(placement.joiningDate), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="w-[120px] min-w-[120px] text-center">
                              <MotionDiv
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="inline-flex justify-center"
                              >
                                <Badge
                                  variant={
                                    placement.status === 'ACCEPTED'
                                      ? 'default'
                                      : placement.status === 'PENDING'
                                      ? 'secondary'
                                      : placement.status === 'REJECTED'
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                  className="whitespace-nowrap"
                                >
                                  {placement.status}
                                </Badge>
                              </MotionDiv>
                            </TableCell>
                          </TableRow>
                        </MotionDiv>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </MotionDiv>
      </div>
    </PageTransition>
  );
}
