import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  DollarSign,
  Calendar,
  User,
  FileText,
  Eye
} from 'lucide-react';
import { Proposal } from '@/types/contract';
import { cn } from '@/lib/utils';

interface ProposalCardProps {
  proposal: Proposal;
  userType: 'client' | 'freelancer';
  isRTL?: boolean;
  onAccept?: (proposalId: string) => void;
  onReject?: (proposalId: string) => void;
  onWithdraw?: (proposalId: string) => void;
  onViewDetails?: (proposalId: string) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  userType,
  isRTL = false,
  onAccept,
  onReject,
  onWithdraw,
  onViewDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: isRTL ? 'في الانتظار' : 'Pending',
      accepted: isRTL ? 'مقبول' : 'Accepted',
      rejected: isRTL ? 'مرفوض' : 'Rejected',
      withdrawn: isRTL ? 'مسحوب' : 'Withdrawn'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'withdrawn':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const canAccept = userType === 'client' && proposal.status === 'pending';
  const canReject = userType === 'client' && proposal.status === 'pending';
  const canWithdraw = userType === 'freelancer' && proposal.status === 'pending';

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-[#0A2540] mb-1">
              {proposal.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {proposal.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(proposal.status)}
            <Badge className={cn("text-xs", getStatusColor(proposal.status))}>
              {getStatusText(proposal.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Proposal Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">
              {isRTL ? 'المبلغ المقترح' : 'Proposed Amount'}
            </span>
            <span className="font-semibold">
              {proposal.proposedAmount} {proposal.currency}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-gray-600">
              {isRTL ? 'المدة المقدرة' : 'Estimated Duration'}
            </span>
            <span className="font-semibold">
              {proposal.estimatedDuration}
            </span>
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
                {isRTL ? 'تم الإرسال في' : 'Submitted on'}
              </span>
              <span className="font-semibold">
                {new Date(proposal.submittedAt).toLocaleString()}
              </span>
            </div>
            
            {proposal.respondedAt && (
              <div className="flex items-center gap-2">
                {proposal.status === 'accepted' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-500" />
                )}
                <span className="text-gray-600">
                  {isRTL ? 'تم الرد في' : 'Responded on'}
                </span>
                <span className="font-semibold">
                  {new Date(proposal.respondedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Attachments */}
        {proposal.attachments && proposal.attachments.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {isRTL ? 'المرفقات' : 'Attachments'}
            </Label>
            <div className="flex flex-wrap gap-2">
              {proposal.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(proposal.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Button>
          
          {canAccept && (
            <Button
              size="sm"
              onClick={() => onAccept?.(proposal.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'قبول' : 'Accept'}
            </Button>
          )}
          
          {canReject && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onReject?.(proposal.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'رفض' : 'Reject'}
            </Button>
          )}
          
          {canWithdraw && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onWithdraw?.(proposal.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {isRTL ? 'سحب' : 'Withdraw'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ProposalFormProps {
  projectId: string;
  freelancerId: string;
  clientId: string;
  isRTL?: boolean;
  onSubmit?: (proposal: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => void;
  onCancel?: () => void;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({
  projectId,
  freelancerId,
  clientId,
  isRTL = false,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposedAmount: '',
    currency: 'USD',
    estimatedDuration: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.proposedAmount && formData.estimatedDuration) {
      onSubmit?.({
        projectId,
        freelancerId,
        clientId,
        title: formData.title,
        description: formData.description,
        proposedAmount: parseFloat(formData.proposedAmount),
        currency: formData.currency,
        estimatedDuration: formData.estimatedDuration
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          {isRTL ? 'تقديم عرض' : 'Submit Proposal'}
        </CardTitle>
        <CardDescription>
          {isRTL ? 'قدم عرضك للمشروع' : 'Submit your proposal for this project'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              {isRTL ? 'عنوان العرض' : 'Proposal Title'}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={isRTL ? 'أدخل عنوان العرض...' : 'Enter proposal title...'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {isRTL ? 'وصف العرض' : 'Proposal Description'}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isRTL ? 'أدخل وصف مفصل لعرضك...' : 'Enter detailed description of your proposal...'}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                {isRTL ? 'المبلغ المقترح' : 'Proposed Amount'}
              </Label>
              <Input
                id="amount"
                type="number"
                value={formData.proposedAmount}
                onChange={(e) => setFormData({ ...formData, proposedAmount: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">
                {isRTL ? 'العملة' : 'Currency'}
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">
              {isRTL ? 'المدة المقدرة' : 'Estimated Duration'}
            </Label>
            <Select
              value={formData.estimatedDuration}
              onValueChange={(value) => setFormData({ ...formData, estimatedDuration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={isRTL ? 'اختر المدة...' : 'Select duration...'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 week">{isRTL ? 'أسبوع واحد' : '1 week'}</SelectItem>
                <SelectItem value="2 weeks">{isRTL ? 'أسبوعين' : '2 weeks'}</SelectItem>
                <SelectItem value="1 month">{isRTL ? 'شهر واحد' : '1 month'}</SelectItem>
                <SelectItem value="2 months">{isRTL ? 'شهرين' : '2 months'}</SelectItem>
                <SelectItem value="3 months">{isRTL ? '3 أشهر' : '3 months'}</SelectItem>
                <SelectItem value="6 months">{isRTL ? '6 أشهر' : '6 months'}</SelectItem>
                <SelectItem value="More than 6 months">{isRTL ? 'أكثر من 6 أشهر' : 'More than 6 months'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="bg-[#0A2540] hover:bg-[#142b52] flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {isRTL ? 'إرسال العرض' : 'Submit Proposal'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
