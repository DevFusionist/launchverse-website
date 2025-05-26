import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import useSWR from 'swr';
import {
  MotionDiv,
  staggerContainer,
  staggerItem,
  cardVariants,
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  admin: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ActivityFeedProps {
  limit?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  const { data, error, isLoading } = useSWR<{
    activities: Activity[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  }>(`/api/admin/activities?limit=${limit}`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-500/10 text-green-500';
      case 'update':
        return 'bg-blue-500/10 text-blue-500';
      case 'delete':
        return 'bg-red-500/10 text-red-500';
      case 'issue':
        return 'bg-purple-500/10 text-purple-500';
      case 'revoke':
        return 'bg-orange-500/10 text-orange-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="group relative transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="transition-colors group-hover:text-primary">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary transition-colors group-hover:border-primary/80"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.activities) {
    return (
      <Card className="group relative transition-all duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="transition-colors group-hover:text-primary">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center text-muted-foreground transition-colors group-hover:text-primary/80">
            Failed to load activities
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="transition-colors group-hover:text-primary">
            Recent Activity
          </CardTitle>
          <Badge
            variant="outline"
            className="transition-all duration-200 group-hover:border-primary/20 group-hover:text-primary"
          >
            Live Updates
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {data.activities.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground transition-colors group-hover:text-primary/80">
                No recent activities
              </div>
            ) : (
              data.activities.map((activity, index) => (
                <MotionDiv
                  key={activity.id}
                  variants={staggerItem}
                  className={cn(
                    'group/item relative cursor-pointer transition-all duration-200',
                    'flex items-start space-x-4 rounded-lg border bg-card p-4',
                    'hover:border-primary/20 hover:shadow-md',
                    'active:scale-[0.98]'
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium transition-colors group-hover/item:text-primary">
                        {activity.admin.name}{' '}
                        <span className="font-normal text-muted-foreground transition-colors group-hover/item:text-primary/80">
                          {activity.action}ed a {activity.entity}
                        </span>
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'transition-all duration-200',
                          'group-hover/item:scale-105',
                          getActionColor(activity.action)
                        )}
                      >
                        {activity.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground transition-colors group-hover/item:text-primary/60">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    {activity.details && (
                      <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover/item:text-primary/80">
                        {JSON.parse(activity.details).message}
                      </p>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset ring-primary/10 transition-opacity duration-200 group-hover/item:opacity-100" />
                </MotionDiv>
              ))
            )}
          </MotionDiv>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
