package com.freelance.platform.controller;

import com.freelance.platform.dto.response.AnalyticsResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "APIs for user analytics and statistics")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard/{userId}")
    @Operation(summary = "Get user dashboard analytics", description = "Get comprehensive dashboard statistics for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard analytics retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Access denied"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<AnalyticsResponse> getUserDashboard(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId) && !currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        AnalyticsResponse response = analyticsService.getUserDashboardAnalytics(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects/stats")
    @Operation(summary = "Get project statistics", description = "Get project-related statistics for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getProjectStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> stats = analyticsService.getProjectStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/freelancers/stats")
    @Operation(summary = "Get freelancer statistics", description = "Get freelancer-related statistics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Freelancer statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getFreelancerStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> stats = analyticsService.getFreelancerStats(currentUser.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/earnings/{userId}")
    @Operation(summary = "Get earnings analytics", description = "Get earnings statistics for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Earnings analytics retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getEarningsAnalytics(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId) && !currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> analytics = analyticsService.getEarningsAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/performance/{userId}")
    @Operation(summary = "Get performance analytics", description = "Get performance metrics for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Performance analytics retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getPerformanceAnalytics(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId) && !currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> analytics = analyticsService.getPerformanceAnalytics(userId);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/trends")
    @Operation(summary = "Get trend analytics", description = "Get platform trends and patterns")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Trend analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getTrendAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> trends = analyticsService.getTrendAnalytics(currentUser.getId());
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get revenue analytics", description = "Get revenue statistics for the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Revenue analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> analytics = analyticsService.getRevenueAnalytics(currentUser.getId());
        return ResponseEntity.ok(analytics);
    }
}
