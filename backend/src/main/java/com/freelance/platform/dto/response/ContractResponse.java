package com.freelance.platform.dto.response;

import com.freelance.platform.entity.ContractStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ContractResponse {

    private UUID id;
    private UUID projectId;
    private String projectTitle;
    private UUID clientId;
    private String clientName;
    private UUID freelancerId;
    private String freelancerName;
    private UUID proposalId;
    private String title;
    private String description;
    private BigDecimal totalAmount;
    private String currency;
    private ContractStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<MilestoneResponse> milestones;

    // Constructors
    public ContractResponse() {}

    public ContractResponse(UUID id, UUID projectId, String projectTitle, UUID clientId, 
                          String clientName, UUID freelancerId, String freelancerName, 
                          UUID proposalId, String title, String description, BigDecimal totalAmount,
                          String currency, ContractStatus status, LocalDate startDate, 
                          LocalDate endDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.clientId = clientId;
        this.clientName = clientName;
        this.freelancerId = freelancerId;
        this.freelancerName = freelancerName;
        this.proposalId = proposalId;
        this.title = title;
        this.description = description;
        this.totalAmount = totalAmount;
        this.currency = currency;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public UUID getProposalId() {
        return proposalId;
    }

    public void setProposalId(UUID proposalId) {
        this.proposalId = proposalId;
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public ContractStatus getStatus() {
        return status;
    }

    public void setStatus(ContractStatus status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
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

    public List<MilestoneResponse> getMilestones() {
        return milestones;
    }

    public void setMilestones(List<MilestoneResponse> milestones) {
        this.milestones = milestones;
    }
}
