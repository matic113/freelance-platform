package com.freelance.platform.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "proposals")
public class Proposal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal proposedAmount;
    
    private String currency = "USD";
    private String estimatedDuration;
    
    @Enumerated(EnumType.STRING)
    private ProposalStatus status = ProposalStatus.PENDING;
    
    @CreationTimestamp
    private LocalDateTime submittedAt;
    
    private LocalDateTime respondedAt;
    
    @ElementCollection
    @CollectionTable(name = "proposal_attachments")
    private List<String> attachments = new ArrayList<>();
    
    @OneToMany(mappedBy = "proposal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Contract> contracts = new ArrayList<>();
    
    // Constructors
    public Proposal() {}
    
    public Proposal(Project project, User freelancer, User client, String title, String description, BigDecimal proposedAmount) {
        this.project = project;
        this.freelancer = freelancer;
        this.client = client;
        this.title = title;
        this.description = description;
        this.proposedAmount = proposedAmount;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public Project getProject() {
        return project;
    }
    
    public void setProject(Project project) {
        this.project = project;
    }
    
    public User getFreelancer() {
        return freelancer;
    }
    
    public void setFreelancer(User freelancer) {
        this.freelancer = freelancer;
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
    
    public BigDecimal getProposedAmount() {
        return proposedAmount;
    }
    
    public void setProposedAmount(BigDecimal proposedAmount) {
        this.proposedAmount = proposedAmount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getEstimatedDuration() {
        return estimatedDuration;
    }
    
    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
    
    public ProposalStatus getStatus() {
        return status;
    }
    
    public void setStatus(ProposalStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }
    
    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
    
    public List<String> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
    
    public List<Contract> getContracts() {
        return contracts;
    }
    
    public void setContracts(List<Contract> contracts) {
        this.contracts = contracts;
    }
    
    // Helper methods
    public boolean isPending() {
        return status == ProposalStatus.PENDING;
    }
    
    public boolean isAccepted() {
        return status == ProposalStatus.ACCEPTED;
    }
    
    public boolean isRejected() {
        return status == ProposalStatus.REJECTED;
    }
    
    public boolean isWithdrawn() {
        return status == ProposalStatus.WITHDRAWN;
    }
}
