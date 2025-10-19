package com.freelance.platform.service;

import com.freelance.platform.entity.ModerationQueue;
import com.freelance.platform.entity.ModerationStatus;
import com.freelance.platform.entity.ModerationPriority;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.ModerationQueueRepository;
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
public class ModerationService {

    @Autowired
    private ModerationQueueRepository moderationQueueRepository;

    @Autowired
    private UserRepository userRepository;

    public ModerationQueue createModerationItem(String entityType, String entityId, ModerationPriority priority, String reason) {
        ModerationQueue moderationItem = new ModerationQueue();
        moderationItem.setEntityType(entityType);
        moderationItem.setEntityId(entityId);
        moderationItem.setPriority(priority);
        moderationItem.setReason(reason);
        moderationItem.setStatus(ModerationStatus.PENDING);
        moderationItem.setCreatedAt(LocalDateTime.now());
        
        return moderationQueueRepository.save(moderationItem);
    }

    public Page<ModerationQueue> getModerationQueue(Pageable pageable) {
        return moderationQueueRepository.findAll(pageable);
    }

    public ModerationQueue getModerationItemById(UUID id) {
        return moderationQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Moderation item not found"));
    }

    public ModerationQueue assignModerationItem(UUID id, UUID userId) {
        ModerationQueue item = moderationQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Moderation item not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        item.setAssignedAdmin(user);
        item.setStatus(ModerationStatus.UNDER_REVIEW);
        
        return moderationQueueRepository.save(item);
    }

    public ModerationQueue approveModerationItem(UUID id, String adminNotes) {
        ModerationQueue item = moderationQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Moderation item not found"));
        
        item.setStatus(ModerationStatus.APPROVED);
        item.setAdminNotes(adminNotes);
        item.setReviewedAt(LocalDateTime.now());
        
        return moderationQueueRepository.save(item);
    }

    public ModerationQueue rejectModerationItem(UUID id, String adminNotes) {
        ModerationQueue item = moderationQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Moderation item not found"));
        
        item.setStatus(ModerationStatus.REJECTED);
        item.setAdminNotes(adminNotes);
        item.setReviewedAt(LocalDateTime.now());
        
        return moderationQueueRepository.save(item);
    }

    public ModerationQueue flagModerationItem(UUID id, String adminNotes) {
        ModerationQueue item = moderationQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Moderation item not found"));
        
        item.setStatus(ModerationStatus.FLAGGED);
        item.setAdminNotes(adminNotes);
        item.setReviewedAt(LocalDateTime.now());
        
        return moderationQueueRepository.save(item);
    }

    public void deleteModerationItem(UUID id) {
        ModerationQueue item = moderationQueueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Moderation item not found"));
        
        moderationQueueRepository.delete(item);
    }

    public List<ModerationQueue> getPendingModerationItems() {
        return moderationQueueRepository.findByStatus(ModerationStatus.PENDING);
    }

    public List<ModerationQueue> getHighPriorityModerationItems() {
        return moderationQueueRepository.findByPriorityAndStatus(ModerationPriority.HIGH, ModerationStatus.PENDING);
    }

    public List<ModerationQueue> getUrgentModerationItems() {
        return moderationQueueRepository.findByPriorityAndStatus(ModerationPriority.URGENT, ModerationStatus.PENDING);
    }

    public Map<String, Object> getModerationStatistics() {
        Map<String, Object> statistics = Map.of(
            "totalItems", moderationQueueRepository.count(),
            "pendingItems", moderationQueueRepository.countByStatus(ModerationStatus.PENDING),
            "underReviewItems", moderationQueueRepository.countByStatus(ModerationStatus.UNDER_REVIEW),
            "approvedItems", moderationQueueRepository.countByStatus(ModerationStatus.APPROVED),
            "rejectedItems", moderationQueueRepository.countByStatus(ModerationStatus.REJECTED),
            "flaggedItems", moderationQueueRepository.countByStatus(ModerationStatus.FLAGGED),
            "highPriorityItems", moderationQueueRepository.countByPriorityAndStatus(ModerationPriority.HIGH, ModerationStatus.PENDING),
            "urgentItems", moderationQueueRepository.countByPriorityAndStatus(ModerationPriority.URGENT, ModerationStatus.PENDING)
        );
        return statistics;
    }

