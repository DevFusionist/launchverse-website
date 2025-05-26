'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Plus,
  Search,
  Trash2,
  Building2,
  Users,
  TrendingUp,
  Edit,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
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
};

// Default stats values
const defaultStats = {
  total: 0,
  totalPlacements: 0,
  averagePackage: 0,
  activeStudents: 0,
};

const MotionTableRow = motion(TableRow);

export default function CompaniesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch companies with search
  const { data, error, isLoading, mutate } = useSWR<{
    companies: Company[];
    stats: typeof defaultStats;
  }>(`/api/admin/companies?search=${debouncedSearch}`, fetcher);

  // Use default stats while loading or if data is undefined
  const stats = data?.stats || defaultStats;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to delete company' };
      }

      toast({
        title: 'Company Deleted',
        description: 'Company has been deleted successfully.',
      });
      mutate(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete company',
      });
    }
  };

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { message: data.error || 'Failed to update company status' };
      }

      toast({
        title: 'Status Updated',
        description: `Company has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
      mutate(); // Refresh the list
    } catch (error: any) {
      console.error('Error updating company status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update company status',
      });
    }
  };

  return (
    <PageTransition>
    <div className="container py-8">
        <AnimatedSection variants={fadeIn} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            Manage and track company information
          </p>
        </div>
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
            className="relative z-10"
          >
            <Button 
              onClick={() => router.push('/admin/companies/new')}
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
            >
              <MotionDiv 
                variants={iconVariants}
                whileHover={{ 
                  rotate: 90,
                  scale: 1.2
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 10 
                }}
                className="mr-2 relative z-10"
              >
                <Plus className="h-4 w-4" />
              </MotionDiv>
              <span className="relative z-10">Add Company</span>
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
        </AnimatedSection>

      {/* Stats Overview */}
        <MotionDiv
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <MotionDiv variants={staggerItem}>
        <StatsCard
          title="Total Companies"
          value={stats.total}
          icon={Building2}
          description="Registered companies"
          isLoading={isLoading}
        />
          </MotionDiv>
          <MotionDiv variants={staggerItem}>
        <StatsCard
          title="Total Placements"
          value={stats.totalPlacements}
          icon={Users}
          description="All time placements"
          isLoading={isLoading}
        />
          </MotionDiv>
          <MotionDiv variants={staggerItem}>
        <StatsCard
          title="Average Package"
          value={`₹${stats.averagePackage.toFixed(2)} LPA`}
          icon={TrendingUp}
          description="Average annual package"
          isLoading={isLoading}
        />
          </MotionDiv>
          <MotionDiv variants={staggerItem}>
        <StatsCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          description="Currently placed students"
          isLoading={isLoading}
        />
          </MotionDiv>
        </MotionDiv>

        <AnimatedSection variants={fadeIn}>
          <Card className="relative z-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company List</CardTitle>
                <MotionDiv
                  variants={fadeIn}
                  className="relative w-72 z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <MotionDiv
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <MotionDiv
                      initial={{ opacity: 0.5 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute left-2 top-2.5"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </MotionDiv>
                    <Input
                      placeholder="Search companies..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                    />
                  </MotionDiv>
                </MotionDiv>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PageTransition>
              <div className="container py-8">
                <AnimatedSection variants={fadeIn} className="mb-8 flex items-center justify-between">
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
                    className="h-10 w-32 bg-muted rounded-md"
                  />
                </AnimatedSection>

                {/* Stats Overview Skeleton */}
                <MotionDiv
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                >
                  {[1, 2, 3, 4].map((_, index) => (
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

                {/* Table Skeleton */}
                <AnimatedSection variants={fadeIn}>
                  <Card className="relative z-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <MotionDiv
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="h-6 w-32 bg-muted rounded-md"
                        />
                        <MotionDiv
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="h-10 w-72 bg-muted rounded-md"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border w-full overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[300px]">
                                <MotionDiv className="h-4 w-24 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead>
                                <MotionDiv className="h-4 w-20 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead>
                                <MotionDiv className="h-4 w-24 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead className="w-[100px]">
                                <MotionDiv className="h-4 w-16 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead className="w-[120px]">
                                <MotionDiv className="h-4 w-20 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead className="w-[120px]">
                                <MotionDiv className="h-4 w-24 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead className="w-[120px]">
                                <MotionDiv className="h-4 w-20 bg-muted rounded-md" />
                              </TableHead>
                              <TableHead className="w-[100px] text-right">
                                <MotionDiv className="h-4 w-16 bg-muted rounded-md ml-auto" />
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[1, 2, 3, 4, 5].map((_, index) => (
                              <MotionTableRow
                                key={index}
                                variants={cardVariants}
                                initial="initial"
                                animate="show"
                                transition={{ delay: index * 0.1 }}
                                className="relative z-0"
                              >
                                <TableCell className="w-[300px]">
                                  <div className="flex items-center gap-2">
                                    <MotionDiv className="h-8 w-8 bg-muted rounded-full" />
                                    <div className="space-y-2">
                                      <MotionDiv className="h-4 w-32 bg-muted rounded-md" />
                                      <MotionDiv className="h-3 w-48 bg-muted rounded-md" />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <MotionDiv className="h-4 w-24 bg-muted rounded-md" />
                                </TableCell>
                                <TableCell>
                                  <MotionDiv className="h-4 w-28 bg-muted rounded-md" />
                                </TableCell>
                                <TableCell className="w-[100px]">
                                  <MotionDiv className="h-4 w-12 bg-muted rounded-md" />
                                </TableCell>
                                <TableCell className="w-[120px]">
                                  <MotionDiv className="h-4 w-20 bg-muted rounded-md" />
                                </TableCell>
                                <TableCell className="w-[120px]">
                                  <MotionDiv className="h-4 w-12 bg-muted rounded-md" />
                                </TableCell>
                                <TableCell className="w-[120px]">
                                  <MotionDiv className="h-4 w-24 bg-muted rounded-md" />
                                </TableCell>
                                <TableCell className="w-[100px] text-right">
                                  <div className="flex justify-end gap-2">
                                    <MotionDiv className="h-8 w-8 bg-muted rounded-md" />
                                    <MotionDiv className="h-8 w-8 bg-muted rounded-md" />
                                  </div>
                                </TableCell>
                              </MotionTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              </div>
            </PageTransition>
          ) : error ? (
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-500"
                >
              Failed to load companies
                </MotionDiv>
          ) : (
            <div className="rounded-md border w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[100px]">Placements</TableHead>
                    <TableHead className="w-[120px]">Avg. Package</TableHead>
                    <TableHead className="w-[120px]">Active Students</TableHead>
                    <TableHead className="w-[120px]">Added On</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.companies.map((company, index) => (
                    <MotionTableRow
                      key={company.id}
                      variants={cardVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      layout
                      transition={{
                        layout: { duration: 0.2 },
                        delay: index * 0.05,
                      }}
                      className="relative z-0"
                    >
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {company.logo && (
                            <MotionDiv
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full"
                            >
                              <Image
                                src={company.logo}
                                alt={company.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </MotionDiv>
                          )}
                          <div className="min-w-0 flex-1">
                            <MotionDiv
                              whileHover={{ x: 2 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <div className="font-medium truncate" title={company.name}>{company.name}</div>
                            </MotionDiv>
                            {company.website && (
                              <MotionDiv
                                whileHover={{ x: 2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="inline-block"
                              >
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                                >
                                  {company.website}
                                </a>
                              </MotionDiv>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{company.industry || '-'}</TableCell>
                      <TableCell>{company.location || '-'}</TableCell>
                      <TableCell>{company.totalPlacements}</TableCell>
                      <TableCell>
                        ₹{company.averagePackage.toFixed(2)} LPA
                      </TableCell>
                      <TableCell>{company.activeStudents}</TableCell>
                      <TableCell>
                        {format(new Date(company.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <MotionDiv
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="relative z-10"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => router.push(`/admin/companies/${company.id}`)}
                                  className="hover:bg-primary/10"
                                >
                                  <MotionDiv
                                    variants={iconVariants}
                                    whileHover={{ rotate: 15 }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </MotionDiv>
                                </Button>
                              </MotionDiv>
                              <MotionDiv
                                variants={buttonVariants}
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="relative z-10"
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(company.id)}
                                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                >
                                  <MotionDiv
                                    variants={iconVariants}
                                    whileHover={{ rotate: -15 }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </MotionDiv>
                                </Button>
                              </MotionDiv>
                            </div>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </AnimatedSection>
    </div>
    </PageTransition>
  );
}
