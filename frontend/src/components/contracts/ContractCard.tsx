import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Contract } from '@/types/contract';
import { cn } from '@/lib/utils';

interface ContractCardProps {
  contract: Contract;
  userType: 'client' | 'freelancer';
  isRTL?: boolean;
  onViewDetails?: (contractId: string) => void;
  onMessage?: (contractId: string) => void;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  userType,
  isRTL = false,
  onViewDetails,
  onMessage
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: isRTL ? 'نشط' : 'Active',
      completed: isRTL ? 'مكتمل' : 'Completed',
      pending: isRTL ? 'في الانتظار' : 'Pending',
      cancelled: isRTL ? 'ملغي' : 'Cancelled',
      disputed: isRTL ? 'متنازع عليه' : 'Disputed'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const completedMilestones = contract.milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = contract.milestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const paidAmount = contract.milestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-[#0A2540] mb-2">
              {contract.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {contract.description}
            </CardDescription>
          </div>
          <Badge className={cn("text-xs", getStatusColor(contract.status))}>
            {getStatusText(contract.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contract Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {isRTL ? 'المبلغ الإجمالي' : 'Total Amount'}
            </span>
            <span className="font-semibold">
              {contract.totalAmount} {contract.currency}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-gray-600">
              {isRTL ? 'المدفوع' : 'Paid'}
            </span>
            <span className="font-semibold">
              {paidAmount} {contract.currency}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-gray-600">
              {isRTL ? 'تاريخ البداية' : 'Start Date'}
            </span>
            <span className="font-semibold">
              {new Date(contract.startDate).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-gray-600">
              {isRTL ? 'تاريخ الانتهاء' : 'End Date'}
            </span>
            <span className="font-semibold">
              {new Date(contract.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Progress */}
        {contract.status === 'active' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {isRTL ? 'تقدم المراحل' : 'Milestone Progress'}
              </span>
              <span className="font-semibold">
                {completedMilestones}/{totalMilestones} {isRTL ? 'مرحلة' : 'milestones'}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {/* Milestones Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            {isRTL ? 'المراحل' : 'Milestones'}
          </h4>
          <div className="space-y-1">
            {contract.milestones.slice(0, 3).map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate flex-1">
                  {milestone.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {milestone.amount} {contract.currency}
                  </span>
                  {milestone.status === 'completed' && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                  {milestone.status === 'paid' && (
                    <DollarSign className="h-3 w-3 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
            {contract.milestones.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{contract.milestones.length - 3} {isRTL ? 'مرحلة أخرى' : 'more milestones'}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(contract.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage?.(contract.id)}
            className="flex-1"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isRTL ? 'رسالة' : 'Message'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
