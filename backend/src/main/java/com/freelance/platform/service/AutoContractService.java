package com.freelance.platform.service;

import com.freelance.platform.entity.*;
import com.freelance.platform.repository.ContractRepository;
import com.freelance.platform.repository.ConversationRepository;
import com.freelance.platform.repository.MilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@Transactional
public class AutoContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    public Contract createContractFromProposal(Proposal proposal) {
        if (proposal.getStatus() != ProposalStatus.ACCEPTED) {
            throw new IllegalArgumentException("Can only create contracts from accepted proposals");
        }

        boolean existingContract = contractRepository.existsByProposal(proposal);
        if (existingContract) {
            throw new IllegalArgumentException("Contract already exists for this proposal");
        }

        Contract contract = new Contract();
        contract.setProject(proposal.getProject());
        contract.setClient(proposal.getClient());
        contract.setFreelancer(proposal.getFreelancer());
        contract.setProposal(proposal);
        contract.setTitle(proposal.getTitle());
        contract.setDescription(proposal.getDescription());
        contract.setTotalAmount(proposal.getProposedAmount());
        contract.setCurrency(proposal.getCurrency());
        contract.setStatus(ContractStatus.PENDING);

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = calculateEndDate(startDate, proposal.getEstimatedDuration());
        contract.setStartDate(startDate);
        contract.setEndDate(endDate);
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());

        Contract savedContract = contractRepository.save(contract);

        initializeDefaultMilestones(savedContract);

        createProjectConversation(savedContract);

         notificationService.createNotificationForUser(
                 proposal.getFreelancer().getId(),
                 "CONTRACT_CREATED",
                 "New Contract Created",
                 String.format("A new contract has been created for project: %s. Please review and accept the contract terms.",
                         proposal.getProject().getTitle()),
                 "high",
                 String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"clientId\":\"%s\"}",
                         savedContract.getId(), proposal.getProject().getId(), proposal.getClient().getId())
         );

         // Send email to freelancer
         emailService.sendContractCreatedEmail(
                 proposal.getFreelancer(),
                 proposal.getClient().getFirstName() + " " + proposal.getClient().getLastName(),
                 proposal.getProject().getTitle(),
                 savedContract.getId().toString()
         );

         return savedContract;
    }

    private void initializeDefaultMilestones(Contract contract) {
        if (contract.getProposal().getEstimatedDuration() == null || contract.getProposal().getEstimatedDuration().isEmpty()) {
            createSingleMilestone(contract);
        } else {
            createMilestonesBasedOnDuration(contract);
        }
    }

    private void createSingleMilestone(Contract contract) {
        Milestone milestone = new Milestone();
        milestone.setContract(contract);
        milestone.setTitle("Project Completion");
        milestone.setDescription("Full project completion and delivery");
        milestone.setAmount(contract.getTotalAmount());
        milestone.setStatus(MilestoneStatus.PENDING);
        milestone.setDueDate(contract.getEndDate());
        milestone.setOrderIndex(1);
        milestone.setCreatedAt(LocalDateTime.now());

        milestoneRepository.save(milestone);
    }

    private void createMilestonesBasedOnDuration(Contract contract) {
        String duration = contract.getProposal().getEstimatedDuration().toLowerCase();

        if (duration.contains("week")) {
            createWeeklyMilestones(contract);
        } else if (duration.contains("month")) {
            createMonthlyMilestones(contract);
        } else {
            createSingleMilestone(contract);
        }
    }

    private void createWeeklyMilestones(Contract contract) {
        long daysDifference = ChronoUnit.DAYS.between(contract.getStartDate(), contract.getEndDate());
        int numMilestones = (int) (daysDifference / 7) + 1;

        if (numMilestones < 2) numMilestones = 2;
        if (numMilestones > 4) numMilestones = 4;

        createEqualMilestones(contract, numMilestones);
    }

    private void createMonthlyMilestones(Contract contract) {
        long daysDifference = ChronoUnit.DAYS.between(contract.getStartDate(), contract.getEndDate());
        int numMilestones = (int) (daysDifference / 30) + 1;

        if (numMilestones < 2) numMilestones = 2;
        if (numMilestones > 6) numMilestones = 6;

        createEqualMilestones(contract, numMilestones);
    }

    private void createEqualMilestones(Contract contract, int numMilestones) {
        long totalDays = ChronoUnit.DAYS.between(contract.getStartDate(), contract.getEndDate());
        long daysPerMilestone = totalDays / numMilestones;

        for (int i = 0; i < numMilestones; i++) {
            Milestone milestone = new Milestone();
            milestone.setContract(contract);
            milestone.setTitle("Milestone " + (i + 1));
            milestone.setDescription("Phase " + (i + 1) + " of project delivery");
            milestone.setAmount(contract.getTotalAmount()
                    .divide(java.math.BigDecimal.valueOf(numMilestones), 2, java.math.RoundingMode.HALF_UP));
            milestone.setStatus(MilestoneStatus.PENDING);

            LocalDate dueDate = contract.getStartDate().plusDays((i + 1) * daysPerMilestone);
            if (dueDate.isAfter(contract.getEndDate())) {
                dueDate = contract.getEndDate();
            }
            milestone.setDueDate(dueDate);
            milestone.setOrderIndex(i + 1);
            milestone.setCreatedAt(LocalDateTime.now());

            milestoneRepository.save(milestone);
        }
    }

    private LocalDate calculateEndDate(LocalDate startDate, String estimatedDuration) {
        if (estimatedDuration == null || estimatedDuration.isEmpty()) {
            return startDate.plusMonths(1);
        }

        String duration = estimatedDuration.toLowerCase().trim();

        if (duration.contains("1 week") || duration.contains("1week")) {
            return startDate.plusWeeks(1);
        } else if (duration.contains("week")) {
            int weeks = extractNumber(duration);
            if (weeks > 0) return startDate.plusWeeks(weeks);
        }

        if (duration.contains("1 month") || duration.contains("1month")) {
            return startDate.plusMonths(1);
        } else if (duration.contains("month")) {
            int months = extractNumber(duration);
            if (months > 0) return startDate.plusMonths(months);
        }

        if (duration.contains("1 day") || duration.contains("1day")) {
            return startDate.plusDays(1);
        } else if (duration.contains("day")) {
            int days = extractNumber(duration);
            if (days > 0) return startDate.plusDays(days);
        }

        return startDate.plusMonths(1);
    }

    private int extractNumber(String text) {
        StringBuilder numberStr = new StringBuilder();
        for (char c : text.toCharArray()) {
            if (Character.isDigit(c)) {
                numberStr.append(c);
            }
        }
        try {
            return Integer.parseInt(numberStr.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private void createProjectConversation(Contract contract) {
        Conversation conversation = conversationRepository
                .findProjectConversation(contract.getProject(), contract.getClient(), contract.getFreelancer())
                .orElseGet(() -> {
                    Conversation newConversation = new Conversation(
                            contract.getClient(),
                            contract.getFreelancer(),
                            contract.getProject(),
                            ConversationType.PROJECT_CHAT
                    );
                    return conversationRepository.save(newConversation);
                });
    }
}
