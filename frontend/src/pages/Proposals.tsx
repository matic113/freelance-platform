import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { useNavigate } from 'react-router-dom';
import { cn, isFreelancer, isClient, getUserTypeString } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Calendar,
  Eye,
  FileText,
  Users,
  MessageCircle,
  Star,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Copy,
  Download,
  ExternalLink,
  User,
  Briefcase,
  Award,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { ProposalCard, ProposalForm } from '@/components/proposals/ProposalCard';
import { ProjectDetailsModal } from '@/components/modals/ProjectDetailsModal';
import { Proposal } from '@/types/contract';
import { useMyProposals, useReceivedProposals, useAcceptProposal, useRejectProposal, useWithdrawProposal } from '@/hooks/useProposals';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { config } from '@/config/env';

export default function ProposalsPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('received');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
   const [rejectionReason, setRejectionReason] = useState('');
   
    // Determine user type from auth context
   const userType = getUserTypeString(user) || 'client';

   // Backend API hooks - only call endpoints based on user type
   const isFreelancerUser = isFreelancer(user);
   const isClientUser = isClient(user);
  
  const { 
    data: myProposalsData, 
    isLoading: myProposalsLoading, 
    error: myProposalsError 
  } = useMyProposals(0, 20, 'submittedAt,desc', isFreelancerUser);
  
  const { 
    data: receivedProposalsData, 
    isLoading: receivedProposalsLoading, 
    error: receivedProposalsError 
  } = useReceivedProposals(0, 20, 'submittedAt,desc', isClientUser);

  // Mutation hooks
  const acceptProposalMutation = useAcceptProposal();
  const rejectProposalMutation = useRejectProposal();
  const withdrawProposalMutation = useWithdrawProposal();

  // Extract proposals from API response
  const myProposals = myProposalsData?.content || [];
  const receivedProposals = receivedProposalsData?.content || [];
  
  // Combine all proposals for stats (only include data that was actually fetched)
  const allProposals = [
    ...(isFreelancer ? myProposals : []),
    ...(isClient ? receivedProposals : [])
  ];

  // Mock projects data
  const projects = [
    {
      id: 'p1',
      title: isRTL ? 'تطوير موقع إلكتروني للتجارة الإلكترونية' : 'E-commerce Website Development',
      description: isRTL ? 'تطوير موقع إلكتروني متكامل مع نظام إدارة المخزون وبوابة الدفع' : 'Complete e-commerce website with inventory management and payment gateway',
      budget: 5000,
      currency: 'USD',
      deadline: '2025-03-01',
      status: 'published',
      skills: ['React', 'Node.js', 'MongoDB', 'Payment Gateway'],
      clientId: 'c1',
      clientName: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      createdAt: '2025-01-05',
      proposalsCount: 3
    },
    {
      id: 'p2',
      title: isRTL ? 'تصميم هوية بصرية للشركة' : 'Company Brand Identity Design',
      description: isRTL ? 'تصميم شعار وهوية بصرية كاملة للشركة' : 'Complete logo and brand identity design for company',
      budget: 2500,
      currency: 'USD',
      deadline: '2025-02-15',
      status: 'published',
      skills: ['Photoshop', 'Illustrator', 'Branding'],
      clientId: 'c2',
      clientName: isRTL ? 'سارة أحمد' : 'Sarah Ahmed',
      createdAt: '2025-01-01',
      proposalsCount: 2
    },
    {
      id: 'p3',
      title: isRTL ? 'كتابة محتوى تسويقي' : 'Marketing Content Writing',
      description: isRTL ? 'كتابة محتوى تسويقي للشركة' : 'Marketing content writing for company',
      budget: 1500,
      currency: 'USD',
      deadline: '2025-01-30',
      status: 'published',
      skills: ['Content Writing', 'SEO', 'Marketing'],
      clientId: 'c3',
      clientName: isRTL ? 'خالد العثمان' : 'Khalid Al-Othman',
      createdAt: '2025-01-05',
      proposalsCount: 3
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: isRTL ? 'في الانتظار' : 'Pending',
      accepted: isRTL ? 'مقبول' : 'Accepted',
      rejected: isRTL ? 'مرفوض' : 'Rejected',
      withdrawn: isRTL ? 'مسحوب' : 'Withdrawn'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'withdrawn':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

   // Filter proposals based on search and status
   const filterProposals = (proposals: any[]) => {
     return proposals.filter(proposal => {
       const matchesSearch = proposal.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            proposal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            proposal.freelancerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            proposal.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
       const matchesStatus = statusFilter === 'all' || proposal.status.toLowerCase() === statusFilter.toLowerCase();
       return matchesSearch && matchesStatus;
     });
   };

  const filteredReceivedProposals = filterProposals(receivedProposals);
  const filteredSentProposals = filterProposals(myProposals);

  // Enhanced proposal handlers
  const handleAcceptProposal = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowAcceptDialog(true);
  };

  const handleRejectProposal = (proposal: any) => {
    setSelectedProposal(proposal);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleWithdrawProposal = async (proposalId: number) => {
    try {
      await withdrawProposalMutation.mutateAsync(proposalId);
      toast({
        title: isRTL ? "تم سحب العرض بنجاح" : "Proposal Withdrawn",
        description: isRTL ? "تم سحب العرض بنجاح" : "Proposal withdrawn successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في سحب العرض" : "Withdrawal Failed",
        description: isRTL ? "حدث خطأ أثناء سحب العرض" : "An error occurred while withdrawing the proposal",
        variant: "destructive",
      });
    }
  };

  const confirmAcceptProposal = async () => {
    if (selectedProposal) {
      try {
        await acceptProposalMutation.mutateAsync(selectedProposal.id);
        setShowAcceptDialog(false);
        setSelectedProposal(null);
        toast({
          title: isRTL ? "تم قبول العرض" : "Proposal Accepted",
          description: isRTL ? "تم قبول العرض وإنشاء العقد بنجاح" : "Proposal accepted and contract created successfully",
        });
      } catch (error) {
        toast({
          title: isRTL ? "خطأ في قبول العرض" : "Acceptance Failed",
          description: isRTL ? "حدث خطأ أثناء قبول العرض" : "An error occurred while accepting the proposal",
          variant: "destructive",
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
        toast({
          title: isRTL ? "تم رفض العرض" : "Proposal Rejected",
          description: isRTL ? "تم رفض العرض بنجاح" : "Proposal rejected successfully",
        });
      } catch (error) {
        toast({
          title: isRTL ? "خطأ في رفض العرض" : "Rejection Failed",
          description: isRTL ? "حدث خطأ أثناء رفض العرض" : "An error occurred while rejecting the proposal",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewProposalDetails = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      // Navigate to project details page
      navigate(`/project-details/${proposal.projectId}`);
    }
  };

  const handleSubmitProposal = (proposalData: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };
    setProposals(prev => [newProposal, ...prev]);
    setShowProposalForm(false);
    alert(isRTL ? 'تم إرسال العرض بنجاح' : 'Proposal submitted successfully');
  };

  const handleEditProject = (projectId: string) => {
    console.log('Edit project:', projectId);
    // Navigate to edit project page
  };

  const handleDeleteProject = (projectId: string) => {
    console.log('Delete project:', projectId);
    // Handle project deletion
  };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "إدارة العروض" : "Proposal Management"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إدارة العروض المرسلة والمستلمة مع تتبع حالة كل عرض" 
              : "Manage sent and received proposals with status tracking for each proposal"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "إجمالي العروض" : "Total Proposals"}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A2540]">
                {(isFreelancer && myProposalsLoading) || (isClient && receivedProposalsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  allProposals.length
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "في الانتظار" : "Pending"}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {(isFreelancer && myProposalsLoading) || (isClient && receivedProposalsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  allProposals.filter(p => p.status === 'PENDING').length
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "مقبولة" : "Accepted"}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(isFreelancer && myProposalsLoading) || (isClient && receivedProposalsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  allProposals.filter(p => p.status === 'ACCEPTED').length
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "مرفوضة" : "Rejected"}
              </CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {(isFreelancer && myProposalsLoading) || (isClient && receivedProposalsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  allProposals.filter(p => p.status === 'REJECTED').length
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {isRTL ? "البحث والتصفية" : "Search & Filter"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">
                  {isRTL ? "البحث في العروض" : "Search Proposals"}
                </Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isRTL ? "ابحث في العروض..." : "Search proposals..."}
                />
              </div>
              
              <div className="md:w-48">
                <Label htmlFor="status">
                  {isRTL ? "حالة العرض" : "Proposal Status"}
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isRTL ? "الكل" : "All"}
                    </SelectItem>
                    <SelectItem value="pending">
                      {isRTL ? "في الانتظار" : "Pending"}
                    </SelectItem>
                    <SelectItem value="accepted">
                      {isRTL ? "مقبول" : "Accepted"}
                    </SelectItem>
                    <SelectItem value="rejected">
                      {isRTL ? "مرفوض" : "Rejected"}
                    </SelectItem>
                    <SelectItem value="withdrawn">
                      {isRTL ? "مسحوب" : "Withdrawn"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="received">
              <Users className="h-4 w-4 mr-2" />
              {isRTL ? "العروض المستلمة" : "Received Proposals"}
            </TabsTrigger>
            <TabsTrigger value="sent">
              <Send className="h-4 w-4 mr-2" />
              {isRTL ? "العروض المرسلة" : "Sent Proposals"}
            </TabsTrigger>
          </TabsList>

          {/* Received Proposals Tab */}
          <TabsContent value="received" className="space-y-6">
            {receivedProposalsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">
                  {isRTL ? "جاري تحميل العروض المستلمة..." : "Loading received proposals..."}
                </span>
              </div>
            ) : receivedProposalsError ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "خطأ في تحميل العروض" : "Error Loading Proposals"}
                  </h3>
                  <p className="text-gray-500">
                    {isRTL 
                      ? "حدث خطأ أثناء جلب العروض المستلمة"
                      : "An error occurred while fetching received proposals"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-6">
                   {filteredReceivedProposals.map((proposal) => (
                   <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                     <CardContent className="p-6">
                       <div className="flex items-start justify-between mb-4">
                         <div className="flex items-start gap-4 flex-1">
                           <Avatar className="h-12 w-12">
                             <AvatarImage src={proposal.freelancerAvatarUrl || ''} />
                             <AvatarFallback>
                               {proposal.freelancerName?.charAt(0) || 'U'}
                             </AvatarFallback>
                           </Avatar>
                           
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <h3 className="text-lg font-semibold text-[#0A2540]">
                                 {proposal.projectTitle}
                               </h3>
                               <Badge className={getStatusColor(proposal.status.toLowerCase())}>
                                 <div className="flex items-center gap-1">
                                   {getStatusIcon(proposal.status.toLowerCase())}
                                   {getStatusText(proposal.status.toLowerCase())}
                                 </div>
                               </Badge>
                             </div>
                             
                             <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                               <div className="flex items-center gap-1">
                                 <User className="h-4 w-4" />
                                 {proposal.freelancerName}
                               </div>
                               <div className="flex items-center gap-1">
                                 <Star className="h-4 w-4 text-yellow-500" />
                                 {'N/A'}/5
                               </div>
                               <div className="flex items-center gap-1">
                                 <Briefcase className="h-4 w-4" />
                                 0 {isRTL ? "مشروع" : "projects"}
                               </div>
                             </div>
                             
                             <p className="text-gray-600 mb-4 line-clamp-2">
                               {proposal.description}
                             </p>
                             
                             <div className="flex items-center gap-6 text-sm">
                               <div className="flex items-center gap-1">
                                 <DollarSign className="h-4 w-4 text-green-600" />
                                 <span className="font-semibold">
                                   {proposal.proposedAmount}
                                 </span>
                               </div>
                               <div className="flex items-center gap-1">
                                 <Calendar className="h-4 w-4 text-blue-600" />
                                 <span>{proposal.estimatedDuration}</span>
                               </div>
                               <div className="flex items-center gap-1">
                                 <Clock className="h-4 w-4 text-gray-600" />
                                 <span>
                                   {new Date(proposal.submittedAt).toLocaleDateString()}
                                 </span>
                               </div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           <Button
                             size="sm"
                             variant="outline"
                             onClick={() => handleViewProposalDetails(proposal.id)}
                           >
                             <Eye className="h-4 w-4" />
                           </Button>
                           {proposal.status === 'PENDING' && (
                             <>
                               <Button
                                 size="sm"
                                 className="bg-green-600 hover:bg-green-700"
                                 onClick={() => handleAcceptProposal(proposal)}
                                 disabled={acceptProposalMutation.isPending}
                               >
                                 {acceptProposalMutation.isPending ? (
                                   <Loader2 className="h-4 w-4 animate-spin" />
                                 ) : (
                                   <ThumbsUp className="h-4 w-4" />
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
                                   <ThumbsDown className="h-4 w-4" />
                                 )}
                               </Button>
                             </>
                           )}
                         </div>
                      </div>

                      {/* Attachments */}
                      {proposal.attachments && proposal.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {isRTL ? "المرفقات" : "Attachments"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {proposal.attachments.map((attachment, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejection Reason */}
                      {(proposal as any).rejectionReason && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium text-red-700">
                              {isRTL ? "سبب الرفض" : "Rejection Reason"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {(proposal as any).rejectionReason}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  ))}
                </div>
                
                {filteredReceivedProposals.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "لا توجد عروض مستلمة" : "No Received Proposals"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "لم يتم العثور على عروض تطابق معايير البحث"
                        : "No proposals match your search criteria"
                      }
                    </p>
                  </CardContent>
                </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Sent Proposals Tab */}
          <TabsContent value="sent" className="space-y-6">
            {myProposalsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">
                  {isRTL ? "جاري تحميل العروض المرسلة..." : "Loading sent proposals..."}
                </span>
              </div>
            ) : myProposalsError ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "خطأ في تحميل العروض" : "Error Loading Proposals"}
                  </h3>
                  <p className="text-gray-500">
                    {isRTL 
                      ? "حدث خطأ أثناء جلب العروض المرسلة"
                      : "An error occurred while fetching sent proposals"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                 <div className="space-y-6">
                   {filteredSentProposals.map((proposal) => (
                   <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                   <CardContent className="p-6">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex items-start gap-4 flex-1">
                         <Avatar className="h-12 w-12">
                           <AvatarImage src={proposal.clientAvatarUrl || ''} />
                           <AvatarFallback>
                             {proposal.clientName?.charAt(0) || 'C'}
                           </AvatarFallback>
                         </Avatar>
                         
                         <div className="flex-1">
                           <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-lg font-semibold text-[#0A2540]">
                               {proposal.projectTitle}
                             </h3>
                             <Badge className={getStatusColor(proposal.status.toLowerCase())}>
                               <div className="flex items-center gap-1">
                                 {getStatusIcon(proposal.status.toLowerCase())}
                                 {getStatusText(proposal.status.toLowerCase())}
                               </div>
                             </Badge>
                           </div>
                           
                           <div className="flex items-center gap-2 mb-2">
                             <User className="h-4 w-4 text-gray-500" />
                             <span className="text-sm text-gray-600">{proposal.clientName}</span>
                           </div>
                           
                           <p className="text-gray-600 mb-3 line-clamp-2">
                             {proposal.description}
                           </p>
                        
                           <div className="flex items-center gap-6 text-sm text-gray-500">
                             <div className="flex items-center gap-1">
                               <DollarSign className="h-4 w-4" />
                               <span className="font-semibold">
                                 ${proposal.proposedAmount}
                               </span>
                             </div>
                             <div className="flex items-center gap-1">
                               <Calendar className="h-4 w-4" />
                               <span>{proposal.estimatedDuration}</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <Clock className="h-4 w-4" />
                               <span>
                                 {new Date(proposal.submittedAt).toLocaleDateString()}
                               </span>
                             </div>
                           </div>
                         </div>
                       </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProposalDetails(proposal.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {proposal.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWithdrawProposal(proposal.id)}
                            disabled={withdrawProposalMutation.isPending}
                          >
                            {withdrawProposalMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Attachments */}
                    {proposal.attachments && proposal.attachments.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {isRTL ? "المرفقات" : "Attachments"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {proposal.attachments.map((attachment, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {attachment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rejection Reason */}
                    {(proposal as any).rejectionReason && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-700">
                            {isRTL ? "سبب الرفض" : "Rejection Reason"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {(proposal as any).rejectionReason}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  ))}
                </div>
                
                {filteredSentProposals.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "لا توجد عروض مرسلة" : "No Sent Proposals"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "لم يتم العثور على عروض تطابق معايير البحث"
                        : "No proposals match your search criteria"
                      }
                    </p>
                  </CardContent>
                </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Proposal Form Dialog */}
        <Dialog open={showProposalForm} onOpenChange={setShowProposalForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "تقديم عرض جديد" : "Submit New Proposal"}
              </DialogTitle>
            </DialogHeader>
            
            <ProposalForm
              projectId={selectedProjectId}
              freelancerId="current_user"
              clientId="project_client"
              isRTL={isRTL}
              onSubmit={handleSubmitProposal}
              onCancel={() => setShowProposalForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Accept Proposal Dialog */}
        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "تأكيد قبول العرض" : "Confirm Proposal Acceptance"}
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
                  <h4 className="font-semibold mb-2">{selectedProposal.title}</h4>
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
                >
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
                  disabled={!rejectionReason.trim()}
                >
                  {isRTL ? "رفض العرض" : "Reject Proposal"}
                </Button>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Project Details Modal */}
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showProjectDetails}
          onClose={() => {
            setShowProjectDetails(false);
            setSelectedProject(null);
          }}
          userType={userType}
          isRTL={isRTL}
          onSubmitProposal={handleSubmitProposal}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}