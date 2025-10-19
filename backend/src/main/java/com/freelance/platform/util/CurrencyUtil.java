package com.freelance.platform.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Currency;
import java.util.Locale;
import java.util.Map;
import java.util.HashMap;

public class CurrencyUtil {
    
    // Supported currencies
    public static final String USD = "USD";
    public static final String EUR = "EUR";
    public static final String GBP = "GBP";
    public static final String SAR = "SAR";
    public static final String AED = "AED";
    public static final String CAD = "CAD";
    public static final String AUD = "AUD";
    public static final String JPY = "JPY";
    
    // Currency symbols
    private static final Map<String, String> CURRENCY_SYMBOLS = new HashMap<>();
    static {
        CURRENCY_SYMBOLS.put(USD, "$");
        CURRENCY_SYMBOLS.put(EUR, "€");
        CURRENCY_SYMBOLS.put(GBP, "£");
        CURRENCY_SYMBOLS.put(SAR, "ر.س");
        CURRENCY_SYMBOLS.put(AED, "د.إ");
        CURRENCY_SYMBOLS.put(CAD, "C$");
        CURRENCY_SYMBOLS.put(AUD, "A$");
        CURRENCY_SYMBOLS.put(JPY, "¥");
    }
    
    // Exchange rates (base: USD) - In production, these should come from an API
    private static final Map<String, BigDecimal> EXCHANGE_RATES = new HashMap<>();
    static {
        EXCHANGE_RATES.put(USD, BigDecimal.ONE);
        EXCHANGE_RATES.put(EUR, new BigDecimal("0.85"));
        EXCHANGE_RATES.put(GBP, new BigDecimal("0.73"));
        EXCHANGE_RATES.put(SAR, new BigDecimal("3.75"));
        EXCHANGE_RATES.put(AED, new BigDecimal("3.67"));
        EXCHANGE_RATES.put(CAD, new BigDecimal("1.25"));
        EXCHANGE_RATES.put(AUD, new BigDecimal("1.35"));
        EXCHANGE_RATES.put(JPY, new BigDecimal("110.00"));
    }
    
    /**
     * Formats amount with currency symbol
     */
    public static String formatCurrency(BigDecimal amount, String currencyCode) {
        if (amount == null || currencyCode == null) {
            return "0.00";
        }
        
        String symbol = CURRENCY_SYMBOLS.getOrDefault(currencyCode, currencyCode);
        DecimalFormat formatter = new DecimalFormat("#,##0.00");
        
        return symbol + formatter.format(amount);
    }
    
    /**
     * Formats amount with currency symbol and locale
     */
    public static String formatCurrency(BigDecimal amount, String currencyCode, Locale locale) {
        if (amount == null || currencyCode == null) {
            return "0.00";
        }
        
        try {
            Currency currency = Currency.getInstance(currencyCode);
            NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
            formatter.setCurrency(currency);
            return formatter.format(amount);
        } catch (Exception e) {
            return formatCurrency(amount, currencyCode);
        }
    }
    
    /**
     * Formats amount for Arabic locale (RTL)
     */
    public static String formatCurrencyArabic(BigDecimal amount, String currencyCode) {
        if (amount == null || currencyCode == null) {
            return "0.00";
        }
        
        String symbol = CURRENCY_SYMBOLS.getOrDefault(currencyCode, currencyCode);
        DecimalFormat formatter = new DecimalFormat("#,##0.00");
        String formattedAmount = formatter.format(amount);
        
        return formattedAmount + " " + symbol;
    }
    
    /**
     * Converts amount from one currency to another
     */
    public static BigDecimal convertCurrency(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (amount == null || fromCurrency == null || toCurrency == null) {
            return BigDecimal.ZERO;
        }
        
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }
        
        BigDecimal fromRate = EXCHANGE_RATES.get(fromCurrency);
        BigDecimal toRate = EXCHANGE_RATES.get(toCurrency);
        
        if (fromRate == null || toRate == null) {
            return amount; // Return original amount if rates not available
        }
        
        // Convert to USD first, then to target currency
        BigDecimal usdAmount = amount.divide(fromRate, 4, RoundingMode.HALF_UP);
        return usdAmount.multiply(toRate).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Gets currency symbol
     */
    public static String getCurrencySymbol(String currencyCode) {
        return CURRENCY_SYMBOLS.getOrDefault(currencyCode, currencyCode);
    }
    
    /**
     * Validates currency code
     */
    public static boolean isValidCurrencyCode(String currencyCode) {
        return currencyCode != null && CURRENCY_SYMBOLS.containsKey(currencyCode);
    }
    
    /**
     * Gets supported currencies
     */
    public static String[] getSupportedCurrencies() {
        return CURRENCY_SYMBOLS.keySet().toArray(new String[0]);
    }
    
    /**
     * Calculates platform fee
     */
    public static BigDecimal calculatePlatformFee(BigDecimal amount, String currencyCode) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        // Platform fee: 2.9% + $0.30 for USD, equivalent for other currencies
        BigDecimal percentageFee = amount.multiply(new BigDecimal("0.029"));
        BigDecimal fixedFee = convertCurrency(new BigDecimal("0.30"), USD, currencyCode);
        
        return percentageFee.add(fixedFee).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Calculates freelancer earnings (amount - platform fee)
     */
    public static BigDecimal calculateFreelancerEarnings(BigDecimal amount, String currencyCode) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal platformFee = calculatePlatformFee(amount, currencyCode);
        return amount.subtract(platformFee).setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Formats percentage
     */
    public static String formatPercentage(BigDecimal percentage) {
        if (percentage == null) {
            return "0.00%";
        }
        
        DecimalFormat formatter = new DecimalFormat("#,##0.00");
        return formatter.format(percentage) + "%";
    }
    
    /**
     * Calculates percentage of amount
     */
    public static BigDecimal calculatePercentage(BigDecimal amount, BigDecimal percentage) {
        if (amount == null || percentage == null) {
            return BigDecimal.ZERO;
        }
        
        return amount.multiply(percentage.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP))
                    .setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Rounds amount to nearest cent
     */
    public static BigDecimal roundToCents(BigDecimal amount) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        
        return amount.setScale(2, RoundingMode.HALF_UP);
    }
    
    /**
     * Validates amount is positive
     */
    public static boolean isValidAmount(BigDecimal amount) {
        return amount != null && amount.compareTo(BigDecimal.ZERO) > 0;
    }
    
    /**
     * Gets currency info for display
     */
    public static Map<String, Object> getCurrencyInfo(String currencyCode) {
        Map<String, Object> info = new HashMap<>();
        info.put("code", currencyCode);
        info.put("symbol", getCurrencySymbol(currencyCode));
        info.put("rate", EXCHANGE_RATES.getOrDefault(currencyCode, BigDecimal.ZERO));
        return info;
    }
    
    /**
     * Formats amount for display in different contexts
     */
    public static String formatAmountForDisplay(BigDecimal amount, String currencyCode, String context) {
        if (amount == null || currencyCode == null) {
            return "0.00";
        }
        
        switch (context.toLowerCase()) {
            case "invoice":
                return formatCurrency(amount, currencyCode);
            case "dashboard":
                return formatCurrency(amount, currencyCode);
            case "arabic":
                return formatCurrencyArabic(amount, currencyCode);
            default:
                return formatCurrency(amount, currencyCode);
        }
    }
}
