import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { 
  announcementService, 
  Announcement, 
  CreateAnnouncementRequest 
} from '@/services/announcement.service';
import { PageResponse } from '@/types/api';

const announcementQueryKeys = {
  all: ['admin', 'announcements'] as const,
  list: (params: Record<string, unknown>) => ['admin', 'announcements', 'list', params] as const,
  detail: (id: string) => ['admin', 'announcements', 'detail', id] as const,
  recent: (days: number) => ['admin', 'announcements', 'recent', days] as const,
};

interface UseAnnouncementsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const useAnnouncements = (
  params: UseAnnouncementsParams = {},
  options?: UseQueryOptions<PageResponse<Announcement>>
) => {
  return useQuery({
    queryKey: announcementQueryKeys.list(params),
    queryFn: () => announcementService.getAllAnnouncements(params),
    ...options,
  });
};

export const useAnnouncement = (
  announcementId: string,
  options?: UseQueryOptions<Announcement>
) => {
  return useQuery({
    queryKey: announcementQueryKeys.detail(announcementId),
    queryFn: () => announcementService.getAnnouncementById(announcementId),
    enabled: !!announcementId,
    ...options,
  });
};

export const useRecentAnnouncements = (
  days: number = 30,
  options?: UseQueryOptions<Announcement[]>
) => {
  return useQuery({
    queryKey: announcementQueryKeys.recent(days),
    queryFn: () => announcementService.getRecentAnnouncements(days),
    ...options,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAnnouncementRequest) => 
      announcementService.createAnnouncement(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementQueryKeys.all });
    },
  });
};

export const useSendAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementId: string) => 
      announcementService.sendAnnouncement(announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementQueryKeys.all });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementId: string) => 
      announcementService.deleteAnnouncement(announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementQueryKeys.all });
    },
  });
};
