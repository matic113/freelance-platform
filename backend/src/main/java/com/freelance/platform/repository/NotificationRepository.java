package com.freelance.platform.repository;

import com.freelance.platform.entity.Notification;
import com.freelance.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    
    // Find notifications by user
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    // Find unread notifications
    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(UUID userId);
    
    // Count unread notifications
    long countByUserAndIsReadFalse(User user);
    
    long countByUserIdAndIsReadFalse(UUID userId);
    
    // Count total notifications
    long countByUser(User user);
    
    // Find notifications by type
    Page<Notification> findByUserAndTypeOrderByCreatedAtDesc(User user, String type, Pageable pageable);
    
    Page<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(UUID userId, String type, Pageable pageable);
    
    // Find notifications by priority
    Page<Notification> findByUserAndPriorityOrderByCreatedAtDesc(User user, String priority, Pageable pageable);
    
    Page<Notification> findByUserIdAndPriorityOrderByCreatedAtDesc(UUID userId, String priority, Pageable pageable);
    
    // Search notifications
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.message) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findByUserAndSearchTerm(@Param("user") User user, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(n.message) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findByUserIdAndSearchTerm(@Param("userId") UUID userId, @Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Mark notifications as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user")
    void markAllAsReadByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsReadByUserId(@Param("userId") UUID userId);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND n.user = :user")
    void markAsReadByIdAndUser(@Param("id") UUID id, @Param("user") User user);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id AND n.user.id = :userId")
    void markAsReadByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);
    
    // Delete old notifications
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user = :user AND n.createdAt < :cutoffDate")
    void deleteOldNotificationsByUser(@Param("user") User user, @Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user.id = :userId AND n.createdAt < :cutoffDate")
    void deleteOldNotificationsByUserId(@Param("userId") UUID userId, @Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Find notifications created today
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND DATE(n.createdAt) = CURRENT_DATE ORDER BY n.createdAt DESC")
    List<Notification> findTodayNotificationsByUser(@Param("user") User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND DATE(n.createdAt) = CURRENT_DATE ORDER BY n.createdAt DESC")
    List<Notification> findTodayNotificationsByUserId(@Param("userId") UUID userId);
    
    // Count notifications by priority
    long countByUserAndPriority(User user, String priority);
    
    long countByUserIdAndPriority(UUID userId, String priority);
}