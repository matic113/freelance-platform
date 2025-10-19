package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "freelancer_profiles")
public class FreelancerProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal hourlyRate;
    
    @Enumerated(EnumType.STRING)
    private AvailabilityStatus availability = AvailabilityStatus.AVAILABLE;
    
    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel = ExperienceLevel.ENTRY;
    
    private String portfolioUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String websiteUrl;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;
    
    private Integer totalReviews = 0;
    
    @Column(precision = 12, scale = 2)
    private BigDecimal totalEarnings = BigDecimal.ZERO;
    
    private Integer totalProjects = 0;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FreelancerSkill> skills = new ArrayList<>();
    
    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Portfolio> portfolios = new ArrayList<>();
    
    // Constructors
    public FreelancerProfile() {}
    
    public FreelancerProfile(User user) {
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
    
    public BigDecimal getRating() {
        return rating;
    }
    
    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }
    
    public Integer getTotalReviews() {
        return totalReviews;
    }
    
    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }
    
    public BigDecimal getTotalEarnings() {
        return totalEarnings;
    }
    
    public void setTotalEarnings(BigDecimal totalEarnings) {
        this.totalEarnings = totalEarnings;
    }
    
    public Integer getTotalProjects() {
        return totalProjects;
    }
    
    public void setTotalProjects(Integer totalProjects) {
        this.totalProjects = totalProjects;
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
    
    public List<FreelancerSkill> getSkills() {
        return skills;
    }
    
    public void setSkills(List<FreelancerSkill> skills) {
        this.skills = skills;
    }
    
    public List<Portfolio> getPortfolios() {
        return portfolios;
    }
    
    public void setPortfolios(List<Portfolio> portfolios) {
        this.portfolios = portfolios;
    }
    
    // Helper methods
    public boolean isAvailable() {
        return availability == AvailabilityStatus.AVAILABLE;
    }
    
    public void incrementTotalProjects() {
        this.totalProjects++;
    }
    
    public void addToTotalEarnings(BigDecimal amount) {
        this.totalEarnings = this.totalEarnings.add(amount);
    }
}
