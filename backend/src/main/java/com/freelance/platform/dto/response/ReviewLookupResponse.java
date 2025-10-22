package com.freelance.platform.dto.response;

import java.util.UUID;

public class ReviewLookupResponse {
    
    private UUID projectId;
    private boolean shouldOpenReviewModal;
    private boolean hasUserReviewed;
    private String reason;

    public ReviewLookupResponse(UUID projectId, boolean shouldOpenReviewModal, boolean hasUserReviewed, String reason) {
        this.projectId = projectId;
        this.shouldOpenReviewModal = shouldOpenReviewModal;
        this.hasUserReviewed = hasUserReviewed;
        this.reason = reason;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public boolean isShouldOpenReviewModal() {
        return shouldOpenReviewModal;
    }

    public void setShouldOpenReviewModal(boolean shouldOpenReviewModal) {
        this.shouldOpenReviewModal = shouldOpenReviewModal;
    }

    public boolean isHasUserReviewed() {
        return hasUserReviewed;
    }

    public void setHasUserReviewed(boolean hasUserReviewed) {
        this.hasUserReviewed = hasUserReviewed;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
