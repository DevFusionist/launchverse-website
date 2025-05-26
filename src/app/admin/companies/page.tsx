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
} from 'lucide-react';
import { StatsCard } from '@/components/admin/stats-card';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import Image from 'next/image';

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
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            Manage and track company information
          </p>
        </div>
        <Button onClick={() => router.push('/admin/companies/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Companies"
          value={stats.total}
          icon={Building2}
          description="Registered companies"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Placements"
          value={stats.totalPlacements}
          icon={Users}
          description="All time placements"
          isLoading={isLoading}
        />
        <StatsCard
          title="Average Package"
          value={`₹${stats.averagePackage.toFixed(2)} LPA`}
          icon={TrendingUp}
          description="Average annual package"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Students"
          value={stats.activeStudents}
          icon={Users}
          description="Currently placed students"
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Company List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Failed to load companies
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Placements</TableHead>
                    <TableHead>Avg. Package</TableHead>
                    <TableHead>Active Students</TableHead>
                    <TableHead>Added On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {company.logo && (
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                              <Image
                                src={company.logo}
                                alt={company.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{company.name}</div>
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:underline"
                              >
                                {company.website}
                              </a>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/companies/${company.id}`)
                          }
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/companies/new?id=${company.id}`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(company.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data?.companies.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center">
                        No companies found
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
