package com.freelance.platform.dto.response;

import com.freelance.platform.entity.PaymentRequestStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class PaymentResponse {

    private UUID id;
    private UUID contractId;
    private UUID milestoneId;
    private UUID freelancerId;
    private String freelancerName;
    private UUID clientId;
    private String clientName;
    private BigDecimal amount;
    private String currency;
    private PaymentRequestStatus status;
    private String description;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime paidAt;
    private String rejectionReason;
    private String paymentMethod;
    private String gatewayTransactionId;

    // Constructors
    public PaymentResponse() {}

    public PaymentResponse(UUID id, UUID contractId, UUID milestoneId, UUID freelancerId, 
                          String freelancerName, UUID clientId, String clientName, 
                          BigDecimal amount, String currency, PaymentRequestStatus status,
                          String description, LocalDateTime requestedAt, LocalDateTime approvedAt,
                          LocalDateTime paidAt, String rejectionReason, String paymentMethod,
                          String gatewayTransactionId) {
        this.id = id;
        this.contractId = contractId;
        this.milestoneId = milestoneId;
        this.freelancerId = freelancerId;
        this.freelancerName = freelancerName;
        this.clientId = clientId;
        this.clientName = clientName;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.description = description;
        this.requestedAt = requestedAt;
        this.approvedAt = approvedAt;
        this.paidAt = paidAt;
        this.rejectionReason = rejectionReason;
        this.paymentMethod = paymentMethod;
        this.gatewayTransactionId = gatewayTransactionId;
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

    public UUID getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(UUID milestoneId) {
        this.milestoneId = milestoneId;
    }

    public UUID getFreelancerId() {
        return freelancerId;
    }

    public void setFreelancerId(UUID freelancerId) {
        this.freelancerId = freelancerId;
    }

    public String getFreelancerName() {
        return freelancerName;
    }

    public void setFreelancerName(String freelancerName) {
        this.freelancerName = freelancerName;
    }

    public UUID getClientId() {
        return clientId;
    }

    public void setClientId(UUID clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getGatewayTransactionId() {
        return gatewayTransactionId;
    }

    public void setGatewayTransactionId(String gatewayTransactionId) {
        this.gatewayTransactionId = gatewayTransactionId;
    }
}
