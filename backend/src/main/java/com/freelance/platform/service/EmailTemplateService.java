package com.freelance.platform.service;

import jakarta.annotation.PreDestroy;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class EmailTemplateService {

    private static final Logger logger = LoggerFactory.getLogger(EmailTemplateService.class);
    private static final Pattern TITLE_PATTERN = Pattern.compile("<title>(.*?)</title>", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
    private static final String DEFAULT_TEMPLATE_LANGUAGE = "en";

    private final ExecutorService emailExecutor = Executors.newFixedThreadPool(2);
    private final Map<String, TemplateDescriptor> templateCache = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ResourceLoader resourceLoader;

    @Value("${app.email.from-address:noreply@freelanceplatform.local}")
    private String fromEmail;

    @Value("${app.email.templates.base-path:classpath:email-templates/}")
    private String templatesBasePath;

    @Value("${app.email.default-subject:Notification}")
    private String defaultSubject;

    @Value("${app.platform.name:Freelancer Platform}")
    private String platformName;

    public void sendEmail(String to, String subject, String content, boolean isHtml) {
        emailExecutor.submit(() -> {
            try {
                if (isHtml) {
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
                    helper.setFrom(fromEmail);
                    helper.setTo(to);
                    helper.setSubject(subject);
                    helper.setText(content, true);
                    mailSender.send(message);
                } else {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setFrom(fromEmail);
                    message.setTo(to);
                    message.setSubject(subject);
                    message.setText(content);
                    mailSender.send(message);
                }
            } catch (Exception e) {
                logger.error("Failed to send email to {}: {}", to, e.getMessage());
            }
        });
    }

    public void sendTemplateEmail(String to, String templateKey, String language, Map<String, Object> variables) {
        TemplateDescriptor template = resolveTemplate(templateKey, language);
        String subject = replaceVariables(template.subject(), variables);
        String content = replaceVariables(template.htmlContent(), variables);
        sendEmail(to, subject, content, true);
    }

    public void sendOtpEmail(String to, String otp, String language) {
    Map<String, Object> variables = Map.of(
        "otp", otp,
        "platformName", platformName
    );

        emailExecutor.submit(() -> {
            try {
                sendTemplateEmail(to, "otp", language, variables);
            } catch (RuntimeException e) {
                String subject = "Your verification code";
                String content = "<p>Your verification code is: <strong>" + otp + "</strong></p>" +
                        "<p>This code will expire in 10 minutes.</p>";
                try {
                    sendEmail(to, subject, content, true);
                } catch (Exception ex) {
                    logger.error("Failed to send fallback OTP email to {}: {}", to, ex.getMessage());
                }
            }
        });
    }

    public void sendEmailVerification(String to, String otp, String language) {
        Map<String, Object> variables = Map.of(
                "otp", otp,
                "platformName", platformName
        );

        emailExecutor.submit(() -> {
            try {
                sendTemplateEmail(to, "email-verification", language, variables);
            } catch (RuntimeException e) {
                String subject = "Verify your email";
                String content = "<p>Welcome to " + platformName + "!</p>" +
                        "<p>Your email verification code is: <strong>" + otp + "</strong></p>" +
                        "<p>This code expires in 10 minutes. Enter it in the signup screen to finish creating your account.</p>" +
                        "<p>If you did not request this, you can ignore this email.</p>";
                try {
                    sendEmail(to, subject, content, true);
                } catch (Exception ex) {
                    logger.error("Failed to send fallback verification email to {}: {}", to, ex.getMessage());
                }
            }
        });
    }

    private TemplateDescriptor resolveTemplate(String templateKey, String language) {
        String normalizedKey = Objects.requireNonNull(templateKey, "templateKey must not be null").trim();
        String normalizedLanguage = (language == null || language.isBlank())
                ? DEFAULT_TEMPLATE_LANGUAGE
                : language.trim().toLowerCase(Locale.ROOT);
        String cacheKey = normalizedKey + "::" + normalizedLanguage;

        return templateCache.computeIfAbsent(cacheKey, key -> loadTemplate(normalizedKey, normalizedLanguage));
    }

    private TemplateDescriptor loadTemplate(String templateKey, String language) {
        List<String> candidates = buildTemplateCandidates(templateKey, language);
        String basePath = ensureTrailingSlash(templatesBasePath);

        for (String candidate : candidates) {
            Resource resource = resourceLoader.getResource(basePath + candidate);
            if (resource.exists()) {
                try (InputStream inputStream = resource.getInputStream()) {
                    String htmlContent = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
                    String subject = extractSubject(htmlContent);
                    if (subject == null || subject.isBlank()) {
                        subject = defaultSubject;
                    }
                    return new TemplateDescriptor(subject, htmlContent);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to load email template '" + templateKey + "'", e);
                }
            }
        }

        throw new RuntimeException("Email template not found: " + templateKey + " (language=" + language + ")");
    }

    private List<String> buildTemplateCandidates(String templateKey, String language) {
        List<String> candidates = new ArrayList<>();
        if (language != null && !language.isBlank()) {
            candidates.add(templateKey + "." + language + ".html");
            candidates.add(templateKey + "_" + language + ".html");
        }
        candidates.add(templateKey + ".html");
        return candidates;
    }

    private String ensureTrailingSlash(String path) {
        if (path == null || path.isBlank()) {
            return "classpath:email-templates/";
        }
        return path.endsWith("/") ? path : path + "/";
    }

    private String replaceVariables(String template, Map<String, Object> variables) {
        if (template == null || variables == null || variables.isEmpty()) {
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

    private String extractSubject(String htmlContent) {
        if (htmlContent == null) {
            return null;
        }
        Matcher matcher = TITLE_PATTERN.matcher(htmlContent);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    @PreDestroy
    public void shutdownExecutor() {
        emailExecutor.shutdown();
        try {
            if (!emailExecutor.awaitTermination(5, TimeUnit.SECONDS)) {
                emailExecutor.shutdownNow();
            }
        } catch (InterruptedException e) {
            emailExecutor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    private static final class TemplateDescriptor {
        private final String subject;
        private final String htmlContent;

        private TemplateDescriptor(String subject, String htmlContent) {
            this.subject = subject;
            this.htmlContent = htmlContent;
        }

        private String subject() {
            return subject;
        }

        private String htmlContent() {
            return htmlContent;
        }
    }
}
