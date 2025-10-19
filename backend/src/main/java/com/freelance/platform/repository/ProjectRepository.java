package com.freelance.platform.repository;

import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.User;
import com.freelance.platform.entity.ProjectStatus;
import com.freelance.platform.entity.ProjectType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    
    List<Project> findByClient(User client);
    
    List<Project> findByStatus(ProjectStatus status);
    
    List<Project> findByProjectType(ProjectType projectType);
    
    List<Project> findByIsFeaturedTrue();
    
    List<Project> findByIsFeaturedTrueAndStatus(ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.client = :client ORDER BY p.createdAt DESC")
    List<Project> findByClientOrderByCreatedAtDesc(@Param("client") User client);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findByStatusOrderByCreatedAtDesc(@Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.isFeatured = true AND p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findFeaturedProjectsByStatus(@Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status AND p.client.isActive = true ORDER BY p.createdAt DESC")
    Page<Project> findPublishedProjects(@Param("status") ProjectStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.projectType = :projectType AND p.status = :status ORDER BY p.createdAt DESC")
    List<Project> findByProjectTypeAndStatus(@Param("projectType") ProjectType projectType, @Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.budgetMin >= :minBudget AND p.budgetMax <= :maxBudget AND p.status = :status")
    List<Project> findByBudgetRange(@Param("minBudget") BigDecimal minBudget, @Param("maxBudget") BigDecimal maxBudget, @Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.deadline >= :startDate AND p.deadline <= :endDate AND p.status = :status")
    List<Project> findByDeadlineRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE " +
           "p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<Project> searchProjects(@Param("searchTerm") String searchTerm, @Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE " +
           "p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Project> searchProjects(@Param("searchTerm") String searchTerm, @Param("status") ProjectStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status AND :skill MEMBER OF p.skillsRequired ORDER BY p.createdAt DESC")
    List<Project> findBySkillRequired(@Param("skill") String skill, @Param("status") ProjectStatus status);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status AND :skill MEMBER OF p.skillsRequired ORDER BY p.createdAt DESC")
    Page<Project> findBySkillRequired(@Param("skill") String skill, @Param("status") ProjectStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<Project> findRecentProjects(@Param("status") ProjectStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.client = :client")
    long countByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.status = :status")
    long countByStatus(@Param("status") ProjectStatus status);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.projectType = :projectType")
    long countByProjectType(@Param("projectType") ProjectType projectType);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.isFeatured = true")
    long countFeaturedProjects();

    @Query("SELECT COUNT(p) FROM Project p WHERE p.isFeatured = true")
    long countByIsFeaturedTrue();
    
    @Query("SELECT DISTINCT p.category FROM Project p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT skill FROM Project p JOIN p.skillsRequired skill WHERE skill IS NOT NULL ORDER BY skill")
    List<String> findAllRequiredSkills();
    
    // Additional methods needed by ProjectService
    Page<Project> findByClientIdOrderByCreatedAtDesc(UUID clientId, Pageable pageable);
    
    Page<Project> findByStatusOrderByCreatedAtDesc(ProjectStatus status, Pageable pageable);
    
    Page<Project> findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc(ProjectStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Project p WHERE " +
           "p.status = 'PUBLISHED' AND " +
           "(:query IS NULL OR " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:skills IS NULL OR EXISTS (SELECT 1 FROM p.skillsRequired s WHERE s IN :skills)) AND " +
           "(:minBudget IS NULL OR p.budgetMax >= :minBudget) AND " +
           "(:maxBudget IS NULL OR p.budgetMin <= :maxBudget) AND " +
           "(:projectType IS NULL OR p.projectType = :projectType)")
    Page<Project> findPublishedProjectsWithFilters(
            @Param("query") String query,
            @Param("category") String category,
            @Param("skills") List<String> skills,
            @Param("minBudget") BigDecimal minBudget,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("projectType") ProjectType projectType,
            Pageable pageable);
    
    // Additional methods for analytics
    @Query("SELECT p FROM Project p ORDER BY p.createdAt DESC")
    List<Project> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.category = :category")
    long countByCategory(@Param("category") String category);
    
    // Analytics methods
    @Query("SELECT COUNT(p) FROM Project p WHERE p.client.id = :clientId")
    long countByClientId(@Param("clientId") UUID clientId);
    
    @Query("SELECT COUNT(p) FROM Project p WHERE p.client.id = :clientId AND p.status = :status")
    long countByClientIdAndStatus(@Param("clientId") UUID clientId, @Param("status") String status);
    
    @Query("SELECT AVG(p.budgetMax) FROM Project p WHERE p.client.id = :clientId")
    Double getAverageProjectValueByClientId(@Param("clientId") UUID clientId);

    // Analytics - monthly project counts (UTC)
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(p.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM projects p " +
                   "WHERE p.created_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyProjectCountsLast12MonthsUtc();
    
    // Analytics - projects by status excluding draft
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(p.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM projects p " +
                   "WHERE p.status != 'DRAFT' " +
                   "AND p.created_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyPublishedProjectCountsLast12MonthsUtc();

    // Analytics trend method
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(p.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM projects p " +
                   "WHERE p.client.id = :clientId " +
                   "AND p.created_at >= :startDate " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> getProjectTrendByClientId(@Param("clientId") UUID clientId, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT p FROM Project p WHERE " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Project> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(@Param("query") String query, Pageable pageable);
}
