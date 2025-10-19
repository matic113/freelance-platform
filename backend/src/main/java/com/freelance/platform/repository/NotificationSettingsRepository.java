package com.freelance.platform.repository;

import com.freelance.platform.entity.NotificationSettings;
import com.freelance.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, UUID> {
    
    Optional<NotificationSettings> findByUser(User user);
    
    Optional<NotificationSettings> findByUserId(UUID userId);
    
    boolean existsByUser(User user);
    
    boolean existsByUserId(UUID userId);
}
