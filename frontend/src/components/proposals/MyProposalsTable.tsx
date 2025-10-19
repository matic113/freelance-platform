import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  DollarSign,
  Calendar
} from 'lucide-react';
import { ProposalResponse } from '@/types/api';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MyProposalsTableProps {
  proposals: ProposalResponse[];
  isRTL?: boolean;
  onEdit?: (proposal: ProposalResponse) => void;
  onWithdraw?: (proposalId: string) => void;
  onViewDetails?: (proposalId: string) => void;
  isLoading?: boolean;
}

export const MyProposalsTable: React.FC<MyProposalsTableProps> = ({
  proposals,
  isRTL = false,
  onEdit,
  onWithdraw,
  onViewDetails,
  isLoading = false
}) => {
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            {isRTL ? 'قيد الانتظار' : 'Pending'}
          </Badge>
        );
      case 'accepted':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            {isRTL ? 'مقبول' : 'Accepted'}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            {isRTL ? 'مرفوض' : 'Rejected'}
          </Badge>
        );
      case 'withdrawn':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            {isRTL ? 'مسحوب' : 'Withdrawn'}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canEdit = (proposal: ProposalResponse) => {
    return proposal.status === 'PENDING' || proposal.status === 'pending';
  };

  const canWithdraw = (proposal: ProposalResponse) => {
    return proposal.status === 'PENDING' || proposal.status === 'pending';
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className={cn("font-semibold", isRTL && "text-right")}>
                {isRTL ? 'المشروع' : 'Project'}
              </TableHead>
              <TableHead className={cn("font-semibold", isRTL && "text-right")}>
                {isRTL ? 'الميزانية المقترحة' : 'Proposed Budget'}
              </TableHead>
              <TableHead className={cn("font-semibold", isRTL && "text-right")}>
                {isRTL ? 'المدة' : 'Duration'}
              </TableHead>
              <TableHead className={cn("font-semibold", isRTL && "text-right")}>
                {isRTL ? 'الحالة' : 'Status'}
              </TableHead>
              <TableHead className={cn("font-semibold", isRTL && "text-right")}>
                {isRTL ? 'تقديم في' : 'Submitted'}
              </TableHead>
              <TableHead className={cn("font-semibold text-right", isRTL && "text-left")}>
                {isRTL ? 'الإجراءات' : 'Actions'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className={cn("text-center py-8 text-gray-500", isRTL && "text-right")}>
                  {isRTL ? 'لا توجد عروض بعد' : 'No proposals yet'}
                </TableCell>
              </TableRow>
            ) : (
              proposals.map((proposal) => (
                <TableRow key={proposal.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className={cn("", isRTL && "text-right")}>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {proposal.project?.title || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isRTL ? 'معرف المشروع: ' : 'Project ID: '}{proposal.projectId}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse justify-end")}>
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{proposal.proposedBudget.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse justify-end")}>
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span>{proposal.estimatedDuration}d</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(proposal.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(proposal.submittedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuItem
                          onClick={() => onViewDetails?.(proposal.id.toString())}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {isRTL ? 'عرض التفاصيل' : 'View Details'}
                        </DropdownMenuItem>
                        {canEdit(proposal) && onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(proposal)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            {isRTL ? 'تحديث' : 'Edit'}
                          </DropdownMenuItem>
                        )}
                        {canWithdraw(proposal) && onWithdraw && (
                          <DropdownMenuItem
                            onClick={() => setWithdrawingId(proposal.id.toString())}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isRTL ? 'سحب' : 'Withdraw'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={!!withdrawingId} onOpenChange={(open) => !open && setWithdrawingId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>{isRTL ? 'تأكيد السحب' : 'Confirm Withdrawal'}</AlertDialogTitle>
          <AlertDialogDescription className={cn("", isRTL && "text-right")}>
            {isRTL 
              ? 'هل أنت متأكد من رغبتك في سحب هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.' 
              : 'Are you sure you want to withdraw this proposal? This action cannot be undone.'}
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onWithdraw?.(withdrawingId!);
                setWithdrawingId(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRTL ? 'سحب' : 'Withdraw'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
