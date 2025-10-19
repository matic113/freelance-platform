package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fraud_detection")
public class FraudDetection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private String entityId;
    
    @Enumerated(EnumType.STRING)
    private FraudType fraudType;
    
    @Enumerated(EnumType.STRING)
    private FraudStatus status = FraudStatus.DETECTED;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal riskScore;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String evidence;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investigated_by")
    private User investigatedBy;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime investigatedAt;
    
    // Constructors
    public FraudDetection() {}
    
    public FraudDetection(String entityType, String entityId, FraudType fraudType, BigDecimal riskScore, String description) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.fraudType = fraudType;
        this.riskScore = riskScore;
        this.description = description;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getEntityType() {
        return entityType;
    }
    
    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }
    
    public String getEntityId() {
        return entityId;
    }
    
    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }
    
    public FraudType getFraudType() {
        return fraudType;
    }
    
    public void setFraudType(FraudType fraudType) {
        this.fraudType = fraudType;
    }
    
    public FraudStatus getStatus() {
        return status;
    }
    
    public void setStatus(FraudStatus status) {
        this.status = status;
    }
    
    public BigDecimal getRiskScore() {
        return riskScore;
    }
    
    public void setRiskScore(BigDecimal riskScore) {
        this.riskScore = riskScore;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getEvidence() {
        return evidence;
    }
    
    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }
    
    public User getInvestigatedBy() {
        return investigatedBy;
    }
    
    public void setInvestigatedBy(User investigatedBy) {
        this.investigatedBy = investigatedBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getInvestigatedAt() {
        return investigatedAt;
    }
    
    public void setInvestigatedAt(LocalDateTime investigatedAt) {
        this.investigatedAt = investigatedAt;
    }
}
