package com.freelance.platform.repository;

import com.freelance.platform.entity.EmailTemplate;
import com.freelance.platform.entity.TemplateType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, UUID> {
    
    Optional<EmailTemplate> findByTemplateKeyAndLanguageAndIsActiveTrue(String templateKey, String language);
    
    List<EmailTemplate> findByTemplateType(TemplateType templateType);
    
    List<EmailTemplate> findByLanguage(String language);
    
    List<EmailTemplate> findByIsActiveTrue();
    
    List<EmailTemplate> findByIsActiveFalse();
    
    @Query("SELECT et FROM EmailTemplate et WHERE et.templateKey = :templateKey AND et.language = :language AND et.isActive = true")
    Optional<EmailTemplate> findActiveTemplateByKeyAndLanguage(@Param("templateKey") String templateKey, @Param("language") String language);
    
    @Query("SELECT et FROM EmailTemplate et WHERE et.templateType = :templateType AND et.isActive = true ORDER BY et.templateKey")
    List<EmailTemplate> findActiveTemplatesByType(@Param("templateType") TemplateType templateType);
    
    @Query("SELECT et FROM EmailTemplate et WHERE et.language = :language AND et.isActive = true ORDER BY et.templateKey")
    List<EmailTemplate> findActiveTemplatesByLanguage(@Param("language") String language);
    
    @Query("SELECT et FROM EmailTemplate et WHERE et.templateKey LIKE :keyPattern AND et.isActive = true ORDER BY et.templateKey")
    List<EmailTemplate> findActiveTemplatesByKeyPattern(@Param("keyPattern") String keyPattern);
    
    boolean existsByTemplateKeyAndLanguage(String templateKey, String language);

    Optional<EmailTemplate> findByTemplateKey(String templateKey);

    boolean existsByTemplateKey(String templateKey);
    
    long countByTemplateType(TemplateType templateType);
    
    long countByLanguage(String language);
    
    long countByIsActiveTrue();
    
    long countByIsActiveFalse();

    // (duplicates removed) Keep single declarations above for findByTemplateKey and existsByTemplateKey
}