import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import useSWR from 'swr';

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
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            Failed to load activities
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {data.activities.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No recent activities
              </div>
            ) : (
              data.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {activity.admin.name}{' '}
                        <span className="font-normal text-muted-foreground">
                          {activity.action}ed a {activity.entity}
                        </span>
                      </p>
                      <Badge
                        variant="secondary"
                        className={getActionColor(activity.action)}
                      >
                        {activity.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    {activity.details && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {JSON.parse(activity.details).message}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
