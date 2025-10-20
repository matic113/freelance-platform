package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreateContractRequest;
import com.freelance.platform.dto.request.CreateMilestoneRequest;
import com.freelance.platform.dto.request.UpdateMilestoneRequest;
import com.freelance.platform.dto.response.ContractResponse;
import com.freelance.platform.dto.response.MilestoneResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ContractRepository;
import com.freelance.platform.repository.MilestoneRepository;
import com.freelance.platform.repository.ProposalRepository;
import com.freelance.platform.repository.ProjectRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private MilestoneRepository milestoneRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    public ContractResponse createContract(CreateContractRequest request, UUID clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!client.isClient()) {
            throw new UnauthorizedException("Only clients can create contracts");
        }

        Proposal proposal = proposalRepository.findById(request.getProposalId())
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only create contracts from your own proposals");
        }

        if (proposal.getStatus() != ProposalStatus.ACCEPTED) {
            throw new UnauthorizedException("Can only create contracts from accepted proposals");
        }

        // Check if contract already exists for this proposal
        boolean existingContract = contractRepository.existsByProposal(proposal);
        if (existingContract) {
            throw new UnauthorizedException("Contract already exists for this proposal");
        }

        Contract contract = new Contract();
        contract.setProject(proposal.getProject());
        contract.setClient(proposal.getClient());
        contract.setFreelancer(proposal.getFreelancer());
        contract.setProposal(proposal);
        contract.setTitle(request.getTitle());
        contract.setDescription(request.getDescription());
        contract.setTotalAmount(request.getTotalAmount());
        contract.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        contract.setStatus(ContractStatus.PENDING);
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());

        Contract savedContract = contractRepository.save(contract);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                proposal.getFreelancer().getId(),
                "CONTRACT_CREATED",
                "New Contract Created",
                String.format("A new contract has been created for project: %s", proposal.getProject().getTitle()),
                "high",
                String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"clientId\":\"%s\"}", 
                             savedContract.getId(), proposal.getProject().getId(), proposal.getClient().getId())
        );

        return mapToContractResponse(savedContract);
    }

    public ContractResponse acceptContract(UUID contractId, UUID freelancerId) {
         Contract contract = contractRepository.findById(contractId)
                 .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

         if (!contract.getFreelancer().getId().equals(freelancerId)) {
             throw new UnauthorizedException("You can only accept your own contracts");
         }

         if (contract.getStatus() != ContractStatus.PENDING) {
             throw new UnauthorizedException("Only pending contracts can be accepted");
         }

         contract.setStatus(ContractStatus.ACTIVE);
         contract.setUpdatedAt(LocalDateTime.now());

         Contract acceptedContract = contractRepository.save(contract);

         // Set all milestones to PENDING status when contract is approved
         List<Milestone> milestones = milestoneRepository.findByContractIdOrderByOrderIndexAsc(contractId);
         for (Milestone milestone : milestones) {
             milestone.setStatus(MilestoneStatus.PENDING);
             milestoneRepository.save(milestone);
         }

         Project project = contract.getProject();
         if (project.getStatus() == ProjectStatus.PUBLISHED) {
             project.setStatus(ProjectStatus.IN_PROGRESS);
             project.setUpdatedAt(LocalDateTime.now());
             projectRepository.save(project);

             notificationService.createNotificationForUser(
                     contract.getClient().getId(),
                     "PROJECT_STARTED",
                     "Project Started",
                     String.format("Your project '%s' is now in progress", project.getTitle()),
                     "high",
                     String.format("{\"projectId\":\"%s\"}", project.getId())
             );
         }

         notificationService.createNotificationForUser(
                 contract.getClient().getId(),
                 "CONTRACT_ACCEPTED",
                 "Contract Accepted",
                 String.format("Your contract for project '%s' has been accepted by the freelancer", contract.getProject().getTitle()),
                 "high",
                 String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"freelancerId\":\"%s\"}", 
                              contract.getId(), contract.getProject().getId(), contract.getFreelancer().getId())
         );

         emailService.sendContractAcceptedEmail(
                 contract.getClient(),
                 contract.getFreelancer().getFirstName() + " " + contract.getFreelancer().getLastName(),
                 contract.getProject().getTitle()
         );

         return mapToContractResponse(acceptedContract);
     }

    public ContractResponse rejectContract(UUID contractId, UUID freelancerId) {
         Contract contract = contractRepository.findById(contractId)
                 .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

         if (!contract.getFreelancer().getId().equals(freelancerId)) {
             throw new UnauthorizedException("You can only reject your own contracts");
         }

         if (contract.getStatus() != ContractStatus.PENDING) {
             throw new UnauthorizedException("Only pending contracts can be rejected");
         }

         contract.setStatus(ContractStatus.CANCELLED);
         contract.setUpdatedAt(LocalDateTime.now());

         Contract rejectedContract = contractRepository.save(contract);

         notificationService.createNotificationForUser(
                 contract.getClient().getId(),
                 "CONTRACT_REJECTED",
                 "Contract Rejected",
                 String.format("Your contract for project '%s' was rejected by the freelancer", contract.getProject().getTitle()),
                 "medium",
                 String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"freelancerId\":\"%s\"}", 
                              contract.getId(), contract.getProject().getId(), contract.getFreelancer().getId())
         );

         emailService.sendContractRejectedEmail(
                 contract.getClient(),
                 contract.getFreelancer().getFirstName() + " " + contract.getFreelancer().getLastName(),
                 contract.getProject().getTitle()
         );

         return mapToContractResponse(rejectedContract);
     }

    public ContractResponse completeContract(UUID contractId, UUID clientId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        if (!contract.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only complete your own contracts");
        }

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new UnauthorizedException("Only active contracts can be completed");
        }

        contract.setStatus(ContractStatus.COMPLETED);
        contract.setUpdatedAt(LocalDateTime.now());

        Contract completedContract = contractRepository.save(contract);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                contract.getFreelancer().getId(),
                "CONTRACT_COMPLETED",
                "Contract Completed",
                String.format("Congratulations! Your contract for project '%s' has been completed", contract.getProject().getTitle()),
                "high",
                String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"clientId\":\"%s\"}", 
                             contract.getId(), contract.getProject().getId(), contract.getClient().getId())
        );

        return mapToContractResponse(completedContract);
    }

    public MilestoneResponse createMilestone(UUID contractId, CreateMilestoneRequest request, UUID clientId) {
        System.out.println("DEBUG: ContractService.createMilestone called");
        System.out.println("DEBUG: Contract ID: " + contractId);
        System.out.println("DEBUG: Client ID: " + clientId);
        
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        System.out.println("DEBUG: Contract found: " + contract.getTitle());
        System.out.println("DEBUG: Contract status: " + contract.getStatus());
        System.out.println("DEBUG: Contract client ID: " + contract.getClient().getId());

        if (!contract.getClient().getId().equals(clientId)) {
            System.out.println("DEBUG: Client ID mismatch - contract client: " + contract.getClient().getId() + ", request client: " + clientId);
            throw new UnauthorizedException("You can only create milestones for your own contracts");
        }
        System.out.println("DEBUG: Client ownership validation passed");

        if (contract.getStatus() != ContractStatus.ACTIVE && contract.getStatus() != ContractStatus.PENDING) {
            System.out.println("DEBUG: Contract status validation failed - status is: " + contract.getStatus() + ", expected: ACTIVE or PENDING");
            throw new UnauthorizedException("Can only create milestones for active or pending contracts");
        }
        System.out.println("DEBUG: Contract status validation passed");

        Milestone milestone = new Milestone();
        milestone.setContract(contract);
        milestone.setTitle(request.getTitle());
        milestone.setDescription(request.getDescription());
        milestone.setAmount(request.getAmount());
        milestone.setStatus(MilestoneStatus.PENDING);
        milestone.setDueDate(request.getDueDate());
        milestone.setOrderIndex(request.getOrderIndex());
        milestone.setCreatedAt(LocalDateTime.now());

        Milestone savedMilestone = milestoneRepository.save(milestone);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                contract.getFreelancer().getId(),
                "MILESTONE_CREATED",
                "New Milestone Created",
                String.format("A new milestone '%s' has been created for your contract", request.getTitle()),
                "medium",
                String.format("{\"milestoneId\":\"%s\",\"contractId\":\"%s\",\"projectId\":\"%s\"}", 
                             savedMilestone.getId(), contract.getId(), contract.getProject().getId())
        );

        return mapToMilestoneResponse(savedMilestone);
    }

    public MilestoneResponse updateMilestone(UUID contractId, UUID milestoneId, UpdateMilestoneRequest request, UUID clientId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

        if (!contract.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only update milestones for your own contracts");
        }

        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

        if (!milestone.getContract().getId().equals(contractId)) {
            throw new UnauthorizedException("Milestone does not belong to this contract");
        }

        if (milestone.getStatus() != MilestoneStatus.PENDING) {
            throw new UnauthorizedException("Only pending milestones can be updated");
        }

        // Update fields
        if (request.getTitle() != null) milestone.setTitle(request.getTitle());
        if (request.getDescription() != null) milestone.setDescription(request.getDescription());
        if (request.getAmount() != null) milestone.setAmount(request.getAmount());
        if (request.getDueDate() != null) milestone.setDueDate(request.getDueDate());
        if (request.getOrderIndex() != null) milestone.setOrderIndex(request.getOrderIndex());

        Milestone updatedMilestone = milestoneRepository.save(milestone);
        return mapToMilestoneResponse(updatedMilestone);
     }

     public MilestoneResponse updateMilestoneStatus(UUID contractId, UUID milestoneId, MilestoneStatus newStatus, UUID userId) {
            Contract contract = contractRepository.findById(contractId)
                    .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));

            if (!contract.getFreelancer().getId().equals(userId)) {
                throw new UnauthorizedException("You can only update milestones for your own contracts");
            }

            Milestone milestone = milestoneRepository.findById(milestoneId)
                    .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));

            if (!milestone.getContract().getId().equals(contractId)) {
                throw new UnauthorizedException("Milestone does not belong to this contract");
            }

            MilestoneStatus currentStatus = milestone.getStatus();
            
            if (!isValidStatusTransition(currentStatus, newStatus)) {
                throw new UnauthorizedException(
                    String.format("Cannot transition from %s to %s", currentStatus, newStatus)
                );
            }

            milestone.setStatus(newStatus);
            
            if (newStatus == MilestoneStatus.COMPLETED) {
                milestone.setCompletedDate(LocalDateTime.now());
            }

            Milestone updatedMilestone = milestoneRepository.save(milestone);

            String notificationTitle = getStatusChangeNotificationTitle(newStatus);
            String notificationMessage = String.format("Milestone '%s' status has been updated to %s", 
                    milestone.getTitle(), newStatus);

            notificationService.createNotificationForUser(
                    contract.getClient().getId(),
                    "MILESTONE_STATUS_CHANGED",
                    notificationTitle,
                    notificationMessage,
                    "medium",
                    String.format("{\"milestoneId\":\"%s\",\"contractId\":\"%s\",\"projectId\":\"%s\"}", 
                                 milestone.getId(), contract.getId(), contract.getProject().getId())
            );

            if (newStatus == MilestoneStatus.COMPLETED) {
                checkAndAutoCompleteContract(contract);
            }

            return mapToMilestoneResponse(updatedMilestone);
        }

        private boolean isValidStatusTransition(MilestoneStatus currentStatus, MilestoneStatus newStatus) {
            if (currentStatus == newStatus) {
                return false;
            }
            
            return switch (currentStatus) {
                case PENDING -> newStatus == MilestoneStatus.IN_PROGRESS;
                case IN_PROGRESS -> newStatus == MilestoneStatus.COMPLETED;
                case COMPLETED -> newStatus == MilestoneStatus.PAID;
                case PAID -> false;
                default -> false;
            };
        }

        private String getStatusChangeNotificationTitle(MilestoneStatus status) {
            return switch (status) {
                case IN_PROGRESS -> "Milestone Started";
                case COMPLETED -> "Milestone Completed";
                case PAID -> "Milestone Paid";
                default -> "Milestone Status Updated";
            };
        }

        private void checkAndAutoCompleteContract(Contract contract) {
           List<Milestone> allMilestones = milestoneRepository.findByContractIdOrderByOrderIndexAsc(contract.getId());
           
           boolean allCompleted = allMilestones.stream()
                   .allMatch(m -> m.getStatus() == MilestoneStatus.COMPLETED);
           
           if (allCompleted && contract.getStatus() == ContractStatus.ACTIVE) {
               contract.setStatus(ContractStatus.COMPLETED);
               contract.setUpdatedAt(LocalDateTime.now());
               contractRepository.save(contract);

               notificationService.createNotificationForUser(
                       contract.getClient().getId(),
                       "CONTRACT_COMPLETED",
                       "Contract Auto-Completed",
                       String.format("All milestones completed! Your contract for project '%s' has been auto-completed", contract.getProject().getTitle()),
                       "high",
                       String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"freelancerId\":\"%s\"}", 
                                    contract.getId(), contract.getProject().getId(), contract.getFreelancer().getId())
               );

               notificationService.createNotificationForUser(
                       contract.getFreelancer().getId(),
                       "CONTRACT_COMPLETED",
                       "Contract Auto-Completed",
                       String.format("Congratulations! Your contract for project '%s' has been completed", contract.getProject().getTitle()),
                       "high",
                       String.format("{\"contractId\":\"%s\",\"projectId\":\"%s\",\"clientId\":\"%s\"}", 
                                    contract.getId(), contract.getProject().getId(), contract.getClient().getId())
               );

               checkAndAutoCompleteProject(contract.getProject());
           }
       }

        private void checkAndAutoCompleteProject(Project project) {
            List<Contract> projectContracts = contractRepository.findByProject(project);
            
            boolean allContractsCompleted = projectContracts.stream()
                    .allMatch(c -> c.getStatus() == ContractStatus.COMPLETED);
            
            if (allContractsCompleted && project.getStatus() == ProjectStatus.IN_PROGRESS) {
                project.setStatus(ProjectStatus.COMPLETED);
                project.setUpdatedAt(LocalDateTime.now());
                projectRepository.save(project);

                notificationService.createNotificationForUser(
                        project.getClient().getId(),
                        "PROJECT_COMPLETED",
                        "Project Auto-Completed",
                        String.format("Congratulations! Your project '%s' has been completed", project.getTitle()),
                        "high",
                        String.format("{\"projectId\":\"%s\"}", project.getId())
                );

                for (Contract contract : projectContracts) {
                    notificationService.createNotificationForUser(
                            contract.getFreelancer().getId(),
                            "PROJECT_COMPLETED",
                            "Project Auto-Completed",
                            String.format("Congratulations! Project '%s' has been completed successfully", project.getTitle()),
                            "high",
                            String.format("{\"projectId\":\"%s\",\"contractId\":\"%s\"}", 
                                         project.getId(), contract.getId())
                    );

                    emailService.sendProjectCompletedEmail(
                            project.getClient(),
                            contract.getFreelancer().getFirstName() + " " + contract.getFreelancer().getLastName(),
                            project.getTitle(),
                            "CLIENT",
                            "Freelancer"
                    );

                    emailService.sendProjectCompletedEmail(
                            contract.getFreelancer(),
                            project.getClient().getFirstName() + " " + project.getClient().getLastName(),
                            project.getTitle(),
                            "FREELANCER",
                            "Client"
                    );
                }
            }
        }

    public ContractResponse getContractById(UUID contractId) {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        // Load milestones for the contract
        List<Milestone> milestones = milestoneRepository.findByContractIdOrderByOrderIndexAsc(contractId);
        contract.setMilestones(milestones);
        return mapToContractResponse(contract);
    }

    public Page<ContractResponse> getMyContracts(UUID userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Page<ContractResponse> response;
        if (user.getActiveRole() == Role.FREELANCER) {
            response = getContractsByFreelancer(userId, pageable);
        } else {
            response = getContractsByClient(userId, pageable);
        }
        return response;
    }

    public Page<ContractResponse> getContractsByClient(UUID clientId, Pageable pageable) {
        Page<Contract> contracts = contractRepository.findByClientIdOrderByCreatedAtDesc(clientId, pageable);
        return contracts.map(contract -> {
            // Load milestones for each contract
            List<Milestone> milestones = milestoneRepository.findByContractIdOrderByOrderIndexAsc(contract.getId());
            contract.setMilestones(milestones);
            return mapToContractResponse(contract);
        });
    }

    public Page<ContractResponse> getContractsByFreelancer(UUID freelancerId, Pageable pageable) {
        Page<Contract> contracts = contractRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId, pageable);
        return contracts.map(contract -> {
            // Load milestones for each contract
            List<Milestone> milestones = milestoneRepository.findByContractIdOrderByOrderIndexAsc(contract.getId());
            contract.setMilestones(milestones);
            return mapToContractResponse(contract);
        });
    }

    public List<MilestoneResponse> getContractMilestones(UUID contractId) {
        List<Milestone> milestones = milestoneRepository.findByContractIdOrderByOrderIndexAsc(contractId);
        return milestones.stream()
                .map(this::mapToMilestoneResponse)
                .collect(Collectors.toList());
    }

    private ContractResponse mapToContractResponse(Contract contract) {
        ContractResponse response = new ContractResponse();
        response.setId(contract.getId());
        response.setProjectId(contract.getProject().getId());
        response.setProjectTitle(contract.getProject().getTitle());
        response.setClientId(contract.getClient().getId());
        response.setClientName(contract.getClient().getFirstName() + " " + contract.getClient().getLastName());
        response.setFreelancerId(contract.getFreelancer().getId());
        response.setFreelancerName(contract.getFreelancer().getFirstName() + " " + contract.getFreelancer().getLastName());
        response.setProposalId(contract.getProposal().getId());
        response.setTitle(contract.getTitle());
        response.setDescription(contract.getDescription());
        response.setTotalAmount(contract.getTotalAmount());
        response.setCurrency(contract.getCurrency());
        response.setStatus(contract.getStatus());
        response.setStartDate(contract.getStartDate());
        response.setEndDate(contract.getEndDate());
        response.setCreatedAt(contract.getCreatedAt());
        response.setUpdatedAt(contract.getUpdatedAt());
        
        // Map milestones
        List<MilestoneResponse> milestoneResponses = contract.getMilestones().stream()
                .map(this::mapToMilestoneResponse)
                .collect(Collectors.toList());
        response.setMilestones(milestoneResponses);
        
        return response;
    }

    private MilestoneResponse mapToMilestoneResponse(Milestone milestone) {
        MilestoneResponse response = new MilestoneResponse();
        response.setId(milestone.getId());
        response.setContractId(milestone.getContract().getId());
        response.setTitle(milestone.getTitle());
        response.setDescription(milestone.getDescription());
        response.setAmount(milestone.getAmount());
        response.setStatus(milestone.getStatus());
        response.setDueDate(milestone.getDueDate());
        response.setCompletedDate(milestone.getCompletedDate());
        response.setPaidDate(milestone.getPaidDate());
        response.setOrderIndex(milestone.getOrderIndex());
        response.setCreatedAt(milestone.getCreatedAt());
        
        return response;
    }
}
