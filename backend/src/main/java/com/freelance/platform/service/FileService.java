package com.freelance.platform.service;

import com.freelance.platform.exception.FileUploadException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileService {

    public String uploadFile(MultipartFile file) {
        try {
            System.out.println("DEBUG: FileService.uploadFile called");
            System.out.println("DEBUG: File name: " + file.getOriginalFilename());
            System.out.println("DEBUG: File size: " + file.getSize());
            System.out.println("DEBUG: File type: " + file.getContentType());
            
            // Validate file
            System.out.println("DEBUG: Validating file...");
            validateFile(file);
            System.out.println("DEBUG: File validation passed");

            // Generate unique filename
            String fileName = generateUniqueFileName(file.getOriginalFilename());
            System.out.println("DEBUG: Generated filename: " + fileName);
            
            // For development, use local file storage instead of S3
            System.out.println("DEBUG: Uploading file locally...");
            String fileUrl = uploadFileLocally(file, fileName);
            System.out.println("DEBUG: File uploaded locally, URL: " + fileUrl);
            
            return fileUrl;

        } catch (IOException e) {
            System.out.println("DEBUG: File upload failed: " + e.getMessage());
            e.printStackTrace();
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("DEBUG: Unexpected error during file upload: " + e.getMessage());
            e.printStackTrace();
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        }
    }
    
    private String uploadFileLocally(MultipartFile file, String fileName) throws IOException {
        System.out.println("DEBUG: uploadFileLocally called with fileName: " + fileName);
        
        // Use absolute path to avoid Tomcat temp directory issues
        String userHome = System.getProperty("user.home");
        java.io.File uploadDir = new java.io.File(userHome + File.separator + "freelance-uploads");
        System.out.println("DEBUG: Upload directory path: " + uploadDir.getAbsolutePath());
        
        if (!uploadDir.exists()) {
            System.out.println("DEBUG: Creating uploads directory...");
            boolean created = uploadDir.mkdirs();
            System.out.println("DEBUG: Directory created: " + created);
        } else {
            System.out.println("DEBUG: Uploads directory already exists");
        }
        
        // Save file locally
        java.io.File targetFile = new java.io.File(uploadDir, fileName);
        System.out.println("DEBUG: Target file path: " + targetFile.getAbsolutePath());
        
        System.out.println("DEBUG: Transferring file...");
        file.transferTo(targetFile);
        System.out.println("DEBUG: File transferred successfully");
        
        // Return local file URL
        String fileUrl = "/uploads/" + fileName;
        System.out.println("DEBUG: Returning file URL: " + fileUrl);
        return fileUrl;
    }

    public void deleteFile(UUID userId, UUID fileId) {
        try {
            // For now, just log the deletion request
            System.out.println("DEBUG: Deleting file with ID: " + fileId + " for user: " + userId);
            // TODO: Implement actual file deletion logic
        } catch (Exception e) {
            System.err.println("Failed to delete file: " + fileId + " - " + e.getMessage());
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            deleteLocalFile(fileUrl);
        } catch (Exception e) {
            // Log error but don't throw exception for file deletion failures
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }
    
    private void deleteLocalFile(String fileUrl) {
        try {
            String fileName = fileUrl.substring("/uploads/".length());
            String userHome = System.getProperty("user.home");
            java.io.File file = new java.io.File(userHome + File.separator + "freelance-uploads", fileName);
            if (file.exists()) {
                file.delete();
            }
        } catch (Exception e) {
            System.err.println("Failed to delete local file: " + fileUrl + " - " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        // Check file size (10MB limit)
        long maxSize = 10 * 1024 * 1024; // 10MB
        if (file.getSize() > maxSize) {
            throw new FileUploadException("File size exceeds 10MB limit");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new FileUploadException("File type not allowed");
        }
    }

    private boolean isAllowedContentType(String contentType) {
        return contentType.startsWith("image/") ||
               contentType.startsWith("application/pdf") ||
               contentType.startsWith("text/") ||
               contentType.equals("application/msword") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
               contentType.equals("application/vnd.ms-excel") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
               contentType.equals("application/zip") ||
               contentType.equals("application/x-rar-compressed");
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }
    
    // Additional methods for FileController
    public Map<String, Object> uploadFile(MultipartFile file, String category, UUID userId) {
        String fileUrl = uploadFile(file);
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("fileUrl", fileUrl);
        response.put("fileName", file.getOriginalFilename());
        response.put("fileSize", file.getSize());
        response.put("fileType", file.getContentType());
        response.put("category", category);
        response.put("uploadedBy", userId);
        response.put("uploadedAt", java.time.LocalDateTime.now());
        
        return response;
    }
    
    public Map<String, Object> bulkUploadFiles(List<MultipartFile> files, String category, UUID userId) {
        List<Map<String, Object>> uploadedFiles = new java.util.ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                Map<String, Object> fileInfo = uploadFile(file, category, userId);
                uploadedFiles.add(fileInfo);
            } catch (Exception e) {
                // Log error but continue with other files
                System.err.println("Failed to upload file: " + file.getOriginalFilename() + " - " + e.getMessage());
            }
        }
        
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("uploadedFiles", uploadedFiles);
        response.put("totalFiles", files.size());
        response.put("successfulUploads", uploadedFiles.size());
        
        return response;
    }
    
    public Map<String, Object> getFile(UUID fileId, UUID userId) {
        // This is a placeholder implementation
        // In a real application, you would store file metadata in a database
        Map<String, Object> fileInfo = new java.util.HashMap<>();
        fileInfo.put("id", fileId);
        fileInfo.put("message", "File metadata retrieval not implemented yet");

        return fileInfo;
    }

    // NOTE: duplicate deleteFile(UUID, UUID) removed above. Keep single implementation that logs and will be
    // implemented later. Use deleteFile(String fileUrl) when deleting by URL.

    public Map<String, Object> getUserFiles(UUID userId, String category, int page, int size) {
        // Placeholder implementation for getting user files
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("files", new java.util.ArrayList<>());
        response.put("totalElements", 0);
        response.put("totalPages", 0);
        response.put("currentPage", page);
        response.put("pageSize", size);
        response.put("message", "File listing not implemented yet");

        return response;
    }

    public Map<String, Object> getDownloadUrl(UUID id, UUID userId) {
        // Placeholder implementation for getting download URL
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("downloadUrl", "/api/files/download/" + id);
        response.put("expiresAt", java.time.LocalDateTime.now().plusHours(1));
        response.put("message", "Download URL generation not implemented yet");

        return response;
    }

    public Map<String, Object> updateFileMetadata(UUID id, Map<String, Object> metadata, UUID userId) {
        // Placeholder implementation for updating file metadata
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", id);
        response.put("metadata", metadata);
        response.put("updatedAt", java.time.LocalDateTime.now());
        response.put("message", "File metadata update not implemented yet");

        return response;
    }

    public List<Map<String, Object>> getFileCategories() {
        // Placeholder implementation for getting file categories
        List<Map<String, Object>> categories = new java.util.ArrayList<>();

        Map<String, Object> category1 = new java.util.HashMap<>();
        category1.put("id", "documents");
        category1.put("name", "Documents");
        category1.put("description", "Project documents and contracts");
        categories.add(category1);

        Map<String, Object> category2 = new java.util.HashMap<>();
        category2.put("id", "images");
        category2.put("name", "Images");
        category2.put("description", "Profile pictures and project images");
        categories.add(category2);

        Map<String, Object> category3 = new java.util.HashMap<>();
        category3.put("id", "portfolio");
        category3.put("name", "Portfolio");
        category3.put("description", "Portfolio files and work samples");
        categories.add(category3);

        return categories;
    }

    public Map<String, Object> getStorageUsage(UUID userId) {
        // Placeholder implementation for getting storage usage
        Map<String, Object> usage = new java.util.HashMap<>();
        usage.put("userId", userId);
        usage.put("usedStorage", 0L); // bytes
        usage.put("totalStorage", 1073741824L); // 1GB in bytes
        usage.put("availableStorage", 1073741824L); // 1GB in bytes
        usage.put("percentageUsed", 0.0);
        usage.put("message", "Storage usage calculation not implemented yet");

        return usage;
    }
}