    public Map<String, Object> getModerationAnalytics() {
        Map<String, Object> analytics = Map.of(
            "averageProcessingTime", calculateAverageProcessingTime(),
            "approvalRate", calculateApprovalRate(),
            "rejectionRate", calculateRejectionRate(),
            "itemsByType", getItemsByType(),
            "itemsByPriority", getItemsByPriority()
        );
        return analytics;
    }

    public void autoModerateContent(String content, String entityType, String entityId) {
        // Simple auto-moderation logic
        String[] inappropriateWords = {"spam", "scam", "fake", "inappropriate", "offensive"};
        String lowerContent = content.toLowerCase();
        
        for (String word : inappropriateWords) {
            if (lowerContent.contains(word)) {
                createModerationItem(entityType, entityId, ModerationPriority.MEDIUM, 
                                   "Auto-detected inappropriate content: " + word);
                break;
            }
        }
    }

    public void moderateUserProfile(UUID userId) {
        createModerationItem("User", userId.toString(), ModerationPriority.MEDIUM, 
                           "User profile requires moderation");
    }

    public void moderateProject(UUID projectId) {
        createModerationItem("Project", projectId.toString(), ModerationPriority.MEDIUM, 
                           "Project requires moderation");
    }

    public void moderateProposal(UUID proposalId) {
        createModerationItem("Proposal", proposalId.toString(), ModerationPriority.LOW, 
                           "Proposal requires moderation");
    }

    public void moderateMessage(UUID messageId) {
        createModerationItem("Message", messageId.toString(), ModerationPriority.HIGH, 
                           "Message requires moderation");
    }

    private BigDecimal calculateAverageProcessingTime() {
        // This would calculate average processing time in hours
        // For now, return a mock value
        return new BigDecimal("2.5");
    }

    private BigDecimal calculateApprovalRate() {
        long totalProcessed = moderationQueueRepository.countByStatus(ModerationStatus.APPROVED) + 
                             moderationQueueRepository.countByStatus(ModerationStatus.REJECTED);
        long approved = moderationQueueRepository.countByStatus(ModerationStatus.APPROVED);
        
        if (totalProcessed == 0) {
            return BigDecimal.ZERO;
        }
        
        return new BigDecimal(approved)
                .divide(new BigDecimal(totalProcessed), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    private BigDecimal calculateRejectionRate() {
        long totalProcessed = moderationQueueRepository.countByStatus(ModerationStatus.APPROVED) + 
                             moderationQueueRepository.countByStatus(ModerationStatus.REJECTED);
        long rejected = moderationQueueRepository.countByStatus(ModerationStatus.REJECTED);
        
        if (totalProcessed == 0) {
            return BigDecimal.ZERO;
        }
        
        return new BigDecimal(rejected)
                .divide(new BigDecimal(totalProcessed), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    private Map<String, Long> getItemsByType() {
        return Map.of(
            "User", moderationQueueRepository.countByEntityType("User"),
            "Project", moderationQueueRepository.countByEntityType("Project"),
            "Proposal", moderationQueueRepository.countByEntityType("Proposal"),
            "Message", moderationQueueRepository.countByEntityType("Message"),
            "Content", moderationQueueRepository.countByEntityType("Content")
        );
    }

    private Map<String, Long> getItemsByPriority() {
        return Map.of(
            "LOW", moderationQueueRepository.countByPriority(ModerationPriority.LOW),
            "MEDIUM", moderationQueueRepository.countByPriority(ModerationPriority.MEDIUM),
            "HIGH", moderationQueueRepository.countByPriority(ModerationPriority.HIGH),
            "URGENT", moderationQueueRepository.countByPriority(ModerationPriority.URGENT)
        );
    }
}
