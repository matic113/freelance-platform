package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "payment_requests")
public class PaymentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id", nullable = false)
    private Milestone milestone;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;
    
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    private PaymentRequestStatus status = PaymentRequestStatus.PENDING;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @CreationTimestamp
    private LocalDateTime requestedAt;
    
    private LocalDateTime approvedAt;
    private LocalDateTime paidAt;
    
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
    
    @OneToMany(mappedBy = "paymentRequest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions = new ArrayList<>();
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(Contract contract, Milestone milestone, User freelancer, User client, BigDecimal amount, String description) {
        this.contract = contract;
        this.milestone = milestone;
        this.freelancer = freelancer;
        this.client = client;
        this.amount = amount;
        this.description = description;
    }
    
    // Getters and Setters
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
    
    public Milestone getMilestone() {
        return milestone;
    }
    
    public void setMilestone(Milestone milestone) {
        this.milestone = milestone;
    }
    
    public User getFreelancer() {
        return freelancer;
    }
    
    public void setFreelancer(User freelancer) {
        this.freelancer = freelancer;
    }
    
    public User getClient() {
        return client;
    }
    
    public void setClient(User client) {
        this.client = client;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public PaymentRequestStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentRequestStatus status) {
        this.status = status;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }
    
    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
    
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
    
    public LocalDateTime getPaidAt() {
        return paidAt;
    }
    
    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    public List<Transaction> getTransactions() {
        return transactions;
    }
    
    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
    
    // Helper methods
    public boolean isPending() {
        return status == PaymentRequestStatus.PENDING;
    }
    
    public boolean isApproved() {
        return status == PaymentRequestStatus.APPROVED;
    }
    
    public boolean isRejected() {
        return status == PaymentRequestStatus.REJECTED;
    }
    
    public boolean isPaid() {
        return status == PaymentRequestStatus.PAID;
    }
}
