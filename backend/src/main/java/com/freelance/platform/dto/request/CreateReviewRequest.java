package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(description = "Request to create a new review")
public class CreateReviewRequest {

    @NotNull(message = "Contract ID is required")
    @Schema(description = "Contract ID", example = "123e4567-e89b-12d3-a456-426614174000")
    private String contractId;

    @NotNull(message = "Rating is required")
    @Schema(description = "Rating from 1 to 5", example = "5", minimum = "1", maximum = "5")
    private Integer rating;

    @NotBlank(message = "Comment is required")
    @Size(min = 10, max = 1000, message = "Comment must be between 10 and 1000 characters")
    @Schema(description = "Review comment", example = "Excellent work! Highly recommended.")
    private String comment;

    @Schema(description = "Additional feedback", example = "Great communication and delivered on time.")
    private String additionalFeedback;

    // Constructors
    public CreateReviewRequest() {}

    public CreateReviewRequest(String contractId, Integer rating, String comment) {
        this.contractId = contractId;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
    public String getContractId() {
        return contractId;
    }

    public void setContractId(String contractId) {
        this.contractId = contractId;
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
}
