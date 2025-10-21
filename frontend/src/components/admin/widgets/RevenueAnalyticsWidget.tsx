import React from 'react';
import { DollarSign, TrendingUp, Wallet, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAnalyticsRevenue, useAdminDashboard } from '@/hooks/useAdmin';
import { AnalyticsChart } from '../AnalyticsChart';

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
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const successRate = dashboardData?.completedTransactions && dashboardData?.totalTransactions
    ? ((dashboardData.completedTransactions / dashboardData.totalTransactions) * 100).toFixed(1)
    : 0;

  const failureRate = dashboardData?.failedTransactions && dashboardData?.totalTransactions
    ? ((dashboardData.failedTransactions / dashboardData.totalTransactions) * 100).toFixed(1)
    : 0;

  const pendingTransactions = (dashboardData?.totalTransactions || 0) - (dashboardData?.completedTransactions || 0) - (dashboardData?.failedTransactions || 0);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue & Transaction Analytics
        </CardTitle>
        <CardDescription>
          Track platform revenue and transaction performance over the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart data={analyticsData} type="bar" height={300} />
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Revenue</span>
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold">{formatCurrency(dashboardData?.totalRevenue || 0)}</div>
              <div className="mt-1 text-xs text-muted-foreground">All-time platform revenue</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
                <div className="text-xl font-bold">{dashboardData?.totalTransactions?.toLocaleString() || 0}</div>
              </div>

              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>
                <div className="text-xl font-bold">{pendingTransactions.toLocaleString()}</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="text-2xl font-bold">{dashboardData?.completedTransactions?.toLocaleString() || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${successRate}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{successRate}%</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Failed</span>
              </div>
              <div className="text-2xl font-bold">{dashboardData?.failedTransactions?.toLocaleString() || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${failureRate}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{failureRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
