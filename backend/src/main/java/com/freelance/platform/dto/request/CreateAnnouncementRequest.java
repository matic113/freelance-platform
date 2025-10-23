package com.freelance.platform.dto.request;

import com.freelance.platform.entity.AnnouncementPriority;
import com.freelance.platform.entity.TargetAudience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateAnnouncementRequest {
    
    @NotBlank
    @Size(min = 3, max = 200)
    private String title;
    
    @NotBlank
    @Size(min = 10, max = 5000)
    private String message;
    
    @NotNull
    private AnnouncementPriority priority = AnnouncementPriority.NORMAL;
    
    @NotNull
    private Boolean sendEmail = false;
    
    @NotNull
    private TargetAudience targetAudience = TargetAudience.ALL;
    
    public CreateAnnouncementRequest() {}
    
    public CreateAnnouncementRequest(String title, String message, AnnouncementPriority priority, 
                                    Boolean sendEmail, TargetAudience targetAudience) {
        this.title = title;
        this.message = message;
        this.priority = priority;
        this.sendEmail = sendEmail;
        this.targetAudience = targetAudience;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public AnnouncementPriority getPriority() {
        return priority;
    }
    
    public void setPriority(AnnouncementPriority priority) {
        this.priority = priority;
    }
    
    public Boolean getSendEmail() {
        return sendEmail;
    }
    
    public void setSendEmail(Boolean sendEmail) {
        this.sendEmail = sendEmail;
    }
    
    public TargetAudience getTargetAudience() {
        return targetAudience;
    }
    
    public void setTargetAudience(TargetAudience targetAudience) {
        this.targetAudience = targetAudience;
    }
}
