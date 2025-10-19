package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class SubmitProposalRequest {

    @NotNull(message = "Project ID is required")
    private UUID projectId;

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 50, max = 2000, message = "Description must be between 50 and 2000 characters")
    private String description;

    @NotNull(message = "Proposed amount is required")
    @DecimalMin(value = "0.01", message = "Proposed amount must be greater than 0")
    private BigDecimal proposedAmount;

    private String currency = "USD";

    @Size(max = 100, message = "Estimated duration must not exceed 100 characters")
    private String estimatedDuration;

    private List<String> attachments;

    // Constructors
    public SubmitProposalRequest() {}

    public SubmitProposalRequest(UUID projectId, String title, String description, 
                                BigDecimal proposedAmount, String currency, 
                                String estimatedDuration, List<String> attachments) {
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.proposedAmount = proposedAmount;
        this.currency = currency;
        this.estimatedDuration = estimatedDuration;
        this.attachments = attachments;
    }

    // Getters and Setters
    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
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

    public List<String> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
}
