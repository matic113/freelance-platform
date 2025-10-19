package com.freelance.platform.repository;

import com.freelance.platform.entity.FreelancerProfile;
import com.freelance.platform.entity.AvailabilityStatus;
import com.freelance.platform.entity.ExperienceLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, UUID> {
    
    Optional<FreelancerProfile> findByUserId(UUID userId);
    
    @Query("SELECT fp FROM FreelancerProfile fp LEFT JOIN FETCH fp.skills fs LEFT JOIN FETCH fs.skill WHERE fp.user.id = :userId")
    Optional<FreelancerProfile> findByUserIdWithSkills(@Param("userId") UUID userId);
    
    @Query("SELECT fp FROM FreelancerProfile fp LEFT JOIN FETCH fp.portfolios WHERE fp.user.id = :userId")
    Optional<FreelancerProfile> findByUserIdWithPortfolios(@Param("userId") UUID userId);
    
    List<FreelancerProfile> findByAvailability(AvailabilityStatus availability);
    
    List<FreelancerProfile> findByExperienceLevel(ExperienceLevel experienceLevel);
    
    List<FreelancerProfile> findByHourlyRateBetween(BigDecimal minRate, BigDecimal maxRate);
    
    List<FreelancerProfile> findByRatingGreaterThanEqual(BigDecimal minRating);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.availability = :availability AND fp.user.isActive = true AND fp.user.isVerified = true")
    List<FreelancerProfile> findAvailableFreelancers(@Param("availability") AvailabilityStatus availability);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.experienceLevel = :experienceLevel AND fp.user.isActive = true AND fp.user.isVerified = true")
    List<FreelancerProfile> findFreelancersByExperience(@Param("experienceLevel") ExperienceLevel experienceLevel);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.hourlyRate BETWEEN :minRate AND :maxRate AND fp.user.isActive = true AND fp.user.isVerified = true")
    List<FreelancerProfile> findFreelancersByRateRange(@Param("minRate") BigDecimal minRate, @Param("maxRate") BigDecimal maxRate);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.rating >= :minRating AND fp.user.isActive = true AND fp.user.isVerified = true")
    List<FreelancerProfile> findTopRatedFreelancers(@Param("minRating") BigDecimal minRating);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.user.isActive = true AND fp.user.isVerified = true ORDER BY fp.rating DESC")
    Page<FreelancerProfile> findTopRatedFreelancers(Pageable pageable);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.user.isActive = true AND fp.user.isVerified = true ORDER BY fp.totalEarnings DESC")
    Page<FreelancerProfile> findTopEarningFreelancers(Pageable pageable);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE fp.user.isActive = true AND fp.user.isVerified = true ORDER BY fp.totalProjects DESC")
    Page<FreelancerProfile> findMostExperiencedFreelancers(Pageable pageable);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE " +
           "fp.user.isActive = true AND fp.user.isVerified = true AND " +
           "(LOWER(fp.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(fp.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(fp.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<FreelancerProfile> searchFreelancers(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT fp FROM FreelancerProfile fp WHERE " +
           "fp.user.isActive = true AND fp.user.isVerified = true AND " +
           "(LOWER(fp.bio) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(fp.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(fp.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<FreelancerProfile> searchFreelancers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT COUNT(fp) FROM FreelancerProfile fp WHERE fp.user.isActive = true AND fp.user.isVerified = true")
    long countActiveFreelancers();
    
    @Query("SELECT AVG(fp.rating) FROM FreelancerProfile fp WHERE fp.user.isActive = true AND fp.user.isVerified = true")
    BigDecimal getAverageRating();
    
    @Query("SELECT SUM(fp.totalEarnings) FROM FreelancerProfile fp WHERE fp.user.isActive = true AND fp.user.isVerified = true")
    BigDecimal getTotalEarnings();
}
