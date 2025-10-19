package com.freelance.platform.repository;

import com.freelance.platform.entity.ModerationQueue;
import com.freelance.platform.entity.ModerationStatus;
import com.freelance.platform.entity.ModerationPriority;
import com.freelance.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ModerationQueueRepository extends JpaRepository<ModerationQueue, UUID> {
    
    List<ModerationQueue> findByStatus(ModerationStatus status);
    
    List<ModerationQueue> findByPriority(ModerationPriority priority);
    
    List<ModerationQueue> findByPriorityAndStatus(ModerationPriority priority, ModerationStatus status);
    
    List<ModerationQueue> findByEntityType(String entityType);
    
    List<ModerationQueue> findByEntityId(String entityId);
    
    List<ModerationQueue> findByAssignedAdmin(User assignedAdmin);
    
    List<ModerationQueue> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<ModerationQueue> findByReviewedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.status = :status ORDER BY mq.priority DESC, mq.createdAt ASC")
    List<ModerationQueue> findByStatusOrderByPriorityAndCreatedAt(@Param("status") ModerationStatus status);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.priority = :priority ORDER BY mq.createdAt ASC")
    List<ModerationQueue> findByPriorityOrderByCreatedAt(@Param("priority") ModerationPriority priority);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.entityType = :entityType ORDER BY mq.createdAt DESC")
    List<ModerationQueue> findByEntityTypeOrderByCreatedAt(@Param("entityType") String entityType);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.assignedAdmin = :assignedAdmin ORDER BY mq.createdAt DESC")
    List<ModerationQueue> findByAssignedAdminOrderByCreatedAt(@Param("assignedAdmin") User assignedAdmin);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.status = :status AND mq.priority = :priority ORDER BY mq.createdAt ASC")
    List<ModerationQueue> findByStatusAndPriorityOrderByCreatedAt(@Param("status") ModerationStatus status, @Param("priority") ModerationPriority priority);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.status = :status AND mq.entityType = :entityType ORDER BY mq.createdAt DESC")
    List<ModerationQueue> findByStatusAndEntityTypeOrderByCreatedAt(@Param("status") ModerationStatus status, @Param("entityType") String entityType);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.priority = :priority AND mq.entityType = :entityType ORDER BY mq.createdAt ASC")
    List<ModerationQueue> findByPriorityAndEntityTypeOrderByCreatedAt(@Param("priority") ModerationPriority priority, @Param("entityType") String entityType);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.createdAt >= :since ORDER BY mq.createdAt DESC")
    List<ModerationQueue> findRecentItems(@Param("since") LocalDateTime since);
    
    @Query("SELECT mq FROM ModerationQueue mq WHERE mq.reviewedAt >= :since ORDER BY mq.reviewedAt DESC")
    List<ModerationQueue> findRecentlyReviewedItems(@Param("since") LocalDateTime since);
    
    long countByStatus(ModerationStatus status);
    
    long countByPriority(ModerationPriority priority);
    
    long countByPriorityAndStatus(ModerationPriority priority, ModerationStatus status);
    
    long countByEntityType(String entityType);
    
    long countByEntityId(String entityId);
    
    long countByAssignedAdmin(User assignedAdmin);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    long countByReviewedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    long countByStatusAndEntityType(ModerationStatus status, String entityType);
    
    long countByPriorityAndEntityType(ModerationPriority priority, String entityType);
    
    long countByStatusAndPriority(ModerationStatus status, ModerationPriority priority);
    
    @Query("SELECT COUNT(mq) FROM ModerationQueue mq WHERE mq.createdAt >= :since")
    long countRecentItems(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(mq) FROM ModerationQueue mq WHERE mq.reviewedAt >= :since")
    long countRecentlyReviewedItems(@Param("since") LocalDateTime since);
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, mq.createdAt, mq.reviewedAt)) FROM ModerationQueue mq WHERE mq.reviewedAt IS NOT NULL")
    Double getAverageProcessingTimeInHours();
    
    @Query("SELECT MAX(TIMESTAMPDIFF(HOUR, mq.createdAt, mq.reviewedAt)) FROM ModerationQueue mq WHERE mq.reviewedAt IS NOT NULL")
    Double getMaxProcessingTimeInHours();
    
    @Query("SELECT MIN(TIMESTAMPDIFF(HOUR, mq.createdAt, mq.reviewedAt)) FROM ModerationQueue mq WHERE mq.reviewedAt IS NOT NULL")
    Double getMinProcessingTimeInHours();
}
