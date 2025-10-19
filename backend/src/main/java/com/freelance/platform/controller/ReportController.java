package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CreateReportRequest;
import com.freelance.platform.dto.response.ReportResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "APIs for reporting system")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    @Operation(summary = "Get reports", description = "Get paginated list of reports")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reports retrieved successfully")
    })
    public ResponseEntity<Page<ReportResponse>> getReports(
            @Parameter(description = "Report status") @RequestParam(required = false) String status,
            @Parameter(description = "Report category") @RequestParam(required = false) String category,
            @Parameter(description = "Reporter ID") @RequestParam(required = false) UUID reporterId,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ReportResponse> reports = reportService.getReports(status, category, reporterId, pageable, currentUser.getId());
        return ResponseEntity.ok(reports);
    }

    @PostMapping
    @Operation(summary = "Create report", description = "Create a new report")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Report created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody CreateReportRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = reportService.createReport(request, currentUser.getId());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get report by ID", description = "Get a specific report by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<ReportResponse> getReport(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = reportService.getReport(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update report status", description = "Update report status (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report status updated successfully"),
            @ApiResponse(responseCode = "403", description = "Admin access required"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> updateReportStatus(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestBody Map<String, Object> statusData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = reportService.updateReportStatus(id, statusData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/types")
    @Operation(summary = "Get report types", description = "Get available report types")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report types retrieved successfully")
    })
    public ResponseEntity<List<Map<String, Object>>> getReportTypes() {
        
        List<Map<String, Object>> types = reportService.getReportTypes();
        return ResponseEntity.ok(types);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get report categories", description = "Get available report categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report categories retrieved successfully")
    })
    public ResponseEntity<List<Map<String, Object>>> getReportCategories() {
        
        List<Map<String, Object>> categories = reportService.getReportCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/my-reports")
    @Operation(summary = "Get my reports", description = "Get reports created by the authenticated user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User reports retrieved successfully")
    })
    public ResponseEntity<Page<ReportResponse>> getMyReports(
            @Parameter(description = "Report status") @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ReportResponse> reports = reportService.getUserReports(currentUser.getId(), status, pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get report statistics", description = "Get report statistics (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report statistics retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<Map<String, Object>> getReportStatistics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> statistics = reportService.getReportStatistics(currentUser.getId());
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/{id}/resolve")
    @Operation(summary = "Resolve report", description = "Resolve a report (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report resolved successfully"),
            @ApiResponse(responseCode = "403", description = "Admin access required"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> resolveReport(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestBody Map<String, Object> resolutionData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = reportService.resolveReport(id, resolutionData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/dismiss")
    @Operation(summary = "Dismiss report", description = "Dismiss a report (admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Report dismissed successfully"),
            @ApiResponse(responseCode = "403", description = "Admin access required"),
            @ApiResponse(responseCode = "404", description = "Report not found")
    })
    public ResponseEntity<ReportResponse> dismissReport(
            @Parameter(description = "Report ID") @PathVariable UUID id,
            @RequestBody Map<String, Object> dismissalData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ReportResponse response = reportService.dismissReport(id, dismissalData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search reports", description = "Search reports by content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Page<ReportResponse>> searchReports(
            @Parameter(description = "Search query") @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ReportResponse> reports = reportService.searchReports(query, pageable, currentUser.getId());
        return ResponseEntity.ok(reports);
    }
}
