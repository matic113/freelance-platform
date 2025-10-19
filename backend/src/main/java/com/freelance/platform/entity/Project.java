package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    private String category;
    
    @ElementCollection
    @CollectionTable(name = "project_skills_required")
    private List<String> skillsRequired = new ArrayList<>();
    
    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMin;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal budgetMax;
    
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType projectType;
    
    private String duration;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.DRAFT;
    
    private Boolean isFeatured = false;
    private LocalDate deadline;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectAttachment> attachments = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Proposal> proposals = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Contract> contracts = new ArrayList<>();
    
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Message> messages = new ArrayList<>();
    
    // Constructors
    public Project() {}
    
    public Project(User client, String title, String description, ProjectType projectType) {
        this.client = client;
        this.title = title;
        this.description = description;
        this.projectType = projectType;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public User getClient() {
        return client;
    }
    
    public void setClient(User client) {
        this.client = client;
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
    
    public ProjectStatus getStatus() {
        return status;
    }
    
    public void setStatus(ProjectStatus status) {
        this.status = status;
    }
    
    public Boolean getIsFeatured() {
        return isFeatured;
    }
    
    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
    
    public LocalDate getDeadline() {
        return deadline;
    }
    
    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
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
    
    public List<ProjectAttachment> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<ProjectAttachment> attachments) {
        this.attachments = attachments;
    }
    
    public List<Proposal> getProposals() {
        return proposals;
    }
    
    public void setProposals(List<Proposal> proposals) {
        this.proposals = proposals;
    }
    
    public List<Contract> getContracts() {
        return contracts;
    }
    
    public void setContracts(List<Contract> contracts) {
        this.contracts = contracts;
    }
    
    public List<Message> getMessages() {
        return messages;
    }
    
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
    
    // Helper methods
    public boolean isPublished() {
        return status == ProjectStatus.PUBLISHED;
    }
    
    public boolean isInProgress() {
        return status == ProjectStatus.IN_PROGRESS;
    }
    
    public boolean isCompleted() {
        return status == ProjectStatus.COMPLETED;
    }
    
    public boolean isFixedPrice() {
        return projectType == ProjectType.FIXED;
    }
    
    public boolean isHourly() {
        return projectType == ProjectType.HOURLY;
    }
}
