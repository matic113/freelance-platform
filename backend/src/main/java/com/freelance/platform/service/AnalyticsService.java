package com.freelance.platform.service;

import com.freelance.platform.dto.response.AnalyticsResponse;
import com.freelance.platform.entity.ContractStatus;
import com.freelance.platform.entity.ProposalStatus;
import com.freelance.platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public AnalyticsResponse getUserDashboardAnalytics(UUID userId) {
        AnalyticsResponse response = new AnalyticsResponse();
        
        // Get user type
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return response;
        }
        
        if (user.isClient()) {
            // Client analytics
            response.setActiveProjects(Math.toIntExact(projectRepository.countByClientIdAndStatus(userId, "IN_PROGRESS")));
            response.setHiredFreelancers(Math.toIntExact(contractRepository.countByClientId(userId)));
            response.setTotalSpending(BigDecimal.valueOf(transactionRepository.sumAmountByClientId(userId)));
            response.setSatisfactionRate(calculateClientSatisfactionRate(userId));
        } else if (user.isFreelancer()) {
            // Freelancer analytics
            response.setActiveProjects(Math.toIntExact(contractRepository.countByFreelancerIdAndStatus(userId, ContractStatus.ACTIVE)));
            response.setHappyClients(Math.toIntExact(contractRepository.countDistinctClientsByFreelancerId(userId)));
            response.setTotalEarnings(BigDecimal.valueOf(transactionRepository.sumAmountByFreelancerId(userId)));
            response.setCompletionRate(calculateFreelancerCompletionRate(userId));
        }
        
        return response;
    }

    public Map<String, Object> getProjectStats(UUID userId) {
        Map<String, Object> stats = new HashMap<>();
        
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return stats;
        }
        
        if (user.isClient()) {
            stats.put("totalProjects", projectRepository.countByClientId(userId));
            stats.put("publishedProjects", projectRepository.countByClientIdAndStatus(userId, "PUBLISHED"));
            stats.put("completedProjects", projectRepository.countByClientIdAndStatus(userId, "COMPLETED"));
            stats.put("averageProjectValue", projectRepository.getAverageProjectValueByClientId(userId));
        } else if (user.isFreelancer()) {
            stats.put("totalProposals", proposalRepository.countByFreelancerId(userId));
            stats.put("acceptedProposals", proposalRepository.countByFreelancerIdAndStatus(userId, ProposalStatus.ACCEPTED));
            stats.put("completedContracts", contractRepository.countByFreelancerIdAndStatus(userId, ContractStatus.COMPLETED));
            stats.put("averageContractValue", contractRepository.getAverageContractValueByFreelancerId(userId));
        }
        
        return stats;
    }

    public Map<String, Object> getFreelancerStats(UUID userId) {
        Map<String, Object> stats = new HashMap<>();
        
        var user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.isFreelancer()) {
            return stats;
        }
        
        stats.put("totalContracts", contractRepository.countByFreelancerId(userId));
        stats.put("activeContracts", contractRepository.countByFreelancerIdAndStatus(userId, ContractStatus.ACTIVE));
        stats.put("completedContracts", contractRepository.countByFreelancerIdAndStatus(userId, ContractStatus.COMPLETED));
        stats.put("averageRating", reviewRepository.getAverageRatingByRevieweeId(userId));
        stats.put("totalReviews", reviewRepository.countByRevieweeId(userId));
        
        return stats;
    }

    public Map<String, Object> getEarningsAnalytics(UUID userId) {
        Map<String, Object> analytics = new HashMap<>();
        
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return analytics;
        }
        
        if (user.isFreelancer()) {
            analytics.put("totalEarnings", transactionRepository.sumAmountByFreelancerId(userId));
            analytics.put("monthlyEarnings", transactionRepository.sumAmountByFreelancerIdAndMonth(userId, LocalDate.now().getMonthValue()));
            analytics.put("yearlyEarnings", transactionRepository.sumAmountByFreelancerIdAndYear(userId, LocalDate.now().getYear()));
            analytics.put("averageEarningPerProject", transactionRepository.getAverageEarningPerProjectByFreelancerId(userId));
        } else if (user.isClient()) {
            analytics.put("totalSpending", transactionRepository.sumAmountByClientId(userId));
            analytics.put("monthlySpending", transactionRepository.sumAmountByClientIdAndMonth(userId, LocalDate.now().getMonthValue()));
            analytics.put("yearlySpending", transactionRepository.sumAmountByClientIdAndYear(userId, LocalDate.now().getYear()));
            analytics.put("averageSpendingPerProject", transactionRepository.getAverageSpendingPerProjectByClientId(userId));
        }
        
        return analytics;
    }

    public Map<String, Object> getPerformanceAnalytics(UUID userId) {
        Map<String, Object> analytics = new HashMap<>();
        
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return analytics;
        }
        
        if (user.isFreelancer()) {
            analytics.put("completionRate", calculateFreelancerCompletionRate(userId));
            analytics.put("averageRating", reviewRepository.getAverageRatingByRevieweeId(userId));
            analytics.put("totalReviews", reviewRepository.countByRevieweeId(userId));
            analytics.put("responseTime", calculateAverageResponseTime(userId));
        } else if (user.isClient()) {
            analytics.put("projectSuccessRate", calculateClientProjectSuccessRate(userId));
            analytics.put("averageProjectCompletionTime", calculateAverageProjectCompletionTime(userId));
            analytics.put("freelancerRetentionRate", calculateFreelancerRetentionRate(userId));
        }
        
        return analytics;
    }

    public Map<String, Object> getTrendAnalytics(UUID userId) {
        Map<String, Object> trends = new HashMap<>();
        
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return trends;
        }
        
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        
        if (user.isFreelancer()) {
            trends.put("earningsTrend", transactionRepository.getEarningsTrendByFreelancerId(userId, sixMonthsAgo));
            trends.put("projectTrend", contractRepository.getProjectTrendByFreelancerId(userId, sixMonthsAgo));
            trends.put("ratingTrend", reviewRepository.getRatingTrendByRevieweeId(userId, sixMonthsAgo));
        } else if (user.isClient()) {
            trends.put("spendingTrend", transactionRepository.getSpendingTrendByClientId(userId, sixMonthsAgo));
            trends.put("projectTrend", projectRepository.getProjectTrendByClientId(userId, sixMonthsAgo));
            trends.put("freelancerTrend", contractRepository.getFreelancerTrendByClientId(userId, sixMonthsAgo));
        }
        
        return trends;
    }

    public Map<String, Object> getRevenueAnalytics(UUID userId) {
        Map<String, Object> analytics = new HashMap<>();
        
        var user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return analytics;
        }
        
        if (user.isFreelancer()) {
            analytics.put("totalRevenue", transactionRepository.sumAmountByFreelancerId(userId));
            analytics.put("monthlyRevenue", transactionRepository.sumAmountByFreelancerIdAndMonth(userId, LocalDate.now().getMonthValue()));
            analytics.put("revenueGrowth", calculateRevenueGrowth(userId));
            analytics.put("topEarningMonths", transactionRepository.getTopEarningMonthsByFreelancerId(userId, 12));
        }
        
        return analytics;
    }

    // Helper methods
    private BigDecimal calculateClientSatisfactionRate(UUID clientId) {
        // Implementation to calculate client satisfaction rate
        return BigDecimal.valueOf(95.0); // Placeholder
    }

    private BigDecimal calculateFreelancerCompletionRate(UUID freelancerId) {
        // Implementation to calculate freelancer completion rate
        return BigDecimal.valueOf(98.0); // Placeholder
    }

    private BigDecimal calculateClientProjectSuccessRate(UUID clientId) {
        // Implementation to calculate client project success rate
        return BigDecimal.valueOf(92.0); // Placeholder
    }

    private BigDecimal calculateAverageProjectCompletionTime(UUID clientId) {
        // Implementation to calculate average project completion time
        return BigDecimal.valueOf(15.5); // Placeholder
    }

    private BigDecimal calculateFreelancerRetentionRate(UUID clientId) {
        // Implementation to calculate freelancer retention rate
        return BigDecimal.valueOf(85.0); // Placeholder
    }

    private BigDecimal calculateAverageResponseTime(UUID freelancerId) {
        // Implementation to calculate average response time
        return BigDecimal.valueOf(2.5); // Placeholder
    }

    private BigDecimal calculateRevenueGrowth(UUID freelancerId) {
        // Implementation to calculate revenue growth
        return BigDecimal.valueOf(12.5); // Placeholder
    }
}
