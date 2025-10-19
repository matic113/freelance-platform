package com.freelance.platform.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

public class DateUtil {
    
    // Common date formats
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DISPLAY_DATE_FORMAT = "MMM dd, yyyy";
    public static final String DISPLAY_DATETIME_FORMAT = "MMM dd, yyyy HH:mm";
    public static final String ISO_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String ARABIC_DATE_FORMAT = "dd/MM/yyyy";
    public static final String ARABIC_DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
    
    // Formatters
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(DATE_FORMAT);
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DATETIME_FORMAT);
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern(DISPLAY_DATE_FORMAT, Locale.ENGLISH);
    private static final DateTimeFormatter DISPLAY_DATETIME_FORMATTER = DateTimeFormatter.ofPattern(DISPLAY_DATETIME_FORMAT, Locale.ENGLISH);
    private static final DateTimeFormatter ISO_DATETIME_FORMATTER = DateTimeFormatter.ofPattern(ISO_DATETIME_FORMAT);
    private static final DateTimeFormatter ARABIC_DATE_FORMATTER = DateTimeFormatter.ofPattern(ARABIC_DATE_FORMAT);
    private static final DateTimeFormatter ARABIC_DATETIME_FORMATTER = DateTimeFormatter.ofPattern(ARABIC_DATETIME_FORMAT);
    
    /**
     * Formats LocalDate to string
     */
    public static String formatDate(LocalDate date) {
        if (date == null) {
            return "";
        }
        return date.format(DATE_FORMATTER);
    }
    
    /**
     * Formats LocalDateTime to string
     */
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(DATETIME_FORMATTER);
    }
    
    /**
     * Formats date for display
     */
    public static String formatDateForDisplay(LocalDate date) {
        if (date == null) {
            return "";
        }
        return date.format(DISPLAY_DATE_FORMATTER);
    }
    
    /**
     * Formats datetime for display
     */
    public static String formatDateTimeForDisplay(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(DISPLAY_DATETIME_FORMATTER);
    }
    
    /**
     * Formats date for Arabic locale
     */
    public static String formatDateArabic(LocalDate date) {
        if (date == null) {
            return "";
        }
        return date.format(ARABIC_DATE_FORMATTER);
    }
    
    /**
     * Formats datetime for Arabic locale
     */
    public static String formatDateTimeArabic(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(ARABIC_DATETIME_FORMATTER);
    }
    
    /**
     * Formats datetime in ISO format
     */
    public static String formatDateTimeISO(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        return dateTime.format(ISO_DATETIME_FORMATTER);
    }
    
    /**
     * Parses string to LocalDate
     */
    public static LocalDate parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) {
            return null;
        }
        
        try {
            return LocalDate.parse(dateString.trim(), DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * Parses string to LocalDateTime
     */
    public static LocalDateTime parseDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            return null;
        }
        
        try {
            return LocalDateTime.parse(dateTimeString.trim(), DATETIME_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * Parses ISO datetime string
     */
    public static LocalDateTime parseDateTimeISO(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) {
            return null;
        }
        
        try {
            return LocalDateTime.parse(dateTimeString.trim(), ISO_DATETIME_FORMATTER);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
    
    /**
     * Gets current date
     */
    public static LocalDate getCurrentDate() {
        return LocalDate.now();
    }
    
    /**
     * Gets current datetime
     */
    public static LocalDateTime getCurrentDateTime() {
        return LocalDateTime.now();
    }
    
    /**
     * Calculates days between two dates
     */
    public static long daysBetween(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(startDate, endDate);
    }
    
    /**
     * Calculates hours between two datetimes
     */
    public static long hoursBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            return 0;
        }
        return ChronoUnit.HOURS.between(startDateTime, endDateTime);
    }
    
    /**
     * Calculates minutes between two datetimes
     */
    public static long minutesBetween(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            return 0;
        }
        return ChronoUnit.MINUTES.between(startDateTime, endDateTime);
    }
    
    /**
     * Checks if date is in the past
     */
    public static boolean isPastDate(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isBefore(LocalDate.now());
    }
    
    /**
     * Checks if date is in the future
     */
    public static boolean isFutureDate(LocalDate date) {
        if (date == null) {
            return false;
        }
        return date.isAfter(LocalDate.now());
    }
    
    /**
     * Checks if datetime is in the past
     */
    public static boolean isPastDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isBefore(LocalDateTime.now());
    }
    
    /**
     * Checks if datetime is in the future
     */
    public static boolean isFutureDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return false;
        }
        return dateTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * Adds days to date
     */
    public static LocalDate addDays(LocalDate date, long days) {
        if (date == null) {
            return null;
        }
        return date.plusDays(days);
    }
    
    /**
     * Adds hours to datetime
     */
    public static LocalDateTime addHours(LocalDateTime dateTime, long hours) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.plusHours(hours);
    }
    
    /**
     * Subtracts days from date
     */
    public static LocalDate subtractDays(LocalDate date, long days) {
        if (date == null) {
            return null;
        }
        return date.minusDays(days);
    }
    
    /**
     * Subtracts hours from datetime
     */
    public static LocalDateTime subtractHours(LocalDateTime dateTime, long hours) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.minusHours(hours);
    }
    
    /**
     * Gets start of day
     */
    public static LocalDateTime getStartOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atStartOfDay();
    }
    
    /**
     * Gets end of day
     */
    public static LocalDateTime getEndOfDay(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.atTime(23, 59, 59);
    }
    
    /**
     * Gets relative time string (e.g., "2 hours ago", "3 days ago")
     */
    public static String getRelativeTimeString(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        
        if (minutes < 1) {
            return "Just now";
        } else if (minutes < 60) {
            return minutes + " minute" + (minutes == 1 ? "" : "s") + " ago";
        } else if (minutes < 1440) { // 24 hours
            long hours = minutes / 60;
            return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        } else if (minutes < 10080) { // 7 days
            long days = minutes / 1440;
            return days + " day" + (days == 1 ? "" : "s") + " ago";
        } else if (minutes < 43200) { // 30 days
            long weeks = minutes / 10080;
            return weeks + " week" + (weeks == 1 ? "" : "s") + " ago";
        } else {
            return formatDateForDisplay(dateTime.toLocalDate());
        }
    }
    
    /**
     * Gets relative time string in Arabic
     */
    public static String getRelativeTimeStringArabic(LocalDateTime dateTime) {
        if (dateTime == null) {
            return "";
        }
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        
        if (minutes < 1) {
            return "الآن";
        } else if (minutes < 60) {
            return "منذ " + minutes + " دقيقة";
        } else if (minutes < 1440) { // 24 hours
            long hours = minutes / 60;
            return "منذ " + hours + " ساعة";
        } else if (minutes < 10080) { // 7 days
            long days = minutes / 1440;
            return "منذ " + days + " يوم";
        } else if (minutes < 43200) { // 30 days
            long weeks = minutes / 10080;
            return "منذ " + weeks + " أسبوع";
        } else {
            return formatDateArabic(dateTime.toLocalDate());
        }
    }
    
    /**
     * Validates date range
     */
    public static boolean isValidDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            return false;
        }
        return !startDate.isAfter(endDate);
    }
    
    /**
     * Gets age from birth date
     */
    public static int getAge(LocalDate birthDate) {
        if (birthDate == null) {
            return 0;
        }
        return (int) ChronoUnit.YEARS.between(birthDate, LocalDate.now());
    }
}
