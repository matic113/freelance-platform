package com.freelance.platform.repository;

import com.freelance.platform.entity.Report;
import com.freelance.platform.entity.User;
import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    
    List<Report> findByReporter(User reporter);
    
    List<Report> findByReportedUser(User reportedUser);
    
    List<Report> findByReportedProject(Project reportedProject);
    
    List<Report> findByStatus(ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.reporter = :reporter ORDER BY r.createdAt DESC")
    List<Report> findByReporterOrderByCreatedAtDesc(@Param("reporter") User reporter);
    
    @Query("SELECT r FROM Report r WHERE r.reportedUser = :reportedUser ORDER BY r.createdAt DESC")
    List<Report> findByReportedUserOrderByCreatedAtDesc(@Param("reportedUser") User reportedUser);
    
    @Query("SELECT r FROM Report r WHERE r.reportedProject = :reportedProject ORDER BY r.createdAt DESC")
    List<Report> findByReportedProjectOrderByCreatedAtDesc(@Param("reportedProject") Project reportedProject);
    
    @Query("SELECT r FROM Report r WHERE r.status = :status ORDER BY r.createdAt DESC")
    List<Report> findByStatusOrderByCreatedAtDesc(@Param("status") ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.reporter = :reporter ORDER BY r.createdAt DESC")
    Page<Report> findByReporterOrderByCreatedAtDesc(@Param("reporter") User reporter, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.reportedUser = :reportedUser ORDER BY r.createdAt DESC")
    Page<Report> findByReportedUserOrderByCreatedAtDesc(@Param("reportedUser") User reportedUser, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.reportedProject = :reportedProject ORDER BY r.createdAt DESC")
    Page<Report> findByReportedProjectOrderByCreatedAtDesc(@Param("reportedProject") Project reportedProject, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.status = :status ORDER BY r.createdAt DESC")
    Page<Report> findByStatusOrderByCreatedAtDesc(@Param("status") ReportStatus status, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.reportType = :reportType ORDER BY r.createdAt DESC")
    List<Report> findByReportType(@Param("reportType") String reportType);
    
    @Query("SELECT r FROM Report r WHERE r.reportType = :reportType ORDER BY r.createdAt DESC")
    Page<Report> findByReportType(@Param("reportType") String reportType, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.category = :category ORDER BY r.createdAt DESC")
    List<Report> findByCategory(@Param("category") String category);
    
    @Query("SELECT r FROM Report r WHERE r.category = :category ORDER BY r.createdAt DESC")
    Page<Report> findByCategory(@Param("category") String category, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.reportType = :reportType AND r.status = :status ORDER BY r.createdAt DESC")
    List<Report> findByReportTypeAndStatus(@Param("reportType") String reportType, @Param("status") ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.reportType = :reportType AND r.status = :status ORDER BY r.createdAt DESC")
    Page<Report> findByReportTypeAndStatus(@Param("reportType") String reportType, @Param("status") ReportStatus status, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.category = :category AND r.status = :status ORDER BY r.createdAt DESC")
    List<Report> findByCategoryAndStatus(@Param("category") String category, @Param("status") ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE r.category = :category AND r.status = :status ORDER BY r.createdAt DESC")
    Page<Report> findByCategoryAndStatus(@Param("category") String category, @Param("status") ReportStatus status, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate ORDER BY r.createdAt DESC")
    List<Report> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate ORDER BY r.createdAt DESC")
    Page<Report> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.resolvedAt BETWEEN :startDate AND :endDate ORDER BY r.resolvedAt DESC")
    List<Report> findByResolvedDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT r FROM Report r WHERE r.resolvedAt BETWEEN :startDate AND :endDate ORDER BY r.resolvedAt DESC")
    Page<Report> findByResolvedDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reporter = :reporter")
    long countByReporter(@Param("reporter") User reporter);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportedUser = :reportedUser")
    long countByReportedUser(@Param("reportedUser") User reportedUser);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportedProject = :reportedProject")
    long countByReportedProject(@Param("reportedProject") Project reportedProject);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status")
    long countByStatus(@Param("status") ReportStatus status);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportType = :reportType")
    long countByReportType(@Param("reportType") String reportType);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.category = :category")
    long countByCategory(@Param("category") String category);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.reportType = :reportType AND r.status = :status")
    long countByReportTypeAndStatus(@Param("reportType") String reportType, @Param("status") ReportStatus status);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.category = :category AND r.status = :status")
    long countByCategoryAndStatus(@Param("category") String category, @Param("status") ReportStatus status);
    
    @Query("SELECT DISTINCT r.reportType FROM Report r WHERE r.reportType IS NOT NULL ORDER BY r.reportType")
    List<String> findAllReportTypes();
    
    @Query("SELECT DISTINCT r.category FROM Report r WHERE r.category IS NOT NULL ORDER BY r.category")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT r.category FROM Report r WHERE r.reportType = :reportType AND r.category IS NOT NULL ORDER BY r.category")
    List<String> findCategoriesByReportType(@Param("reportType") String reportType);
    
    @Query("SELECT r FROM Report r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    List<Report> findPendingReports();
    
    @Query("SELECT r FROM Report r WHERE r.status = 'PENDING' ORDER BY r.createdAt ASC")
    Page<Report> findPendingReports(Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.status = 'UNDER_REVIEW' ORDER BY r.createdAt ASC")
    List<Report> findUnderReviewReports();
    
    @Query("SELECT r FROM Report r WHERE r.status = 'UNDER_REVIEW' ORDER BY r.createdAt ASC")
    Page<Report> findUnderReviewReports(Pageable pageable);
    
    // Additional methods needed by services
    @Query("SELECT r FROM Report r WHERE r.reporter.id = :reporterId ORDER BY r.createdAt DESC")
    Page<Report> findByReporterIdOrderByCreatedAtDesc(@Param("reporterId") UUID reporterId, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY r.createdAt DESC")
    Page<Report> searchByDescriptionContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND r.reporter.id = :reporterId ORDER BY r.createdAt DESC")
    Page<Report> searchByDescriptionContainingIgnoreCaseAndReporterId(@Param("searchTerm") String searchTerm, @Param("reporterId") UUID reporterId, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE (LOWER(r.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(r.reportType) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) ORDER BY r.createdAt DESC")
    Page<Report> findByDescriptionContainingIgnoreCaseOrReportTypeContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.reportType = :reportType AND r.status = :status AND r.reporter.id = :reporterId ORDER BY r.createdAt DESC")
    Page<Report> findReportsWithFilters(@Param("reportType") String reportType, @Param("status") String status, @Param("reporterId") UUID reporterId, Pageable pageable);
}
