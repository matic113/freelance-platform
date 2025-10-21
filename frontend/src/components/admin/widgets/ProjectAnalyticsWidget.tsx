import React from 'react';
import { Briefcase, CheckCircle2, Clock, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminAnalyticsProjects, useAdminDashboard } from '@/hooks/useAdmin';
import { AnalyticsChart } from '../AnalyticsChart';

export const ProjectAnalyticsWidget: React.FC = () => {
  const { data: analyticsData, isLoading: analyticsLoading } = useAdminAnalyticsProjects();
  const { data: dashboardData, isLoading: dashboardLoading } = useAdminDashboard();

  const isLoading = analyticsLoading || dashboardLoading;

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-sm">Project Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-60 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const completionRate = dashboardData?.completedProjects && dashboardData?.totalProjects
    ? ((dashboardData.completedProjects / dashboardData.totalProjects) * 100).toFixed(1)
    : 0;

  const activeRate = dashboardData?.totalProjects
    ? (((dashboardData.inProgressProjects || 0) / dashboardData.totalProjects) * 100).toFixed(1)
    : 0;

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Project Distribution & Performance
        </CardTitle>
        <CardDescription className="text-xs">
          Monitor project creation trends and status distribution over time
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
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total Projects</span>
                </div>
              </div>
              <div className="mt-1 text-2xl font-bold">{dashboardData?.totalProjects?.toLocaleString() || 0}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">All platform projects</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-card p-2">
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Published</span>
                </div>
                <div className="text-lg font-bold">{dashboardData?.publishedProjects || 0}</div>
              </div>

              <div className="rounded-lg border border-border bg-card p-2">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">Featured</span>
                </div>
                <div className="text-lg font-bold">{dashboardData?.featuredProjects || 0}</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">In Progress</span>
              </div>
              <div className="text-xl font-bold">{dashboardData?.inProgressProjects || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${activeRate}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-fit">{activeRate}%</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
              <div className="text-xl font-bold">{dashboardData?.completedProjects || 0}</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${completionRate}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground min-w-fit">{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
