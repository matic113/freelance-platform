import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  X,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Save,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  Square,
  MoreVertical,
  Copy,
  Share,
  Users,
  Loader2,
  Briefcase,
  EyeOff
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMyProjects, useCreateProject, useUpdateProject, useDeleteProject, usePublishProject, useUnpublishProject } from '@/hooks/useProjects';
import { CreateProjectRequest, UpdateProjectRequest, ProjectType, ProjectResponse } from '@/types/api';
import { toast } from 'sonner';
import { FileUploadInput } from '@/components/FileUploadInput';
import { AttachmentList, AttachmentItem } from '@/components/AttachmentList';
import { projectService } from '@/services/project.service';
import { presignedUploadService, fileUploadService, type CompleteUploadRequest } from '@/services/fileUpload.service';

export default function CreateProjectPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('create');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    projectType: ProjectType.FIXED,
    duration: '',
    deadline: '',
    skillsRequired: [] as string[],
  });
  
   const [newSkill, setNewSkill] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
   const [pendingFiles, setPendingFiles] = useState<File[]>([]);
   const [isUploadingFile, setIsUploadingFile] = useState(false);

   const { data: projectsData, isLoading: isLoadingProjects } = useMyProjects(0, 50, 'createdAt,desc');
   const createProjectMutation = useCreateProject();
   const updateProjectMutation = useUpdateProject();
   const deleteProjectMutation = useDeleteProject();
   const publishProjectMutation = usePublishProject();
   const unpublishProjectMutation = useUnpublishProject();

  const projects = projectsData?.content || [];

  const categories = [
    { value: 'web-development', label: isRTL ? 'تطوير الويب' : 'Web Development' },
    { value: 'mobile-development', label: isRTL ? 'تطوير الجوال' : 'Mobile Development' },
    { value: 'ui-ux', label: isRTL ? 'تصميم UI/UX' : 'UI/UX Design' },
    { value: 'graphic-design', label: isRTL ? 'التصميم الجرافيكي' : 'Graphic Design' },
    { value: 'content-writing', label: isRTL ? 'كتابة المحتوى' : 'Content Writing' },
    { value: 'seo', label: isRTL ? 'تحسين محركات البحث' : 'SEO' },
    { value: 'marketing', label: isRTL ? 'التسويق الرقمي' : 'Digital Marketing' },
    { value: 'other', label: isRTL ? 'أخرى' : 'Other' },
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'SAR', label: 'SAR (﷼)' },
    { value: 'AED', label: 'AED (د.إ)' },
  ];

  const projectTypes = [
    { value: ProjectType.FIXED, label: isRTL ? 'سعر ثابت' : 'Fixed Price' },
    { value: ProjectType.HOURLY, label: isRTL ? 'بالساعة' : 'Hourly' }
  ];

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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

   const handleFileSelect = async (file: File) => {
     if (!editingProjectId) {
       setPendingFiles(prev => [...prev, file]);
       toast.success(isRTL ? `تمت إضافة ${file.name} - سيتم رفعه بعد إنشاء المشروع` : `${file.name} added - will upload after project creation`);
       return;
     }

     if (!fileUploadService.validateFileSize(file, 20)) {
       toast.error(isRTL ? 'حجم الملف كبير جداً' : 'File size exceeds limit');
       return;
     }

     await uploadSingleFile(file, editingProjectId);
   };

   const uploadSingleFile = async (file: File, projectId: string) => {
     setIsUploadingFile(true);
     try {
       const presignedResponse = await presignedUploadService.getPresignedUploadUrl(
         projectId,
         file.name,
         'files'
       );

       await presignedUploadService.uploadToPresignedUrl(
         presignedResponse.uploadUrl,
         file
       );

       const completeRequest: CompleteUploadRequest = {
         objectName: presignedResponse.objectName,
         filename: presignedResponse.filename,
         fileSize: file.size,
         contentType: file.type || 'application/octet-stream',
         folder: 'files',
       };

       const projectResponse = await presignedUploadService.completeUpload(
         projectId,
         completeRequest
       );

       if (projectResponse.attachments && projectResponse.attachments.length > 0) {
         setAttachments(projectResponse.attachments.map((att: any) => ({
           id: att.id,
           filename: att.fileName,
           url: att.fileUrl,
           size: att.fileSize,
           type: att.fileType,
         })));
       }

       toast.success(isRTL ? 'تم تحميل الملف بنجاح' : `File ${file.name} uploaded successfully`);
     } catch (error) {
       console.error('Error uploading file:', error);
       const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
       toast.error(isRTL ? `خطأ: ${errorMessage}` : `Error: ${errorMessage}`);
       throw error;
     } finally {
       setIsUploadingFile(false);
     }
   };

  const handleRemoveAttachment = async (filename: string) => {
    const pendingFile = pendingFiles.find(f => f.name === filename);
    if (pendingFile) {
      setPendingFiles(prev => prev.filter(f => f.name !== filename));
      toast.success(isRTL ? 'تم إزالة الملف' : 'File removed');
      return;
    }
    
    setAttachments(prev => prev.filter(att => att.filename !== filename));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return isRTL ? 'العنوان مطلوب' : 'Title is required';
    if (formData.title.length < 5) return isRTL ? 'العنوان يجب أن يكون 5 أحرف على الأقل' : 'Title must be at least 5 characters';
    if (!formData.description.trim()) return isRTL ? 'الوصف مطلوب' : 'Description is required';
    if (formData.description.length < 50) return isRTL ? 'الوصف يجب أن يكون 50 حرفاً على الأقل' : 'Description must be at least 50 characters';
    if (!formData.category) return isRTL ? 'الفئة مطلوبة' : 'Category is required';
    if (!formData.budgetMin) return isRTL ? 'الحد الأدنى للميزانية مطلوب' : 'Minimum budget is required';
    if (!formData.budgetMax) return isRTL ? 'الحد الأقصى للميزانية مطلوب' : 'Maximum budget is required';
    if (parseFloat(formData.budgetMin) <= 0) return isRTL ? 'الحد الأدنى للميزانية يجب أن يكون أكثر من 0' : 'Minimum budget must be greater than 0';
    if (parseFloat(formData.budgetMax) <= 0) return isRTL ? 'الحد الأقصى للميزانية يجب أن يكون أكثر من 0' : 'Maximum budget must be greater than 0';
    if (parseFloat(formData.budgetMin) > parseFloat(formData.budgetMax)) return isRTL ? 'الحد الأدنى لا يمكن أن يكون أكبر من الحد الأقصى' : 'Minimum budget cannot be greater than maximum';
    if (formData.skillsRequired.length === 0) return isRTL ? 'يجب تحديد مهارة واحدة على الأقل' : 'At least one skill is required';
    if (!formData.deadline) return isRTL ? 'الموعد النهائي مطلوب' : 'Deadline is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: CreateProjectRequest = {
         title: formData.title,
         description: formData.description,
         category: formData.category,
         skillsRequired: formData.skillsRequired,
         budgetMin: parseFloat(formData.budgetMin),
         budgetMax: parseFloat(formData.budgetMax),
         currency: formData.currency,
         projectType: formData.projectType as ProjectType,
         duration: formData.duration,
         deadline: formData.deadline,
       };

      let createdProjectId: string | null = null;
      if (editingProjectId) {
        const updated = await updateProjectMutation.mutateAsync({
          id: editingProjectId,
          data: requestData as UpdateProjectRequest
        });
        createdProjectId = updated.id;
        toast.success(isRTL ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
      } else {
        const created = await createProjectMutation.mutateAsync(requestData);
       createdProjectId = created.id;
         setEditingProjectId(createdProjectId);
         toast.success(isRTL ? 'تم إنشاء المشروع بنجاح' : 'Project created successfully');
         
         if (pendingFiles.length > 0) {
           toast.info(isRTL ? `جاري رفع ${pendingFiles.length} ملف...` : `Uploading ${pendingFiles.length} file(s)...`);
           for (const file of pendingFiles) {
             try {
               await uploadSingleFile(file, createdProjectId);
             } catch (error) {
               console.error('Failed to upload file:', file.name, error);
             }
           }
           setPendingFiles([]);
           toast.success(isRTL ? 'تم رفع جميع الملفات' : 'All files uploaded successfully');
         }
       }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || (isRTL ? 'حدث خطأ أثناء إنشاء المشروع' : 'Error creating project');
      toast.error(errorMessage);
      console.error('Error creating/updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleEditProject = (project: ProjectResponse) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      budgetMin: project.budgetMin.toString(),
      budgetMax: project.budgetMax.toString(),
      currency: project.currency,
      projectType: project.projectType as ProjectType,
      duration: project.duration,
      deadline: project.deadline,
      skillsRequired: project.skillsRequired,
    });
    // Load existing attachments
    if (project.attachments && project.attachments.length > 0) {
      setAttachments(project.attachments.map(att => ({
        id: att.id,
        filename: att.fileName,
        url: att.fileUrl,
        size: att.fileSize,
        type: att.fileType,
      })));
    } else {
      setAttachments([]);
    }
    setEditingProjectId(project.id);
    setActiveTab('create');
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      budgetMin: '',
      budgetMax: '',
      currency: 'USD',
      projectType: ProjectType.FIXED,
      duration: '',
      deadline: '',
      skillsRequired: [],
    });
    setAttachments([]);
    setPendingFiles([]);
    setEditingProjectId(null);
    navigate('/client-dashboard');
  };

  const getProjectStats = () => {
    const total = projects.length;
    const draft = projects.filter(p => p.status === 'DRAFT').length;
    const published = projects.filter(p => p.status === 'PUBLISHED').length;
    const inProgress = projects.filter(p => p.status === 'IN_PROGRESS').length;
    
    return { total, draft, published, inProgress };
  };

  const stats = getProjectStats();

  useEffect(() => {
    const state = location.state as { editProjectId?: string } | null;
    if (state?.editProjectId) {
      setEditingProjectId(state.editProjectId);
      setActiveTab('create');
      
      // Find and load the project data
      const projectToEdit = projects.find(p => p.id === state.editProjectId);
      if (projectToEdit) {
        // Trigger edit - the existing handleEditProject function will load the data
        // We can manually call the logic here
        setFormData({
          title: projectToEdit.title,
          description: projectToEdit.description,
          category: projectToEdit.category,
          budgetMin: projectToEdit.budgetMin.toString(),
          budgetMax: projectToEdit.budgetMax.toString(),
          currency: projectToEdit.currency,
          projectType: projectToEdit.projectType as ProjectType,
          duration: projectToEdit.duration,
          deadline: projectToEdit.deadline,
          skillsRequired: projectToEdit.skillsRequired,
        });
        if (projectToEdit.attachments && projectToEdit.attachments.length > 0) {
          setAttachments(projectToEdit.attachments.map(att => ({
            id: att.id,
            filename: att.fileName,
            url: att.fileUrl,
            size: att.fileSize,
            type: att.fileType,
          })));
        }
      }
    }
  }, [location.state, projects]);

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
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
              ? "إنشاء وإدارة مشاريعك مع تتبع حالة كل مشروع" 
              : "Create and manage your projects with status tracking for each project"
            }
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="create">
              <Plus className="h-4 w-4 mr-2" />
              {isRTL ? (editingProjectId ? "تحديث المشروع" : "إنشاء مشروع") : (editingProjectId ? "Update Project" : "Create Project")}
            </TabsTrigger>
            <TabsTrigger value="manage">
              <FileText className="h-4 w-4 mr-2" />
              {isRTL ? "إدارة المشاريع" : "Manage Projects"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {isRTL ? (editingProjectId ? "تحديث المشروع" : "إنشاء مشروع جديد") : (editingProjectId ? "Update Project" : "Create New Project")}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "املأ التفاصيل أدناه لإنشاء أو تحديث مشروع" : "Fill in the details below to create or update a project"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{isRTL ? "عنوان المشروع" : "Project Title"} *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder={isRTL ? "أدخل عنوان المشروع..." : "Enter project title..."}
                        required
                      />
                      <p className="text-xs text-gray-500">{formData.title.length}/200</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">{isRTL ? "فئة المشروع" : "Project Category"} *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={isRTL ? "اختر الفئة..." : "Select category..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{isRTL ? "وصف المشروع" : "Project Description"} *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder={isRTL ? "أدخل وصف مفصل للمشروع (50-5000 حرف)..." : "Enter detailed project description (50-5000 characters)..."}
                      rows={5}
                      required
                    />
                    <p className="text-xs text-gray-500">{formData.description.length}/5000</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetMin">{isRTL ? "الحد الأدنى للميزانية" : "Minimum Budget"} *</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                        placeholder={isRTL ? "مثال: 500" : "e.g., 500"}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetMax">{isRTL ? "الحد الأقصى للميزانية" : "Maximum Budget"} *</Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                        placeholder={isRTL ? "مثال: 5000" : "e.g., 5000"}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">{isRTL ? "العملة" : "Currency"}</Label>
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectType">{isRTL ? "نوع المشروع" : "Project Type"} *</Label>
                      <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">{isRTL ? "الموعد النهائي" : "Deadline"} *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">{isRTL ? "المدة" : "Duration"}</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder={isRTL ? "مثال: 2-3 أسابيع" : "e.g., 2-3 weeks"}
                      maxLength={100}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skills Column */}
                    <div className="space-y-4">
                      <Label>{isRTL ? "المهارات المطلوبة" : "Required Skills"} *</Label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.skillsRequired.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                            {skill}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => handleRemoveSkill(skill)}
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder={isRTL ? "أدخل مهارة جديدة..." : "Enter new skill..."}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        />
                        <Button type="button" onClick={handleAddSkill} variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Attachments Column */}
                     <div className="space-y-4 flex flex-col">
                       <Label>{isRTL ? "المرفقات" : "Attachments"}</Label>
                       <div className={cn("border-2 border-dashed rounded-lg min-h-[200px] relative", isRTL && "rtl")}>
                         <FileUploadInput
                           onFileSelect={handleFileSelect}
                           isUploading={isUploadingFile}
                           disabled={false}
                           maxFileSizeMB={20}
                           acceptedFileTypes=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                           fullArea={true}
                           allowMultiple={true}
                         />
                       </div>
                       {!editingProjectId && pendingFiles.length > 0 && (
                         <p className="text-xs text-muted-foreground">
                           {isRTL ? `${pendingFiles.length} ملف جاهز للرفع بعد إنشاء المشروع` : `${pendingFiles.length} file(s) ready to upload after project creation`}
                         </p>
                       )}
                     </div>
                  </div>

                  {(attachments.length > 0 || pendingFiles.length > 0) && (
                    <div className={cn("mt-6", isRTL && "rtl")}>
                      <p className="text-sm font-medium mb-4 text-muted-foreground">
                        {isRTL ? "المرفقات" : "Attachments"} ({attachments.length + pendingFiles.length})
                      </p>
                      <AttachmentList
                        attachments={[
                          ...attachments,
                          ...pendingFiles.map((file, idx) => ({
                            id: `pending-${idx}`,
                            filename: file.name,
                            url: '',
                            size: file.size,
                            type: file.type,
                          }))
                        ]}
                        onRemove={handleRemoveAttachment}
                        isRTL={isRTL}
                        canRemove={true}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-[#0A2540] hover:bg-[#142b52]" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {isRTL ? "جاري الإرسال..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isRTL ? (editingProjectId ? "تحديث المشروع" : "إنشاء المشروع") : (editingProjectId ? "Update Project" : "Create Project")}
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      {isRTL ? "إلغاء" : "Cancel"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "إجمالي المشاريع" : "Total Projects"}
                      </p>
                      <p className="text-2xl font-bold text-[#0A2540]">{stats.total}</p>
                    </div>
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "مسودات" : "Drafts"}
                      </p>
                      <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                    </div>
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "منشور" : "Published"}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {isRTL ? "قيد التنفيذ" : "In Progress"}
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                    </div>
                    <Play className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  <Button onClick={() => setActiveTab('create')} className="bg-[#0A2540] hover:bg-[#142b52]">
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

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
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}