import React from 'react';
import { Users, UserCheck, Briefcase, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAnalyticsUsers, useAdminDashboard } from '@/hooks/useAdmin';
import { AnalyticsChart } from '../AnalyticsChart';

export const UserAnalyticsWidget: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useAdminAnalyticsUsers();
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();

  const isLoading = analyticsLoading || dashboardLoading;

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-sm">User Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-60 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const activationRate = dashboardData?.totalUsers
    ? ((dashboardData.activeUsers / dashboardData.totalUsers) * 100).toFixed(1)
    : 0;

  const verificationRate = dashboardData?.totalUsers
    ? ((dashboardData.verifiedUsers / dashboardData.totalUsers) * 100).toFixed(1)
    : 0;

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          User Growth & Demographics
        </CardTitle>
        <CardDescription className="text-xs">
          Track user registrations and account activity over the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnalyticsChart data={analyticsData} type="bar" height={220} />
          </div>

          <div className="space-y-2">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Users</span>
                </div>
              </div>
              <div className="mt-1 text-2xl font-bold">{dashboardData?.totalUsers?.toLocaleString() || 0}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">All registered accounts</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-card p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Briefcase className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Clients</span>
                </div>
                <div className="text-lg font-bold">{dashboardData?.totalClients || 0}</div>
              </div>

              <div className="rounded-lg border border-border bg-card p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">Freelancers</span>
                </div>
                <div className="text-lg font-bold">{dashboardData?.totalFreelancers || 0}</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Active Users</span>
              </div>
              <div className="text-xl font-bold">{dashboardData?.activeUsers || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${activationRate}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-fit">{activationRate}%</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Verified</span>
              </div>
              <div className="text-xl font-bold">{dashboardData?.verifiedUsers || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${verificationRate}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-fit">{verificationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
