import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { AnimatedSection, fadeIn, cardVariants } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  title: string;
  type: 'line' | 'bar';
  lineData?: ChartData<'line'>;
  barData?: ChartData<'bar'>;
  options?: ChartOptions<'line' | 'bar'>;
  height?: number;
}

export function Chart({
  title,
  type,
  lineData,
  barData,
  options,
  height = 300,
}: ChartProps) {
  const defaultOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'inherit',
          },
          color: 'hsl(var(--muted-foreground))',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--background))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--muted-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            family: 'inherit',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          font: {
            family: 'inherit',
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    transitions: {
      active: {
        animation: {
          duration: 200,
        },
      },
    },
  };

  return (
    <AnimatedSection
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className={cn(
        'group relative transition-all duration-200',
        'rounded-lg border bg-card p-6 shadow-sm',
        'hover:border-primary/20 hover:shadow-md'
      )}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="transition-colors group-hover:text-primary">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'transition-all duration-200',
              'group-hover:scale-[1.02]'
            )}
            style={{ height }}
          >
            {type === 'line' && lineData ? (
              <Line
                data={lineData}
                options={{ ...defaultOptions, ...options }}
              />
            ) : type === 'bar' && barData ? (
              <Bar data={barData} options={{ ...defaultOptions, ...options }} />
            ) : null}
          </div>
        </CardContent>
      </Card>
      <div className="absolute inset-0 rounded-lg opacity-0 ring-1 ring-inset ring-primary/10 transition-opacity duration-200 group-hover:opacity-100" />
    </AnimatedSection>
  );
}
