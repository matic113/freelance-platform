package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreatePaymentRequestDto;
import com.freelance.platform.dto.response.PaymentResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRequestRepository paymentRequestRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailNotificationService emailNotificationService;

    public PaymentResponse createPaymentRequest(CreatePaymentRequestDto request, UUID freelancerId) {
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!freelancer.isFreelancer()) {
            throw new UnauthorizedException("Only freelancers can create payment requests");
        }

        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        if (!contract.getFreelancer().getId().equals(freelancerId)) {
            throw new UnauthorizedException("You can only create payment requests for your own contracts");
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new UnauthorizedException("Can only create payment requests for active contracts");
        }

        Milestone milestone = milestoneRepository.findById(request.getMilestoneId())
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

        if (!milestone.getContract().getId().equals(request.getContractId())) {
            throw new UnauthorizedException("Milestone does not belong to this contract");
        }

        if (milestone.getStatus() != MilestoneStatus.COMPLETED) {
            throw new UnauthorizedException("Can only request payment for completed milestones");
        }

        // Check if payment request already exists for this milestone
        boolean existingRequest = paymentRequestRepository.existsByMilestone(milestone);
        if (existingRequest) {
            throw new UnauthorizedException("Payment request already exists for this milestone");
        }

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setContract(contract);
        paymentRequest.setMilestone(milestone);
        paymentRequest.setFreelancer(freelancer);
        paymentRequest.setClient(contract.getClient());
        paymentRequest.setAmount(request.getAmount());
        paymentRequest.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        paymentRequest.setStatus(PaymentRequestStatus.PENDING);
        paymentRequest.setDescription(request.getDescription());
        paymentRequest.setRequestedAt(LocalDateTime.now());

        PaymentRequest savedRequest = paymentRequestRepository.save(paymentRequest);

        // Send notification to client
        notificationService.createNotificationForUser(
                contract.getClient().getId(),
                "PAYMENT_REQUESTED",
                "Payment Request Received",
                String.format("A payment request of %s %s has been submitted for milestone '%s'", 
                             request.getAmount(), request.getCurrency(), milestone.getTitle()),
                "high",
                String.format("{\"paymentRequestId\":\"%s\",\"contractId\":\"%s\",\"milestoneId\":\"%s\"}", 
                             savedRequest.getId(), contract.getId(), milestone.getId())
        );

        emailNotificationService.sendPaymentRequestEmail(contract.getClient(), freelancer.getFirstName() + " " + freelancer.getLastName(), 
                request.getAmount().toString(), request.getCurrency());

        return mapToPaymentResponse(savedRequest);
    }

    public PaymentResponse approvePaymentRequest(UUID paymentRequestId, UUID clientId) {
        PaymentRequest paymentRequest = paymentRequestRepository.findById(paymentRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment request not found"));

        if (!paymentRequest.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only approve payment requests for your own contracts");
        }

        if (paymentRequest.getStatus() != PaymentRequestStatus.PENDING) {
            throw new UnauthorizedException("Only pending payment requests can be approved");
        }

        paymentRequest.setStatus(PaymentRequestStatus.APPROVED);
        paymentRequest.setApprovedAt(LocalDateTime.now());

        PaymentRequest approvedRequest = paymentRequestRepository.save(paymentRequest);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                paymentRequest.getFreelancer().getId(),
                "PAYMENT_APPROVED",
                "Payment Approved",
                String.format("Your payment request of %s %s has been approved", 
                             paymentRequest.getAmount(), paymentRequest.getCurrency()),
                "high",
                String.format("{\"paymentRequestId\":\"%s\",\"contractId\":\"%s\",\"milestoneId\":\"%s\"}", 
                             paymentRequest.getId(), paymentRequest.getContract().getId(), paymentRequest.getMilestone().getId())
        );

        emailNotificationService.sendPaymentApprovedEmail(paymentRequest.getFreelancer(), 
                paymentRequest.getAmount().toString(), paymentRequest.getCurrency());

        return mapToPaymentResponse(approvedRequest);
    }

    public PaymentResponse rejectPaymentRequest(UUID paymentRequestId, String rejectionReason, UUID clientId) {
        PaymentRequest paymentRequest = paymentRequestRepository.findById(paymentRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment request not found"));

        if (!paymentRequest.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only reject payment requests for your own contracts");
        }

        if (paymentRequest.getStatus() != PaymentRequestStatus.PENDING) {
            throw new UnauthorizedException("Only pending payment requests can be rejected");
        }

        paymentRequest.setStatus(PaymentRequestStatus.REJECTED);
        paymentRequest.setRejectionReason(rejectionReason);

        PaymentRequest rejectedRequest = paymentRequestRepository.save(paymentRequest);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                paymentRequest.getFreelancer().getId(),
                "PAYMENT_REJECTED",
                "Payment Request Rejected",
                String.format("Your payment request of %s %s was rejected. Reason: %s", 
                             paymentRequest.getAmount(), paymentRequest.getCurrency(), rejectionReason),
                "medium",
                String.format("{\"paymentRequestId\":\"%s\",\"contractId\":\"%s\",\"milestoneId\":\"%s\"}", 
                             paymentRequest.getId(), paymentRequest.getContract().getId(), paymentRequest.getMilestone().getId())
        );

        return mapToPaymentResponse(rejectedRequest);
    }

    public PaymentResponse processPayment(UUID paymentRequestId, String paymentMethod, String gatewayTransactionId) {
        PaymentRequest paymentRequest = paymentRequestRepository.findById(paymentRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment request not found"));

        if (paymentRequest.getStatus() != PaymentRequestStatus.APPROVED) {
            throw new UnauthorizedException("Only approved payment requests can be processed");
        }

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setContract(paymentRequest.getContract());
        transaction.setPaymentRequest(paymentRequest);
        transaction.setAmount(paymentRequest.getAmount());
        transaction.setCurrency(paymentRequest.getCurrency());
        transaction.setTransactionType(TransactionType.PAYMENT);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setPaymentMethod(paymentMethod);
        transaction.setPaymentGateway("stripe"); // Default gateway
        transaction.setGatewayTransactionId(gatewayTransactionId);
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setCompletedAt(LocalDateTime.now());

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Update payment request status
        paymentRequest.setStatus(PaymentRequestStatus.PAID);
        paymentRequest.setPaidAt(LocalDateTime.now());

        // Update milestone status
        Milestone milestone = paymentRequest.getMilestone();
        milestone.setStatus(MilestoneStatus.PAID);
        milestone.setPaidDate(LocalDateTime.now());
        milestoneRepository.save(milestone);

        PaymentRequest paidRequest = paymentRequestRepository.save(paymentRequest);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                paymentRequest.getFreelancer().getId(),
                "PAYMENT_RECEIVED",
                "Payment Received",
                String.format("Payment of %s %s has been processed successfully", 
                             paymentRequest.getAmount(), paymentRequest.getCurrency()),
                "high",
                String.format("{\"paymentRequestId\":\"%s\",\"transactionId\":\"%s\",\"contractId\":\"%s\"}", 
                             paymentRequest.getId(), savedTransaction.getId(), paymentRequest.getContract().getId())
        );

        emailNotificationService.sendPaymentReceivedEmail(paymentRequest.getFreelancer(), paymentRequest.getClient().getFirstName() + " " + paymentRequest.getClient().getLastName(), 
                paymentRequest.getAmount().toString(), paymentRequest.getCurrency());

        return mapToPaymentResponse(paidRequest);
    }

    public PaymentResponse getPaymentRequestById(UUID paymentRequestId) {
        PaymentRequest paymentRequest = paymentRequestRepository.findById(paymentRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment request not found"));
        return mapToPaymentResponse(paymentRequest);
    }

    public Page<PaymentResponse> getPaymentRequestsByFreelancer(UUID freelancerId, Pageable pageable) {
        Page<PaymentRequest> requests = paymentRequestRepository.findByFreelancerIdOrderByRequestedAtDesc(freelancerId, pageable);
        return requests.map(this::mapToPaymentResponse);
    }

    public Page<PaymentResponse> getPaymentRequestsByClient(UUID clientId, Pageable pageable) {
        Page<PaymentRequest> requests = paymentRequestRepository.findByClientIdOrderByRequestedAtDesc(clientId, pageable);
        return requests.map(this::mapToPaymentResponse);
    }

    public Page<PaymentResponse> getPaymentRequestsByContract(UUID contractId, Pageable pageable) {
        Page<PaymentRequest> requests = paymentRequestRepository.findByContractIdOrderByRequestedAtDesc(contractId, pageable);
        return requests.map(this::mapToPaymentResponse);
    }

    public List<PaymentResponse> getTransactionsByContract(UUID contractId) {
        List<Transaction> transactions = transactionRepository.findByContractIdOrderByCreatedAtDesc(contractId);
        return transactions.stream()
                .map(this::mapTransactionToPaymentResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private PaymentResponse mapToPaymentResponse(PaymentRequest paymentRequest) {
        PaymentResponse response = new PaymentResponse();
        response.setId(paymentRequest.getId());
        response.setContractId(paymentRequest.getContract().getId());
        response.setMilestoneId(paymentRequest.getMilestone().getId());
        response.setFreelancerId(paymentRequest.getFreelancer().getId());
        response.setFreelancerName(paymentRequest.getFreelancer().getFirstName() + " " + paymentRequest.getFreelancer().getLastName());
        response.setClientId(paymentRequest.getClient().getId());
        response.setClientName(paymentRequest.getClient().getFirstName() + " " + paymentRequest.getClient().getLastName());
        response.setAmount(paymentRequest.getAmount());
        response.setCurrency(paymentRequest.getCurrency());
        response.setStatus(paymentRequest.getStatus());
        response.setDescription(paymentRequest.getDescription());
        response.setRequestedAt(paymentRequest.getRequestedAt());
        response.setApprovedAt(paymentRequest.getApprovedAt());
        response.setPaidAt(paymentRequest.getPaidAt());
        response.setRejectionReason(paymentRequest.getRejectionReason());
        
        return response;
    }

    private PaymentResponse mapTransactionToPaymentResponse(Transaction transaction) {
        PaymentResponse response = new PaymentResponse();
        response.setId(transaction.getId());
        response.setContractId(transaction.getContract().getId());
        response.setMilestoneId(transaction.getPaymentRequest().getMilestone().getId());
        response.setAmount(transaction.getAmount());
        response.setCurrency(transaction.getCurrency());
        // Map TransactionStatus to PaymentRequestStatus
        if (transaction.getStatus() == TransactionStatus.COMPLETED) {
            response.setStatus(PaymentRequestStatus.PAID);
        } else if (transaction.getStatus() == TransactionStatus.FAILED) {
            response.setStatus(PaymentRequestStatus.REJECTED);
        } else {
            response.setStatus(PaymentRequestStatus.PENDING);
        }
        response.setRequestedAt(transaction.getCreatedAt());
        response.setPaidAt(transaction.getCompletedAt());
        response.setPaymentMethod(transaction.getPaymentMethod());
        response.setGatewayTransactionId(transaction.getGatewayTransactionId());
        
        return response;
    }
}
