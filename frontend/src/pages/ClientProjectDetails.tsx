import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Loader2,
  ArrowLeft,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Star,
  MessageCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  FileText
} from 'lucide-react';
import { projectService } from '@/services/project.service';
import { proposalService } from '@/services/proposal.service';
import { contractService } from '@/services/contract.service';
import { reviewService } from '@/services/review.service';
import { ProjectResponse, ProposalResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { useAcceptProposal, useRejectProposal } from '@/hooks/useProposals';
import { AttachmentList } from '@/components/AttachmentList';

export default function ClientProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalResponse | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const acceptProposalMutation = useAcceptProposal();
  const rejectProposalMutation = useRejectProposal();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'معرف المشروع غير صحيح' : 'Invalid project ID',
          variant: 'destructive'
        });
        navigate('/projects');
        return;
      }

      try {
        setIsLoading(true);
        const [projectData, proposalsData] = await Promise.all([
          projectService.getProject(id),
          proposalService.getProposalsForProject(id, 0, 20)
        ]);

        try {
          const attachments = await projectService.getProjectAttachments(id);
          projectData.attachments = attachments as any;
        } catch (attErr) {
          console.warn('Could not fetch project attachments:', attErr);
        }

        setProject(projectData);
        setProposals(proposalsData.content || []);
      } catch (error: unknown) {
        console.error('Error fetching project details:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'فشل تحميل تفاصيل المشروع' : 'Failed to load project details',
          variant: 'destructive'
        });
        navigate('/projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, isRTL, toast]);

  const formatBudget = (min: number, max: number, currency: string = 'USD') => {
    if (min === max) {
      return `${currency} ${min.toLocaleString()}`;
    }
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS':
        return isRTL ? 'قيد التنفيذ' : 'In Progress';
      case 'COMPLETED':
        return isRTL ? 'مكتمل' : 'Completed';
      case 'PUBLISHED':
        return isRTL ? 'منشور' : 'Published';
      case 'PENDING':
        return isRTL ? 'في الانتظار' : 'Pending';
      case 'CANCELLED':
        return isRTL ? 'ملغى' : 'Cancelled';
      default:
        return status;
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: isRTL ? 'انتهت المهلة' : 'Expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (days === 0) return { text: isRTL ? 'اليوم' : 'Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (days <= 3) return { text: `${days}d`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: `${days}d`, color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const handleAcceptProposal = (proposal: ProposalResponse) => {
    setSelectedProposal(proposal);
    setShowAcceptDialog(true);
  };

  const handleRejectProposal = (proposal: ProposalResponse) => {
    setSelectedProposal(proposal);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

   const confirmAcceptProposal = async () => {
     if (selectedProposal) {
       try {
         const response = await acceptProposalMutation.mutateAsync(selectedProposal.id);
         
         setShowAcceptDialog(false);
         
         setProposals(prev =>
           prev.map(p =>
             p.id === selectedProposal.id ? { ...p, status: 'ACCEPTED' } : p
           )
         );

         toast({
           title: isRTL ? 'نجح' : 'Success',
           description: isRTL ? 'تم قبول العرض بنجاح. جارٍ التحويل إلى العقد...' : 'Proposal accepted successfully. Redirecting to contract...',
           variant: 'default'
         });

         if (response?.contractId) {
           try {
             const contractLookup = await contractService.checkContractForOpening(response.contractId);
             
             if (contractLookup.canOpen) {
               const reviewLookup = await reviewService.checkReviewForProject(project!.id);
               
               if (reviewLookup.shouldOpenReviewModal) {
                 navigate(`/contracts?contractId=${response.contractId}&showReview=true`);
               } else {
                 navigate(`/contracts?contractId=${response.contractId}`);
               }
             } else {
               toast({
                 title: isRTL ? 'تنبيه' : 'Notice',
                 description: contractLookup.reason || (isRTL ? 'لا يمكن فتح هذا العقد' : 'Cannot open this contract'),
                 variant: 'default'
               });
               navigate('/contracts');
             }
           } catch (lookupError) {
             console.error('Error checking contract/review:', lookupError);
             navigate(`/contracts?contractId=${response.contractId}`);
           }
         } else {
           navigate('/contracts');
         }
         
         setSelectedProposal(null);
       } catch (error: unknown) {
         console.error('Error accepting proposal:', error);
         toast({
           title: isRTL ? 'خطأ' : 'Error',
           description: isRTL ? 'فشل قبول العرض' : 'Failed to accept proposal',
           variant: 'destructive'
         });
       }
     }
   };

  const confirmRejectProposal = async () => {
    if (selectedProposal) {
      try {
        await rejectProposalMutation.mutateAsync(selectedProposal.id);
        
        setShowRejectDialog(false);
        setSelectedProposal(null);
        setRejectionReason('');
        
        setProposals(prev =>
          prev.map(p =>
            p.id === selectedProposal.id ? { ...p, status: 'REJECTED' } : p
          )
        );

        toast({
          title: isRTL ? 'نجح' : 'Success',
          description: isRTL ? 'تم رفض العرض بنجاح' : 'Proposal rejected successfully',
          variant: 'default'
        });
      } catch (error: unknown) {
        console.error('Error rejecting proposal:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'فشل رفض العرض' : 'Failed to reject proposal',
          variant: 'destructive'
        });
      }
    }
  };

  const handleEditProject = () => {
    if (!project) return;
    console.log('Navigating to edit project', project.id);
    toast({ title: isRTL ? 'جاري التحويل' : 'Opening editor', description: isRTL ? 'جارٍ تحميل المشروع للتحرير' : 'Loading project for editing' });
    navigate('/projects-management', { state: { editProjectId: project.id } });
  };

  const handleDeleteProject = async () => {
    if (!project?.id) return;
    setIsDeleting(true);
    try {
      await projectService.deleteProject(project.id);
      toast({ title: isRTL ? 'نجح' : 'Success', description: isRTL ? 'تم حذف المشروع بنجاح' : 'Project deleted successfully', variant: 'default' });
      setShowDeleteDialog(false);
      navigate('/client-dashboard');
    } catch (error: unknown) {
      console.error('Error deleting project:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (isRTL ? 'فشل حذف المشروع' : 'Failed to delete project');
      toast({ title: isRTL ? 'خطأ' : 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className={cn("text-center", isRTL && "text-right")}>
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-600">
              {isRTL ? 'لم يتم العثور على المشروع' : 'Project Not Found'}
            </h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const deadlineStatus = getDeadlineStatus(project.deadline);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className={cn("flex-1 py-8 px-4 md:px-8", isRTL && "rtl")}>
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className={cn("flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6", isRTL && "flex-row-reverse")}
          >
            <ArrowLeft className="h-4 w-4" />
            {isRTL ? 'العودة إلى المشاريع' : 'Back to Projects'}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Header Card */}
              <Card>
                <CardHeader>
                  <div className={cn("flex items-start justify-between gap-4", isRTL && "flex-row-reverse")}>
                    <div className="flex-1">
                      <CardTitle className="text-3xl font-bold text-[#0A2540] mb-2">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600">
                        {project.description}
                      </CardDescription>
                    </div>
                    {project.isFeatured && (
                      <div className="flex-shrink-0">
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                {project.attachments && project.attachments.length > 0 && (
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {project.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <a
                            href={attachment.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[150px]"
                            title={attachment.fileName}
                          >
                            {attachment.fileName}
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Project Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'تفاصيل المشروع' : 'Project Details'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={cn("space-y-1", isRTL && "text-right")}>
                      <p className="text-sm text-gray-600">{isRTL ? 'الفئة' : 'Category'}</p>
                      <p className="font-semibold text-gray-800">{project.category}</p>
                    </div>
                    <div className={cn("space-y-1", isRTL && "text-right")}>
                      <p className="text-sm text-gray-600">{isRTL ? 'نوع المشروع' : 'Project Type'}</p>
                      <Badge className="w-fit">{project.projectType}</Badge>
                    </div>
                    <div className={cn("space-y-1", isRTL && "text-right")}>
                      <p className="text-sm text-gray-600">{isRTL ? 'الحالة' : 'Status'}</p>
                      <Badge variant="outline" className="w-fit">{getStatusText(project.status)}</Badge>
                    </div>
                    <div className={cn("space-y-1", isRTL && "text-right")}>
                      <p className="text-sm text-gray-600">{isRTL ? 'المدة' : 'Duration'}</p>
                      <p className="font-semibold text-gray-800">{project.duration}</p>
                    </div>
                  </div>

                  <div className={cn("pt-4 border-t", isRTL && "text-right")}>
                    <div className={cn("flex items-center gap-2 mb-3", isRTL && "flex-row-reverse")}>
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {isRTL ? 'الموعد النهائي: ' : 'Deadline: '}
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                      <span className={cn("text-xs font-semibold px-2 py-1 rounded ml-auto", deadlineStatus.bgColor, deadlineStatus.color)}>
                        {deadlineStatus.text}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Required Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'المهارات المطلوبة' : 'Required Skills'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired?.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Received Proposals Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'العروض المستلمة' : 'Received Proposals'}</CardTitle>
                  <CardDescription>
                    {isRTL ? `${proposals.length} عروض مستلمة` : `${proposals.length} proposals received`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {proposals.length === 0 ? (
                    <div className={cn("text-center py-8", isRTL && "text-right")}>
                      <p className="text-gray-500">
                        {isRTL ? 'لا توجد عروض حتى الآن' : 'No proposals yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {proposals.map((proposal) => (
                        <div
                          key={proposal.id}
                          className={cn("border rounded-lg p-4 hover:bg-gray-50 transition-colors", isRTL && "text-right")}
                        >
                          <div className={cn("flex items-start justify-between gap-4 mb-3", isRTL && "flex-row-reverse")}>
                            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={''} alt={proposal.freelancerName} />
                                <AvatarFallback>
                                  {proposal.freelancerName?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {proposal.freelancerName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {isRTL ? 'قدم قبل ' : 'Submitted '}
                                  {new Date(proposal.submittedAt).toLocaleDateString()} {new Date(proposal.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                proposal.status === 'ACCEPTED' ? 'default' :
                                proposal.status === 'REJECTED' ? 'destructive' :
                                proposal.status === 'WITHDRAWN' ? 'outline' :
                                'secondary'
                              }
                            >
                              {proposal.status}
                            </Badge>
                          </div>

                          <div className={cn("space-y-2", isRTL && "text-right")}>
                            <div className="grid grid-cols-2 gap-4">
                              <div className={cn("space-y-1", isRTL && "text-right")}>
                                <span className="text-sm text-gray-600">{isRTL ? 'المبلغ المقترح: ' : 'Budget: '}</span>
                                <p className="font-semibold text-green-600">
                                  {proposal.currency} {proposal.proposedAmount.toLocaleString()}
                                </p>
                              </div>
                              <div className={cn("space-y-1", isRTL && "text-right")}>
                                <span className="text-sm text-gray-600">{isRTL ? 'المدة: ' : 'Duration: '}</span>
                                <p className="text-sm font-semibold">{proposal.estimatedDuration}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2 py-2 bg-gray-100 p-2 rounded">
                              "{proposal.description}"
                            </p>

                            {proposal.status === 'PENDING' && (
                              <div className={cn("flex gap-2 mt-4", isRTL && "flex-row-reverse")}>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleAcceptProposal(proposal)}
                                  disabled={acceptProposalMutation.isPending}
                                >
                                  {acceptProposalMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <ThumbsUp className="h-4 w-4 mr-2" />
                                      {isRTL ? 'قبول' : 'Accept'}
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectProposal(proposal)}
                                  disabled={rejectProposalMutation.isPending}
                                >
                                  {rejectProposalMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <ThumbsDown className="h-4 w-4 mr-2" />
                                      {isRTL ? 'رفض' : 'Reject'}
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Budget Card */}
              <Card>
                <CardHeader>
                  <CardTitle className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                    <DollarSign className="h-5 w-5 text-green-600" />
                    {isRTL ? 'الميزانية' : 'Budget'}
                  </CardTitle>
                </CardHeader>
                <CardContent className={cn("space-y-2", isRTL && "text-right")}>
                  <p className="text-2xl font-bold text-green-600">
                    {formatBudget(project.budgetMin, project.budgetMax, project.currency)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isRTL ? 'النطاق السعري' : 'Price Range'}
                  </p>
                </CardContent>
              </Card>

              {/* Proposals Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'ملخص العروض' : 'Proposals Summary'}</CardTitle>
                </CardHeader>
                <CardContent className={cn("space-y-3", isRTL && "text-right")}>
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-gray-600">{isRTL ? 'إجمالي العروض' : 'Total Proposals'}</span>
                    <span className="font-semibold text-lg">{proposals.length}</span>
                  </div>
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-gray-600">{isRTL ? 'في الانتظار' : 'Pending'}</span>
                    <span className="font-semibold text-yellow-600">{proposals.filter(p => p.status === 'PENDING').length}</span>
                  </div>
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-gray-600">{isRTL ? 'مقبول' : 'Accepted'}</span>
                    <span className="font-semibold text-green-600">{proposals.filter(p => p.status === 'ACCEPTED').length}</span>
                  </div>
                  <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                    <span className="text-gray-600">{isRTL ? 'مرفوض' : 'Rejected'}</span>
                    <span className="font-semibold text-red-600">{proposals.filter(p => p.status === 'REJECTED').length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleEditProject}>
                    <Edit className={cn("h-4 w-4", isRTL && "ml-2")} />
                    {isRTL ? 'تعديل المشروع' : 'Edit Project'}
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className={cn("h-4 w-4", isRTL && "ml-2")} />
                    {isRTL ? 'حذف المشروع' : 'Delete Project'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Accept Proposal Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'تأكيد قبول العرض' : 'Confirm Proposal Acceptance'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              {isRTL 
                ? "هل أنت متأكد من أنك تريد قبول هذا العرض؟ سيتم إنشاء عقد جديد."
                : "Are you sure you want to accept this proposal? A new contract will be created."
              }
            </p>
            {selectedProposal && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedProposal.freelancerName}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{selectedProposal.proposedAmount} {selectedProposal.currency}</span>
                  <span>{selectedProposal.estimatedDuration}</span>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={confirmAcceptProposal}
                className="bg-green-600 hover:bg-green-700"
                disabled={acceptProposalMutation.isPending}
              >
                {acceptProposalMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isRTL ? "قبول العرض" : "Accept Proposal"}
              </Button>
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Proposal Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "رفض العرض" : "Reject Proposal"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              {isRTL 
                ? "يرجى إدخال سبب رفض العرض (اختياري)"
                : "Please enter a reason for rejecting the proposal (optional)"
              }
            </p>
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">
                {isRTL ? "سبب الرفض" : "Rejection Reason"}
              </Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={isRTL ? "أدخل سبب الرفض..." : "Enter rejection reason..."}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={confirmRejectProposal}
                disabled={rejectProposalMutation.isPending}
              >
                {rejectProposalMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isRTL ? "رفض العرض" : "Reject Proposal"}
              </Button>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isRTL ? "تأكيد حذف المشروع" : "Confirm Project Deletion"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              {isRTL 
                ? "هل أنت متأكد من أنك تريد حذف هذا المشروع؟ سيتم حذف جميع العروض المرتبطة به ولا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this project? This will delete all proposals associated with it and cannot be undone."
              }
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isRTL ? "حذف المشروع" : "Delete Project"}
              </Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
