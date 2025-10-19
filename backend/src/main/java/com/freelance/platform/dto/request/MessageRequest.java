package com.freelance.platform.dto.request;

import com.freelance.platform.entity.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public class MessageRequest {

    @NotNull(message = "Recipient ID is required")
    private UUID recipientId;

    private UUID projectId;

    @NotBlank(message = "Message content is required")
    @Size(min = 1, max = 2000, message = "Message content must be between 1 and 2000 characters")
    private String content;

    private MessageType messageType = MessageType.TEXT;

    private List<String> attachments;

    // Constructors
    public MessageRequest() {}

    public MessageRequest(UUID recipientId, UUID projectId, String content, 
                         MessageType messageType, List<String> attachments) {
        this.recipientId = recipientId;
        this.projectId = projectId;
        this.content = content;
        this.messageType = messageType;
        this.attachments = attachments;
    }

    // Getters and Setters
    public UUID getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(UUID recipientId) {
        this.recipientId = recipientId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
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
}
