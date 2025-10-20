package com.freelance.platform.service;

import com.freelance.platform.entity.NotificationSettings;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class EmailNotificationService {

    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;

    @Autowired
    private EmailService emailService;

    public void sendNewProposalEmail(User client, String freelancerName, String projectTitle) {
        if (shouldSendEmail(client.getId(), "emailNewProposals")) {
            try {
                emailService.sendProposalReceivedEmail(client, freelancerName, projectTitle);
            } catch (Exception e) {
                System.err.println("Failed to send new proposal email to " + client.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendProposalAcceptedEmail(User freelancer, String clientName, String projectTitle) {
        if (shouldSendEmail(freelancer.getId(), "emailNewProposals")) {
            try {
                emailService.sendProposalAcceptedEmail(freelancer, clientName, projectTitle);
            } catch (Exception e) {
                System.err.println("Failed to send proposal accepted email to " + freelancer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendProposalRejectedEmail(User freelancer, String projectTitle) {
        if (shouldSendEmail(freelancer.getId(), "emailNewProposals")) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("firstName", freelancer.getFirstName());
                variables.put("projectTitle", projectTitle);
                emailService.sendTemplateEmail(freelancer.getEmail(), "PROPOSAL_REJECTED", variables);
            } catch (Exception e) {
                System.err.println("Failed to send proposal rejected email to " + freelancer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendNewMessageEmail(User recipient, String senderName, String senderFirstName, String senderLastName, String projectTitle) {
        if (shouldSendEmail(recipient.getId(), "emailNewMessages")) {
            try {
                emailService.sendNewMessageEmail(recipient, senderFirstName + " " + senderLastName, projectTitle);
            } catch (Exception e) {
                System.err.println("Failed to send new message email to " + recipient.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendPaymentRequestEmail(User client, String freelancerName, String amount, String currency) {
        if (shouldSendEmail(client.getId(), "emailPayments")) {
            try {
                emailService.sendPaymentRequestEmail(client, freelancerName, amount, currency);
            } catch (Exception e) {
                System.err.println("Failed to send payment request email to " + client.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendPaymentApprovedEmail(User freelancer, String amount, String currency) {
        if (shouldSendEmail(freelancer.getId(), "emailPayments")) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("firstName", freelancer.getFirstName());
                variables.put("amount", amount);
                variables.put("currency", currency);
                emailService.sendTemplateEmail(freelancer.getEmail(), "PAYMENT_APPROVED", variables);
            } catch (Exception e) {
                System.err.println("Failed to send payment approved email to " + freelancer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendPaymentReceivedEmail(User freelancer, String clientName, String amount, String currency) {
        if (shouldSendEmail(freelancer.getId(), "emailPayments")) {
            try {
                emailService.sendPaymentReceivedEmail(freelancer, clientName, amount, currency);
            } catch (Exception e) {
                System.err.println("Failed to send payment received email to " + freelancer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendNewReviewEmail(User reviewee, String reviewerName, int rating) {
        if (shouldSendEmail(reviewee.getId(), "emailNewReviews")) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("firstName", reviewee.getFirstName());
                variables.put("reviewerName", reviewerName);
                variables.put("rating", String.valueOf(rating));
                emailService.sendTemplateEmail(reviewee.getEmail(), "NEW_REVIEW", variables);
            } catch (Exception e) {
                System.err.println("Failed to send new review email to " + reviewee.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendReviewInvitationEmail(User reviewer, String otherPartyName, String projectTitle, 
                                         String amount, String currency, String reviewUrl) {
        if (shouldSendEmail(reviewer.getId(), "emailNewReviews")) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("firstName", reviewer.getFirstName());
                variables.put("otherPartyName", otherPartyName);
                variables.put("projectTitle", projectTitle);
                variables.put("amount", amount);
                variables.put("currency", currency);
                variables.put("completionDate", LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy")));
                variables.put("reviewUrl", reviewUrl);
                emailService.sendTemplateEmail(reviewer.getEmail(), "REVIEW_INVITATION", variables);
            } catch (Exception e) {
                System.err.println("Failed to send review invitation email to " + reviewer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendReviewReminderEmail(User reviewer, String otherPartyName, String projectTitle, 
                                       String reviewUrl, long daysAgo) {
        if (shouldSendEmail(reviewer.getId(), "emailNewReviews")) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("firstName", reviewer.getFirstName());
                variables.put("otherPartyName", otherPartyName);
                variables.put("projectTitle", projectTitle);
                variables.put("reviewUrl", reviewUrl);
                variables.put("daysAgo", String.valueOf(daysAgo));
                emailService.sendTemplateEmail(reviewer.getEmail(), "REVIEW_REMINDER", variables);
            } catch (Exception e) {
                System.err.println("Failed to send review reminder email to " + reviewer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendSystemNotificationEmail(User user, String subject, String message) {
        if (shouldSendEmail(user.getId(), "emailSystemNotifications")) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("firstName", user.getFirstName());
                variables.put("subject", subject);
                variables.put("message", message);
                emailService.sendTemplateEmail(user.getEmail(), "SYSTEM_NOTIFICATION", variables);
            } catch (Exception e) {
                System.err.println("Failed to send system notification email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }

    public void sendContractCreatedEmail(User freelancer, String clientName, String projectTitle) {
        if (shouldSendEmail(freelancer.getId(), "emailNewProposals")) {
            try {
                emailService.sendContractCreatedEmail(freelancer, clientName, projectTitle);
            } catch (Exception e) {
                System.err.println("Failed to send contract created email to " + freelancer.getEmail() + ": " + e.getMessage());
            }
        }
    }

    private boolean shouldSendEmail(UUID userId, String settingKey) {
        try {
            Optional<NotificationSettings> settings = notificationSettingsRepository.findById(userId);
            
            if (settings.isEmpty()) {
                return true;
            }

            NotificationSettings notificationSettings = settings.get();
            
            switch (settingKey) {
                case "emailNewProposals":
                    return notificationSettings.getEmailNewProposals() != null && 
                           notificationSettings.getEmailNewProposals() &&
                           isFrequencyAllowed(notificationSettings.getEmailFrequency());
                case "emailNewMessages":
                    return notificationSettings.getEmailNewMessages() != null && 
                           notificationSettings.getEmailNewMessages() &&
                           isFrequencyAllowed(notificationSettings.getEmailFrequency());
                case "emailPayments":
                    return notificationSettings.getEmailPayments() != null && 
                           notificationSettings.getEmailPayments() &&
                           isFrequencyAllowed(notificationSettings.getEmailFrequency());
                case "emailNewReviews":
                    return notificationSettings.getEmailNewReviews() != null && 
                           notificationSettings.getEmailNewReviews() &&
                           isFrequencyAllowed(notificationSettings.getEmailFrequency());
                case "emailSystemNotifications":
                    return notificationSettings.getEmailSystemNotifications() != null && 
                           notificationSettings.getEmailSystemNotifications() &&
                           isFrequencyAllowed(notificationSettings.getEmailFrequency());
                case "emailMarketingEmails":
                    return notificationSettings.getEmailMarketingEmails() != null && 
                           notificationSettings.getEmailMarketingEmails() &&
                           isFrequencyAllowed(notificationSettings.getEmailFrequency());
                default:
                    return false;
            }
        } catch (Exception e) {
            System.err.println("Error checking notification settings for user " + userId + ": " + e.getMessage());
            return false;
        }
    }

    private boolean isFrequencyAllowed(NotificationSettings.EmailFrequency frequency) {
        if (frequency == null) {
            return true;
        }
        return !frequency.equals(NotificationSettings.EmailFrequency.NEVER);
    }
}
