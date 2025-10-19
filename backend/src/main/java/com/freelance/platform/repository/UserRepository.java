package com.freelance.platform.repository;

import com.freelance.platform.entity.Role;
import com.freelance.platform.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findByEmailAndDeletedAtIsNull(String email);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmailAndDeletedAtIsNull(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByIsActiveTrueAndDeletedAtIsNull();
    
    List<User> findByIsVerifiedTrueAndDeletedAtIsNull();
    
    List<User> findByIsActiveTrueAndIsVerifiedTrueAndDeletedAtIsNull();
    
    @Query("SELECT u FROM User u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "u.deletedAt IS NULL")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT u FROM User u WHERE " +
           "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "u.deletedAt IS NULL")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.deletedAt IS NULL")
    long countActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isVerified = true AND u.deletedAt IS NULL")
    long countVerifiedUsers();
    
    // Additional methods for analytics
    long countByIsActiveTrueAndDeletedAtIsNull();
    
    long countByIsVerifiedTrueAndDeletedAtIsNull();
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate AND u.deletedAt IS NULL")
    long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT DISTINCT u.country FROM User u WHERE u.country IS NOT NULL AND u.deletedAt IS NULL ORDER BY u.country")
    List<String> findAllCountries();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.country = :country AND u.deletedAt IS NULL")
    long countByCountry(@Param("country") String country);
    
    // Additional methods needed by services
    long countByIsActiveTrue();
    
    long countByIsVerifiedTrue();
    
    // Analytics - monthly user counts (UTC, soft-delete excluded)
    @Query(value = "SELECT DATE_FORMAT(CONVERT_TZ(u.created_at, @@session.time_zone, '+00:00'), '%Y-%m') AS ym, " +
                   "COUNT(*) AS c " +
                   "FROM users u " +
                   "WHERE u.deleted_at IS NULL " +
                   "AND u.created_at >= (UTC_TIMESTAMP() - INTERVAL 12 MONTH) " +
                   "GROUP BY ym " +
                   "ORDER BY ym", nativeQuery = true)
    List<Object[]> findMonthlyUserCountsLast12MonthsUtc();
    
    @Query(value = "SELECT COUNT(*) FROM users u WHERE u.deleted_at IS NULL", nativeQuery = true)
    long countActiveUsersExcludingSoftDeleted();
    
    // Admin-related queries (merged from AdminUserRepository)
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = :role AND u.deletedAt IS NULL")
    List<User> findByRole(@Param("role") Role role);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE u.isActive = true AND r = :role AND u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findActiveUsersByRole(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findActiveUsersOrderByCreatedAtDesc();
    
    @Query("SELECT u FROM User u WHERE u.lastLoginAt BETWEEN :startDate AND :endDate AND u.deletedAt IS NULL ORDER BY u.lastLoginAt DESC")
    List<User> findByLastLoginDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT u FROM User u WHERE u.lastLoginAt IS NULL AND u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findUsersNeverLoggedIn();
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE r = :role AND u.deletedAt IS NULL")
    long countByRole(@Param("role") Role role);
    
    @Query("SELECT COUNT(u) FROM User u JOIN u.roles r WHERE u.isActive = true AND r = :role AND u.deletedAt IS NULL")
    long countActiveUsersByRole(@Param("role") Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLoginAt IS NOT NULL AND u.deletedAt IS NULL")
    long countUsersWithLoginHistory();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLoginAt IS NULL AND u.deletedAt IS NULL")
    long countUsersNeverLoggedIn();
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    Page<User> findAllOrderByCreatedAtDesc(Pageable pageable);

              // Paged list of users who have the FREELANCER role (used by UserService.getAllFreelancers)
              @Query("SELECT u FROM User u JOIN u.roles r WHERE r = com.freelance.platform.entity.Role.FREELANCER AND u.deletedAt IS NULL ORDER BY u.createdAt DESC")
              Page<User> findAllFreelancers(Pageable pageable);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = :role AND u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findByRoleOrderByCreatedAtDesc(@Param("role") Role role);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findByIsActiveTrueOrderByCreatedAtDesc();
}
