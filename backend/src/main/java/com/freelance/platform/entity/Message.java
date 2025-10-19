package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;
    
    @Enumerated(EnumType.STRING)
    private MessageType messageType = MessageType.TEXT;
    
     @ElementCollection
     @CollectionTable(name = "message_attachments")
     @Column(columnDefinition = "LONGTEXT")
     private List<String> attachments = new ArrayList<>();
    
    private Boolean isRead = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors
    public Message() {}
    
    public Message(User sender, User recipient, Project project, String content, MessageType messageType) {
        this.sender = sender;
        this.recipient = recipient;
        this.project = project;
        this.content = content;
        this.messageType = messageType;
    }
    
    public Message(Conversation conversation, User sender, String content, MessageType messageType) {
        this.conversation = conversation;
        this.sender = sender;
        this.recipient = conversation.getOtherParticipant(sender);
        this.content = content;
        this.messageType = messageType;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public User getSender() {
        return sender;
    }
    
    public void setSender(User sender) {
        this.sender = sender;
    }
    
    public User getRecipient() {
        return recipient;
    }
    
    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public Conversation getConversation() {
        return conversation;
    }
    
    public void setConversation(Conversation conversation) {
        this.conversation = conversation;
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
    
    // Helper methods
    public boolean isText() {
        return messageType == MessageType.TEXT;
    }
    
    public boolean isFile() {
        return messageType == MessageType.FILE;
    }
    
    public boolean isImage() {
        return messageType == MessageType.IMAGE;
    }
    
    public boolean isSystem() {
        return messageType == MessageType.SYSTEM;
    }
}
