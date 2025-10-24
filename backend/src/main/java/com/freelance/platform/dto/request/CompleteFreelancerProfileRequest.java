package com.freelance.platform.dto.request;

import com.freelance.platform.entity.ExperienceLevel;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class CompleteFreelancerProfileRequest {
    
    @NotBlank(message = "Bio is required")
    @Size(min = 50, message = "Bio must be at least 50 characters")
    private String bio;
    
    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.01", message = "Hourly rate must be greater than 0")
    private BigDecimal hourlyRate;
    
    @NotNull(message = "Experience level is required")
    private ExperienceLevel experienceLevel;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    @NotBlank(message = "Timezone is required")
    private String timezone;
    
    private String avatarUrl;
    
    @NotNull(message = "Skills are required")
    @Size(min = 3, message = "At least 3 skills are required")
    @Valid
    private List<SkillRequest> skills;
    
    private String phone;
    private String city;
    
    public CompleteFreelancerProfileRequest() {}
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }
    
    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }
    
    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }
    
    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }
    
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
    
    public String getAvatarUrl() {
        return avatarUrl;
    }
    
    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
    
    public List<SkillRequest> getSkills() {
        return skills;
    }
    
    public void setSkills(List<SkillRequest> skills) {
        this.skills = skills;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
}
