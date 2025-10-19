package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public class AddPortfolioRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Size(max = 3, message = "Maximum 3 images allowed")
    private List<String> imageUrls;
    
    @Size(max = 500, message = "Project URL must not exceed 500 characters")
    private String projectUrl;
    
    @Size(max = 500, message = "GitHub URL must not exceed 500 characters")
    private String githubUrl;
    
    @Size(max = 100, message = "Technologies must not exceed 100 characters")
    private String technologies;
    
    private LocalDate projectDate;
    
    private Boolean isFeatured = false;
    
    // Constructors
    public AddPortfolioRequest() {}
    
    public AddPortfolioRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }
    
    // Getters and Setters
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
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
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
}
