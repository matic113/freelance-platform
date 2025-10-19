package com.freelance.platform.service;

import com.freelance.platform.entity.FraudDetection;
import com.freelance.platform.entity.FraudStatus;
import com.freelance.platform.entity.FraudType;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.FraudDetectionRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class FraudDetectionService {

    @Autowired
    private FraudDetectionRepository fraudDetectionRepository;

    @Autowired
    private UserRepository userRepository;

    public FraudDetection createFraudDetection(String entityType, String entityId, FraudType fraudType, 
                                              BigDecimal riskScore, String description, String evidence) {
        FraudDetection fraudDetection = new FraudDetection();
        fraudDetection.setEntityType(entityType);
        fraudDetection.setEntityId(entityId);
        fraudDetection.setFraudType(fraudType);
        fraudDetection.setRiskScore(riskScore);
        fraudDetection.setDescription(description);
        fraudDetection.setEvidence(evidence);
        fraudDetection.setStatus(FraudStatus.DETECTED);
        fraudDetection.setCreatedAt(LocalDateTime.now());
        
        return fraudDetectionRepository.save(fraudDetection);
    }

    public Page<FraudDetection> getAllFraudDetections(Pageable pageable) {
        return fraudDetectionRepository.findAll(pageable);
    }

    public FraudDetection getFraudDetectionById(UUID id) {
        return fraudDetectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fraud detection not found"));
    }

    public FraudDetection updateFraudDetectionStatus(UUID id, FraudStatus status, UUID adminUserId) {
        FraudDetection fraudDetection = fraudDetectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fraud detection not found"));
        
        fraudDetection.setStatus(status);
        if (status == FraudStatus.INVESTIGATING || status == FraudStatus.CONFIRMED) {
            fraudDetection.setInvestigatedAt(LocalDateTime.now());
        }
        
        return fraudDetectionRepository.save(fraudDetection);
    }

    public void deleteFraudDetection(UUID id) {
        FraudDetection fraudDetection = fraudDetectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fraud detection not found"));
        
        fraudDetectionRepository.delete(fraudDetection);
    }

    public List<FraudDetection> getSuspiciousUsers() {
        return fraudDetectionRepository.findByEntityTypeAndStatus("User", FraudStatus.DETECTED);
    }

    public List<FraudDetection> getSuspiciousProjects() {
        return fraudDetectionRepository.findByEntityTypeAndStatus("Project", FraudStatus.DETECTED);
    }

    public List<FraudDetection> getSuspiciousPayments() {
        return fraudDetectionRepository.findByEntityTypeAndStatus("Payment", FraudStatus.DETECTED);
    }

    public Map<String, Object> getFraudStatistics() {
        Map<String, Object> statistics = Map.of(
            "totalDetections", fraudDetectionRepository.count(),
            "detectedCount", fraudDetectionRepository.countByStatus(FraudStatus.DETECTED),
            "investigatingCount", fraudDetectionRepository.countByStatus(FraudStatus.INVESTIGATING),
            "confirmedCount", fraudDetectionRepository.countByStatus(FraudStatus.CONFIRMED),
            "falsePositiveCount", fraudDetectionRepository.countByStatus(FraudStatus.FALSE_POSITIVE),
            "resolvedCount", fraudDetectionRepository.countByStatus(FraudStatus.RESOLVED)
        );
        return statistics;
    }

    public Map<String, Object> getFraudAnalytics() {
        Map<String, Object> analytics = Map.of(
            "fraudTypes", Map.of(
                "FAKE_PROFILE", fraudDetectionRepository.countByFraudType(FraudType.FAKE_PROFILE),
                "SCAM_PROJECT", fraudDetectionRepository.countByFraudType(FraudType.SCAM_PROJECT),
                "PAYMENT_FRAUD", fraudDetectionRepository.countByFraudType(FraudType.PAYMENT_FRAUD),
                "IDENTITY_THEFT", fraudDetectionRepository.countByFraudType(FraudType.IDENTITY_THEFT),
                "MONEY_LAUNDERING", fraudDetectionRepository.countByFraudType(FraudType.MONEY_LAUNDERING),
                "SUSPICIOUS_ACTIVITY", fraudDetectionRepository.countByFraudType(FraudType.SUSPICIOUS_ACTIVITY)
            ),
            "averageRiskScore", calculateAverageRiskScore(),
            "detectionRate", calculateDetectionRate()
        );
        return analytics;
    }

    public boolean detectFakeProfile(User user) {
        // Simple fake profile detection logic
        boolean isSuspicious = false;
        BigDecimal riskScore = BigDecimal.ZERO;
        
        // Check for suspicious patterns
        if (user.getFirstName().equals(user.getLastName())) {
            riskScore = riskScore.add(new BigDecimal("0.3"));
            isSuspicious = true;
        }
        
        if (user.getEmail().contains("temp") || user.getEmail().contains("fake")) {
            riskScore = riskScore.add(new BigDecimal("0.5"));
            isSuspicious = true;
        }
        
        if (user.getPhone() == null || user.getPhone().isEmpty()) {
            riskScore = riskScore.add(new BigDecimal("0.2"));
            isSuspicious = true;
        }
        
        if (isSuspicious && riskScore.compareTo(new BigDecimal("0.5")) > 0) {
            createFraudDetection("User", user.getId().toString(), FraudType.FAKE_PROFILE, 
                               riskScore, "Suspicious profile patterns detected", 
                               "Profile analysis indicates potential fake profile");
            return true;
        }
        
        return false;
    }

    public boolean detectScamProject(String projectTitle, String projectDescription) {
        // Simple scam project detection logic
        boolean isSuspicious = false;
        BigDecimal riskScore = BigDecimal.ZERO;
        
        String[] scamKeywords = {"urgent", "quick money", "easy work", "no experience needed", 
                               "work from home", "make money fast", "guaranteed income"};
        
        String content = (projectTitle + " " + projectDescription).toLowerCase();
        
        for (String keyword : scamKeywords) {
            if (content.contains(keyword)) {
                riskScore = riskScore.add(new BigDecimal("0.2"));
                isSuspicious = true;
            }
        }
        
        if (isSuspicious && riskScore.compareTo(new BigDecimal("0.4")) > 0) {
            createFraudDetection("Project", "temp_id", FraudType.SCAM_PROJECT, 
                               riskScore, "Suspicious project content detected", 
                               "Project contains potential scam indicators");
            return true;
        }
        
        return false;
    }

    public boolean detectPaymentFraud(String paymentMethod, BigDecimal amount) {
        // Simple payment fraud detection logic
        boolean isSuspicious = false;
        BigDecimal riskScore = BigDecimal.ZERO;
        
        // Check for suspicious payment patterns
        if (amount.compareTo(new BigDecimal("10000")) > 0) {
            riskScore = riskScore.add(new BigDecimal("0.3"));
            isSuspicious = true;
        }
        
        if (paymentMethod.equals("cryptocurrency")) {
            riskScore = riskScore.add(new BigDecimal("0.4"));
            isSuspicious = true;
        }
        
        if (isSuspicious && riskScore.compareTo(new BigDecimal("0.5")) > 0) {
            createFraudDetection("Payment", "temp_id", FraudType.PAYMENT_FRAUD, 
                               riskScore, "Suspicious payment pattern detected", 
                               "Payment shows potential fraud indicators");
            return true;
        }
        
        return false;
    }

    private BigDecimal calculateAverageRiskScore() {
        List<FraudDetection> allDetections = fraudDetectionRepository.findAll();
        if (allDetections.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal totalScore = allDetections.stream()
                .map(FraudDetection::getRiskScore)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return totalScore.divide(new BigDecimal(allDetections.size()), 2, BigDecimal.ROUND_HALF_UP);
    }

    private BigDecimal calculateDetectionRate() {
        long totalDetections = fraudDetectionRepository.count();
        long confirmedFraud = fraudDetectionRepository.countByStatus(FraudStatus.CONFIRMED);
        
        if (totalDetections == 0) {
            return BigDecimal.ZERO;
        }
        
        return new BigDecimal(confirmedFraud)
                .divide(new BigDecimal(totalDetections), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(new BigDecimal("100"));
    }
}
