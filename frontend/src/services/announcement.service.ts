import { apiService } from './api';
import { PageResponse } from '@/types/api';

export enum AnnouncementPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TargetAudience {
  ALL = 'ALL',
  CLIENTS = 'CLIENTS',
  FREELANCERS = 'FREELANCERS',
  ADMINS = 'ADMINS'
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  sendEmail: boolean;
  targetAudience: TargetAudience;
  recipientCount?: number;
  createdBy: string;
  createdAt: string;
  sentAt?: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  message: string;
  priority: AnnouncementPriority;
  sendEmail: boolean;
  targetAudience: TargetAudience;
  sendImmediately?: boolean;
}

interface PaginatedParams {
  page?: number;
  size?: number;
  sort?: string;
}

const defaultPagination: Required<Pick<PaginatedParams, 'page' | 'size'>> = {
  page: 0,
  size: 20,
};

export const announcementService = {
  createAnnouncement: async (request: CreateAnnouncementRequest): Promise<Announcement> => {
    const announcement = await apiService.post<Announcement>('/admin/announcements', request);
    
    if (request.sendImmediately) {
      return apiService.post<Announcement>(`/admin/announcements/${announcement.id}/send`);
    }
    
    return announcement;
  },

  sendAnnouncement: async (announcementId: string): Promise<Announcement> => {
    return apiService.post<Announcement>(`/admin/announcements/${announcementId}/send`);
  },

  getAllAnnouncements: async (params: PaginatedParams = {}): Promise<PageResponse<Announcement>> => {
    const mergedParams = { ...defaultPagination, ...params };
    return apiService.get<PageResponse<Announcement>>('/admin/announcements', { params: mergedParams });
  },

  getAnnouncementById: async (announcementId: string): Promise<Announcement> => {
    return apiService.get<Announcement>(`/admin/announcements/${announcementId}`);
  },

  getRecentAnnouncements: async (days: number = 30): Promise<Announcement[]> => {
    return apiService.get<Announcement[]>('/admin/announcements/recent', { params: { days } });
  },

  deleteAnnouncement: async (announcementId: string): Promise<string> => {
    return apiService.delete<string>(`/admin/announcements/${announcementId}`);
  },
};
