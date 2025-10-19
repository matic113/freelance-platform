package com.freelance.platform.dto.response;

import com.freelance.platform.entity.BillingSettings;

import java.time.LocalDateTime;
import java.util.UUID;

public class BillingSettingsResponse {
    private UUID id;
    private UUID userId;
    private String streetAddress;
    private String city;
    private String stateProvince;
    private String zipCode;
    private String country;
    private Boolean autoRenewal;
    private String billingEmail;
    private String taxId;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public BillingSettingsResponse() {}
    
    public BillingSettingsResponse(BillingSettings settings) {
        this.id = settings.getId();
        this.userId = settings.getUser().getId();
        this.streetAddress = settings.getStreetAddress();
        this.city = settings.getCity();
        this.stateProvince = settings.getStateProvince();
        this.zipCode = settings.getZipCode();
        this.country = settings.getCountry();
        this.autoRenewal = settings.getAutoRenewal();
        this.billingEmail = settings.getBillingEmail();
        this.taxId = settings.getTaxId();
        this.companyName = settings.getCompanyName();
        this.createdAt = settings.getCreatedAt();
        this.updatedAt = settings.getUpdatedAt();
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
    
    public String getStreetAddress() {
        return streetAddress;
    }
    
    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getStateProvince() {
        return stateProvince;
    }
    
    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public Boolean getAutoRenewal() {
        return autoRenewal;
    }
    
    public void setAutoRenewal(Boolean autoRenewal) {
        this.autoRenewal = autoRenewal;
    }
    
    public String getBillingEmail() {
        return billingEmail;
    }
    
    public void setBillingEmail(String billingEmail) {
        this.billingEmail = billingEmail;
    }
    
    public String getTaxId() {
        return taxId;
    }
    
    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
