import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn, isFreelancerUser, isClientUser, getUserTypeString } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  MessageCircle, 
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Edit,
  Trash2,
  Play,
  Pause,
  Square,
  MoreVertical,
  Copy,
  Download,
  ExternalLink,
  User,
  Briefcase,
  Award,
  Star,
  Target,
  TrendingUp,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react';
import { ContractCard } from '@/components/contracts/ContractCard';
import { MilestoneCard } from '@/components/contracts/MilestoneCard';
import { PaymentRequestCard } from '@/components/contracts/PaymentRequestCard';
import { ContractDetailsModal } from '@/components/modals/ContractDetailsModal';
import { ContractAcceptanceFlow } from '@/components/contracts/ContractAcceptanceFlow';
import { ReviewPromptsList } from '@/components/reviews/ReviewPrompt';
import { 
  Contract, 
  Milestone, 
  PaymentRequest, 
  ContractResponse, 
  MilestoneResponse, 
  PaymentResponse,
  ContractStatus,
  MilestoneStatus,
  PaymentRequestStatus,
  CreateMilestoneRequest,
  UpdateMilestoneRequest
} from '@/types/contract';
import { 
  useMyContracts, 
  useFreelancerContracts, 
  useContractMilestones,
  useMyPaymentRequests,
  useReceivedPaymentRequests,
  useCreateMilestone,
  useUpdateMilestone,
  useUpdateMilestoneStatus,
  useDeleteMilestone,
  useCreatePaymentRequest,
  useApprovePaymentRequest,
  useRejectPaymentRequest,
  useAcceptContract,
  useRejectContract
} from '@/hooks/useContracts';
import { usePendingReviews } from '@/hooks/useReviewOpportunities';

