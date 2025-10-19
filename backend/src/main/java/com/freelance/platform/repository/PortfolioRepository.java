package com.freelance.platform.repository;

import com.freelance.platform.entity.FreelancerProfile;
import com.freelance.platform.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {
    
    List<Portfolio> findByFreelancer(FreelancerProfile freelancer);
    
    List<Portfolio> findByFreelancerOrderByCreatedAtDesc(FreelancerProfile freelancer);
    
    List<Portfolio> findByIsFeaturedTrueOrderByCreatedAtDesc();
    
    @Query("SELECT p FROM Portfolio p WHERE p.freelancer.id = :freelancerId ORDER BY p.createdAt DESC")
    List<Portfolio> findByFreelancerIdOrderByCreatedAtDesc(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT p FROM Portfolio p WHERE p.freelancer.id = :freelancerId AND p.isFeatured = true ORDER BY p.createdAt DESC")
    List<Portfolio> findFeaturedByFreelancerId(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT p FROM Portfolio p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.technologies) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Portfolio> searchPortfolios(@Param("searchTerm") String searchTerm);
}