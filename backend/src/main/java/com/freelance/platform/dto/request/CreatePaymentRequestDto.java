package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.UUID;

public class CreatePaymentRequestDto {

    @NotNull(message = "Contract ID is required")
    private UUID contractId;

    @NotNull(message = "Milestone ID is required")
    private UUID milestoneId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String currency = "USD";

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // Constructors
    public CreatePaymentRequestDto() {}

    public CreatePaymentRequestDto(UUID contractId, UUID milestoneId, BigDecimal amount, 
                                  String currency, String description) {
        this.contractId = contractId;
        this.milestoneId = milestoneId;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
    }

    // Getters and Setters
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
