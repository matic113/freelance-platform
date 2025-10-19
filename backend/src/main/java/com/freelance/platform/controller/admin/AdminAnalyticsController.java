package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.response.AnalyticsResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.admin.AdminAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@Tag(name = "Admin Analytics", description = "APIs for admin analytics and reporting")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data", description = "Get comprehensive dashboard statistics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard data retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<Map<String, Object>> getDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminAnalyticsService.getDashboard();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    @Operation(summary = "Get user analytics", description = "Get user growth and statistics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User analytics retrieved successfully")
    })
    public ResponseEntity<AnalyticsResponse> getUserAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        AnalyticsResponse response = adminAnalyticsService.getUserAnalytics();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects")
    @Operation(summary = "Get project analytics", description = "Get project statistics and trends")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project analytics retrieved successfully")
    })
    public ResponseEntity<AnalyticsResponse> getProjectAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        AnalyticsResponse response = adminAnalyticsService.getProjectAnalytics();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue")
    @Operation(summary = "Get revenue analytics", description = "Get revenue statistics and trends")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Revenue analytics retrieved successfully")
    })
    public ResponseEntity<AnalyticsResponse> getRevenueAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        AnalyticsResponse response = adminAnalyticsService.getRevenueAnalytics();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/performance")
    @Operation(summary = "Get performance metrics", description = "Get platform performance metrics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Performance metrics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> metrics = adminAnalyticsService.getPerformanceMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/geographic")
    @Operation(summary = "Get geographic analytics", description = "Get user distribution by location")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Geographic analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getGeographicAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        AnalyticsResponse analyticsResponse = adminAnalyticsService.getGeographicAnalytics();
        return ResponseEntity.ok(analyticsResponse.getData());
    }

    @GetMapping("/trends")
    @Operation(summary = "Get trend analytics", description = "Get platform trends and patterns")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Trend analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getTrendAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> trends = adminAnalyticsService.getTrendAnalytics();
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/custom-reports")
    @Operation(summary = "Get custom reports", description = "Get list of custom reports")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Custom reports retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getCustomReports(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> reports = adminAnalyticsService.getCustomReports();
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/custom-reports")
    @Operation(summary = "Create custom report", description = "Create a new custom report")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Custom report created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Map<String, Object>> createCustomReport(
            @RequestBody Map<String, Object> reportData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminAnalyticsService.createCustomReport(reportData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/export")
    @Operation(summary = "Export analytics data", description = "Export analytics data in various formats")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data exported successfully")
    })
    public ResponseEntity<Map<String, Object>> exportAnalytics(
            @RequestParam String format,
            @RequestParam(required = false) String dateRange,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminAnalyticsService.exportAnalytics(format, dateRange, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/real-time")
    @Operation(summary = "Get real-time metrics", description = "Get real-time platform metrics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Real-time metrics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getRealTimeMetrics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> metrics = adminAnalyticsService.getRealTimeMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/comparison")
    @Operation(summary = "Get comparison analytics", description = "Get period-over-period comparison")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comparison analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getComparisonAnalytics(
            @RequestParam String period1,
            @RequestParam String period2,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> comparison = adminAnalyticsService.getComparisonAnalytics(period1, period2);
        return ResponseEntity.ok(comparison);
    }

    @GetMapping("/predictions")
    @Operation(summary = "Get predictive analytics", description = "Get predictive analytics and forecasts")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Predictive analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getPredictiveAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> predictions = adminAnalyticsService.getPredictiveAnalytics();
        return ResponseEntity.ok(predictions);
    }
}
