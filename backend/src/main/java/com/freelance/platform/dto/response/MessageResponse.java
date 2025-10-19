package com.freelance.platform.dto.response;

import com.freelance.platform.entity.MessageType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class MessageResponse {

    private UUID id;
    private UUID senderId;
    private String senderName;
    private UUID recipientId;
    private String recipientName;
    private UUID conversationId;
    private UUID projectId;
    private String projectTitle;
    private String content;
    private MessageType messageType;
    private List<String> attachments;
    private Boolean isRead;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private MessageParticipant sender;
    private MessageParticipant recipient;

    // Constructors
    public MessageResponse() {}

    public MessageResponse(UUID id, UUID senderId, String senderName, UUID recipientId, 
                          String recipientName, UUID projectId, String projectTitle,
                          String content, MessageType messageType, List<String> attachments,
                          Boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.senderName = senderName;
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.content = content;
        this.messageType = messageType;
        this.attachments = attachments;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public UUID getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(UUID recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public UUID getConversationId() {
        return conversationId;
    }

    public void setConversationId(UUID conversationId) {
        this.conversationId = conversationId;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
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

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public MessageParticipant getSender() {
        return sender;
    }

    public void setSender(MessageParticipant sender) {
        this.sender = sender;
    }

    public MessageParticipant getRecipient() {
        return recipient;
    }

    public void setRecipient(MessageParticipant recipient) {
        this.recipient = recipient;
    }

    public static class MessageParticipant {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
        private String avatarUrl;

        public MessageParticipant() {}

        public MessageParticipant(UUID id, String firstName, String lastName, String email, String avatarUrl) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.avatarUrl = avatarUrl;
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
    }
}
