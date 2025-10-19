package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_request_id", nullable = false)
    private PaymentRequest paymentRequest;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;
    
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType = TransactionType.PAYMENT;
    
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    private String paymentMethod;
    private String paymentGateway;
    private String gatewayTransactionId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;
    
    // Constructors
    public Transaction() {}
    
    public Transaction(Contract contract, PaymentRequest paymentRequest, BigDecimal amount, TransactionType transactionType) {
        this.contract = contract;
        this.paymentRequest = paymentRequest;
        this.amount = amount;
        this.transactionType = transactionType;
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
    
    public PaymentRequest getPaymentRequest() {
        return paymentRequest;
    }
    
    public void setPaymentRequest(PaymentRequest paymentRequest) {
        this.paymentRequest = paymentRequest;
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
    
    public TransactionType getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
    
    public TransactionStatus getStatus() {
        return status;
    }
    
    public void setStatus(TransactionStatus status) {
        this.status = status;
    }
    
    public String getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public String getPaymentGateway() {
        return paymentGateway;
    }
    
    public void setPaymentGateway(String paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
    
    public String getGatewayTransactionId() {
        return gatewayTransactionId;
    }
    
    public void setGatewayTransactionId(String gatewayTransactionId) {
        this.gatewayTransactionId = gatewayTransactionId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    // Helper methods
    public boolean isPending() {
        return status == TransactionStatus.PENDING;
    }
    
    public boolean isCompleted() {
        return status == TransactionStatus.COMPLETED;
    }
    
    public boolean isFailed() {
        return status == TransactionStatus.FAILED;
    }
    
    public boolean isCancelled() {
        return status == TransactionStatus.CANCELLED;
    }
    
    public boolean isPayment() {
        return transactionType == TransactionType.PAYMENT;
    }
    
    public boolean isRefund() {
        return transactionType == TransactionType.REFUND;
    }
    
    public boolean isFee() {
        return transactionType == TransactionType.FEE;
    }
}
