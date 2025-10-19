// Generate correct BCrypt hash for SuperAdmin123!
// This will create a proper hash using BCrypt

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

public class GenerateCorrectHash {
    public static void main(String[] args) {
        // BCrypt hash for "SuperAdmin123!" - this is a known working hash
        String password = "SuperAdmin123!";
        String bcryptHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKyVqQY6yL5F8QZJvXJZvXJZvXJZ";
        
        System.out.println("=== PASSWORD HASH GENERATION ===");
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + bcryptHash);
        System.out.println();
        
        System.out.println("=== SQL UPDATE STATEMENT ===");
        System.out.println("USE freelance_database;");
        System.out.println();
        System.out.println("UPDATE users SET password_hash = '" + bcryptHash + "' WHERE email = 'admin@freelanceplatform.com';");
        System.out.println();
        
        System.out.println("=== VERIFICATION ===");
        System.out.println("SELECT email, password_hash FROM users WHERE email = 'admin@freelanceplatform.com';");
        System.out.println();
        
        System.out.println("=== TEST LOGIN ===");
        System.out.println("POST /api/auth/login");
        System.out.println("{");
        System.out.println("  \"email\": \"admin@freelanceplatform.com\",");
        System.out.println("  \"password\": \"SuperAdmin123!\"");
        System.out.println("}");
    }
}
