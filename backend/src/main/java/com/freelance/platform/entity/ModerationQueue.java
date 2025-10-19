package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "moderation_queue")
public class ModerationQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String entityType;
    
    @Column(nullable = false)
    private String entityId;
    
    @Enumerated(EnumType.STRING)
    private ModerationStatus status = ModerationStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    private ModerationPriority priority = ModerationPriority.MEDIUM;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    @Column(columnDefinition = "TEXT")
    private String adminNotes;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id")
    private User assignedAdmin;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime reviewedAt;
    
    // Constructors
    public ModerationQueue() {}
    
    public ModerationQueue(String entityType, String entityId, ModerationPriority priority, String reason) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.priority = priority;
        this.reason = reason;
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
    
    public ModerationStatus getStatus() {
        return status;
    }
    
    public void setStatus(ModerationStatus status) {
        this.status = status;
    }
    
    public ModerationPriority getPriority() {
        return priority;
    }
    
    public void setPriority(ModerationPriority priority) {
        this.priority = priority;
    }
    
    public String getReason() {
        return reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
    
    public User getAssignedAdmin() {
        return assignedAdmin;
    }
    
    public void setAssignedAdmin(User assignedAdmin) {
        this.assignedAdmin = assignedAdmin;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }
    
    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }
}
