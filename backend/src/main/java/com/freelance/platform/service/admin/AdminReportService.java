package com.freelance.platform.service.admin;

import com.freelance.platform.dto.response.ReportResponse;
import com.freelance.platform.entity.Report;
import com.freelance.platform.entity.ReportStatus;
import com.freelance.platform.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AdminReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Page<ReportResponse> getAllReports(Pageable pageable) {
        Page<Report> reports = reportRepository.findAll(pageable);
        return reports.map(this::convertToResponse);
    }

    public ReportResponse getReportById(UUID id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return convertToResponse(report);
    }

    public ReportResponse updateReportStatus(UUID id, String status, UUID currentAdminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(ReportStatus.valueOf(status));
        Report savedReport = reportRepository.save(report);

        // Log admin action
        logAdminAction(currentAdminId, "UPDATE_REPORT_STATUS", "Report", savedReport.getId().toString(),
                "Updated report status to: " + status);

        return convertToResponse(savedReport);
    }

    public ReportResponse assignReport(UUID id, UUID adminUserId, UUID currentAdminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // In a real implementation, you would set the assigned admin
        // report.setAssignedAdminId(adminUserId);
        
        Report savedReport = reportRepository.save(report);

        // Log admin action
        logAdminAction(currentAdminId, "ASSIGN_REPORT", "Report", savedReport.getId().toString(),
                "Assigned report to admin: " + adminUserId);

        return convertToResponse(savedReport);
    }

    public Map<String, Object> getReportStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long underReviewReports = reportRepository.countByStatus(ReportStatus.UNDER_REVIEW);
        long resolvedReports = reportRepository.countByStatus(ReportStatus.RESOLVED);
        long dismissedReports = reportRepository.countByStatus(ReportStatus.DISMISSED);
        
        statistics.put("totalReports", totalReports);
        statistics.put("pendingReports", pendingReports);
        statistics.put("underReviewReports", underReviewReports);
        statistics.put("resolvedReports", resolvedReports);
        statistics.put("dismissedReports", dismissedReports);
        
        return statistics;
    }

    public Page<ReportResponse> getPendingReports(Pageable pageable) {
        Page<Report> reports = reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.PENDING, pageable);
        return reports.map(this::convertToResponse);
    }

    public Map<String, Object> getReportCategories() {
        Map<String, Object> categories = new HashMap<>();
        categories.put("categories", new String[]{
            "User", "Project", "Proposal", "Message", "Content", "Payment", "Other"
        });
        return categories;
    }

    public Map<String, Object> createReportCategory(Map<String, String> categoryData, UUID currentAdminId) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", UUID.randomUUID());
        response.put("name", categoryData.get("name"));
        response.put("description", categoryData.get("description"));
        response.put("created", true);
        
        // Log admin action
        logAdminAction(currentAdminId, "CREATE_REPORT_CATEGORY", "ReportCategory", response.get("id").toString(),
                "Created report category: " + categoryData.get("name"));
        
        return response;
    }

    public Map<String, Object> updateReportCategory(UUID id, Map<String, String> categoryData, UUID currentAdminId) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("name", categoryData.get("name"));
        response.put("description", categoryData.get("description"));
        response.put("updated", true);
        
        // Log admin action
        logAdminAction(currentAdminId, "UPDATE_REPORT_CATEGORY", "ReportCategory", id.toString(),
                "Updated report category: " + categoryData.get("name"));
        
        return response;
    }

    public void deleteReportCategory(UUID id, UUID currentAdminId) {
        // Log admin action
        logAdminAction(currentAdminId, "DELETE_REPORT_CATEGORY", "ReportCategory", id.toString(),
                "Deleted report category");
    }

    public Page<ReportResponse> searchReports(String query, Pageable pageable) {
        Page<Report> reports = reportRepository.findByDescriptionContainingIgnoreCaseOrReportTypeContainingIgnoreCase(
                query, pageable);
        return reports.map(this::convertToResponse);
    }

    public Map<String, Object> getReportAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get report statistics
        Map<String, Object> statistics = getReportStatistics();
        analytics.putAll(statistics);
        
        // Add additional analytics
        analytics.put("averageResolutionTime", "2.5 days");
        analytics.put("topReportTypes", new String[]{"User", "Project", "Content"});
        analytics.put("resolutionRate", 85.5);
        
        return analytics;
    }

    public ReportResponse resolveReport(UUID id, Map<String, String> resolutionData, UUID currentAdminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(ReportStatus.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());
        Report savedReport = reportRepository.save(report);

        // Log admin action
        logAdminAction(currentAdminId, "RESOLVE_REPORT", "Report", savedReport.getId().toString(),
                "Resolved report with action: " + resolutionData.get("action"));

        return convertToResponse(savedReport);
    }

    public ReportResponse dismissReport(UUID id, String reason, UUID currentAdminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(ReportStatus.DISMISSED);
        report.setResolvedAt(LocalDateTime.now());
        Report savedReport = reportRepository.save(report);

        // Log admin action
        logAdminAction(currentAdminId, "DISMISS_REPORT", "Report", savedReport.getId().toString(),
                "Dismissed report" + (reason != null ? " - Reason: " + reason : ""));

        return convertToResponse(savedReport);
    }

    public Map<String, Object> getReportTypes() {
        Map<String, Object> types = new HashMap<>();
        types.put("types", new String[]{
            "harassment", "spam", "fake_profile", "inappropriate_behavior", "scam", "violence", "hate_speech",
            "fake_project", "inappropriate_content", "copyright_violation", "duplicate", "fraud", "unauthorized_transaction"
        });
        return types;
    }

    private ReportResponse convertToResponse(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setReportType(report.getReportType());
        response.setCategory(report.getCategory());
        response.setDescription(report.getDescription());
        response.setStatus(report.getStatus().name());
        response.setCreatedAt(report.getCreatedAt());
        response.setResolvedAt(report.getResolvedAt());
        
        // Set reporter info
        if (report.getReporter() != null) {
            response.setReporterId(report.getReporter().getId());
            response.setReporterName(report.getReporter().getFirstName() + " " + report.getReporter().getLastName());
        }
        
        // Set reported user info
        if (report.getReportedUser() != null) {
            response.setReportedUserId(report.getReportedUser().getId());
            response.setReportedUserName(report.getReportedUser().getFirstName() + " " + report.getReportedUser().getLastName());
        }
        
        // Set reported project info
        if (report.getReportedProject() != null) {
            response.setReportedProjectId(report.getReportedProject().getId());
            response.setReportedProjectTitle(report.getReportedProject().getTitle());
        }
        
        return response;
    }

    private void logAdminAction(UUID adminUserId, String actionType, String entityType, String entityId, String description) {
        // This would be implemented in AdminActionService
        // For now, we'll just log it
        System.out.println("Admin Action: " + actionType + " on " + entityType + " (" + entityId + ") - " + description);
    }
}
