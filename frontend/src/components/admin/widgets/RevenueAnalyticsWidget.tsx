import React from 'react';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAnalyticsRevenue, useAdminDashboard } from '@/hooks/useAdmin';
import { AnalyticsChart } from '../AnalyticsChart';

const StatMetric = ({ 
  label, 
  value, 
  icon: Icon,
  delta,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  delta?: number;
}) => {
  const deltaColor = delta === undefined ? '' : delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-600';
  const deltaIcon = delta === undefined ? null : delta > 0 ? '↑' : delta < 0 ? '↓' : '→';

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {delta !== undefined && (
        <div className={`text-sm ${deltaColor} mt-1`}>
          {deltaIcon} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const RevenueAnalyticsWidget: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useAdminAnalyticsRevenue();
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();

  const isLoading = analyticsLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const successRate = dashboardData?.completedTransactions && dashboardData?.totalTransactions
    ? Math.round((dashboardData.completedTransactions / dashboardData.totalTransactions) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={analyticsData} type="line" height={280} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <StatMetric
            label="Total Revenue"
            value={formatCurrency(dashboardData?.totalRevenue || 0)}
            icon={DollarSign}
            delta={8}
          />
          <StatMetric
            label="Completed Transactions"
            value={dashboardData?.completedTransactions || 0}
            icon={TrendingUp}
          />
          <StatMetric
            label="Failed Transactions"
            value={dashboardData?.failedTransactions || 0}
            icon={DollarSign}
          />
          <StatMetric
            label="Success Rate"
            value={`${successRate}%`}
            icon={TrendingUp}
          />
          <StatMetric
            label="Total Transactions"
            value={dashboardData?.totalTransactions || 0}
            icon={Wallet}
          />
          <StatMetric
            label="Pending Transactions"
            value={(dashboardData?.totalTransactions || 0) - (dashboardData?.completedTransactions || 0) - (dashboardData?.failedTransactions || 0)}
            icon={Wallet}
          />
        </CardContent>
      </Card>
    </div>
  );
};
