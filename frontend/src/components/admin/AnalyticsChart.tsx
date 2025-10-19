import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsSeries } from '@/types/api';

type ChartType = 'line' | 'bar' | 'pie';

interface AnalyticsChartProps {
  data?: AnalyticsSeries<any>;
  type: ChartType;
  title?: string;
  loading?: boolean;
  height?: number;
  dataKey?: string;
  xAxisKey?: string;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  type,
  title,
  loading,
  height = 300,
  dataKey = 'value',
  xAxisKey = 'name',
}) => {
  if (loading) {
    return <Skeleton className="w-full rounded-lg" style={{ height: `${height}px` }} />;
  }

  if (!data?.data || Object.keys(data.data).length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg text-muted-foreground"
        style={{ height: `${height}px` }}
      >
        No data available
      </div>
    );
  }

  // Transform the data object to array format
  const chartData = Object.entries(data.data).map(([key, value]) => ({
    name: key,
    value: typeof value === 'string' ? parseFloat(value) : value,
  }));

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-4">{title}</h3>}
      {type === 'line' && (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {type === 'bar' && (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xAxisKey} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {type === 'pie' && (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#3b82f6"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '6px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
