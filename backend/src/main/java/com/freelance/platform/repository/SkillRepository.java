package com.freelance.platform.repository;

import com.freelance.platform.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillRepository extends JpaRepository<Skill, UUID> {
    
    Optional<Skill> findByName(String name);
    
    List<Skill> findByCategory(String category);
    
    @Query("SELECT s FROM Skill s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Skill> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT DISTINCT s.category FROM Skill s WHERE s.category IS NOT NULL ORDER BY s.category")
    List<String> findAllCategories();
    
    @Query("SELECT s FROM Skill s ORDER BY s.name")
    List<Skill> findAllOrderByName();
    
    boolean existsByName(String name);
}