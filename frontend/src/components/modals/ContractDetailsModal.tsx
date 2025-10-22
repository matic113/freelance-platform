import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  User, 
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Plus,
  Eye
} from 'lucide-react';
import { Contract, Milestone, PaymentRequest, ContractResponse, MilestoneResponse, PaymentResponse } from '@/types/contract';
import { MilestoneCard } from '@/components/contracts/MilestoneCard';
import { PaymentRequestCard } from '@/components/contracts/PaymentRequestCard';
import { cn } from '@/lib/utils';

interface ContractDetailsModalProps {
  contract: ContractResponse | null;
  milestones: MilestoneResponse[];
  paymentRequests: PaymentResponse[];
  isOpen: boolean;
  onClose: () => void;
  userType: 'client' | 'freelancer';
  isRTL?: boolean;
  onUpdateMilestone?: (contractId: string, milestoneId: string, updates: Partial<MilestoneResponse>) => void;
  onRequestPayment?: (contractId: string, milestoneId: string, amount: number) => void;
  onApprovePayment?: (paymentRequestId: string) => void;
  onRejectPayment?: (paymentRequestId: string, reason: string) => void;
  onSendMessage?: (contractId: string) => void;
  onAddMilestone?: (contractId: string) => void;
  onEditMilestone?: (milestone: MilestoneResponse) => void;
}

export const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  milestones,
  paymentRequests,
  isOpen,
  onClose,
  userType,
  isRTL = false,
  onUpdateMilestone,
  onRequestPayment,
  onApprovePayment,
  onRejectPayment,
  onSendMessage,
  onAddMilestone,
  onEditMilestone
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!contract) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      disputed: 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: isRTL ? 'في الانتظار' : 'Pending',
      active: isRTL ? 'نشط' : 'Active',
      completed: isRTL ? 'مكتمل' : 'Completed',
      cancelled: isRTL ? 'ملغي' : 'Cancelled',
      disputed: isRTL ? 'متنازع عليه' : 'Disputed'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const contractMilestones = milestones.filter(m => m.contractId === contract.id);
  const contractPaymentRequests = paymentRequests.filter(pr => pr.contractId === contract.id);

  const completedMilestones = contractMilestones.filter(m => m.status === 'completed').length;
  const totalMilestones = contractMilestones.length;
  const paidAmount = contractPaymentRequests
    .filter(pr => pr.status === 'approved')
    .reduce((sum, pr) => sum + pr.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {contract.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={cn("text-xs", getStatusColor(contract.status))}>
                  {getStatusText(contract.status)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {contract.totalAmount.toLocaleString()} {contract.currency}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">
                {isRTL ? 'تم إنشاء العقد في' : 'Contract created on'} {new Date(contract.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Contract Details Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                {isRTL ? 'نظرة عامة' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="milestones">
                {isRTL ? 'المراحل' : 'Milestones'} ({totalMilestones})
              </TabsTrigger>
              <TabsTrigger value="payments">
                {isRTL ? 'المدفوعات' : 'Payments'} ({contractPaymentRequests.length})
              </TabsTrigger>
              <TabsTrigger value="messages">
                {isRTL ? 'الرسائل' : 'Messages'}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contract Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {isRTL ? 'تفاصيل العقد' : 'Contract Details'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          {contract.totalAmount.toLocaleString()} {contract.currency}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isRTL ? 'إجمالي المبلغ' : 'Total Amount'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">
                          {paidAmount.toLocaleString()} {contract.currency}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isRTL ? 'المبلغ المدفوع' : 'Amount Paid'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">
                          {new Date(contract.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {isRTL ? 'التقدم' : 'Progress'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{isRTL ? 'المراحل المكتملة' : 'Completed Milestones'}</span>
                        <span>{completedMilestones}/{totalMilestones}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{isRTL ? 'المبلغ المدفوع' : 'Amount Paid'}</span>
                        <span>{Math.round((paidAmount / contract.totalAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(paidAmount / contract.totalAmount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {isRTL ? 'وصف المشروع' : 'Project Description'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {contract.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Milestones Tab */}
            <TabsContent value="milestones" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {isRTL ? 'مراحل المشروع' : 'Project Milestones'}
                </h3>
                {userType === 'client' && (contract.status === 'active' || contract.status === 'pending') && onAddMilestone && (
                  <Button 
                    size="sm" 
                    className="bg-[#0A2540] hover:bg-[#142b52]"
                    onClick={() => onAddMilestone(contract.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isRTL ? 'إضافة مرحلة' : 'Add Milestone'}
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {contractMilestones.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {isRTL ? "لا توجد مراحل بعد" : "No milestones yet"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isRTL ? "أضف مرحلة جديدة لبدء المشروع" : "Add a milestone to get started"}
                    </p>
                  </div>
                 ) : (
                   contractMilestones.map((milestone) => (
                     <MilestoneCard
                       key={milestone.id}
                       milestone={milestone}
                       contract={contract}
                       userType={userType}
                       isRTL={isRTL}
                       onUpdateMilestone={onUpdateMilestone}
                       onRequestPayment={onRequestPayment}
                       onRejectPayment={onRejectPayment}
                       onEdit={onEditMilestone}
                     />
                   ))
                 )}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              <h3 className="text-lg font-semibold">
                {isRTL ? 'طلبات الدفع' : 'Payment Requests'}
              </h3>

              <div className="space-y-3">
                {contractPaymentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      {isRTL ? "لا توجد طلبات دفع بعد" : "No payment requests yet"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isRTL ? "سيتم عرض طلبات الدفع هنا عند إنشائها" : "Payment requests will appear here when created"}
                    </p>
                  </div>
                ) : (
                  contractPaymentRequests.map((paymentRequest) => (
                    <PaymentRequestCard
                      key={paymentRequest.id}
                      paymentRequest={paymentRequest}
                      contract={contract}
                      milestone={contractMilestones.find(m => m.id === paymentRequest.milestoneId)}
                      userType={userType}
                      isRTL={isRTL}
                      onApprove={onApprovePayment}
                      onReject={onRejectPayment}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? 'الرسائل' : 'Messages'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isRTL ? 'تواصل مع الطرف الآخر حول هذا العقد' : 'Communicate with the other party about this contract'}
                </p>
                <Button 
                  onClick={() => onSendMessage?.(contract.id)}
                  className="bg-[#0A2540] hover:bg-[#142b52]"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {isRTL ? 'إرسال رسالة' : 'Send Message'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={() => onSendMessage?.(contract.id)}
              variant="outline"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'إرسال رسالة' : 'Send Message'}
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
