package com.freelance.platform.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public class FreelancerSkillResponse {
    
    private UUID id;
    private SkillResponse skill;
    private Integer proficiencyLevel;
    private String description;
    private LocalDateTime createdAt;
    
    // Constructors
    public FreelancerSkillResponse() {}
    
    public FreelancerSkillResponse(UUID id, SkillResponse skill, Integer proficiencyLevel) {
        this.id = id;
        this.skill = skill;
        this.proficiencyLevel = proficiencyLevel;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public SkillResponse getSkill() {
        return skill;
    }
    
    public void setSkill(SkillResponse skill) {
        this.skill = skill;
    }
    
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
