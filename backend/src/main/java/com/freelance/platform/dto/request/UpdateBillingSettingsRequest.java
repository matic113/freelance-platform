package com.freelance.platform.dto.request;

import jakarta.validation.constraints.Email;

public class UpdateBillingSettingsRequest {
    
    private String streetAddress;
    private String city;
    private String stateProvince;
    private String zipCode;
    private String country;
    private Boolean autoRenewal;
    
    @Email(message = "Invalid email format")
    private String billingEmail;
    
    private String taxId;
    private String companyName;
    
    // Constructors
    public UpdateBillingSettingsRequest() {}
    
    // Getters and Setters
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
}
