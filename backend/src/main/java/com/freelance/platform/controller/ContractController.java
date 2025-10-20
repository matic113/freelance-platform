package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CreateContractRequest;
import com.freelance.platform.dto.request.CreateMilestoneRequest;
import com.freelance.platform.dto.request.UpdateMilestoneRequest;
import com.freelance.platform.dto.response.ContractResponse;
import com.freelance.platform.dto.response.MilestoneResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.ContractService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contracts")
@Tag(name = "Contract Management", description = "APIs for managing contracts")
@SecurityRequirement(name = "bearerAuth")
public class ContractController {

    @Autowired
    private ContractService contractService;

    @PostMapping
    @Operation(summary = "Create a new contract", description = "Create a new contract from an accepted proposal")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Contract created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Only clients can create contracts")
    })
    public ResponseEntity<ContractResponse> createContract(
            @Valid @RequestBody CreateContractRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ContractResponse response = contractService.createContract(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contract by ID", description = "Retrieve a specific contract by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contract retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<ContractResponse> getContract(
            @Parameter(description = "Contract ID") @PathVariable UUID id) {
        
        ContractResponse response = contractService.getContractById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/accept")
    @Operation(summary = "Accept contract", description = "Accept a contract (freelancers only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contract accepted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to accept this contract"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<ContractResponse> acceptContract(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ContractResponse response = contractService.acceptContract(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject contract", description = "Reject a contract (freelancers only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contract rejected successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to reject this contract"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<ContractResponse> rejectContract(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ContractResponse response = contractService.rejectContract(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete contract", description = "Mark a contract as completed (clients only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contract completed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to complete this contract"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<ContractResponse> completeContract(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ContractResponse response = contractService.completeContract(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-contracts")
    @Operation(summary = "Get my contracts", description = "Get all contracts for the current user based on active role")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contracts retrieved successfully")
    })
    public ResponseEntity<Page<ContractResponse>> getMyContracts(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ContractResponse> response = contractService.getMyContracts(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/freelancer-contracts")
    @Operation(summary = "Get freelancer contracts", description = "Get all contracts for the current freelancer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contracts retrieved successfully")
    })
    public ResponseEntity<Page<ContractResponse>> getFreelancerContracts(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ContractResponse> response = contractService.getContractsByFreelancer(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/milestones")
    @Operation(summary = "Create milestone", description = "Create a new milestone for a contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Milestone created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to create milestones for this contract"),
            @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<MilestoneResponse> createMilestone(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @Valid @RequestBody CreateMilestoneRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        MilestoneResponse response = contractService.createMilestone(id, request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/milestones/{milestoneId}")
    @Operation(summary = "Update milestone", description = "Update an existing milestone")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Milestone updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to update this milestone"),
            @ApiResponse(responseCode = "404", description = "Contract or milestone not found")
    })
    public ResponseEntity<MilestoneResponse> updateMilestone(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @Parameter(description = "Milestone ID") @PathVariable UUID milestoneId,
            @Valid @RequestBody UpdateMilestoneRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        MilestoneResponse response = contractService.updateMilestone(id, milestoneId, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/milestones/{milestoneId}/start")
    @Operation(summary = "Start milestone", description = "Mark a milestone as in-progress (freelancers only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Milestone started successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to start this milestone"),
            @ApiResponse(responseCode = "404", description = "Contract or milestone not found")
    })
    public ResponseEntity<MilestoneResponse> startMilestone(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @Parameter(description = "Milestone ID") @PathVariable UUID milestoneId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        MilestoneResponse response = contractService.startMilestone(id, milestoneId, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/milestones/{milestoneId}/complete")
    @Operation(summary = "Complete milestone", description = "Mark a milestone as completed (freelancers only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Milestone completed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to complete this milestone"),
            @ApiResponse(responseCode = "404", description = "Contract or milestone not found")
    })
    public ResponseEntity<MilestoneResponse> completeMilestone(
            @Parameter(description = "Contract ID") @PathVariable UUID id,
            @Parameter(description = "Milestone ID") @PathVariable UUID milestoneId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        MilestoneResponse response = contractService.completeMilestone(id, milestoneId, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/milestones")
    @Operation(summary = "Get contract milestones", description = "Get all milestones for a contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Milestones retrieved successfully")
    })
    public ResponseEntity<List<MilestoneResponse>> getContractMilestones(
            @Parameter(description = "Contract ID") @PathVariable UUID id) {
        
        List<MilestoneResponse> response = contractService.getContractMilestones(id);
        return ResponseEntity.ok(response);
    }
}
