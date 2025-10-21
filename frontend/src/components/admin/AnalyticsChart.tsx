import React from 'react';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Area, AreaChart as RechartsAreaChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { AnalyticsSeries } from '@/types/api';

type ChartType = 'line' | 'bar' | 'area';

interface AnalyticsChartProps {
  data?: AnalyticsSeries<any>;
  type?: ChartType;
  title?: string;
  loading?: boolean;
  height?: number;
  dataKey?: string;
  xAxisKey?: string;
  config?: ChartConfig;
  valueFormatter?: (value: number) => string;
}

const defaultConfig: ChartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
};

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  type = 'area',
  title,
  loading,
  height = 300,
  dataKey = 'value',
  xAxisKey = 'name',
  config = defaultConfig,
  valueFormatter,
}) => {
  if (loading) {
    return <Skeleton className="w-full rounded-lg" style={{ height: `${height}px` }} />;
  }

  if (!data?.data || Object.keys(data.data).length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted/40 rounded-lg text-muted-foreground text-sm"
        style={{ height: `${height}px` }}
      >
        No data available
      </div>
    );
  }

  const chartData = Object.entries(data.data).map(([key, value]) => ({
    name: key,
    value: typeof value === 'string' ? parseFloat(value) : value,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      <ChartContainer config={config} className="w-full" style={{ height: `${height}px` }}>
        {type === 'line' && (
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}

        {type === 'bar' && (
          <RechartsBarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={dataKey} fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        )}

        {type === 'area' && (
          <RechartsAreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 7)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="var(--color-value)"
              fill="url(#fillValue)"
              strokeWidth={2}
            />
          </RechartsAreaChart>
        )}
      </ChartContainer>
    </div>
  );
};
