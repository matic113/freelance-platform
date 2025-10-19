package com.freelance.platform.repository;

import com.freelance.platform.entity.FAQ;
import com.freelance.platform.entity.FAQCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, UUID> {
    
    // Find all active FAQs ordered by display order
    List<FAQ> findByIsActiveTrueOrderByDisplayOrderAsc();
    
    // Find FAQs by category and active status
    List<FAQ> findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(FAQCategory category);
    
    // Search FAQs by question or answer content
    @Query("SELECT f FROM FAQ f WHERE f.isActive = true AND " +
           "(LOWER(f.question) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.answer) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY f.displayOrder ASC")
    Page<FAQ> searchFAQs(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Get FAQs by category with pagination
    Page<FAQ> findByCategoryAndIsActiveTrueOrderByDisplayOrderAsc(FAQCategory category, Pageable pageable);
    
    // Get all FAQs with pagination
    Page<FAQ> findByIsActiveTrueOrderByDisplayOrderAsc(Pageable pageable);
    
    // Count FAQs by category
    long countByCategoryAndIsActiveTrue(FAQCategory category);
    
    // Get FAQ categories with counts
    @Query("SELECT f.category, COUNT(f) FROM FAQ f WHERE f.isActive = true GROUP BY f.category ORDER BY f.category")
    List<Object[]> getCategoryCounts();
}
