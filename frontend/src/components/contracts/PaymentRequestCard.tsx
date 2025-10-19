import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import { PaymentRequest, Contract, Milestone, PaymentResponse, ContractResponse, MilestoneResponse } from '@/types/contract';
import { cn } from '@/lib/utils';

interface PaymentRequestCardProps {
  paymentRequest: PaymentResponse;
  contract: ContractResponse;
  milestone: MilestoneResponse;
  userType: 'client' | 'freelancer';
  isRTL?: boolean;
  onApprove?: (paymentRequestId: string) => void;
  onReject?: (paymentRequestId: string, reason: string) => void;
  onWithdraw?: (paymentRequestId: string) => void;
}

export const PaymentRequestCard: React.FC<PaymentRequestCardProps> = ({
  paymentRequest,
  contract,
  milestone,
  userType,
  isRTL = false,
  onApprove,
  onReject,
  onWithdraw
}) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      PENDING: isRTL ? 'في الانتظار' : 'Pending',
      APPROVED: isRTL ? 'موافق عليه' : 'Approved',
      REJECTED: isRTL ? 'مرفوض' : 'Rejected',
      PAID: isRTL ? 'مدفوع' : 'Paid'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const canApprove = userType === 'client' && paymentRequest.status === 'PENDING';
  const canReject = userType === 'client' && paymentRequest.status === 'PENDING';
  const canWithdraw = userType === 'freelancer' && paymentRequest.status === 'PENDING';

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject?.(paymentRequest.id, rejectionReason);
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
              {isRTL ? 'طلب دفع للمرحلة' : 'Payment Request for Milestone'}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {milestone.title}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(paymentRequest.status)}
            <Badge className={cn("text-xs", getStatusColor(paymentRequest.status))}>
              {getStatusText(paymentRequest.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {isRTL ? 'المبلغ المطلوب' : 'Requested Amount'}
            </span>
            <span className="font-semibold">
              {paymentRequest.amount} {paymentRequest.currency}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-gray-600">
              {isRTL ? 'تاريخ الطلب' : 'Requested Date'}
            </span>
            <span className="font-semibold">
              {new Date(paymentRequest.requestedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Description */}
        {paymentRequest.description && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'وصف الطلب' : 'Request Description'}
            </Label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {paymentRequest.description}
            </p>
          </div>
        )}

        {/* Contract Info */}
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              {isRTL ? 'معلومات العقد' : 'Contract Information'}
            </span>
          </div>
          <div className="text-sm text-blue-700">
            <p><strong>{isRTL ? 'المشروع' : 'Project'}:</strong> {contract.title}</p>
            <p><strong>{isRTL ? 'المرحلة' : 'Milestone'}:</strong> {milestone.title}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {isRTL ? 'التوقيت' : 'Timeline'}
          </Label>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600">
                {isRTL ? 'تم الطلب في' : 'Requested on'}
              </span>
              <span className="font-semibold">
                {new Date(paymentRequest.requestedAt).toLocaleString()}
              </span>
            </div>
            
            {paymentRequest.approvedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-gray-600">
                  {isRTL ? 'تم الموافقة في' : 'Approved on'}
                </span>
                <span className="font-semibold">
                  {new Date(paymentRequest.approvedAt).toLocaleString()}
                </span>
              </div>
            )}
            
            {paymentRequest.paidAt && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-3 w-3 text-blue-500" />
                <span className="text-gray-600">
                  {isRTL ? 'تم الدفع في' : 'Paid on'}
                </span>
                <span className="font-semibold">
                  {new Date(paymentRequest.paidAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {canApprove && (
            <Button
              size="sm"
              onClick={() => onApprove?.(paymentRequest.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'موافقة' : 'Approve'}
            </Button>
          )}
          
          {canReject && (
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isRTL ? 'رفض' : 'Reject'}
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
                      onClick={handleReject}
                      variant="destructive"
                      disabled={!rejectionReason.trim()}
                    >
                      {isRTL ? 'رفض الطلب' : 'Reject Request'}
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
          
          {canWithdraw && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWithdraw?.(paymentRequest.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'سحب الطلب' : 'Withdraw'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
