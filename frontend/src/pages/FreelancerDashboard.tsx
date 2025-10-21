import { useLocalization } from "@/hooks/useLocalization";
import { useFreelancerDashboard } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReviewPromptsList } from "@/components/reviews/ReviewPrompt";
import { usePendingReviews } from "@/hooks/useReviewOpportunities";
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
  Target,
  Plus,
  User,
  Settings
} from "lucide-react";

export default function FreelancerDashboard() {
   const { isRTL, toggleLanguage } = useLocalization();
   const { data: dashboardData, isLoading, error } = useFreelancerDashboard();
   
   const {
     data: pendingReviewsData,
     isLoading: pendingReviewsLoading
   } = usePendingReviews(0, 100, true);

  const stats = dashboardData ? [
    {
      title: isRTL ? "إجمالي الأرباح" : "Total Earnings",
      value: `$${dashboardData.stats.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: isRTL ? "المشاريع النشطة" : "Active Projects",
      value: dashboardData.stats.activeProjects.toString(),
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: isRTL ? "معدل النجاح" : "Success Rate",
      value: `${dashboardData.stats.proposalSuccessRate}%`,
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: isRTL ? "التقييم العام" : "Overall Rating",
      value: dashboardData.stats.rating.toFixed(1),
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
       {/* Dashboard Header */}
       <div className="mb-6">
         <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
           {isRTL ? "لوحة تحكم المستقل" : "Freelancer Dashboard"}
         </h1>
         <p className="text-muted-foreground">
           {isRTL 
             ? "مرحباً بك في لوحة التحكم الخاصة بك. تابع مشاريعك وإدارة عملائك" 
             : "Welcome to your dashboard. Track your projects and manage your clients"
           }
         </p>
       </div>

         {/* Stats Cards Row */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
           {stats.map((stat, index) => (
             <Card key={index} className="hover:shadow-md transition-shadow duration-300">
               <CardContent className="p-4">
                 <div className="flex items-center justify-between">
                   <div className="flex-1 min-w-0">
                     <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                     <p className="text-xl font-bold text-[#0A2540]">{stat.value}</p>
                   </div>
                   <stat.icon className={`h-5 w-5 flex-shrink-0 ml-2 ${stat.color}`} />
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>

         {/* Review Prompts Section */}
         <ReviewPromptsList 
           opportunities={pendingReviewsData?.content || []}
           className="mb-6"
         />

         {/* Main Content Area */}
         <div className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             {/* Quick Actions - Left Column */}
             <Card className="lg:col-span-1">
               <CardHeader className="pb-3">
                 <CardTitle className="text-sm flex items-center gap-2">
                   <Plus className="h-4 w-4" />
                   {isRTL ? "إجراءات سريعة" : "Actions"}
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-2 pt-0">
                 <div className="space-y-1">
                   <Link to="/available-projects" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <Search className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "مشاريع جديدة" : "Find Projects"}</span>
                     </div>
                   </Link>
                   <Link to="/my-projects" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <Briefcase className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "مشاريعي" : "My Projects"}</span>
                     </div>
                   </Link>
                   <Link to="/my-proposals" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <FileText className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "عروضي" : "My Proposals"}</span>
                     </div>
                   </Link>
                   <Link to="/messages" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <MessageCircle className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "الرسائل" : "Messages"}</span>
                     </div>
                   </Link>
                   <Link to="/profile" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <User className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "الملف" : "Profile"}</span>
                     </div>
                   </Link>
                   <Link to="/settings" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <Settings className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "الإعدادات" : "Settings"}</span>
                     </div>
                   </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Stacked Cards */}
              <div className="lg:col-span-3 space-y-6">
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
                       <Eye className="h-4 w-4 mr-2" />
                       {isRTL ? "عرض الكل" : "View All"}
                     </Button>
                   </Link>
                 </CardTitle>
                 <CardDescription>
                   {isRTL ? "تتبع حالة مشاريعك الحالية" : "Track the status of your current projects"}
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 {isLoading ? (
                   <div className="flex items-center justify-center py-8">
                     <Loader2 className="h-6 w-6 animate-spin text-[#0A2540]" />
                     <span className="ml-2">{isRTL ? "جاري التحميل..." : "Loading..."}</span>
                   </div>
                 ) : error ? (
                   <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                     <AlertCircle className="h-5 w-5 text-red-600" />
                     <span className="text-red-700">{isRTL ? "خطأ في التحميل" : "Error loading data"}</span>
                   </div>
                   ) : activeProjects.length > 0 ? (
                     <div className="space-y-4">
                      {activeProjects.slice(0, 5).map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-start justify-between gap-3">
                          <Link to="/contracts" className="block flex-1">
                           <div className="flex items-center gap-3 mb-2">
                             <h3 className="font-semibold text-[#0A2540]">{project.projectTitle}</h3>
                             <Badge className={cn("text-xs", getContractStatusColor(project.status))}>
                               {getContractStatusText(project.status)}
                             </Badge>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                             <span className="flex items-center gap-1">
                               <span className="text-xs">{isRTL ? "العميل: " : "Client: "}</span>
                               {project.clientName}
                             </span>
                           </div>
                             <div className="flex items-center gap-4 text-sm text-muted-foreground">
                               <span className="flex items-center gap-1">
                                 <DollarSign className="h-4 w-4" />
                                 ${project.totalAmount}
                               </span>
                               {project.endDate && (
                                 <span className="flex items-center gap-1">
                                   <Clock className="h-4 w-4" />
                                   {new Date(project.endDate).toLocaleDateString()}
                                 </span>
                               )}
                             </div>
                          </Link>
                          {project.status?.toUpperCase() === 'COMPLETED' && (
                            <Link to={`/reviews/contract/${project.id}`}>
                              <Button size="sm" variant="ghost" className="flex-shrink-0" title={isRTL ? "اترك تقييماً" : "Leave Review"}>
                                <Star className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                       ))}
                     </div>
                  ) : (
                   <div className="text-center py-8">
                     <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                     <p className="text-muted-foreground">
                       {isRTL ? "لا توجد مشاريع نشطة حالياً" : "No active projects yet"}
                     </p>
                     <Link to="/available-projects">
                       <Button className="bg-[#0A2540] hover:bg-[#142b52] mt-4">
                         <Search className="h-4 w-4 mr-2" />
                         {isRTL ? "البحث عن مشاريع" : "Find Projects"}
                       </Button>
                     </Link>
                   </div>
                 )}
               </CardContent>
              </Card>

               {/* Recent Completed Projects for Reviews */}
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {isRTL ? "المشاريع المكتملة الأخيرة" : "Recent Completed Projects"}
                    </span>
                    <Link to="/reviews">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {isRTL ? "عرض الكل" : "View All"}
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "قيم المشاريع المكتملة وأترك تقييمات" : "Rate your completed projects and leave reviews"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#0A2540]" />
                      <span className="ml-2">{isRTL ? "جاري التحميل..." : "Loading..."}</span>
                    </div>
                  ) : error ? (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-700">{isRTL ? "خطأ في التحميل" : "Error loading data"}</span>
                    </div>
                  ) : dashboardData?.completedContracts && dashboardData.completedContracts.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.completedContracts.slice(0, 5).map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-start justify-between gap-3">
                          <Link to={`/contracts`} className="block flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-[#0A2540]">{project.projectTitle}</h3>
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                {isRTL ? "مكتمل" : "Completed"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <span className="text-xs">{isRTL ? "العميل: " : "Client: "}</span>
                                {project.clientName}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${project.totalAmount}
                              </span>
                              {project.endDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(project.endDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </Link>
                          <Link to={`/reviews/contract/${project.id}`}>
                            <Button size="sm" variant="ghost" className="flex-shrink-0" title={isRTL ? "اترك تقييماً" : "Leave Review"}>
                              <Star className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        {isRTL ? "لا توجد مشاريع مكتملة حالياً" : "No completed projects yet"}
                      </p>
                    </div>
                  )}
                </CardContent>
               </Card>

               {/* Recent Proposals */}
               <Card>
              <CardHeader>
               <CardTitle className="flex items-center justify-between">
                 <span className="flex items-center gap-2">
                   <FileText className="h-5 w-5" />
                   {isRTL ? "عروضي الأخيرة" : "Recent Proposals"}
                 </span>
                 <Link to="/my-proposals">
                   <Button variant="outline" size="sm">
                     <Eye className="h-4 w-4 mr-2" />
                     {isRTL ? "عرض الكل" : "View All"}
                   </Button>
                 </Link>
               </CardTitle>
               <CardDescription>
                 {isRTL ? "تتبع حالة عروضك المقدمة" : "Track your submitted proposals"}
               </CardDescription>
             </CardHeader>
             <CardContent>
               {isLoading ? (
                 <div className="flex items-center justify-center py-8">
                   <Loader2 className="h-6 w-6 animate-spin text-[#0A2540]" />
                   <span className="ml-2">{isRTL ? "جاري التحميل..." : "Loading..."}</span>
                 </div>
               ) : error ? (
                 <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                   <AlertCircle className="h-5 w-5 text-red-600" />
                   <span className="text-red-700">{isRTL ? "خطأ في التحميل" : "Error loading data"}</span>
                 </div>
               ) : recentProposals.length > 0 ? (
                 <div className="space-y-4">
                   {recentProposals.slice(0, 5).map((proposal) => (
                     <Link key={proposal.id} to="/my-proposals">
                       <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-sm text-[#0A2540] truncate flex-1">
                              {proposal.projectTitle}
                            </h3>
                            <Badge className={cn("text-xs flex-shrink-0", getProposalStatusColor(proposal.status))}>
                              {getProposalStatusText(proposal.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {isRTL ? "عرضي: " : "Your Bid: "}${proposal.proposedAmount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {proposal.description}
                          </p>
                       </div>
                     </Link>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-8">
                   <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                   <p className="text-muted-foreground">
                     {isRTL ? "لم تقدم أي عروض بعد" : "No proposals yet"}
                   </p>
                   <Link to="/available-projects">
                     <Button className="bg-[#0A2540] hover:bg-[#142b52] mt-4">
                       <Search className="h-4 w-4 mr-2" />
                       {isRTL ? "ابدأ البحث" : "Browse Projects"}
                     </Button>
                   </Link>
                 </div>
               )}
               </CardContent>
             </Card>
              </div>
            </div>
          </div>
      </DashboardShell>
   );
 }
