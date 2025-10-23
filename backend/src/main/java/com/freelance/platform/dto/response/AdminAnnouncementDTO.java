package com.freelance.platform.dto.response;

import com.freelance.platform.entity.Announcement;
import com.freelance.platform.entity.AnnouncementPriority;
import com.freelance.platform.entity.TargetAudience;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Admin announcement response with creator details")
public class AdminAnnouncementDTO {

    @Schema(description = "Announcement ID")
    private UUID id;

    @Schema(description = "Announcement title")
    private String title;

    @Schema(description = "Announcement message")
    private String message;

    @Schema(description = "Priority level")
    private AnnouncementPriority priority;

    @Schema(description = "Whether to send email notifications")
    private Boolean sendEmail;

    @Schema(description = "Target audience")
    private TargetAudience targetAudience;

    @Schema(description = "Number of recipients")
    private Integer recipientCount;

    @Schema(description = "Creator admin name")
    private String createdByName;

    @Schema(description = "Creator admin email")
    private String createdByEmail;

    @Schema(description = "Creator admin ID")
    private UUID createdById;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Sent timestamp")
    private LocalDateTime sentAt;

    public AdminAnnouncementDTO() {}

    public static AdminAnnouncementDTO fromEntity(Announcement announcement) {
        AdminAnnouncementDTO dto = new AdminAnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setMessage(announcement.getMessage());
        dto.setPriority(announcement.getPriority());
        dto.setSendEmail(announcement.getSendEmail());
        dto.setTargetAudience(announcement.getTargetAudience());
        dto.setRecipientCount(announcement.getRecipientCount());
        dto.setCreatedAt(announcement.getCreatedAt());
        dto.setSentAt(announcement.getSentAt());

        if (announcement.getCreatedBy() != null) {
            dto.setCreatedById(announcement.getCreatedBy().getId());
            dto.setCreatedByName(announcement.getCreatedBy().getFullName());
            dto.setCreatedByEmail(announcement.getCreatedBy().getEmail());
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AnnouncementPriority getPriority() {
        return priority;
    }

    public void setPriority(AnnouncementPriority priority) {
        this.priority = priority;
    }

    public Boolean getSendEmail() {
        return sendEmail;
    }

    public void setSendEmail(Boolean sendEmail) {
        this.sendEmail = sendEmail;
    }

    public TargetAudience getTargetAudience() {
        return targetAudience;
    }

    public void setTargetAudience(TargetAudience targetAudience) {
        this.targetAudience = targetAudience;
    }

    public Integer getRecipientCount() {
        return recipientCount;
    }

    public void setRecipientCount(Integer recipientCount) {
        this.recipientCount = recipientCount;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    public UUID getCreatedById() {
        return createdById;
    }

    public void setCreatedById(UUID createdById) {
        this.createdById = createdById;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
