package com.freelance.platform.controller;

import com.freelance.platform.dto.request.SubmitProposalRequest;
import com.freelance.platform.dto.request.UpdateProposalRequest;
import com.freelance.platform.dto.response.ProposalResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.ProposalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/proposals")
@Tag(name = "Proposal Management", description = "APIs for managing proposals")
@SecurityRequirement(name = "bearerAuth")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;

    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    @Operation(summary = "Submit a proposal", description = "Submit a proposal for a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Proposal submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Only freelancers can submit proposals")
    })
    public ResponseEntity<ProposalResponse> submitProposal(
            @Valid @RequestBody SubmitProposalRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProposalResponse response = proposalService.submitProposal(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get proposal by ID", description = "Retrieve a specific proposal by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposal retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Proposal not found")
    })
    public ResponseEntity<ProposalResponse> getProposal(
            @Parameter(description = "Proposal ID") @PathVariable UUID id) {
        
        ProposalResponse response = proposalService.getProposalById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    @Operation(summary = "Update proposal", description = "Update an existing proposal (only pending proposals)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposal updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to update this proposal"),
            @ApiResponse(responseCode = "404", description = "Proposal not found")
    })
    public ResponseEntity<ProposalResponse> updateProposal(
            @Parameter(description = "Proposal ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateProposalRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProposalResponse response = proposalService.updateProposal(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('FREELANCER')")
    @Operation(summary = "Delete proposal", description = "Delete a proposal (only pending proposals)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Proposal deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to delete this proposal"),
            @ApiResponse(responseCode = "404", description = "Proposal not found")
    })
    public ResponseEntity<Void> deleteProposal(
            @Parameter(description = "Proposal ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        proposalService.deleteProposal(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Accept proposal", description = "Accept a proposal (clients only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposal accepted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to accept this proposal"),
            @ApiResponse(responseCode = "404", description = "Proposal not found")
    })
    public ResponseEntity<ProposalResponse> acceptProposal(
            @Parameter(description = "Proposal ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProposalResponse response = proposalService.acceptProposal(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Reject proposal", description = "Reject a proposal (clients only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposal rejected successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to reject this proposal"),
            @ApiResponse(responseCode = "404", description = "Proposal not found")
    })
    public ResponseEntity<ProposalResponse> rejectProposal(
            @Parameter(description = "Proposal ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProposalResponse response = proposalService.rejectProposal(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('FREELANCER')")
    @Operation(summary = "Withdraw proposal", description = "Withdraw a proposal (freelancers only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposal withdrawn successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to withdraw this proposal"),
            @ApiResponse(responseCode = "404", description = "Proposal not found")
    })
    public ResponseEntity<ProposalResponse> withdrawProposal(
            @Parameter(description = "Proposal ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProposalResponse response = proposalService.withdrawProposal(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-proposals")
    @PreAuthorize("hasRole('FREELANCER')")
    @Operation(summary = "Get my proposals", description = "Get all proposals submitted by the current freelancer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposals retrieved successfully")
    })
    public ResponseEntity<Page<ProposalResponse>> getMyProposals(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ProposalResponse> response = proposalService.getProposalsByFreelancer(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "Get received proposals", description = "Get all proposals received by the current client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposals retrieved successfully")
    })
    public ResponseEntity<Page<ProposalResponse>> getReceivedProposals(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ProposalResponse> response = proposalService.getProposalsByClient(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get proposals for project", description = "Get all proposals for a specific project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proposals retrieved successfully")
    })
    public ResponseEntity<Page<ProposalResponse>> getProposalsForProject(
            @Parameter(description = "Project ID") @PathVariable UUID projectId,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ProposalResponse> response = proposalService.getProposalsByProject(projectId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{projectId}")
    @PreAuthorize("hasRole('FREELANCER')")
    @Operation(summary = "Check if freelancer has proposed to project", description = "Check if the current freelancer has already submitted a proposal for this project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Check completed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Map<String, Boolean>> hasProposedToProject(
            @Parameter(description = "Project ID") @PathVariable UUID projectId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        boolean hasProposed = proposalService.hasFreelancerProposedToProject(projectId, currentUser.getId());
        Map<String, Boolean> response = Map.of("hasProposed", hasProposed);
        return ResponseEntity.ok(response);
    }
}
