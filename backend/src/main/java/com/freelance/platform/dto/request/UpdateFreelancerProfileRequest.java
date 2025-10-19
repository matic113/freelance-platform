package com.freelance.platform.dto.request;

import com.freelance.platform.entity.AvailabilityStatus;
import com.freelance.platform.entity.ExperienceLevel;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class UpdateFreelancerProfileRequest {
    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;

    @DecimalMin(value = "0.0", message = "Hourly rate must be non-negative")
    private BigDecimal hourlyRate;

    private AvailabilityStatus availability;

    private ExperienceLevel experienceLevel;

    @Size(max = 500, message = "Portfolio URL must not exceed 500 characters")
    private String portfolioUrl;

    @Size(max = 500, message = "LinkedIn URL must not exceed 500 characters")
    private String linkedinUrl;

    @Size(max = 500, message = "GitHub URL must not exceed 500 characters")
    private String githubUrl;

    @Size(max = 500, message = "Website URL must not exceed 500 characters")
    private String websiteUrl;

    private List<String> skills;

    // Constructors
    public UpdateFreelancerProfileRequest() {}

    // Getters and Setters
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

    public AvailabilityStatus getAvailability() {
        return availability;
    }

    public void setAvailability(AvailabilityStatus availability) {
        this.availability = availability;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }

    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
