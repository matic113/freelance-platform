import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useLocalization } from "@/hooks/useLocalization";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { projectService } from "@/services/project.service";
import { ProjectResponse, ProjectStatus } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Loader2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function MyProjects() {
   const { isRTL, toggleLanguage } = useLocalization();
   const { user } = useAuth();
   const [projects, setProjects] = useState<ProjectResponse[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'ALL'>('ALL');

   const {
     data: pendingReviewsData,
     isLoading: pendingReviewsLoading
   } = usePendingReviews(0, 100, true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectService.getMyProjects(0, 100);
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStagePercentage = (status: ProjectStatus): number => {
    const stageIndex = STAGE_SEQUENCE.indexOf(status);
    if (stageIndex === -1) return 0;
    return ((stageIndex + 1) / STAGE_SEQUENCE.length) * 100;
  };

  const getStatusStats = () => {
    return {
      draft: projects.filter(p => p.status === ProjectStatus.DRAFT).length,
      published: projects.filter(p => p.status === ProjectStatus.PUBLISHED).length,
      inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
      completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      cancelled: projects.filter(p => p.status === ProjectStatus.CANCELLED).length
    };
  };

  const stats = getStatusStats();

  const statsCards = [
    {
      title: isRTL ? "إجمالي المشاريع" : "Total Projects",
      value: projects.length.toString(),
      icon: Briefcase,
      color: "text-blue-600"
    },
    {
      title: isRTL ? "منشورة" : "Published",
      value: stats.published.toString(),
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: isRTL ? "قيد التنفيذ" : "In Progress",
      value: stats.inProgress.toString(),
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: isRTL ? "مكتملة" : "Completed",
      value: stats.completed.toString(),
      icon: MessageCircle,
      color: "text-emerald-600"
    }
  ];

  return (
    <DashboardShell isRTL={isRTL} onLanguageToggle={toggleLanguage}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
              {isRTL ? "مشاريعي" : "My Projects"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL 
                ? "إدارة وتتبع جميع مشاريعك" 
                : "Manage and track all your projects"
              }
            </p>
          </div>
          <Link to="/create-project">
            <Button className="bg-[#0A2540] hover:bg-[#142b52]">
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? "مشروع جديد" : "New Project"}
            </Button>
          </Link>
        </div>
      </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {statsCards.map((stat, index) => (
           <Card key={index} className="hover:shadow-md transition-shadow">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                   <p className="text-3xl font-bold text-[#0A2540]">{stat.value}</p>
                 </div>
                 <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
               </div>
             </CardContent>
           </Card>
         ))}
       </div>

       {/* Review Prompts Section */}
       <ReviewPromptsList 
         opportunities={pendingReviewsData?.content || []}
         className="mb-8"
       />

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? "ابحث في المشاريع..." : "Search projects..."}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'ALL' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('ALL')}
                className={filterStatus === 'ALL' ? 'bg-[#0A2540]' : ''}
              >
                {isRTL ? "الكل" : "All"}
              </Button>
              <Button
                variant={filterStatus === ProjectStatus.PUBLISHED ? 'default' : 'outline'}
                onClick={() => setFilterStatus(ProjectStatus.PUBLISHED)}
                className={filterStatus === ProjectStatus.PUBLISHED ? 'bg-[#0A2540]' : ''}
              >
                {isRTL ? "منشورة" : "Published"}
              </Button>
              <Button
                variant={filterStatus === ProjectStatus.IN_PROGRESS ? 'default' : 'outline'}
                onClick={() => setFilterStatus(ProjectStatus.IN_PROGRESS)}
                className={filterStatus === ProjectStatus.IN_PROGRESS ? 'bg-[#0A2540]' : ''}
              >
                {isRTL ? "قيد التنفيذ" : "In Progress"}
              </Button>
              <Button
                variant={filterStatus === ProjectStatus.COMPLETED ? 'default' : 'outline'}
                onClick={() => setFilterStatus(ProjectStatus.COMPLETED)}
                className={filterStatus === ProjectStatus.COMPLETED ? 'bg-[#0A2540]' : ''}
              >
                {isRTL ? "مكتملة" : "Completed"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? `المشاريع (${filteredProjects.length})` : `Projects (${filteredProjects.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#0A2540] mr-2" />
              <span>{isRTL ? "جاري التحميل..." : "Loading..."}</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">
                {isRTL ? "لا توجد مشاريع" : "No projects yet"}
              </p>
              <Link to="/create-project">
                <Button className="bg-[#0A2540] hover:bg-[#142b52]">
                  <Plus className="h-4 w-4 mr-2" />
                  {isRTL ? "إنشاء مشروع" : "Create Project"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const stage = PROJECT_STAGES[project.status];
                const stageIndex = STAGE_SEQUENCE.indexOf(project.status);
                const percentage = getStagePercentage(project.status);

                return (
                  <Link key={project.id} to={`/client/project/${project.id}`}>
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[#0A2540] truncate text-lg">
                              {project.title}
                            </h3>
                            <Badge className={cn("flex-shrink-0 text-xs font-medium", stage.bgColor, stage.color)}>
                              {stage.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>

                      {/* Stage Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted-foreground">
                            {isRTL ? "المرحلة:" : "Stage:"}
                          </span>
                          <span className="text-xs font-medium text-[#0A2540]">
                            {stageIndex + 1} / {STAGE_SEQUENCE.length}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {STAGE_SEQUENCE.map((status, idx) => (
                            <div
                              key={status}
                              className={cn(
                                "flex-1 h-2 rounded-full transition-colors",
                                idx < stageIndex + 1 ? PROJECT_STAGES[status].bgColor : "bg-gray-200"
                              )}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{isRTL ? "مسودة" : "Draft"}</span>
                          <span>{isRTL ? "منشور" : "Published"}</span>
                          <span>{isRTL ? "قيد التنفيذ" : "In Progress"}</span>
                          <span>{isRTL ? "مكتمل" : "Completed"}</span>
                        </div>
                      </div>

                      {/* Project Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${project.budgetMax.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {project.skillsRequired?.length || 0} {isRTL ? "مهارة" : "skills"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
