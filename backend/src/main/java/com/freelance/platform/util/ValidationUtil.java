package com.freelance.platform.util;

import java.util.regex.Pattern;
import java.util.UUID;

public class ValidationUtil {
    
    // Common regex patterns
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[+]?[1-9]\\d{1,14}$"
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    
    private static final Pattern USERNAME_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_]{3,20}$"
    );
    
    private static final Pattern NAME_PATTERN = Pattern.compile(
        "^[a-zA-Z\\s]{2,50}$"
    );
    
    private static final Pattern NAME_ARABIC_PATTERN = Pattern.compile(
        "^[\\u0600-\\u06FF\\s]{2,50}$"
    );
    
    private static final Pattern URL_PATTERN = Pattern.compile(
        "^(https?://)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([/\\w \\.-]*)*/?$"
    );
    
    private static final Pattern UUID_PATTERN = Pattern.compile(
        "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
    );
    
    /**
     * Validates email format
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }
    
    /**
     * Validates phone number format
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone.trim()).matches();
    }
    
    /**
     * Validates password strength
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        return PASSWORD_PATTERN.matcher(password).matches();
    }
    
    /**
     * Validates username format
     */
    public static boolean isValidUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return USERNAME_PATTERN.matcher(username.trim()).matches();
    }
    
    /**
     * Validates name format (English)
     */
    public static boolean isValidName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        return NAME_PATTERN.matcher(name.trim()).matches();
    }
    
    /**
     * Validates Arabic name format
     */
    public static boolean isValidArabicName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return false;
        }
        return NAME_ARABIC_PATTERN.matcher(name.trim()).matches();
    }
    
    /**
     * Validates URL format
     */
    public static boolean isValidUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }
        return URL_PATTERN.matcher(url.trim()).matches();
    }
    
    /**
     * Validates UUID format
     */
    public static boolean isValidUUID(String uuid) {
        if (uuid == null || uuid.trim().isEmpty()) {
            return false;
        }
        return UUID_PATTERN.matcher(uuid.trim()).matches();
    }
    
    /**
     * Validates UUID object
     */
    public static boolean isValidUUID(UUID uuid) {
        return uuid != null;
    }
    
    /**
     * Validates string is not null or empty
     */
    public static boolean isNotNullOrEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }
    
    /**
     * Validates string length is within range
     */
    public static boolean isValidLength(String str, int minLength, int maxLength) {
        if (str == null) {
            return false;
        }
        int length = str.trim().length();
        return length >= minLength && length <= maxLength;
    }
    
    /**
     * Validates numeric range
     */
    public static boolean isValidRange(int value, int min, int max) {
        return value >= min && value <= max;
    }
    
    /**
     * Validates numeric range for double
     */
    public static boolean isValidRange(double value, double min, double max) {
        return value >= min && value <= max;
    }
    
    /**
     * Validates positive number
     */
    public static boolean isPositive(Number number) {
        return number != null && number.doubleValue() > 0;
    }
    
    /**
     * Validates non-negative number
     */
    public static boolean isNonNegative(Number number) {
        return number != null && number.doubleValue() >= 0;
    }
    
    /**
     * Validates string contains only alphanumeric characters
     */
    public static boolean isAlphanumeric(String str) {
        if (str == null) {
            return false;
        }
        return str.matches("^[a-zA-Z0-9]+$");
    }
    
    /**
     * Validates string contains only letters
     */
    public static boolean isAlpha(String str) {
        if (str == null) {
            return false;
        }
        return str.matches("^[a-zA-Z]+$");
    }
    
    /**
     * Validates string contains only digits
     */
    public static boolean isNumeric(String str) {
        if (str == null) {
            return false;
        }
        return str.matches("^[0-9]+$");
    }
    
    /**
     * Validates string is a valid integer
     */
    public static boolean isValidInteger(String str) {
        if (str == null || str.trim().isEmpty()) {
            return false;
        }
        try {
            Integer.parseInt(str.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Validates string is a valid long
     */
    public static boolean isValidLong(String str) {
        if (str == null || str.trim().isEmpty()) {
            return false;
        }
        try {
            Long.parseLong(str.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Validates string is a valid double
     */
    public static boolean isValidDouble(String str) {
        if (str == null || str.trim().isEmpty()) {
            return false;
        }
        try {
            Double.parseDouble(str.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Validates string is a valid float
     */
    public static boolean isValidFloat(String str) {
        if (str == null || str.trim().isEmpty()) {
            return false;
        }
        try {
            Float.parseFloat(str.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
    
    /**
     * Validates string contains no special characters
     */
    public static boolean containsNoSpecialChars(String str) {
        if (str == null) {
            return false;
        }
        return str.matches("^[a-zA-Z0-9\\s]+$");
    }
    
    /**
     * Validates string contains no HTML tags
     */
    public static boolean containsNoHtml(String str) {
        if (str == null) {
            return true;
        }
        return !str.matches(".*<[^>]+>.*");
    }
    
    /**
     * Validates string contains no SQL injection patterns
     */
    public static boolean containsNoSqlInjection(String str) {
        if (str == null) {
            return true;
        }
        String lowerStr = str.toLowerCase();
        String[] sqlPatterns = {
            "select", "insert", "update", "delete", "drop", "create", "alter",
            "union", "exec", "execute", "script", "javascript", "vbscript"
        };
        
        for (String pattern : sqlPatterns) {
            if (lowerStr.contains(pattern)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Validates string contains no XSS patterns
     */
    public static boolean containsNoXss(String str) {
        if (str == null) {
            return true;
        }
        String lowerStr = str.toLowerCase();
        String[] xssPatterns = {
            "<script", "</script>", "javascript:", "vbscript:", "onload=", "onerror=",
            "onclick=", "onmouseover=", "onfocus=", "onblur="
        };
        
        for (String pattern : xssPatterns) {
            if (lowerStr.contains(pattern)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Validates string is a valid country code
     */
    public static boolean isValidCountryCode(String countryCode) {
        if (countryCode == null || countryCode.length() != 2) {
            return false;
        }
        return countryCode.matches("^[A-Z]{2}$");
    }
    
    /**
     * Validates string is a valid language code
     */
    public static boolean isValidLanguageCode(String languageCode) {
        if (languageCode == null || languageCode.length() != 2) {
            return false;
        }
        return languageCode.matches("^[a-z]{2}$");
    }
    
    /**
     * Validates string is a valid timezone
     */
    public static boolean isValidTimezone(String timezone) {
        if (timezone == null || timezone.trim().isEmpty()) {
            return false;
        }
        try {
            java.util.TimeZone.getTimeZone(timezone);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Validates string is a valid currency code
     */
    public static boolean isValidCurrencyCode(String currencyCode) {
        if (currencyCode == null || currencyCode.length() != 3) {
            return false;
        }
        return currencyCode.matches("^[A-Z]{3}$");
    }
    
    /**
     * Validates string is a valid color code (hex)
     */
    public static boolean isValidColorCode(String colorCode) {
        if (colorCode == null) {
            return false;
        }
        return colorCode.matches("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
    }
    
    /**
     * Validates string is a valid IP address
     */
    public static boolean isValidIpAddress(String ipAddress) {
        if (ipAddress == null) {
            return false;
        }
        return ipAddress.matches("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
    }
    
    /**
     * Validates string is a valid MAC address
     */
    public static boolean isValidMacAddress(String macAddress) {
        if (macAddress == null) {
            return false;
        }
        return macAddress.matches("^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$");
    }
    
    /**
     * Validates string is a valid credit card number (Luhn algorithm)
     */
    public static boolean isValidCreditCard(String cardNumber) {
        if (cardNumber == null || cardNumber.trim().isEmpty()) {
            return false;
        }
        
        String cleanNumber = cardNumber.replaceAll("\\s+", "");
        if (!cleanNumber.matches("^[0-9]{13,19}$")) {
            return false;
        }
        
        int sum = 0;
        boolean alternate = false;
        for (int i = cleanNumber.length() - 1; i >= 0; i--) {
            int n = Integer.parseInt(cleanNumber.substring(i, i + 1));
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            sum += n;
            alternate = !alternate;
        }
        return (sum % 10) == 0;
    }
}
