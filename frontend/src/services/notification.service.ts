import { apiService } from './api';
import { NotificationResponse, NotificationStats, CreateNotificationRequest } from '@/types/api';

export const notificationService = {
  // Get notifications with filters
  getNotifications: async (
    page: number = 0,
    size: number = 20,
    type?: string,
    priority?: string,
    isRead?: boolean,
    search?: string
  ): Promise<{ content: NotificationResponse[]; totalElements: number; totalPages: number; size: number; number: number }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (type) params.append('type', type);
    if (priority) params.append('priority', priority);
    if (isRead !== undefined) params.append('isRead', isRead.toString());
    if (search) params.append('search', search);

    return apiService.get(`/notifications?${params.toString()}`);
  },

  // Get unread notifications
  getUnreadNotifications: async (): Promise<NotificationResponse[]> => {
    return apiService.get('/notifications/unread');
  },

  // Get grouped notifications
  getGroupedNotifications: async (
    page: number = 0,
    size: number = 20
  ): Promise<NotificationResponse[]> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    return apiService.get(`/notifications/grouped?${params.toString()}`);
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<NotificationStats> => {
    return apiService.get('/notifications/stats');
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    return apiService.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<string> => {
    return apiService.put('/notifications/mark-all-read');
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<string> => {
    return apiService.delete(`/notifications/${notificationId}`);
  },

  // Create notification (admin only)
  createNotification: async (request: CreateNotificationRequest): Promise<NotificationResponse> => {
    return apiService.post('/notifications', request);
  },

  // Cleanup old notifications
  cleanupOldNotifications: async (): Promise<string> => {
    return apiService.delete('/notifications/cleanup');
  },
};