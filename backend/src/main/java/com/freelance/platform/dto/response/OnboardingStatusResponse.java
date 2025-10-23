package com.freelance.platform.dto.response;

import com.freelance.platform.entity.Role;

import java.util.Map;

public class OnboardingStatusResponse {
    
    private Boolean profileCompleted;
    private Role activeRole;
    private String redirectUrl;
    private Map<String, Object> completionChecklist;
    
    public OnboardingStatusResponse() {}
    
    public OnboardingStatusResponse(Boolean profileCompleted, Role activeRole, String redirectUrl, Map<String, Object> completionChecklist) {
        this.profileCompleted = profileCompleted;
        this.activeRole = activeRole;
        this.redirectUrl = redirectUrl;
        this.completionChecklist = completionChecklist;
    }
    
    public Boolean getProfileCompleted() {
        return profileCompleted;
    }
    
    public void setProfileCompleted(Boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }
    
    public Role getActiveRole() {
        return activeRole;
    }
    
    public void setActiveRole(Role activeRole) {
        this.activeRole = activeRole;
    }
    
    public String getRedirectUrl() {
        return redirectUrl;
    }
    
    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
    
    public Map<String, Object> getCompletionChecklist() {
        return completionChecklist;
    }
    
    public void setCompletionChecklist(Map<String, Object> completionChecklist) {
        this.completionChecklist = completionChecklist;
    }
}
