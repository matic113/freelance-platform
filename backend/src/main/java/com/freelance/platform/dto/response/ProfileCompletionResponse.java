package com.freelance.platform.dto.response;

public class ProfileCompletionResponse {
    
    private Boolean success;
    private String message;
    private UserResponse updatedUser;
    
    public ProfileCompletionResponse() {}
    
    public ProfileCompletionResponse(Boolean success, String message, UserResponse updatedUser) {
        this.success = success;
        this.message = message;
        this.updatedUser = updatedUser;
    }
    
    public Boolean getSuccess() {
        return success;
    }
    
    public void setSuccess(Boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public UserResponse getUpdatedUser() {
        return updatedUser;
    }
    
    public void setUpdatedUser(UserResponse updatedUser) {
        this.updatedUser = updatedUser;
    }
}
