package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CompleteClientProfileRequest {
    
    @NotBlank(message = "Country is required")
    private String country;
    
    @NotBlank(message = "Timezone is required")
    private String timezone;
    
    @NotBlank(message = "Phone is required")
    private String phone;
    
    @NotBlank(message = "Profile picture is required")
    private String avatarUrl;
    
    private String city;
    private String bio;
    
    public CompleteClientProfileRequest() {}
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getTimezone() {
        return timezone;
    }
    
    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
}
