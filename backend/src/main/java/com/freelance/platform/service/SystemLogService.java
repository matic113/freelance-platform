package com.freelance.platform.service;

import com.freelance.platform.entity.SystemLog;
import com.freelance.platform.entity.LogLevel;
import com.freelance.platform.repository.SystemLogRepository;
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
public class SystemLogService {

    @Autowired
    private SystemLogRepository systemLogRepository;

    public SystemLog createLog(LogLevel level, String category, String message, String details) {
        SystemLog log = new SystemLog();
        log.setLevel(level);
        log.setCategory(category);
        log.setMessage(message);
        log.setDetails(details);
        log.setCreatedAt(LocalDateTime.now());
        
        return systemLogRepository.save(log);
    }

    public SystemLog createLog(LogLevel level, String category, String message, String details, 
                              String userId, String sessionId, String ipAddress, String userAgent) {
        SystemLog log = new SystemLog();
        log.setLevel(level);
        log.setCategory(category);
        log.setMessage(message);
        log.setDetails(details);
        log.setUserId(userId);
        log.setSessionId(sessionId);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setCreatedAt(LocalDateTime.now());
        
        return systemLogRepository.save(log);
    }

    public Page<SystemLog> getAllLogs(Pageable pageable) {
        return systemLogRepository.findAll(pageable);
    }

