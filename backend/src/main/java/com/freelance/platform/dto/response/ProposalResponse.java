package com.freelance.platform.dto.response;

import com.freelance.platform.entity.ProposalStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ProposalResponse {

    private UUID id;
    private UUID projectId;
    private String projectTitle;
    private UUID freelancerId;
    private String freelancerName;
    private UUID clientId;
    private String clientName;
    private String title;
    private String description;
    private BigDecimal proposedAmount;
    private String currency;
    private String estimatedDuration;
    private ProposalStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime respondedAt;
    private List<String> attachments;

    // Constructors
    public ProposalResponse() {}

    public ProposalResponse(UUID id, UUID projectId, String projectTitle, UUID freelancerId, 
                          String freelancerName, UUID clientId, String clientName, String title,
                          String description, BigDecimal proposedAmount, String currency,
                          String estimatedDuration, ProposalStatus status, LocalDateTime submittedAt,
                          LocalDateTime respondedAt, List<String> attachments) {
        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.freelancerId = freelancerId;
        this.freelancerName = freelancerName;
        this.clientId = clientId;
        this.clientName = clientName;
        this.title = title;
        this.description = description;
        this.proposedAmount = proposedAmount;
        this.currency = currency;
        this.estimatedDuration = estimatedDuration;
        this.status = status;
        this.submittedAt = submittedAt;
        this.respondedAt = respondedAt;
        this.attachments = attachments;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public UUID getFreelancerId() {
        return freelancerId;
    }

    public void setFreelancerId(UUID freelancerId) {
        this.freelancerId = freelancerId;
    }

    public String getFreelancerName() {
        return freelancerName;
    }

    public void setFreelancerName(String freelancerName) {
        this.freelancerName = freelancerName;
    }

    public UUID getClientId() {
        return clientId;
    }

    public void setClientId(UUID clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getProposedAmount() {
        return proposedAmount;
    }

    public void setProposedAmount(BigDecimal proposedAmount) {
        this.proposedAmount = proposedAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getEstimatedDuration() {
        return estimatedDuration;
    }

    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public ProposalStatus getStatus() {
        return status;
    }

    public void setStatus(ProposalStatus status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
}
