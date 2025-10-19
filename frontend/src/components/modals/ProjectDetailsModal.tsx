import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  MapPin, 
  Tag,
  Eye,
  MessageCircle,
  Send,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  deadline: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  skills: string[];
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  location?: string;
  createdAt: string;
  proposalsCount?: number;
}

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  userType: 'client' | 'freelancer';
  isRTL?: boolean;
  onSubmitProposal?: (projectId: string, proposalData: any) => void;
  onEditProject?: (projectId: string) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  userType,
  isRTL = false,
  onSubmitProposal,
  onEditProject,
  onDeleteProject
}) => {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    amount: '',
    duration: '',
    message: ''
  });

  if (!project) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: isRTL ? 'مسودة' : 'Draft',
      published: isRTL ? 'منشور' : 'Published',
      in_progress: isRTL ? 'قيد التنفيذ' : 'In Progress',
      completed: isRTL ? 'مكتمل' : 'Completed',
      cancelled: isRTL ? 'ملغي' : 'Cancelled'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleSubmitProposal = () => {
    if (proposalData.amount && proposalData.duration && proposalData.message) {
      onSubmitProposal?.(project.id, proposalData);
      setShowProposalForm(false);
      setProposalData({ amount: '', duration: '', message: '' });
    }
  };

  const canSubmitProposal = userType === 'freelancer' && project.status === 'published';
  const canEditProject = userType === 'client' && project.status === 'draft';
  const canDeleteProject = userType === 'client' && project.status === 'draft';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {project.title}
          </DialogTitle>
          <DialogDescription>
            {isRTL ? 'تفاصيل المشروع والمعلومات المطلوبة' : 'Project details and requirements'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn("text-xs", getStatusColor(project.status))}>
                  {getStatusText(project.status)}
                </Badge>
                {project.proposalsCount && (
                  <Badge variant="outline" className="text-xs">
                    {project.proposalsCount} {isRTL ? 'عرض' : 'proposals'}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                {isRTL ? 'تم النشر في' : 'Posted on'} {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {isRTL ? 'وصف المشروع' : 'Project Description'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              {project.skills && project.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      {isRTL ? 'المهارات المطلوبة' : 'Required Skills'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isRTL ? 'تفاصيل المشروع' : 'Project Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {project.budget.toLocaleString()} {project.currency}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'الميزانية المقترحة' : 'Proposed Budget'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'الموعد النهائي' : 'Deadline'}
                      </p>
                    </div>
                  </div>

                  {project.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium">{project.location}</p>
                        <p className="text-sm text-gray-600">
                          {isRTL ? 'الموقع' : 'Location'}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {isRTL ? 'معلومات العميل' : 'Client Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {project.clientAvatar ? (
                        <img 
                          src={project.clientAvatar} 
                          alt={project.clientName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{project.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {isRTL ? 'العميل' : 'Client'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Proposal Form */}
          {showProposalForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {isRTL ? 'تقديم عرض' : 'Submit Proposal'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'المبلغ المقترح' : 'Proposed Amount'}
                    </label>
                    <input
                      type="number"
                      value={proposalData.amount}
                      onChange={(e) => setProposalData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      placeholder={isRTL ? 'أدخل المبلغ' : 'Enter amount'}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {isRTL ? 'المدة المقدرة' : 'Estimated Duration'}
                    </label>
                    <input
                      type="text"
                      value={proposalData.duration}
                      onChange={(e) => setProposalData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      placeholder={isRTL ? 'مثال: شهر واحد' : 'e.g., 1 month'}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {isRTL ? 'رسالة العرض' : 'Proposal Message'}
                  </label>
                  <textarea
                    value={proposalData.message}
                    onChange={(e) => setProposalData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-2 border rounded-md h-24"
                    placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSubmitProposal} className="bg-[#0A2540] hover:bg-[#142b52]">
                    <Send className="h-4 w-4 mr-2" />
                    {isRTL ? 'إرسال العرض' : 'Submit Proposal'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowProposalForm(false)}>
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {canSubmitProposal && !showProposalForm && (
              <Button 
                onClick={() => setShowProposalForm(true)}
                className="bg-[#0A2540] hover:bg-[#142b52]"
              >
                <Send className="h-4 w-4 mr-2" />
                {isRTL ? 'تقديم عرض' : 'Submit Proposal'}
              </Button>
            )}
            
            {canEditProject && (
              <Button 
                variant="outline"
                onClick={() => onEditProject?.(project.id)}
              >
                <FileText className="h-4 w-4 mr-2" />
                {isRTL ? 'تعديل المشروع' : 'Edit Project'}
              </Button>
            )}
            
            {canDeleteProject && (
              <Button 
                variant="destructive"
                onClick={() => onDeleteProject?.(project.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isRTL ? 'حذف المشروع' : 'Delete Project'}
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};