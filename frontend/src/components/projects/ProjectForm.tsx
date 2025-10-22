import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { CreateProjectRequest, UpdateProjectRequest, ProjectType, ProjectResponse } from '@/types/api';
import { toast } from 'sonner';
import { FileUploadInput } from '@/components/FileUploadInput';
import { AttachmentList, AttachmentItem } from '@/components/AttachmentList';
import { presignedUploadService, fileUploadService, type CompleteUploadRequest } from '@/services/fileUpload.service';
import { projectService } from '@/services/project.service';

interface ProjectFormProps {
  isRTL: boolean;
  onSubmit: (data: CreateProjectRequest | UpdateProjectRequest) => Promise<{ id: string }>;
  onCancel: () => void;
  initialProject?: ProjectResponse | null;
  isLoading?: boolean;
}

type DraftAttachment = {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
};

export function ProjectForm({
  isRTL,
  onSubmit,
  onCancel,
  initialProject,
  isLoading = false,
}: ProjectFormProps) {
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
  const [draftAttachments, setDraftAttachments] = useState<DraftAttachment[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map());
  const [pendingFiles, setPendingFiles] = useState<Map<string, File>>(new Map());

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

  useEffect(() => {
    if (initialProject) {
      setFormData({
        title: initialProject.title,
        description: initialProject.description,
        category: initialProject.category,
        budgetMin: initialProject.budgetMin.toString(),
        budgetMax: initialProject.budgetMax.toString(),
        currency: initialProject.currency,
        projectType: initialProject.projectType as ProjectType,
        duration: initialProject.duration,
        deadline: initialProject.deadline,
        skillsRequired: initialProject.skillsRequired,
      });
      
      if (initialProject.attachments && initialProject.attachments.length > 0) {
        setAttachments(initialProject.attachments.map(att => ({
          id: att.id,
          filename: att.fileName,
          url: att.fileUrl,
          size: att.fileSize,
          type: att.fileType,
        })));
      }
    }
  }, [initialProject]);

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
    console.log('[ProjectForm] File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    if (!fileUploadService.validateFileSize(file, 20)) {
      toast.error(isRTL ? 'حجم الملف كبير جداً' : 'File size exceeds limit');
      return;
    }

    setUploadingFiles(prev => new Map(prev).set(file.name, 0));

    try {
      if (initialProject?.id) {
        console.log('[ProjectForm] Existing project - uploading directly');
        // Existing project - upload directly
        const attachment = await projectService.addAttachment(initialProject.id, file);
        setAttachments(prev => {
          const filtered = prev.filter(att => att.id !== attachment.id);
          return [
            ...filtered,
            {
              id: attachment.id,
              filename: attachment.fileName,
              url: attachment.fileUrl,
              size: attachment.fileSize,
              type: attachment.fileType,
            },
          ];
        });
        toast.success(isRTL ? `✓ ${file.name}` : `✓ ${file.name}`);
      } else {
        console.log('[ProjectForm] New project - storing file in pendingFiles');
        // New project - store file and metadata for batch upload after project creation
        setPendingFiles(prev => {
          const newMap = new Map(prev).set(file.name, file);
          console.log('[ProjectForm] pendingFiles updated. Total files:', newMap.size);
          return newMap;
        });
        setDraftAttachments(prev => {
          const newList = [...prev, {
            fileName: file.name,
            fileUrl: '',  // Will be populated after presigned upload
            fileSize: file.size,
            fileType: file.type || 'application/octet-stream',
          }];
          console.log('[ProjectForm] draftAttachments updated. Total attachments:', newList.length);
          return newList;
        });
        toast.success(isRTL ? `✓ ${file.name}` : `✓ ${file.name}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(isRTL ? `خطأ: ${file.name}` : `Error: ${file.name}`);
    } finally {
      setUploadingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(file.name);
        return newMap;
      });
    }
  };

  const uploadSingleFile = async (file: File, projectId: string) => {
    try {
      const attachment = await projectService.addAttachment(projectId, file);

      setAttachments(prev => {
        const filtered = prev.filter(att => att.id !== attachment.id);
        return [
          ...filtered,
          {
            id: attachment.id,
            filename: attachment.fileName,
            url: attachment.fileUrl,
            size: attachment.fileSize,
            type: attachment.fileType,
          },
        ];
      });

      setUploadingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(file.name);
        return newMap;
      });

      toast.success(isRTL ? `✓ ${file.name}` : `✓ ${file.name}`);
      return attachment;
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(file.name);
        return newMap;
      });
      toast.error(isRTL ? `خطأ: ${file.name}` : `Error: ${file.name}`);
      return null;
    }
  };

  const uploadPendingFilesToProject = async (projectId: string): Promise<void> => {
    console.log('[uploadPendingFilesToProject] Started with projectId:', projectId, 'Pending files:', pendingFiles.size);
    
    if (pendingFiles.size === 0) {
      console.log('[uploadPendingFilesToProject] No pending files, returning early');
      return;
    }

    try {
      // Get all filenames from pending files
      const filenames = Array.from(pendingFiles.keys());
      console.log('[uploadPendingFilesToProject] Requesting batch presigned URLs for files:', filenames);

      // Request batch presigned URLs from backend
      const presignedResponses = await presignedUploadService.getPresignedUploadUrlsBatch(
        projectId,
        filenames,
        'files'
      );
      console.log('[uploadPendingFilesToProject] Received presigned URLs:', presignedResponses.length);

      // Upload all files in parallel to their presigned URLs
      const uploadPromises = presignedResponses.map(async (presignedResponse) => {
        const file = pendingFiles.get(presignedResponse.filename);
        if (!file) {
          console.error(`File not found: ${presignedResponse.filename}`);
          return null;
        }

        try {
          console.log('[uploadPendingFilesToProject] Uploading file to presigned URL:', presignedResponse.filename);
          await presignedUploadService.uploadToPresignedUrl(presignedResponse.uploadUrl, file);
          
          // Get the object name from the presigned response
          const objectName = presignedResponse.objectName;
          console.log('[uploadPendingFilesToProject] File uploaded. Object name:', objectName);
          
          // Register the uploaded file as a project attachment
          console.log('[uploadPendingFilesToProject] Registering attachment:', presignedResponse.filename);
          await projectService.completeFileUpload(
            projectId,
            objectName,
            presignedResponse.filename,
            file.size,
            file.type || 'application/octet-stream'
          );
          console.log('[uploadPendingFilesToProject] Attachment registered successfully');
          
          // Update draft attachments to reflect successful upload
          setDraftAttachments(prev =>
            prev.map(att =>
              att.fileName === presignedResponse.filename
                ? { ...att, fileUrl: objectName }
                : att
            )
          );

          toast.success(isRTL ? `✓ ${presignedResponse.filename}` : `✓ ${presignedResponse.filename}`);
          return presignedResponse.filename;
        } catch (error) {
          console.error(`Error uploading ${presignedResponse.filename}:`, error);
          toast.error(isRTL ? `خطأ: ${presignedResponse.filename}` : `Error: ${presignedResponse.filename}`);
          return null;
        }
      });

      await Promise.all(uploadPromises);
      console.log('[uploadPendingFilesToProject] All files uploaded and registered successfully');

      // Clear pending files after successful upload
      setPendingFiles(new Map());
    } catch (error) {
      console.error('Error in batch upload:', error);
      toast.error(isRTL ? 'خطأ في تحميل الملفات' : 'Error uploading files');
    }
  };

  const handleRemoveAttachment = async (filename: string) => {
    const draftAttachment = draftAttachments.find(att => att.fileName === filename);
    if (draftAttachment) {
      setDraftAttachments(prev => prev.filter(att => att.fileName !== filename));
      setPendingFiles(prev => {
        const newMap = new Map(prev);
        newMap.delete(filename);
        return newMap;
      });
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ProjectForm] Form submit started. pendingFiles size:', pendingFiles.size, 'draftAttachments:', draftAttachments.length);
    
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const baseData = {
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

      let requestData: any = baseData;
      
      // For EXISTING projects only: include attachments with the request
      // (new projects upload files after creation with presigned URLs)
      if (initialProject && draftAttachments.length > 0) {
        console.log('[ProjectForm] Existing project - including', draftAttachments.length, 'attachments in update request');
        requestData = {
          ...baseData,
          attachments: draftAttachments.map(att => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileSize: att.fileSize,
            fileType: att.fileType,
          })),
        };
      }

      console.log('[ProjectForm] Submitting project data:', requestData);
      const result = await onSubmit(requestData);
      console.log('[ProjectForm] Project created/updated. Result:', result);
      const projectId = result.id;
      console.log('[ProjectForm] Project ID:', projectId, 'Pending files count:', pendingFiles.size);

      // For NEW projects OR existing projects with pending files: upload files after creation
      if (pendingFiles.size > 0) {
        console.log('[ProjectForm] Uploading pending files');
        toast.info(isRTL ? `جاري رفع ${pendingFiles.size} ملف...` : `Uploading ${pendingFiles.size} file(s)...`);
        await uploadPendingFilesToProject(projectId);
        
        if (draftAttachments.length > 0) {
          console.log('[ProjectForm] Updating attachments with', draftAttachments.length, 'uploaded files');
          setAttachments(prev => {
            const newAttachments = draftAttachments.map(draft => ({
              id: '',
              filename: draft.fileName,
              url: draft.fileUrl,  // This is now the object name
              size: draft.fileSize,
              type: draft.fileType,
              uploadedAt: new Date().toISOString(),
            }));
            return [...prev, ...newAttachments];
          });
        }
        
        setDraftAttachments([]);
      } else {
        console.log('[ProjectForm] No pending files to upload');
      }

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || (isRTL ? 'حدث خطأ أثناء إنشاء المشروع' : 'Error creating project');
      toast.error(errorMessage);
      console.error('Error submitting project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="h-4 w-4" />
          {isRTL ? (initialProject ? "تحديث المشروع" : "إنشاء مشروع جديد") : (initialProject ? "Update Project" : "Create New Project")}
        </CardTitle>
        <CardDescription className="text-xs">
          {isRTL ? "املأ التفاصيل أدناه لإنشاء أو تحديث مشروع" : "Fill in the details below to create or update a project"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs">{isRTL ? "عنوان المشروع" : "Project Title"} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={isRTL ? "عنوان..." : "Title..."}
                required
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="category" className="text-xs">{isRTL ? "الفئة" : "Category"} *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder={isRTL ? "اختر..." : "Select..."} />
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

          <div className="space-y-1">
            <Label htmlFor="description" className="text-xs">{isRTL ? "الوصف" : "Description"} *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={isRTL ? "وصف المشروع..." : "Project description..."}
              rows={3}
              required
              maxLength={500}
              className="text-sm"
            />
            <span className="text-xs text-gray-500 block mt-1">
              {formData.description.length} / 500
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="budgetMin" className="text-xs">{isRTL ? "الحد الأدنى" : "Min Budget"} *</Label>
              <Input
                id="budgetMin"
                type="number"
                step="0.01"
                min="0"
                value={formData.budgetMin}
                onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                placeholder="500"
                required
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="budgetMax" className="text-xs">{isRTL ? "الحد الأقصى" : "Max Budget"} *</Label>
              <Input
                id="budgetMax"
                type="number"
                step="0.01"
                min="0"
                value={formData.budgetMax}
                onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                placeholder="5000"
                required
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="currency" className="text-xs">{isRTL ? "العملة" : "Currency"}</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger className="h-8 text-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="projectType" className="text-xs">{isRTL ? "النوع" : "Type"} *</Label>
              <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                <SelectTrigger className="h-8 text-sm">
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
            <div className="space-y-1">
              <Label htmlFor="deadline" className="text-xs">{isRTL ? "الموعد النهائي" : "Deadline"} *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                required
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="duration" className="text-xs">{isRTL ? "المدة" : "Duration"}</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder={isRTL ? "2-3 أسابيع" : "2-3 weeks"}
                maxLength={100}
                className="h-8 text-sm"
              />
            </div>
          </div>

          {/* Skills Section - Full Width */}
          <div className="space-y-2">
            <Label className="text-xs">{isRTL ? "المهارات المطلوبة" : "Required Skills"} *</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {formData.skillsRequired.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-0 text-xs flex items-center gap-1">
                  {skill}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-3 w-3 p-0 hover:bg-red-100"
                    onClick={() => handleRemoveSkill(skill)}
                    type="button"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-1">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder={isRTL ? "مهارة..." : "Skill..."}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="h-8 text-sm"
              />
              <Button type="button" onClick={handleAddSkill} variant="outline" size="sm" className="px-2">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Attachments Upload Section - Full Width */}
          <div className="space-y-2">
            <Label className="text-xs">{isRTL ? "المرفقات" : "Attachments"}</Label>
            <div className={cn("border-2 border-dashed rounded-lg p-3 min-h-[100px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors", isRTL && "rtl")}>
              <FileUploadInput
                onFileSelect={handleFileSelect}
                isUploading={uploadingFiles.size > 0}
                disabled={false}
                maxFileSizeMB={20}
                acceptedFileTypes=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                fullArea={true}
                allowMultiple={true}
              />
            </div>
            {!initialProject && draftAttachments.length > 0 && (
              <p className="text-xs text-muted-foreground">{draftAttachments.length} {isRTL ? "ملف جاهز" : "file(s) ready"}</p>
            )}
          </div>

          {/* Uploading Files Progress */}
          {uploadingFiles.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-blue-900">{isRTL ? "جاري الرفع..." : "Uploading..."}</p>
              {Array.from(uploadingFiles.entries()).map(([filename]) => (
                <div key={filename} className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  <span className="text-xs text-gray-700 truncate">{filename}</span>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded/Pending Attachments */}
          {(attachments.length > 0 || draftAttachments.length > 0) && (
            <div className={cn("space-y-2", isRTL && "rtl")}>
              <p className="text-xs font-medium text-muted-foreground">
                {isRTL ? "المرفقات" : "Attachments"} ({attachments.length + draftAttachments.length})
              </p>
              <AttachmentList
                attachments={[
                  ...attachments,
                  ...draftAttachments.map((att, idx) => ({
                    id: `draft-${idx}`,
                    filename: att.fileName,
                    url: att.fileUrl,
                    size: att.fileSize,
                    type: att.fileType,
                  })),
                ]}
                onRemove={handleRemoveAttachment}
                isRTL={isRTL}
                canRemove={true}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" size="sm" className="bg-[#0A2540] hover:bg-[#142b52]" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {isRTL ? "جاري..." : "Submitting..."}
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-1" />
                  {isRTL ? (initialProject ? "تحديث" : "إنشاء") : (initialProject ? "Update" : "Create")}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              <X className="h-3 w-3 mr-1" />
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
