package com.freelance.platform.repository;

import com.freelance.platform.entity.PaymentRequest;
import com.freelance.platform.entity.User;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.Milestone;
import com.freelance.platform.entity.PaymentRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, UUID> {
    
    List<PaymentRequest> findByFreelancer(User freelancer);
    
    List<PaymentRequest> findByClient(User client);
    
    List<PaymentRequest> findByContract(Contract contract);
    
    List<PaymentRequest> findByMilestone(Milestone milestone);
    
    List<PaymentRequest> findByStatus(PaymentRequestStatus status);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.freelancer = :freelancer ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByFreelancerOrderByRequestedAtDesc(@Param("freelancer") User freelancer);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.client = :client ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByClientOrderByRequestedAtDesc(@Param("client") User client);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.contract = :contract ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByContractOrderByRequestedAtDesc(@Param("contract") Contract contract);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.milestone = :milestone ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByMilestoneOrderByRequestedAtDesc(@Param("milestone") Milestone milestone);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.status = :status ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByStatusOrderByRequestedAtDesc(@Param("status") PaymentRequestStatus status);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.freelancer = :freelancer ORDER BY pr.requestedAt DESC")
    Page<PaymentRequest> findByFreelancerOrderByRequestedAtDesc(@Param("freelancer") User freelancer, Pageable pageable);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.client = :client ORDER BY pr.requestedAt DESC")
    Page<PaymentRequest> findByClientOrderByRequestedAtDesc(@Param("client") User client, Pageable pageable);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.status = :status ORDER BY pr.requestedAt DESC")
    Page<PaymentRequest> findByStatusOrderByRequestedAtDesc(@Param("status") PaymentRequestStatus status, Pageable pageable);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.freelancer = :freelancer AND pr.status = :status ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.client = :client AND pr.status = :status ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByClientAndStatus(@Param("client") User client, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.contract = :contract AND pr.status = :status ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByContractAndStatus(@Param("contract") Contract contract, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT pr FROM PaymentRequest pr WHERE pr.milestone = :milestone AND pr.status = :status ORDER BY pr.requestedAt DESC")
    List<PaymentRequest> findByMilestoneAndStatus(@Param("milestone") Milestone milestone, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.freelancer = :freelancer")
    long countByFreelancer(@Param("freelancer") User freelancer);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.client = :client")
    long countByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.contract = :contract")
    long countByContract(@Param("contract") Contract contract);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.milestone = :milestone")
    long countByMilestone(@Param("milestone") Milestone milestone);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.status = :status")
    long countByStatus(@Param("status") PaymentRequestStatus status);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.freelancer = :freelancer AND pr.status = :status")
    long countByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT COUNT(pr) FROM PaymentRequest pr WHERE pr.client = :client AND pr.status = :status")
    long countByClientAndStatus(@Param("client") User client, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT SUM(pr.amount) FROM PaymentRequest pr WHERE pr.freelancer = :freelancer AND pr.status = :status")
    Double getTotalAmountByFreelancerAndStatus(@Param("freelancer") User freelancer, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT SUM(pr.amount) FROM PaymentRequest pr WHERE pr.client = :client AND pr.status = :status")
    Double getTotalAmountByClientAndStatus(@Param("client") User client, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT SUM(pr.amount) FROM PaymentRequest pr WHERE pr.contract = :contract AND pr.status = :status")
    Double getTotalAmountByContractAndStatus(@Param("contract") Contract contract, @Param("status") PaymentRequestStatus status);
    
    @Query("SELECT AVG(pr.amount) FROM PaymentRequest pr WHERE pr.status = :status")
    Double getAverageAmountByStatus(@Param("status") PaymentRequestStatus status);
    
    // Additional methods needed by PaymentService
    Page<PaymentRequest> findByFreelancerIdOrderByRequestedAtDesc(UUID freelancerId, Pageable pageable);
    
    Page<PaymentRequest> findByClientIdOrderByRequestedAtDesc(UUID clientId, Pageable pageable);
    
    Page<PaymentRequest> findByContractIdOrderByRequestedAtDesc(UUID contractId, Pageable pageable);
    
    boolean existsByMilestone(Milestone milestone);
}
