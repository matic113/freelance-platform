package com.freelance.platform.service;

import com.freelance.platform.entity.AuditTrail;
import com.freelance.platform.repository.AuditTrailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AuditTrailService {

    @Autowired
    private AuditTrailRepository auditTrailRepository;

    public AuditTrail createAuditTrail(String userId, String action, String entityType, String entityId) {
        AuditTrail auditTrail = new AuditTrail();
        auditTrail.setUserId(userId);
        auditTrail.setAction(action);
        auditTrail.setEntityType(entityType);
        auditTrail.setEntityId(entityId);
        auditTrail.setCreatedAt(LocalDateTime.now());
        
        return auditTrailRepository.save(auditTrail);
    }

    public AuditTrail createAuditTrail(String userId, String action, String entityType, String entityId, 
                                     String oldValues, String newValues) {
        AuditTrail auditTrail = new AuditTrail();
        auditTrail.setUserId(userId);
        auditTrail.setAction(action);
        auditTrail.setEntityType(entityType);
        auditTrail.setEntityId(entityId);
        auditTrail.setOldValues(oldValues);
        auditTrail.setNewValues(newValues);
        auditTrail.setCreatedAt(LocalDateTime.now());
        
        return auditTrailRepository.save(auditTrail);
    }

    public AuditTrail createAuditTrail(String userId, String action, String entityType, String entityId, 
                                     String oldValues, String newValues, String ipAddress, String userAgent) {
        AuditTrail auditTrail = new AuditTrail();
        auditTrail.setUserId(userId);
        auditTrail.setAction(action);
        auditTrail.setEntityType(entityType);
        auditTrail.setEntityId(entityId);
        auditTrail.setOldValues(oldValues);
        auditTrail.setNewValues(newValues);
        auditTrail.setIpAddress(ipAddress);
        auditTrail.setUserAgent(userAgent);
        auditTrail.setCreatedAt(LocalDateTime.now());
        
        return auditTrailRepository.save(auditTrail);
    }

    public Page<AuditTrail> getAllAuditTrails(Pageable pageable) {
        return auditTrailRepository.findAll(pageable);
    }

    public AuditTrail getAuditTrailById(UUID id) {
        return auditTrailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audit trail not found"));
    }

    public List<AuditTrail> getAuditTrailsByUser(String userId) {
        return auditTrailRepository.findByUserId(userId);
    }

    public List<AuditTrail> getAuditTrailsByAction(String action) {
        return auditTrailRepository.findByAction(action);
    }

    public List<AuditTrail> getAuditTrailsByEntityType(String entityType) {
        return auditTrailRepository.findByEntityType(entityType);
    }

    public List<AuditTrail> getAuditTrailsByEntityId(String entityId) {
        return auditTrailRepository.findByEntityId(entityId);
    }

    public List<AuditTrail> getAuditTrailsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return auditTrailRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<AuditTrail> getAuditTrailsByIpAddress(String ipAddress) {
        return auditTrailRepository.findByIpAddress(ipAddress);
    }

    public Map<String, Object> getAuditTrailStatistics() {
        Map<String, Object> statistics = Map.of(
            "totalAuditTrails", auditTrailRepository.count(),
            "auditTrailsByAction", getAuditTrailsByActionCount(),
            "auditTrailsByEntityType", getAuditTrailsByEntityTypeCount(),
            "auditTrailsByUser", getAuditTrailsByUserCount(),
            "auditTrailsByDate", getAuditTrailsByDateCount()
        );
        return statistics;
    }

    public Map<String, Object> getAuditTrailAnalytics() {
        Map<String, Object> analytics = Map.of(
            "mostActiveUsers", getMostActiveUsers(),
            "mostCommonActions", getMostCommonActions(),
            "mostModifiedEntities", getMostModifiedEntities(),
            "auditTrailsByHour", getAuditTrailsByHourCount(),
            "averageAuditTrailsPerDay", calculateAverageAuditTrailsPerDay()
        );
        return analytics;
    }

    public void logUserCreation(String userId, String userEmail, String ipAddress, String userAgent) {
        createAuditTrail(userId, "CREATE_USER", "User", userId, null, 
                        String.format("{\"email\": \"%s\"}", userEmail), ipAddress, userAgent);
    }

    public void logUserUpdate(String userId, String oldValues, String newValues, String ipAddress, String userAgent) {
        createAuditTrail(userId, "UPDATE_USER", "User", userId, oldValues, newValues, ipAddress, userAgent);
    }

    public void logUserDeletion(String userId, String userEmail, String ipAddress, String userAgent) {
        createAuditTrail(userId, "DELETE_USER", "User", userId, 
                        String.format("{\"email\": \"%s\"}", userEmail), null, ipAddress, userAgent);
    }

    public void logProjectCreation(String userId, String projectId, String projectTitle, String ipAddress, String userAgent) {
        createAuditTrail(userId, "CREATE_PROJECT", "Project", projectId, null, 
                        String.format("{\"title\": \"%s\"}", projectTitle), ipAddress, userAgent);
    }

    public void logProjectUpdate(String userId, String projectId, String oldValues, String newValues, String ipAddress, String userAgent) {
        createAuditTrail(userId, "UPDATE_PROJECT", "Project", projectId, oldValues, newValues, ipAddress, userAgent);
    }

    public void logProjectDeletion(String userId, String projectId, String projectTitle, String ipAddress, String userAgent) {
        createAuditTrail(userId, "DELETE_PROJECT", "Project", projectId, 
                        String.format("{\"title\": \"%s\"}", projectTitle), null, ipAddress, userAgent);
    }

    public void logProposalSubmission(String userId, String proposalId, String projectId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "SUBMIT_PROPOSAL", "Proposal", proposalId, null, 
                        String.format("{\"projectId\": \"%s\"}", projectId), ipAddress, userAgent);
    }

    public void logProposalAcceptance(String userId, String proposalId, String projectId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "ACCEPT_PROPOSAL", "Proposal", proposalId, null, 
                        String.format("{\"projectId\": \"%s\"}", projectId), ipAddress, userAgent);
    }

    public void logProposalRejection(String userId, String proposalId, String projectId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "REJECT_PROPOSAL", "Proposal", proposalId, null, 
                        String.format("{\"projectId\": \"%s\"}", projectId), ipAddress, userAgent);
    }

    public void logContractCreation(String userId, String contractId, String projectId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "CREATE_CONTRACT", "Contract", contractId, null, 
                        String.format("{\"projectId\": \"%s\"}", projectId), ipAddress, userAgent);
    }

    public void logContractUpdate(String userId, String contractId, String oldValues, String newValues, String ipAddress, String userAgent) {
        createAuditTrail(userId, "UPDATE_CONTRACT", "Contract", contractId, oldValues, newValues, ipAddress, userAgent);
    }

    public void logPaymentRequest(String userId, String paymentRequestId, String amount, String currency, String ipAddress, String userAgent) {
        createAuditTrail(userId, "REQUEST_PAYMENT", "PaymentRequest", paymentRequestId, null, 
                        String.format("{\"amount\": \"%s\", \"currency\": \"%s\"}", amount, currency), ipAddress, userAgent);
    }

    public void logPaymentApproval(String userId, String paymentRequestId, String amount, String currency, String ipAddress, String userAgent) {
        createAuditTrail(userId, "APPROVE_PAYMENT", "PaymentRequest", paymentRequestId, null, 
                        String.format("{\"amount\": \"%s\", \"currency\": \"%s\"}", amount, currency), ipAddress, userAgent);
    }

    public void logPaymentRejection(String userId, String paymentRequestId, String amount, String currency, String ipAddress, String userAgent) {
        createAuditTrail(userId, "REJECT_PAYMENT", "PaymentRequest", paymentRequestId, null, 
                        String.format("{\"amount\": \"%s\", \"currency\": \"%s\"}", amount, currency), ipAddress, userAgent);
    }

    public void logLogin(String userId, String ipAddress, String userAgent, boolean success) {
        String action = success ? "LOGIN_SUCCESS" : "LOGIN_FAILED";
        createAuditTrail(userId, action, "Authentication", userId, null, null, ipAddress, userAgent);
    }

    public void logLogout(String userId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "LOGOUT", "Authentication", userId, null, null, ipAddress, userAgent);
    }

    public void logPasswordChange(String userId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "CHANGE_PASSWORD", "User", userId, null, null, ipAddress, userAgent);
    }

    public void logPasswordReset(String userId, String ipAddress, String userAgent) {
        createAuditTrail(userId, "RESET_PASSWORD", "User", userId, null, null, ipAddress, userAgent);
    }

    public void logAdminAction(String adminUserId, String action, String entityType, String entityId, String details) {
        createAuditTrail(adminUserId, action, entityType, entityId, null, details, null, null);
    }

    public void cleanupOldAuditTrails(int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        List<AuditTrail> oldTrails = auditTrailRepository.findByCreatedAtBefore(cutoffDate);
        auditTrailRepository.deleteAll(oldTrails);
        
        // Log the cleanup action
        logAdminAction("SYSTEM", "CLEANUP_AUDIT_TRAILS", "AuditTrail", "BULK", 
                      String.format("Cleaned up %d old audit trails older than %d days", oldTrails.size(), daysToKeep));
    }

    private Map<String, Long> getAuditTrailsByActionCount() {
        Map<String, Long> actionCounts = new HashMap<>();
        actionCounts.put("CREATE_USER", auditTrailRepository.countByAction("CREATE_USER"));
        actionCounts.put("UPDATE_USER", auditTrailRepository.countByAction("UPDATE_USER"));
        actionCounts.put("DELETE_USER", auditTrailRepository.countByAction("DELETE_USER"));
        actionCounts.put("CREATE_PROJECT", auditTrailRepository.countByAction("CREATE_PROJECT"));
        actionCounts.put("UPDATE_PROJECT", auditTrailRepository.countByAction("UPDATE_PROJECT"));
        actionCounts.put("DELETE_PROJECT", auditTrailRepository.countByAction("DELETE_PROJECT"));
        actionCounts.put("SUBMIT_PROPOSAL", auditTrailRepository.countByAction("SUBMIT_PROPOSAL"));
        actionCounts.put("ACCEPT_PROPOSAL", auditTrailRepository.countByAction("ACCEPT_PROPOSAL"));
        actionCounts.put("REJECT_PROPOSAL", auditTrailRepository.countByAction("REJECT_PROPOSAL"));
        actionCounts.put("CREATE_CONTRACT", auditTrailRepository.countByAction("CREATE_CONTRACT"));
        actionCounts.put("UPDATE_CONTRACT", auditTrailRepository.countByAction("UPDATE_CONTRACT"));
        actionCounts.put("REQUEST_PAYMENT", auditTrailRepository.countByAction("REQUEST_PAYMENT"));
        actionCounts.put("APPROVE_PAYMENT", auditTrailRepository.countByAction("APPROVE_PAYMENT"));
        actionCounts.put("REJECT_PAYMENT", auditTrailRepository.countByAction("REJECT_PAYMENT"));
        actionCounts.put("LOGIN_SUCCESS", auditTrailRepository.countByAction("LOGIN_SUCCESS"));
        actionCounts.put("LOGIN_FAILED", auditTrailRepository.countByAction("LOGIN_FAILED"));
        actionCounts.put("LOGOUT", auditTrailRepository.countByAction("LOGOUT"));
        actionCounts.put("CHANGE_PASSWORD", auditTrailRepository.countByAction("CHANGE_PASSWORD"));
        actionCounts.put("RESET_PASSWORD", auditTrailRepository.countByAction("RESET_PASSWORD"));
        return actionCounts;
    }

    private Map<String, Long> getAuditTrailsByEntityTypeCount() {
        Map<String, Long> entityCounts = new HashMap<>();
        entityCounts.put("User", auditTrailRepository.countByEntityType("User"));
        entityCounts.put("Project", auditTrailRepository.countByEntityType("Project"));
        entityCounts.put("Proposal", auditTrailRepository.countByEntityType("Proposal"));
        entityCounts.put("Contract", auditTrailRepository.countByEntityType("Contract"));
        entityCounts.put("PaymentRequest", auditTrailRepository.countByEntityType("PaymentRequest"));
        entityCounts.put("Authentication", auditTrailRepository.countByEntityType("Authentication"));
        entityCounts.put("AuditTrail", auditTrailRepository.countByEntityType("AuditTrail"));
        return entityCounts;
    }

    private Map<String, Long> getAuditTrailsByUserCount() {
        // This would require a custom query to group by user
        // For now, return mock data
        return Map.of(
            "user1", 50L,
            "user2", 45L,
            "user3", 40L,
            "user4", 35L,
            "user5", 30L
        );
    }

    private Map<String, Long> getAuditTrailsByDateCount() {
        // This would require a custom query to group by date
        // For now, return mock data
        return Map.of(
            "2024-01-01", 100L,
            "2024-01-02", 120L,
            "2024-01-03", 110L,
            "2024-01-04", 130L,
            "2024-01-05", 140L
        );
    }

    private Map<String, Long> getMostActiveUsers() {
        // This would require a custom query to get most active users
        // For now, return mock data
        return Map.of(
            "user1", 150L,
            "user2", 140L,
            "user3", 130L,
            "user4", 120L,
            "user5", 110L
        );
    }

    private Map<String, Long> getMostCommonActions() {
        // This would require a custom query to get most common actions
        // For now, return mock data
        return Map.of(
            "LOGIN_SUCCESS", 500L,
            "UPDATE_USER", 300L,
            "CREATE_PROJECT", 250L,
            "SUBMIT_PROPOSAL", 200L,
            "UPDATE_PROJECT", 180L
        );
    }

    private Map<String, Long> getMostModifiedEntities() {
        // This would require a custom query to get most modified entities
        // For now, return mock data
        return Map.of(
            "User", 400L,
            "Project", 350L,
            "Proposal", 300L,
            "Contract", 250L,
            "PaymentRequest", 200L
        );
    }

    private Map<String, Long> getAuditTrailsByHourCount() {
        // This would require a custom query to group by hour
        // For now, return mock data
        Map<String, Long> hourCounts = new HashMap<>();
        hourCounts.put("00:00", 5L);
        hourCounts.put("01:00", 3L);
        hourCounts.put("02:00", 2L);
        hourCounts.put("03:00", 1L);
        hourCounts.put("04:00", 1L);
        hourCounts.put("05:00", 2L);
        hourCounts.put("06:00", 5L);
        hourCounts.put("07:00", 10L);
        hourCounts.put("08:00", 20L);
        hourCounts.put("09:00", 30L);
        hourCounts.put("10:00", 40L);
        hourCounts.put("11:00", 50L);
        hourCounts.put("12:00", 60L);
        hourCounts.put("13:00", 70L);
        hourCounts.put("14:00", 80L);
        hourCounts.put("15:00", 90L);
        hourCounts.put("16:00", 100L);
        hourCounts.put("17:00", 110L);
        hourCounts.put("18:00", 120L);
        hourCounts.put("19:00", 130L);
        hourCounts.put("20:00", 120L);
        hourCounts.put("21:00", 100L);
        hourCounts.put("22:00", 80L);
        hourCounts.put("23:00", 50L);
        return hourCounts;
    }

    private BigDecimal calculateAverageAuditTrailsPerDay() {
        // This would calculate average audit trails per day
        // For now, return a mock value
        return new BigDecimal("250.75");
    }
}
