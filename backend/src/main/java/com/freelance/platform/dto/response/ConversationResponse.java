package com.freelance.platform.dto.response;

import com.freelance.platform.entity.ConversationType;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for Conversation response
 */
public class ConversationResponse {
    private UUID id;
    private ConversationType type;
    private LocalDateTime lastMessageAt;
    private String lastMessagePreview;
    private LocalDateTime createdAt;
    
    // Other participant info (since we're only showing 2-participant conversations)
    private UUID otherParticipantId;
    private String otherParticipantName;
    private String otherParticipantEmail;
    private String otherParticipantAvatar;

    // Project info (for PROJECT_CHAT conversations)
    private UUID projectId;
    private String projectTitle;

    // Constructors
    public ConversationResponse() {}

    public ConversationResponse(UUID id, ConversationType type, LocalDateTime lastMessageAt, 
                               String lastMessagePreview, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.lastMessageAt = lastMessageAt;
        this.lastMessagePreview = lastMessagePreview;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public UUID getOtherParticipantId() {
        return otherParticipantId;
    }

    public void setOtherParticipantId(UUID otherParticipantId) {
        this.otherParticipantId = otherParticipantId;
    }

    public String getOtherParticipantName() {
        return otherParticipantName;
    }

    public void setOtherParticipantName(String otherParticipantName) {
        this.otherParticipantName = otherParticipantName;
    }

    public String getOtherParticipantEmail() {
        return otherParticipantEmail;
    }

    public void setOtherParticipantEmail(String otherParticipantEmail) {
        this.otherParticipantEmail = otherParticipantEmail;
    }

    public String getOtherParticipantAvatar() {
        return otherParticipantAvatar;
    }

    public void setOtherParticipantAvatar(String otherParticipantAvatar) {
        this.otherParticipantAvatar = otherParticipantAvatar;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }
}
