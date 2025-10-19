import React from 'react';
import { Briefcase, CheckCircle2, Clock, XCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAnalyticsProjects, useAdminDashboard } from '@/hooks/useAdmin';
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

export const ProjectAnalyticsWidget: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useAdminAnalyticsProjects();
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();

  const isLoading = analyticsLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Statistics</CardTitle>
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

  const completionRate = dashboardData?.completedProjects && dashboardData?.totalProjects
    ? Math.round((dashboardData.completedProjects / dashboardData.totalProjects) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Project Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={analyticsData} type="bar" height={280} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <StatMetric
            label="Total Projects"
            value={dashboardData?.totalProjects || 0}
            icon={Briefcase}
            delta={3}
          />
          <StatMetric
            label="Published"
            value={dashboardData?.publishedProjects || 0}
            icon={Zap}
          />
          <StatMetric
            label="In Progress"
            value={dashboardData?.inProgressProjects || 0}
            icon={Clock}
          />
          <StatMetric
            label="Completed"
            value={dashboardData?.completedProjects || 0}
            icon={CheckCircle2}
          />
          <StatMetric
            label="Featured"
            value={dashboardData?.featuredProjects || 0}
            icon={Zap}
          />
          <StatMetric
            label="Completion Rate"
            value={`${completionRate}%`}
            icon={CheckCircle2}
          />
        </CardContent>
      </Card>
    </div>
  );
};
