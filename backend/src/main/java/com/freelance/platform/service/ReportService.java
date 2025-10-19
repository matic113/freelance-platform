package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreateReportRequest;
import com.freelance.platform.dto.response.ReportResponse;
import com.freelance.platform.entity.Report;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ReportRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<ReportResponse> getReports(String status, String category, UUID reporterId, Pageable pageable, UUID currentUserId) {
        // Check if user has permission to view reports
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Report> reports;
        
        // If user is admin, show all reports
        if (isAdmin(currentUser)) {
            reports = reportRepository.findReportsWithFilters(status, category, reporterId, pageable);
        } else {
            // Regular users can only see their own reports
            reports = reportRepository.findByReporterIdOrderByCreatedAtDesc(currentUserId, pageable);
        }
        
        return reports.map(this::convertToResponse);
    }

    public ReportResponse createReport(CreateReportRequest request, UUID reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportType(request.getReportType());
        report.setCategory(request.getCategory());
        report.setDescription(request.getDescription());
        report.setStatus(com.freelance.platform.entity.ReportStatus.PENDING);
        report.setCreatedAt(LocalDateTime.now());

        // Set reported entities if provided
        if (request.getReportedUserId() != null) {
            User reportedUser = userRepository.findById(UUID.fromString(request.getReportedUserId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Reported user not found"));
            report.setReportedUser(reportedUser);
        }

        Report savedReport = reportRepository.save(report);
        return convertToResponse(savedReport);
    }

    public ReportResponse getReport(UUID id, UUID currentUserId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user can view this report
        if (!isAdmin(currentUser) && !report.getReporter().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You are not authorized to view this report");
        }

        return convertToResponse(report);
    }

    public ReportResponse updateReportStatus(UUID id, Map<String, Object> statusData, UUID adminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!isAdmin(admin)) {
            throw new UnauthorizedException("Admin access required");
        }

        if (statusData.containsKey("status")) {
            String status = (String) statusData.get("status");
            report.setStatus(com.freelance.platform.entity.ReportStatus.valueOf(status));
        }

        if (statusData.containsKey("adminNotes")) {
            report.setAdminNotes((String) statusData.get("adminNotes"));
        }

        report.setResolvedAt(LocalDateTime.now());

        Report savedReport = reportRepository.save(report);
        return convertToResponse(savedReport);
    }

    public List<Map<String, Object>> getReportTypes() {
        List<Map<String, Object>> types = new ArrayList<>();
        
        Map<String, Object> type1 = new HashMap<>();
        type1.put("value", "USER");
        type1.put("label", "User");
        type1.put("description", "Report inappropriate user behavior");
        types.add(type1);
        
        Map<String, Object> type2 = new HashMap<>();
        type2.put("value", "PROJECT");
        type2.put("label", "Project");
        type2.put("description", "Report inappropriate project content");
        types.add(type2);
        
        Map<String, Object> type3 = new HashMap<>();
        type3.put("value", "PROPOSAL");
        type3.put("label", "Proposal");
        type3.put("description", "Report inappropriate proposal content");
        types.add(type3);
        
        Map<String, Object> type4 = new HashMap<>();
        type4.put("value", "MESSAGE");
        type4.put("label", "Message");
        type4.put("description", "Report inappropriate messages");
        types.add(type4);
        
        Map<String, Object> type5 = new HashMap<>();
        type5.put("value", "CONTENT");
        type5.put("label", "Content");
        type5.put("description", "Report inappropriate content");
        types.add(type5);
        
        Map<String, Object> type6 = new HashMap<>();
        type6.put("value", "PAYMENT");
        type6.put("label", "Payment");
        type6.put("description", "Report payment-related issues");
        types.add(type6);
        
        Map<String, Object> type7 = new HashMap<>();
        type7.put("value", "OTHER");
        type7.put("label", "Other");
        type7.put("description", "Report other issues");
        types.add(type7);
        
        return types;
    }

    public List<Map<String, Object>> getReportCategories() {
        List<Map<String, Object>> categories = new ArrayList<>();
        
        Map<String, Object> category1 = new HashMap<>();
        category1.put("value", "harassment");
        category1.put("label", "Harassment");
        category1.put("description", "Harassment or bullying behavior");
        categories.add(category1);
        
        Map<String, Object> category2 = new HashMap<>();
        category2.put("value", "spam");
        category2.put("label", "Spam");
        category2.put("description", "Spam or unwanted content");
        categories.add(category2);
        
        Map<String, Object> category3 = new HashMap<>();
        category3.put("value", "fake_profile");
        category3.put("label", "Fake Profile");
        category3.put("description", "Fake or fraudulent profile");
        categories.add(category3);
        
        Map<String, Object> category4 = new HashMap<>();
        category4.put("value", "inappropriate_content");
        category4.put("label", "Inappropriate Content");
        category4.put("description", "Inappropriate or offensive content");
        categories.add(category4);
        
        Map<String, Object> category5 = new HashMap<>();
        category5.put("value", "scam");
        category5.put("label", "Scam");
        category5.put("description", "Scam or fraudulent activity");
        categories.add(category5);
        
        Map<String, Object> category6 = new HashMap<>();
        category6.put("value", "copyright_violation");
        category6.put("label", "Copyright Violation");
        category6.put("description", "Copyright or intellectual property violation");
        categories.add(category6);
        
        return categories;
    }

    public Page<ReportResponse> getUserReports(UUID userId, String status, Pageable pageable) {
        Page<Report> reports = reportRepository.findByReporterIdOrderByCreatedAtDesc(userId, pageable);
        
        return reports.map(this::convertToResponse);
    }

    public Map<String, Object> getReportStatistics(UUID adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!isAdmin(admin)) {
            throw new UnauthorizedException("Admin access required");
        }

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalReports", reportRepository.count());
        statistics.put("pendingReports", reportRepository.countByStatus(com.freelance.platform.entity.ReportStatus.PENDING));
        statistics.put("resolvedReports", reportRepository.countByStatus(com.freelance.platform.entity.ReportStatus.RESOLVED));
        statistics.put("dismissedReports", reportRepository.countByStatus(com.freelance.platform.entity.ReportStatus.DISMISSED));
        
        return statistics;
    }

    public ReportResponse resolveReport(UUID id, Map<String, Object> resolutionData, UUID adminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!isAdmin(admin)) {
            throw new UnauthorizedException("Admin access required");
        }

        report.setStatus(com.freelance.platform.entity.ReportStatus.RESOLVED);
        report.setResolvedAt(LocalDateTime.now());

        if (resolutionData.containsKey("adminNotes")) {
            report.setAdminNotes((String) resolutionData.get("adminNotes"));
        }

        Report savedReport = reportRepository.save(report);
        return convertToResponse(savedReport);
    }

    public ReportResponse dismissReport(UUID id, Map<String, Object> dismissalData, UUID adminId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!isAdmin(admin)) {
            throw new UnauthorizedException("Admin access required");
        }

        report.setStatus(com.freelance.platform.entity.ReportStatus.DISMISSED);
        report.setResolvedAt(LocalDateTime.now());

        if (dismissalData.containsKey("adminNotes")) {
            report.setAdminNotes((String) dismissalData.get("adminNotes"));
        }

        Report savedReport = reportRepository.save(report);
        return convertToResponse(savedReport);
    }

    public Page<ReportResponse> searchReports(String query, Pageable pageable, UUID currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Report> reports;
        
        if (isAdmin(currentUser)) {
            reports = reportRepository.searchByDescriptionContainingIgnoreCase(query, pageable);
        } else {
            reports = reportRepository.searchByDescriptionContainingIgnoreCaseAndReporterId(query, currentUserId, pageable);
        }
        
        return reports.map(this::convertToResponse);
    }

    private boolean isAdmin(User user) {
        // In a real implementation, you would check user roles
        // For now, we'll assume admin users have a specific email pattern
        return user.getEmail().contains("admin") || user.getEmail().contains("moderator");
    }

    private ReportResponse convertToResponse(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setReporterId(report.getReporter().getId());
        response.setReporterName(report.getReporter().getFirstName() + " " + report.getReporter().getLastName());
        response.setReportType(report.getReportType());
        response.setCategory(report.getCategory());
        response.setDescription(report.getDescription());
        response.setStatus(report.getStatus().name());
        response.setCreatedAt(report.getCreatedAt());
        response.setResolvedAt(report.getResolvedAt());
        
        if (report.getReportedUser() != null) {
            response.setReportedUserId(report.getReportedUser().getId());
            response.setReportedUserName(report.getReportedUser().getFirstName() + " " + report.getReportedUser().getLastName());
        }
        
        if (report.getReportedProject() != null) {
            response.setReportedProjectId(report.getReportedProject().getId());
            response.setReportedProjectTitle(report.getReportedProject().getTitle());
        }
        
        return response;
    }
}
