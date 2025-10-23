package com.freelance.platform.repository;

import com.freelance.platform.entity.FreelancerProfile;
import com.freelance.platform.entity.FreelancerSkill;
import com.freelance.platform.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FreelancerSkillRepository extends JpaRepository<FreelancerSkill, UUID> {
    
    List<FreelancerSkill> findByFreelancer(FreelancerProfile freelancer);
    
    Optional<FreelancerSkill> findByFreelancerAndSkill(FreelancerProfile freelancer, Skill skill);
    
    @Query("SELECT fs FROM FreelancerSkill fs JOIN FETCH fs.skill WHERE fs.freelancer.id = :freelancerId ORDER BY fs.skill.name")
    List<FreelancerSkill> findByFreelancerIdWithSkill(@Param("freelancerId") UUID freelancerId);
    
    @Query("SELECT fs FROM FreelancerSkill fs JOIN FETCH fs.skill WHERE fs.freelancer.id = :freelancerId AND fs.proficiencyLevel >= :minLevel ORDER BY fs.proficiencyLevel DESC")
    List<FreelancerSkill> findByFreelancerIdWithMinProficiency(@Param("freelancerId") UUID freelancerId, @Param("minLevel") Integer minLevel);
    
    void deleteByFreelancerAndSkill(FreelancerProfile freelancer, Skill skill);
    
    void deleteByFreelancer(FreelancerProfile freelancer);
    
    boolean existsByFreelancerAndSkill(FreelancerProfile freelancer, Skill skill);
    
    long countByFreelancerId(UUID freelancerId);
    
    void deleteByFreelancerId(UUID freelancerId);
}