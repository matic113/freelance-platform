package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a conversation between users (direct messaging or project-based)
 */
@Entity
@Table(name = "conversations", indexes = {
    @Index(name = "idx_participant1", columnList = "participant1_id"),
    @Index(name = "idx_participant2", columnList = "participant2_id"),
    @Index(name = "idx_type", columnList = "type"),
    @Index(name = "idx_last_message", columnList = "last_message_at DESC")
})
public class Conversation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant1_id", nullable = false)
    private User participant1;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant2_id", nullable = false)
    private User participant2;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConversationType type;
    
    @Column(nullable = false)
    private LocalDateTime lastMessageAt;
    
    private String lastMessagePreview;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private Boolean participant1Blocked = false;
    private Boolean participant2Blocked = false;
    
    // Constructors
    public Conversation() {}
    
    public Conversation(User participant1, User participant2, ConversationType type) {
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.type = type;
        this.lastMessageAt = LocalDateTime.now();
    }
    
    public Conversation(User participant1, User participant2, Project project, ConversationType type) {
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.project = project;
        this.type = type;
        this.lastMessageAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public User getParticipant1() {
        return participant1;
    }
    
    public void setParticipant1(User participant1) {
        this.participant1 = participant1;
    }
    
    public User getParticipant2() {
        return participant2;
    }
    
    public void setParticipant2(User participant2) {
        this.participant2 = participant2;
    }
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public ConversationType getType() {
        return type;
    }
    
    public void setType(ConversationType type) {
        this.type = type;
    }
    
    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }
    
    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }
    
    public String getLastMessagePreview() {
        return lastMessagePreview;
    }
    
    public void setLastMessagePreview(String lastMessagePreview) {
        this.lastMessagePreview = lastMessagePreview;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Boolean getParticipant1Blocked() {
        return participant1Blocked;
    }
    
    public void setParticipant1Blocked(Boolean participant1Blocked) {
        this.participant1Blocked = participant1Blocked;
    }
    
    public Boolean getParticipant2Blocked() {
        return participant2Blocked;
    }
    
    public void setParticipant2Blocked(Boolean participant2Blocked) {
        this.participant2Blocked = participant2Blocked;
    }
    
    /**
     * Check if a user is a participant in this conversation
     */
    public boolean isUserParticipant(User user) {
        return (participant1 != null && participant1.getId().equals(user.getId())) ||
               (participant2 != null && participant2.getId().equals(user.getId()));
    }
    
    /**
     * Get the other participant (not the given user)
     */
    public User getOtherParticipant(User user) {
        if (participant1 != null && participant1.getId().equals(user.getId())) {
            return participant2;
        }
        return participant1;
    }
}
