import { Suspense, useMemo, type ElementType } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  ShieldAlert,
  BarChart2,
  PieChart,
  LineChart,
  Rocket,
  MapPin,
  Zap,
  UserCheck,
  Target,
  PiggyBank,
  Database,
  CalendarClock,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAdminDashboard,
  useAdminAnalyticsUsers,
  useAdminAnalyticsProjects,
  useAdminAnalyticsRevenue,
  useAdminAnalyticsPerformance,
} from '@/hooks/useAdmin';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { AnalyticsSeries, PerformanceMetrics } from '@/types/api';
import { cn } from '@/lib/utils';
import { UserAnalyticsWidget } from '@/components/admin/widgets/UserAnalyticsWidget';
import { ProjectAnalyticsWidget } from '@/components/admin/widgets/ProjectAnalyticsWidget';
import { RevenueAnalyticsWidget } from '@/components/admin/widgets/RevenueAnalyticsWidget';
import { PerformanceMetricsWidget } from '@/components/admin/widgets/PerformanceMetricsWidget';
import { UsersTable } from '@/components/admin/UsersTable';

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '0';
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toLocaleString();
};

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  delta?: number;
  deltaLabel?: string;
}

const StatCard = ({ title, value, icon: Icon, hint, delta, deltaLabel }: StatCardProps) => {
  const deltaBadge = useMemo(() => {
    if (delta === undefined) {
      return null;
    }

    const formattedDelta = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
    const isNegative = delta < 0;

    return (
      <Badge variant={isNegative ? 'destructive' : 'default'} className="text-xs gap-1">
        {deltaLabel && <span>{deltaLabel}</span>}
        <span className="flex items-center gap-1">
          {isNegative ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
          {formattedDelta}
        </span>
      </Badge>
    );
  }, [delta, deltaLabel]);

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        {deltaBadge}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
      </CardContent>
    </Card>
  );
};

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const RecentItemCard = ({
  title,
  subtitle,
  meta,
  badge,
}: {
  title: string;
  subtitle: string;
  meta: string;
  badge: string;
}) => (
  <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
        {badge}
      </Badge>
    </div>
    <p className="text-xs text-muted-foreground">{subtitle}</p>
    <div className="text-xs text-muted-foreground">{meta}</div>
  </div>
);

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: isDashboardLoading } = useAdminDashboard();
  const { data: usersSeries, isLoading: isUsersLoading } = useAdminAnalyticsUsers();
  const { data: projectsSeries, isLoading: isProjectsLoading } = useAdminAnalyticsProjects();
  const { data: revenueSeries, isLoading: isRevenueLoading } = useAdminAnalyticsRevenue();
  const { data: performanceMetrics, isLoading: isPerformanceLoading } = useAdminAnalyticsPerformance();

  // Aggregate analytics loading state used by multiple summary widgets
  const isAnalyticsLoading = isUsersLoading || isProjectsLoading || isRevenueLoading || isPerformanceLoading;

  const handleStartChat = (userId: string) => {
    navigate(`/messages?userId=${userId}`);
  };

  const stats = isDashboardLoading || !dashboardData
    ? []
    : [
      {
        title: 'Total Users',
        value: formatNumber(dashboardData.totalUsers),
        icon: Users,
        hint: `${formatNumber(dashboardData.activeUsers)} active • ${formatNumber(dashboardData.verifiedUsers)} verified`,
      },
      {
        title: 'Clients',
        value: formatNumber(dashboardData.totalClients),
        icon: Briefcase,
        hint: `${formatNumber(dashboardData.totalProjects)} total projects`,
      },
      {
        title: 'Freelancers',
        value: formatNumber(dashboardData.totalFreelancers),
        icon: Activity,
        hint: `${formatNumber(dashboardData.totalProposals)} total proposals`,
      },
      {
        title: 'Revenue',
        value: `$${formatNumber(
          typeof dashboardData.totalRevenue === 'number'
            ? dashboardData.totalRevenue
            : Number(dashboardData.totalRevenue ?? 0)
        )}`,
        icon: DollarSign,
        hint: `${formatNumber(dashboardData.completedContracts)} completed contracts`,
      },
      {
        title: 'Projects In Progress',
        value: formatNumber(dashboardData.inProgressProjects),
        icon: TrendingUp,
        hint: `${formatNumber(dashboardData.completedProjects)} completed • ${formatNumber(dashboardData.featuredProjects)} featured`,
      },
      {
        title: 'Reports',
        value: formatNumber(dashboardData.totalReports),
        icon: ShieldAlert,
        hint: `${formatNumber(dashboardData.pendingReports)} pending • ${formatNumber(dashboardData.resolvedReports)} resolved`,
      },
    ];

  const renderStats = () => {
    if (isDashboardLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={`stat-skeleton-${index}`} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    );
  };

  const renderAnalyticsSummary = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
        <p className="text-sm text-muted-foreground">
          Comprehensive platform metrics and performance indicators
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <UserAnalyticsWidget />
        <ProjectAnalyticsWidget />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueAnalyticsWidget />
        <PerformanceMetricsWidget />
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="shadow-sm border-border">
        <CardHeader>
          <SectionHeader
            title="Recent Users"
            description="Latest signups across clients and freelancers"
          />
        </CardHeader>
        <CardContent className="grid gap-4">
          {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 ? (
            dashboardData.recentUsers.slice(0, 4).map((user) => (
              <RecentItemCard
                key={user.id}
                title={user.fullName}
                subtitle={user.email}
                meta={`Roles: ${user.roles.join(', ')}`}
                badge="New user"
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No recent user activity</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <SectionHeader
            title="Recent Projects"
            description="Active and recently completed client projects"
          />
        </CardHeader>
        <CardContent className="grid gap-4">
          {dashboardData?.recentProjects && dashboardData.recentProjects.length > 0 ? (
            dashboardData.recentProjects.slice(0, 4).map((project) => (
              <RecentItemCard
                key={project.id}
                title={project.title}
                subtitle={`Client: ${project.clientName}`}
                meta={`Status: ${project.status} • Budget: $${project.budget}`}
                badge={project.status}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No recent projects</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border lg:col-span-2">
        <CardHeader>
          <SectionHeader
            title="Recent Contracts"
            description="Newly signed or completed contracts"
          />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboardData?.recentContracts && dashboardData.recentContracts.length > 0 ? (
            dashboardData.recentContracts.slice(0, 6).map((contract) => (
              <RecentItemCard
                key={contract.id}
                title={contract.projectTitle}
                subtitle={`Freelancer: ${contract.freelancerName}`}
                meta={`Status: ${contract.status} • Total: $${contract.totalAmount}`}
                badge={contract.status}
              />
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No recent contracts</div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardShell withFooter={false} mainClassName="max-w-7xl space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor platform health, track key metrics, and follow marketplace activity in real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Create Announcement</Button>
          <Button size="sm" variant="outline">
            Manage Users
          </Button>
          <Button size="sm" variant="outline">
            Review Reports
          </Button>
        </div>
      </div>

      {renderStats()}

      {renderAnalyticsSummary()}

      {renderRecentActivity()}

      <div className="mt-12">
        <UsersTable onStartChat={handleStartChat} />
      </div>
    </DashboardShell>
  );
};

const AdminDashboard = () => (
  <Suspense fallback={<Skeleton className="h-screen w-full" />}>
    <AdminDashboardContent />
  </Suspense>
);

export default AdminDashboard;
