package com.freelance.platform.repository;

import com.freelance.platform.entity.Milestone;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.MilestoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {
    
    List<Milestone> findByContract(Contract contract);
    
    List<Milestone> findByStatus(MilestoneStatus status);
    
    @Query("SELECT m FROM Milestone m WHERE m.contract = :contract ORDER BY m.orderIndex ASC")
    List<Milestone> findByContractOrderByOrderIndex(@Param("contract") Contract contract);
    
    @Query("SELECT m FROM Milestone m WHERE m.contract = :contract AND m.status = :status ORDER BY m.orderIndex ASC")
    List<Milestone> findByContractAndStatus(@Param("contract") Contract contract, @Param("status") MilestoneStatus status);
    
    @Query("SELECT m FROM Milestone m WHERE m.dueDate < :currentDate AND m.status = :status")
    List<Milestone> findOverdueMilestones(@Param("currentDate") LocalDate currentDate, @Param("status") MilestoneStatus status);
    
    @Query("SELECT m FROM Milestone m WHERE m.dueDate BETWEEN :startDate AND :endDate AND m.status = :status")
    List<Milestone> findMilestonesDueSoon(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate, @Param("status") MilestoneStatus status);
    
    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.contract = :contract")
    long countByContract(@Param("contract") Contract contract);
    
    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.contract = :contract AND m.status = :status")
    long countByContractAndStatus(@Param("contract") Contract contract, @Param("status") MilestoneStatus status);
    
    @Query("SELECT SUM(m.amount) FROM Milestone m WHERE m.contract = :contract")
    Double getTotalAmountByContract(@Param("contract") Contract contract);
    
    @Query("SELECT SUM(m.amount) FROM Milestone m WHERE m.contract = :contract AND m.status = :status")
    Double getTotalAmountByContractAndStatus(@Param("contract") Contract contract, @Param("status") MilestoneStatus status);
    
    @Query("SELECT m FROM Milestone m WHERE m.contract.id = :contractId ORDER BY m.orderIndex ASC")
    List<Milestone> findByContractIdOrderByOrderIndex(@Param("contractId") UUID contractId);
    
    @Query("SELECT MAX(m.orderIndex) FROM Milestone m WHERE m.contract = :contract")
    Integer getMaxOrderIndexByContract(@Param("contract") Contract contract);
    
    // Additional method needed by ContractService
    List<Milestone> findByContractIdOrderByOrderIndexAsc(UUID contractId);
}
