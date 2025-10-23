import React, { useState } from 'react';
import { useAnnouncements, useDeleteAnnouncement, useSendAnnouncement } from '@/hooks/useAnnouncements';
import { Announcement, AnnouncementPriority, TargetAudience } from '@/services/announcement.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Send, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const getPriorityBadgeClass = (priority: AnnouncementPriority) => {
  switch (priority) {
    case AnnouncementPriority.URGENT:
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    case AnnouncementPriority.HIGH:
      return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
    case AnnouncementPriority.NORMAL:
      return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case AnnouncementPriority.LOW:
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

const getAudienceBadgeClass = (audience: TargetAudience) => {
  switch (audience) {
    case TargetAudience.ALL:
      return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
    case TargetAudience.CLIENTS:
      return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case TargetAudience.FREELANCERS:
      return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case TargetAudience.ADMINS:
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export const AnnouncementsTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);

  const { data, isLoading, refetch } = useAnnouncements({ page, size: pageSize });
  const sendMutation = useSendAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const announcements = data?.content || [];
  const totalPages = data?.totalPages || 0;

  const handleSend = async (announcementId: string) => {
    try {
      await sendMutation.mutateAsync(announcementId);
      toast.success('Announcement sent successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to send announcement');
    }
  };

  const handleDelete = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await deleteMutation.mutateAsync(announcementId);
      toast.success('Announcement deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  return (
    <Card className="w-full">
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Announcements</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Manage platform-wide announcements
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 float-right" /></TableCell>
                  </TableRow>
                ))
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No announcements found
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => (
                  <TableRow key={announcement.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {announcement.message}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeClass(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getAudienceBadgeClass(announcement.targetAudience)}>
                        {announcement.targetAudience}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {announcement.recipientCount || 0}
                    </TableCell>
                    <TableCell>
                      {announcement.sentAt ? (
                        <Badge className="bg-green-500/10 text-green-500">Sent</Badge>
                      ) : (
                        <Badge className="bg-yellow-500/10 text-yellow-500">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(announcement.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!announcement.sentAt && (
                            <DropdownMenuItem onClick={() => handleSend(announcement.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(announcement.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
