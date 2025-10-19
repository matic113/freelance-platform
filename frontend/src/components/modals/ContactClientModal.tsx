import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Loader2, MessageCircle } from 'lucide-react';

const messageSchema = z.object({
  message: z.string()
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
});

type MessageFormData = z.infer<typeof messageSchema>;

interface ContactClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  clientName: string;
  projectTitle: string;
  isRTL: boolean;
}

export const ContactClientModal: React.FC<ContactClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clientName,
  projectTitle,
  isRTL
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleSubmit = async (data: MessageFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data.message);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[500px]", isRTL && "rtl")}>
        <DialogHeader>
          <DialogTitle className={cn("text-2xl font-bold text-[#0A2540]", isRTL && "text-right")}>
            {isRTL ? 'راسل العميل' : 'Contact Client'}
          </DialogTitle>
          <DialogDescription className={cn("text-base", isRTL && "text-right")}>
            {isRTL 
              ? `أرسل رسالة إلى ${clientName} حول مشروع: ${projectTitle}` 
              : `Send a message to ${clientName} about: ${projectTitle}`
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-6", isRTL && "rtl")}>
            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("flex items-center gap-2", isRTL && "flex-row-reverse text-right block")}>
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    {isRTL ? 'رسالتك' : 'Your Message'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={isRTL 
                        ? "مرحباً، أنا مهتم بهذا المشروع وأود مناقشة التفاصيل معك..." 
                        : "Hi, I'm interested in this project and would like to discuss the details..."
                      }
                      rows={6}
                      {...field}
                      disabled={isSubmitting}
                      className={cn("resize-none border-gray-300 min-h-[150px]", isRTL && "text-right")}
                    />
                  </FormControl>
                  <FormDescription className={cn("flex justify-between", isRTL && "flex-row-reverse text-right")}>
                    <span>{isRTL ? 'اشرح اهتمامك وأسئلتك (20-1000 أحرف)' : 'Express your interest and questions (20-1000 characters)'}</span>
                    <span className={cn("text-xs", field.value?.length > 900 ? "text-orange-600" : field.value?.length > 1000 ? "text-red-600" : "text-gray-500")}>
                      {field.value?.length || 0}/1000
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Info Box */}
            <div className={cn("bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2", isRTL && "text-right")}>
              <p className="text-sm text-amber-900">
                {isRTL 
                  ? '📧 سيتم إرسال رسالتك مباشرة إلى بريد العميل ويمكنه الرد عليها مباشرة.' 
                  : '📧 Your message will be sent directly to the client and they can reply to you directly.'
                }
              </p>
            </div>

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
                  ? (isRTL ? 'جاري الإرسال...' : 'Sending...')
                  : (isRTL ? 'إرسال الرسالة' : 'Send Message')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
