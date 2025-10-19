import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useToast } from '@/hooks/use-toast';
import { ContractResponse, MilestoneResponse } from '@/types/contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  Calendar,
  DollarSign,
  CheckCircle,
  X,
  Clock,
  FileText,
  User,
  Briefcase,
} from 'lucide-react';

interface ContractAcceptanceFlowProps {
  contract: ContractResponse;
  onAccept: (contractId: string) => Promise<void>;
  onReject: (contractId: string) => Promise<void>;
  isLoading?: boolean;
}

export function ContractAcceptanceFlow({
  contract,
  onAccept,
  onReject,
  isLoading = false,
}: ContractAcceptanceFlowProps) {
  const { isRTL } = useLocalization();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept(contract.id);
      toast({
        title: isRTL ? 'تم قبول العقد' : 'Contract Accepted',
        description: isRTL
          ? 'تم قبول العقد بنجاح وأصبح نشطاً'
          : 'Contract has been accepted and is now active',
      });
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ في قبول العقد' : 'Error Accepting Contract',
        description: isRTL
          ? 'حدث خطأ أثناء قبول العقد'
          : 'An error occurred while accepting the contract',
        variant: 'destructive',
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    if (confirm(isRTL ? 'هل أنت متأكد من رفض هذا العقد؟' : 'Are you sure you want to reject this contract?')) {
      setIsRejecting(true);
      try {
        await onReject(contract.id);
        toast({
          title: isRTL ? 'تم رفض العقد' : 'Contract Rejected',
          description: isRTL
            ? 'تم رفض العقد'
            : 'Contract has been rejected',
        });
      } catch (error) {
        toast({
          title: isRTL ? 'خطأ في رفض العقد' : 'Error Rejecting Contract',
          description: isRTL
            ? 'حدث خطأ أثناء رفض العقد'
            : 'An error occurred while rejecting the contract',
          variant: 'destructive',
        });
      } finally {
        setIsRejecting(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      PAID: 'bg-green-100 text-green-800',
      ACTIVE: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      PENDING: isRTL ? 'في الانتظار' : 'Pending',
      IN_PROGRESS: isRTL ? 'قيد التنفيذ' : 'In Progress',
      COMPLETED: isRTL ? 'مكتمل' : 'Completed',
      PAID: isRTL ? 'مدفوع' : 'Paid',
      ACTIVE: isRTL ? 'نشط' : 'Active',
      CANCELLED: isRTL ? 'ملغي' : 'Cancelled',
    };
    return texts[status] || status;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: contract.currency || 'USD',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{contract.title}</CardTitle>
              <CardDescription>{contract.projectTitle}</CardDescription>
            </div>
            <Badge className={getStatusColor(contract.status)}>
              {getStatusText(contract.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{isRTL ? 'العميل' : 'Client'}</p>
                  <p className="font-medium">{contract.clientName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{isRTL ? 'الإجمالي' : 'Total Amount'}</p>
                  <p className="font-medium text-lg">{formatCurrency(contract.totalAmount)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{isRTL ? 'تاريخ البدء' : 'Start Date'}</p>
                  <p className="font-medium">{formatDate(contract.startDate)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{isRTL ? 'المشروع' : 'Project'}</p>
                  <p className="font-medium">{contract.projectTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{isRTL ? 'تاريخ الانتهاء' : 'End Date'}</p>
                  <p className="font-medium">{formatDate(contract.endDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">{isRTL ? 'العملة' : 'Currency'}</p>
                  <p className="font-medium">{contract.currency}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {isRTL ? 'الوصف' : 'Description'}
            </p>
            <p className="text-gray-600">{contract.description}</p>
          </div>
        </CardContent>
      </Card>

      {contract.milestones && contract.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? 'المراحل' : 'Milestones'}</CardTitle>
            <CardDescription>
              {isRTL ? 'المراحل المحددة مسبقاً للمشروع' : 'Pre-defined project milestones'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract.milestones.map((milestone, index) => (
                <div key={milestone.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                    <Badge variant="outline">
                      {formatCurrency(milestone.amount)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}:</span>
                      <p className="font-medium">{formatDate(milestone.dueDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{isRTL ? 'الحالة' : 'Status'}:</span>
                      <p className="font-medium">{milestone.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className="text-lg font-bold">
                  {formatCurrency(
                    contract.milestones.reduce((sum, m) => sum + m.amount, 0)
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <CardTitle className="text-base">{isRTL ? 'ملخص العقد' : 'Contract Summary'}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {isRTL
              ? 'تم إنشاء هذا العقد تلقائياً بناءً على اقتراحك المقبول. يحتوي على شروط المشروع والمراحل المحددة مسبقاً.'
              : 'This contract was automatically created based on your accepted proposal. It contains the project terms and pre-defined milestones.'}
          </p>
          <p>
            {isRTL
              ? 'بقبولك لهذا العقد، فإنك توافق على الشروط والمراحل المذكورة أعلاه.'
              : 'By accepting this contract, you agree to the terms and milestones mentioned above.'}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={handleReject}
          disabled={isAccepting || isRejecting || isLoading}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          {isRTL ? 'رفض' : 'Reject'}
        </Button>
        <Button
          onClick={handleAccept}
          disabled={isAccepting || isRejecting || isLoading}
          className="flex items-center gap-2"
        >
          {isAccepting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              {isRTL ? 'جاري القبول...' : 'Accepting...'}
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              {isRTL ? 'قبول العقد' : 'Accept Contract'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
