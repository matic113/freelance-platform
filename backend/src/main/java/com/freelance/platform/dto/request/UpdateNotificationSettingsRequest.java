package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotNull;

public class UpdateNotificationSettingsRequest {
    
    // Email Notifications
    private Boolean emailNewProposals;
    private Boolean emailNewMessages;
    private Boolean emailPayments;
    private Boolean emailNewReviews;
    private Boolean emailSystemNotifications;
    private Boolean emailMarketingEmails;
    
    // Push Notifications
    private Boolean pushNewProposals;
    private Boolean pushNewMessages;
    private Boolean pushPayments;
    private Boolean pushNewReviews;
    private Boolean pushSystemNotifications;
    
    // Frequency Settings
    private String emailFrequency;
    private String pushFrequency;
    
    // Constructors
    public UpdateNotificationSettingsRequest() {}
    
    // Getters and Setters
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
    
    public String getEmailFrequency() {
        return emailFrequency;
    }
    
    public void setEmailFrequency(String emailFrequency) {
        this.emailFrequency = emailFrequency;
    }
    
    public String getPushFrequency() {
        return pushFrequency;
    }
    
    public void setPushFrequency(String pushFrequency) {
        this.pushFrequency = pushFrequency;
    }
}
