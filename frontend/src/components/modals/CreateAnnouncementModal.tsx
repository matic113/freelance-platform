import React, { useState } from 'react';
import { useCreateAnnouncement } from '@/hooks/useAnnouncements';
import { AnnouncementPriority, TargetAudience, CreateAnnouncementRequest } from '@/services/announcement.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface CreateAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: '',
    message: '',
    priority: AnnouncementPriority.NORMAL,
    sendEmail: true,
    targetAudience: TargetAudience.ALL,
    sendImmediately: true,
  });

  const createMutation = useCreateAnnouncement();

  const handleSubmit = async (e: React.FormEvent, sendImmediately: boolean = true) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    try {
      await createMutation.mutateAsync({ ...formData, sendImmediately });
      toast.success(sendImmediately ? 'Announcement sent successfully' : 'Announcement saved as draft');
      handleClose();
    } catch (error) {
      toast.error(sendImmediately ? 'Failed to send announcement' : 'Failed to save announcement');
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      message: '',
      priority: AnnouncementPriority.NORMAL,
      sendEmail: true,
      targetAudience: TargetAudience.ALL,
      sendImmediately: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create a new platform-wide announcement for users
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Enter your announcement message..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => 
                    setFormData({ ...formData, priority: value as AnnouncementPriority })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AnnouncementPriority.LOW}>Low</SelectItem>
                    <SelectItem value={AnnouncementPriority.NORMAL}>Normal</SelectItem>
                    <SelectItem value={AnnouncementPriority.HIGH}>High</SelectItem>
                    <SelectItem value={AnnouncementPriority.URGENT}>Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) => 
                    setFormData({ ...formData, targetAudience: value as TargetAudience })
                  }
                >
                  <SelectTrigger id="audience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TargetAudience.ALL}>All Users</SelectItem>
                    <SelectItem value={TargetAudience.CLIENTS}>Clients Only</SelectItem>
                    <SelectItem value={TargetAudience.FREELANCERS}>Freelancers Only</SelectItem>
                    <SelectItem value={TargetAudience.ADMINS}>Admins Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={formData.sendEmail}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, sendEmail: checked === true })
                }
              />
              <Label 
                htmlFor="sendEmail" 
                className="text-sm font-normal cursor-pointer"
              >
                Send email notification to recipients
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={(e) => handleSubmit(e, false)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              type="submit" 
              onClick={(e) => handleSubmit(e, true)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Sending...' : 'Send Now'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
