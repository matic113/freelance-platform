package com.freelance.platform.service;

import com.freelance.platform.dto.request.UpdateNotificationSettingsRequest;
import com.freelance.platform.dto.response.NotificationSettingsResponse;
import com.freelance.platform.entity.NotificationSettings;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class NotificationSettingsService {
    
    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;
    
    @Autowired
    private UserService userService;
    
    public NotificationSettingsResponse getNotificationSettings(UUID userId) {
        User user = userService.findById(userId);
        NotificationSettings settings = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));
        
        return new NotificationSettingsResponse(settings);
    }
    
    public NotificationSettingsResponse updateNotificationSettings(UUID userId, UpdateNotificationSettingsRequest request) {
        User user = userService.findById(userId);
        NotificationSettings settings = notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));
        
        // Update email notifications
        if (request.getEmailNewProposals() != null) {
            settings.setEmailNewProposals(request.getEmailNewProposals());
        }
        if (request.getEmailNewMessages() != null) {
            settings.setEmailNewMessages(request.getEmailNewMessages());
        }
        if (request.getEmailPayments() != null) {
            settings.setEmailPayments(request.getEmailPayments());
        }
        if (request.getEmailNewReviews() != null) {
            settings.setEmailNewReviews(request.getEmailNewReviews());
        }
        if (request.getEmailSystemNotifications() != null) {
            settings.setEmailSystemNotifications(request.getEmailSystemNotifications());
        }
        if (request.getEmailMarketingEmails() != null) {
            settings.setEmailMarketingEmails(request.getEmailMarketingEmails());
        }
        
        // Update push notifications
        if (request.getPushNewProposals() != null) {
            settings.setPushNewProposals(request.getPushNewProposals());
        }
        if (request.getPushNewMessages() != null) {
            settings.setPushNewMessages(request.getPushNewMessages());
        }
        if (request.getPushPayments() != null) {
            settings.setPushPayments(request.getPushPayments());
        }
        if (request.getPushNewReviews() != null) {
            settings.setPushNewReviews(request.getPushNewReviews());
        }
        if (request.getPushSystemNotifications() != null) {
            settings.setPushSystemNotifications(request.getPushSystemNotifications());
        }
        
        // Update frequency settings
        if (request.getEmailFrequency() != null) {
            try {
                settings.setEmailFrequency(NotificationSettings.EmailFrequency.valueOf(request.getEmailFrequency().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep current frequency if invalid value provided
            }
        }
        if (request.getPushFrequency() != null) {
            try {
                settings.setPushFrequency(NotificationSettings.PushFrequency.valueOf(request.getPushFrequency().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep current frequency if invalid value provided
            }
        }
        
        NotificationSettings savedSettings = notificationSettingsRepository.save(settings);
        return new NotificationSettingsResponse(savedSettings);
    }
    
    private NotificationSettings createDefaultSettings(User user) {
        NotificationSettings settings = new NotificationSettings(user);
        // Default values are already set in the entity
        return notificationSettingsRepository.save(settings);
    }
}
