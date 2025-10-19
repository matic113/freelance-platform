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
  Share2
} from 'lucide-react';
import { projectService } from '@/services/project.service';
import { proposalService } from '@/services/proposal.service';
import { conversationService } from '@/services/conversation.service';
import { ProjectResponse, ProposalResponse } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProposalModal } from '@/components/modals/ProposalModal';
import { ContactClientModal } from '@/components/modals/ContactClientModal';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProposed, setHasProposed] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'معرف المشروع غير صحيح' : 'Invalid project ID',
          variant: 'destructive'
        });
        navigate('/available-projects');
        return;
      }

      try {
        setIsLoading(true);
        const [projectData, proposalsData] = await Promise.all([
          projectService.getProject(id),
          proposalService.getProposalsForProject(id, 0, 3)
        ]);

        setProject(projectData);
        setProposals(proposalsData.content || []);

        if (user?.id) {
          try {
            const hasUserProposed = await proposalService.hasProposedToProject(id);
            setHasProposed(hasUserProposed);
          } catch (error) {
            console.warn('Could not check proposal status:', error);
            setHasProposed(false);
          }
        }
      } catch (error: unknown) {
        console.error('Error fetching project details:', error);
        toast({
          title: isRTL ? 'خطأ' : 'Error',
          description: isRTL ? 'فشل تحميل تفاصيل المشروع' : 'Failed to load project details',
          variant: 'destructive'
        });
        navigate('/available-projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, isRTL, toast, user?.id]);

  const formatBudget = (min: number, max: number, currency: string = 'USD') => {
    if (min === max) {
      return `${currency} ${min.toLocaleString()}`;
    }
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  const getDeadlineStatus = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: isRTL ? 'انتهت المهلة' : 'Expired', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (days === 0) return { text: isRTL ? 'اليوم' : 'Today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (days <= 3) return { text: `${days}d`, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { text: `${days}d`, color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const handlePropose = () => {
    if (!user) {
      toast({
        title: isRTL ? 'تسجيل الدخول' : 'Sign In Required',
        description: isRTL ? 'يجب تسجيل الدخول لتقديم عرض' : 'Please sign in to submit a proposal',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    setShowProposalModal(true);
  };

  const handleContactClient = () => {
    if (!user) {
      toast({
        title: isRTL ? 'تسجيل الدخول' : 'Sign In Required',
        description: isRTL ? 'يجب تسجيل الدخول لمراسلة العميل' : 'Please sign in to contact the client',
        variant: 'destructive'
      });
      navigate('/');
      return;
    }

    setShowContactModal(true);
  };

  const handleSubmitProposal = async (formData: Record<string, unknown>) => {
    if (!project || !id) return;

    try {
      await proposalService.submitProposal({
        projectId: project.id,
        title: formData.title as string,
        description: formData.description as string,
        proposedAmount: parseFloat(formData.proposedAmount as string),
        currency: project.currency,
        estimatedDuration: (formData.estimatedDuration as string) || '',
        attachments: []
      });

      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم إرسال العرض بنجاح' : 'Proposal submitted successfully',
        variant: 'default'
      });

      setHasProposed(true);
      setShowProposalModal(false);

      try {
        const proposalsData = await proposalService.getProposalsForProject(id, 0, 3);
        setProposals(proposalsData.content || []);
      } catch (error) {
        console.warn('Could not refetch proposals:', error);
      }
    } catch (error: unknown) {
      console.error('Error submitting proposal:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message 
        || (isRTL ? 'فشل إرسال العرض' : 'Failed to submit proposal');
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!project) return;

    try {
      const conversation = await conversationService.startConversationById(project.clientId);
      await conversationService.sendMessage(conversation.id, message);

      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم إرسال الرسالة بنجاح' : 'Message sent successfully',
        variant: 'default'
      });

      setShowContactModal(false);
    } catch (error: unknown) {
      console.error('Error sending message:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message 
        || (isRTL ? 'فشل إرسال الرسالة' : 'Failed to send message');
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
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
            onClick={() => navigate('/available-projects')}
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
                      <Badge variant="outline" className="w-fit capitalize">{project.status?.toLowerCase()}</Badge>
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

              {/* Recent Proposals Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'آخر العروض' : 'Recent Proposals'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'أحدث 3 عروض مقدمة' : 'Last 3 submitted proposals'}
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

              {/* Client Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'معلومات العميل' : 'Client Info'}</CardTitle>
                </CardHeader>
                <CardContent className={cn("space-y-4", isRTL && "text-right")}>
                  <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={''} alt={project.clientName} />
                      <AvatarFallback>{project.clientName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800">{project.clientName}</p>
                      <div className={cn("flex items-center gap-1 text-xs text-gray-500", isRTL && "flex-row-reverse")}>
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{isRTL ? 'موثق' : 'Verified'}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    {isRTL ? 'عرض ملف العميل' : 'View Profile'}
                  </Button>
                </CardContent>
              </Card>

                {/* Action Buttons */}
                <Card>
                  <CardContent className="pt-6 space-y-2">
                     <Button 
                       onClick={handlePropose}
                       disabled={project.status !== 'PUBLISHED' || hasProposed}
                       className="w-full bg-blue-600 hover:bg-blue-700"
                     >
                       {hasProposed ? (isRTL ? 'تم تقديم العرض' : 'Proposal Submitted') : project.status === 'PUBLISHED' ? (isRTL ? 'تقديم عرض' : 'Submit Proposal') : (isRTL ? 'إغلاق تقديم العروض' : 'Proposal Submissions Closed')}
                     </Button>
                   <Button 
                     variant="outline" 
                     className="w-full"
                     onClick={handleContactClient}
                   >
                     <MessageCircle className={cn("h-4 w-4", isRTL && "ml-2")} />
                     {isRTL ? 'راسل العميل' : 'Contact Client'}
                   </Button>
                   <Button variant="outline" className="w-full">
                     <Share2 className={cn("h-4 w-4", isRTL && "ml-2")} />
                     {isRTL ? 'مشاركة' : 'Share'}
                   </Button>
                 </CardContent>
               </Card>
            </div>
          </div>
        </div>
      </main>

      <ProposalModal
        isOpen={showProposalModal}
        onClose={() => setShowProposalModal(false)}
        onSubmit={handleSubmitProposal}
        projectTitle={project?.title || ''}
        isRTL={isRTL}
      />

      <ContactClientModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleSendMessage}
        clientName={project?.clientName || ''}
        projectTitle={project?.title || ''}
        isRTL={isRTL}
      />

      <Footer />
    </div>
  );
}
