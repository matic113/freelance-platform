package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "review_opportunities", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"contract_id", "reviewer_id", "reviewee_id"})
})
public class ReviewOpportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = true)
    private Review review;
    
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean reviewSubmitted = false;
    
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean invitationEmailSent = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime reviewSubmittedAt;
    
    private LocalDateTime invitationEmailSentAt;
    
    private LocalDateTime reminderEmailSentAt;
    
    public ReviewOpportunity() {}
    
    public ReviewOpportunity(Contract contract, User reviewer, User reviewee) {
        this.contract = contract;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
    }
    
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public Contract getContract() {
        return contract;
    }
    
    public void setContract(Contract contract) {
        this.contract = contract;
    }
    
    public User getReviewer() {
        return reviewer;
    }
    
    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }
    
    public User getReviewee() {
        return reviewee;
    }
    
    public void setReviewee(User reviewee) {
        this.reviewee = reviewee;
    }
    
    public Review getReview() {
        return review;
    }
    
    public void setReview(Review review) {
        this.review = review;
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
    
    public LocalDateTime getInvitationEmailSentAt() {
        return invitationEmailSentAt;
    }
    
    public void setInvitationEmailSentAt(LocalDateTime invitationEmailSentAt) {
        this.invitationEmailSentAt = invitationEmailSentAt;
    }
    
    public LocalDateTime getReminderEmailSentAt() {
        return reminderEmailSentAt;
    }
    
    public void setReminderEmailSentAt(LocalDateTime reminderEmailSentAt) {
        this.reminderEmailSentAt = reminderEmailSentAt;
    }
}
