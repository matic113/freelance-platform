package com.freelance.platform.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class FreelancerDashboardResponse {

    private DashboardStats stats;
    private List<ContractResponse> activeContracts;
    private List<ContractResponse> completedContracts;
    private List<ProposalResponse> recentProposals;

    public FreelancerDashboardResponse() {
    }

    public FreelancerDashboardResponse(DashboardStats stats, List<ContractResponse> activeContracts,
                                      List<ContractResponse> completedContracts, List<ProposalResponse> recentProposals) {
        this.stats = stats;
        this.activeContracts = activeContracts;
        this.completedContracts = completedContracts;
        this.recentProposals = recentProposals;
    }

    public DashboardStats getStats() {
        return stats;
    }

    public void setStats(DashboardStats stats) {
        this.stats = stats;
    }

    public List<ContractResponse> getActiveContracts() {
        return activeContracts;
    }

    public void setActiveContracts(List<ContractResponse> activeContracts) {
        this.activeContracts = activeContracts;
    }

    public List<ContractResponse> getCompletedContracts() {
        return completedContracts;
    }

    public void setCompletedContracts(List<ContractResponse> completedContracts) {
        this.completedContracts = completedContracts;
    }

    public List<ProposalResponse> getRecentProposals() {
        return recentProposals;
    }

    public void setRecentProposals(List<ProposalResponse> recentProposals) {
        this.recentProposals = recentProposals;
    }

    public static class DashboardStats {
        private BigDecimal totalEarnings;
        private Integer activeProjects;
        private Integer proposalSuccessRate;
        private BigDecimal rating;
        private BigDecimal completionRate;
        private Integer totalProposals;
        private Integer acceptedProposals;
        private Integer totalContracts;

        public DashboardStats() {
        }

        public DashboardStats(BigDecimal totalEarnings, Integer activeProjects, Integer proposalSuccessRate,
                            BigDecimal rating, BigDecimal completionRate, Integer totalProposals,
                            Integer acceptedProposals, Integer totalContracts) {
            this.totalEarnings = totalEarnings;
            this.activeProjects = activeProjects;
            this.proposalSuccessRate = proposalSuccessRate;
            this.rating = rating;
            this.completionRate = completionRate;
            this.totalProposals = totalProposals;
            this.acceptedProposals = acceptedProposals;
            this.totalContracts = totalContracts;
        }

        public BigDecimal getTotalEarnings() {
            return totalEarnings;
        }

        public void setTotalEarnings(BigDecimal totalEarnings) {
            this.totalEarnings = totalEarnings;
        }

        public Integer getActiveProjects() {
            return activeProjects;
        }

        public void setActiveProjects(Integer activeProjects) {
            this.activeProjects = activeProjects;
        }

        public Integer getProposalSuccessRate() {
            return proposalSuccessRate;
        }

        public void setProposalSuccessRate(Integer proposalSuccessRate) {
            this.proposalSuccessRate = proposalSuccessRate;
        }

        public BigDecimal getRating() {
            return rating;
        }

        public void setRating(BigDecimal rating) {
            this.rating = rating;
        }

        public BigDecimal getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(BigDecimal completionRate) {
            this.completionRate = completionRate;
        }

        public Integer getTotalProposals() {
            return totalProposals;
        }

        public void setTotalProposals(Integer totalProposals) {
            this.totalProposals = totalProposals;
        }

        public Integer getAcceptedProposals() {
            return acceptedProposals;
        }

        public void setAcceptedProposals(Integer acceptedProposals) {
            this.acceptedProposals = acceptedProposals;
        }

        public Integer getTotalContracts() {
            return totalContracts;
        }

        public void setTotalContracts(Integer totalContracts) {
            this.totalContracts = totalContracts;
        }
    }
}
