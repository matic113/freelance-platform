import React from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAdminAnalyticsUsers, useAdminDashboard } from '@/hooks/useAdmin';
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

export const UserAnalyticsWidget: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useAdminAnalyticsUsers();
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();

  const isLoading = analyticsLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Growth Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={analyticsData} type="line" height={280} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <StatMetric
            label="Total Users"
            value={dashboardData?.totalUsers || 0}
            icon={Users}
          />
          <StatMetric
            label="Active Users"
            value={dashboardData?.activeUsers || 0}
            icon={UserCheck}
            delta={5}
          />
          <StatMetric
            label="Verified Users"
            value={dashboardData?.verifiedUsers || 0}
            icon={UserCheck}
          />
          <StatMetric
            label="Clients"
            value={dashboardData?.totalClients || 0}
            icon={Users}
          />
          <StatMetric
            label="Freelancers"
            value={dashboardData?.totalFreelancers || 0}
            icon={Users}
          />
          <StatMetric
            label="Unverified"
            value={(dashboardData?.totalUsers || 0) - (dashboardData?.verifiedUsers || 0)}
            icon={UserX}
          />
        </CardContent>
      </Card>
    </div>
  );
};
