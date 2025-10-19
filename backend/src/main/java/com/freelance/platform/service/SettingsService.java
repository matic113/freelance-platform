package com.freelance.platform.service;

import com.freelance.platform.entity.User;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class SettingsService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getProfileSettings(UUID userId) {
        Map<String, Object> settings = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            settings.put("firstName", user.getFirstName());
            settings.put("lastName", user.getLastName());
            settings.put("email", user.getEmail());
            settings.put("phone", user.getPhone());
            settings.put("country", user.getCountry());
            settings.put("city", user.getCity());
            settings.put("timezone", user.getTimezone());
            settings.put("language", user.getLanguage());
            settings.put("avatarUrl", user.getAvatarUrl());
            
            if (user.getFreelancerProfile() != null) {
                settings.put("bio", user.getFreelancerProfile().getBio());
                settings.put("hourlyRate", user.getFreelancerProfile().getHourlyRate());
                settings.put("portfolioUrl", user.getFreelancerProfile().getPortfolioUrl());
                settings.put("linkedinUrl", user.getFreelancerProfile().getLinkedinUrl());
                settings.put("githubUrl", user.getFreelancerProfile().getGithubUrl());
                settings.put("websiteUrl", user.getFreelancerProfile().getWebsiteUrl());
            }
        }
        
        return settings;
    }

    public Map<String, Object> updateProfileSettings(UUID userId, Map<String, Object> settingsData) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Update basic profile information
        if (settingsData.containsKey("firstName")) {
            user.setFirstName((String) settingsData.get("firstName"));
        }
        if (settingsData.containsKey("lastName")) {
            user.setLastName((String) settingsData.get("lastName"));
        }
        if (settingsData.containsKey("phone")) {
            user.setPhone((String) settingsData.get("phone"));
        }
        if (settingsData.containsKey("country")) {
            user.setCountry((String) settingsData.get("country"));
        }
        if (settingsData.containsKey("city")) {
            user.setCity((String) settingsData.get("city"));
        }
        if (settingsData.containsKey("timezone")) {
            user.setTimezone((String) settingsData.get("timezone"));
        }
        if (settingsData.containsKey("language")) {
            user.setLanguage((String) settingsData.get("language"));
        }
        
        // Update freelancer profile if exists
        if (user.getFreelancerProfile() != null) {
            if (settingsData.containsKey("bio")) {
                user.getFreelancerProfile().setBio((String) settingsData.get("bio"));
            }
            if (settingsData.containsKey("hourlyRate")) {
                user.getFreelancerProfile().setHourlyRate((java.math.BigDecimal) settingsData.get("hourlyRate"));
            }
            if (settingsData.containsKey("portfolioUrl")) {
                user.getFreelancerProfile().setPortfolioUrl((String) settingsData.get("portfolioUrl"));
            }
            if (settingsData.containsKey("linkedinUrl")) {
                user.getFreelancerProfile().setLinkedinUrl((String) settingsData.get("linkedinUrl"));
            }
            if (settingsData.containsKey("githubUrl")) {
                user.getFreelancerProfile().setGithubUrl((String) settingsData.get("githubUrl"));
            }
            if (settingsData.containsKey("websiteUrl")) {
                user.getFreelancerProfile().setWebsiteUrl((String) settingsData.get("websiteUrl"));
            }
        }
        
        userRepository.save(user);
        
        return getProfileSettings(userId);
    }

    public Map<String, Object> getNotificationSettings(UUID userId) {
        Map<String, Object> settings = new HashMap<>();
        
        // Default notification settings
        settings.put("emailNotifications", true);
        settings.put("pushNotifications", true);
        settings.put("inAppNotifications", true);
        settings.put("proposalNotifications", true);
        settings.put("paymentNotifications", true);
        settings.put("messageNotifications", true);
        settings.put("contractNotifications", true);
        settings.put("reviewNotifications", true);
        settings.put("marketingEmails", false);
        settings.put("weeklyDigest", true);
        settings.put("monthlyReport", true);
        
        return settings;
    }

    public Map<String, Object> updateNotificationSettings(UUID userId, Map<String, Object> settingsData) {
        // In a real implementation, you would save these settings to a database
        // For now, we'll just return the updated settings
        
        Map<String, Object> settings = getNotificationSettings(userId);
        settings.putAll(settingsData);
        
        return settings;
    }

    public Map<String, Object> getPrivacySettings(UUID userId) {
        Map<String, Object> settings = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            settings.put("profileVisibility", "public");
            settings.put("showEmail", false);
            settings.put("showPhone", false);
            settings.put("showLocation", true);
            settings.put("showOnlineStatus", true);
            settings.put("allowMessages", true);
            settings.put("allowProposals", true);
            settings.put("showEarnings", false);
            settings.put("showProjects", true);
            settings.put("showReviews", true);
        }
        
        return settings;
    }

    public Map<String, Object> updatePrivacySettings(UUID userId, Map<String, Object> settingsData) {
        // In a real implementation, you would save these settings to a database
        // For now, we'll just return the updated settings
        
        Map<String, Object> settings = getPrivacySettings(userId);
        settings.putAll(settingsData);
        
        return settings;
    }

    public Map<String, Object> getSecuritySettings(UUID userId) {
        Map<String, Object> settings = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            settings.put("twoFactorAuth", false);
            settings.put("loginAlerts", true);
            settings.put("sessionTimeout", 30); // minutes
            settings.put("passwordExpiry", 90); // days
            settings.put("lastPasswordChange", user.getUpdatedAt());
            settings.put("lastLogin", user.getUpdatedAt()); // This would be tracked separately
            settings.put("activeSessions", 1);
        }
        
        return settings;
    }

    public Map<String, Object> updateSecuritySettings(UUID userId, Map<String, Object> settingsData) {
        // In a real implementation, you would save these settings to a database
        // For now, we'll just return the updated settings
        
        Map<String, Object> settings = getSecuritySettings(userId);
        settings.putAll(settingsData);
        
        return settings;
    }

    public Map<String, Object> getBillingSettings(UUID userId) {
        Map<String, Object> settings = new HashMap<>();
        
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            settings.put("paymentMethods", new java.util.ArrayList<>());
            settings.put("billingAddress", new HashMap<>());
            settings.put("taxId", "");
            settings.put("currency", "USD");
            settings.put("billingCycle", "monthly");
            settings.put("autoPay", false);
            settings.put("invoices", new java.util.ArrayList<>());
        }
        
        return settings;
    }

    public Map<String, Object> updateBillingSettings(UUID userId, Map<String, Object> settingsData) {
        // In a real implementation, you would save these settings to a database
        // For now, we'll just return the updated settings
        
        Map<String, Object> settings = getBillingSettings(userId);
        settings.putAll(settingsData);
        
        return settings;
    }

    public Map<String, Object> getIntegrationSettings(UUID userId) {
        Map<String, Object> settings = new HashMap<>();
        
        settings.put("googleCalendar", false);
        settings.put("slack", false);
        settings.put("github", false);
        settings.put("linkedin", false);
        settings.put("trello", false);
        settings.put("asana", false);
        settings.put("jira", false);
        settings.put("discord", false);
        settings.put("zoom", false);
        settings.put("teams", false);
        
        return settings;
    }

    public Map<String, Object> updateIntegrationSettings(UUID userId, Map<String, Object> settingsData) {
        // In a real implementation, you would save these settings to a database
        // For now, we'll just return the updated settings
        
        Map<String, Object> settings = getIntegrationSettings(userId);
        settings.putAll(settingsData);
        
        return settings;
    }
}
