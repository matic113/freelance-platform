package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payment_methods")
public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Payment Method Details (Encrypted)
    @Column(name = "card_number_encrypted", columnDefinition = "TEXT")
    private String cardNumberEncrypted;
    
    @Column(name = "card_holder_name_encrypted", columnDefinition = "TEXT")
    private String cardHolderNameEncrypted;
    
    @Column(name = "expiry_month_encrypted", columnDefinition = "TEXT")
    private String expiryMonthEncrypted;
    
    @Column(name = "expiry_year_encrypted", columnDefinition = "TEXT")
    private String expiryYearEncrypted;
    
    @Column(name = "cvv_encrypted", columnDefinition = "TEXT")
    private String cvvEncrypted;
    
    // Non-sensitive display information
    @Column(name = "card_last_four")
    private String cardLastFour;
    
    @Column(name = "card_brand")
    private String cardBrand; // VISA, MASTERCARD, AMEX, etc.
    
    @Column(name = "card_type")
    private String cardType; // CREDIT, DEBIT
    
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public PaymentMethod() {}
    
    public PaymentMethod(User user) {
        this.user = user;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getCardNumberEncrypted() {
        return cardNumberEncrypted;
    }
    
    public void setCardNumberEncrypted(String cardNumberEncrypted) {
        this.cardNumberEncrypted = cardNumberEncrypted;
    }
    
    public String getCardHolderNameEncrypted() {
        return cardHolderNameEncrypted;
    }
    
    public void setCardHolderNameEncrypted(String cardHolderNameEncrypted) {
        this.cardHolderNameEncrypted = cardHolderNameEncrypted;
    }
    
    public String getExpiryMonthEncrypted() {
        return expiryMonthEncrypted;
    }
    
    public void setExpiryMonthEncrypted(String expiryMonthEncrypted) {
        this.expiryMonthEncrypted = expiryMonthEncrypted;
    }
    
    public String getExpiryYearEncrypted() {
        return expiryYearEncrypted;
    }
    
    public void setExpiryYearEncrypted(String expiryYearEncrypted) {
        this.expiryYearEncrypted = expiryYearEncrypted;
    }
    
    public String getCvvEncrypted() {
        return cvvEncrypted;
    }
    
    public void setCvvEncrypted(String cvvEncrypted) {
        this.cvvEncrypted = cvvEncrypted;
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
