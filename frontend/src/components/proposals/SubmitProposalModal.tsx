import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectResponse } from '@/types/api';
import { SubmitProposalForm } from './SubmitProposalForm';
import { cn } from '@/lib/utils';

interface SubmitProposalModalProps {
  isOpen: boolean;
  project: ProjectResponse;
  isRTL?: boolean;
  isEditing?: boolean;
  initialData?: {
    proposedBudget: number;
    estimatedDuration: number;
    coverLetter: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({
  isOpen,
  project,
  isRTL = false,
  isEditing = false,
  initialData,
  onClose,
  onSuccess
}) => {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-2xl", isRTL && "rtl")}>
        <DialogHeader>
          <DialogTitle className={cn("", isRTL && "text-right")}>
            {isEditing ? (isRTL ? 'تحديث العرض' : 'Update Proposal') : (isRTL ? 'تقديم عرض جديد' : 'Submit New Proposal')}
          </DialogTitle>
        </DialogHeader>
        <SubmitProposalForm
          project={project}
          isRTL={isRTL}
          isEditing={isEditing}
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};
