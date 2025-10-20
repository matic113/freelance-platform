package com.freelance.platform.service;

import com.freelance.platform.entity.EmailTemplate;
import com.freelance.platform.entity.Notification;
import com.freelance.platform.entity.TemplateType;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.EmailTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;


    @Autowired
    private EmailTemplateRepository emailTemplateRepository;

    @Value("${app.email.from-address:noreply@freelanceplatform.local}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private String loadHtmlTemplate(String filename) {
        try {
            String filePath = "email-templates/" + filename;
            ClassPathResource resource = new ClassPathResource(filePath);
            return new String(Files.readAllBytes(Paths.get(resource.getFile().getAbsolutePath())), 
                    StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load email template: " + filename, e);
        }
    }

    private Map<String, String> getTemplateMetadata(String templateKey) {
        Map<String, String> metadata = new HashMap<>();
        
        switch(templateKey) {
            case "PROPOSAL_RECEIVED":
                metadata.put("file", "proposal-received.html");
                metadata.put("subject", "New Proposal Received");
                break;
            case "PROPOSAL_ACCEPTED":
                metadata.put("file", "proposal-accepted.html");
                metadata.put("subject", "Proposal Accepted!");
                break;
            case "PROPOSAL_REJECTED":
                metadata.put("file", "proposal-rejected.html");
                metadata.put("subject", "Proposal Not Accepted");
                break;
            case "CONTRACT_CREATED":
                metadata.put("file", "contract-created.html");
                metadata.put("subject", "New Contract Created");
                break;
            case "PAYMENT_REQUEST":
                metadata.put("file", "payment-request.html");
                metadata.put("subject", "Payment Request Received");
                break;
            case "PAYMENT_APPROVED":
                metadata.put("file", "payment-approved.html");
                metadata.put("subject", "Payment Approved");
                break;
            case "PAYMENT_RECEIVED":
                metadata.put("file", "payment-received.html");
                metadata.put("subject", "Payment Received");
                break;
            case "NEW_MESSAGE":
                metadata.put("file", "new-message.html");
                metadata.put("subject", "New Message Received");
                break;
            case "NEW_REVIEW":
                metadata.put("file", "new-review.html");
                metadata.put("subject", "You Received a New Review");
                break;
            default:
                return null;
        }
        
        return metadata;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendTemplateEmail(String to, String templateKey, Map<String, Object> variables) {
        Map<String, String> metadata = getTemplateMetadata(templateKey);
        
        if (metadata != null) {
            try {
                String htmlContent = loadHtmlTemplate(metadata.get("file"));
                String subject = metadata.get("subject");
                
                htmlContent = replaceTemplateVariables(htmlContent, variables);
                subject = replaceTemplateVariables(subject, variables);
                
                sendHtmlEmail(to, subject, htmlContent);
                return;
            } catch (Exception e) {
                System.err.println("Warning: Failed to load file-based template " + templateKey + ": " + e.getMessage());
            }
        }
        
        EmailTemplate template = emailTemplateRepository.findByTemplateKey(templateKey)
                .orElseThrow(() -> new RuntimeException("Email template not found: " + templateKey));

        if (!template.getIsActive()) {
            throw new RuntimeException("Email template is not active: " + templateKey);
        }

        String htmlContent = replaceTemplateVariables(template.getHtmlContent(), variables);
        String subject = replaceTemplateVariables(template.getSubject(), variables);

        sendHtmlEmail(to, subject, htmlContent);
    }

    public void sendWelcomeEmail(User user) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", user.getFirstName());
        variables.put("lastName", user.getLastName());
        variables.put("email", user.getEmail());
        variables.put("userType", user.getRoles().toString());
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(user.getEmail(), "WELCOME", variables);
    }

    public void sendEmailVerificationEmail(User user, String verificationToken) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", user.getFirstName());
        variables.put("verificationToken", verificationToken);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(user.getEmail(), "EMAIL_VERIFICATION", variables);
    }

    public void sendPasswordResetEmail(User user, String resetToken) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", user.getFirstName());
        variables.put("resetToken", resetToken);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(user.getEmail(), "PASSWORD_RESET", variables);
    }

    public void sendNotificationEmail(Notification notification) {
        User user = notification.getUser();
        
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", user.getFirstName());
        variables.put("notificationTitle", notification.getTitle());
        variables.put("notificationMessage", notification.getMessage());
        variables.put("notificationType", notification.getType());
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(user.getEmail(), "NOTIFICATION", variables);
    }

    public void sendProposalReceivedEmail(User client, String freelancerName, String projectTitle) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", client.getFirstName());
        variables.put("freelancerName", freelancerName);
        variables.put("projectTitle", projectTitle);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(client.getEmail(), "PROPOSAL_RECEIVED", variables);
    }

    public void sendProposalAcceptedEmail(User freelancer, String clientName, String projectTitle) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", freelancer.getFirstName());
        variables.put("clientName", clientName);
        variables.put("projectTitle", projectTitle);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(freelancer.getEmail(), "PROPOSAL_ACCEPTED", variables);
    }

    public void sendContractCreatedEmail(User freelancer, String clientName, String projectTitle) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", freelancer.getFirstName());
        variables.put("clientName", clientName);
        variables.put("projectTitle", projectTitle);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(freelancer.getEmail(), "CONTRACT_CREATED", variables);
    }

    public void sendPaymentRequestEmail(User client, String freelancerName, String amount, String currency) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", client.getFirstName());
        variables.put("freelancerName", freelancerName);
        variables.put("amount", amount);
        variables.put("currency", currency);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(client.getEmail(), "PAYMENT_REQUEST", variables);
    }

    public void sendPaymentReceivedEmail(User freelancer, String clientName, String amount, String currency) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("firstName", freelancer.getFirstName());
        variables.put("clientName", clientName);
        variables.put("amount", amount);
        variables.put("currency", currency);
        variables.put("frontendUrl", frontendUrl);

        sendTemplateEmail(freelancer.getEmail(), "PAYMENT_RECEIVED", variables);
    }

    public void sendNewMessageEmail(User recipient, String senderName, String projectTitle) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", recipient.getFirstName());
         variables.put("senderName", senderName);
         variables.put("projectTitle", projectTitle);
         variables.put("frontendUrl", frontendUrl);

         sendTemplateEmail(recipient.getEmail(), "NEW_MESSAGE", variables);
     }

     public void sendPaymentApprovedEmail(User freelancer, String amount, String currency) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", freelancer.getFirstName());
         variables.put("amount", amount);
         variables.put("currency", currency);
         variables.put("frontendUrl", frontendUrl);

         sendTemplateEmail(freelancer.getEmail(), "PAYMENT_APPROVED", variables);
     }

     public void sendNewReviewEmail(User reviewee, String reviewerName, int rating) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", reviewee.getFirstName());
         variables.put("reviewerName", reviewerName);
         variables.put("rating", String.valueOf(rating));
         variables.put("frontendUrl", frontendUrl);

         sendTemplateEmail(reviewee.getEmail(), "NEW_REVIEW", variables);
     }

     public void sendContractAcceptedEmail(User client, String freelancerName, String projectTitle) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", client.getFirstName());
         variables.put("freelancerName", freelancerName);
         variables.put("projectTitle", projectTitle);
         variables.put("frontendUrl", frontendUrl);

         sendTemplateEmail(client.getEmail(), "CONTRACT_ACCEPTED", variables);
     }

     public void sendContractRejectedEmail(User client, String freelancerName, String projectTitle) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", client.getFirstName());
         variables.put("freelancerName", freelancerName);
         variables.put("projectTitle", projectTitle);
         variables.put("frontendUrl", frontendUrl);

         sendTemplateEmail(client.getEmail(), "CONTRACT_REJECTED", variables);
     }

     public void sendMilestoneCompletedEmail(User recipient, String otherPartyName, String milestoneTitle, String projectTitle, String amount, String currency) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", recipient.getFirstName());
         variables.put("otherPartyName", otherPartyName);
         variables.put("milestoneTitle", milestoneTitle);
         variables.put("projectTitle", projectTitle);
         variables.put("amount", amount);
         variables.put("currency", currency);
         variables.put("frontendUrl", frontendUrl);

         sendTemplateEmail(recipient.getEmail(), "MILESTONE_COMPLETED", variables);
     }

     public void sendProjectCompletedEmail(User user, String otherPartyName, String projectTitle, String userType, String otherPartyType) {
         Map<String, Object> variables = new HashMap<>();
         variables.put("firstName", user.getFirstName());
         variables.put("otherPartyName", otherPartyName);
         variables.put("projectTitle", projectTitle);
         variables.put("frontendUrl", frontendUrl);
         variables.put("isClient", "CLIENT".equals(userType) ? "true" : "false");
         variables.put("isFreelancer", "FREELANCER".equals(userType) ? "true" : "false");
         variables.put("otherPartyType", otherPartyType);

         sendTemplateEmail(user.getEmail(), "PROJECT_COMPLETED", variables);
     }

     private String replaceTemplateVariables(String template, Map<String, Object> variables) {
         if (template == null || variables == null) {
             return template;
         }

         String result = template;
         for (Map.Entry<String, Object> entry : variables.entrySet()) {
             String placeholder = "{{" + entry.getKey() + "}}";
             String value = entry.getValue() != null ? entry.getValue().toString() : "";
             result = result.replace(placeholder, value);
         }

         return result;
     }

    public void createDefaultEmailTemplates() {
        createTemplateIfNotExists("WELCOME", "Welcome to Freelancer Platform", 
                "<h1>Welcome {{firstName}}!</h1><p>Thank you for joining our platform.</p>");
        
        createTemplateIfNotExists("EMAIL_VERIFICATION", "Verify Your Email Address", 
                "<h1>Verify Your Email</h1><p>Please click <a href=\"{{frontendUrl}}/verify-email?token={{verificationToken}}\">here</a> to verify your email.</p>");
        
        createTemplateIfNotExists("PASSWORD_RESET", "Reset Your Password", 
                "<h1>Reset Your Password</h1><p>Please click <a href=\"{{frontendUrl}}/reset-password?token={{resetToken}}\">here</a> to reset your password.</p>");
        
        createTemplateIfNotExists("NOTIFICATION", "{{notificationTitle}}", 
                "<h1>{{notificationTitle}}</h1><p>{{notificationMessage}}</p>");
        
         try {
             createTemplateIfNotExists("PROPOSAL_RECEIVED", "New Proposal Received", 
                     loadHtmlTemplate("proposal-received.html"));
             
             createTemplateIfNotExists("PROPOSAL_ACCEPTED", "Proposal Accepted!", 
                     loadHtmlTemplate("proposal-accepted.html"));
             
             createTemplateIfNotExists("CONTRACT_CREATED", "New Contract Created", 
                     loadHtmlTemplate("contract-created.html"));
             
             createTemplateIfNotExists("CONTRACT_ACCEPTED", "Contract Accepted!", 
                     loadHtmlTemplate("contract-accepted.html"));
             
             createTemplateIfNotExists("CONTRACT_REJECTED", "Contract Rejected", 
                     loadHtmlTemplate("contract-rejected.html"));
             
             createTemplateIfNotExists("MILESTONE_COMPLETED", "Milestone Completed!", 
                     loadHtmlTemplate("milestone-completed.html"));
             
             createTemplateIfNotExists("PROJECT_COMPLETED", "Project Completed!", 
                     loadHtmlTemplate("project-completed.html"));
             
             createTemplateIfNotExists("PAYMENT_REQUEST", "Payment Request Received", 
                     loadHtmlTemplate("payment-request.html"));
             
             createTemplateIfNotExists("PAYMENT_RECEIVED", "Payment Received", 
                     loadHtmlTemplate("payment-received.html"));
             
             createTemplateIfNotExists("NEW_MESSAGE", "New Message Received", 
                     loadHtmlTemplate("new-message.html"));
             
             createTemplateIfNotExists("PROPOSAL_REJECTED", "Proposal Not Accepted", 
                     loadHtmlTemplate("proposal-rejected.html"));
             
             createTemplateIfNotExists("PAYMENT_APPROVED", "Payment Approved", 
                     loadHtmlTemplate("payment-approved.html"));
             
             createTemplateIfNotExists("NEW_REVIEW", "You Received a New Review", 
                     loadHtmlTemplate("new-review.html"));
             
             createTemplateIfNotExists("SYSTEM_NOTIFICATION", "{{subject}}", 
                     "<h1>{{subject}}</h1><p>{{message}}</p>");
         } catch (Exception e) {
             System.err.println("Warning: Failed to load some email templates from files: " + e.getMessage());
             createBackupTemplates();
         }
    }

     private void createBackupTemplates() {
         createTemplateIfNotExists("PROPOSAL_RECEIVED", "New Proposal Received", 
                 "<h1>New Proposal Received</h1><p>{{freelancerName}} has submitted a proposal for your project: {{projectTitle}}</p>");
         
         createTemplateIfNotExists("PROPOSAL_ACCEPTED", "Proposal Accepted!", 
                 "<h1>Congratulations!</h1><p>Your proposal for project {{projectTitle}} has been accepted by {{clientName}}.</p>");
         
         createTemplateIfNotExists("CONTRACT_CREATED", "New Contract Created", 
                 "<h1>New Contract Created</h1><p>{{clientName}} has created a contract for project: {{projectTitle}}</p>");
         
         createTemplateIfNotExists("CONTRACT_ACCEPTED", "Contract Accepted!", 
                 "<h1>Contract Accepted!</h1><p>{{freelancerName}} has accepted your contract for project: {{projectTitle}}</p>");
         
         createTemplateIfNotExists("CONTRACT_REJECTED", "Contract Rejected", 
                 "<h1>Contract Rejected</h1><p>Unfortunately, {{freelancerName}} has rejected your contract for project: {{projectTitle}}</p>");
         
         createTemplateIfNotExists("MILESTONE_COMPLETED", "Milestone Completed!", 
                 "<h1>Milestone Completed!</h1><p>{{otherPartyName}} has completed the milestone '{{milestoneTitle}}' for {{amount}} {{currency}} on project: {{projectTitle}}</p>");
         
         createTemplateIfNotExists("PROJECT_COMPLETED", "Project Completed!", 
                 "<h1>Project Completed!</h1><p>Congratulations! All milestones for project '{{projectTitle}}' have been successfully completed and paid.</p>");
         
         createTemplateIfNotExists("PAYMENT_REQUEST", "Payment Request Received", 
                 "<h1>Payment Request</h1><p>{{freelancerName}} has requested payment of {{amount}} {{currency}}.</p>");
         
         createTemplateIfNotExists("PAYMENT_RECEIVED", "Payment Received", 
                 "<h1>Payment Received</h1><p>You have received a payment of {{amount}} {{currency}} from {{clientName}}.</p>");
         
         createTemplateIfNotExists("NEW_MESSAGE", "New Message Received", 
                 "<h1>New Message</h1><p>You have received a new message from {{senderName}} regarding project: {{projectTitle}}</p>");
         
         createTemplateIfNotExists("PROPOSAL_REJECTED", "Proposal Not Accepted", 
                 "<h1>Proposal Update</h1><p>Unfortunately, your proposal for project {{projectTitle}} was not accepted at this time.</p>");
         
         createTemplateIfNotExists("PAYMENT_APPROVED", "Payment Approved", 
                 "<h1>Payment Approved!</h1><p>Your payment request of {{amount}} {{currency}} has been approved.</p>");
         
         createTemplateIfNotExists("NEW_REVIEW", "You Received a New Review", 
                 "<h1>New Review</h1><p>{{reviewerName}} has left you a {{rating}}-star review.</p>");
         
         createTemplateIfNotExists("SYSTEM_NOTIFICATION", "{{subject}}", 
                 "<h1>{{subject}}</h1><p>{{message}}</p>");
     }

    private void createTemplateIfNotExists(String templateKey, String subject, String htmlContent) {
        if (!emailTemplateRepository.existsByTemplateKey(templateKey)) {
            EmailTemplate template = new EmailTemplate();
            template.setTemplateKey(templateKey);
            template.setSubject(subject);
            template.setHtmlContent(htmlContent);
            template.setTemplateType(TemplateType.SYSTEM);
            template.setLanguage("en");
            template.setIsActive(true);
            
            emailTemplateRepository.save(template);
        }
    }
}
