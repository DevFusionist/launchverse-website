import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import {
  AnimatedCard,
  fadeIn,
  hoverScale,
  cardVariants,
} from '@/components/ui/motion';
import { cn } from '@/lib/utils';

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
    <AnimatedCard
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        'group relative cursor-pointer transition-all duration-200',
        'rounded-lg border bg-card p-6 shadow-sm',
        'hover:border-primary/20 hover:shadow-md',
        'active:scale-[0.98]'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium transition-colors group-hover:text-primary">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold transition-colors group-hover:text-primary">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            value
          )}
        </div>
        {(description || trend) && (
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            {description && (
              <p className="transition-colors group-hover:text-primary/80">
                {description}
              </p>
            )}
            {trend && !isLoading && (
              <p
                className={cn(
                  'flex items-center transition-all duration-200',
                  'group-hover:translate-x-1',
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                )}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {trend.isPositive ? '↑' : '↓'}
                </span>
                <span className="ml-1">{Math.abs(trend.value)}%</span>
              </p>
            )}
          </div>
        )}
        <div className="absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset ring-primary/10 transition-opacity duration-200 group-hover:opacity-100" />
      </CardContent>
    </AnimatedCard>
  );
}
