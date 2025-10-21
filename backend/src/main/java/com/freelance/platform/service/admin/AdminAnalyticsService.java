package com.freelance.platform.service.admin;

import com.freelance.platform.dto.response.AdminDashboardResponse;
import com.freelance.platform.dto.response.AnalyticsResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminAnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AdminAnalyticsService.class);
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

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
    private ReportRepository reportRepository;

    @Cacheable(value = "adminDashboard", unless = "#result == null")
    public Map<String, Object> getDashboard() {
        AdminDashboardResponse dashboardResponse = getDashboardData();
        Map<String, Object> result = new HashMap<>();
        
        // Convert AdminDashboardResponse to Map for flexible JSON serialization
        result.put("totalUsers", dashboardResponse.getTotalUsers());
        result.put("totalClients", dashboardResponse.getTotalClients());
        result.put("totalFreelancers", dashboardResponse.getTotalFreelancers());
        result.put("activeUsers", dashboardResponse.getActiveUsers());
        result.put("verifiedUsers", dashboardResponse.getVerifiedUsers());
        
        result.put("totalProjects", dashboardResponse.getTotalProjects());
        result.put("publishedProjects", dashboardResponse.getPublishedProjects());
        result.put("inProgressProjects", dashboardResponse.getInProgressProjects());
        result.put("completedProjects", dashboardResponse.getCompletedProjects());
        result.put("featuredProjects", dashboardResponse.getFeaturedProjects());
        
        result.put("totalProposals", dashboardResponse.getTotalProposals());
        result.put("pendingProposals", dashboardResponse.getPendingProposals());
        result.put("acceptedProposals", dashboardResponse.getAcceptedProposals());
        result.put("rejectedProposals", dashboardResponse.getRejectedProposals());
        
        result.put("totalContracts", dashboardResponse.getTotalContracts());
        result.put("activeContracts", dashboardResponse.getActiveContracts());
        result.put("completedContracts", dashboardResponse.getCompletedContracts());
        result.put("disputedContracts", dashboardResponse.getDisputedContracts());
        
        result.put("totalTransactions", dashboardResponse.getTotalTransactions());
        result.put("completedTransactions", dashboardResponse.getCompletedTransactions());
        result.put("failedTransactions", dashboardResponse.getFailedTransactions());
        
        result.put("totalMessages", dashboardResponse.getTotalMessages());
        result.put("unreadMessages", dashboardResponse.getUnreadMessages());
        result.put("totalNotifications", dashboardResponse.getTotalNotifications());
        
        result.put("totalReports", dashboardResponse.getTotalReports());
        result.put("pendingReports", dashboardResponse.getPendingReports());
        result.put("resolvedReports", dashboardResponse.getResolvedReports());
        
        result.put("totalRevenue", dashboardResponse.getTotalRevenue());
        
        return result;
    }

    public AdminDashboardResponse getDashboardData() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        // User statistics
        long rawTotalUsers = userRepository.count();
        long activeExcludingSoftDeleted = 0L;
        try {
            activeExcludingSoftDeleted = userRepository.countActiveUsersExcludingSoftDeleted();
        } catch (Exception e) {
            logger.warn("Failed to get countActiveUsersExcludingSoftDeleted: {}", e.getMessage());
        }

        // Log counts for troubleshooting (raw count, active excluding soft-deleted, repository-derived counts)
        logger.debug("User counts - raw count: {}, activeExclSoftDeleted(native): {}, countByIsActiveTrue(): {}",
                rawTotalUsers,
                activeExcludingSoftDeleted,
                safeCallCountByIsActiveTrue());

        response.setTotalUsers(rawTotalUsers);
    response.setTotalClients(userRepository.countByRole(Role.CLIENT));
    response.setTotalFreelancers(userRepository.countByRole(Role.FREELANCER));
        response.setActiveUsers(userRepository.countByIsActiveTrue());
        response.setVerifiedUsers(userRepository.countByIsVerifiedTrue());

        // Project statistics
        response.setTotalProjects(projectRepository.count());
        response.setPublishedProjects(projectRepository.countByStatus(ProjectStatus.PUBLISHED));
        response.setInProgressProjects(projectRepository.countByStatus(ProjectStatus.IN_PROGRESS));
        response.setCompletedProjects(projectRepository.countByStatus(ProjectStatus.COMPLETED));
        response.setFeaturedProjects(projectRepository.countFeaturedProjects());

        // Proposal statistics
        response.setTotalProposals(proposalRepository.count());
        response.setPendingProposals(proposalRepository.countByStatus(ProposalStatus.PENDING));
        response.setAcceptedProposals(proposalRepository.countByStatus(ProposalStatus.ACCEPTED));
        response.setRejectedProposals(proposalRepository.countByStatus(ProposalStatus.REJECTED));

        // Contract statistics
        response.setTotalContracts(contractRepository.count());
        response.setActiveContracts(contractRepository.countByStatus(ContractStatus.ACTIVE));
        response.setCompletedContracts(contractRepository.countByStatus(ContractStatus.COMPLETED));
        response.setDisputedContracts(contractRepository.countByStatus(ContractStatus.DISPUTED));

        // Transaction statistics
        response.setTotalTransactions(transactionRepository.count());
        response.setCompletedTransactions(transactionRepository.countByStatus(TransactionStatus.COMPLETED));
        response.setFailedTransactions(transactionRepository.countByStatus(TransactionStatus.FAILED));

        // Communication statistics
        response.setTotalMessages(messageRepository.count());
        response.setUnreadMessages(messageRepository.countUnreadMessagesByUser(null)); // This needs to be fixed
        response.setTotalNotifications(notificationRepository.count());

        // Report statistics
        response.setTotalReports(reportRepository.count());
        response.setPendingReports(reportRepository.countByStatus(ReportStatus.PENDING));
        response.setResolvedReports(reportRepository.countByStatus(ReportStatus.RESOLVED));

        // Revenue statistics
        Double totalRevenue = transactionRepository.getTotalAmountByStatus(TransactionStatus.COMPLETED);
        response.setTotalRevenue(totalRevenue != null ? BigDecimal.valueOf(totalRevenue) : BigDecimal.ZERO);

        return response;
    }

    @Cacheable(value = "userAnalytics", unless = "#result == null")
    public AnalyticsResponse getUserAnalytics() {
        long startTime = System.currentTimeMillis();
        AnalyticsResponse response = new AnalyticsResponse();

        try {
            // Get monthly user counts from DB (UTC, last 12 months)
            List<Object[]> monthlyData = userRepository.findMonthlyUserCountsLast12MonthsUtc();
            
            // Convert to map
            Map<String, Long> dbCounts = new HashMap<>();
            for (Object[] row : monthlyData) {
                String month = (String) row[0];
                Long count = ((Number) row[1]).longValue();
                dbCounts.put(month, count);
            }
            
            // Zero-fill missing months
            Map<String, Long> userGrowth = zeroFillLast12Months(dbCounts);
            
            // Set response data (preserve LinkedHashMap ordering)
            response.setData(new LinkedHashMap<>(userGrowth));
            long nativeCount = 0L;
            try {
                nativeCount = userRepository.countActiveUsersExcludingSoftDeleted();
            } catch (Exception e) {
                logger.warn("countActiveUsersExcludingSoftDeleted() threw:", e);
            }

            long jpaCount = userRepository.count();
            int listSize = 0;
            try {
                listSize = userRepository.findAll().size();
            } catch (Exception e) {
                logger.warn("findAll() threw:", e);
            }

            logger.info("User counts for analytics - nativeCount(deleted_at IS NULL)={}, jpaCount={}, findAll.size()={}", nativeCount, jpaCount, listSize);

            response.setTotal(nativeCount);
            response.setPeriod("last12months");
            
            logger.debug("getUserAnalytics completed in {}ms", System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            logger.error("Error getting user analytics", e);
            response.setData(new HashMap<>());
            response.setTotal(0L);
        }

        return response;
    }

    @Cacheable(value = "projectAnalytics", unless = "#result == null")
    public AnalyticsResponse getProjectAnalytics() {
        long startTime = System.currentTimeMillis();
        AnalyticsResponse response = new AnalyticsResponse();

        try {
            // Get monthly project counts from DB (UTC, last 12 months)
            List<Object[]> monthlyData = projectRepository.findMonthlyProjectCountsLast12MonthsUtc();
            
            // Convert to map
            Map<String, Long> dbCounts = new HashMap<>();
            for (Object[] row : monthlyData) {
                String month = (String) row[0];
                Long count = ((Number) row[1]).longValue();
                dbCounts.put(month, count);
            }
            
            // Zero-fill missing months
            Map<String, Long> projectGrowth = zeroFillLast12Months(dbCounts);
            
            // Set response data (preserve LinkedHashMap ordering)
            response.setData(new LinkedHashMap<>(projectGrowth));
            response.setTotal(projectRepository.count());
            response.setPeriod("last12months");
            
            logger.debug("getProjectAnalytics completed in {}ms", System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            logger.error("Error getting project analytics", e);
            response.setData(new HashMap<>());
            response.setTotal(0L);
        }

        return response;
    }

    @Cacheable(value = "revenueAnalytics", unless = "#result == null")
    public AnalyticsResponse getRevenueAnalytics() {
        long startTime = System.currentTimeMillis();
        AnalyticsResponse response = new AnalyticsResponse();

        try {
            // Get monthly revenue from DB (UTC, last 12 months, COMPLETED only)
            List<Object[]> monthlyData = transactionRepository.findMonthlyRevenueLast12MonthsUtc();
            
            // Convert to map
            Map<String, BigDecimal> dbRevenue = new HashMap<>();
            for (Object[] row : monthlyData) {
                String month = (String) row[0];
                BigDecimal amount = row[1] != null ? new BigDecimal(row[1].toString()) : BigDecimal.ZERO;
                dbRevenue.put(month, amount);
            }
            
            // Zero-fill missing months (with BigDecimal)
            Map<String, BigDecimal> monthlyRevenue = zeroFillLast12MonthsBigDecimal(dbRevenue);
            
            // Set response data (preserve LinkedHashMap ordering)
            response.setData(new LinkedHashMap<>(monthlyRevenue));
            Double totalRevenue = transactionRepository.getTotalAmountByStatus(
                TransactionStatus.COMPLETED);
            response.setTotal(totalRevenue != null ? totalRevenue.longValue() : 0L);
            response.setPeriod("last12months");
            
            logger.debug("getRevenueAnalytics completed in {}ms", System.currentTimeMillis() - startTime);
        } catch (Exception e) {
            logger.error("Error getting revenue analytics", e);
            response.setData(new HashMap<>());
            response.setTotal(0L);
        }

        return response;
    }

    public AnalyticsResponse getGeographicAnalytics() {
        AnalyticsResponse response = new AnalyticsResponse();

        // User distribution by country
        Map<String, Long> userCountries = new HashMap<>();
        userRepository.findAllCountries().forEach(country -> {
            long count = userRepository.countByCountry(country);
            userCountries.put(country, count);
        });
        response.setData(new HashMap<>(userCountries));

        return response;
    }

    @Cacheable(value = "performanceMetrics", unless = "#result == null")
    public Map<String, Object> getPerformanceMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        try {
            // Platform performance metrics
            long totalUsers = userRepository.count();
            long activeUsers = userRepository.countByIsActiveTrue();
            double userActivationRate = totalUsers > 0 ? (double) activeUsers / totalUsers * 100 : 0;
            metrics.put("userActivationRate", userActivationRate);

            long totalProjects = projectRepository.count();
            long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);
            double projectCompletionRate = totalProjects > 0 ? (double) completedProjects / totalProjects * 100 : 0;
            metrics.put("projectCompletionRate", projectCompletionRate);

            long totalProposals = proposalRepository.count();
            long acceptedProposals = proposalRepository.countByStatus(ProposalStatus.ACCEPTED);
            double proposalAcceptanceRate = totalProposals > 0 ? (double) acceptedProposals / totalProposals * 100 : 0;
            metrics.put("proposalAcceptanceRate", proposalAcceptanceRate);

            long totalTransactions = transactionRepository.count();
            long completedTransactions = transactionRepository.countByStatus(TransactionStatus.COMPLETED);
            double transactionSuccessRate = totalTransactions > 0 ? (double) completedTransactions / totalTransactions * 100 : 0;
            metrics.put("transactionSuccessRate", transactionSuccessRate);
        } catch (Exception e) {
            logger.error("Error getting performance metrics", e);
        }

        return metrics;
    }
    /**
     * Zero-fill last 12 months (UTC) to ensure consistent time-series data.
     * Missing months will have count = 0.
     */
    private Map<String, Long> zeroFillLast12Months(Map<String, Long> dbCounts) {
        Map<String, Long> result = new LinkedHashMap<>();
        YearMonth now = YearMonth.now(ZoneOffset.UTC);
        
        for (int i = 11; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);
            String monthKey = month.format(MONTH_FORMATTER);
            result.put(monthKey, dbCounts.getOrDefault(monthKey, 0L));
        }
        
        return result;
    }

    /**
     * Safely call countByIsActiveTrue() and return -1 on exception.
     */
    private long safeCallCountByIsActiveTrue() {
        try {
            return userRepository.countByIsActiveTrue();
        } catch (Exception e) {
            logger.warn("safeCallCountByIsActiveTrue failed: {}", e.getMessage());
            return -1L;
        }
    }
    
    /**
     * Zero-fill last 12 months (UTC) with BigDecimal for revenue data.
     */
    private Map<String, BigDecimal> zeroFillLast12MonthsBigDecimal(Map<String, BigDecimal> dbCounts) {
        Map<String, BigDecimal> result = new LinkedHashMap<>();
        YearMonth now = YearMonth.now(ZoneOffset.UTC);
        
        for (int i = 11; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);
            String monthKey = month.format(MONTH_FORMATTER);
            result.put(monthKey, dbCounts.getOrDefault(monthKey, BigDecimal.ZERO));
        }
        
        return result;
    }
    
    // Additional analytics methods with stub implementations
    public Map<String, Object> getTrendAnalytics() {
        return new HashMap<>();
    }
    
    public Map<String, Object> getCustomReports() {
        return new HashMap<>();
    }
    
    public Map<String, Object> createCustomReport(Map<String, Object> reportData, UUID userId) {
        return new HashMap<>();
    }
    
    public Map<String, Object> exportAnalytics(String format, String dateRange, UUID userId) {
        return new HashMap<>();
    }
    
    public Map<String, Object> getRealTimeMetrics() {
        return new HashMap<>();
    }
    
    public Map<String, Object> getComparisonAnalytics(String period1, String period2) {
        return new HashMap<>();
    }
    
    public Map<String, Object> getPredictiveAnalytics() {
        return new HashMap<>();
    }
}
