package com.freelance.platform.dto.request;

import jakarta.validation.constraints.NotBlank;

public class FileUploadRequest {

    @NotBlank(message = "Folder is required")
    private String folder;

    private String description;

    public FileUploadRequest() {}

    public FileUploadRequest(String folder) {
        this.folder = folder;
    }

    public FileUploadRequest(String folder, String description) {
        this.folder = folder;
        this.description = description;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
