package com.freelance.platform.util;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;
import java.util.regex.Pattern;

public class SecurityUtil {
    
    // Password strength patterns
    private static final Pattern WEAK_PASSWORD_PATTERN = Pattern.compile("^.{1,7}$");
    private static final Pattern MEDIUM_PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");
    private static final Pattern STRONG_PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$");
    
    // Common weak passwords
    private static final String[] COMMON_PASSWORDS = {
        "password", "123456", "123456789", "qwerty", "abc123", "password123",
        "admin", "letmein", "welcome", "monkey", "1234567890", "password1",
        "qwerty123", "dragon", "master", "hello", "freedom", "whatever",
        "qazwsx", "trustno1", "jordan", "jennifer", "zxcvbnm", "asdfgh",
        "hunter", "buster", "soccer", "harley", "batman", "andrew",
        "tigger", "sunshine", "iloveyou", "2000", "charlie", "robert",
        "thomas", "hockey", "ranger", "daniel", "hannah", "maggie",
        "jessica", "charlotte", "michelle", "kimberly", "jennifer", "joshua"
    };
    
    // Secure random instance
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    
    /**
     * Generates a secure random token
     */
    public static String generateSecureToken(int length) {
        byte[] bytes = new byte[length];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    
    /**
     * Generates a UUID token
     */
    public static String generateUUIDToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
    
    /**
     * Generates a random string with specified length
     */
    public static String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(SECURE_RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    /**
     * Generates a random numeric string
     */
    public static String generateRandomNumericString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(SECURE_RANDOM.nextInt(10));
        }
        return sb.toString();
    }
    
    /**
     * Generates a random alphanumeric string
     */
    public static String generateRandomAlphanumericString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(SECURE_RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    /**
     * Generates a secure password
     */
    public static String generateSecurePassword(int length) {
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        
        StringBuilder password = new StringBuilder(length);
        
        // Ensure at least one character from each category
        password.append(uppercase.charAt(SECURE_RANDOM.nextInt(uppercase.length())));
        password.append(lowercase.charAt(SECURE_RANDOM.nextInt(lowercase.length())));
        password.append(numbers.charAt(SECURE_RANDOM.nextInt(numbers.length())));
        password.append(symbols.charAt(SECURE_RANDOM.nextInt(symbols.length())));
        
        // Fill the rest randomly
        String allChars = uppercase + lowercase + numbers + symbols;
        for (int i = 4; i < length; i++) {
            password.append(allChars.charAt(SECURE_RANDOM.nextInt(allChars.length())));
        }
        
        // Shuffle the password
        return shuffleString(password.toString());
    }
    
    /**
     * Shuffles a string
     */
    private static String shuffleString(String str) {
        char[] chars = str.toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = SECURE_RANDOM.nextInt(i + 1);
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return new String(chars);
    }
    
    /**
     * Checks password strength
     */
    public static PasswordStrength checkPasswordStrength(String password) {
        if (password == null || password.isEmpty()) {
            return PasswordStrength.EMPTY;
        }
        
        if (WEAK_PASSWORD_PATTERN.matcher(password).matches()) {
            return PasswordStrength.WEAK;
        }
        
        if (STRONG_PASSWORD_PATTERN.matcher(password).matches()) {
            return PasswordStrength.STRONG;
        }
        
        if (MEDIUM_PASSWORD_PATTERN.matcher(password).matches()) {
            return PasswordStrength.MEDIUM;
        }
        
        return PasswordStrength.WEAK;
    }
    
    /**
     * Checks if password is common/weak
     */
    public static boolean isCommonPassword(String password) {
        if (password == null) {
            return true;
        }
        
        String lowerPassword = password.toLowerCase();
        for (String commonPassword : COMMON_PASSWORDS) {
            if (lowerPassword.equals(commonPassword)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Validates password meets security requirements
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        PasswordStrength strength = checkPasswordStrength(password);
        return strength == PasswordStrength.MEDIUM || strength == PasswordStrength.STRONG;
    }
    
    /**
     * Generates a secure session ID
     */
    public static String generateSessionId() {
        return generateSecureToken(32);
    }
    
    /**
     * Generates a secure API key
     */
    public static String generateApiKey() {
        return generateSecureToken(64);
    }
    
    /**
     * Generates a secure refresh token
     */
    public static String generateRefreshToken() {
        return generateSecureToken(128);
    }
    
    /**
     * Generates a secure verification code
     */
    public static String generateVerificationCode(int length) {
        return generateRandomNumericString(length);
    }
    
    /**
     * Generates a secure OTP (One-Time Password)
     */
    public static String generateOTP(int length) {
        return generateRandomNumericString(length);
    }
    
    /**
     * Masks sensitive data for logging
     */
    public static String maskSensitiveData(String data) {
        if (data == null || data.length() < 4) {
            return "***";
        }
        
        if (data.length() <= 8) {
            return data.substring(0, 2) + "***" + data.substring(data.length() - 2);
        }
        
        return data.substring(0, 4) + "***" + data.substring(data.length() - 4);
    }
    
    /**
     * Masks email address
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        
        String[] parts = email.split("@");
        String username = parts[0];
        String domain = parts[1];
        
        if (username.length() <= 2) {
            return "*".repeat(username.length()) + "@" + domain;
        }
        
        return username.charAt(0) + "*".repeat(username.length() - 2) + username.charAt(username.length() - 1) + "@" + domain;
    }
    
    /**
     * Masks phone number
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return "***";
        }
        
        if (phone.length() <= 8) {
            return phone.substring(0, 2) + "***" + phone.substring(phone.length() - 2);
        }
        
        return phone.substring(0, 3) + "***" + phone.substring(phone.length() - 3);
    }
    
    /**
     * Masks credit card number
     */
    public static String maskCreditCard(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 8) {
            return "***";
        }
        
        String cleanNumber = cardNumber.replaceAll("\\s+", "");
        if (cleanNumber.length() < 8) {
            return "***";
        }
        
        return cleanNumber.substring(0, 4) + " " + "*".repeat(4) + " " + "*".repeat(4) + " " + cleanNumber.substring(cleanNumber.length() - 4);
    }
    
    /**
     * Generates a secure hash salt
     */
    public static String generateSalt() {
        return generateSecureToken(16);
    }
    
    /**
     * Generates a secure nonce
     */
    public static String generateNonce() {
        return generateSecureToken(16);
    }
    
    /**
     * Generates a secure CSRF token
     */
    public static String generateCSRFToken() {
        return generateSecureToken(32);
    }
    
    /**
     * Validates CSRF token format
     */
    public static boolean isValidCSRFToken(String token) {
        if (token == null || token.length() != 32) {
            return false;
        }
        return token.matches("^[A-Za-z0-9+/=]+$");
    }
    
    /**
     * Generates a secure file upload token
     */
    public static String generateFileUploadToken() {
        return generateSecureToken(24);
    }
    
    /**
     * Generates a secure password reset token
     */
    public static String generatePasswordResetToken() {
        return generateSecureToken(32);
    }
    
    /**
     * Generates a secure email verification token
     */
    public static String generateEmailVerificationToken() {
        return generateSecureToken(32);
    }
    
    /**
     * Password strength enum
     */
    public enum PasswordStrength {
        EMPTY, WEAK, MEDIUM, STRONG
    }
}
