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

export default function PlacementsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlacementStatus | 'ALL'>(
    'ALL'
  );
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');

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
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Placements</h1>
          <p className="text-muted-foreground">
            Manage and track student placements
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/companies')}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Manage Companies
          </Button>
          <Button onClick={() => router.push('/admin/placements/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Record Placement
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Placements"
          value={data?.stats.total || 0}
          icon={Briefcase}
          description="All time placements"
        />
        <StatsCard
          title="Active Companies"
          value={Object.keys(data?.stats.byCompany || {}).length || 0}
          icon={Building2}
          description="Companies with placements"
        />
        <StatsCard
          title="Average Package"
          value={`₹${(data?.stats.averagePackage || 0).toFixed(2)} LPA`}
          icon={TrendingUp}
          description="Average annual package"
        />
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
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Placement Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, company, or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
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
            <Select value={companyFilter} onValueChange={handleCompanyChange}>
              <SelectTrigger className="w-[180px]">
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
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load placements
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Joining Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recorded By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.placements.map((placement) => (
                    <TableRow key={placement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {placement.student.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {placement.student.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {placement.company.logo && (
                            <img
                              src={placement.company.logo}
                              alt={placement.company.name}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                          )}
                          <span>{placement.company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{placement.position}</TableCell>
                      <TableCell>₹{placement.package.toFixed(2)} LPA</TableCell>
                      <TableCell>
                        {format(new Date(placement.joiningDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusColors[placement.status]}
                        >
                          {placement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{placement.createdBy.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/placements/${placement.id}`)
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data?.placements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center">
                        No placements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
