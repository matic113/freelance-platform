package com.freelance.platform.repository;

import com.freelance.platform.entity.ProjectAttachment;
import com.freelance.platform.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectAttachmentRepository extends JpaRepository<ProjectAttachment, UUID> {
    
    List<ProjectAttachment> findByProject(Project project);
    
    @Query("SELECT pa FROM ProjectAttachment pa WHERE pa.project = :project ORDER BY pa.uploadedAt DESC")
    List<ProjectAttachment> findByProjectOrderByUploadedAtDesc(@Param("project") Project project);
    
    @Query("SELECT pa FROM ProjectAttachment pa WHERE pa.project.id = :projectId ORDER BY pa.uploadedAt DESC")
    List<ProjectAttachment> findByProjectIdOrderByUploadedAtDesc(@Param("projectId") UUID projectId);
    
    @Query("SELECT COUNT(pa) FROM ProjectAttachment pa WHERE pa.project = :project")
    long countByProject(@Param("project") Project project);
    
    @Query("SELECT COUNT(pa) FROM ProjectAttachment pa WHERE pa.project.id = :projectId")
    long countByProjectId(@Param("projectId") UUID projectId);
    
    @Query("SELECT pa FROM ProjectAttachment pa WHERE pa.fileType = :fileType")
    List<ProjectAttachment> findByFileType(@Param("fileType") String fileType);
    
    @Query("SELECT pa FROM ProjectAttachment pa WHERE pa.fileSize > :minSize")
    List<ProjectAttachment> findByFileSizeGreaterThan(@Param("minSize") Long minSize);
    
    @Query("SELECT pa FROM ProjectAttachment pa WHERE pa.fileSize BETWEEN :minSize AND :maxSize")
    List<ProjectAttachment> findByFileSizeBetween(@Param("minSize") Long minSize, @Param("maxSize") Long maxSize);
    
    @Query("SELECT DISTINCT pa.fileType FROM ProjectAttachment pa WHERE pa.fileType IS NOT NULL ORDER BY pa.fileType")
    List<String> findAllFileTypes();
    
    @Query("SELECT SUM(pa.fileSize) FROM ProjectAttachment pa WHERE pa.project = :project")
    Long getTotalFileSizeByProject(@Param("project") Project project);
    
    @Query("SELECT SUM(pa.fileSize) FROM ProjectAttachment pa WHERE pa.project.id = :projectId")
    Long getTotalFileSizeByProjectId(@Param("projectId") UUID projectId);
}
