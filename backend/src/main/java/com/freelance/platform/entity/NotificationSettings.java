package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Email Notifications
    @Column(name = "email_new_proposals", nullable = false)
    private Boolean emailNewProposals = true;
    
    @Column(name = "email_new_messages", nullable = false)
    private Boolean emailNewMessages = true;
    
    @Column(name = "email_payments", nullable = false)
    private Boolean emailPayments = true;
    
    @Column(name = "email_new_reviews", nullable = false)
    private Boolean emailNewReviews = true;
    
    @Column(name = "email_system_notifications", nullable = false)
    private Boolean emailSystemNotifications = true;
    
    @Column(name = "email_marketing_emails", nullable = false)
    private Boolean emailMarketingEmails = false;
    
    // Push Notifications
    @Column(name = "push_new_proposals", nullable = false)
    private Boolean pushNewProposals = true;
    
    @Column(name = "push_new_messages", nullable = false)
    private Boolean pushNewMessages = true;
    
    @Column(name = "push_payments", nullable = false)
    private Boolean pushPayments = true;
    
    @Column(name = "push_new_reviews", nullable = false)
    private Boolean pushNewReviews = true;
    
    @Column(name = "push_system_notifications", nullable = false)
    private Boolean pushSystemNotifications = true;
    
    // Frequency Settings
    @Enumerated(EnumType.STRING)
    @Column(name = "email_frequency", nullable = false)
    private EmailFrequency emailFrequency = EmailFrequency.DAILY;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "push_frequency", nullable = false)
    private PushFrequency pushFrequency = PushFrequency.IMMEDIATE;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Enums
    public enum EmailFrequency {
        IMMEDIATE, DAILY, WEEKLY, NEVER
    }
    
    public enum PushFrequency {
        IMMEDIATE, DAILY, WEEKLY, NEVER
    }
    
    // Constructors
    public NotificationSettings() {}
    
    public NotificationSettings(User user) {
        this.user = user;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Boolean getEmailNewProposals() {
        return emailNewProposals;
    }
    
    public void setEmailNewProposals(Boolean emailNewProposals) {
        this.emailNewProposals = emailNewProposals;
    }
    
    public Boolean getEmailNewMessages() {
        return emailNewMessages;
    }
    
    public void setEmailNewMessages(Boolean emailNewMessages) {
        this.emailNewMessages = emailNewMessages;
    }
    
    public Boolean getEmailPayments() {
        return emailPayments;
    }
    
    public void setEmailPayments(Boolean emailPayments) {
        this.emailPayments = emailPayments;
    }
    
    public Boolean getEmailNewReviews() {
        return emailNewReviews;
    }
    
    public void setEmailNewReviews(Boolean emailNewReviews) {
        this.emailNewReviews = emailNewReviews;
    }
    
    public Boolean getEmailSystemNotifications() {
        return emailSystemNotifications;
    }
    
    public void setEmailSystemNotifications(Boolean emailSystemNotifications) {
        this.emailSystemNotifications = emailSystemNotifications;
    }
    
    public Boolean getEmailMarketingEmails() {
        return emailMarketingEmails;
    }
    
    public void setEmailMarketingEmails(Boolean emailMarketingEmails) {
        this.emailMarketingEmails = emailMarketingEmails;
    }
    
    public Boolean getPushNewProposals() {
        return pushNewProposals;
    }
    
    public void setPushNewProposals(Boolean pushNewProposals) {
        this.pushNewProposals = pushNewProposals;
    }
    
    public Boolean getPushNewMessages() {
        return pushNewMessages;
    }
    
    public void setPushNewMessages(Boolean pushNewMessages) {
        this.pushNewMessages = pushNewMessages;
    }
    
    public Boolean getPushPayments() {
        return pushPayments;
    }
    
    public void setPushPayments(Boolean pushPayments) {
        this.pushPayments = pushPayments;
    }
    
    public Boolean getPushNewReviews() {
        return pushNewReviews;
    }
    
    public void setPushNewReviews(Boolean pushNewReviews) {
        this.pushNewReviews = pushNewReviews;
    }
    
    public Boolean getPushSystemNotifications() {
        return pushSystemNotifications;
    }
    
    public void setPushSystemNotifications(Boolean pushSystemNotifications) {
        this.pushSystemNotifications = pushSystemNotifications;
    }
    
    public EmailFrequency getEmailFrequency() {
        return emailFrequency;
    }
    
    public void setEmailFrequency(EmailFrequency emailFrequency) {
        this.emailFrequency = emailFrequency;
    }
    
    public PushFrequency getPushFrequency() {
        return pushFrequency;
    }
    
    public void setPushFrequency(PushFrequency pushFrequency) {
        this.pushFrequency = pushFrequency;
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
}
