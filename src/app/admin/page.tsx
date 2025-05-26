'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Award, Briefcase, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/admin/stats-card';
import { ActivityFeed } from '@/components/admin/activity-feed';
import { Chart } from '@/components/admin/chart';
import { SearchBar } from '@/components/admin/search';
import useSWR from 'swr';
import {
  AnimatedSection,
  ParallaxSection,
  fadeIn,
  slideIn,
  scaleIn,
  staggerContainer,
  staggerItem,
  MotionDiv,
} from '@/components/ui/motion';
import {
  AnimatedButton,
  AnimatedIcon,
  AnimatedBadge,
} from '@/components/ui/enhanced-motion';

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
        <AnimatedSection variants={fadeIn}>
          <AnimatedIcon className="animate-spin">
            <Loader2 className="h-12 w-12 text-primary" />
          </AnimatedIcon>
        </AnimatedSection>
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
    <ParallaxSection speed={0.1} className="space-y-8 p-8">
      <AnimatedSection
        variants={staggerContainer}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <AnimatedSection variants={slideIn} className="w-full">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </AnimatedSection>
        <AnimatedSection
          variants={slideIn}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-4"
        >
          <AnimatedSection variants={fadeIn} className="w-full sm:w-auto">
            <SearchBar />
          </AnimatedSection>
          <AnimatedButton
            onClick={() => router.push('/admin/students/new')}
            className="w-full sm:w-auto"
          >
            <AnimatedIcon>
              <Plus className="mr-2 h-4 w-4" />
            </AnimatedIcon>
            New Student
          </AnimatedButton>
        </AnimatedSection>
      </AnimatedSection>

      <AnimatedSection
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {!stats
          ? // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <MotionDiv
                key={`loading-${index}`}
                variants={staggerItem}
                className="w-full"
              >
                <StatsCard
                  title="Loading..."
                  value=""
                  icon={Users}
                  isLoading={true}
                />
              </MotionDiv>
            ))
          : [
              {
                title: 'Total Students',
                value: stats.overview?.totalStudents ?? 0,
                icon: Users,
                description: 'Active students enrolled',
                trend:
                  stats.recent?.enrollments > 0
                    ? {
                        value: Math.round(
                          (stats.recent.enrollments /
                            (stats.overview?.totalStudents || 1)) *
                            100
                        ),
                        isPositive: true,
                      }
                    : undefined,
              },
              {
                title: 'Active Courses',
                value: stats?.overview?.activeCourses ?? 0,
                icon: BookOpen,
                description: 'Courses currently running',
              },
              {
                title: 'Certificates Issued',
                value: stats?.overview?.totalCertificates ?? 0,
                icon: Award,
                description: 'Total certificates generated',
                trend:
                  stats?.recent?.certificates > 0
                    ? {
                        value: Math.round(
                          (stats.recent.certificates /
                            (stats.overview?.totalCertificates || 1)) *
                            100
                        ),
                        isPositive: true,
                      }
                    : undefined,
              },
              {
                title: 'Placements',
                value: stats?.overview?.totalPlacements ?? 0,
                icon: Briefcase,
                description: 'Successful placements',
                trend:
                  stats?.recent?.placements > 0
                    ? {
                        value: Math.round(
                          (stats.recent.placements /
                            (stats.overview?.totalPlacements || 1)) *
                            100
                        ),
                        isPositive: true,
                      }
                    : undefined,
              },
            ].map((stat, index) => (
              <MotionDiv
                key={stat.title}
                variants={staggerItem}
                className="w-full"
              >
                <StatsCard {...stat} />
              </MotionDiv>
            ))}
      </AnimatedSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <AnimatedSection
          variants={scaleIn}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <AnimatedSection variants={slideIn}>
                  <CardTitle>Enrollment & Certificate Trends</CardTitle>
                </AnimatedSection>
                {stats?.trends && (
                  <AnimatedBadge
                    variant="outline"
                    className="ml-2"
                    variants={fadeIn}
                    transition={{ delay: 0.3 }}
                  >
                    Last 30 Days
                  </AnimatedBadge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <AnimatedSection variants={fadeIn} transition={{ delay: 0.2 }}>
                <Chart
                  title="Enrollment & Certificate Trends"
                  type="line"
                  lineData={chartData}
                  height={400}
                />
              </AnimatedSection>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection
          variants={scaleIn}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <AnimatedSection variants={slideIn}>
                  <CardTitle>Recent Activity</CardTitle>
                </AnimatedSection>
                <AnimatedBadge
                  variant="outline"
                  className="ml-2"
                  variants={fadeIn}
                  transition={{ delay: 0.3 }}
                >
                  Live Updates
                </AnimatedBadge>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatedSection variants={fadeIn} transition={{ delay: 0.2 }}>
                <ActivityFeed />
              </AnimatedSection>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </ParallaxSection>
  );
}
