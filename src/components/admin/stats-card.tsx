import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            value
          )}
        </div>
        {(description || trend) && (
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            {description && <p>{description}</p>}
            {trend && !isLoading && (
              <p
                className={`flex items-center ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
