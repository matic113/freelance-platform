package com.freelance.platform.dto.response;

import java.math.BigDecimal;

public class AdminDashboardResponse {

    // User statistics
    private long totalUsers;
    private long totalClients;
    private long totalFreelancers;
    private long activeUsers;
    private long verifiedUsers;

    // Project statistics
    private long totalProjects;
    private long publishedProjects;
    private long inProgressProjects;
    private long completedProjects;
    private long featuredProjects;

    // Proposal statistics
    private long totalProposals;
    private long pendingProposals;
    private long acceptedProposals;
    private long rejectedProposals;

    // Contract statistics
    private long totalContracts;
    private long activeContracts;
    private long completedContracts;
    private long disputedContracts;

    // Transaction statistics
    private long totalTransactions;
    private long completedTransactions;
    private long failedTransactions;

    // Communication statistics
    private long totalMessages;
    private long unreadMessages;
    private long totalNotifications;

    // Report statistics
    private long totalReports;
    private long pendingReports;
    private long resolvedReports;

    // Revenue statistics
    private BigDecimal totalRevenue;

    // Constructors
    public AdminDashboardResponse() {}

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(long totalClients) {
        this.totalClients = totalClients;
    }

    public long getTotalFreelancers() {
        return totalFreelancers;
    }

    public void setTotalFreelancers(long totalFreelancers) {
        this.totalFreelancers = totalFreelancers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getVerifiedUsers() {
        return verifiedUsers;
    }

    public void setVerifiedUsers(long verifiedUsers) {
        this.verifiedUsers = verifiedUsers;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getPublishedProjects() {
        return publishedProjects;
    }

    public void setPublishedProjects(long publishedProjects) {
        this.publishedProjects = publishedProjects;
    }

    public long getInProgressProjects() {
        return inProgressProjects;
    }

    public void setInProgressProjects(long inProgressProjects) {
        this.inProgressProjects = inProgressProjects;
    }

    public long getCompletedProjects() {
        return completedProjects;
    }

    public void setCompletedProjects(long completedProjects) {
        this.completedProjects = completedProjects;
    }

    public long getFeaturedProjects() {
        return featuredProjects;
    }

    public void setFeaturedProjects(long featuredProjects) {
        this.featuredProjects = featuredProjects;
    }

    public long getTotalProposals() {
        return totalProposals;
    }

    public void setTotalProposals(long totalProposals) {
        this.totalProposals = totalProposals;
    }

    public long getPendingProposals() {
        return pendingProposals;
    }

    public void setPendingProposals(long pendingProposals) {
        this.pendingProposals = pendingProposals;
    }

    public long getAcceptedProposals() {
        return acceptedProposals;
    }

    public void setAcceptedProposals(long acceptedProposals) {
        this.acceptedProposals = acceptedProposals;
    }

    public long getRejectedProposals() {
        return rejectedProposals;
    }

    public void setRejectedProposals(long rejectedProposals) {
        this.rejectedProposals = rejectedProposals;
    }

    public long getTotalContracts() {
        return totalContracts;
    }

    public void setTotalContracts(long totalContracts) {
        this.totalContracts = totalContracts;
    }

    public long getActiveContracts() {
        return activeContracts;
    }

    public void setActiveContracts(long activeContracts) {
        this.activeContracts = activeContracts;
    }

    public long getCompletedContracts() {
        return completedContracts;
    }

    public void setCompletedContracts(long completedContracts) {
        this.completedContracts = completedContracts;
    }

    public long getDisputedContracts() {
        return disputedContracts;
    }

    public void setDisputedContracts(long disputedContracts) {
        this.disputedContracts = disputedContracts;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getCompletedTransactions() {
        return completedTransactions;
    }

    public void setCompletedTransactions(long completedTransactions) {
        this.completedTransactions = completedTransactions;
    }

    public long getFailedTransactions() {
        return failedTransactions;
    }

    public void setFailedTransactions(long failedTransactions) {
        this.failedTransactions = failedTransactions;
    }

    public long getTotalMessages() {
        return totalMessages;
    }

    public void setTotalMessages(long totalMessages) {
        this.totalMessages = totalMessages;
    }

    public long getUnreadMessages() {
        return unreadMessages;
    }

    public void setUnreadMessages(long unreadMessages) {
        this.unreadMessages = unreadMessages;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public long getTotalReports() {
        return totalReports;
    }

    public void setTotalReports(long totalReports) {
        this.totalReports = totalReports;
    }

    public long getPendingReports() {
        return pendingReports;
    }

    public void setPendingReports(long pendingReports) {
        this.pendingReports = pendingReports;
    }

    public long getResolvedReports() {
        return resolvedReports;
    }

    public void setResolvedReports(long resolvedReports) {
        this.resolvedReports = resolvedReports;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}

