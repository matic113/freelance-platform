import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Milestone, Contract, MilestoneResponse, ContractResponse } from '@/types/contract';
import { cn } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: MilestoneResponse;
  contract: ContractResponse;
  userType: 'client' | 'freelancer';
  isRTL?: boolean;
  onUpdateMilestone?: (contractId: string, milestoneId: string, updates: Partial<MilestoneResponse>) => void;
  onRequestPayment?: (contractId: string, milestoneId: string, amount: number) => void;
  onApprovePayment?: (milestoneId: string) => void;
  onRejectPayment?: (milestoneId: string, reason: string) => void;
  onEdit?: (milestone: MilestoneResponse) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  contract,
  userType,
  isRTL = false,
  onUpdateMilestone,
  onRequestPayment,
  onApprovePayment,
  onRejectPayment,
  onEdit
}) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      PENDING: isRTL ? 'في الانتظار' : 'Pending',
      IN_PROGRESS: isRTL ? 'قيد التنفيذ' : 'In Progress',
      COMPLETED: isRTL ? 'مكتمل' : 'Completed',
      PAID: isRTL ? 'مدفوع' : 'Paid'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

   const canEdit = userType === 'client' && (contract.status === 'active' || contract.status === 'pending') && milestone.status === 'PENDING';
   const canMarkComplete = userType === 'freelancer' && milestone.status === 'IN_PROGRESS';
   const canRequestPayment = userType === 'freelancer' && milestone.status === 'COMPLETED';
   const canApprovePayment = userType === 'client' && milestone.status === 'COMPLETED';
   const canRejectPayment = userType === 'client' && milestone.status === 'COMPLETED';

  const handleRejectPayment = () => {
    if (rejectionReason.trim()) {
      onRejectPayment?.(milestone.id, rejectionReason);
      setRejectionReason('');
      setShowRejectDialog(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-[#0A2540] mb-1">
              {milestone.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {milestone.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(milestone.status)}
            <Badge className={cn("text-xs", getStatusColor(milestone.status))}>
              {getStatusText(milestone.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Milestone Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {isRTL ? 'المبلغ' : 'Amount'}
            </span>
            <span className="font-semibold">
              {milestone.amount} {contract?.currency || 'USD'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-gray-600">
              {isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}
            </span>
            <span className="font-semibold">
              {new Date(milestone.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Completion Date */}
        {milestone.completedDate && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {isRTL ? 'تاريخ الإكمال' : 'Completed on'}
            </span>
            <span className="font-semibold">
              {new Date(milestone.completedDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Payment Date */}
        {milestone.paidDate && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">
              {isRTL ? 'تاريخ الدفع' : 'Paid on'}
            </span>
            <span className="font-semibold">
              {new Date(milestone.paidDate).toLocaleDateString()}
            </span>
          </div>
        )}

         {/* Actions */}
         <div className="flex gap-2 pt-2">
           {canEdit && (
             <Button
               size="sm"
               variant="outline"
               onClick={() => onEdit?.(milestone)}
             >
               <Edit className="h-4 w-4 mr-2" />
               {isRTL ? 'تعديل' : 'Edit'}
             </Button>
           )}

           {canMarkComplete && (
             <Button
               size="sm"
               onClick={() => onUpdateMilestone?.(contract.id, milestone.id, { status: 'COMPLETED' as any })}
               className="bg-green-600 hover:bg-green-700"
             >
               <CheckCircle className="h-4 w-4 mr-2" />
               {isRTL ? 'تم الإكمال' : 'Mark Complete'}
             </Button>
           )}
          
          {canRequestPayment && (
            <Button
              size="sm"
              onClick={() => onRequestPayment?.(contract.id, milestone.id, milestone.amount)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {isRTL ? 'طلب الدفع' : 'Request Payment'}
            </Button>
          )}
          
          {canApprovePayment && (
            <Button
              size="sm"
              onClick={() => onApprovePayment?.(milestone.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'موافقة الدفع' : 'Approve Payment'}
            </Button>
          )}
          
          {canRejectPayment && (
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {isRTL ? 'رفض الدفع' : 'Reject Payment'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isRTL ? 'رفض طلب الدفع' : 'Reject Payment Request'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason">
                      {isRTL ? 'سبب الرفض' : 'Rejection Reason'}
                    </Label>
                    <Textarea
                      id="reason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={isRTL ? 'أدخل سبب رفض طلب الدفع...' : 'Enter reason for rejecting payment request...'}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRejectPayment}
                      variant="destructive"
                      disabled={!rejectionReason.trim()}
                    >
                      {isRTL ? 'رفض الدفع' : 'Reject Payment'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectDialog(false)}
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
