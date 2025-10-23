import { Suspense, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Activity,
  ShieldAlert,
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
} from '@/hooks/useAdmin';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { UserAnalyticsWidget } from '@/components/admin/widgets/UserAnalyticsWidget';
import { ProjectAnalyticsWidget } from '@/components/admin/widgets/ProjectAnalyticsWidget';
import { UsersTable } from '@/components/admin/UsersTable';
import { AnnouncementsTable } from '@/components/admin/AnnouncementsTable';
import { ContractsTable } from '@/components/admin/ContractsTable';
import { ReviewsTable } from '@/components/admin/ReviewsTable';
import { CreateAnnouncementModal } from '@/components/modals/CreateAnnouncementModal';

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5">
        <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-primary" />
          {title}
        </CardTitle>
        {deltaBadge}
      </CardHeader>
      <CardContent className="py-1.5">
        <div className="text-lg font-bold text-foreground">{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
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

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
   const { data: dashboardData, isLoading: isDashboardLoading } = useAdminDashboard();
   const { data: usersSeries, isLoading: isUsersLoading } = useAdminAnalyticsUsers();
   const { data: projectsSeries, isLoading: isProjectsLoading } = useAdminAnalyticsProjects();

   const isAnalyticsLoading = isUsersLoading || isProjectsLoading;

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
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={`stat-skeleton-${index}`} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-2.5 w-16 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="grid gap-6">
          <UserAnalyticsWidget />
          <ProjectAnalyticsWidget />
        </div>
     </div>
   );

  return (
    <DashboardShell withFooter={false} mainClassName="max-w-7xl space-y-4">
      <div className="flex flex-col gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-xs text-muted-foreground">
            Monitor platform health, track key metrics, and follow marketplace activity in real-time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="text-xs h-8" onClick={() => setIsAnnouncementModalOpen(true)}>
            Create Announcement
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-8">
            Manage Users
          </Button>
          <Button size="sm" variant="outline" className="text-xs h-8">
            Review Reports
          </Button>
        </div>
      </div>

      {renderStats()}

      {renderAnalyticsSummary()}

      <div className="space-y-6">
        <div>
          <SectionHeader 
            title="Announcements" 
            description="Platform-wide announcements and notifications" 
          />
          <div className="mt-4">
            <AnnouncementsTable />
          </div>
        </div>

        <div>
          <SectionHeader 
            title="Contracts" 
            description="Monitor active contracts and milestones" 
          />
          <div className="mt-4">
            <ContractsTable />
          </div>
        </div>

        <div>
          <SectionHeader 
            title="Reviews" 
            description="Moderate and manage platform reviews" 
          />
          <div className="mt-4">
            <ReviewsTable />
          </div>
        </div>

        <div>
          <SectionHeader 
            title="User Management" 
            description="Monitor and manage platform users" 
          />
          <div className="mt-4">
            <UsersTable onStartChat={handleStartChat} />
          </div>
        </div>
      </div>

      <CreateAnnouncementModal 
        open={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
    </DashboardShell>
  );
};

const AdminDashboard = () => (
  <Suspense fallback={<Skeleton className="h-screen w-full" />}>
    <AdminDashboardContent />
  </Suspense>
);

export default AdminDashboard;
