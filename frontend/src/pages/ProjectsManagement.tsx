import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  BarChart3,
  Briefcase,
  Eye,
  Play,
  CheckCircle,
  Square,
  FileText,
  Edit,
  Trash2,
  EyeOff,
  MoreVertical,
  Loader2,
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Tag,
  Users,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyProjects, useCreateProject, useUpdateProject, useDeleteProject, usePublishProject, useUnpublishProject } from '@/hooks/useProjects';
import { CreateProjectRequest, UpdateProjectRequest, ProjectResponse } from '@/types/api';
import { toast } from 'sonner';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { calculateProposalStats, calculateProjectMetrics, type ProposalStats } from '@/lib/project-analytics';
import { proposalService } from '@/services/proposal.service';
import { contractService } from '@/services/contract.service';
import { ContractResponse } from '@/types/contract';

export default function ProjectsManagementPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('projects');
  const [isBlockingUploads, setIsBlockingUploads] = useState(false);

  const handleUploadStart = () => {
    console.log('[ProjectsManagement] Uploads started - blocking navigation');
    setIsBlockingUploads(true);
  };

  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingTargetTab, setPendingTargetTab] = useState<string | null>(null);

  const confirmLeaveAndNavigate = (tab: string | null) => {
    setShowLeaveConfirm(false);
    setPendingTargetTab(null);
    if (tab) setActiveTab(tab);
  };

  const safeSetActiveTab = (tab: string) => {
    if (isBlockingUploads) {
      // Open modal to confirm leaving
      setPendingTargetTab(tab);
      setShowLeaveConfirm(true);
      console.log('[ProjectsManagement] Showing leave-confirm modal due to active uploads');
      return;
    }
    setActiveTab(tab);
  };
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectResponse | null>(null);
  const [proposalStats, setProposalStats] = useState<ProposalStats>({
    totalProposals: 0,
    acceptanceRate: 0,
    averageProposedAmount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    pendingCount: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [projectContracts, setProjectContracts] = useState<Record<string, ContractResponse[]>>({});
  const [loadingContracts, setLoadingContracts] = useState<Set<string>>(new Set());
  
  const { data: projectsData, isLoading: isLoadingProjects } = useMyProjects(0, 50, 'createdAt,desc');
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();
  const publishProjectMutation = usePublishProject();
  const unpublishProjectMutation = useUnpublishProject();

  const projects = projectsData?.content || [];

  // Load proposal statistics
  useEffect(() => {
    async function loadProposalStats() {
      setIsLoadingStats(true);
      try {
        const allProposals = await Promise.all(
          projects.map(project =>
            proposalService.getProposalsForProject(project.id, 0, 100).catch(() => ({ content: [] }))
          )
        );
        const flatProposals = allProposals.flatMap(p => p.content || []);
        setProposalStats(calculateProposalStats(flatProposals));
      } catch (error) {
        console.error('Error loading proposal stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    }

    if (projects.length > 0) {
      loadProposalStats();
    }
  }, [projects]);

  // Handle editing project from URL
  useEffect(() => {
    const projectId = location.state?.editProjectId;
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setEditingProject(project);
        safeSetActiveTab('create');
      } else {
        console.error('Project not found in state:', projectId);
        navigate('/projects-management'); // Redirect to projects list if not found
      }
    }
  }, [location.state, projects, navigate]);

  // Block window/tab close while uploads are in progress
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (isBlockingUploads) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    };

    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [isBlockingUploads]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PUBLISHED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      DRAFT: isRTL ? 'مسودة' : 'Draft',
      PUBLISHED: isRTL ? 'منشور' : 'Published',
      IN_PROGRESS: isRTL ? 'قيد التنفيذ' : 'In Progress',
      COMPLETED: isRTL ? 'مكتمل' : 'Completed',
      CANCELLED: isRTL ? 'ملغي' : 'Cancelled'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="h-4 w-4" />;
      case 'PUBLISHED':
        return <Eye className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <Square className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const metrics = calculateProjectMetrics(projects);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProjectMutation.mutateAsync(projectToDelete);
      toast.success(isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully');
      setShowDeleteDialog(false);
      setProjectToDelete(null);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || (isRTL ? 'حدث خطأ أثناء حذف المشروع' : 'Error deleting project');
      toast.error(errorMessage);
      console.error('Error deleting project:', error);
    }
  };

  const handleToggleExpand = async (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    
    if (newExpanded.has(projectId)) {
      // Collapse
      newExpanded.delete(projectId);
    } else {
      // Expand and fetch contracts
      newExpanded.add(projectId);
      
      // Only fetch if we haven't already
      if (!projectContracts[projectId]) {
        setLoadingContracts(prev => new Set(prev).add(projectId));
        try {
          const contractsData = await contractService.getMyContracts(0, 100);
          const projectContractsList = (contractsData.content || []).filter(
            c => c.projectId === projectId
          );
          setProjectContracts(prev => ({
            ...prev,
            [projectId]: projectContractsList
          }));
        } catch (error) {
          console.error('Error fetching contracts:', error);
          toast.error(isRTL ? 'خطأ في جلب العقود' : 'Error loading contracts');
        } finally {
          setLoadingContracts(prev => {
            const newSet = new Set(prev);
            newSet.delete(projectId);
            return newSet;
          });
        }
      }
    }
    
    setExpandedProjects(newExpanded);
  };

  const handlePublishProject = async (projectId: string) => {
    try {
      await publishProjectMutation.mutateAsync(projectId);
      toast.success(isRTL ? 'تم نشر المشروع بنجاح' : 'Project published successfully');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || (isRTL ? 'حدث خطأ أثناء نشر المشروع' : 'Error publishing project');
      toast.error(errorMessage);
      console.error('Error publishing project:', error);
    }
  };

  const handleUnpublishProject = async (projectId: string) => {
    try {
      await unpublishProjectMutation.mutateAsync(projectId);
      toast.success(isRTL ? 'تم إرجاع المشروع إلى مسودة بنجاح' : 'Project unpublished successfully');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || (isRTL ? 'حدث خطأ أثناء إرجاع المشروع' : 'Error unpublishing project');
      toast.error(errorMessage);
      console.error('Error unpublishing project:', error);
    }
  };

   const handleCreateProject = async (data: CreateProjectRequest | UpdateProjectRequest) => {
     if (editingProject) {
       const updated = await updateProjectMutation.mutateAsync({
         id: editingProject.id,
         data: data as UpdateProjectRequest
       });
       // Do not navigate away here. Let ProjectForm call onUploadComplete after uploads finish.
       toast.success(isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
       return { id: updated.id };
     } else {
       const created = await createProjectMutation.mutateAsync(data as CreateProjectRequest);
       // Do not navigate away here. Let ProjectForm call onUploadComplete after uploads finish.
       toast.success(isRTL ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully');
       return { id: created.id };
     }
   };

   const handleUploadComplete = () => {
     console.log('[ProjectsManagement] Uploads complete - clearing blocking state');
     setIsBlockingUploads(false);
     setEditingProject(null);
     safeSetActiveTab('projects');
   };

const handleEditProject = (project: ProjectResponse) => {
     setEditingProject(project);
     safeSetActiveTab('create');
   };

const handleCancelForm = () => {
     setEditingProject(null);
     safeSetActiveTab('projects');
   };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

       <main className="container mx-auto px-4 py-8">
         <div className="mb-8">
           <div className="flex items-center gap-4 mb-4">
             <Button
               variant="outline"
               size="sm"
               onClick={() => navigate('/client-dashboard')}
               className="flex items-center gap-2"
             >
               <ArrowLeft className="h-4 w-4" />
               {isRTL ? "العودة" : "Back"}
             </Button>
             <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540]">
               {isRTL ? "إدارة المشاريع" : "Project Management"}
             </h1>
           </div>
           <p className="text-muted-foreground">
             {isRTL 
               ? "إنشاء وإدارة مشاريعك مع تتبع حالة كل مشروع والعروض المقدمة" 
               : "Create and manage your projects with full analytics and proposal tracking"
             }
           </p>
         </div>

         {activeTab === 'create' ? (
<Tabs value={activeTab} onValueChange={safeSetActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="projects" onClick={() => safeSetActiveTab('projects')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {isRTL ? "المشاريع" : "Projects"}
                  </TabsTrigger>
                  <TabsTrigger value="create" onClick={() => safeSetActiveTab('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? (editingProject ? "تحديث" : "إنشاء جديد") : (editingProject ? "Update" : "Create New")}
                  </TabsTrigger>
                </TabsList>


                   {/* Create/Edit Tab */}
                   <TabsContent value="create" className="space-y-6">
                      <ProjectForm
                        isRTL={isRTL}
                        onSubmit={handleCreateProject}
                        onUploadStart={handleUploadStart}
                        onCancel={handleCancelForm}
                        initialProject={editingProject}
                        onUploadComplete={handleUploadComplete}
                      />
                   </TabsContent>
            </Tabs>
          ) : (
           <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              {/* Left Column - Statistics and Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                {/* Project Metrics */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-[#0A2540]">
                    {isRTL ? "إحصائيات المشاريع" : "Project Statistics"}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Briefcase className="h-6 w-6 text-gray-400 mb-2" />
                          <p className="text-xs font-medium text-gray-600">{isRTL ? "إجمالي" : "Total"}</p>
                          <p className="text-lg font-bold text-[#0A2540]">{metrics.totalProjects}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <FileText className="h-6 w-6 text-gray-400 mb-2" />
                          <p className="text-xs font-medium text-gray-600">{isRTL ? "مسودات" : "Drafts"}</p>
                          <p className="text-lg font-bold text-gray-600">{metrics.draftCount}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Eye className="h-6 w-6 text-blue-400 mb-2" />
                          <p className="text-xs font-medium text-gray-600">{isRTL ? "منشور" : "Published"}</p>
                          <p className="text-lg font-bold text-blue-600">{metrics.publishedCount}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Play className="h-6 w-6 text-yellow-400 mb-2" />
                          <p className="text-xs font-medium text-gray-600">{isRTL ? "قيد التنفيذ" : "In Progress"}</p>
                          <p className="text-lg font-bold text-yellow-600">{metrics.inProgressCount}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
                          <p className="text-xs font-medium text-gray-600">{isRTL ? "مكتملة" : "Completed"}</p>
                          <p className="text-lg font-bold text-green-600">{metrics.completedCount}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Proposal Analytics */}
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-[#0A2540]">
                    {isRTL ? "إحصائيات العروض" : "Proposal Analytics"}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-xs font-medium flex items-center gap-1">
                          <Users className="h-3 w-3 text-blue-600" />
                          {isRTL ? "العروض" : "Proposals"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        {isLoadingStats ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <div>
                            <p className="text-lg font-bold text-[#0A2540]">{proposalStats.totalProposals}</p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? "مقبول" : "accepted"}: {proposalStats.acceptedCount}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-xs font-medium flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          {isRTL ? "معدل" : "Rate"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        {isLoadingStats ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <div>
                            <p className="text-lg font-bold text-green-600">{proposalStats.acceptanceRate}%</p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? "قبول" : "acceptance"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-xs font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-purple-600" />
                          {isRTL ? "متوسط" : "Avg"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        {isLoadingStats ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <div>
                            <p className="text-lg font-bold text-purple-600">${proposalStats.averageProposedAmount}</p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? "المبلغ" : "amount"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-1">
                        <CardTitle className="text-xs font-medium flex items-center gap-1">
                          <Target className="h-3 w-3 text-orange-600" />
                          {isRTL ? "انتظار" : "Pending"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        {isLoadingStats ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <div>
                            <p className="text-lg font-bold text-orange-600">{proposalStats.pendingCount}</p>
                            <p className="text-xs text-gray-500">
                              {isRTL ? "مراجعة" : "review"}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

               {/* Quick Actions */}
               <Card>
                 <CardHeader>
                   <CardTitle>{isRTL ? "إجراءات سريعة" : "Quick Actions"}</CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col gap-2">
<Button onClick={() => safeSetActiveTab('create')} className="bg-[#0A2540] hover:bg-[#142b52] w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      {isRTL ? "مشروع جديد" : "New Project"}
                    </Button>
                 </CardContent>
               </Card>
             </div>

              {/* Right Column - Projects and Create New */}
              <div className="lg:col-span-5 space-y-6">
                <Tabs value={activeTab} onValueChange={safeSetActiveTab} defaultValue="projects">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="projects">
                      <FileText className="h-4 w-4 mr-2" />
                      {isRTL ? "المشاريع" : "Projects"}
                    </TabsTrigger>
                    <TabsTrigger value="create">
                      <Plus className="h-4 w-4 mr-2" />
                      {isRTL ? (editingProject ? "تحديث" : "إنشاء جديد") : (editingProject ? "Update" : "Create New")}
                    </TabsTrigger>
                  </TabsList>

                  {/* Projects Tab */}
                  <TabsContent value="projects" className="space-y-6">
                   {isLoadingProjects ? (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                          <p className="text-gray-600">{isRTL ? "جاري تحميل المشاريع..." : "Loading projects..."}</p>
                        </CardContent>
                      </Card>
                    ) : projects.length === 0 ? (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                         <h3 className="text-lg font-medium text-gray-900 mb-2">
                           {isRTL ? "لا توجد مشاريع بعد" : "No projects yet"}
                         </h3>
                         <p className="text-gray-500 mb-4">
                           {isRTL ? "ابدأ بإنشاء أول مشروع لك" : "Start by creating your first project"}
                         </p>
<Button onClick={() => safeSetActiveTab('create')} className="bg-[#0A2540] hover:bg-[#142b52]">
                            <Plus className="h-4 w-4 mr-2" />
                            {isRTL ? "إنشاء مشروع" : "Create Project"}
                          </Button>
                       </CardContent>
                     </Card>
                   ) : (
                     <div className="space-y-4">
                       {projects.map((project) => (
                         <Card key={project.id} className="hover:shadow-md transition-shadow">
                           <CardContent className="p-6">
                             <div className="flex items-start justify-between mb-4">
                               <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-2">
                                   <h3 className="text-lg font-semibold text-[#0A2540]">
                                     {project.title}
                                   </h3>
                                   <Badge className={getStatusColor(project.status)}>
                                     <div className="flex items-center gap-1">
                                       {getStatusIcon(project.status)}
                                       {getStatusText(project.status)}
                                     </div>
                                   </Badge>
                                 </div>
                                 <p className="text-gray-600 mb-3 line-clamp-2">
                                   {project.description}
                                 </p>
                                 <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                                   <div className="flex items-center gap-1">
                                     <DollarSign className="h-4 w-4" />
                                     {project.budgetMin} - {project.budgetMax} {project.currency}
                                   </div>
                                   <div className="flex items-center gap-1">
                                     <Tag className="h-4 w-4" />
                                     {project.category}
                                   </div>
                                   <div className="flex items-center gap-1">
                                     <Calendar className="h-4 w-4" />
                                     {new Date(project.deadline).toLocaleDateString()}
                                   </div>
                                 </div>
                               </div>
                             </div>

                             <div className="flex flex-wrap gap-2 mb-4">
                               {project.skillsRequired.map((skill, index) => (
                                 <Badge key={index} variant="outline" className="text-xs">
                                   {skill}
                                 </Badge>
                               ))}
                             </div>

                             <div className="flex items-center gap-2 flex-wrap">
                               {project.status === 'DRAFT' && (
                                 <>
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => handleEditProject(project)}
                                   >
                                     <Edit className="h-4 w-4 mr-1" />
                                     {isRTL ? "تحرير" : "Edit"}
                                   </Button>
                                   <Button
                                     size="sm"
                                     variant="default"
                                     className="bg-green-600 hover:bg-green-700"
                                     onClick={() => handlePublishProject(project.id)}
                                     disabled={publishProjectMutation.isPending}
                                   >
                                     {publishProjectMutation.isPending ? (
                                       <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                     ) : (
                                       <Eye className="h-4 w-4 mr-1" />
                                     )}
                                     {isRTL ? "نشر" : "Publish"}
                                   </Button>
                                   <Button
                                     size="sm"
                                     variant="destructive"
                                     onClick={() => {
                                       setProjectToDelete(project.id);
                                       setShowDeleteDialog(true);
                                     }}
                                   >
                                     <Trash2 className="h-4 w-4 mr-1" />
                                     {isRTL ? "حذف" : "Delete"}
                                   </Button>
                                 </>
                               )}
                               {project.status === 'PUBLISHED' && (
                                 <>
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => handleUnpublishProject(project.id)}
                                     disabled={unpublishProjectMutation.isPending}
                                   >
                                     {unpublishProjectMutation.isPending ? (
                                       <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                     ) : (
                                       <EyeOff className="h-4 w-4 mr-1" />
                                     )}
                                     {isRTL ? "إرجاع" : "Unpublish"}
                                   </Button>
                                   <Badge variant="secondary">
                                     {isRTL ? "يمكن للعاملين تقديم عروضهم" : "Awaiting proposals"}
                                   </Badge>
                                 </>
                               )}
                               {project.status === 'IN_PROGRESS' && (
                                 <Badge variant="secondary">
                                   {isRTL ? "قيد التنفيذ من قبل متخصص" : "Assigned to freelancer"}
                                 </Badge>
                               )}
                               
                               <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => handleToggleExpand(project.id)}
                                 className="ml-auto"
                               >
                                 <ChevronDown className={cn("h-4 w-4 transition-transform", expandedProjects.has(project.id) && "rotate-180")} />
                                 {isRTL ? "المراحل" : "Milestones"}
                               </Button>
                             </div>

                             {expandedProjects.has(project.id) && (
                               <div className="mt-6 pt-6 border-t">
                                 {loadingContracts.has(project.id) ? (
                                   <div className="flex items-center justify-center py-4">
                                     <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                                     <span className="text-sm text-gray-500">{isRTL ? "جاري تحميل المراحل..." : "Loading milestones..."}</span>
                                   </div>
                                 ) : projectContracts[project.id] && projectContracts[project.id].length > 0 ? (
                                   <div className="space-y-3">
                                     <h4 className="font-semibold text-sm text-gray-900 mb-3">
                                       {isRTL ? "المراحل المرتبطة" : "Associated Milestones"}
                                     </h4>
                                     {projectContracts[project.id].map((contract) => (
                                       <div key={contract.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                         <div className="flex items-start justify-between">
                                           <div>
                                             <p className="font-medium text-sm text-gray-900">{contract.title}</p>
                                             <p className="text-xs text-gray-600">{isRTL ? "العقد:" : "Contract:"} {contract.projectTitle}</p>
                                           </div>
                                           <Badge variant="outline" className="text-xs capitalize">
                                             {contract.status}
                                           </Badge>
                                         </div>
                                         {contract.milestones && contract.milestones.length > 0 ? (
                                           <div className="space-y-2 mt-2">
                                             {contract.milestones.map((milestone) => (
                                               <div key={milestone.id} className="flex items-center gap-2 bg-white rounded p-2 text-xs">
                                                 <div className="flex-1">
                                                   <p className="font-medium text-gray-900">{milestone.title}</p>
                                                   <p className="text-gray-600">{isRTL ? "المبلغ:" : "Amount:"} {contract.currency} {milestone.amount}</p>
                                                   <p className="text-gray-500">{isRTL ? "الموعد:" : "Due:"} {new Date(milestone.dueDate).toLocaleDateString()}</p>
                                                 </div>
                                                 <Badge variant={milestone.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-xs">
                                                   {milestone.status}
                                                 </Badge>
                                               </div>
                                             ))}
                                           </div>
                                         ) : (
                                           <p className="text-xs text-gray-500 mt-2">{isRTL ? "لا توجد مراحل" : "No milestones"}</p>
                                         )}
                                       </div>
                                     ))}
                                   </div>
                                 ) : (
                                   <p className="text-sm text-gray-500">{isRTL ? "لا توجد عقود أو مراحل لهذا المشروع" : "No contracts or milestones for this project"}</p>
                                 )}
                               </div>
                             )}
                           </CardContent>
                         </Card>
                       ))}
                     </div>
                    )}
                  </TabsContent>

                   {/* Create/Edit Tab */}
                   <TabsContent value="create" className="space-y-6">
                      <ProjectForm
                        isRTL={isRTL}
                        onSubmit={handleCreateProject}
                        onUploadStart={handleUploadStart}
                        onCancel={handleCancelForm}
                        initialProject={editingProject}
                        onUploadComplete={handleUploadComplete}
                      />
                   </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

        {/* Delete Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                {isRTL 
                  ? "هل أنت متأكد من أنك تريد حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء."
                  : "Are you sure you want to delete this project? This action cannot be undone."
                }
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteProject}
                  disabled={deleteProjectMutation.isPending}
                >
                  {deleteProjectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : null}
                  {isRTL ? "حذف" : "Delete"}
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Leave Confirm Dialog (shown when uploads are in progress and user attempts navigation) */}
        <Dialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? 'عمليات تحميل جارية' : 'Uploads in progress'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                {isRTL ? 'هناك عمليات تحميل جارية. هل تريد المتابعة والمغادرة؟' : 'There are uploads in progress. Do you want to leave anyway?'}
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setShowLeaveConfirm(false); setPendingTargetTab(null); }}>
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button onClick={() => confirmLeaveAndNavigate(pendingTargetTab)} className="bg-[#0A2540] hover:bg-[#142b52]">
                  {isRTL ? 'مغادرة' : 'Leave'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}
