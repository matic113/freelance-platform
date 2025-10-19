package com.freelance.platform.controller;

import com.freelance.platform.dto.request.AddPaymentMethodRequest;
import com.freelance.platform.dto.request.UpdateBillingSettingsRequest;
import com.freelance.platform.dto.request.UpdateNotificationSettingsRequest;
import com.freelance.platform.dto.response.BillingSettingsResponse;
import com.freelance.platform.dto.response.FreelancerCardResponse;
import com.freelance.platform.dto.response.NotificationSettingsResponse;
import com.freelance.platform.dto.response.PaymentMethodResponse;
import com.freelance.platform.dto.response.UserResponse;
import com.freelance.platform.entity.User;
import com.freelance.platform.service.AuthService;
import com.freelance.platform.service.BillingSettingsService;
import com.freelance.platform.service.NotificationSettingsService;
import com.freelance.platform.service.UserService;
import com.freelance.platform.service.UserService.UserNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "User management APIs")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private NotificationSettingsService notificationSettingsService;

    @Autowired
    private BillingSettingsService billingSettingsService;

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile", description = "Get the profile of the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<UserResponse> getCurrentUserProfile() {
        User currentUser = authService.getCurrentUser();
        UserResponse response = convertToUserResponse(currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Get user information by user ID")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        User user = userService.findById(id);
        UserResponse response = convertToUserResponse(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update the profile of the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UserResponse userResponse) {
        User currentUser = authService.getCurrentUser();

        // Update user fields
        currentUser.setFirstName(userResponse.getFirstName());
        currentUser.setLastName(userResponse.getLastName());
        currentUser.setPhone(userResponse.getPhone());
        currentUser.setCountry(userResponse.getCountry());
        currentUser.setCity(userResponse.getCity());
        currentUser.setTimezone(userResponse.getTimezone());
        currentUser.setLanguage(userResponse.getLanguage());

        // Update freelancer profile bio if user is a freelancer
        if (currentUser.isFreelancer() && userResponse.getBio() != null) {
            if (currentUser.getFreelancerProfile() == null) {
                // Create freelancer profile if it doesn't exist
                currentUser.setFreelancerProfile(new com.freelance.platform.entity.FreelancerProfile(currentUser));
            }
            currentUser.getFreelancerProfile().setBio(userResponse.getBio());
        }

        User updatedUser = userService.save(currentUser);
        UserResponse response = convertToUserResponse(updatedUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/switch-role")
    @Operation(summary = "Switch user role", description = "Switch between CLIENT and FREELANCER roles for the current user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<UserResponse> switchUserRole(@RequestParam String newRole) throws UserNotFoundException {
        User currentUser = authService.getCurrentUser();

        // Update user type
        User updatedUser = userService.switchUserRole(currentUser.getId(), newRole);
        UserResponse response = convertToUserResponse(updatedUser);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/avatar")
    @Operation(summary = "Update user avatar", description = "Update the avatar URL of the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<UserResponse> updateAvatar(@RequestParam String avatarUrl) {
        User currentUser = authService.getCurrentUser();
        currentUser.setAvatarUrl(avatarUrl);

        User updatedUser = userService.save(currentUser);
        UserResponse response = convertToUserResponse(updatedUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/password")
    @Operation(summary = "Change password", description = "Change the password of the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> passwordData) {
        User currentUser = authService.getCurrentUser();
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Current password and new password are required");
        }

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, currentUser.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        // Update password
        currentUser.setPasswordHash(passwordEncoder.encode(newPassword));
        userService.save(currentUser);

        return ResponseEntity.ok("Password changed successfully");
    }

    @DeleteMapping("/profile")
    @Operation(summary = "Delete account", description = "Soft delete the currently authenticated user's account")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<String> deleteAccount(@RequestBody Map<String, String> confirmationData) {
        User currentUser = authService.getCurrentUser();
        String password = confirmationData.get("password");

        if (password == null) {
            return ResponseEntity.badRequest().body("Password confirmation is required");
        }

        // Verify password
        if (!passwordEncoder.matches(password, currentUser.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Password is incorrect");
        }

        // Soft delete user (sets deletedAt timestamp and isActive to false)
        userService.deleteById(currentUser.getId());

        // Clear the security context to log out the user
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Account deleted successfully. You have been logged out.");
    }

    @GetMapping("/profile/notification-settings")
    @Operation(summary = "Get notification settings", description = "Get notification settings for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<NotificationSettingsResponse> getNotificationSettings() {
        User currentUser = authService.getCurrentUser();
        NotificationSettingsResponse settings = notificationSettingsService.getNotificationSettings(currentUser.getId());
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/profile/notification-settings")
    @Operation(summary = "Update notification settings", description = "Update notification settings for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<NotificationSettingsResponse> updateNotificationSettings(@RequestBody UpdateNotificationSettingsRequest request) {
        User currentUser = authService.getCurrentUser();
        NotificationSettingsResponse settings = notificationSettingsService.updateNotificationSettings(currentUser.getId(), request);
        return ResponseEntity.ok(settings);
    }

    // Billing Settings Endpoints
    @GetMapping("/profile/billing-settings")
    @Operation(summary = "Get billing settings", description = "Get billing settings for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<BillingSettingsResponse> getBillingSettings() {
        User currentUser = authService.getCurrentUser();
        BillingSettingsResponse settings = billingSettingsService.getBillingSettings(currentUser.getId());
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/profile/billing-settings")
    @Operation(summary = "Update billing settings", description = "Update billing settings for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<BillingSettingsResponse> updateBillingSettings(@RequestBody UpdateBillingSettingsRequest request) {
        User currentUser = authService.getCurrentUser();
        BillingSettingsResponse settings = billingSettingsService.updateBillingSettings(currentUser.getId(), request);
        return ResponseEntity.ok(settings);
    }

    // Payment Method Endpoints
    @GetMapping("/profile/payment-methods")
    @Operation(summary = "Get payment methods", description = "Get all payment methods for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<List<PaymentMethodResponse>> getPaymentMethods() {
        User currentUser = authService.getCurrentUser();
        List<PaymentMethodResponse> paymentMethods = billingSettingsService.getPaymentMethods(currentUser.getId());
        return ResponseEntity.ok(paymentMethods);
    }

    @PostMapping("/profile/payment-methods")
    @Operation(summary = "Add payment method", description = "Add a new payment method for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<PaymentMethodResponse> addPaymentMethod(@RequestBody AddPaymentMethodRequest request) {
        User currentUser = authService.getCurrentUser();
        PaymentMethodResponse paymentMethod = billingSettingsService.addPaymentMethod(currentUser.getId(), request);
        return ResponseEntity.ok(paymentMethod);
    }

    @PutMapping("/profile/payment-methods/{paymentMethodId}/default")
    @Operation(summary = "Set default payment method", description = "Set a payment method as default for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<PaymentMethodResponse> setDefaultPaymentMethod(@PathVariable UUID paymentMethodId) {
        User currentUser = authService.getCurrentUser();
        PaymentMethodResponse paymentMethod = billingSettingsService.setDefaultPaymentMethod(currentUser.getId(), paymentMethodId);
        return ResponseEntity.ok(paymentMethod);
    }

    @DeleteMapping("/profile/payment-methods/{paymentMethodId}")
    @Operation(summary = "Delete payment method", description = "Delete a payment method for the currently authenticated user")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<String> deletePaymentMethod(@PathVariable UUID paymentMethodId) {
        User currentUser = authService.getCurrentUser();
        billingSettingsService.deletePaymentMethod(currentUser.getId(), paymentMethodId);
        return ResponseEntity.ok("Payment method deleted successfully");
    }

    @GetMapping("/search-for-messaging")
    @Operation(summary = "Search users for messaging", description = "Search users by email for starting conversations - returns only essential info")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<Page<UserResponse>> searchUsersForMessaging(
            @RequestParam String searchTerm,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<User> users = userService.searchUsers(searchTerm, pageable);
        Page<UserResponse> userResponses = users.map(this::convertToUserResponseForMessaging);

        return ResponseEntity.ok(userResponses);
    }

    @GetMapping("/search")
    @Operation(summary = "Search users (Admin only)", description = "Search users by name or email - ADMIN ONLY with full details")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam String searchTerm,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<User> users = userService.searchUsers(searchTerm, pageable);
        Page<UserResponse> userResponses = users.map(this::convertToUserResponse);

        return ResponseEntity.ok(userResponses);
    }

    @GetMapping("/freelancers")
    @Operation(summary = "Get all freelancers", description = "Get all freelancers with pagination")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<Page<UserResponse>> getAllFreelancers(
            @PageableDefault(size = 20) Pageable pageable) {

        Page<User> freelancers = userService.findAllFreelancers(pageable);
        Page<UserResponse> freelancerResponses = freelancers.map(this::convertToUserResponse);

        return ResponseEntity.ok(freelancerResponses);
    }

    @GetMapping("/freelancers/cards")
    @Operation(summary = "Get freelancer cards", description = "Get all freelancers with complete profile data for card display")
    @PreAuthorize("hasRole('CLIENT') or hasRole('FREELANCER')")
    public ResponseEntity<Page<FreelancerCardResponse>> getFreelancerCards(
            @PageableDefault(size = 20) Pageable pageable) {

        Page<User> freelancers = userService.findAllFreelancers(pageable);
        Page<FreelancerCardResponse> freelancerCards = freelancers.map(this::convertToFreelancerCardResponse);

        return ResponseEntity.ok(freelancerCards);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRoles(user.getRoles());
        response.setActiveRole(user.getActiveRole());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setPhone(user.getPhone());
        response.setCountry(user.getCountry());
        response.setCity(user.getCity());
        response.setTimezone(user.getTimezone());
        response.setLanguage(user.getLanguage());
        response.setIsVerified(user.getIsVerified());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        // Include bio from freelancer profile if user is a freelancer
        if (user.isFreelancer() && user.getFreelancerProfile() != null) {
            response.setBio(user.getFreelancerProfile().getBio());
        }

        return response;
    }

    private UserResponse convertToUserResponseForMessaging(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setAvatarUrl(user.getAvatarUrl());
        return response;
    }

    private FreelancerCardResponse convertToFreelancerCardResponse(User user) {
        FreelancerCardResponse response = new FreelancerCardResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setCity(user.getCity());
        response.setCountry(user.getCountry());
        response.setIsVerified(user.getIsVerified());
        response.setIsActive(user.getIsActive());

        // Include freelancer profile data
        if (user.isFreelancer() && user.getFreelancerProfile() != null) {
            com.freelance.platform.entity.FreelancerProfile profile = user.getFreelancerProfile();
            response.setBio(profile.getBio());
            response.setHourlyRate(profile.getHourlyRate());
            response.setRating(profile.getRating());
            response.setTotalReviews(profile.getTotalReviews());
            response.setTotalProjects(profile.getTotalProjects());
            response.setAvailability(profile.getAvailability());
            response.setExperienceLevel(profile.getExperienceLevel());

            // Convert skills
            if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
                response.setSkills(profile.getSkills().stream()
                        .map(fs -> fs.getSkill() != null ? fs.getSkill().getName() : "")
                        .toList());
            }
        }

        return response;
    }
}
