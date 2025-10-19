package com.freelance.platform.repository;

import com.freelance.platform.entity.SystemLog;
import com.freelance.platform.entity.LogLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, UUID> {
    
    List<SystemLog> findByLevel(LogLevel level);
    
    List<SystemLog> findByCategory(String category);
    
    List<SystemLog> findByUserId(String userId);
    
    List<SystemLog> findBySessionId(String sessionId);
    
    List<SystemLog> findByIpAddress(String ipAddress);
    
    List<SystemLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<SystemLog> findByCreatedAtBefore(LocalDateTime date);
    
    List<SystemLog> findByCreatedAtAfter(LocalDateTime date);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.level = :level ORDER BY sl.createdAt DESC")
    List<SystemLog> findByLevelOrderByCreatedAtDesc(@Param("level") LogLevel level);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.category = :category ORDER BY sl.createdAt DESC")
    List<SystemLog> findByCategoryOrderByCreatedAtDesc(@Param("category") String category);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.userId = :userId ORDER BY sl.createdAt DESC")
    List<SystemLog> findByUserIdOrderByCreatedAtDesc(@Param("userId") String userId);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.sessionId = :sessionId ORDER BY sl.createdAt DESC")
    List<SystemLog> findBySessionIdOrderByCreatedAtDesc(@Param("sessionId") String sessionId);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.ipAddress = :ipAddress ORDER BY sl.createdAt DESC")
    List<SystemLog> findByIpAddressOrderByCreatedAtDesc(@Param("ipAddress") String ipAddress);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.level = :level AND sl.category = :category ORDER BY sl.createdAt DESC")
    List<SystemLog> findByLevelAndCategoryOrderByCreatedAtDesc(@Param("level") LogLevel level, @Param("category") String category);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.level = :level AND sl.userId = :userId ORDER BY sl.createdAt DESC")
    List<SystemLog> findByLevelAndUserIdOrderByCreatedAtDesc(@Param("level") LogLevel level, @Param("userId") String userId);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.category = :category AND sl.userId = :userId ORDER BY sl.createdAt DESC")
    List<SystemLog> findByCategoryAndUserIdOrderByCreatedAtDesc(@Param("category") String category, @Param("userId") String userId);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.message LIKE %:message% ORDER BY sl.createdAt DESC")
    List<SystemLog> findByMessageContaining(@Param("message") String message);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.details LIKE %:details% ORDER BY sl.createdAt DESC")
    List<SystemLog> findByDetailsContaining(@Param("details") String details);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.createdAt >= :since ORDER BY sl.createdAt DESC")
    List<SystemLog> findRecentLogs(@Param("since") LocalDateTime since);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.createdAt >= :since AND sl.level = :level ORDER BY sl.createdAt DESC")
    List<SystemLog> findRecentLogsByLevel(@Param("since") LocalDateTime since, @Param("level") LogLevel level);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.createdAt >= :since AND sl.category = :category ORDER BY sl.createdAt DESC")
    List<SystemLog> findRecentLogsByCategory(@Param("since") LocalDateTime since, @Param("category") String category);
    
    @Query("SELECT sl FROM SystemLog sl WHERE sl.createdAt >= :since AND sl.userId = :userId ORDER BY sl.createdAt DESC")
    List<SystemLog> findRecentLogsByUser(@Param("since") LocalDateTime since, @Param("userId") String userId);
    
    long countByLevel(LogLevel level);
    
    long countByCategory(String category);
    
    long countByUserId(String userId);
    
    long countBySessionId(String sessionId);
    
    long countByIpAddress(String ipAddress);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    long countByCreatedAtBefore(LocalDateTime date);
    
    long countByCreatedAtAfter(LocalDateTime date);
    
    long countByLevelAndCategory(LogLevel level, String category);
    
    long countByLevelAndUserId(LogLevel level, String userId);
    
    long countByCategoryAndUserId(String category, String userId);
    
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.message LIKE %:message%")
    long countByMessageContaining(@Param("message") String message);
    
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.details LIKE %:details%")
    long countByDetailsContaining(@Param("details") String details);
    
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.createdAt >= :since")
    long countRecentLogs(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.createdAt >= :since AND sl.level = :level")
    long countRecentLogsByLevel(@Param("since") LocalDateTime since, @Param("level") LogLevel level);
    
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.createdAt >= :since AND sl.category = :category")
    long countRecentLogsByCategory(@Param("since") LocalDateTime since, @Param("category") String category);
    
    @Query("SELECT COUNT(sl) FROM SystemLog sl WHERE sl.createdAt >= :since AND sl.userId = :userId")
    long countRecentLogsByUser(@Param("since") LocalDateTime since, @Param("userId") String userId);
    
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, sl.createdAt, NOW())) FROM SystemLog sl WHERE sl.createdAt >= :since")
    Double getAverageAgeInHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT MAX(TIMESTAMPDIFF(HOUR, sl.createdAt, NOW())) FROM SystemLog sl WHERE sl.createdAt >= :since")
    Double getMaxAgeInHours(@Param("since") LocalDateTime since);
    
    @Query("SELECT MIN(TIMESTAMPDIFF(HOUR, sl.createdAt, NOW())) FROM SystemLog sl WHERE sl.createdAt >= :since")
    Double getMinAgeInHours(@Param("since") LocalDateTime since);
}
