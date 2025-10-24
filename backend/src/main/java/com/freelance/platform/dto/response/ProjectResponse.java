package com.freelance.platform.dto.response;

import com.freelance.platform.entity.ProjectStatus;
import com.freelance.platform.entity.ProjectType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class ProjectResponse {

    private UUID id;
    private UUID clientId;
    private String clientName;
    private String clientAvatarUrl;
    private String title;
    private String description;
    private String category;
    private List<String> skillsRequired;
    private BigDecimal budgetMin;
    private BigDecimal budgetMax;
    private String currency;
    private ProjectType projectType;
    private String duration;
    private ProjectStatus status;
    private Boolean isFeatured;
    private LocalDate deadline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AttachmentInfo> attachments;

    // Inner class for attachment information
    public static class AttachmentInfo {
        private UUID id;
        private String fileName;
        private String fileUrl;
        private Long fileSize;
        private String fileType;
        private LocalDateTime uploadedAt;

        // Constructors
        public AttachmentInfo() {}

        public AttachmentInfo(UUID id, String fileName, String fileUrl, Long fileSize, 
                            String fileType, LocalDateTime uploadedAt) {
            this.id = id;
            this.fileName = fileName;
            this.fileUrl = fileUrl;
            this.fileSize = fileSize;
            this.fileType = fileType;
            this.uploadedAt = uploadedAt;
        }

        // Getters and Setters
        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getFileUrl() {
            return fileUrl;
        }

        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }

        public Long getFileSize() {
            return fileSize;
        }

        public void setFileSize(Long fileSize) {
            this.fileSize = fileSize;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }

        public LocalDateTime getUploadedAt() {
            return uploadedAt;
        }

        public void setUploadedAt(LocalDateTime uploadedAt) {
            this.uploadedAt = uploadedAt;
        }
    }

    // Constructors
    public ProjectResponse() {}

    public ProjectResponse(UUID id, UUID clientId, String clientName, String clientAvatarUrl, String title, 
                          String description, String category, List<String> skillsRequired,
                          BigDecimal budgetMin, BigDecimal budgetMax, String currency,
                          ProjectType projectType, String duration, ProjectStatus status,
                          Boolean isFeatured, LocalDate deadline, LocalDateTime createdAt,
                          LocalDateTime updatedAt, List<AttachmentInfo> attachments) {
        this.id = id;
        this.clientId = clientId;
        this.clientName = clientName;
        this.clientAvatarUrl = clientAvatarUrl;
        this.title = title;
        this.description = description;
        this.category = category;
        this.skillsRequired = skillsRequired;
        this.budgetMin = budgetMin;
        this.budgetMax = budgetMax;
        this.currency = currency;
        this.projectType = projectType;
        this.duration = duration;
        this.status = status;
        this.isFeatured = isFeatured;
        this.deadline = deadline;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.attachments = attachments;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getClientAvatarUrl() {
        return clientAvatarUrl;
    }

    public void setClientAvatarUrl(String clientAvatarUrl) {
        this.clientAvatarUrl = clientAvatarUrl;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(List<String> skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public BigDecimal getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(BigDecimal budgetMin) {
        this.budgetMin = budgetMin;
    }

    public BigDecimal getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(BigDecimal budgetMax) {
        this.budgetMax = budgetMax;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public ProjectType getProjectType() {
        return projectType;
    }

    public void setProjectType(ProjectType projectType) {
        this.projectType = projectType;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
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

    public List<AttachmentInfo> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentInfo> attachments) {
        this.attachments = attachments;
    }
}
