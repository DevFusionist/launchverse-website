'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Plus,
  Search,
  Briefcase,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { AnimatedSection, fadeIn, slideIn, staggerContainer, staggerItem, cardVariants, buttonVariants, iconVariants, MotionDiv, PageTransition } from '@/components/ui/motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type PlacementStatus =
  | 'PENDING'
  | 'OFFERED'
  | 'JOINED'
  | 'DECLINED'
  | 'WITHDRAWN';

const statusColors: Record<PlacementStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  OFFERED: 'bg-blue-100 text-blue-800',
  JOINED: 'bg-green-100 text-green-800',
  DECLINED: 'bg-red-100 text-red-800',
  WITHDRAWN: 'bg-gray-100 text-gray-800',
};

type PlacementWithRelations = {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  company: {
    id: string;
    name: string;
    logo?: string;
  };
  position: string;
  package: number;
  joiningDate: string;
  status: PlacementStatus;
  notes?: string;
  createdBy: {
    name: string;
  };
  createdAt: string;
};

// Add these variants at the top level of the file
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

export default function PlacementsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlacementStatus | 'ALL'>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch placements with filters
  const { data, error, isLoading } = useSWR<{
    placements: PlacementWithRelations[];
    companies: { id: string; name: string }[];
    stats: {
      total: number;
      byStatus: Record<PlacementStatus, number>;
      averagePackage: number;
      byCompany: Record<string, number>;
    };
  }>(
    `/api/admin/placements?search=${search}&status=${statusFilter}&company=${companyFilter}`,
    fetcher
  );

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as PlacementStatus | 'ALL');
  };

  const handleCompanyChange = (value: string) => {
    setCompanyFilter(value);
  };

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
              Placements
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground"
            >
              Manage and track student placements
            </motion.p>
          </div>
          <div className="flex gap-4">
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
                variant="outline"
                onClick={() => router.push('/admin/companies')}
                className="group relative overflow-hidden"
              >
                <MotionDiv
                  whileHover={{ rotate: -12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mr-2"
                >
                  <Building2 className="h-4 w-4" />
                </MotionDiv>
                Manage Companies
              </Button>
            </MotionDiv>

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
                onClick={() => router.push('/admin/placements/new')}
                className="group relative overflow-hidden"
              >
                <MotionDiv
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mr-2"
                >
                  <Plus className="h-4 w-4" />
                </MotionDiv>
                Record Placement
              </Button>
            </MotionDiv>
          </div>
        </AnimatedSection>

        {/* Stats Overview */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Placements"
              value={data?.stats.total || 0}
              icon={Briefcase}
              description="All time placements"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Active Companies"
              value={Object.keys(data?.stats.byCompany || {}).length || 0}
              icon={Building2}
              description="Companies with placements"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Average Package"
              value={`₹${(data?.stats.averagePackage || 0).toFixed(2)} LPA`}
              icon={TrendingUp}
              description="Average annual package"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Offered"
              value={data?.stats.byStatus.OFFERED || 0}
              icon={Briefcase}
              description="Current offers"
              trend={
                (data?.stats?.byStatus?.OFFERED ?? 0) > 0
                  ? {
                      value: Math.round(
                        ((data?.stats?.byStatus?.OFFERED || 0) /
                          (data?.stats?.total || 1)) *
                          100
                      ),
                      isPositive: true,
                    }
                  : undefined
              }
            />
          </motion.div>
        </motion.div>

        <AnimatedSection
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="group relative"
        >
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="transition-colors duration-200 group-hover:text-primary">
                Placement Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <MotionDiv
                  variants={fadeIn}
                  className="relative flex-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <MotionDiv
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <MotionDiv
                      initial={{ opacity: 0.5 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </MotionDiv>
                    <Input
                      placeholder="Search by student name, company, or position..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={cn(
                        "pl-8 transition-all duration-200",
                        "focus:ring-2 focus:ring-primary/20",
                        "hover:border-primary/50"
                      )}
                    />
                  </MotionDiv>
                </MotionDiv>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <MotionDiv
                    variants={fadeIn}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                      <SelectTrigger className={cn(
                        "w-[180px] transition-all duration-200",
                        "hover:border-primary/50",
                        "focus:ring-2 focus:ring-primary/20"
                      )}>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="OFFERED">Offered</SelectItem>
                        <SelectItem value="JOINED">Joined</SelectItem>
                        <SelectItem value="DECLINED">Declined</SelectItem>
                        <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </MotionDiv>

                  <MotionDiv
                    variants={fadeIn}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Select value={companyFilter} onValueChange={handleCompanyChange}>
                      <SelectTrigger className={cn(
                        "w-[180px] transition-all duration-200",
                        "hover:border-primary/50",
                        "focus:ring-2 focus:ring-primary/20"
                      )}>
                        <SelectValue placeholder="Filter by company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Companies</SelectItem>
                        {data?.companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </MotionDiv>
                </div>
              </div>

              {isLoading ? (
                <AnimatedSection
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="flex justify-center py-8"
                >
                  <MotionDiv
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-muted-foreground" />
                  </MotionDiv>
                </AnimatedSection>
              ) : error ? (
                <AnimatedSection
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="text-center text-red-500"
                >
                  Failed to load placements
                </AnimatedSection>
              ) : (
                <div className="rounded-md border">
                  <div className="w-full overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Student</TableHead>
                          <TableHead className="w-[180px]">Company</TableHead>
                          <TableHead className="w-[150px]">Position</TableHead>
                          <TableHead className="w-[120px]">Package</TableHead>
                          <TableHead className="w-[120px]">Joining Date</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="w-[150px]">Recorded By</TableHead>
                          <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence mode="popLayout">
                          {data?.placements.map((placement, index) => (
                            <motion.tr
                              key={placement.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{
                                layout: { duration: 0.2 },
                                delay: index * 0.05,
                              }}
                              className="group/item hover:bg-muted/50"
                            >
                              <TableCell className="max-w-[200px]">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="truncate"
                                >
                                  <div className="font-medium truncate">
                                    {placement.student.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground truncate">
                                    {placement.student.email}
                                  </div>
                                </MotionDiv>
                              </TableCell>
                              <TableCell className="max-w-[180px]">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="flex items-center gap-2 truncate"
                                >
                                  {placement.company.logo && (
                                    <img
                                      src={placement.company.logo}
                                      alt={placement.company.name}
                                      className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                                    />
                                  )}
                                  <span className="truncate">{placement.company.name}</span>
                                </MotionDiv>
                              </TableCell>
                              <TableCell className="max-w-[150px]">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="truncate"
                                >
                                  {placement.position}
                                </MotionDiv>
                              </TableCell>
                              <TableCell className="max-w-[120px]">
                                <MotionDiv
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="truncate"
                                >
                                  ₹{placement.package.toFixed(2)} LPA
                                </MotionDiv>
                              </TableCell>
                              <TableCell className="max-w-[120px]">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="text-muted-foreground truncate"
                                >
                                  {format(new Date(placement.joiningDate), 'MMM d, yyyy')}
                                </MotionDiv>
                              </TableCell>
                              <TableCell className="max-w-[100px]">
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    statusColors[placement.status],
                                    'transition-all duration-200',
                                    'group-hover/item:scale-105'
                                  )}
                                >
                                  {placement.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[150px]">
                                <MotionDiv
                                  whileHover={{ x: 2 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  className="truncate"
                                >
                                  {placement.createdBy.name}
                                </MotionDiv>
                              </TableCell>
                              <TableCell className="max-w-[100px] text-right">
                                <MotionDiv
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/admin/placements/${placement.id}`)
                                    }
                                    className={cn(
                                      'transition-all duration-200',
                                      'hover:bg-primary/10 hover:text-primary',
                                      'active:scale-95'
                                    )}
                                  >
                                    View Details
                                  </Button>
                                </MotionDiv>
                              </TableCell>
                            </motion.tr>
                          ))}
                          {data?.placements.length === 0 && (
                            <motion.tr
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <TableCell colSpan={8} className="py-8 text-center">
                                No placements found
                              </TableCell>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </PageTransition>
  );
}
