package com.freelance.platform.dto.request;

import com.freelance.platform.entity.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreateProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 50, max = 5000, message = "Description must be between 50 and 5000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Skills required is required")
    @Size(min = 1, max = 20, message = "Must specify 1-20 skills")
    private List<String> skillsRequired;

    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum budget must be greater than 0")
    private BigDecimal budgetMin;

    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum budget must be greater than 0")
    private BigDecimal budgetMax;

    private String currency = "USD";

    @NotNull(message = "Project type is required")
    private ProjectType projectType;

    @Size(max = 100, message = "Duration description must not exceed 100 characters")
    private String duration;

    private LocalDate deadline;

    private List<ProjectAttachmentRequest> attachments;

    // Constructors
    public CreateProjectRequest() {}

    public CreateProjectRequest(String title, String description, String category, 
                               List<String> skillsRequired, BigDecimal budgetMin, 
                               BigDecimal budgetMax, String currency, ProjectType projectType, 
                               String duration, LocalDate deadline) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.skillsRequired = skillsRequired;
        this.budgetMin = budgetMin;
        this.budgetMax = budgetMax;
        this.currency = currency;
        this.projectType = projectType;
        this.duration = duration;
        this.deadline = deadline;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(List<String> skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public BigDecimal getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(BigDecimal budgetMin) {
        this.budgetMin = budgetMin;
    }

    public BigDecimal getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(BigDecimal budgetMax) {
        this.budgetMax = budgetMax;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public ProjectType getProjectType() {
        return projectType;
    }

    public void setProjectType(ProjectType projectType) {
        this.projectType = projectType;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public List<ProjectAttachmentRequest> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<ProjectAttachmentRequest> attachments) {
        this.attachments = attachments;
    }
}
