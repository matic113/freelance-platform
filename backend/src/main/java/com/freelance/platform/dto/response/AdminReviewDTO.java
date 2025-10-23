package com.freelance.platform.dto.response;

import com.freelance.platform.entity.Review;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Admin review response with user details")
public class AdminReviewDTO {

    @Schema(description = "Review ID")
    private UUID id;

    @Schema(description = "Rating from 1 to 5")
    private Integer rating;

    @Schema(description = "Review comment")
    private String comment;

    @Schema(description = "Additional feedback")
    private String additionalFeedback;

    @Schema(description = "Review creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Review update timestamp")
    private LocalDateTime updatedAt;

    @Schema(description = "Reviewer full name")
    private String reviewerName;

    @Schema(description = "Reviewer email")
    private String reviewerEmail;

    @Schema(description = "Reviewer ID")
    private UUID reviewerId;

    @Schema(description = "Reviewee full name")
    private String revieweeName;

    @Schema(description = "Reviewee email")
    private String revieweeEmail;

    @Schema(description = "Reviewee ID")
    private UUID revieweeId;

    @Schema(description = "Contract ID")
    private UUID contractId;

    @Schema(description = "Project name")
    private String projectName;

    @Schema(description = "Project category")
    private String projectCategory;

    public AdminReviewDTO() {}

    public static AdminReviewDTO fromEntity(Review review) {
        AdminReviewDTO dto = new AdminReviewDTO();
        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setAdditionalFeedback(review.getAdditionalFeedback());
        dto.setCreatedAt(review.getCreatedAt());
        dto.setUpdatedAt(review.getUpdatedAt());
        dto.setProjectName(review.getProjectName());
        dto.setProjectCategory(review.getProjectCategory());

        if (review.getReviewer() != null) {
            dto.setReviewerId(review.getReviewer().getId());
            dto.setReviewerName(review.getReviewer().getFullName());
            dto.setReviewerEmail(review.getReviewer().getEmail());
        }

        if (review.getReviewee() != null) {
            dto.setRevieweeId(review.getReviewee().getId());
            dto.setRevieweeName(review.getReviewee().getFullName());
            dto.setRevieweeEmail(review.getReviewee().getEmail());
        }

        if (review.getContract() != null) {
            dto.setContractId(review.getContract().getId());
        }

        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAdditionalFeedback() {
        return additionalFeedback;
    }

    public void setAdditionalFeedback(String additionalFeedback) {
        this.additionalFeedback = additionalFeedback;
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

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public String getReviewerEmail() {
        return reviewerEmail;
    }

    public void setReviewerEmail(String reviewerEmail) {
        this.reviewerEmail = reviewerEmail;
    }

    public UUID getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(UUID reviewerId) {
        this.reviewerId = reviewerId;
    }

    public String getRevieweeName() {
        return revieweeName;
    }

    public void setRevieweeName(String revieweeName) {
        this.revieweeName = revieweeName;
    }

    public String getRevieweeEmail() {
        return revieweeEmail;
    }

    public void setRevieweeEmail(String revieweeEmail) {
        this.revieweeEmail = revieweeEmail;
    }

    public UUID getRevieweeId() {
        return revieweeId;
    }

    public void setRevieweeId(UUID revieweeId) {
        this.revieweeId = revieweeId;
    }

    public UUID getContractId() {
        return contractId;
    }

    public void setContractId(UUID contractId) {
        this.contractId = contractId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCategory() {
        return projectCategory;
    }

    public void setProjectCategory(String projectCategory) {
        this.projectCategory = projectCategory;
    }
}
