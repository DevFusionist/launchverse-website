'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Award, Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/admin/stats-card';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { Chart } from '@/components/admin/chart';
import { SearchBar } from '@/components/admin/search';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: stats, error: statsError } = useSWR(
    '/api/admin/stats',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const chartData = {
    labels:
      stats?.trends?.enrollments.map((e: any) =>
        new Date(e.createdAt).toLocaleDateString()
      ) || [],
    datasets: [
      {
        label: 'Enrollments',
        data: stats?.trends?.enrollments.map((e: any) => e._count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: 'Certificates',
        data: stats?.trends?.certificates.map((c: any) => c._count) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header with Search and Quick Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <SearchBar />
          <Button onClick={() => router.push('/admin/students/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Student
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats?.overview?.totalStudents || 0}
          icon={Users}
          description="Active students enrolled"
          trend={
            stats?.recent?.enrollments > 0
              ? {
                  value: Math.round(
                    (stats.recent.enrollments / stats.overview.totalStudents) *
                      100
                  ),
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatsCard
          title="Active Courses"
          value={stats?.overview?.activeCourses || 0}
          icon={BookOpen}
          description="Courses currently running"
        />
        <StatsCard
          title="Certificates Issued"
          value={stats?.overview?.totalCertificates || 0}
          icon={Award}
          description="Total certificates generated"
          trend={
            stats?.recent?.certificates > 0
              ? {
                  value: Math.round(
                    (stats.recent.certificates /
                      stats.overview.totalCertificates) *
                      100
                  ),
                  isPositive: true,
                }
              : undefined
          }
        />
        <StatsCard
          title="Placements"
          value={stats?.overview?.totalPlacements || 0}
          icon={Briefcase}
          description="Successful placements"
          trend={
            stats?.recent?.placements > 0
              ? {
                  value: Math.round(
                    (stats.recent.placements / stats.overview.totalPlacements) *
                      100
                  ),
                  isPositive: true,
                }
              : undefined
          }
        />
      </div>

      {/* Charts and Activity Feed */}
      <div className="grid gap-8 md:grid-cols-2">
        <Chart
          title="Enrollment & Certificate Trends"
          type="line"
          lineData={chartData}
          height={400}
        />
        <ActivityFeed limit={5} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
            <Button variant="outline" className="justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Create Course
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="mr-2 h-4 w-4" />
              Issue Certificate
            </Button>
            <Button variant="outline" className="justify-start">
              <Briefcase className="mr-2 h-4 w-4" />
              Record Placement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
