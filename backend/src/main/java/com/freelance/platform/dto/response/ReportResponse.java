package com.freelance.platform.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Report response")
public class ReportResponse {

    @Schema(description = "Report ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Reporter ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID reporterId;

    @Schema(description = "Reporter name", example = "John Doe")
    private String reporterName;

    @Schema(description = "Reported user ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID reportedUserId;

    @Schema(description = "Reported user name", example = "Jane Smith")
    private String reportedUserName;

    @Schema(description = "Reported project ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID reportedProjectId;

    @Schema(description = "Reported project title", example = "Website Development")
    private String reportedProjectTitle;

    @Schema(description = "Report type", example = "USER")
    private String reportType;

    @Schema(description = "Report category", example = "harassment")
    private String category;

    @Schema(description = "Report description", example = "This user has been sending inappropriate messages.")
    private String description;

    @Schema(description = "Report status", example = "PENDING")
    private String status;

    @Schema(description = "Report priority", example = "MEDIUM")
    private String priority;

    @Schema(description = "Admin notes", example = "Under investigation")
    private String adminNotes;

    @Schema(description = "Report creation date")
    private LocalDateTime createdAt;

    @Schema(description = "Report resolution date")
    private LocalDateTime resolvedAt;

    @Schema(description = "Assigned admin ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID assignedAdminId;

    @Schema(description = "Assigned admin name", example = "Admin User")
    private String assignedAdminName;

    // Constructors
    public ReportResponse() {}

    public ReportResponse(UUID id, UUID reporterId, String reporterName, String reportType, 
                         String category, String description, String status) {
        this.id = id;
        this.reporterId = reporterId;
        this.reporterName = reporterName;
        this.reportType = reportType;
        this.category = category;
        this.description = description;
        this.status = status;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getReporterId() {
        return reporterId;
    }

    public void setReporterId(UUID reporterId) {
        this.reporterId = reporterId;
    }

    public String getReporterName() {
        return reporterName;
    }

    public void setReporterName(String reporterName) {
        this.reporterName = reporterName;
    }

    public UUID getReportedUserId() {
        return reportedUserId;
    }

    public void setReportedUserId(UUID reportedUserId) {
        this.reportedUserId = reportedUserId;
    }

    public String getReportedUserName() {
        return reportedUserName;
    }

    public void setReportedUserName(String reportedUserName) {
        this.reportedUserName = reportedUserName;
    }

    public UUID getReportedProjectId() {
        return reportedProjectId;
    }

    public void setReportedProjectId(UUID reportedProjectId) {
        this.reportedProjectId = reportedProjectId;
    }

    public String getReportedProjectTitle() {
        return reportedProjectTitle;
    }

    public void setReportedProjectTitle(String reportedProjectTitle) {
        this.reportedProjectTitle = reportedProjectTitle;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public UUID getAssignedAdminId() {
        return assignedAdminId;
    }

    public void setAssignedAdminId(UUID assignedAdminId) {
        this.assignedAdminId = assignedAdminId;
    }

    public String getAssignedAdminName() {
        return assignedAdminName;
    }

    public void setAssignedAdminName(String assignedAdminName) {
        this.assignedAdminName = assignedAdminName;
    }
}
