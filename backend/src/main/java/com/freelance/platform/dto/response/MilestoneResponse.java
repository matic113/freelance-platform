package com.freelance.platform.dto.response;

import com.freelance.platform.entity.MilestoneStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class MilestoneResponse {

    private UUID id;
    private UUID contractId;
    private String title;
    private String description;
    private BigDecimal amount;
    private MilestoneStatus status;
    private LocalDate dueDate;
    private LocalDateTime completedDate;
    private LocalDateTime paidDate;
    private Integer orderIndex;
    private LocalDateTime createdAt;

    // Constructors
    public MilestoneResponse() {}

    public MilestoneResponse(UUID id, UUID contractId, String title, String description, 
                            BigDecimal amount, MilestoneStatus status, LocalDate dueDate,
                            LocalDateTime completedDate, LocalDateTime paidDate, 
                            Integer orderIndex, LocalDateTime createdAt) {
        this.id = id;
        this.contractId = contractId;
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.status = status;
        this.dueDate = dueDate;
        this.completedDate = completedDate;
        this.paidDate = paidDate;
        this.orderIndex = orderIndex;
        this.createdAt = createdAt;
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
}
