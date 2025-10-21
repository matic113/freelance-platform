package com.freelance.platform.service;

import com.freelance.platform.dto.response.ContractResponse;
import com.freelance.platform.dto.response.FreelancerDashboardResponse;
import com.freelance.platform.dto.response.ProposalResponse;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.ContractStatus;
import com.freelance.platform.entity.Proposal;
import com.freelance.platform.entity.ProposalStatus;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.ContractRepository;
import com.freelance.platform.repository.ProposalRepository;
import com.freelance.platform.repository.ReviewRepository;
import com.freelance.platform.repository.TransactionRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class FreelancerDashboardService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public FreelancerDashboardResponse getFreelancerDashboard(UUID freelancerId) {
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new RuntimeException("Freelancer not found"));

        FreelancerDashboardResponse.DashboardStats stats = calculateDashboardStats(freelancerId);

        List<Contract> activeContracts = contractRepository.findByFreelancerAndStatus(
                freelancer, 
                ContractStatus.ACTIVE
        );

        List<Contract> completedContracts = contractRepository.findByFreelancerAndStatus(
                freelancer, 
                ContractStatus.COMPLETED
        ).stream()
        .limit(5)
        .collect(Collectors.toList());

        List<Proposal> recentProposals = proposalRepository.findByFreelancerOrderBySubmittedAtDesc(
                freelancer,
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "submittedAt"))
        ).getContent();

        List<ContractResponse> activeContractResponses = activeContracts.stream()
                .map(this::mapToContractResponse)
                .collect(Collectors.toList());

        List<ContractResponse> completedContractResponses = completedContracts.stream()
                .map(this::mapToContractResponse)
                .collect(Collectors.toList());

        List<ProposalResponse> recentProposalResponses = recentProposals.stream()
                .map(this::mapToProposalResponse)
                .collect(Collectors.toList());

        FreelancerDashboardResponse response = new FreelancerDashboardResponse();
        response.setStats(stats);
        response.setActiveContracts(activeContractResponses);
        response.setCompletedContracts(completedContractResponses);
        response.setRecentProposals(recentProposalResponses);

        return response;
    }

    private FreelancerDashboardResponse.DashboardStats calculateDashboardStats(UUID freelancerId) {
        Double totalEarningsDouble = transactionRepository.sumAmountByFreelancerId(freelancerId);
        BigDecimal totalEarnings = totalEarningsDouble != null 
                ? BigDecimal.valueOf(totalEarningsDouble) 
                : BigDecimal.ZERO;

        long activeProjectsCount = contractRepository.countByFreelancerIdAndStatus(
                freelancerId, 
                ContractStatus.ACTIVE
        );
        Integer activeProjects = Math.toIntExact(activeProjectsCount);

        long totalProposalsCount = proposalRepository.countByFreelancerId(freelancerId);
        Integer totalProposals = Math.toIntExact(totalProposalsCount);

        long acceptedProposalsCount = proposalRepository.countByFreelancerIdAndStatus(
                freelancerId, 
                ProposalStatus.ACCEPTED
        );
        Integer acceptedProposals = Math.toIntExact(acceptedProposalsCount);

        Integer proposalSuccessRate = totalProposals > 0 
                ? Math.round((acceptedProposals.floatValue() / totalProposals.floatValue()) * 100)
                : 0;

        Double averageRatingDouble = reviewRepository.getAverageRatingByRevieweeId(freelancerId);
        BigDecimal rating = averageRatingDouble != null 
                ? BigDecimal.valueOf(averageRatingDouble) 
                : BigDecimal.ZERO;

        long totalContractsCount = contractRepository.countByFreelancerId(freelancerId);
        Integer totalContracts = Math.toIntExact(totalContractsCount);

        long completedContractsCount = contractRepository.countByFreelancerIdAndStatus(
                freelancerId, 
                ContractStatus.COMPLETED
        );
        Integer completedContracts = Math.toIntExact(completedContractsCount);

        BigDecimal completionRate = totalContracts > 0 
                ? BigDecimal.valueOf((completedContracts.doubleValue() / totalContracts.doubleValue()) * 100)
                : BigDecimal.ZERO;

        FreelancerDashboardResponse.DashboardStats stats = new FreelancerDashboardResponse.DashboardStats();
        stats.setTotalEarnings(totalEarnings);
        stats.setActiveProjects(activeProjects);
        stats.setProposalSuccessRate(proposalSuccessRate);
        stats.setRating(rating);
        stats.setCompletionRate(completionRate);
        stats.setTotalProposals(totalProposals);
        stats.setAcceptedProposals(acceptedProposals);
        stats.setTotalContracts(totalContracts);

        return stats;
    }

    private ContractResponse mapToContractResponse(Contract contract) {
        ContractResponse response = new ContractResponse();
        response.setId(contract.getId());
        response.setProjectTitle(contract.getProject() != null ? contract.getProject().getTitle() : null);
        response.setClientName(contract.getClient() != null ? contract.getClient().getFullName() : null);
        response.setStatus(contract.getStatus());
        response.setTotalAmount(contract.getTotalAmount());
        response.setEndDate(contract.getEndDate());
        response.setCreatedAt(contract.getCreatedAt());
        return response;
    }

    private ProposalResponse mapToProposalResponse(Proposal proposal) {
        ProposalResponse response = new ProposalResponse();
        response.setId(proposal.getId());
        response.setProjectTitle(proposal.getProject() != null ? proposal.getProject().getTitle() : null);
        response.setClientName(proposal.getClient() != null ? proposal.getClient().getFullName() : null);
        response.setStatus(proposal.getStatus());
        response.setProposedAmount(proposal.getProposedAmount());
        response.setDescription(proposal.getDescription());
        response.setSubmittedAt(proposal.getSubmittedAt());
        return response;
    }
}
