package com.freelance.platform.repository;

import com.freelance.platform.entity.AuditTrail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrail, UUID> {
    
    List<AuditTrail> findByUserId(String userId);
    
    List<AuditTrail> findByAction(String action);
    
    List<AuditTrail> findByEntityType(String entityType);
    
    List<AuditTrail> findByEntityId(String entityId);
    
    List<AuditTrail> findByIpAddress(String ipAddress);
    
    List<AuditTrail> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<AuditTrail> findByCreatedAtBefore(LocalDateTime date);
    
    List<AuditTrail> findByCreatedAtAfter(LocalDateTime date);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.userId = :userId ORDER BY at.createdAt DESC")
    List<AuditTrail> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.action = :action ORDER BY at.createdAt DESC")
    List<AuditTrail> findByActionOrderByCreatedAtDesc(@Param("action") String action);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.entityType = :entityType ORDER BY at.createdAt DESC")
    List<AuditTrail> findByEntityTypeOrderByCreatedAtDesc(@Param("entityType") String entityType);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.entityId = :entityId ORDER BY at.createdAt DESC")
    List<AuditTrail> findByEntityIdOrderByCreatedAtDesc(@Param("entityId") String entityId);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.ipAddress = :ipAddress ORDER BY at.createdAt DESC")
    List<AuditTrail> findByIpAddressOrderByCreatedAtDesc(@Param("ipAddress") String ipAddress);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.userId = :userId AND at.action = :action ORDER BY at.createdAt DESC")
    List<AuditTrail> findByUserIdAndActionOrderByCreatedAtDesc(@Param("userId") String userId, @Param("action") String action);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.userId = :userId AND at.entityType = :entityType ORDER BY at.createdAt DESC")
    List<AuditTrail> findByUserIdAndEntityTypeOrderByCreatedAtDesc(@Param("userId") String userId, @Param("entityType") String entityType);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.action = :action AND at.entityType = :entityType ORDER BY at.createdAt DESC")
    List<AuditTrail> findByActionAndEntityTypeOrderByCreatedAtDesc(@Param("action") String action, @Param("entityType") String entityType);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.entityType = :entityType AND at.entityId = :entityId ORDER BY at.createdAt DESC")
    List<AuditTrail> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(@Param("entityType") String entityType, @Param("entityId") String entityId);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.createdAt >= :since ORDER BY at.createdAt DESC")
    List<AuditTrail> findRecentAuditTrails(@Param("since") LocalDateTime since);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.createdAt >= :since AND at.userId = :userId ORDER BY at.createdAt DESC")
    List<AuditTrail> findRecentAuditTrailsByUser(@Param("since") LocalDateTime since, @Param("userId") String userId);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.createdAt >= :since AND at.action = :action ORDER BY at.createdAt DESC")
    List<AuditTrail> findRecentAuditTrailsByAction(@Param("since") LocalDateTime since, @Param("action") String action);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.createdAt >= :since AND at.entityType = :entityType ORDER BY at.createdAt DESC")
    List<AuditTrail> findRecentAuditTrailsByEntityType(@Param("since") LocalDateTime since, @Param("entityType") String entityType);
    
    @Query("SELECT at FROM AuditTrail at WHERE at.createdAt >= :since AND at.ipAddress = :ipAddress ORDER BY at.createdAt DESC")
    List<AuditTrail> findRecentAuditTrailsByIpAddress(@Param("since") LocalDateTime since, @Param("ipAddress") String ipAddress);
    
    long countByUserId(String userId);
    
    long countByAction(String action);
    
    long countByEntityType(String entityType);
    
    long countByEntityId(String entityId);
    
    long countByIpAddress(String ipAddress);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    long countByCreatedAtBefore(LocalDateTime date);
    
    long countByCreatedAtAfter(LocalDateTime date);
    
    long countByUserIdAndAction(String userId, String action);
    
    long countByUserIdAndEntityType(String userId, String entityType);
    
    long countByActionAndEntityType(String action, String entityType);
    
    long countByEntityTypeAndEntityId(String entityType, String entityId);
    
    @Query("SELECT COUNT(at) FROM AuditTrail at WHERE at.createdAt >= :since")
    long countRecentAuditTrails(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(at) FROM AuditTrail at WHERE at.createdAt >= :since AND at.userId = :userId")
    long countRecentAuditTrailsByUser(@Param("since") LocalDateTime since, @Param("userId") String userId);
    
    @Query("SELECT COUNT(at) FROM AuditTrail at WHERE at.createdAt >= :since AND at.action = :action")
    long countRecentAuditTrailsByAction(@Param("since") LocalDateTime since, @Param("action") String action);
    
    @Query("SELECT COUNT(at) FROM AuditTrail at WHERE at.createdAt >= :since AND at.entityType = :entityType")
    long countRecentAuditTrailsByEntityType(@Param("since") LocalDateTime since, @Param("entityType") String entityType);
    
    @Query("SELECT COUNT(at) FROM AuditTrail at WHERE at.createdAt >= :since AND at.ipAddress = :ipAddress")
    long countRecentAuditTrailsByIpAddress(@Param("since") LocalDateTime since, @Param("ipAddress") String ipAddress);
    
    @Query("SELECT at.userId, COUNT(at) FROM AuditTrail at GROUP BY at.userId ORDER BY COUNT(at) DESC")
    List<Object[]> getAuditTrailsByUserCount();
    
    @Query("SELECT at.action, COUNT(at) FROM AuditTrail at GROUP BY at.action ORDER BY COUNT(at) DESC")
    List<Object[]> getAuditTrailsByActionCount();
    
    @Query("SELECT at.entityType, COUNT(at) FROM AuditTrail at GROUP BY at.entityType ORDER BY COUNT(at) DESC")
    List<Object[]> getAuditTrailsByEntityTypeCount();
    
    @Query("SELECT at.ipAddress, COUNT(at) FROM AuditTrail at GROUP BY at.ipAddress ORDER BY COUNT(at) DESC")
    List<Object[]> getAuditTrailsByIpAddressCount();
    
    @Query("SELECT DATE(at.createdAt), COUNT(at) FROM AuditTrail at GROUP BY DATE(at.createdAt) ORDER BY DATE(at.createdAt) DESC")
    List<Object[]> getAuditTrailsByDateCount();
    
    @Query("SELECT HOUR(at.createdAt), COUNT(at) FROM AuditTrail at GROUP BY HOUR(at.createdAt) ORDER BY HOUR(at.createdAt)")
    List<Object[]> getAuditTrailsByHourCount();
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, at.createdAt, NOW())) FROM AuditTrail at WHERE at.createdAt >= :since")
    Double getAverageAgeInHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT MAX(TIMESTAMPDIFF(HOUR, at.createdAt, NOW())) FROM AuditTrail at WHERE at.createdAt >= :since")
    Double getMaxAgeInHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT MIN(TIMESTAMPDIFF(HOUR, at.createdAt, NOW())) FROM AuditTrail at WHERE at.createdAt >= :since")
    Double getMinAgeInHours(@Param("since") LocalDateTime since);
}
