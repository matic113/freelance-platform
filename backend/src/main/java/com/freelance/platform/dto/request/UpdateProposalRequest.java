package com.freelance.platform.dto.request;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.List;

public class UpdateProposalRequest {

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @DecimalMin(value = "0.01", message = "Proposed amount must be greater than 0")
    private BigDecimal proposedAmount;

    private String currency;

    @Size(max = 100, message = "Estimated duration must not exceed 100 characters")
    private String estimatedDuration;

    private List<String> attachments;

    // Constructors
    public UpdateProposalRequest() {}

    public UpdateProposalRequest(String title, String description, BigDecimal proposedAmount, 
                               String currency, String estimatedDuration, List<String> attachments) {
        this.title = title;
        this.description = description;
        this.proposedAmount = proposedAmount;
        this.currency = currency;
        this.estimatedDuration = estimatedDuration;
        this.attachments = attachments;
    }

    // Getters and Setters
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