export default function ContractsPage() {
  const { isRTL, toggleLanguage } = useLocalization();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContract, setSelectedContract] = useState<ContractResponse | null>(null);
  const [showContractDetails, setShowContractDetails] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showEditMilestoneDialog, setShowEditMilestoneDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneResponse | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: '',
    orderIndex: 1
  });

   // Determine user type from auth context
   const isFreelancerUser = isFreelancerRole(user);
   const isClientUser = isClientRole(user);
   const userType = getUserTypeString(user) || 'client';

  // Backend API hooks - only call endpoints based on user type
  const { 
    data: myContractsData, 
    isLoading: myContractsLoading, 
    error: myContractsError 
  } = useMyContracts(0, 20, 'createdAt,desc', isClientUser);
  
  const { 
    data: freelancerContractsData, 
    isLoading: freelancerContractsLoading, 
    error: freelancerContractsError 
  } = useFreelancerContracts(0, 20, 'createdAt,desc', isFreelancerUser);

  const { 
    data: myPaymentRequestsData, 
    isLoading: myPaymentRequestsLoading, 
    error: myPaymentRequestsError 
  } = useMyPaymentRequests(0, 20, 'requestedAt,desc', isFreelancerUser);
  
  const { 
    data: receivedPaymentRequestsData, 
    isLoading: receivedPaymentRequestsLoading,
    error: receivedPaymentRequestsError 
   } = useReceivedPaymentRequests(0, 20, 'requestedAt,desc', isClientUser);

   const {
     data: pendingReviewsData,
     isLoading: pendingReviewsLoading
   } = usePendingReviews(0, 100, true);

    // Mutation hooks
    const createMilestoneMutation = useCreateMilestone();
     const updateMilestoneMutation = useUpdateMilestone();
     const updateMilestoneStatusMutation = useUpdateMilestoneStatus();
     const deleteMilestoneMutation = useDeleteMilestone();
   const createPaymentRequestMutation = useCreatePaymentRequest();
   const approvePaymentRequestMutation = useApprovePaymentRequest();
   const rejectPaymentRequestMutation = useRejectPaymentRequest();
   const acceptContractMutation = useAcceptContract();
   const rejectContractMutation = useRejectContract();

  // Extract data from API responses
  const contracts = [
   ...(isClientUser ? (myContractsData?.content || []) : []),
   ...(isFreelancerUser ? (freelancerContractsData?.content || []) : [])
  ];
  
   const paymentRequests = [
    ...(isFreelancerUser ? (myPaymentRequestsData?.content || []) : []),
    ...(isClientUser ? (receivedPaymentRequestsData?.content || []) : [])
   ];

   useEffect(() => {
     if (selectedContract) {
       const updatedContract = contracts.find(c => c.id === selectedContract.id);
       if (updatedContract) {
         setSelectedContract(updatedContract);
       }
     }
   }, [contracts, selectedContract?.id]);

  // Calculate stats from backend data
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === ContractStatus.ACTIVE).length;
  const completedMilestones = contracts.flatMap(c => c.milestones || []).filter(m => 
    m.status === MilestoneStatus.COMPLETED || m.status === MilestoneStatus.PAID
  ).length;
  const totalPayments = paymentRequests.filter(p => p.status === PaymentRequestStatus.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      PAID: 'bg-green-100 text-green-800',
      ACTIVE: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

   const getStatusText = (status: string) => {
     const texts = {
       PENDING: isRTL ? 'بانتظار موافقة المستقل' : 'Pending Freelancer Approval',
       IN_PROGRESS: isRTL ? 'قيد التنفيذ' : 'In Progress',
       COMPLETED: isRTL ? 'مكتمل' : 'Completed',
       PAID: isRTL ? 'مدفوع' : 'Paid',
       ACTIVE: isRTL ? 'موافق عليه' : 'Approved',
       CANCELLED: isRTL ? 'ملغي' : 'Cancelled',
       APPROVED: isRTL ? 'موافق عليه' : 'Approved',
       REJECTED: isRTL ? 'مرفوض' : 'Rejected'
     };
     return texts[status as keyof typeof texts] || status;
   };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'ACTIVE':
        return <Play className="h-4 w-4" />;
      case 'CANCELLED':
        return <Square className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

    const sortMilestonesByDate = (milestones: MilestoneResponse[]) => {
      if (!milestones || milestones.length === 0) return [];
      return [...milestones].sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return dateA - dateB;
      });
    };

    const isContractApproved = (contract: ContractResponse) => {
      return contract.status === ContractStatus.ACTIVE;
    };

    const canTransitionMilestoneStatus = (currentStatus: string, newStatus: string): boolean => {
      const transitions: Record<string, string[]> = {
        [MilestoneStatus.PENDING]: [MilestoneStatus.IN_PROGRESS],
        [MilestoneStatus.IN_PROGRESS]: [MilestoneStatus.COMPLETED],
        [MilestoneStatus.COMPLETED]: [MilestoneStatus.PAID],
        [MilestoneStatus.PAID]: []
      };
      return transitions[currentStatus]?.includes(newStatus) || false;
    };

    const getAvailableMilestoneStatuses = (currentStatus: string): string[] => {
      const transitions: Record<string, string[]> = {
        [MilestoneStatus.PENDING]: [MilestoneStatus.IN_PROGRESS],
        [MilestoneStatus.IN_PROGRESS]: [MilestoneStatus.COMPLETED],
        [MilestoneStatus.COMPLETED]: [MilestoneStatus.PAID],
        [MilestoneStatus.PAID]: []
      };
      return transitions[currentStatus] || [];
    };

   const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Enhanced milestone handlers
  const handleCreateMilestone = async () => {
    if (selectedContract && newMilestone.title && newMilestone.description && newMilestone.amount && newMilestone.dueDate) {
      try {
        const request: CreateMilestoneRequest = {
          title: newMilestone.title,
          description: newMilestone.description,
          amount: parseFloat(newMilestone.amount),
          dueDate: newMilestone.dueDate,
          orderIndex: newMilestone.orderIndex
        };

        await createMilestoneMutation.mutateAsync({
          contractId: selectedContract.id,
          request
        });

        setNewMilestone({
          title: '',
          description: '',
          amount: '',
          dueDate: '',
          orderIndex: 1
        });
        setShowMilestoneDialog(false);
        
        toast({
          title: isRTL ? "تم إنشاء المرحلة بنجاح" : "Milestone Created",
          description: isRTL ? "تم إنشاء المرحلة الجديدة بنجاح" : "New milestone has been created successfully",
        });
      } catch (error) {
        toast({
          title: isRTL ? "خطأ في إنشاء المرحلة" : "Error Creating Milestone",
          description: isRTL ? "حدث خطأ أثناء إنشاء المرحلة" : "An error occurred while creating the milestone",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditMilestone = (milestone: MilestoneResponse) => {
    setSelectedMilestone(milestone);
    setShowEditMilestoneDialog(true);
  };

  const handleUpdateMilestone = async (updatedMilestone: MilestoneResponse) => {
    try {
      const request: UpdateMilestoneRequest = {
        title: updatedMilestone.title,
        description: updatedMilestone.description,
        amount: updatedMilestone.amount,
        dueDate: updatedMilestone.dueDate,
        orderIndex: updatedMilestone.orderIndex
      };

      await updateMilestoneMutation.mutateAsync({
        contractId: updatedMilestone.contractId,
        milestoneId: updatedMilestone.id,
        request
      });

      setShowEditMilestoneDialog(false);
      setSelectedMilestone(null);
      
      toast({
        title: isRTL ? "تم تحديث المرحلة بنجاح" : "Milestone Updated",
        description: isRTL ? "تم تحديث المرحلة بنجاح" : "Milestone has been updated successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في تحديث المرحلة" : "Error Updating Milestone",
        description: isRTL ? "حدث خطأ أثناء تحديث المرحلة" : "An error occurred while updating the milestone",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMilestone = async (contractId: string, milestoneId: string) => {
    try {
      await deleteMilestoneMutation.mutateAsync({
        contractId,
        milestoneId
      });
      
      toast({
        title: isRTL ? "تم حذف المرحلة بنجاح" : "Milestone Deleted",
        description: isRTL ? "تم حذف المرحلة بنجاح" : "Milestone has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في حذف المرحلة" : "Error Deleting Milestone",
        description: isRTL ? "حدث خطأ أثناء حذف المرحلة" : "An error occurred while deleting the milestone",
        variant: "destructive",
      });
    }
  };

    const handleUpdateMilestoneStatus = async (contractId: string, milestoneId: string, status: string) => {
      try {
        await updateMilestoneStatusMutation.mutateAsync({
          contractId,
          milestoneId,
          status
        });
        
        toast({
          title: isRTL ? "تم تحديث حالة المرحلة" : "Milestone Status Updated",
          description: isRTL ? "تم تحديث حالة المرحلة بنجاح" : "Milestone status has been updated successfully",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: isRTL ? "خطأ في تحديث حالة المرحلة" : "Error Updating Milestone Status",
          description: isRTL ? "حدث خطأ أثناء تحديث حالة المرحلة" : "An error occurred while updating milestone status",
          variant: "destructive",
        });
      }
    };

  const handleRequestPayment = async (contractId: string, milestoneId: string, amount: number) => {
    try {
      const request = {
        contractId,
        milestoneId,
        amount,
        currency: 'USD',
        description: isRTL ? 'طلب دفع للمرحلة المكتملة' : 'Payment request for completed milestone'
      };

      await createPaymentRequestMutation.mutateAsync(request);
      
      toast({
        title: isRTL ? "تم إرسال طلب الدفع" : "Payment Request Sent",
        description: isRTL ? "تم إرسال طلب الدفع بنجاح" : "Payment request has been sent successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في إرسال طلب الدفع" : "Error Sending Payment Request",
        description: isRTL ? "حدث خطأ أثناء إرسال طلب الدفع" : "An error occurred while sending payment request",
        variant: "destructive",
      });
    }
  };

  const handleApprovePayment = async (paymentRequestId: string) => {
    try {
      await approvePaymentRequestMutation.mutateAsync(paymentRequestId);
      
      toast({
        title: isRTL ? "تم الموافقة على الدفع" : "Payment Approved",
        description: isRTL ? "تم الموافقة على طلب الدفع بنجاح" : "Payment request has been approved successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في الموافقة على الدفع" : "Error Approving Payment",
        description: isRTL ? "حدث خطأ أثناء الموافقة على الدفع" : "An error occurred while approving payment",
        variant: "destructive",
      });
    }
  };

  const handleRejectPayment = async (paymentRequestId: string, reason: string) => {
    try {
      await rejectPaymentRequestMutation.mutateAsync({
        id: paymentRequestId,
        reason
      });
      
      toast({
        title: isRTL ? "تم رفض الدفع" : "Payment Rejected",
        description: isRTL ? "تم رفض طلب الدفع بنجاح" : "Payment request has been rejected successfully",
      });
    } catch (error) {
      toast({
        title: isRTL ? "خطأ في رفض الدفع" : "Error Rejecting Payment",
        description: isRTL ? "حدث خطأ أثناء رفض الدفع" : "An error occurred while rejecting payment",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = (contractId: string) => {
    console.log('Send message for contract:', contractId);
    // Navigate to messages or open message modal
  };

  const handleViewContract = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      setSelectedContract(contract);
      setShowContractDetails(true);
    }
  };

  const handleUpdateMilestoneForModal = async (contractId: string, milestoneId: string, updates: Partial<MilestoneResponse>) => {
    try {
      const request: UpdateMilestoneRequest = {
        title: updates.title,
        description: updates.description,
        amount: updates.amount,
        dueDate: updates.dueDate,
        orderIndex: updates.orderIndex
      };

      await updateMilestoneMutation.mutateAsync({
        contractId,
        milestoneId,
        request
      });
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

   const handleRequestPaymentForModal = async (contractId: string, milestoneId: string, amount: number) => {
     await handleRequestPayment(contractId, milestoneId, amount);
   };

   const handleAcceptContract = async (contractId: string) => {
     try {
       await acceptContractMutation.mutateAsync(contractId);
       toast({
         title: isRTL ? "تم قبول العقد" : "Contract Accepted",
         description: isRTL ? "تم قبول العقد بنجاح" : "Contract has been accepted successfully",
       });
     } catch (error) {
       toast({
         title: isRTL ? "خطأ في قبول العقد" : "Error Accepting Contract",
         description: isRTL ? "حدث خطأ أثناء قبول العقد" : "An error occurred while accepting the contract",
         variant: "destructive",
       });
     }
   };

   const handleRejectContract = async (contractId: string) => {
     try {
       await rejectContractMutation.mutateAsync(contractId);
       toast({
         title: isRTL ? "تم رفض العقد" : "Contract Rejected",
         description: isRTL ? "تم رفض العقد بنجاح" : "Contract has been rejected successfully",
       });
     } catch (error) {
       toast({
         title: isRTL ? "خطأ في رفض العقد" : "Error Rejecting Contract",
         description: isRTL ? "حدث خطأ أثناء رفض العقد" : "An error occurred while rejecting the contract",
         variant: "destructive",
       });
     }
   };

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL && "rtl")} dir={isRTL ? "rtl" : "ltr"}>
      <Header isRTL={isRTL} onLanguageToggle={toggleLanguage} />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0A2540] mb-2">
            {isRTL ? "إدارة العقود والمراحل" : "Contract & Milestone Management"}
          </h1>
          <p className="text-muted-foreground">
            {isRTL 
              ? "إدارة العقود والمراحل مع تتبع التقدم والمدفوعات" 
              : "Manage contracts and milestones with progress tracking and payments"
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "إجمالي العقود" : "Total Contracts"}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A2540]">
                {(isClientUser && myContractsLoading) || (isFreelancerUser && freelancerContractsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  totalContracts
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "العقود النشطة" : "Active Contracts"}
              </CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(isClientUser && myContractsLoading) || (isFreelancerUser && freelancerContractsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  activeContracts
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "المراحل المكتملة" : "Completed Milestones"}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(isClientUser && myContractsLoading) || (isFreelancerUser && freelancerContractsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  completedMilestones
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? "إجمالي المدفوعات" : "Total Payments"}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(isClientUser && myPaymentRequestsLoading) || (isFreelancerUser && myPaymentRequestsLoading) ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  `$${totalPayments.toLocaleString()}`
                )}
              </div>
            </CardContent>
          </Card>
        </div>

         {/* Review Prompts Section */}
         <ReviewPromptsList 
           opportunities={pendingReviewsData?.content || []}
           className="mb-8"
         />

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
                  {isRTL ? "البحث في العقود" : "Search Contracts"}
                </Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isRTL ? "ابحث في العقود..." : "Search contracts..."}
                />
              </div>
              
              <div className="md:w-48">
                <Label htmlFor="status">
                  {isRTL ? "حالة العقد" : "Contract Status"}
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isRTL ? "الكل" : "All"}
                    </SelectItem>
                    <SelectItem value="active">
                      {isRTL ? "نشط" : "Active"}
                    </SelectItem>
                    <SelectItem value="completed">
                      {isRTL ? "مكتمل" : "Completed"}
                    </SelectItem>
                    <SelectItem value="cancelled">
                      {isRTL ? "ملغي" : "Cancelled"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

         {/* Main Content */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
           <TabsList className={`grid w-full ${isFreelancerUser ? 'grid-cols-4' : 'grid-cols-3'} mb-6`}>
             {isFreelancerUser && (
               <TabsTrigger value="acceptance">
                 <Clock className="h-4 w-4 mr-2" />
                 {isRTL ? "الانتظار" : "Awaiting"}
               </TabsTrigger>
             )}
             <TabsTrigger value="contracts">
               <FileText className="h-4 w-4 mr-2" />
               {isRTL ? "العقود" : "Contracts"}
             </TabsTrigger>
             <TabsTrigger value="milestones">
               <Target className="h-4 w-4 mr-2" />
               {isRTL ? "المراحل" : "Milestones"}
             </TabsTrigger>
             <TabsTrigger value="payments">
               <DollarSign className="h-4 w-4 mr-2" />
               {isRTL ? "المدفوعات" : "Payments"}
             </TabsTrigger>
           </TabsList>

           {/* Awaiting Acceptance Tab - Only for Freelancers */}
           {isFreelancerUser && (
             <TabsContent value="acceptance" className="space-y-6">
               {freelancerContractsLoading ? (
                 <div className="flex items-center justify-center py-12">
                   <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                   <span className="ml-3 text-gray-600">
                     {isRTL ? "جاري تحميل العقود..." : "Loading contracts..."}
                   </span>
                 </div>
               ) : (
                 <div className="space-y-6">
                   {contracts.filter(c => c.status === ContractStatus.PENDING).length === 0 ? (
                     <Card>
                       <CardContent className="p-8 text-center">
                         <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                         <h3 className="text-lg font-medium text-gray-900 mb-2">
                           {isRTL ? "لا توجد عقود في الانتظار" : "No Pending Contracts"}
                         </h3>
                         <p className="text-gray-500">
                           {isRTL 
                             ? "جميع العقود قد تم التعامل معها"
                             : "All contracts have been reviewed"
                           }
                         </p>
                       </CardContent>
                     </Card>
                   ) : (
                     contracts
                       .filter(c => c.status === ContractStatus.PENDING)
                       .map((contract) => (
                         <ContractAcceptanceFlow
                           key={contract.id}
                           contract={contract}
                           onAccept={handleAcceptContract}
                           onReject={handleRejectContract}
                           isLoading={acceptContractMutation.isPending || rejectContractMutation.isPending}
                         />
                       ))
                   )}
                 </div>
               )}
             </TabsContent>
           )}

           {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            {(isClientUser && myContractsLoading) || (isFreelancerUser && freelancerContractsLoading) ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">
                  {isRTL ? "جاري تحميل العقود..." : "Loading contracts..."}
                </span>
              </div>
            ) : (isClientUser && myContractsError) || (isFreelancerUser && freelancerContractsError) ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isRTL ? "خطأ في تحميل العقود" : "Error Loading Contracts"}
                  </h3>
                  <p className="text-gray-500">
                    {isRTL 
                      ? "حدث خطأ أثناء جلب العقود"
                      : "An error occurred while fetching contracts"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredContracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#0A2540]">
                            {contract.title}
                          </h3>
                          <Badge className={getStatusColor(contract.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(contract.status)}
                              {getStatusText(contract.status)}
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {contract.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold">
                              {contract.totalAmount} {contract.currency}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{contract.startDate} - {contract.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{(contract.milestones || []).length} {isRTL ? "مرحلة" : "milestones"}</span>
                          </div>
                        </div>

                         {/* Milestones Count */}
                         <div className="mb-4">
                           <div className="flex items-center justify-between">
                             <span className="text-sm font-medium text-gray-700">
                               {isRTL ? "المراحل المكتملة" : "Milestones Completed"}
                             </span>
                             <span className="text-sm font-semibold text-gray-900">
                               {(contract.milestones || []).filter(m => m.status === MilestoneStatus.COMPLETED || m.status === MilestoneStatus.PAID).length}/{(contract.milestones || []).length}
                             </span>
                           </div>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                         <Button
                           size="sm"
                           variant="outline"
                           onClick={() => {
                             setSelectedContract(contract);
                             setNewMilestone({
                               title: '',
                               description: '',
                               amount: '',
                               dueDate: '',
                               orderIndex: (contract.milestones || []).length + 1
                             });
                             setShowMilestoneDialog(true);
                           }}
                         >
                           <Plus className="h-4 w-4 mr-1" />
                           {isRTL ? "إضافة مرحلة" : "Add Milestone"}
                         </Button>
                       </div>
                    </div>

                        {/* Milestones Preview */}
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            {isRTL ? "المراحل" : "Milestones"}
                          </h4>
                           
                          <div className="space-y-2">
                            {(contract.milestones || []).length === 0 ? (
                              <div className="text-center py-6">
                                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                  {isRTL ? "لا توجد مراحل" : "No milestones yet"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {isRTL ? "أضف مرحلة جديدة لبدء المشروع" : "Add a milestone to get started"}
                                </p>
                              </div>
                            ) : (
                              <>
                                {sortMilestonesByDate(contract.milestones || []).map((milestone) => (
                                  <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                      <Badge className={getStatusColor(milestone.status)}>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(milestone.status)}
                                          {getStatusText(milestone.status)}
                                        </div>
                                      </Badge>
                                      <div>
                                        <h5 className="text-sm font-medium">{milestone.title}</h5>
                                        <p className="text-xs text-gray-500">{milestone.dueDate}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold">
                                        {milestone.amount} {contract.currency}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEditMilestone(milestone)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredContracts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRTL ? "لا توجد عقود" : "No Contracts"}
                    </h3>
                    <p className="text-gray-500">
                      {isRTL 
                        ? "لم يتم العثور على عقود تطابق معايير البحث"
                        : "No contracts match your search criteria"
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            )}
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            {(isClientUser && myContractsLoading) || (isFreelancerUser && freelancerContractsLoading) ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">
                  {isRTL ? "جاري تحميل المراحل..." : "Loading milestones..."}
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {contracts.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isRTL ? "لا توجد عقود" : "No Contracts"}
                      </h3>
                      <p className="text-gray-500">
                        {isRTL 
                          ? "لا توجد عقود لعرض المراحل الخاصة بها"
                          : "No contracts to display milestones for"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  contracts.map((contract) => (
                <Card key={contract.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                    {contract.title}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedContract(contract);
                          setNewMilestone({
                            title: '',
                            description: '',
                            amount: '',
                            dueDate: '',
                            orderIndex: (contract.milestones || []).length + 1
                          });
                          setShowMilestoneDialog(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {isRTL ? "إضافة مرحلة" : "Add Milestone"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                       <div className="space-y-4">
                         {(contract.milestones || []).length === 0 ? (
                           <div className="text-center py-8">
                             <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                             <p className="text-sm text-gray-500">
                               {isRTL ? "لا توجد مراحل لهذا العقد" : "No milestones for this contract"}
                             </p>
                             <p className="text-xs text-gray-400">
                               {isRTL ? "أضف مرحلة جديدة لبدء العمل" : "Add a milestone to get started"}
                             </p>
                           </div>
                         ) : (
                           sortMilestonesByDate(contract.milestones || []).map((milestone) => {
                             const isContractActive = contract.status === ContractStatus.ACTIVE;
                             const availableStatuses = getAvailableMilestoneStatuses(milestone.status);
                             
                             return (
                               <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg">
                                 <div className="flex items-center gap-4 flex-1">
                                   <div className="flex items-center gap-2">
                                     <Badge className={getStatusColor(milestone.status)}>
                                       <div className="flex items-center gap-1">
                                         {getStatusIcon(milestone.status)}
                                         {getStatusText(milestone.status)}
                                       </div>
                                     </Badge>
                                   </div>
                                   
                                   <div className="flex-1">
                                     <h4 className="font-semibold">{milestone.title}</h4>
                                     <p className="text-sm text-gray-600">{milestone.description}</p>
                                     <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                       <span>{milestone.amount} {contract.currency}</span>
                                       <span>{milestone.dueDate}</span>
                                       {milestone.completedDate && (
                                         <span>{isRTL ? "مكتمل في" : "Completed"} {milestone.completedDate}</span>
                                       )}
                                     </div>
                                   </div>
                                 </div>
                               
                                 <div className="flex items-center gap-2">
                                   <Select 
                                     value={milestone.status} 
                                     onValueChange={(value) => handleUpdateMilestoneStatus(contract.id, milestone.id, value)}
                                     disabled={!isContractActive}
                                   >
                                      <SelectTrigger className={cn("w-40", !isContractActive && "opacity-50 cursor-not-allowed")}>
                                        <SelectValue />
                                      </SelectTrigger>
                                     <SelectContent>
                                       <SelectItem value="PENDING" disabled={milestone.status !== 'PENDING'}>
                                         <div className="flex items-center gap-2">
                                           <Clock className="h-4 w-4" />
                                           {isRTL ? "في الانتظار" : "Pending"}
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="IN_PROGRESS" disabled={!availableStatuses.includes('IN_PROGRESS')}>
                                         <div className="flex items-center gap-2">
                                           <Play className="h-4 w-4" />
                                           {isRTL ? "قيد التنفيذ" : "In Progress"}
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="COMPLETED" disabled={!availableStatuses.includes('COMPLETED')}>
                                         <div className="flex items-center gap-2">
                                           <CheckCircle className="h-4 w-4" />
                                           {isRTL ? "مكتمل" : "Completed"}
                                         </div>
                                       </SelectItem>
                                       <SelectItem value="PAID" disabled={!availableStatuses.includes('PAID')}>
                                         <div className="flex items-center gap-2">
                                           <CheckCircle className="h-4 w-4" />
                                           {isRTL ? "مدفوع" : "Paid"}
                                         </div>
                                       </SelectItem>
                                     </SelectContent>
                                   </Select>
                                   
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => handleEditMilestone(milestone)}
                                     disabled={!isContractActive}
                                   >
                                     <Edit className="h-4 w-4" />
                                   </Button>
                                   
                                   <Button
                                     size="sm"
                                     variant="outline"
                                     onClick={() => handleDeleteMilestone(contract.id, milestone.id)}
                                     disabled={!isContractActive}
                                   >
                                     <Trash2 className="h-4 w-4" />
                                   </Button>
                                 </div>
                               </div>
                             );
                           })
                         )}
                    </div>
                  </CardContent>
                </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {(isClientUser && receivedPaymentRequestsLoading) || (isFreelancerUser && myPaymentRequestsLoading) ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="ml-3 text-gray-600">
                  {isRTL ? "جاري تحميل طلبات الدفع..." : "Loading payment requests..."}
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentRequests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {isRTL ? "لا توجد طلبات دفع" : "No Payment Requests"}
                      </h3>
                      <p className="text-gray-500">
                        {isRTL 
                          ? "لم يتم العثور على أي طلبات دفع بعد"
                          : "No payment requests have been made yet"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  paymentRequests.map((payment) => (
                    <Card key={payment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(payment.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(payment.status)}
                                {getStatusText(payment.status)}
                              </div>
                            </Badge>
                            
                            <div>
                              <h4 className="font-semibold">{payment.description}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{payment.amount} {payment.currency}</span>
                                <span>{new Date(payment.requestedAt).toLocaleDateString()}</span>
                                {payment.approvedAt && (
                                  <span>{isRTL ? "موافق عليه في" : "Approved"} {new Date(payment.approvedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {payment.status === PaymentRequestStatus.PENDING && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprovePayment(payment.id)}
                                  disabled={approvePaymentRequestMutation.isPending}
                                >
                                  {approvePaymentRequestMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  {isRTL ? "موافقة" : "Approve"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectPayment(payment.id, '')}
                                  disabled={rejectPaymentRequestMutation.isPending}
                                >
                                  {rejectPaymentRequestMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4 mr-1" />
                                  )}
                                  {isRTL ? "رفض" : "Reject"}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Milestone Dialog */}
        <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "إضافة مرحلة جديدة" : "Add New Milestone"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="milestoneTitle">
                  {isRTL ? "عنوان المرحلة" : "Milestone Title"}
                </Label>
                <Input
                  id="milestoneTitle"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={isRTL ? "أدخل عنوان المرحلة..." : "Enter milestone title..."}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="milestoneDescription">
                  {isRTL ? "وصف المرحلة" : "Milestone Description"}
                </Label>
                <Textarea
                  id="milestoneDescription"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isRTL ? "أدخل وصف المرحلة..." : "Enter milestone description..."}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="milestoneAmount">
                    {isRTL ? "المبلغ" : "Amount"}
                  </Label>
                  <Input
                    id="milestoneAmount"
                    type="number"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder={isRTL ? "أدخل المبلغ..." : "Enter amount..."}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="milestoneDueDate">
                    {isRTL ? "تاريخ الاستحقاق" : "Due Date"}
                  </Label>
                  <Input
                    id="milestoneDueDate"
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateMilestone} 
                  className="bg-[#0A2540] hover:bg-[#142b52]"
                  disabled={createMilestoneMutation.isPending}
                >
                  {createMilestoneMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isRTL ? "إنشاء المرحلة" : "Create Milestone"}
                </Button>
                <Button variant="outline" onClick={() => setShowMilestoneDialog(false)}>
                  <X className="h-4 w-4 mr-2" />
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Milestone Dialog */}
        <Dialog open={showEditMilestoneDialog} onOpenChange={setShowEditMilestoneDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isRTL ? "تعديل المرحلة" : "Edit Milestone"}
              </DialogTitle>
            </DialogHeader>
            {selectedMilestone && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editMilestoneTitle">
                    {isRTL ? "عنوان المرحلة" : "Milestone Title"}
                  </Label>
                  <Input
                    id="editMilestoneTitle"
                    value={selectedMilestone.title}
                    onChange={(e) => setSelectedMilestone(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editMilestoneDescription">
                    {isRTL ? "وصف المرحلة" : "Milestone Description"}
                  </Label>
                  <Textarea
                    id="editMilestoneDescription"
                    value={selectedMilestone.description}
                    onChange={(e) => setSelectedMilestone(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editMilestoneAmount">
                      {isRTL ? "المبلغ" : "Amount"}
                    </Label>
                    <Input
                      id="editMilestoneAmount"
                      type="number"
                      value={selectedMilestone.amount}
                      onChange={(e) => setSelectedMilestone(prev => prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editMilestoneDueDate">
                      {isRTL ? "تاريخ الاستحقاق" : "Due Date"}
                    </Label>
                    <Input
                      id="editMilestoneDueDate"
                      type="date"
                      value={selectedMilestone.dueDate}
                      onChange={(e) => setSelectedMilestone(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                    />
                  </div>
            </div>
            
                <div className="flex gap-2">
                  <Button 
                    onClick={() => selectedMilestone && handleUpdateMilestone(selectedMilestone)} 
                    className="bg-[#0A2540] hover:bg-[#142b52]"
                    disabled={updateMilestoneMutation.isPending}
                  >
                    {updateMilestoneMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isRTL ? "حفظ التغييرات" : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditMilestoneDialog(false)}>
                    <X className="h-4 w-4 mr-2" />
                    {isRTL ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      {/* Contract Details Modal */}
      <ContractDetailsModal
        contract={selectedContract}
        milestones={sortMilestonesByDate(contracts.flatMap(c => c.milestones || []))}
        paymentRequests={paymentRequests}
        isOpen={showContractDetails}
        onClose={() => {
          setShowContractDetails(false);
          setSelectedContract(null);
        }}
        userType={userType}
        isRTL={isRTL}
        onUpdateMilestone={handleUpdateMilestoneForModal}
        onRequestPayment={handleRequestPaymentForModal}
        onApprovePayment={handleApprovePayment}
        onRejectPayment={handleRejectPayment}
        onSendMessage={handleSendMessage}
      />
      </main>

      <Footer isRTL={isRTL} />
    </div>
  );
}