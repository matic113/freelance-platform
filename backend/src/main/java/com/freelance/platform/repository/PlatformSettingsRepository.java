package com.freelance.platform.repository;

import com.freelance.platform.entity.PlatformSettings;
import com.freelance.platform.entity.SettingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformSettingsRepository extends JpaRepository<PlatformSettings, UUID> {
    
    Optional<PlatformSettings> findBySettingKey(String settingKey);
    
    boolean existsBySettingKey(String settingKey);
    
    List<PlatformSettings> findByCategory(SettingCategory category);
    
    List<PlatformSettings> findByIsPublicTrue();
    
    List<PlatformSettings> findByIsPublicFalse();
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.category = :category ORDER BY ps.settingKey")
    List<PlatformSettings> findByCategoryOrderBySettingKey(@Param("category") SettingCategory category);
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.isPublic = true ORDER BY ps.settingKey")
    List<PlatformSettings> findPublicSettingsOrderBySettingKey();
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.isPublic = false ORDER BY ps.settingKey")
    List<PlatformSettings> findPrivateSettingsOrderBySettingKey();
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.category = :category AND ps.isPublic = true ORDER BY ps.settingKey")
    List<PlatformSettings> findPublicSettingsByCategory(@Param("category") SettingCategory category);
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.category = :category AND ps.isPublic = false ORDER BY ps.settingKey")
    List<PlatformSettings> findPrivateSettingsByCategory(@Param("category") SettingCategory category);
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.settingKey LIKE :keyPattern ORDER BY ps.settingKey")
    List<PlatformSettings> findBySettingKeyPattern(@Param("keyPattern") String keyPattern);
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.settingKey LIKE :keyPattern AND ps.isPublic = true ORDER BY ps.settingKey")
    List<PlatformSettings> findPublicSettingsByKeyPattern(@Param("keyPattern") String keyPattern);
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.settingKey LIKE :keyPattern AND ps.isPublic = false ORDER BY ps.settingKey")
    List<PlatformSettings> findPrivateSettingsByKeyPattern(@Param("keyPattern") String keyPattern);
    
    @Query("SELECT COUNT(ps) FROM PlatformSettings ps WHERE ps.category = :category")
    long countByCategory(@Param("category") SettingCategory category);
    
    @Query("SELECT COUNT(ps) FROM PlatformSettings ps WHERE ps.isPublic = true")
    long countPublicSettings();
    
    @Query("SELECT COUNT(ps) FROM PlatformSettings ps WHERE ps.isPublic = false")
    long countPrivateSettings();
    
    @Query("SELECT COUNT(ps) FROM PlatformSettings ps WHERE ps.category = :category AND ps.isPublic = true")
    long countPublicSettingsByCategory(@Param("category") SettingCategory category);
    
    @Query("SELECT COUNT(ps) FROM PlatformSettings ps WHERE ps.category = :category AND ps.isPublic = false")
    long countPrivateSettingsByCategory(@Param("category") SettingCategory category);
    
    @Query("SELECT DISTINCT ps.category FROM PlatformSettings ps WHERE ps.category IS NOT NULL ORDER BY ps.category")
    List<SettingCategory> findAllCategories();
    
    @Query("SELECT ps FROM PlatformSettings ps ORDER BY ps.settingKey")
    List<PlatformSettings> findAllOrderBySettingKey();
    
    @Query("SELECT ps FROM PlatformSettings ps WHERE ps.category = :category ORDER BY ps.settingKey")
    List<PlatformSettings> findAllByCategoryOrderBySettingKey(@Param("category") SettingCategory category);
}
