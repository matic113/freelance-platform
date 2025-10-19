import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/sections/Footer';
import { useLocalization } from '@/hooks/useLocalization';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus
} from 'lucide-react';
import { MyProposalsTable } from '@/components/proposals/MyProposalsTable';
import { SubmitProposalModal } from '@/components/proposals/SubmitProposalModal';
import { ProposalResponse, ProjectResponse } from '@/types/api';
import { proposalService } from '@/services/proposal.service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function MyProposalsPage() {
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const { user } = useAuth();

  const [proposals, setProposals] = useState<ProposalResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalResponse | null>(null);

  const statusOptions = [
    { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Statuses' },
    { value: 'PENDING', label: isRTL ? 'قيد الانتظار' : 'Pending' },
    { value: 'ACCEPTED', label: isRTL ? 'مقبول' : 'Accepted' },
    { value: 'REJECTED', label: isRTL ? 'مرفوض' : 'Rejected' },
    { value: 'WITHDRAWN', label: isRTL ? 'مسحوب' : 'Withdrawn' }
  ];

  useEffect(() => {
    if (user?.activeRole === 'FREELANCER') {
      fetchProposals(0);
    }
  }, [user]);

  const fetchProposals = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await proposalService.getMyProposals(page, pageSize, 'submittedAt,desc');
      
      let filtered = response.content;

      if (statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter || p.status === statusFilter.toLowerCase());
      }

      if (searchTerm.trim()) {
        filtered = filtered.filter(p =>
          p.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.projectId.toString().includes(searchTerm)
        );
      }

      setProposals(filtered);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل تحميل العروض' : 'Failed to load proposals',
        variant: 'destructive'
      });
     } finally {
       setIsLoading(false);
     }
   };

  const handleWithdraw = async (proposalId: string) => {
    try {
      await proposalService.withdrawProposal(proposalId);
      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم سحب العرض بنجاح' : 'Proposal withdrawn successfully',
      });
      fetchProposals(currentPage);
    } catch (error) {
      console.error('Error withdrawing proposal:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل سحب العرض' : 'Failed to withdraw proposal',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (proposal: ProposalResponse) => {
    setSelectedProposal(proposal);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (proposalId: string) => {
    toast({
      title: isRTL ? 'قريباً' : 'Coming Soon',
      description: isRTL ? 'صفحة التفاصيل قيد الإعداد' : 'Details page coming soon',
    });
  };

  const pendingCount = proposals.filter(p => p.status === 'PENDING' || p.status === 'pending').length;
  const acceptedCount = proposals.filter(p => p.status === 'ACCEPTED' || p.status === 'accepted').length;
  const rejectedCount = proposals.filter(p => p.status === 'REJECTED' || p.status === 'rejected').length;

  if (user?.activeRole !== 'FREELANCER') {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className={cn("text-center", isRTL && "text-right")}>
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isRTL ? 'وصول مرفوض' : 'Access Denied'}
            </h2>
            <p className="text-gray-600">
              {isRTL ? 'هذه الصفحة متاحة فقط للعاملين بالعمل الحر' : 'This page is only available to freelancers'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className={cn("flex-1 py-12 px-4 md:px-8", isRTL && "rtl")}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={cn("mb-8", isRTL && "text-right")}>
            <h1 className="text-4xl font-bold text-[#0A2540] mb-2">
              {isRTL ? 'عروضي' : 'My Proposals'}
            </h1>
            <p className="text-gray-600">
              {isRTL ? 'إدارة وتتبع جميع العروض المقدمة' : 'Manage and track all your submitted proposals'}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={cn("bg-white rounded-lg p-4 border border-gray-200", isRTL && "text-right")}>
              <p className="text-sm text-gray-600 mb-1">
                {isRTL ? 'إجمالي العروض' : 'Total Proposals'}
              </p>
              <p className="text-3xl font-bold text-[#0A2540]">{proposals.length}</p>
            </div>
            <div className={cn("bg-white rounded-lg p-4 border border-blue-200 bg-blue-50", isRTL && "text-right")}>
              <p className="text-sm text-blue-700 font-medium mb-1">
                {isRTL ? 'قيد الانتظار' : 'Pending'}
              </p>
              <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
            </div>
            <div className={cn("bg-white rounded-lg p-4 border border-green-200 bg-green-50", isRTL && "text-right")}>
              <p className="text-sm text-green-700 font-medium mb-1">
                {isRTL ? 'مقبول' : 'Accepted'}
              </p>
              <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
            </div>
            <div className={cn("bg-white rounded-lg p-4 border border-red-200 bg-red-50", isRTL && "text-right")}>
              <p className="text-sm text-red-700 font-medium mb-1">
                {isRTL ? 'مرفوض' : 'Rejected'}
              </p>
              <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
            </div>
          </div>

          {/* Filters */}
          <div className={cn("mb-6 flex gap-4", isRTL && "flex-row-reverse")}>
            <Input
              type="text"
              placeholder={isRTL ? 'ابحث عن المشاريع...' : 'Search projects...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => fetchProposals(currentPage)}
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Proposals Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : proposals.length === 0 ? (
            <div className={cn("bg-white rounded-lg p-12 border border-gray-200 text-center", isRTL && "text-right")}>
              <AlertCircle className={cn("h-12 w-12 text-gray-400 mx-auto mb-4", isRTL && "mx-0")} />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {isRTL ? 'لا توجد عروض' : 'No Proposals'}
              </h3>
              <p className="text-gray-500 mb-6">
                {isRTL ? 'لم تقدم أي عروض بعد. ابدأ بتصفح المشاريع المتاحة' : 'You haven\'t submitted any proposals yet. Start by browsing available projects'}
              </p>
              <Button
                onClick={() => window.location.href = '/available-projects'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isRTL ? 'ابدأ البحث عن المشاريع' : 'Browse Projects'}
              </Button>
            </div>
          ) : (
            <>
              <MyProposalsTable
                proposals={proposals}
                isRTL={isRTL}
                onEdit={handleEdit}
                onWithdraw={handleWithdraw}
                onViewDetails={handleViewDetails}
                isLoading={isLoading}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={cn("flex items-center justify-between mt-6", isRTL && "flex-row-reverse")}>
                  <Button
                    variant="outline"
                    onClick={() => fetchProposals(currentPage - 1)}
                    disabled={currentPage === 0 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {isRTL ? 'السابق' : 'Previous'}
                  </Button>

                  <div className="text-sm text-gray-600">
                    {isRTL ? `صفحة ${currentPage + 1} من ${totalPages}` : `Page ${currentPage + 1} of ${totalPages}`}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => fetchProposals(currentPage + 1)}
                    disabled={currentPage === totalPages - 1 || isLoading}
                  >
                    {isRTL ? 'التالي' : 'Next'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Edit Proposal Modal */}
      {selectedProposal && (
        <SubmitProposalModal
          isOpen={isEditModalOpen}
          project={selectedProposal.project as ProjectResponse}
          isRTL={isRTL}
          isEditing={true}
          initialData={{
            proposedBudget: selectedProposal.proposedBudget,
            estimatedDuration: selectedProposal.estimatedDuration,
            coverLetter: selectedProposal.coverLetter
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProposal(null);
          }}
          onSuccess={() => fetchProposals(currentPage)}
        />
      )}

      <Footer />
    </div>
  );
}
