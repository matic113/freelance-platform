package com.freelance.platform.repository;

import com.freelance.platform.entity.PaymentMethod;
import com.freelance.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {
    
    List<PaymentMethod> findByUserAndIsActiveTrueOrderByIsDefaultDescCreatedAtAsc(User user);
    
    List<PaymentMethod> findByUserIdAndIsActiveTrueOrderByIsDefaultDescCreatedAtAsc(UUID userId);
    
    Optional<PaymentMethod> findByUserAndIsDefaultTrueAndIsActiveTrue(User user);
    
    Optional<PaymentMethod> findByUserIdAndIsDefaultTrueAndIsActiveTrue(UUID userId);
    
    Optional<PaymentMethod> findByIdAndUserIdAndIsActiveTrue(UUID id, UUID userId);
    
    @Modifying
    @Query("UPDATE PaymentMethod p SET p.isDefault = false WHERE p.user = :user AND p.isActive = true")
    void clearDefaultByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE PaymentMethod p SET p.isDefault = false WHERE p.user.id = :userId AND p.isActive = true")
    void clearDefaultByUserId(@Param("userId") UUID userId);
    
    long countByUserAndIsActiveTrue(User user);
    
    long countByUserIdAndIsActiveTrue(UUID userId);
}
