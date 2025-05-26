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
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          {type === 'line' && lineData ? (
            <Line data={lineData} options={{ ...defaultOptions, ...options }} />
          ) : type === 'bar' && barData ? (
            <Bar data={barData} options={{ ...defaultOptions, ...options }} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
