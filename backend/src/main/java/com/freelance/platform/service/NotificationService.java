package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreateNotificationRequest;
import com.freelance.platform.dto.response.NotificationResponse;
import com.freelance.platform.entity.Notification;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserService userService;
    
    // Get notifications for a user
    public Page<NotificationResponse> getNotifications(UUID userId, int page, int size) {
        User user = userService.findById(userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        return notifications.map(NotificationResponse::new);
    }
    
    // Get notifications with filters
    public Page<NotificationResponse> getNotificationsWithFilters(
            UUID userId, 
            String type, 
            String priority, 
            Boolean isRead, 
            String searchTerm,
            int page, 
            int size) {
        User user = userService.findById(userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications;
        
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            notifications = notificationRepository.findByUserAndSearchTerm(user, searchTerm, pageable);
        } else if (type != null && !type.equals("all")) {
            notifications = notificationRepository.findByUserAndTypeOrderByCreatedAtDesc(user, type, pageable);
        } else if (priority != null && !priority.equals("all")) {
            notifications = notificationRepository.findByUserAndPriorityOrderByCreatedAtDesc(user, priority, pageable);
        } else {
            notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
        }
        
        // Filter by read status if specified
        if (isRead != null) {
            notifications = notifications.map(notification -> {
                if (notification.getIsRead().equals(isRead)) {
                    return notification;
                }
                return null;
            }).map(notification -> notification != null ? notification : null);
        }
        
        return notifications.map(NotificationResponse::new);
    }
    
    // Get unread notifications
    public List<NotificationResponse> getUnreadNotifications(UUID userId) {
        User user = userService.findById(userId);
        List<Notification> notifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        return notifications.stream().map(NotificationResponse::new).collect(Collectors.toList());
    }
    
    // Get notification statistics
    public NotificationStats getNotificationStats(UUID userId) {
        User user = userService.findById(userId);
        
        long totalNotifications = notificationRepository.countByUser(user);
        long unreadNotifications = notificationRepository.countByUserAndIsReadFalse(user);
        long highPriorityNotifications = notificationRepository.countByUserAndPriority(user, "high");
        long todayNotifications = notificationRepository.findTodayNotificationsByUser(user).size();
        
        return new NotificationStats(totalNotifications, unreadNotifications, highPriorityNotifications, todayNotifications);
    }
    
    // Mark notification as read
    public NotificationResponse markAsRead(UUID userId, UUID notificationId) {
        User user = userService.findById(userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }
        
        notification.setIsRead(true);
        Notification savedNotification = notificationRepository.save(notification);
        return new NotificationResponse(savedNotification);
    }
    
    // Mark all notifications as read
    public void markAllAsRead(UUID userId) {
        User user = userService.findById(userId);
        notificationRepository.markAllAsReadByUser(user);
    }
    
    // Delete notification
    public void deleteNotification(UUID userId, UUID notificationId) {
        User user = userService.findById(userId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }
        
        notificationRepository.delete(notification);
    }
    
    // Create notification
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        User user = userService.findById(UUID.fromString(request.getUserId()));
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(request.getType());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setPriority(request.getPriority());
        notification.setData(request.getData());
        notification.setIsRead(false);
        
        Notification savedNotification = notificationRepository.save(notification);
        return new NotificationResponse(savedNotification);
    }
    
    // Create notification for user
    public NotificationResponse createNotificationForUser(UUID userId, String type, String title, String message) {
        return createNotificationForUser(userId, type, title, message, "medium", null);
    }
    
    public NotificationResponse createNotificationForUser(UUID userId, String type, String title, String message, String priority) {
        return createNotificationForUser(userId, type, title, message, priority, null);
    }
    
    public NotificationResponse createNotificationForUser(UUID userId, String type, String title, String message, String priority, String data) {
        return createNotificationForUserWithGrouping(userId, type, title, message, priority, data, null, "NONE");
    }
    
    public NotificationResponse createNotificationForUserWithGrouping(UUID userId, String type, String title, String message, String priority, String data, String groupKey, String groupType) {
        User user = userService.findById(userId);
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(priority);
        notification.setData(data);
        notification.setGroupKey(groupKey);
        notification.setGroupType(groupType);
        notification.setIsRead(false);
        
        Notification savedNotification = notificationRepository.save(notification);
        return new NotificationResponse(savedNotification);
    }
    
    public List<NotificationResponse> getGroupedNotifications(UUID userId, int page, int size) {
        User user = userService.findById(userId);
        Pageable pageable = PageRequest.of(page, size);
        List<Notification> allNotifications = notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable).getContent();
        
        Map<String, List<Notification>> groupedMap = new LinkedHashMap<>();
        List<NotificationResponse> result = new ArrayList<>();
        
        for (Notification notification : allNotifications) {
            String groupKey = notification.getGroupKey();
            String groupType = notification.getGroupType();
            
            if (groupKey != null && !groupKey.isEmpty() && "CONVERSATION".equals(groupType)) {
                groupedMap.computeIfAbsent(groupKey, k -> new ArrayList<>()).add(notification);
            } else {
                NotificationResponse response = new NotificationResponse(notification);
                response.setGroupCount(1);
                result.add(response);
            }
        }
        
        for (Map.Entry<String, List<Notification>> entry : groupedMap.entrySet()) {
            List<Notification> groupNotifications = entry.getValue();
            Notification latestNotification = groupNotifications.get(0);
            
            NotificationResponse response = new NotificationResponse(latestNotification);
            response.setGroupCount(groupNotifications.size());
            result.add(response);
        }
        
        result.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        
        return result;
    }
    
    // Clean up old notifications (older than 30 days)
    public void cleanupOldNotifications(UUID userId) {
        User user = userService.findById(userId);
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteOldNotificationsByUser(user, cutoffDate);
    }
    
    // Inner class for notification statistics
    public static class NotificationStats {
        private final long totalNotifications;
        private final long unreadNotifications;
        private final long highPriorityNotifications;
        private final long todayNotifications;
        
        public NotificationStats(long totalNotifications, long unreadNotifications, 
                                long highPriorityNotifications, long todayNotifications) {
            this.totalNotifications = totalNotifications;
            this.unreadNotifications = unreadNotifications;
            this.highPriorityNotifications = highPriorityNotifications;
            this.todayNotifications = todayNotifications;
        }
        
        public long getTotalNotifications() {
            return totalNotifications;
        }
        
        public long getUnreadNotifications() {
            return unreadNotifications;
        }
        
        public long getHighPriorityNotifications() {
            return highPriorityNotifications;
        }
        
        public long getTodayNotifications() {
            return todayNotifications;
        }
    }
}