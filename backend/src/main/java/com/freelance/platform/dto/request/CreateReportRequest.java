package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Request to create a new report")
public class CreateReportRequest {

    @NotNull(message = "Report type is required")
    @Schema(description = "Type of report", example = "USER", allowableValues = {"USER", "PROJECT", "PROPOSAL", "MESSAGE", "CONTENT", "PAYMENT", "OTHER"})
    private String reportType;

    @NotBlank(message = "Category is required")
    @Schema(description = "Report category", example = "harassment")
    private String category;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    @Schema(description = "Detailed description of the issue", example = "This user has been sending inappropriate messages.")
    private String description;

    @Schema(description = "ID of the reported user", example = "123e4567-e89b-12d3-a456-426614174000")
    private String reportedUserId;

    @Schema(description = "ID of the reported project", example = "123e4567-e89b-12d3-a456-426614174000")
    private String reportedProjectId;

    @Schema(description = "ID of the reported proposal", example = "123e4567-e89b-12d3-a456-426614174000")
    private String reportedProposalId;

    @Schema(description = "ID of the reported message", example = "123e4567-e89b-12d3-a456-426614174000")
    private String reportedMessageId;

    @Schema(description = "Additional evidence or screenshots")
    private List<String> evidence;

    @Schema(description = "Priority level", example = "MEDIUM", allowableValues = {"LOW", "MEDIUM", "HIGH", "URGENT"})
    private String priority = "MEDIUM";

    // Constructors
    public CreateReportRequest() {}

    public CreateReportRequest(String reportType, String category, String description) {
        this.reportType = reportType;
        this.category = category;
        this.description = description;
    }

    // Getters and Setters
    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(String reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedProjectId() {
        return reportedProjectId;
    }

    public void setReportedProjectId(String reportedProjectId) {
        this.reportedProjectId = reportedProjectId;
    }

    public String getReportedProposalId() {
        return reportedProposalId;
    }

    public void setReportedProposalId(String reportedProposalId) {
        this.reportedProposalId = reportedProposalId;
    }

    public String getReportedMessageId() {
        return reportedMessageId;
    }

    public void setReportedMessageId(String reportedMessageId) {
        this.reportedMessageId = reportedMessageId;
    }

    public List<String> getEvidence() {
        return evidence;
    }

    public void setEvidence(List<String> evidence) {
        this.evidence = evidence;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
