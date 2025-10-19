import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Loader2, DollarSign, Clock } from 'lucide-react';

const proposalSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  proposedAmount: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a valid amount greater than 0'),
  estimatedDuration: z.string()
    .max(100, 'Estimated duration must not exceed 100 characters')
    .optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProposalFormData) => Promise<void>;
  projectTitle: string;
  isRTL: boolean;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectTitle,
  isRTL
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      description: '',
      proposedAmount: '',
      estimatedDuration: '',
    },
  });

  const handleSubmit = async (data: ProposalFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[600px]", isRTL && "rtl")}>
        <DialogHeader>
          <DialogTitle className={cn("text-2xl font-bold text-[#0A2540]", isRTL && "text-right")}>
            {isRTL ? 'تقديم عرض' : 'Submit Proposal'}
          </DialogTitle>
          <DialogDescription className={cn("text-base", isRTL && "text-right")}>
            {isRTL 
              ? `قدم عرضك الاحترافي لمشروع: ${projectTitle}` 
              : `Submit your professional proposal for: ${projectTitle}`
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-6", isRTL && "rtl")}>
            {/* Proposal Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isRTL ? "text-right block" : ""}>
                    {isRTL ? 'عنوان العرض' : 'Proposal Title'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={isRTL ? "مثال: حل احترافي لموقعك" : "e.g., Professional website solution"}
                      {...field}
                      disabled={isSubmitting}
                      className={cn("border-gray-300", isRTL && "text-right")}
                    />
                  </FormControl>
                  <FormDescription className={isRTL ? "text-right" : ""}>
                    {isRTL ? 'عنوان قصير يصف عرضك (5-200 أحرف)' : 'Brief title for your proposal (5-200 characters)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Budget and Duration Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Proposed Amount */}
              <FormField
                control={form.control}
                name="proposedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn("flex items-center gap-2", isRTL && "flex-row-reverse text-right block")}>
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {isRTL ? 'المبلغ المقترح' : 'Proposed Amount'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={isRTL ? "500" : "500"}
                        step="0.01"
                        min="0"
                        {...field}
                        disabled={isSubmitting}
                        className={cn("border-gray-300", isRTL && "text-right")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Estimated Duration */}
              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn("flex items-center gap-2", isRTL && "flex-row-reverse text-right block")}>
                      <Clock className="h-4 w-4 text-blue-600" />
                      {isRTL ? 'المدة المقدرة' : 'Est. Duration'}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={isRTL ? "مثال: 5 أيام" : "e.g., 5 days"}
                        {...field}
                        disabled={isSubmitting}
                        className={cn("border-gray-300", isRTL && "text-right")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isRTL ? "text-right block" : ""}>
                    {isRTL ? 'وصف العرض' : 'Proposal Description'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isRTL 
                        ? "اشرح كيف ستحل المشكلة، خبرتك، والقيمة التي ستقدمها..." 
                        : "Explain how you'll solve the problem, your experience, and the value you'll provide..."
                      }
                      rows={5}
                      {...field}
                      disabled={isSubmitting}
                      className={cn("resize-none border-gray-300", isRTL && "text-right")}
                    />
                  </FormControl>
                  <FormDescription className={cn("flex justify-between", isRTL && "flex-row-reverse text-right")}>
                    <span>{isRTL ? 'صف عرضك بالتفصيل (50-2000 أحرف)' : 'Describe your proposal in detail (50-2000 characters)'}</span>
                    <span className={cn("text-xs", field.value?.length > 1800 ? "text-orange-600" : field.value?.length > 2000 ? "text-red-600" : "text-gray-500")}>
                      {field.value?.length || 0}/2000
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className={cn("flex gap-3 justify-end", isRTL && "flex-row-reverse")}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting 
                  ? (isRTL ? 'جاري الإرسال...' : 'Submitting...')
                  : (isRTL ? 'تقديم العرض' : 'Submit Proposal')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
