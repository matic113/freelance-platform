package com.freelance.platform.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Review response")
public class ReviewResponse {

    @Schema(description = "Review ID", example = "123e4567-e89b-12d3-a456-426614174000")
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

    @Schema(description = "Rating from 1 to 5", example = "5")
    private Integer rating;

    @Schema(description = "Review comment", example = "Excellent work! Highly recommended.")
    private String comment;

    @Schema(description = "Additional feedback", example = "Great communication and delivered on time.")
    private String additionalFeedback;

    @Schema(description = "Review creation date")
    private LocalDateTime createdAt;

    @Schema(description = "Review update date")
    private LocalDateTime updatedAt;

    // Constructors
    public ReviewResponse() {}

    public ReviewResponse(UUID id, UUID contractId, UUID reviewerId, String reviewerName, 
                         UUID revieweeId, String revieweeName, Integer rating, String comment) {
        this.id = id;
        this.contractId = contractId;
        this.reviewerId = reviewerId;
        this.reviewerName = reviewerName;
        this.revieweeId = revieweeId;
        this.revieweeName = revieweeName;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
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
}
