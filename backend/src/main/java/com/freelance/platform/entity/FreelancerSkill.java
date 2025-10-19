package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "freelancer_skills", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"freelancer_profile_id", "skill_id"}))
public class FreelancerSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_profile_id", nullable = false)
    private FreelancerProfile freelancer;
    
    // Additional column for backward compatibility
    @Column(name = "freelancer_id", nullable = false)
    private UUID freelancerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;
    
    @Column(nullable = false)
    private Integer proficiencyLevel; // 1-5 scale
    
    @Column(length = 500)
    private String description;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors
    public FreelancerSkill() {}
    
    public FreelancerSkill(FreelancerProfile freelancer, Skill skill, Integer proficiencyLevel) {
        this.freelancer = freelancer;
        this.freelancerId = freelancer.getId();
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
    
    public FreelancerProfile getFreelancer() {
        return freelancer;
    }
    
    public void setFreelancer(FreelancerProfile freelancer) {
        this.freelancer = freelancer;
        this.freelancerId = freelancer != null ? freelancer.getId() : null;
    }
    
    public UUID getFreelancerId() {
        return freelancerId;
    }
    
    public void setFreelancerId(UUID freelancerId) {
        this.freelancerId = freelancerId;
    }
    
    public Skill getSkill() {
        return skill;
    }
    
    public void setSkill(Skill skill) {
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