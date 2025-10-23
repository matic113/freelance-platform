package com.freelance.platform.service;

import com.freelance.platform.entity.*;
import com.freelance.platform.repository.AnnouncementRepository;
import com.freelance.platform.repository.UserRepository;
import com.freelance.platform.service.admin.AdminActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AnnouncementService {
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private AdminActionService adminActionService;
    
    public Announcement createAnnouncement(String title, String message, AnnouncementPriority priority, 
                                          Boolean sendEmail, TargetAudience targetAudience, User createdBy) {
        Announcement announcement = new Announcement(title, message, priority, sendEmail, targetAudience, createdBy);
        Announcement saved = announcementRepository.save(announcement);
        
        adminActionService.logAction(
            createdBy.getId(), 
            "CREATE_ANNOUNCEMENT", 
            "Announcement", 
            saved.getId().toString(), 
            "Created announcement: " + title + " for " + targetAudience
        );
        
        return saved;
    }
    
    public Announcement sendAnnouncement(UUID announcementId, User admin) {
        Announcement announcement = announcementRepository.findById(announcementId)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        if (announcement.getSentAt() != null) {
            throw new RuntimeException("Announcement has already been sent");
        }
        
        List<User> recipients = getRecipientsByAudience(announcement.getTargetAudience());
        
        String priorityLevel = mapPriorityToNotification(announcement.getPriority());
        
        for (User recipient : recipients) {
            notificationService.createNotificationForUser(
                recipient.getId(),
                "ANNOUNCEMENT",
                announcement.getTitle(),
                announcement.getMessage(),
                priorityLevel,
                null
            );
            
            if (announcement.getSendEmail() && recipient.getEmail() != null) {
                try {
                    sendAnnouncementEmail(recipient, announcement);
                } catch (Exception e) {
                    System.err.println("Failed to send announcement email to " + recipient.getEmail() + ": " + e.getMessage());
                }
            }
        }
        
        announcement.setSentAt(LocalDateTime.now());
        announcement.setRecipientCount(recipients.size());
        Announcement updated = announcementRepository.save(announcement);
        
        adminActionService.logAction(
            admin.getId(),
            "SEND_ANNOUNCEMENT",
            "Announcement",
            announcementId.toString(),
            "Sent announcement to " + recipients.size() + " users"
        );
        
        return updated;
    }
    
    private List<User> getRecipientsByAudience(TargetAudience targetAudience) {
        switch (targetAudience) {
            case CLIENTS:
                return userRepository.findByRole(Role.CLIENT);
            case FREELANCERS:
                return userRepository.findByRole(Role.FREELANCER);
            case ADMINS:
                return userRepository.findByRole(Role.ADMIN);
            case ALL:
            default:
                return userRepository.findByIsActiveTrueAndDeletedAtIsNull();
        }
    }
    
    private String mapPriorityToNotification(AnnouncementPriority priority) {
        switch (priority) {
            case URGENT:
                return "high";
            case HIGH:
                return "high";
            case NORMAL:
                return "medium";
            case LOW:
            default:
                return "low";
        }
    }
    
    private void sendAnnouncementEmail(User recipient, Announcement announcement) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", recipient.getFirstName());
        variables.put("title", announcement.getTitle());
        variables.put("message", announcement.getMessage());
        variables.put("priority", announcement.getPriority().toString());
        
        emailService.sendTemplateEmail(recipient.getEmail(), "ANNOUNCEMENT", variables);
    }
    
    public Page<Announcement> getAllAnnouncements(Pageable pageable) {
        return announcementRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    public Announcement getAnnouncementById(UUID id) {
        return announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
    }
    
    public List<Announcement> getRecentAnnouncements(int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return announcementRepository.findRecentAnnouncements(startDate);
    }
    
    public void deleteAnnouncement(UUID id, User admin) {
        Announcement announcement = announcementRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        announcementRepository.delete(announcement);
        
        adminActionService.logAction(
            admin.getId(),
            "DELETE_ANNOUNCEMENT",
            "Announcement",
            id.toString(),
            "Deleted announcement: " + announcement.getTitle()
        );
    }
}
