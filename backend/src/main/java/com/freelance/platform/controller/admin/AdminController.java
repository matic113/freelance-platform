package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.response.AdminDashboardResponse;
import com.freelance.platform.entity.AdminAction;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.UserService;
import com.freelance.platform.service.admin.AdminActionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin Management", description = "APIs for admin management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminActionService adminActionService;

    @Autowired
    private UserService userService;

    @Autowired
    private com.freelance.platform.service.admin.AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data", description = "Get comprehensive dashboard statistics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<AdminDashboardResponse> getDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        AdminDashboardResponse response = adminAnalyticsService.getDashboardData();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Get paginated list of all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<Page<User>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Page<User> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/search")
    @Operation(summary = "Search users", description = "Search users by name or email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<Page<User>> searchUsers(
            @RequestParam String searchTerm,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Page<User> users = userService.searchUsers(searchTerm, pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get user by ID", description = "Get user details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<User> getUserById(
            @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.findByIdOptional(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/actions")
    @Operation(summary = "Get admin actions", description = "Get paginated list of admin actions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin actions retrieved successfully")
    })
    public ResponseEntity<Page<AdminAction>> getAdminActions(
            @PageableDefault(size = 50) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Page<AdminAction> response = adminActionService.getAdminActions(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/actions/admin/{adminId}")
    @Operation(summary = "Get admin actions by admin", description = "Get actions performed by a specific admin")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Admin actions retrieved successfully")
    })
    public ResponseEntity<Page<AdminAction>> getAdminActionsByAdmin(
            @PathVariable UUID adminId,
            @PageableDefault(size = 50) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Page<AdminAction> response = adminActionService.getAdminActionsByAdmin(adminId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/actions/recent")
    @Operation(summary = "Get recent admin actions", description = "Get recent admin actions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recent admin actions retrieved successfully")
    })
    public ResponseEntity<List<AdminAction>> getRecentAdminActions(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<AdminAction> response = adminActionService.getRecentAdminActions(10);
        return ResponseEntity.ok(response);
    }
}
