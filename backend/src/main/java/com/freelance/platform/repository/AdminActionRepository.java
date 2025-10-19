package com.freelance.platform.repository;

import com.freelance.platform.entity.AdminAction;
import com.freelance.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminAction, UUID> {
    
    List<AdminAction> findByUser(User user);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user ORDER BY aa.createdAt DESC")
    List<AdminAction> findByUserOrderByCreatedAtDesc(@Param("user") User user);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByUserOrderByCreatedAtDesc(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.actionType = :actionType ORDER BY aa.createdAt DESC")
    List<AdminAction> findByActionType(@Param("actionType") String actionType);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.actionType = :actionType ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByActionType(@Param("actionType") String actionType, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.entityType = :entityType ORDER BY aa.createdAt DESC")
    List<AdminAction> findByEntityType(@Param("entityType") String entityType);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.entityType = :entityType ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByEntityType(@Param("entityType") String entityType, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.entityId = :entityId ORDER BY aa.createdAt DESC")
    List<AdminAction> findByEntityId(@Param("entityId") String entityId);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.entityId = :entityId ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByEntityId(@Param("entityId") String entityId, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user AND aa.actionType = :actionType ORDER BY aa.createdAt DESC")
    List<AdminAction> findByUserAndActionType(@Param("user") User user, @Param("actionType") String actionType);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user AND aa.actionType = :actionType ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByUserAndActionType(@Param("user") User user, @Param("actionType") String actionType, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user AND aa.entityType = :entityType ORDER BY aa.createdAt DESC")
    List<AdminAction> findByUserAndEntityType(@Param("user") User user, @Param("entityType") String entityType);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user AND aa.entityType = :entityType ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByUserAndEntityType(@Param("user") User user, @Param("entityType") String entityType, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.actionType = :actionType AND aa.entityType = :entityType ORDER BY aa.createdAt DESC")
    List<AdminAction> findByActionTypeAndEntityType(@Param("actionType") String actionType, @Param("entityType") String entityType);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.actionType = :actionType AND aa.entityType = :entityType ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByActionTypeAndEntityType(@Param("actionType") String actionType, @Param("entityType") String entityType, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.createdAt BETWEEN :startDate AND :endDate ORDER BY aa.createdAt DESC")
    List<AdminAction> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.createdAt BETWEEN :startDate AND :endDate ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user AND aa.createdAt BETWEEN :startDate AND :endDate ORDER BY aa.createdAt DESC")
    List<AdminAction> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user = :user AND aa.createdAt BETWEEN :startDate AND :endDate ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.user = :user")
    long countByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.actionType = :actionType")
    long countByActionType(@Param("actionType") String actionType);
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.entityType = :entityType")
    long countByEntityType(@Param("entityType") String entityType);
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.user = :user AND aa.actionType = :actionType")
    long countByUserAndActionType(@Param("user") User user, @Param("actionType") String actionType);
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.user = :user AND aa.entityType = :entityType")
    long countByUserAndEntityType(@Param("user") User user, @Param("entityType") String entityType);
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.actionType = :actionType AND aa.entityType = :entityType")
    long countByActionTypeAndEntityType(@Param("actionType") String actionType, @Param("entityType") String entityType);
    
    @Query("SELECT DISTINCT aa.actionType FROM AdminAction aa WHERE aa.actionType IS NOT NULL ORDER BY aa.actionType")
    List<String> findAllActionTypes();
    
    @Query("SELECT DISTINCT aa.entityType FROM AdminAction aa WHERE aa.entityType IS NOT NULL ORDER BY aa.entityType")
    List<String> findAllEntityTypes();
    
    @Query("SELECT DISTINCT aa.actionType FROM AdminAction aa WHERE aa.user = :user AND aa.actionType IS NOT NULL ORDER BY aa.actionType")
    List<String> findActionTypesByUser(@Param("user") User user);
    
    @Query("SELECT DISTINCT aa.entityType FROM AdminAction aa WHERE aa.user = :user AND aa.entityType IS NOT NULL ORDER BY aa.entityType")
    List<String> findEntityTypesByUser(@Param("user") User user);
    
    // Additional methods needed by AdminActionService
    @Query("SELECT aa FROM AdminAction aa ORDER BY aa.createdAt DESC")
    Page<AdminAction> findAllOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.user.id = :userId ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.actionType = :actionType ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByActionTypeOrderByCreatedAtDesc(@Param("actionType") String actionType, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa WHERE aa.entityType = :entityType AND aa.entityId = :entityId ORDER BY aa.createdAt DESC")
    Page<AdminAction> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(@Param("entityType") String entityType, @Param("entityId") String entityId, Pageable pageable);
    
    @Query("SELECT aa FROM AdminAction aa ORDER BY aa.createdAt DESC")
    List<AdminAction> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(aa) FROM AdminAction aa WHERE aa.user.id = :userId")
    long countByUserId(@Param("userId") UUID userId);
}
