package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CreateNotificationRequest;
import com.freelance.platform.dto.response.NotificationResponse;
import com.freelance.platform.entity.User;
import com.freelance.platform.service.AuthService;
import com.freelance.platform.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Notification management endpoints")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private AuthService authService;
    
    // Get notifications for current user
    @GetMapping
    @Operation(summary = "Get notifications", description = "Get paginated notifications for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<Page<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Boolean isRead,
            @RequestParam(required = false) String search) {
        
        User currentUser = authService.getCurrentUser();
        
        Page<NotificationResponse> notifications = notificationService.getNotificationsWithFilters(
                currentUser.getId(), type, priority, isRead, search, page, size);
        
        return ResponseEntity.ok(notifications);
    }
    
    // Get unread notifications
    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications", description = "Get all unread notifications for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications() {
        User currentUser = authService.getCurrentUser();
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }
    
    // Get notification statistics
    @GetMapping("/stats")
    @Operation(summary = "Get notification statistics", description = "Get notification statistics for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<NotificationService.NotificationStats> getNotificationStats() {
        User currentUser = authService.getCurrentUser();
        NotificationService.NotificationStats stats = notificationService.getNotificationStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }
    
    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    @Operation(summary = "Mark notification as read", description = "Mark a specific notification as read")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable UUID notificationId) {
        User currentUser = authService.getCurrentUser();
        NotificationResponse notification = notificationService.markAsRead(currentUser.getId(), notificationId);
        return ResponseEntity.ok(notification);
    }
    
    // Mark all notifications as read
    @PutMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications as read", description = "Mark all notifications as read for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<String> markAllAsRead() {
        User currentUser = authService.getCurrentUser();
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok("All notifications marked as read");
    }
    
    // Delete notification
    @DeleteMapping("/{notificationId}")
    @Operation(summary = "Delete notification", description = "Delete a specific notification")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<String> deleteNotification(@PathVariable UUID notificationId) {
        User currentUser = authService.getCurrentUser();
        notificationService.deleteNotification(currentUser.getId(), notificationId);
        return ResponseEntity.ok("Notification deleted successfully");
    }
    
    // Create notification (for internal use or admin)
    @PostMapping
    @Operation(summary = "Create notification", description = "Create a new notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody CreateNotificationRequest request) {
        NotificationResponse notification = notificationService.createNotification(request);
        return ResponseEntity.ok(notification);
    }
    
    // Cleanup old notifications
    @DeleteMapping("/cleanup")
    @Operation(summary = "Cleanup old notifications", description = "Delete notifications older than 30 days")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<String> cleanupOldNotifications() {
        User currentUser = authService.getCurrentUser();
        notificationService.cleanupOldNotifications(currentUser.getId());
        return ResponseEntity.ok("Old notifications cleaned up successfully");
    }
}