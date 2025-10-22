package com.freelance.platform.dto.request;

public class ProjectAttachmentRequest {
    private String fileName;
    private String fileUrl;
    private long fileSize;
    private String fileType;

    // Constructors
    public ProjectAttachmentRequest() {}

    public ProjectAttachmentRequest(String fileName, String fileUrl, long fileSize, String fileType) {
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
        this.fileType = fileType;
    }

    // Getters and Setters
    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
}
