package com.freelance.platform.dto.response;

import java.time.LocalDateTime;

public class FileUploadResponse {

    private String objectName;
    private String originalFileName;
    private String downloadUrl;
    private Long fileSize;
    private String contentType;
    private LocalDateTime uploadedAt;
    private String folder;

    public FileUploadResponse() {}

    public FileUploadResponse(String objectName, String originalFileName, String downloadUrl, 
                            Long fileSize, String contentType, String folder) {
        this.objectName = objectName;
        this.originalFileName = originalFileName;
        this.downloadUrl = downloadUrl;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.folder = folder;
        this.uploadedAt = LocalDateTime.now();
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }
}
