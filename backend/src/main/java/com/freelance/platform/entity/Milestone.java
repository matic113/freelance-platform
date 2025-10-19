package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "milestones")
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private MilestoneStatus status = MilestoneStatus.PENDING;
    
    private LocalDate dueDate;
    private LocalDateTime completedDate;
    private LocalDateTime paidDate;
    
    @Column(nullable = false)
    private Integer orderIndex;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "milestone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PaymentRequest> paymentRequests = new ArrayList<>();
    
    // Constructors
    public Milestone() {}
    
    public Milestone(Contract contract, String title, String description, BigDecimal amount, Integer orderIndex) {
        this.contract = contract;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.orderIndex = orderIndex;
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
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public MilestoneStatus getStatus() {
        return status;
    }
    
    public void setStatus(MilestoneStatus status) {
        this.status = status;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public LocalDateTime getCompletedDate() {
        return completedDate;
    }
    
    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
    }
    
    public LocalDateTime getPaidDate() {
        return paidDate;
    }
    
    public void setPaidDate(LocalDateTime paidDate) {
        this.paidDate = paidDate;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<PaymentRequest> getPaymentRequests() {
        return paymentRequests;
    }
    
    public void setPaymentRequests(List<PaymentRequest> paymentRequests) {
        this.paymentRequests = paymentRequests;
    }
    
    // Helper methods
    public boolean isPending() {
        return status == MilestoneStatus.PENDING;
    }
    
    public boolean isInProgress() {
        return status == MilestoneStatus.IN_PROGRESS;
    }
    
    public boolean isCompleted() {
        return status == MilestoneStatus.COMPLETED;
    }
    
    public boolean isPaid() {
        return status == MilestoneStatus.PAID;
    }
}
