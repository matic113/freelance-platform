package com.freelance.platform.repository;

import com.freelance.platform.entity.BillingSettings;
import com.freelance.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BillingSettingsRepository extends JpaRepository<BillingSettings, UUID> {
    
    Optional<BillingSettings> findByUser(User user);
    
    Optional<BillingSettings> findByUserId(UUID userId);
    
    boolean existsByUser(User user);
    
    boolean existsByUserId(UUID userId);
}
