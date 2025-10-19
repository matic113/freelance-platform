package com.freelance.platform.repository;

import com.freelance.platform.entity.ContactForm;
import com.freelance.platform.entity.ContactStatus;
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
public interface ContactFormRepository extends JpaRepository<ContactForm, UUID> {
    
    Page<ContactForm> findByStatus(ContactStatus status, Pageable pageable);
    
    List<ContactForm> findByEmail(String email);
    
    @Query("SELECT cf FROM ContactForm cf WHERE cf.createdAt BETWEEN :startDate AND :endDate")
    List<ContactForm> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(cf) FROM ContactForm cf WHERE cf.status = :status")
    long countByStatus(@Param("status") ContactStatus status);
    
    @Query("SELECT cf FROM ContactForm cf WHERE cf.category = :category")
    List<ContactForm> findByCategory(@Param("category") String category);
    
    @Query("SELECT cf FROM ContactForm cf ORDER BY cf.createdAt DESC")
    List<ContactForm> findAllOrderByCreatedAtDesc();
}
