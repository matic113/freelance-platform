package com.freelance.platform.dto.response;

import com.freelance.platform.entity.PaymentMethod;

import java.time.LocalDateTime;
import java.util.UUID;

public class PaymentMethodResponse {
    private UUID id;
    private UUID userId;
    private String cardLastFour;
    private String cardBrand;
    private String cardType;
    private Boolean isDefault;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public PaymentMethodResponse() {}
    
    public PaymentMethodResponse(PaymentMethod paymentMethod) {
        this.id = paymentMethod.getId();
        this.userId = paymentMethod.getUser().getId();
        this.cardLastFour = paymentMethod.getCardLastFour();
        this.cardBrand = paymentMethod.getCardBrand();
        this.cardType = paymentMethod.getCardType();
        this.isDefault = paymentMethod.getIsDefault();
        this.isActive = paymentMethod.getIsActive();
        this.createdAt = paymentMethod.getCreatedAt();
        this.updatedAt = paymentMethod.getUpdatedAt();
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }
    
    public String getCardLastFour() {
        return cardLastFour;
    }
    
    public void setCardLastFour(String cardLastFour) {
        this.cardLastFour = cardLastFour;
    }
    
    public String getCardBrand() {
        return cardBrand;
    }
    
    public void setCardBrand(String cardBrand) {
        this.cardBrand = cardBrand;
    }
    
    public String getCardType() {
        return cardType;
    }
    
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
    
    public Boolean getIsDefault() {
        return isDefault;
    }
    
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
