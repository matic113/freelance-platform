package com.freelance.platform.dto.response;

public class PresignedUploadResponse {
    private String uploadUrl;
    private String objectName;
    private String filename;
    private long expirationMs;

    public PresignedUploadResponse() {}

    public PresignedUploadResponse(String uploadUrl, String objectName, String filename, long expirationMs) {
        this.uploadUrl = uploadUrl;
        this.objectName = objectName;
        this.filename = filename;
        this.expirationMs = expirationMs;
    }

    public String getUploadUrl() {
        return uploadUrl;
    }

    public void setUploadUrl(String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    public String getObjectName() {
        return objectName;
    }

    public void setObjectName(String objectName) {
        this.objectName = objectName;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }
}
