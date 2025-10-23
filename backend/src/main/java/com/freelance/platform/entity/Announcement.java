package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "announcements")
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Enumerated(EnumType.STRING)
    private AnnouncementPriority priority = AnnouncementPriority.NORMAL;
    
    private Boolean sendEmail = false;
    
    @Enumerated(EnumType.STRING)
    private TargetAudience targetAudience = TargetAudience.ALL;
    
    private Integer recipientCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_admin_id", nullable = false)
    private User createdBy;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime sentAt;
    
    public Announcement() {}
    
    public Announcement(String title, String message, AnnouncementPriority priority, Boolean sendEmail, TargetAudience targetAudience, User createdBy) {
        this.title = title;
        this.message = message;
        this.priority = priority;
        this.sendEmail = sendEmail;
        this.targetAudience = targetAudience;
        this.createdBy = createdBy;
    }
    
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public AnnouncementPriority getPriority() {
        return priority;
    }
    
    public void setPriority(AnnouncementPriority priority) {
        this.priority = priority;
    }
    
    public Boolean getSendEmail() {
        return sendEmail;
    }
    
    public void setSendEmail(Boolean sendEmail) {
        this.sendEmail = sendEmail;
    }
    
    public TargetAudience getTargetAudience() {
        return targetAudience;
    }
    
    public void setTargetAudience(TargetAudience targetAudience) {
        this.targetAudience = targetAudience;
    }
    
    public Integer getRecipientCount() {
        return recipientCount;
    }
    
    public void setRecipientCount(Integer recipientCount) {
        this.recipientCount = recipientCount;
    }
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
