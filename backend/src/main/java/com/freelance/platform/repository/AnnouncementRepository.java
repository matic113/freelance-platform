package com.freelance.platform.repository;

import com.freelance.platform.entity.Announcement;
import com.freelance.platform.entity.TargetAudience;
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
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    
    Page<Announcement> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<Announcement> findByTargetAudienceOrderByCreatedAtDesc(TargetAudience targetAudience);
    
    @Query("SELECT a FROM Announcement a WHERE a.createdAt >= :startDate ORDER BY a.createdAt DESC")
    List<Announcement> findRecentAnnouncements(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(a) FROM Announcement a WHERE a.sentAt IS NOT NULL")
    long countSentAnnouncements();
}
