package com.freelance.platform.bootstrap;

import com.freelance.platform.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class EmailTemplateInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(EmailTemplateInitializer.class);

    private final EmailService emailService;

    public EmailTemplateInitializer(EmailService emailService) {
        this.emailService = emailService;
    }

    @Override
    public void run(String... args) {
        try {
            logger.info("Initializing default email templates...");
            emailService.createDefaultEmailTemplates();
            logger.info("Email templates initialized successfully");
        } catch (Exception e) {
            logger.error("Failed to initialize email templates", e);
        }
    }
}
