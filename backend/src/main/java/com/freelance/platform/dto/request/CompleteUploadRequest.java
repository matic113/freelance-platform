package com.freelance.platform.dto.request;

public class CompleteUploadRequest {
    private String objectName;
    private String filename;
    private long fileSize;
    private String contentType;
    private String folder;

    public CompleteUploadRequest() {}

    public CompleteUploadRequest(String objectName, String filename, long fileSize, String contentType, String folder) {
        this.objectName = objectName;
        this.filename = filename;
        this.fileSize = fileSize;
        this.contentType = contentType;
        this.folder = folder;
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

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }
}
