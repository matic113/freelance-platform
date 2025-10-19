package com.freelance.platform.controller;

import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "APIs for user settings management")
@SecurityRequirement(name = "bearerAuth")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping("/profile/{userId}")
    @Operation(summary = "Get user profile settings", description = "Get profile settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile settings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<Map<String, Object>> getProfileSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> settings = settingsService.getProfileSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/profile/{userId}")
    @Operation(summary = "Update user profile settings", description = "Update profile settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updateProfileSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Valid @RequestBody Map<String, Object> settingsData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> updatedSettings = settingsService.updateProfileSettings(userId, settingsData);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/notifications/{userId}")
    @Operation(summary = "Get notification settings", description = "Get notification preferences for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification settings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getNotificationSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> settings = settingsService.getNotificationSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/notifications/{userId}")
    @Operation(summary = "Update notification settings", description = "Update notification preferences for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updateNotificationSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Valid @RequestBody Map<String, Object> settingsData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> updatedSettings = settingsService.updateNotificationSettings(userId, settingsData);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/privacy/{userId}")
    @Operation(summary = "Get privacy settings", description = "Get privacy settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Privacy settings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getPrivacySettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> settings = settingsService.getPrivacySettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/privacy/{userId}")
    @Operation(summary = "Update privacy settings", description = "Update privacy settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Privacy settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updatePrivacySettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Valid @RequestBody Map<String, Object> settingsData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> updatedSettings = settingsService.updatePrivacySettings(userId, settingsData);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/security/{userId}")
    @Operation(summary = "Get security settings", description = "Get security settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Security settings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getSecuritySettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> settings = settingsService.getSecuritySettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/security/{userId}")
    @Operation(summary = "Update security settings", description = "Update security settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Security settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updateSecuritySettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Valid @RequestBody Map<String, Object> settingsData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> updatedSettings = settingsService.updateSecuritySettings(userId, settingsData);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/billing/{userId}")
    @Operation(summary = "Get billing settings", description = "Get billing settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Billing settings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getBillingSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> settings = settingsService.getBillingSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/billing/{userId}")
    @Operation(summary = "Update billing settings", description = "Update billing settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Billing settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updateBillingSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Valid @RequestBody Map<String, Object> settingsData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> updatedSettings = settingsService.updateBillingSettings(userId, settingsData);
        return ResponseEntity.ok(updatedSettings);
    }

    @GetMapping("/integrations/{userId}")
    @Operation(summary = "Get integration settings", description = "Get integration settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Integration settings retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getIntegrationSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> settings = settingsService.getIntegrationSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/integrations/{userId}")
    @Operation(summary = "Update integration settings", description = "Update integration settings for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Integration settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updateIntegrationSettings(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Valid @RequestBody Map<String, Object> settingsData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> updatedSettings = settingsService.updateIntegrationSettings(userId, settingsData);
        return ResponseEntity.ok(updatedSettings);
    }
}
