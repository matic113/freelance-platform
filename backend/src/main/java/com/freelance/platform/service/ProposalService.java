package com.freelance.platform.service;

import com.freelance.platform.dto.request.SubmitProposalRequest;
import com.freelance.platform.dto.request.UpdateProposalRequest;
import com.freelance.platform.dto.response.ProposalResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ProposalRepository;
import com.freelance.platform.repository.ProjectRepository;
import com.freelance.platform.repository.UserRepository;
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
public class ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailNotificationService emailNotificationService;

    @Autowired
    private AutoContractService autoContractService;

    public ProposalResponse submitProposal(SubmitProposalRequest request, UUID freelancerId) {
        System.out.println("DEBUG: ProposalService.submitProposal called");
        System.out.println("DEBUG: Freelancer ID: " + freelancerId);
        System.out.println("DEBUG: Project ID: " + request.getProjectId());
        
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        System.out.println("DEBUG: Freelancer found: " + freelancer.getEmail());

        if (!freelancer.isFreelancer()) {
            throw new UnauthorizedException("Only freelancers can submit proposals");
        }
        System.out.println("DEBUG: User type validation passed");

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        System.out.println("DEBUG: Project found: " + project.getTitle());
        System.out.println("DEBUG: Project status: " + project.getStatus());

        if (project.getStatus() != ProjectStatus.PUBLISHED) {
            System.out.println("DEBUG: Project status validation failed - status is: " + project.getStatus());
            throw new UnauthorizedException("Can only submit proposals to published projects");
        }
        System.out.println("DEBUG: Project status validation passed");

        // Check if freelancer already submitted a proposal for this project
        boolean existingProposal = proposalRepository.existsByProjectAndFreelancer(project, freelancer);
        if (existingProposal) {
            throw new UnauthorizedException("You have already submitted a proposal for this project");
        }
        System.out.println("DEBUG: Duplicate proposal check passed");

        System.out.println("DEBUG: Creating proposal...");
        Proposal proposal = new Proposal();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setClient(project.getClient());
        proposal.setTitle(request.getTitle());
        proposal.setDescription(request.getDescription());
        proposal.setProposedAmount(request.getProposedAmount());
        proposal.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        proposal.setEstimatedDuration(request.getEstimatedDuration());
        proposal.setStatus(ProposalStatus.PENDING);
        proposal.setSubmittedAt(LocalDateTime.now());
        proposal.setAttachments(request.getAttachments());
        System.out.println("DEBUG: Proposal created, saving...");

        Proposal savedProposal = proposalRepository.save(proposal);
        System.out.println("DEBUG: Proposal saved with ID: " + savedProposal.getId());

        // Send notification to client
        System.out.println("DEBUG: Creating notification...");
        notificationService.createNotificationForUser(
                project.getClient().getId(),
                "NEW_PROPOSAL",
                "New Proposal Received",
                String.format("You received a new proposal for project: %s", project.getTitle()),
                "high",
                String.format("{\"proposalId\":\"%s\",\"projectId\":\"%s\",\"freelancerId\":\"%s\"}", 
                             savedProposal.getId(), project.getId(), freelancer.getId())
        );
        System.out.println("DEBUG: Notification created");

        // Send email notification to client if enabled
         emailNotificationService.sendNewProposalEmail(
                 project.getClient(),
                 freelancer.getFirstName() + " " + freelancer.getLastName(),
                 project.getTitle(),
                 project.getId().toString()
         );

        System.out.println("DEBUG: Mapping to response...");
        return mapToProposalResponse(savedProposal);
    }

    public ProposalResponse updateProposal(UUID proposalId, UpdateProposalRequest request, UUID freelancerId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getFreelancer().getId().equals(freelancerId)) {
            throw new UnauthorizedException("You can only update your own proposals");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new UnauthorizedException("Only pending proposals can be updated");
        }

        // Update fields with validation
        if (request.getTitle() != null) {
            if (request.getTitle().trim().length() < 5) {
                throw new IllegalArgumentException("Title must be at least 5 characters long");
            }
            proposal.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            if (request.getDescription().trim().length() < 50) {
                throw new IllegalArgumentException("Description must be at least 50 characters long");
            }
            proposal.setDescription(request.getDescription());
        }
        if (request.getProposedAmount() != null) {
            if (request.getProposedAmount().compareTo(BigDecimal.valueOf(0.01)) < 0) {
                throw new IllegalArgumentException("Proposed amount must be greater than 0");
            }
            proposal.setProposedAmount(request.getProposedAmount());
        }
        if (request.getCurrency() != null) proposal.setCurrency(request.getCurrency());
        if (request.getEstimatedDuration() != null) proposal.setEstimatedDuration(request.getEstimatedDuration());
        if (request.getAttachments() != null) proposal.setAttachments(request.getAttachments());

        Proposal updatedProposal = proposalRepository.save(proposal);
        return mapToProposalResponse(updatedProposal);
    }

    public ProposalResponse acceptProposal(UUID proposalId, UUID clientId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only accept proposals for your own projects");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new UnauthorizedException("Only pending proposals can be accepted");
        }

        // Check if project is still available
        if (proposal.getProject().getStatus() != ProjectStatus.PUBLISHED) {
            throw new UnauthorizedException("Project is no longer available for proposals");
        }

        proposal.setStatus(ProposalStatus.ACCEPTED);
        proposal.setRespondedAt(LocalDateTime.now());

        // Reject all other proposals for this project
        List<Proposal> otherProposals = proposalRepository.findByProjectAndStatus(
                proposal.getProject(), ProposalStatus.PENDING);
        
        for (Proposal otherProposal : otherProposals) {
            if (!otherProposal.getId().equals(proposalId)) {
                otherProposal.setStatus(ProposalStatus.REJECTED);
                otherProposal.setRespondedAt(LocalDateTime.now());
                proposalRepository.save(otherProposal);

                // Send notification to rejected freelancers
                notificationService.createNotificationForUser(
                        otherProposal.getFreelancer().getId(),
                        "PROPOSAL_REJECTED",
                        "Proposal Rejected",
                        String.format("Your proposal for project '%s' was not selected", proposal.getProject().getTitle()),
                        "medium",
                        String.format("{\"proposalId\":\"%s\",\"projectId\":\"%s\"}", 
                                     otherProposal.getId(), proposal.getProject().getId())
                );

                // Send email notification to rejected freelancers if enabled
                emailNotificationService.sendProposalRejectedEmail(
                        otherProposal.getFreelancer(),
                        proposal.getProject().getTitle()
                );
            }
        }

        // Update project status to in progress
        proposal.getProject().setStatus(ProjectStatus.IN_PROGRESS);
        projectRepository.save(proposal.getProject());

        Proposal acceptedProposal = proposalRepository.save(proposal);

        // Auto-create contract from accepted proposal
        autoContractService.createContractFromProposal(acceptedProposal);

        // Send notification to accepted freelancer
        notificationService.createNotificationForUser(
                proposal.getFreelancer().getId(),
                "PROPOSAL_ACCEPTED",
                "Proposal Accepted!",
                String.format("Congratulations! Your proposal for project '%s' has been accepted", proposal.getProject().getTitle()),
                "high",
                String.format("{\"proposalId\":\"%s\",\"projectId\":\"%s\",\"clientId\":\"%s\"}", 
                             proposal.getId(), proposal.getProject().getId(), proposal.getClient().getId())
        );

        // Send email notification to accepted freelancer if enabled
        emailNotificationService.sendProposalAcceptedEmail(
                proposal.getFreelancer(),
                proposal.getClient().getFirstName() + " " + proposal.getClient().getLastName(),
                proposal.getProject().getTitle()
        );

        return mapToProposalResponse(acceptedProposal);
    }

    public ProposalResponse rejectProposal(UUID proposalId, UUID clientId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only reject proposals for your own projects");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new UnauthorizedException("Only pending proposals can be rejected");
        }

        proposal.setStatus(ProposalStatus.REJECTED);
        proposal.setRespondedAt(LocalDateTime.now());

        Proposal rejectedProposal = proposalRepository.save(proposal);

        // Send notification to freelancer
        notificationService.createNotificationForUser(
                proposal.getFreelancer().getId(),
                "PROPOSAL_REJECTED",
                "Proposal Rejected",
                String.format("Your proposal for project '%s' was not selected", proposal.getProject().getTitle()),
                "medium",
                String.format("{\"proposalId\":\"%s\",\"projectId\":\"%s\"}", 
                             proposal.getId(), proposal.getProject().getId())
        );

        // Send email notification to freelancer if enabled
        emailNotificationService.sendProposalRejectedEmail(
                proposal.getFreelancer(),
                proposal.getProject().getTitle()
        );

        return mapToProposalResponse(rejectedProposal);
    }

    public ProposalResponse withdrawProposal(UUID proposalId, UUID freelancerId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getFreelancer().getId().equals(freelancerId)) {
            throw new UnauthorizedException("You can only withdraw your own proposals");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new UnauthorizedException("Only pending proposals can be withdrawn");
        }

        proposal.setStatus(ProposalStatus.WITHDRAWN);
        proposal.setRespondedAt(LocalDateTime.now());

        Proposal withdrawnProposal = proposalRepository.save(proposal);

        // Send notification to client
        notificationService.createNotificationForUser(
                proposal.getClient().getId(),
                "PROPOSAL_WITHDRAWN",
                "Proposal Withdrawn",
                String.format("A freelancer withdrew their proposal for project '%s'", proposal.getProject().getTitle()),
                "medium",
                String.format("{\"proposalId\":\"%s\",\"projectId\":\"%s\",\"freelancerId\":\"%s\"}", 
                             proposal.getId(), proposal.getProject().getId(), proposal.getFreelancer().getId())
        );

        return mapToProposalResponse(withdrawnProposal);
    }

    public ProposalResponse getProposalById(UUID proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));
        return mapToProposalResponse(proposal);
    }

    public Page<ProposalResponse> getProposalsByFreelancer(UUID freelancerId, Pageable pageable) {
        Page<Proposal> proposals = proposalRepository.findByFreelancerIdOrderBySubmittedAtDesc(freelancerId, pageable);
        return proposals.map(this::mapToProposalResponse);
    }

    public Page<ProposalResponse> getProposalsByClient(UUID clientId, Pageable pageable) {
        Page<Proposal> proposals = proposalRepository.findByClientIdOrderBySubmittedAtDesc(clientId, pageable);
        return proposals.map(this::mapToProposalResponse);
    }

    public Page<ProposalResponse> getProposalsByProject(UUID projectId, Pageable pageable) {
        Page<Proposal> proposals = proposalRepository.findByProjectIdOrderBySubmittedAtDesc(projectId, pageable);
        return proposals.map(this::mapToProposalResponse);
    }

    public void deleteProposal(UUID proposalId, UUID freelancerId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new ResourceNotFoundException("Proposal not found"));

        if (!proposal.getFreelancer().getId().equals(freelancerId)) {
            throw new UnauthorizedException("You can only delete your own proposals");
        }

        if (proposal.getStatus() != ProposalStatus.PENDING) {
            throw new UnauthorizedException("Only pending proposals can be deleted");
        }

        proposalRepository.delete(proposal);
    }

    public boolean hasFreelancerProposedToProject(UUID projectId, UUID freelancerId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return proposalRepository.existsByProjectAndFreelancer(project, freelancer);
    }

    private ProposalResponse mapToProposalResponse(Proposal proposal) {
        ProposalResponse response = new ProposalResponse();
        response.setId(proposal.getId());
        response.setProjectId(proposal.getProject().getId());
        response.setProjectTitle(proposal.getProject().getTitle());
        response.setFreelancerId(proposal.getFreelancer().getId());
        response.setFreelancerName(proposal.getFreelancer().getFirstName() + " " + proposal.getFreelancer().getLastName());
        response.setClientId(proposal.getClient().getId());
        response.setClientName(proposal.getClient().getFirstName() + " " + proposal.getClient().getLastName());
        response.setTitle(proposal.getTitle());
        response.setDescription(proposal.getDescription());
        response.setProposedAmount(proposal.getProposedAmount());
        response.setCurrency(proposal.getCurrency());
        response.setEstimatedDuration(proposal.getEstimatedDuration());
        response.setStatus(proposal.getStatus());
        response.setSubmittedAt(proposal.getSubmittedAt());
        response.setRespondedAt(proposal.getRespondedAt());
        response.setAttachments(proposal.getAttachments());
        
        return response;
    }
}
