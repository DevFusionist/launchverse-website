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
import { Loader2, Building2, Users, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
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
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">
            Company details and placement history
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/companies/new?id=${params.id}`)}
          >
            Edit Company
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Company'
            )}
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Placements
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.totalPlacements}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Package
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{company.averagePackage.toFixed(2)} LPA
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.activeStudents}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.logo && (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            )}
            <div className="space-y-2">
              <div>
                <span className="font-medium">Website:</span>{' '}
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
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
              <div>
                <span className="font-medium">Created:</span>{' '}
                {format(new Date(company.createdAt), 'PPP')}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{' '}
                {format(new Date(company.updatedAt), 'PPP')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Placement History</CardTitle>
            <CardDescription>
              Recent placements at {company.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joining Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {company.placements.map((placement) => (
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
                      <TableCell>{placement.position}</TableCell>
                      <TableCell>₹{placement.package} LPA</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            placement.status === 'ACCEPTED'
                              ? 'bg-green-500/10 text-green-500'
                              : placement.status === 'REJECTED'
                                ? 'bg-red-500/10 text-red-500'
                                : placement.status === 'COMPLETED'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-yellow-500/10 text-yellow-500'
                          }
                        >
                          {placement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(placement.joiningDate), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                  {company.placements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        No placements found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
