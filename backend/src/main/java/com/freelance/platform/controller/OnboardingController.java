package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CompleteClientProfileRequest;
import com.freelance.platform.dto.request.CompleteFreelancerProfileRequest;
import com.freelance.platform.dto.response.OnboardingStatusResponse;
import com.freelance.platform.dto.response.ProfileCompletionResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.OnboardingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/onboarding")
@Tag(name = "Onboarding", description = "User onboarding and profile completion APIs")
public class OnboardingController {
    
    @Autowired
    private OnboardingService onboardingService;
    
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get onboarding status", description = "Returns the current profile completion status and checklist for the authenticated user")
    public ResponseEntity<OnboardingStatusResponse> getOnboardingStatus(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UUID userId = currentUser.getId();
        OnboardingStatusResponse response = onboardingService.checkProfileCompletion(userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/complete-freelancer")
    @PreAuthorize("hasAnyRole('FREELANCER')")
    @Operation(summary = "Complete freelancer profile", description = "Complete the freelancer profile with mandatory fields: bio, hourly rate, experience level, location, avatar, and at least 3 skills")
    public ResponseEntity<ProfileCompletionResponse> completeFreelancerProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CompleteFreelancerProfileRequest request) {
        UUID userId = currentUser.getId();
        ProfileCompletionResponse response = onboardingService.completeFreelancerProfile(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/complete-client")
    @PreAuthorize("hasAnyRole('CLIENT')")
    @Operation(summary = "Complete client profile", description = "Complete the client profile with mandatory fields: location, phone, and avatar")
    public ResponseEntity<ProfileCompletionResponse> completeClientProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CompleteClientProfileRequest request) {
        UUID userId = currentUser.getId();
        ProfileCompletionResponse response = onboardingService.completeClientProfile(userId, request);
        return ResponseEntity.ok(response);
    }
}
