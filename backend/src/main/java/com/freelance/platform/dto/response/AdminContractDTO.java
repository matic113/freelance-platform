package com.freelance.platform.dto.response;

import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.ContractStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Admin contract response with user details")
public class AdminContractDTO {

    @Schema(description = "Contract ID")
    private UUID id;

    @Schema(description = "Contract title")
    private String title;

    @Schema(description = "Contract description")
    private String description;

    @Schema(description = "Total contract amount")
    private BigDecimal totalAmount;

    @Schema(description = "Currency code")
    private String currency;

    @Schema(description = "Contract status")
    private ContractStatus status;

    @Schema(description = "Contract start date")
    private LocalDate startDate;

    @Schema(description = "Contract end date")
    private LocalDate endDate;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;

    @Schema(description = "Project title")
    private String projectTitle;

    @Schema(description = "Project ID")
    private UUID projectId;

    @Schema(description = "Client full name")
    private String clientName;

    @Schema(description = "Client email")
    private String clientEmail;

    @Schema(description = "Client ID")
    private UUID clientId;

    @Schema(description = "Freelancer full name")
    private String freelancerName;

    @Schema(description = "Freelancer email")
    private String freelancerEmail;

    @Schema(description = "Freelancer ID")
    private UUID freelancerId;

    @Schema(description = "Proposal ID")
    private UUID proposalId;

    public AdminContractDTO() {}

    public static AdminContractDTO fromEntity(Contract contract) {
        AdminContractDTO dto = new AdminContractDTO();
        dto.setId(contract.getId());
        dto.setTitle(contract.getTitle());
        dto.setDescription(contract.getDescription());
        dto.setTotalAmount(contract.getTotalAmount());
        dto.setCurrency(contract.getCurrency());
        dto.setStatus(contract.getStatus());
        dto.setStartDate(contract.getStartDate());
        dto.setEndDate(contract.getEndDate());
        dto.setCreatedAt(contract.getCreatedAt());
        dto.setUpdatedAt(contract.getUpdatedAt());

        if (contract.getProject() != null) {
            dto.setProjectId(contract.getProject().getId());
            dto.setProjectTitle(contract.getProject().getTitle());
        }

        if (contract.getClient() != null) {
            dto.setClientId(contract.getClient().getId());
            dto.setClientName(contract.getClient().getFullName());
            dto.setClientEmail(contract.getClient().getEmail());
        }

        if (contract.getFreelancer() != null) {
            dto.setFreelancerId(contract.getFreelancer().getId());
            dto.setFreelancerName(contract.getFreelancer().getFullName());
            dto.setFreelancerEmail(contract.getFreelancer().getEmail());
        }

        if (contract.getProposal() != null) {
            dto.setProposalId(contract.getProposal().getId());
        }

        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public UUID getClientId() {
        return clientId;
    }

    public void setClientId(UUID clientId) {
        this.clientId = clientId;
    }

    public String getFreelancerName() {
        return freelancerName;
    }

    public void setFreelancerName(String freelancerName) {
        this.freelancerName = freelancerName;
    }

    public String getFreelancerEmail() {
        return freelancerEmail;
    }

    public void setFreelancerEmail(String freelancerEmail) {
        this.freelancerEmail = freelancerEmail;
    }

    public UUID getFreelancerId() {
        return freelancerId;
    }

    public void setFreelancerId(UUID freelancerId) {
        this.freelancerId = freelancerId;
    }

    public UUID getProposalId() {
        return proposalId;
    }

    public void setProposalId(UUID proposalId) {
        this.proposalId = proposalId;
    }
}
