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
    <div className="space-y-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{contract.title}</CardTitle>
              <CardDescription className="text-xs">{contract.projectTitle}</CardDescription>
            </div>
            <Badge className={`${getStatusColor(contract.status)} whitespace-nowrap`}>
              {getStatusText(contract.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">{isRTL ? 'العميل' : 'Client'}</p>
              <p className="font-medium line-clamp-1">{contract.clientName}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">{isRTL ? 'الإجمالي' : 'Total'}</p>
              <p className="font-medium">{formatCurrency(contract.totalAmount)}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">{isRTL ? 'البدء' : 'Start'}</p>
              <p className="font-medium text-xs">{formatDate(contract.startDate)}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">{isRTL ? 'المشروع' : 'Project'}</p>
              <p className="font-medium line-clamp-1">{contract.projectTitle}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">{isRTL ? 'الانتهاء' : 'End'}</p>
              <p className="font-medium text-xs">{formatDate(contract.endDate)}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">{isRTL ? 'العملة' : 'Currency'}</p>
              <p className="font-medium">{contract.currency}</p>
            </div>
          </div>

          {contract.description && (
            <div className="text-sm">
              <p className="text-gray-600 line-clamp-2">{contract.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {contract.milestones && contract.milestones.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{isRTL ? 'المراحل' : 'Milestones'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...contract.milestones]
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((milestone) => (
                  <div key={milestone.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{milestone.title}</h4>
                      <p className="text-xs text-gray-500">{milestone.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                        <span className="font-medium">{formatCurrency(milestone.amount)}</span>
                        <span>{formatDate(milestone.dueDate)}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="whitespace-nowrap ml-2">
                      {formatCurrency(milestone.amount)}
                    </Badge>
                  </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{isRTL ? 'الإجمالي' : 'Total'}</span>
                <span className="font-bold">
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
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 space-y-1">
              <p className="font-medium">{isRTL ? 'ملخص العقد' : 'Contract Summary'}</p>
              <p className="text-xs">
                {isRTL
                  ? 'بقبولك لهذا العقد، فإنك توافق على الشروط والمراحل المذكورة أعلاه.'
                  : 'By accepting this contract, you agree to the terms and milestones mentioned above.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={handleReject}
          disabled={isAccepting || isRejecting || isLoading}
          className="flex items-center gap-2"
          size="sm"
        >
          <X className="h-4 w-4" />
          {isRTL ? 'رفض' : 'Reject'}
        </Button>
        <Button
          onClick={handleAccept}
          disabled={isAccepting || isRejecting || isLoading}
          className="flex items-center gap-2"
          size="sm"
        >
          {isAccepting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              {isRTL ? 'جاري القبول...' : 'Accepting...'}
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              {isRTL ? 'قبول' : 'Accept'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
