package com.freelance.platform.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Review opportunity response")
public class ReviewOpportunityResponse {

    @Schema(description = "Review opportunity ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID id;

    @Schema(description = "Contract ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID contractId;

    @Schema(description = "Reviewer ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID reviewerId;

    @Schema(description = "Reviewer name", example = "John Doe")
    private String reviewerName;

    @Schema(description = "Reviewee ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private UUID revieweeId;

    @Schema(description = "Reviewee name", example = "Jane Smith")
    private String revieweeName;

    @Schema(description = "Whether the review has been submitted", example = "false")
    private Boolean reviewSubmitted;

    @Schema(description = "Whether the invitation email has been sent", example = "true")
    private Boolean invitationEmailSent;

    @Schema(description = "Project title")
    private String projectTitle;

    @Schema(description = "Review creation date")
    private LocalDateTime createdAt;

    @Schema(description = "Review submission date")
    private LocalDateTime reviewSubmittedAt;

    public ReviewOpportunityResponse() {}

    public ReviewOpportunityResponse(UUID id, UUID contractId, UUID reviewerId, String reviewerName,
                                   UUID revieweeId, String revieweeName, Boolean reviewSubmitted,
                                   Boolean invitationEmailSent, String projectTitle) {
        this.id = id;
        this.contractId = contractId;
        this.reviewerId = reviewerId;
        this.reviewerName = reviewerName;
        this.revieweeId = revieweeId;
        this.revieweeName = revieweeName;
        this.reviewSubmitted = reviewSubmitted;
        this.invitationEmailSent = invitationEmailSent;
        this.projectTitle = projectTitle;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getContractId() {
        return contractId;
    }

    public void setContractId(UUID contractId) {
        this.contractId = contractId;
    }

    public UUID getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(UUID reviewerId) {
        this.reviewerId = reviewerId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public UUID getRevieweeId() {
        return revieweeId;
    }

    public void setRevieweeId(UUID revieweeId) {
        this.revieweeId = revieweeId;
    }

    public String getRevieweeName() {
        return revieweeName;
    }

    public void setRevieweeName(String revieweeName) {
        this.revieweeName = revieweeName;
    }

    public Boolean getReviewSubmitted() {
        return reviewSubmitted;
    }

    public void setReviewSubmitted(Boolean reviewSubmitted) {
        this.reviewSubmitted = reviewSubmitted;
    }

    public Boolean getInvitationEmailSent() {
        return invitationEmailSent;
    }

    public void setInvitationEmailSent(Boolean invitationEmailSent) {
        this.invitationEmailSent = invitationEmailSent;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReviewSubmittedAt() {
        return reviewSubmittedAt;
    }

    public void setReviewSubmittedAt(LocalDateTime reviewSubmittedAt) {
        this.reviewSubmittedAt = reviewSubmittedAt;
    }
}
