import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notification.service';
import { NotificationResponse, NotificationStats } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  const loadNotifications = async (
    page: number = 0,
    size: number = 20,
    type?: string,
    priority?: string,
    isRead?: boolean,
    search?: string,
    useGrouping: boolean = true
  ) => {
    try {
      setLoading(true);
      if (useGrouping && !type && !priority && !isRead && !search) {
        const response = await notificationService.getGroupedNotifications(page, size);
        setNotifications(response);
        setTotalPages(Math.ceil(response.length / size));
        setCurrentPage(page);
      } else {
        const response = await notificationService.getNotifications(page, size, type, priority, isRead, search);
        setNotifications(response.content);
        setTotalPages(response.totalPages);
        setCurrentPage(response.number);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load notification stats
  const loadStats = async () => {
    try {
      const statsData = await notificationService.getNotificationStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      setSaving(true);
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
      
      // Update stats
      if (stats) {
        setStats(prev => prev ? { ...prev, unreadNotifications: prev.unreadNotifications - 1 } : null);
      }
      
      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setSaving(true);
      await notificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
      
      // Update stats
      if (stats) {
        setStats(prev => prev ? { ...prev, unreadNotifications: 0 } : null);
      }
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      setSaving(true);
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      
      // Update stats
      if (stats && deletedNotification) {
        setStats(prev => prev ? {
          ...prev,
          totalNotifications: prev.totalNotifications - 1,
          unreadNotifications: deletedNotification.isRead ? prev.unreadNotifications : prev.unreadNotifications - 1,
          highPriorityNotifications: deletedNotification.priority === 'high' ? prev.highPriorityNotifications - 1 : prev.highPriorityNotifications,
        } : null);
      }
      
      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadNotifications();
    loadStats();
  }, []);

  return {
    notifications,
    stats,
    loading,
    saving,
    totalPages,
    currentPage,
    loadNotifications,
    loadStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}