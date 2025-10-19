package com.freelance.platform.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateSkillRequest {
    
    @NotNull(message = "Proficiency level is required")
    @Min(value = 1, message = "Proficiency level must be at least 1")
    @Max(value = 5, message = "Proficiency level must not exceed 5")
    private Integer proficiencyLevel;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    // Constructors
    public UpdateSkillRequest() {}
    
    public UpdateSkillRequest(Integer proficiencyLevel, String description) {
        this.proficiencyLevel = proficiencyLevel;
        this.description = description;
    }
    
    // Getters and Setters
    public Integer getProficiencyLevel() {
        return proficiencyLevel;
    }
    
    public void setProficiencyLevel(Integer proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}