    public SystemLog getLogById(UUID id) {
        return systemLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("System log not found"));
    }

    public List<SystemLog> getLogsByLevel(LogLevel level) {
        return systemLogRepository.findByLevel(level);
    }

    public List<SystemLog> getLogsByCategory(String category) {
        return systemLogRepository.findByCategory(category);
    }

    public List<SystemLog> getLogsByUser(String userId) {
        return systemLogRepository.findByUserId(userId);
    }

    public List<SystemLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return systemLogRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<SystemLog> getErrorLogs() {
        return systemLogRepository.findByLevel(LogLevel.ERROR);
    }

    public List<SystemLog> getWarningLogs() {
        return systemLogRepository.findByLevel(LogLevel.WARN);
    }

    public List<SystemLog> getInfoLogs() {
        return systemLogRepository.findByLevel(LogLevel.INFO);
    }

    public List<SystemLog> getDebugLogs() {
        return systemLogRepository.findByLevel(LogLevel.DEBUG);
    }

    public List<SystemLog> getFatalLogs() {
        return systemLogRepository.findByLevel(LogLevel.FATAL);
    }

    public Map<String, Object> getLogStatistics() {
        Map<String, Object> statistics = Map.of(
            "totalLogs", systemLogRepository.count(),
            "errorLogs", systemLogRepository.countByLevel(LogLevel.ERROR),
            "warningLogs", systemLogRepository.countByLevel(LogLevel.WARN),
            "infoLogs", systemLogRepository.countByLevel(LogLevel.INFO),
            "debugLogs", systemLogRepository.countByLevel(LogLevel.DEBUG),
            "fatalLogs", systemLogRepository.countByLevel(LogLevel.FATAL)
        );
        return statistics;
    }

    public Map<String, Object> getLogAnalytics() {
        Map<String, Object> analytics = Map.of(
            "logsByLevel", getLogsByLevelCount(),
            "logsByCategory", getLogsByCategoryCount(),
            "logsByHour", getLogsByHourCount(),
            "averageLogsPerDay", calculateAverageLogsPerDay(),
            "errorRate", calculateErrorRate()
        );
        return analytics;
    }

    public void logUserAction(String userId, String action, String entityType, String entityId, 
                            String sessionId, String ipAddress, String userAgent) {
        createLog(LogLevel.INFO, "USER_ACTION", 
                 String.format("User %s performed action %s on %s %s", userId, action, entityType, entityId),
                 null, userId, sessionId, ipAddress, userAgent);
    }

    public void logSecurityEvent(String event, String details, String userId, String ipAddress) {
        createLog(LogLevel.WARN, "SECURITY", event, details, userId, null, ipAddress, null);
    }

    public void logAuthenticationEvent(String event, String userId, String ipAddress, boolean success) {
        LogLevel level = success ? LogLevel.INFO : LogLevel.WARN;
        createLog(level, "AUTHENTICATION", event, null, userId, null, ipAddress, null);
    }

    public void logPaymentEvent(String event, String details, String userId, String amount) {
        createLog(LogLevel.INFO, "PAYMENT", event, details, userId, null, null, null);
    }

    public void logSystemEvent(String event, String details) {
        createLog(LogLevel.INFO, "SYSTEM", event, details);
    }

    public void logError(String error, String details, String userId) {
        createLog(LogLevel.ERROR, "ERROR", error, details, userId, null, null, null);
    }

    public void logWarning(String warning, String details, String userId) {
        createLog(LogLevel.WARN, "WARNING", warning, details, userId, null, null, null);
    }

    public void logDebug(String message, String details) {
        createLog(LogLevel.DEBUG, "DEBUG", message, details);
    }

    public void logFatal(String error, String details) {
        createLog(LogLevel.FATAL, "FATAL", error, details);
    }

    public void cleanupOldLogs(int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        List<SystemLog> oldLogs = systemLogRepository.findByCreatedAtBefore(cutoffDate);
        systemLogRepository.deleteAll(oldLogs);
        
        logSystemEvent("LOG_CLEANUP", String.format("Cleaned up %d old logs older than %d days", 
                                                   oldLogs.size(), daysToKeep));
    }

    private Map<String, Long> getLogsByLevelCount() {
        return Map.of(
            "ERROR", systemLogRepository.countByLevel(LogLevel.ERROR),
            "WARN", systemLogRepository.countByLevel(LogLevel.WARN),
            "INFO", systemLogRepository.countByLevel(LogLevel.INFO),
            "DEBUG", systemLogRepository.countByLevel(LogLevel.DEBUG),
            "FATAL", systemLogRepository.countByLevel(LogLevel.FATAL)
        );
    }

    private Map<String, Long> getLogsByCategoryCount() {
        return Map.of(
            "USER_ACTION", systemLogRepository.countByCategory("USER_ACTION"),
            "SECURITY", systemLogRepository.countByCategory("SECURITY"),
            "AUTHENTICATION", systemLogRepository.countByCategory("AUTHENTICATION"),
            "PAYMENT", systemLogRepository.countByCategory("PAYMENT"),
            "SYSTEM", systemLogRepository.countByCategory("SYSTEM"),
            "ERROR", systemLogRepository.countByCategory("ERROR"),
            "WARNING", systemLogRepository.countByCategory("WARNING"),
            "DEBUG", systemLogRepository.countByCategory("DEBUG"),
            "FATAL", systemLogRepository.countByCategory("FATAL")
        );
    }

    private Map<String, Long> getLogsByHourCount() {
        // This would require a custom query to group logs by hour
        // For now, return mock data
        Map<String, Long> hourCounts = new HashMap<>();
        hourCounts.put("00:00", 10L);
        hourCounts.put("01:00", 5L);
        hourCounts.put("02:00", 3L);
        hourCounts.put("03:00", 2L);
        hourCounts.put("04:00", 1L);
        hourCounts.put("05:00", 2L);
        hourCounts.put("06:00", 5L);
        hourCounts.put("07:00", 15L);
        hourCounts.put("08:00", 25L);
        hourCounts.put("09:00", 30L);
        hourCounts.put("10:00", 35L);
        hourCounts.put("11:00", 40L);
        hourCounts.put("12:00", 45L);
        hourCounts.put("13:00", 50L);
        hourCounts.put("14:00", 55L);
        hourCounts.put("15:00", 60L);
        hourCounts.put("16:00", 65L);
        hourCounts.put("17:00", 70L);
        hourCounts.put("18:00", 75L);
        hourCounts.put("19:00", 80L);
        hourCounts.put("20:00", 70L);
        hourCounts.put("21:00", 60L);
        hourCounts.put("22:00", 40L);
        hourCounts.put("23:00", 20L);
        return hourCounts;
    }

    private BigDecimal calculateAverageLogsPerDay() {
        // This would calculate average logs per day
        // For now, return a mock value
        return new BigDecimal("150.5");
    }

    private BigDecimal calculateErrorRate() {
        long totalLogs = systemLogRepository.count();
        long errorLogs = systemLogRepository.countByLevel(LogLevel.ERROR);
        
        if (totalLogs == 0) {
            return BigDecimal.ZERO;
        }
        
        return new BigDecimal(errorLogs)
                .divide(new BigDecimal(totalLogs), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(new BigDecimal("100"));
    }
}
