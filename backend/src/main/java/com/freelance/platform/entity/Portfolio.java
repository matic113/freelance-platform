package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "portfolios")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancer;
    
    @Column(name = "freelancer_id", nullable = false)
    private UUID freelancerId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(length = 2000)
    private String imageUrls; // JSON string of image URLs
    
    @Column(length = 500)
    private String projectUrl;
    
    @Column(length = 500)
    private String githubUrl;
    
    @Column(length = 100)
    private String technologies; // Comma-separated technologies used
    
    @Column
    private LocalDate projectDate;
    
    @Column
    private Boolean isFeatured = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public Portfolio() {}
    
    public Portfolio(FreelancerProfile freelancer, String title, String description) {
        this.freelancer = freelancer;
        this.title = title;
        this.description = description;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public FreelancerProfile getFreelancer() {
        return freelancer;
    }
    
    public void setFreelancer(FreelancerProfile freelancer) {
        this.freelancer = freelancer;
        if (freelancer != null) {
            this.freelancerId = freelancer.getId();
        }
    }
    
    public UUID getFreelancerId() {
        return freelancerId;
    }
    
    public void setFreelancerId(UUID freelancerId) {
        this.freelancerId = freelancerId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(String imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public String getProjectUrl() {
        return projectUrl;
    }
    
    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
    
    public String getGithubUrl() {
        return githubUrl;
    }
    
    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }
    
    public String getTechnologies() {
        return technologies;
    }
    
    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }
    
    public LocalDate getProjectDate() {
        return projectDate;
    }
    
    public void setProjectDate(LocalDate projectDate) {
        this.projectDate = projectDate;
    }
    
    public Boolean getIsFeatured() {
        return isFeatured;
    }
    
    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
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