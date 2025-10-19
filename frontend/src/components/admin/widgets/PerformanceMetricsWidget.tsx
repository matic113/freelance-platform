import React from 'react';
import { Activity, BarChart3, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useAdminAnalyticsPerformance } from '@/hooks/useAdmin';

const MetricGauge = ({ 
  label, 
  value, 
  icon: Icon,
  unit = '%',
  color = 'bg-blue-500',
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  unit?: string;
  color?: string;
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const colorClass = percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mb-2">
        <div className={`text-2xl font-bold ${colorClass}`}>{percentage.toFixed(1)}{unit}</div>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export const PerformanceMetricsWidget: React.FC = () => {
  const { data: performanceData, isLoading } = useAdminAnalyticsPerformance();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <MetricGauge
            label="User Activation Rate"
            value={performanceData?.userActivationRate || 0}
            icon={TrendingUp}
            color="bg-blue-500"
          />
          <MetricGauge
            label="Project Completion Rate"
            value={performanceData?.projectCompletionRate || 0}
            icon={CheckCircle2}
            color="bg-green-500"
          />
          <MetricGauge
            label="Proposal Acceptance Rate"
            value={performanceData?.proposalAcceptanceRate || 0}
            icon={BarChart3}
            color="bg-purple-500"
          />
          <MetricGauge
            label="Transaction Success Rate"
            value={performanceData?.transactionSuccessRate || 0}
            icon={Activity}
            color="bg-orange-500"
          />
          <MetricGauge
            label="Platform Health"
            value={(
              (performanceData?.userActivationRate || 0) +
              (performanceData?.projectCompletionRate || 0) +
              (performanceData?.transactionSuccessRate || 0)
            ) / 3}
            icon={Zap}
            color="bg-red-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};
