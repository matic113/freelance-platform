import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { ProjectResponse, SubmitProposalRequest } from '@/types/api';
import { proposalService } from '@/services/proposal.service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SubmitProposalFormProps {
  project: ProjectResponse;
  isRTL?: boolean;
  isEditing?: boolean;
  initialData?: {
    proposedBudget: number;
    estimatedDuration: number;
    coverLetter: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const SubmitProposalForm: React.FC<SubmitProposalFormProps> = ({
  project,
  isRTL = false,
  isEditing = false,
  initialData,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  const [formData, setFormData] = useState({
    proposedBudget: initialData?.proposedBudget || project.budgetMin || 0,
    estimatedDuration: initialData?.estimatedDuration || 0,
    coverLetter: initialData?.coverLetter || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkExistingProposal = useCallback(async () => {
    setIsChecking(true);
    try {
      const hasProposed = await proposalService.hasProposedToProject(project.id);
      setHasExisting(hasProposed);
    } catch (error) {
      console.error('Error checking proposal:', error);
    } finally {
      setIsChecking(false);
    }
  }, [project.id]);

  useEffect(() => {
    if (!isEditing) {
      checkExistingProposal();
    }
  }, [isEditing, checkExistingProposal]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proposedBudget || formData.proposedBudget <= 0) {
      newErrors.proposedBudget = isRTL ? 'الميزانية المقترحة مطلوبة' : 'Proposed budget is required';
    }

    if (formData.proposedBudget < project.budgetMin) {
      newErrors.proposedBudget = isRTL 
        ? `الميزانية يجب أن تكون على الأقل ${project.budgetMin}` 
        : `Budget must be at least ${project.budgetMin}`;
    }

    if (formData.proposedBudget > project.budgetMax) {
      newErrors.proposedBudget = isRTL 
        ? `الميزانية يجب أن لا تتجاوز ${project.budgetMax}` 
        : `Budget must not exceed ${project.budgetMax}`;
    }

    if (!formData.estimatedDuration || formData.estimatedDuration <= 0) {
      newErrors.estimatedDuration = isRTL ? 'المدة المقترحة مطلوبة' : 'Estimated duration is required';
    }

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = isRTL ? 'رسالة غلاف مطلوبة' : 'Cover letter is required';
    }

    if (formData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = isRTL 
        ? 'رسالة الغلاف يجب أن تكون 50 حرف على الأقل' 
        : 'Cover letter must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const proposalData: SubmitProposalRequest = {
        projectId: parseInt(project.id),
        coverLetter: formData.coverLetter,
        proposedBudget: formData.proposedBudget,
        estimatedDuration: formData.estimatedDuration
      };

      if (isEditing) {
        await proposalService.updateProposal(project.id, {
          coverLetter: formData.coverLetter,
          proposedBudget: formData.proposedBudget,
          estimatedDuration: formData.estimatedDuration
        });

        toast({
          title: isRTL ? 'نجح' : 'Success',
          description: isRTL ? 'تم تحديث العرض بنجاح' : 'Proposal updated successfully',
        });
      } else {
        await proposalService.submitProposal(proposalData);

        toast({
          title: isRTL ? 'نجح' : 'Success',
          description: isRTL ? 'تم إرسال العرض بنجاح' : 'Proposal submitted successfully',
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في تقديم العرض' : 'Failed to submit proposal',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasExisting && !isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className={cn("font-medium text-gray-900", isRTL && "text-right")}>
                {isRTL ? 'لقد تقدمت بعرض بالفعل' : 'You have already submitted a proposal'}
              </p>
              <p className={cn("text-sm text-gray-600 mt-1", isRTL && "text-right")}>
                {isRTL ? 'يمكنك تحديث عرضك من صفحة "عروضي"' : 'You can update your proposal from "My Proposals" page'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn("", isRTL && "text-right")}>
          {isEditing ? (isRTL ? 'تحديث العرض' : 'Update Proposal') : (isRTL ? 'تقديم عرض' : 'Submit Proposal')}
        </CardTitle>
        <CardDescription className={cn("", isRTL && "text-right")}>
          {isRTL ? 'قدم عرضك للمشروع' : 'Submit your proposal for this project'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isChecking ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Info */}
            <div className={cn("bg-blue-50 border border-blue-200 rounded-lg p-4", isRTL && "text-right")}>
              <h4 className="font-medium text-gray-900 mb-2">{project.title}</h4>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired?.slice(0, 3).map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Budget Range Info */}
            <div className={cn("bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600", isRTL && "text-right")}>
              <p>
                {isRTL ? 'نطاق الميزانية: ' : 'Budget Range: '}
                <span className="font-medium">
                  {project.currency} {project.budgetMin.toLocaleString()} - {project.currency} {project.budgetMax.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Proposed Budget */}
            <div>
              <Label className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse justify-end")}>
                <DollarSign className="h-4 w-4" />
                <span>{isRTL ? 'الميزانية المقترحة' : 'Proposed Budget'}</span>
                <span className="text-red-600">*</span>
              </Label>
              <Input
                type="number"
                min={project.budgetMin}
                max={project.budgetMax}
                step="0.01"
                placeholder={isRTL ? 'أدخل الميزانية المقترحة' : 'Enter proposed budget'}
                value={formData.proposedBudget}
                onChange={(e) => setFormData({
                  ...formData,
                  proposedBudget: parseFloat(e.target.value) || 0
                })}
                className={errors.proposedBudget ? 'border-red-500' : ''}
              />
              {errors.proposedBudget && (
                <p className={cn("text-sm text-red-600 mt-1 flex items-center gap-1", isRTL && "flex-row-reverse")}>
                  <AlertCircle className="h-3 w-3" />
                  {errors.proposedBudget}
                </p>
              )}
            </div>

            {/* Estimated Duration */}
            <div>
              <Label className={cn("flex items-center gap-2 mb-2", isRTL && "flex-row-reverse justify-end")}>
                <Clock className="h-4 w-4" />
                <span>{isRTL ? 'المدة المقترحة (أيام)' : 'Estimated Duration (days)'}</span>
                <span className="text-red-600">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                step="1"
                placeholder={isRTL ? 'أدخل المدة المقترحة' : 'Enter estimated duration'}
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({
                  ...formData,
                  estimatedDuration: parseInt(e.target.value) || 0
                })}
                className={errors.estimatedDuration ? 'border-red-500' : ''}
              />
              {errors.estimatedDuration && (
                <p className={cn("text-sm text-red-600 mt-1 flex items-center gap-1", isRTL && "flex-row-reverse")}>
                  <AlertCircle className="h-3 w-3" />
                  {errors.estimatedDuration}
                </p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <Label className={cn("mb-2 block", isRTL && "text-right")}>
                <span>{isRTL ? 'رسالة غلاف' : 'Cover Letter'}</span>
                <span className="text-red-600">*</span>
              </Label>
              <Textarea
                placeholder={isRTL ? 'أخبر العميل لماذا أنت الخيار الأفضل...' : 'Tell the client why you\'re the best fit...'}
                value={formData.coverLetter}
                onChange={(e) => setFormData({
                  ...formData,
                  coverLetter: e.target.value
                })}
                rows={6}
                className={errors.coverLetter ? 'border-red-500' : ''}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <div className={cn("flex justify-between text-xs text-gray-500 mt-2", isRTL && "flex-row-reverse")}>
                <span>{formData.coverLetter.length} / 2000</span>
                {errors.coverLetter && (
                  <span className="text-red-600">{errors.coverLetter}</span>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                  </>
                ) : (
                  isEditing ? (isRTL ? 'تحديث العرض' : 'Update Proposal') : (isRTL ? 'إرسال العرض' : 'Submit Proposal')
                )}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
