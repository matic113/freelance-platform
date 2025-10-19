package com.freelance.platform.util;

import java.util.regex.Pattern;
import java.util.UUID;

public class StringUtil {
    
    // Common regex patterns
    private static final Pattern CAMEL_CASE_PATTERN = Pattern.compile("([a-z])([A-Z])");
    private static final Pattern SNAKE_CASE_PATTERN = Pattern.compile("_([a-z])");
    private static final Pattern KEBAB_CASE_PATTERN = Pattern.compile("-([a-z])");
    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s+");
    private static final Pattern SPECIAL_CHARS_PATTERN = Pattern.compile("[^a-zA-Z0-9\\s]");
    
    /**
     * Checks if string is null or empty
     */
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    /**
     * Checks if string is not null and not empty
     */
    public static boolean isNotNullOrEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }
    
    /**
     * Trims string and returns null if empty
     */
    public static String trimToNull(String str) {
        if (str == null) {
            return null;
        }
        String trimmed = str.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
    
    /**
     * Trims string and returns empty string if null
     */
    public static String trimToEmpty(String str) {
        return str == null ? "" : str.trim();
    }
    
    /**
     * Capitalizes first letter of string
     */
    public static String capitalize(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
    
    /**
     * Capitalizes first letter of each word
     */
    public static String capitalizeWords(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        
        String[] words = str.trim().split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) {
                result.append(" ");
            }
            result.append(capitalize(words[i]));
        }
        
        return result.toString();
    }
    
    /**
     * Converts string to camelCase
     */
    public static String toCamelCase(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        
        String result = str.trim().toLowerCase();
        result = WHITESPACE_PATTERN.matcher(result).replaceAll(" ");
        result = SPECIAL_CHARS_PATTERN.matcher(result).replaceAll("");
        
        String[] words = result.split("\\s+");
        if (words.length == 0) {
            return "";
        }
        
        StringBuilder camelCase = new StringBuilder(words[0].toLowerCase());
        for (int i = 1; i < words.length; i++) {
            camelCase.append(capitalize(words[i]));
        }
        
        return camelCase.toString();
    }
    
    /**
     * Converts string to PascalCase
     */
    public static String toPascalCase(String str) {
        String camelCase = toCamelCase(str);
        return isNullOrEmpty(camelCase) ? camelCase : capitalize(camelCase);
    }
    
    /**
     * Converts string to snake_case
     */
    public static String toSnakeCase(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        
        String result = str.trim();
        result = CAMEL_CASE_PATTERN.matcher(result).replaceAll("$1_$2");
        result = WHITESPACE_PATTERN.matcher(result).replaceAll("_");
        result = SPECIAL_CHARS_PATTERN.matcher(result).replaceAll("");
        
        return result.toLowerCase();
    }
    
    /**
     * Converts string to kebab-case
     */
    public static String toKebabCase(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        
        String result = str.trim();
        result = CAMEL_CASE_PATTERN.matcher(result).replaceAll("$1-$2");
        result = WHITESPACE_PATTERN.matcher(result).replaceAll("-");
        result = SPECIAL_CHARS_PATTERN.matcher(result).replaceAll("");
        
        return result.toLowerCase();
    }
    
    /**
     * Converts string to Title Case
     */
    public static String toTitleCase(String str) {
        if (isNullOrEmpty(str)) {
            return str;
        }
        
        String result = str.trim();
        result = WHITESPACE_PATTERN.matcher(result).replaceAll(" ");
        result = SPECIAL_CHARS_PATTERN.matcher(result).replaceAll("");
        
        return capitalizeWords(result);
    }
    
    /**
     * Converts string to UPPER_CASE
     */
    public static String toUpperCase(String str) {
        return str == null ? null : str.toUpperCase();
    }
    
    /**
     * Converts string to lower_case
     */
    public static String toLowerCase(String str) {
        return str == null ? null : str.toLowerCase();
    }
    
    /**
     * Removes all whitespace from string
     */
    public static String removeWhitespace(String str) {
        return str == null ? null : WHITESPACE_PATTERN.matcher(str).replaceAll("");
    }
    
    /**
     * Removes special characters from string
     */
    public static String removeSpecialChars(String str) {
        return str == null ? null : SPECIAL_CHARS_PATTERN.matcher(str).replaceAll("");
    }
    
    /**
     * Removes all non-alphanumeric characters
     */
    public static String removeNonAlphanumeric(String str) {
        return str == null ? null : str.replaceAll("[^a-zA-Z0-9]", "");
    }
    
    /**
     * Removes all non-numeric characters
     */
    public static String removeNonNumeric(String str) {
        return str == null ? null : str.replaceAll("[^0-9]", "");
    }
    
    /**
     * Removes all non-alphabetic characters
     */
    public static String removeNonAlphabetic(String str) {
        return str == null ? null : str.replaceAll("[^a-zA-Z]", "");
    }
    
    /**
     * Reverses string
     */
    public static String reverse(String str) {
        return str == null ? null : new StringBuilder(str).reverse().toString();
    }
    
    /**
     * Checks if string contains only letters
     */
    public static boolean containsOnlyLetters(String str) {
        return str != null && str.matches("^[a-zA-Z]+$");
    }
    
    /**
     * Checks if string contains only digits
     */
    public static boolean containsOnlyDigits(String str) {
        return str != null && str.matches("^[0-9]+$");
    }
    
    /**
     * Checks if string contains only alphanumeric characters
     */
    public static boolean containsOnlyAlphanumeric(String str) {
        return str != null && str.matches("^[a-zA-Z0-9]+$");
    }
    
    /**
     * Checks if string is palindrome
     */
    public static boolean isPalindrome(String str) {
        if (str == null) {
            return false;
        }
        
        String clean = str.replaceAll("\\s+", "").toLowerCase();
        return clean.equals(reverse(clean));
    }
    
    /**
     * Counts occurrences of character in string
     */
    public static int countOccurrences(String str, char ch) {
        if (str == null) {
            return 0;
        }
        
        int count = 0;
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == ch) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * Counts occurrences of substring in string
     */
    public static int countOccurrences(String str, String substring) {
        if (str == null || substring == null || substring.isEmpty()) {
            return 0;
        }
        
        int count = 0;
        int index = 0;
        while ((index = str.indexOf(substring, index)) != -1) {
            count++;
            index += substring.length();
        }
        return count;
    }
    
    /**
     * Truncates string to specified length
     */
    public static String truncate(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength);
    }
    
    /**
     * Truncates string with ellipsis
     */
    public static String truncateWithEllipsis(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength - 3) + "...";
    }
    
    /**
     * Pads string to specified length
     */
    public static String padLeft(String str, int length, char padChar) {
        if (str == null) {
            str = "";
        }
        
        if (str.length() >= length) {
            return str;
        }
        
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length - str.length(); i++) {
            sb.append(padChar);
        }
        sb.append(str);
        return sb.toString();
    }
    
    /**
     * Pads string to specified length on the right
     */
    public static String padRight(String str, int length, char padChar) {
        if (str == null) {
            str = "";
        }
        
        if (str.length() >= length) {
            return str;
        }
        
        StringBuilder sb = new StringBuilder(str);
        for (int i = 0; i < length - str.length(); i++) {
            sb.append(padChar);
        }
        return sb.toString();
    }
    
    /**
     * Generates random string
     */
    public static String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(length);
        
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
    
    /**
     * Generates random numeric string
     */
    public static String generateRandomNumericString(int length) {
        StringBuilder sb = new StringBuilder(length);
        
        for (int i = 0; i < length; i++) {
            int digit = (int) (Math.random() * 10);
            sb.append(digit);
        }
        
        return sb.toString();
    }
    
    /**
     * Generates UUID string
     */
    public static String generateUUID() {
        return UUID.randomUUID().toString();
    }
    
    /**
     * Generates UUID without dashes
     */
    public static String generateUUIDWithoutDashes() {
        return UUID.randomUUID().toString().replace("-", "");
    }
    
    /**
     * Masks string with asterisks
     */
    public static String maskString(String str, int visibleStart, int visibleEnd) {
        if (str == null || str.length() <= visibleStart + visibleEnd) {
            return str;
        }
        
        String start = str.substring(0, visibleStart);
        String end = str.substring(str.length() - visibleEnd);
        String middle = "*".repeat(str.length() - visibleStart - visibleEnd);
        
        return start + middle + end;
    }
    
    /**
     * Masks email address
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return email;
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
            return phone;
        }
        
        if (phone.length() <= 8) {
            return phone.substring(0, 2) + "***" + phone.substring(phone.length() - 2);
        }
        
        return phone.substring(0, 3) + "***" + phone.substring(phone.length() - 3);
    }
    
    /**
     * Checks if string starts with any of the given prefixes
     */
    public static boolean startsWithAny(String str, String... prefixes) {
        if (str == null || prefixes == null) {
            return false;
        }
        
        for (String prefix : prefixes) {
            if (str.startsWith(prefix)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Checks if string ends with any of the given suffixes
     */
    public static boolean endsWithAny(String str, String... suffixes) {
        if (str == null || suffixes == null) {
            return false;
        }
        
        for (String suffix : suffixes) {
            if (str.endsWith(suffix)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Removes prefix from string
     */
    public static String removePrefix(String str, String prefix) {
        if (str == null || prefix == null || !str.startsWith(prefix)) {
            return str;
        }
        return str.substring(prefix.length());
    }
    
    /**
     * Removes suffix from string
     */
    public static String removeSuffix(String str, String suffix) {
        if (str == null || suffix == null || !str.endsWith(suffix)) {
            return str;
        }
        return str.substring(0, str.length() - suffix.length());
    }
    
    /**
     * Replaces multiple spaces with single space
     */
    public static String normalizeWhitespace(String str) {
        return str == null ? null : WHITESPACE_PATTERN.matcher(str).replaceAll(" ");
    }
    
    /**
     * Removes leading and trailing whitespace
     */
    public static String trim(String str) {
        return str == null ? null : str.trim();
    }
}
