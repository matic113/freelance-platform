package com.freelance.platform.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class EncryptionService {
    
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    
    @Value("${app.encryption.key:defaultEncryptionKey123456789012345678901234567890}")
    private String encryptionKey;
    
    private SecretKey getSecretKey() {
        byte[] key = encryptionKey.getBytes(StandardCharsets.UTF_8);
        
        // Ensure key length is valid for AES (16, 24, or 32 bytes)
        if (key.length < 16) {
            // Pad with zeros if too short
            byte[] paddedKey = new byte[16];
            System.arraycopy(key, 0, paddedKey, 0, Math.min(key.length, 16));
            return new SecretKeySpec(paddedKey, ALGORITHM);
        } else if (key.length > 32) {
            // Truncate if too long
            byte[] truncatedKey = new byte[32];
            System.arraycopy(key, 0, truncatedKey, 0, 32);
            return new SecretKeySpec(truncatedKey, ALGORITHM);
        } else if (key.length <= 16) {
            // Pad to 16 bytes
            byte[] paddedKey = new byte[16];
            System.arraycopy(key, 0, paddedKey, 0, key.length);
            return new SecretKeySpec(paddedKey, ALGORITHM);
        } else if (key.length <= 24) {
            // Pad to 24 bytes
            byte[] paddedKey = new byte[24];
            System.arraycopy(key, 0, paddedKey, 0, key.length);
            return new SecretKeySpec(paddedKey, ALGORITHM);
        } else {
            // Pad to 32 bytes
            byte[] paddedKey = new byte[32];
            System.arraycopy(key, 0, paddedKey, 0, key.length);
            return new SecretKeySpec(paddedKey, ALGORITHM);
        }
    }
    
    public String encrypt(String plainText) {
        try {
            if (plainText == null || plainText.isEmpty()) {
                return plainText;
            }
            
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey());
            
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }
    
    public String decrypt(String encryptedText) {
        try {
            if (encryptedText == null || encryptedText.isEmpty()) {
                return encryptedText;
            }
            
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey());
            
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedText);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }
    
    public String maskCardNumber(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) {
            return "****";
        }
        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);
    }
    
    public String getCardBrand(String cardNumber) {
        if (cardNumber == null || cardNumber.isEmpty()) {
            return "UNKNOWN";
        }
        
        // Remove any non-digit characters
        String cleanNumber = cardNumber.replaceAll("\\D", "");
        
        if (cleanNumber.startsWith("4")) {
            return "VISA";
        } else if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) {
            return "MASTERCARD";
        } else if (cleanNumber.startsWith("3")) {
            return "AMEX";
        } else if (cleanNumber.startsWith("6")) {
            return "DISCOVER";
        } else {
            return "UNKNOWN";
        }
    }
    
    public String getCardType(String cardNumber) {
        // This is a simplified implementation
        // In a real application, you might use a card validation service
        String brand = getCardBrand(cardNumber);
        if ("AMEX".equals(brand)) {
            return "CREDIT"; // Amex cards are typically credit cards
        }
        return "CREDIT"; // Default to credit card
    }
}
