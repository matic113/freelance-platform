import { useLocalization } from "@/hooks/useLocalization";
import { useFreelancerDashboard } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { 
  Eye, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  Briefcase, 
  DollarSign,
  Calendar,
  Clock,
  AlertCircle,
  Award,
  Loader2,
  CheckCircle,
  Zap,
  ArrowUpRight,
  Search,
  FileText,
  Target
} from "lucide-react";

export default function FreelancerDashboard() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { data: dashboardData, isLoading, error } = useFreelancerDashboard();

  const stats = dashboardData ? [
    {
      title: isRTL ? "إجمالي الأرباح" : "Total Earnings",
      value: `$${dashboardData.stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: isRTL ? "المشاريع النشطة" : "Active Projects",
      value: dashboardData.activeContracts.length.toString(),
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: isRTL ? "معدل النجاح" : "Success Rate",
      value: `${dashboardData.proposalSuccessRate}%`,
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: isRTL ? "التقييم العام" : "Overall Rating",
      value: dashboardData.rating.toFixed(1),
      icon: Star,
      color: "text-yellow-600"
    }
  ] : [];

  const activeProjects = dashboardData?.activeContracts || [];
  const recentProposals = dashboardData?.recentProposals || [];

  const getContractStatusColor = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "ACTIVE":
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContractStatusText = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "ACTIVE":
      case "IN_PROGRESS":
        return isRTL ? "قيد التنفيذ" : "In Progress";
      case "COMPLETED":
        return isRTL ? "مكتمل" : "Completed";
      case "PENDING":
        return isRTL ? "في الانتظار" : "Pending";
      default:
        return status;
    }
  };

  const getProposalStatusColor = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProposalStatusText = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case "ACCEPTED":
        return isRTL ? "مقبول" : "Accepted";
      case "PENDING":
        return isRTL ? "في الانتظار" : "Pending";
      case "REJECTED":
        return isRTL ? "مرفوض" : "Rejected";
      case "WITHDRAWN":
        return isRTL ? "مسحوب" : "Withdrawn";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <DashboardShell isRTL={isRTL} onLanguageToggle={toggleLanguage}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#0A2540]" />
            <p className="text-muted-foreground">
              {isRTL ? "جاري تحميل البيانات..." : "Loading dashboard data..."}
            </p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell isRTL={isRTL} onLanguageToggle={toggleLanguage}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-muted-foreground">
              {isRTL ? "حدث خطأ في تحميل البيانات" : "Error loading dashboard data"}
            </p>
            <Button onClick={() => window.location.reload()}>
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell isRTL={isRTL} onLanguageToggle={toggleLanguage}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#0A2540]" />
            <p className="text-muted-foreground">
              {isRTL ? "جاري تحميل البيانات..." : "Loading dashboard data..."}
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-muted-foreground">
              {isRTL ? "حدث خطأ في تحميل البيانات" : "Error loading dashboard data"}
            </p>
            <Button onClick={() => window.location.reload()}>
              {isRTL ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
              {isRTL ? "لوحة تحكم المستقل" : "Freelancer Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL 
                ? "مرحباً بك في لوحة التحكم الخاصة بك. تابع مشاريعك وإدارة عملائك" 
                : "Welcome back! Here's what you need to know about your freelance business"
              }
            </p>
          </div>

          {/* Primary CTA: Find New Projects */}
          <div className="mb-6">
            <Link to="/available-projects">
              <Button className="w-full md:w-auto bg-[#0A2540] hover:bg-[#142b52] h-12 px-6 text-base font-semibold">
                <Search className="h-5 w-5 mr-2" />
                {isRTL ? "البحث عن مشاريع جديدة" : "Find New Projects"}
              </Button>
            </Link>
          </div>

           {/* Key Stat Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
             {stats.map((stat, index) => (
               <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                   <CardTitle className="text-xs font-medium text-muted-foreground">
                     {stat.title}
                   </CardTitle>
                   <stat.icon className={`h-4 w-4 ${stat.color}`} />
                 </CardHeader>
                 <CardContent className="p-4 pt-0">
                   <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                 </CardContent>
               </Card>
             ))}
           </div>

          {/* Main Content Grid: Active Projects + Recent Proposals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* My Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {isRTL ? "مشاريعي النشطة" : "My Active Projects"}
                  </span>
                  <Link to="/my-projects">
                    <Button variant="outline" size="sm">
                      {isRTL ? "عرض الكل" : "View All"}
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>
                  {isRTL ? "ماذا تحتاج إلى العمل عليه؟" : "What do you need to work on?"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeProjects.length > 0 ? (
                  <div className="space-y-3">
                    {activeProjects.slice(0, 5).map((project) => (
                      <div key={project.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-sm text-[#0A2540] truncate">
                                {project.projectTitle}
                              </h3>
                              <Badge className={cn("text-xs", getContractStatusColor(project.status))}>
                                {getContractStatusText(project.status)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {isRTL ? "العميل: " : "Client: "}{project.clientName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${project.totalAmount}
                          </span>
                          {project.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      {isRTL ? "لا توجد مشاريع نشطة حالياً" : "No active projects yet"}
                    </p>
                    <Link to="/available-projects">
                      <Button className="bg-[#0A2540] hover:bg-[#142b52]" size="sm">
                        {isRTL ? "ابدأ البحث الآن" : "Start Searching"}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Proposal Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {isRTL ? "نشاط العروض الأخيرة" : "Recent Proposal Activity"}
                  </span>
                  <Link to="/my-proposals">
                    <Button variant="outline" size="sm">
                      {isRTL ? "إدارة الكل" : "Manage All"}
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>
                  {isRTL ? "ما هي حالة خطوط أنابيبك؟" : "What's in your pipeline?"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentProposals.length > 0 ? (
                  <div className="space-y-3">
                    {recentProposals.slice(0, 5).map((proposal) => (
                      <div key={proposal.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-sm text-[#0A2540] truncate">
                                {proposal.project?.title}
                              </h3>
                              <Badge className={cn("text-xs", getProposalStatusColor(proposal.status))}>
                                {getProposalStatusText(proposal.status)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {isRTL ? "العرض المقترح: " : "Your Bid: "}<span className="font-semibold">${proposal.proposedBudget}</span>
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {proposal.coverLetter}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-4">
                      {isRTL ? "لم تقدم أي عروض بعد" : "No proposals yet"}
                    </p>
                    <Link to="/available-projects">
                      <Button className="bg-[#0A2540] hover:bg-[#142b52]" size="sm">
                        {isRTL ? "ابدأ البحث" : "Browse Projects"}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
