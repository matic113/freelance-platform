package com.freelance.platform.repository;

import com.freelance.platform.entity.FraudDetection;
import com.freelance.platform.entity.FraudStatus;
import com.freelance.platform.entity.FraudType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FraudDetectionRepository extends JpaRepository<FraudDetection, UUID> {
    
    List<FraudDetection> findByEntityTypeAndStatus(String entityType, FraudStatus status);
    
    List<FraudDetection> findByFraudType(FraudType fraudType);
    
    List<FraudDetection> findByStatus(FraudStatus status);
    
    List<FraudDetection> findByEntityType(String entityType);
    
    List<FraudDetection> findByEntityId(String entityId);
    
    List<FraudDetection> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<FraudDetection> findByInvestigatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT fd FROM FraudDetection fd WHERE fd.entityType = :entityType AND fd.status = :status ORDER BY fd.createdAt DESC")
    List<FraudDetection> findRecentByEntityTypeAndStatus(@Param("entityType") String entityType, @Param("status") FraudStatus status);
    
    @Query("SELECT fd FROM FraudDetection fd WHERE fd.fraudType = :fraudType AND fd.status = :status ORDER BY fd.createdAt DESC")
    List<FraudDetection> findRecentByFraudTypeAndStatus(@Param("fraudType") FraudType fraudType, @Param("status") FraudStatus status);
    
    @Query("SELECT fd FROM FraudDetection fd WHERE fd.riskScore >= :minRiskScore ORDER BY fd.riskScore DESC")
    List<FraudDetection> findByRiskScoreGreaterThanEqual(@Param("minRiskScore") Double minRiskScore);
    
    @Query("SELECT fd FROM FraudDetection fd WHERE fd.riskScore <= :maxRiskScore ORDER BY fd.riskScore ASC")
    List<FraudDetection> findByRiskScoreLessThanEqual(@Param("maxRiskScore") Double maxRiskScore);
    
    @Query("SELECT fd FROM FraudDetection fd WHERE fd.riskScore BETWEEN :minRiskScore AND :maxRiskScore ORDER BY fd.riskScore DESC")
    List<FraudDetection> findByRiskScoreBetween(@Param("minRiskScore") Double minRiskScore, @Param("maxRiskScore") Double maxRiskScore);
    
    long countByEntityType(String entityType);
    
    long countByFraudType(FraudType fraudType);
    
    long countByStatus(FraudStatus status);
    
    long countByEntityTypeAndStatus(String entityType, FraudStatus status);
    
    long countByFraudTypeAndStatus(FraudType fraudType, FraudStatus status);
    
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    long countByInvestigatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT COUNT(fd) FROM FraudDetection fd WHERE fd.riskScore >= :minRiskScore")
    long countByRiskScoreGreaterThanEqual(@Param("minRiskScore") Double minRiskScore);
    
    @Query("SELECT COUNT(fd) FROM FraudDetection fd WHERE fd.riskScore <= :maxRiskScore")
    long countByRiskScoreLessThanEqual(@Param("maxRiskScore") Double maxRiskScore);
    
    @Query("SELECT COUNT(fd) FROM FraudDetection fd WHERE fd.riskScore BETWEEN :minRiskScore AND :maxRiskScore")
    long countByRiskScoreBetween(@Param("minRiskScore") Double minRiskScore, @Param("maxRiskScore") Double maxRiskScore);
    
    @Query("SELECT AVG(fd.riskScore) FROM FraudDetection fd")
    Double getAverageRiskScore();
    
    @Query("SELECT MAX(fd.riskScore) FROM FraudDetection fd")
    Double getMaxRiskScore();
    
    @Query("SELECT MIN(fd.riskScore) FROM FraudDetection fd")
    Double getMinRiskScore();
}
