import { useLocalization } from "@/hooks/useLocalization";
import { cn, isClient } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useState, useEffect } from "react";
import { projectService } from "@/services/project.service";
import { ProjectResponse, ProjectStatus } from "@/types/api";
import { useReceivedProposals } from "@/hooks/useProposals";
import { useAuth } from "@/contexts/AuthContext";
import { config } from "@/config/env";
import { ReviewPromptsList } from "@/components/reviews/ReviewPrompt";
import { usePendingReviews } from "@/hooks/useReviewOpportunities";

interface ProjectStage {
  name: string;
  label: string;
  order: number;
  color: string;
  bgColor: string;
}

const PROJECT_STAGES: Record<ProjectStatus, ProjectStage> = {
  [ProjectStatus.DRAFT]: {
    name: 'Draft',
    label: 'Draft',
    order: 0,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  [ProjectStatus.PUBLISHED]: {
    name: 'Published',
    label: 'Published',
    order: 1,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  [ProjectStatus.IN_PROGRESS]: {
    name: 'In Progress',
    label: 'In Progress',
    order: 2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  [ProjectStatus.COMPLETED]: {
    name: 'Completed',
    label: 'Completed',
    order: 3,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  [ProjectStatus.CANCELLED]: {
    name: 'Cancelled',
    label: 'Cancelled',
    order: 4,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
};

const STAGE_SEQUENCE = [
  ProjectStatus.DRAFT,
  ProjectStatus.PUBLISHED,
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.COMPLETED
];
import { 
  Plus, 
  Search, 
  MessageCircle, 
  User, 
  Settings,
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Eye,
  TrendingUp,
  Loader2,
  Star
} from "lucide-react";

export default function ClientDashboard() {
   const { isRTL, toggleLanguage } = useLocalization();
   const { user } = useAuth();
   const [projects, setProjects] = useState<ProjectResponse[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const isClientUser = isClient(user);
   const { data: receivedProposalsData, isLoading: proposalsLoading } = useReceivedProposals(0, 5, 'submittedAt,desc', isClientUser);

   const {
     data: pendingReviewsData,
     isLoading: pendingReviewsLoading
   } = usePendingReviews(0, 100, true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectService.getMyProjects(0, 50);
        setProjects(response.content || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(isRTL ? "فشل تحميل المشاريع" : "Failed to load projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isRTL]);

   const getAvatarUrl = (avatarUrl: string | undefined): string => {
     if (!avatarUrl) return '';
     
     if (avatarUrl.startsWith('http')) {
       return avatarUrl;
     }
     
     const baseUrl = config.apiBaseUrl.replace('/api', '');
     return `${baseUrl}${avatarUrl}`;
   };

   const calculateStats = () => {
    const stats = {
      active: 0,
      completed: 0,
      totalBudget: 0,
      publishedCount: 0
    };

    projects.forEach(project => {
      if (project.status === ProjectStatus.IN_PROGRESS || project.status === ProjectStatus.PUBLISHED) {
        stats.active++;
      }
      if (project.status === ProjectStatus.COMPLETED) {
        stats.completed++;
      }
      if (project.status === ProjectStatus.PUBLISHED) {
        stats.publishedCount++;
      }
      stats.totalBudget += project.budgetMax || 0;
    });

    return stats;
  };

  const projectStats = calculateStats();

   const stats = [
     {
       title: isRTL ? "المشاريع النشطة" : "Active Projects",
       value: projectStats.active.toString(),
       icon: TrendingUp
     },
     {
       title: isRTL ? "المشاريع المكتملة" : "Completed Projects",
       value: projectStats.completed.toString(),
       icon: CheckCircle
     },
     {
       title: isRTL ? "إجمالي الميزانية" : "Total Budget",
       value: `$${projectStats.totalBudget.toLocaleString()}`,
       icon: DollarSign
     },
     {
       title: isRTL ? "إجمالي المشاريع" : "Total Projects",
       value: projects.length.toString(),
       icon: Briefcase
     }
   ];

   const getStagePercentage = (status: ProjectStatus): number => {
     const stageIndex = STAGE_SEQUENCE.indexOf(status);
     if (stageIndex === -1) return 0;
     return ((stageIndex + 1) / STAGE_SEQUENCE.length) * 100;
   };

   const recentProjects = projects.slice(0, 5).map(project => ({
     id: project.id,
     title: project.title,
     freelancer: project.clientName,
     status: project.status.toLowerCase().replace('_', '_') as 'in_progress' | 'completed' | 'pending',
     budget: `$${project.budgetMax.toLocaleString()}`,
     deadline: new Date(project.deadline).toLocaleDateString(),
     progress: project.status === ProjectStatus.IN_PROGRESS ? 50 : project.status === ProjectStatus.COMPLETED ? 100 : 0,
     stageIndex: STAGE_SEQUENCE.indexOf(project.status)
   }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

   const getStatusText = (status: string) => {
     switch (status) {
       case "completed":
         return isRTL ? "مكتمل" : "Completed";
       case "in_progress":
         return isRTL ? "قيد التنفيذ" : "In Progress";
       case "pending":
         return isRTL ? "في الانتظار" : "Pending";
       default:
         return status;
     }
   };

   const getProposalStatusColor = (status: string) => {
     const normalizedStatus = status?.toLowerCase();
     switch (normalizedStatus) {
       case "accepted":
         return "bg-green-100 text-green-800";
       case "pending":
         return "bg-yellow-100 text-yellow-800";
       case "rejected":
         return "bg-red-100 text-red-800";
       case "withdrawn":
         return "bg-gray-100 text-gray-800";
       default:
         return "bg-gray-100 text-gray-800";
     }
   };

   const getProposalStatusText = (status: string) => {
     const normalizedStatus = status?.toLowerCase();
     switch (normalizedStatus) {
       case "accepted":
         return isRTL ? "مقبول" : "Accepted";
       case "pending":
         return isRTL ? "في الانتظار" : "Pending";
       case "rejected":
         return isRTL ? "مرفوض" : "Rejected";
       case "withdrawn":
         return isRTL ? "مسحوب" : "Withdrawn";
       default:
         return status;
     }
   };

   return (
     <DashboardShell isRTL={isRTL} onLanguageToggle={toggleLanguage}>
         {/* Dashboard Header */}
         <div className="mb-6">
           <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
             {isRTL ? "لوحة تحكم العميل" : "Client Dashboard"}
           </h1>
           <p className="text-muted-foreground">
             {isRTL 
               ? "مرحباً بك في لوحة التحكم الخاصة بك. تابع مشاريعك وإدارة المستقلين" 
               : "Welcome to your dashboard. Track your projects and manage freelancers"
             }
           </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
            {/* Sidebar with Stats and Quick Actions */}
            <div className="lg:col-span-1 space-y-3">
               {/* Stats Cards - Compact */}
               <div className="space-y-2">
                 {stats.map((stat, index) => (
                   <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                     <CardContent className="p-2">
                       <div className="flex items-center justify-between">
                         <div className="flex-1 min-w-0">
                           <p className="text-xs text-muted-foreground truncate">{stat.title}</p>
                           <p className="text-base font-bold text-[#0A2540]">{stat.value}</p>
                         </div>
                         <stat.icon className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>

               {/* Review Prompts */}
               <div className="hidden lg:block">
                 <ReviewPromptsList 
                   opportunities={pendingReviewsData?.content || []}
                   className=""
                 />
               </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {isRTL ? "إجراءات سريعة" : "Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-1">
                   <Link to="/create-project" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <Plus className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "مشروع جديد" : "New Project"}</span>
                     </div>
                   </Link>
                   <Link to="/freelancers" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <Search className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "البحث" : "Find Freelancers"}</span>
                     </div>
                   </Link>
                   <Link to="/my-projects" className="block">
                     <div className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted transition-colors cursor-pointer text-sm">
                       <Briefcase className="h-4 w-4 text-[#0A2540] flex-shrink-0" />
                       <span className="truncate text-xs">{isRTL ? "مشاريعي" : "My Projects"}</span>
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
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-3 space-y-8">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {isRTL ? "المشاريع الأخيرة" : "Recent Projects"}
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
             {loading ? (
               <div className="flex items-center justify-center py-8">
                 <Loader2 className="h-6 w-6 animate-spin text-[#0A2540]" />
                 <span className="ml-2">{isRTL ? "جاري التحميل..." : "Loading..."}</span>
               </div>
             ) : error ? (
               <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                 <AlertCircle className="h-5 w-5 text-red-600" />
                 <span className="text-red-700">{error}</span>
               </div>
              ) : recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {isRTL ? "لا توجد مشاريع حالياً" : "No projects yet"}
                  </p>
                  <Link to="/create-project">
                    <Button className="bg-[#0A2540] hover:bg-[#142b52] mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      {isRTL ? "إنشاء مشروع جديد" : "Create New Project"}
                    </Button>
                  </Link>
                </div>
              ) : (
                 <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors flex items-start justify-between gap-3">
                        <Link to={`/client/project/${project.id}`} className="block flex-1">
                           <div className="flex items-center gap-3 mb-2">
                             <h3 className="font-semibold text-[#0A2540]">{project.title}</h3>
                             <Badge className={cn("text-xs", getStatusColor(project.status))}>
                               {getStatusText(project.status)}
                             </Badge>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                             <span className="flex items-center gap-1">
                               <DollarSign className="h-4 w-4" />
                               {project.budget}
                             </span>
                             <span className="flex items-center gap-1">
                               <Clock className="h-4 w-4" />
                               {project.deadline}
                             </span>
                           </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {isRTL ? "المرحلة:" : "Stage:"}
                              </span>
                              <span className="text-xs font-medium text-[#0A2540] whitespace-nowrap">
                                {project.stageIndex + 1} / {STAGE_SEQUENCE.length}
                              </span>
                            </div>
                        </Link>
                        {project.status === 'completed' && (
                          <Link to={`/reviews/project/${project.id}`}>
                            <Button size="sm" variant="ghost" className="flex-shrink-0" title={isRTL ? "اترك تقييماً" : "Leave Review"}>
                              <Star className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                 </div>
              )}
           </CardContent>
         </Card>

             {/* Recent Received Proposals */}
             {isClient && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center justify-between">
                     <span className="flex items-center gap-2">
                       <FileText className="h-5 w-5" />
                       {isRTL ? "العروض المستلمة الأخيرة" : "Recent Received Proposals"}
                     </span>
                     <Link to="/proposals">
                       <Button variant="outline" size="sm">
                         <Eye className="h-4 w-4 mr-2" />
                         {isRTL ? "عرض الكل" : "View All"}
                       </Button>
                     </Link>
                   </CardTitle>
                   <CardDescription>
                     {isRTL ? "تتبع العروض المستلمة من المستقلين" : "Track proposals received from freelancers"}
                   </CardDescription>
                 </CardHeader>
                  <CardContent>
                    {proposalsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0A2540]" />
                        <span className="ml-2">{isRTL ? "جاري التحميل..." : "Loading..."}</span>
                      </div>
                    ) : !receivedProposalsData?.content || receivedProposalsData.content.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">
                          {isRTL ? "لا توجد عروض مستلمة حتى الآن" : "No proposals received yet"}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {isRTL ? "ستظهر العروض هنا عندما يقدمها المستقلون" : "Proposals will appear here when freelancers submit them"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {receivedProposalsData.content.slice(0, 5).map((proposal) => (
                          <Link key={proposal.id} to="/proposals" className="block">
                             <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                               <div className="flex items-center justify-between gap-3 mb-3">
                                 <h3 className="font-semibold text-sm text-[#0A2540] truncate flex-1">
                                   {proposal.projectTitle}
                                 </h3>
                                 <Badge className={cn("text-xs flex-shrink-0", getProposalStatusColor(proposal.status))}>
                                   {getProposalStatusText(proposal.status)}
                                 </Badge>
                               </div>
                               
                               <div className="flex items-start gap-4 mb-4">
                                 <Avatar className="h-12 w-12 flex-shrink-0">
                                   <AvatarImage 
                                     src={getAvatarUrl(proposal.freelancerAvatarUrl)} 
                                     alt={proposal.freelancerName}
                                   />
                                   <AvatarFallback className="bg-[#0A2540] text-white text-sm font-medium">
                                     {proposal.freelancerName.charAt(0).toUpperCase()}
                                   </AvatarFallback>
                                 </Avatar>
                                 <div className="flex-1 min-w-0">
                                   <p className="text-sm font-semibold text-[#0A2540] truncate">
                                     {proposal.freelancerName}
                                   </p>
                                   <p className="text-xs text-gray-500">
                                     {isRTL ? "المستقل المقترح" : "Freelancer"}
                                   </p>
                                 </div>
                               </div>
                               
                               <div className="border-t pt-3">
                                 <p className="text-xs font-semibold text-muted-foreground mb-2">
                                   {isRTL ? "تفاصيل العرض" : "Proposal Details"}
                                 </p>
                                 <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                   <span className="flex items-center gap-1">
                                     <DollarSign className="h-4 w-4" />
                                     ${proposal.proposedAmount}
                                   </span>
                                   <span className="flex items-center gap-1">
                                     <Clock className="h-4 w-4" />
                                     {proposal.estimatedDuration}
                                   </span>
                                   <span className="flex items-center gap-1">
                                     <Calendar className="h-4 w-4" />
                                     {new Date(proposal.submittedAt).toLocaleDateString()}
                                   </span>
                                 </div>
                               </div>
                             </div>
                           </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
               </Card>
             )}
           </div>
         </div>
     </DashboardShell>
   );
}
