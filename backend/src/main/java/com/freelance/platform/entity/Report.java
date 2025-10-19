package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_project_id")
    private Project reportedProject;
    
    @Column(nullable = false)
    private String reportType;
    
    @Column(nullable = false)
    private String category;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime resolvedAt;
    
    @Column(columnDefinition = "TEXT")
    private String adminNotes;
    
    // Constructors
    public Report() {}
    
    public Report(User reporter, String reportType, String category, String description) {
        this.reporter = reporter;
        this.reportType = reportType;
        this.category = category;
        this.description = description;
    }
    
    public Report(User reporter, User reportedUser, String reportType, String category, String description) {
        this.reporter = reporter;
        this.reportedUser = reportedUser;
        this.reportType = reportType;
        this.category = category;
        this.description = description;
    }
    
    public Report(User reporter, Project reportedProject, String reportType, String category, String description) {
        this.reporter = reporter;
        this.reportedProject = reportedProject;
        this.reportType = reportType;
        this.category = category;
        this.description = description;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public User getReporter() {
        return reporter;
    }
    
    public void setReporter(User reporter) {
        this.reporter = reporter;
    }
    
    public User getReportedUser() {
        return reportedUser;
    }
    
    public void setReportedUser(User reportedUser) {
        this.reportedUser = reportedUser;
    }
    
    public Project getReportedProject() {
        return reportedProject;
    }
    
    public void setReportedProject(Project reportedProject) {
        this.reportedProject = reportedProject;
    }
    
    public String getReportType() {
        return reportType;
    }
    
    public void setReportType(String reportType) {
        this.reportType = reportType;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public ReportStatus getStatus() {
        return status;
    }
    
    public void setStatus(ReportStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }
    
    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
    
    public String getAdminNotes() {
        return adminNotes;
    }
    
    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
    
    // Helper methods
    public boolean isPending() {
        return status == ReportStatus.PENDING;
    }
    
    public boolean isUnderReview() {
        return status == ReportStatus.UNDER_REVIEW;
    }
    
    public boolean isResolved() {
        return status == ReportStatus.RESOLVED;
    }
    
    public boolean isDismissed() {
        return status == ReportStatus.DISMISSED;
    }
}
