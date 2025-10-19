package com.freelance.platform.util;

import java.util.regex.Pattern;

public class EmailUtil {
    
    // Email validation regex pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );
    
    // Common email domains for validation
    private static final String[] COMMON_EMAIL_DOMAINS = {
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
        "aol.com", "live.com", "msn.com", "comcast.net", "verizon.net"
    };
    
    // Disposable email domains (should be blocked)
    private static final String[] DISPOSABLE_EMAIL_DOMAINS = {
        "10minutemail.com", "tempmail.org", "guerrillamail.com", "mailinator.com",
        "throwaway.email", "temp-mail.org", "getnada.com", "maildrop.cc"
    };
    
    /**
     * Validates email format
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        email = email.trim().toLowerCase();
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Validates email and checks for disposable domains
     */
    public static boolean isValidBusinessEmail(String email) {
        if (!isValidEmail(email)) {
            return false;
        }
        
        String domain = getEmailDomain(email);
        return !isDisposableEmailDomain(domain);
    }
    
    /**
     * Extracts domain from email address
     */
    public static String getEmailDomain(String email) {
        if (email == null || !email.contains("@")) {
            return "";
        }
        return email.substring(email.lastIndexOf("@") + 1).toLowerCase();
    }
    
    /**
     * Checks if email domain is disposable
     */
    public static boolean isDisposableEmailDomain(String domain) {
        if (domain == null || domain.isEmpty()) {
            return true;
        }
        
        domain = domain.toLowerCase();
        for (String disposableDomain : DISPOSABLE_EMAIL_DOMAINS) {
            if (domain.equals(disposableDomain)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Checks if email domain is common
     */
    public static boolean isCommonEmailDomain(String domain) {
        if (domain == null || domain.isEmpty()) {
            return false;
        }
        
        domain = domain.toLowerCase();
        for (String commonDomain : COMMON_EMAIL_DOMAINS) {
            if (domain.equals(commonDomain)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Masks email address for display (e.g., j***@gmail.com)
     */
    public static String maskEmail(String email) {
        if (email == null || !isValidEmail(email)) {
            return email;
        }
        
        String[] parts = email.split("@");
        if (parts.length != 2) {
            return email;
        }
        
        String username = parts[0];
        String domain = parts[1];
        
        if (username.length() <= 2) {
            return "*".repeat(username.length()) + "@" + domain;
        }
        
        String maskedUsername = username.charAt(0) + "*".repeat(username.length() - 2) + username.charAt(username.length() - 1);
        return maskedUsername + "@" + domain;
    }
    
    /**
     * Formats email for display
     */
    public static String formatEmailForDisplay(String email) {
        if (email == null) {
            return "";
        }
        return email.trim().toLowerCase();
    }
    
    /**
     * Generates email verification token
     */
    public static String generateEmailVerificationToken(String email) {
        if (email == null) {
            return "";
        }
        
        String timestamp = String.valueOf(System.currentTimeMillis());
        String hash = String.valueOf(email.hashCode());
        return timestamp + "_" + hash;
    }
    
    /**
     * Validates email verification token
     */
    public static boolean isValidEmailVerificationToken(String token, String email) {
        if (token == null || email == null) {
            return false;
        }
        
        String expectedToken = generateEmailVerificationToken(email);
        return token.equals(expectedToken);
    }
    
    /**
     * Extracts username from email
     */
    public static String getEmailUsername(String email) {
        if (email == null || !email.contains("@")) {
            return "";
        }
        return email.substring(0, email.lastIndexOf("@"));
    }
    
    /**
     * Checks if email is from a corporate domain
     */
    public static boolean isCorporateEmail(String email) {
        if (!isValidEmail(email)) {
            return false;
        }
        
        String domain = getEmailDomain(email);
        return !isCommonEmailDomain(domain) && !isDisposableEmailDomain(domain);
    }
    
    /**
     * Normalizes email address
     */
    public static String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }
        
        email = email.trim().toLowerCase();
        
        // Remove dots from Gmail addresses
        if (email.endsWith("@gmail.com")) {
            String username = getEmailUsername(email);
            username = username.replace(".", "");
            email = username + "@gmail.com";
        }
        
        return email;
    }
}
