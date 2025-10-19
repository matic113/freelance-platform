package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.response.ReportResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.admin.AdminReportService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/reports")
@Tag(name = "Admin Report Management", description = "APIs for managing reports from admin panel")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController {

    @Autowired
    private AdminReportService adminReportService;

    @GetMapping
    @Operation(summary = "Get all reports", description = "Get paginated list of all reports")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reports retrieved successfully")
    })
    public ResponseEntity<Page<ReportResponse>> getAllReports(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ReportResponse> response = adminReportService.getAllReports(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get report by ID", description = "Get report details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> getReportById(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = adminReportService.getReportById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update report status", description = "Update report status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> updateReportStatus(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestParam String status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = adminReportService.updateReportStatus(id, status, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Assign report", description = "Assign report to admin user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report assigned successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> assignReport(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestParam UUID adminUserId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = adminReportService.assignReport(id, adminUserId, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get report statistics", description = "Get report statistics for admin dashboard")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getReportStatistics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> statistics = adminReportService.getReportStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending reports", description = "Get reports pending review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pending reports retrieved successfully")
    })
    public ResponseEntity<Page<ReportResponse>> getPendingReports(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ReportResponse> response = adminReportService.getPendingReports(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get report categories", description = "Get all report categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report categories retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getReportCategories(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> categories = adminReportService.getReportCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/categories")
    @Operation(summary = "Create report category", description = "Create a new report category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Report category created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Map<String, Object>> createReportCategory(
            @RequestBody Map<String, String> categoryData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminReportService.createReportCategory(categoryData, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update report category", description = "Update report category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report category updated successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<Map<String, Object>> updateReportCategory(
            @Parameter(description = "Category ID") @PathVariable UUID id,
            @RequestBody Map<String, String> categoryData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminReportService.updateReportCategory(id, categoryData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete report category", description = "Delete report category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Report category deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<Void> deleteReportCategory(
            @Parameter(description = "Category ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        adminReportService.deleteReportCategory(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search reports", description = "Search reports by content or reporter")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Page<ReportResponse>> searchReports(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ReportResponse> response = adminReportService.searchReports(query, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get report analytics", description = "Get detailed report analytics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getReportAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> analytics = adminReportService.getReportAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/{id}/resolve")
    @Operation(summary = "Resolve report", description = "Mark report as resolved with action taken")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report resolved successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> resolveReport(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestBody Map<String, String> resolutionData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = adminReportService.resolveReport(id, resolutionData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/dismiss")
    @Operation(summary = "Dismiss report", description = "Dismiss report as invalid or unfounded")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report dismissed successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> dismissReport(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = adminReportService.dismissReport(id, reason, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/types")
    @Operation(summary = "Get report types", description = "Get all available report types")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report types retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getReportTypes(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> types = adminReportService.getReportTypes();
        return ResponseEntity.ok(types);
    }
}
