package com.freelance.platform.util;

import com.freelance.platform.exception.FileUploadException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public class FileUploadUtil {
    
    // File size limits (in bytes)
    public static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    public static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    public static final long MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB
    
    // Allowed file types
    public static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    
    public static final List<String> ALLOWED_DOCUMENT_TYPES = Arrays.asList(
        "application/pdf", "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain", "application/rtf"
    );
    
    public static final List<String> ALLOWED_ARCHIVE_TYPES = Arrays.asList(
        "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"
    );
    
    // File extensions
    public static final List<String> ALLOWED_IMAGE_EXTENSIONS = Arrays.asList(
        ".jpg", ".jpeg", ".png", ".gif", ".webp"
    );
    
    public static final List<String> ALLOWED_DOCUMENT_EXTENSIONS = Arrays.asList(
        ".pdf", ".doc", ".docx", ".txt", ".rtf"
    );
    
    public static final List<String> ALLOWED_ARCHIVE_EXTENSIONS = Arrays.asList(
        ".zip", ".rar", ".7z"
    );
    
    /**
     * Validates a file upload
     */
    public static void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("File is empty or null");
        }
        
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileUploadException("File size exceeds maximum allowed size of " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
        }
        
        // Check file name
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new FileUploadException("File name is invalid");
        }
        
        // Check for malicious file names
        if (containsMaliciousContent(originalFilename)) {
            throw new FileUploadException("File name contains invalid characters");
        }
    }
    
    /**
     * Validates an image file
     */
    public static void validateImageFile(MultipartFile file) {
        validateFile(file);
        
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new FileUploadException("Image size exceeds maximum allowed size of " + (MAX_IMAGE_SIZE / 1024 / 1024) + "MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new FileUploadException("Invalid image file type. Allowed types: " + String.join(", ", ALLOWED_IMAGE_TYPES));
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
            throw new FileUploadException("Invalid image file extension. Allowed extensions: " + String.join(", ", ALLOWED_IMAGE_EXTENSIONS));
        }
    }
    
    /**
     * Validates a document file
     */
    public static void validateDocumentFile(MultipartFile file) {
        validateFile(file);
        
        if (file.getSize() > MAX_DOCUMENT_SIZE) {
            throw new FileUploadException("Document size exceeds maximum allowed size of " + (MAX_DOCUMENT_SIZE / 1024 / 1024) + "MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
            throw new FileUploadException("Invalid document file type. Allowed types: " + String.join(", ", ALLOWED_DOCUMENT_TYPES));
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_DOCUMENT_EXTENSIONS.contains(extension)) {
            throw new FileUploadException("Invalid document file extension. Allowed extensions: " + String.join(", ", ALLOWED_DOCUMENT_EXTENSIONS));
        }
    }
    
    /**
     * Validates an archive file
     */
    public static void validateArchiveFile(MultipartFile file) {
        validateFile(file);
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_ARCHIVE_TYPES.contains(contentType)) {
            throw new FileUploadException("Invalid archive file type. Allowed types: " + String.join(", ", ALLOWED_ARCHIVE_TYPES));
        }
        
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_ARCHIVE_EXTENSIONS.contains(extension)) {
            throw new FileUploadException("Invalid archive file extension. Allowed extensions: " + String.join(", ", ALLOWED_ARCHIVE_EXTENSIONS));
        }
    }
    
    /**
     * Generates a unique filename
     */
    public static String generateUniqueFileName(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String baseName = getBaseName(originalFilename);
        String timestamp = String.valueOf(System.currentTimeMillis());
        return baseName + "_" + timestamp + extension;
    }
    
    /**
     * Gets file extension from filename
     */
    public static String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
    
    /**
     * Gets base name without extension
     */
    public static String getBaseName(String filename) {
        if (filename == null) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return filename;
        }
        return filename.substring(0, lastDotIndex);
    }
    
    /**
     * Checks if filename contains malicious content
     */
    private static boolean containsMaliciousContent(String filename) {
        String[] maliciousPatterns = {
            "..", "/", "\\", "<", ">", ":", "\"", "|", "?", "*",
            "script", "javascript", "vbscript", "onload", "onerror"
        };
        
        String lowerFilename = filename.toLowerCase();
        for (String pattern : maliciousPatterns) {
            if (lowerFilename.contains(pattern)) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Formats file size in human readable format
     */
    public static String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.1f %sB", bytes / Math.pow(1024, exp), pre);
    }
    
    /**
     * Gets file type category
     */
    public static String getFileTypeCategory(String contentType) {
        if (contentType == null) {
            return "unknown";
        }
        
        if (contentType.startsWith("image/")) {
            return "image";
        } else if (contentType.startsWith("video/")) {
            return "video";
        } else if (contentType.startsWith("audio/")) {
            return "audio";
        } else if (ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
            return "document";
        } else if (ALLOWED_ARCHIVE_TYPES.contains(contentType)) {
            return "archive";
        } else {
            return "other";
        }
    }
}
