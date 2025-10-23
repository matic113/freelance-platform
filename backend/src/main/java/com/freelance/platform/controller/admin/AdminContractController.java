package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.response.AdminContractDTO;
import com.freelance.platform.entity.Contract;
import com.freelance.platform.entity.ContractStatus;
import com.freelance.platform.entity.Milestone;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.repository.ContractRepository;
import com.freelance.platform.repository.MilestoneRepository;
import com.freelance.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/contracts")
@Tag(name = "Admin Contract Management", description = "APIs for managing all platform contracts and milestones")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContractController {
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private MilestoneRepository milestoneRepository;
    
    @GetMapping
    @Operation(summary = "Get all contracts", description = "Get paginated list of all contracts")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contracts retrieved successfully"),
        @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<Page<AdminContractDTO>> getAllContracts(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminContractDTO> contracts = contractRepository.findAll(pageable)
            .map(AdminContractDTO::fromEntity);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get contracts by status", description = "Get contracts filtered by status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contracts retrieved successfully")
    })
    public ResponseEntity<Page<AdminContractDTO>> getContractsByStatus(
            @Parameter(description = "Contract status") @PathVariable ContractStatus status,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminContractDTO> contracts = contractRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
            .map(AdminContractDTO::fromEntity);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/{contractId}")
    @Operation(summary = "Get contract by ID", description = "Get contract details including milestones")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contract retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<AdminContractDTO> getContractById(
            @Parameter(description = "Contract ID") @PathVariable UUID contractId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        
        return ResponseEntity.ok(AdminContractDTO.fromEntity(contract));
    }
    
    @GetMapping("/{contractId}/milestones")
    @Operation(summary = "Get milestones for contract", description = "Get all milestones for a specific contract")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Milestones retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Contract not found")
    })
    public ResponseEntity<List<Milestone>> getContractMilestones(
            @Parameter(description = "Contract ID") @PathVariable UUID contractId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Contract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new ResourceNotFoundException("Contract not found"));
        
        List<Milestone> milestones = milestoneRepository.findByContractOrderByOrderIndex(contract);
        return ResponseEntity.ok(milestones);
    }
    
    @GetMapping("/milestones")
    @Operation(summary = "Get all milestones", description = "Get paginated list of all milestones")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Milestones retrieved successfully")
    })
    public ResponseEntity<Page<Milestone>> getAllMilestones(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<Milestone> milestones = milestoneRepository.findAll(pageable);
        return ResponseEntity.ok(milestones);
    }
    
    @GetMapping("/milestones/{milestoneId}")
    @Operation(summary = "Get milestone by ID", description = "Get milestone details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Milestone retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Milestone not found")
    })
    public ResponseEntity<Milestone> getMilestoneById(
            @Parameter(description = "Milestone ID") @PathVariable UUID milestoneId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Milestone milestone = milestoneRepository.findById(milestoneId)
            .orElseThrow(() -> new ResourceNotFoundException("Milestone not found"));
        
        return ResponseEntity.ok(milestone);
    }
    
    @GetMapping("/disputed")
    @Operation(summary = "Get disputed contracts", description = "Get all contracts with disputed status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Disputed contracts retrieved successfully")
    })
    public ResponseEntity<Page<AdminContractDTO>> getDisputedContracts(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminContractDTO> contracts = contractRepository.findDisputedContracts(pageable)
            .map(AdminContractDTO::fromEntity);
        return ResponseEntity.ok(contracts);
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get contract statistics", description = "Get contract statistics by status")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<?> getContractStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        long totalContracts = contractRepository.count();
        long activeContracts = contractRepository.countByStatus(ContractStatus.ACTIVE);
        long completedContracts = contractRepository.countByStatus(ContractStatus.COMPLETED);
        long cancelledContracts = contractRepository.countByStatus(ContractStatus.CANCELLED);
        long disputedContracts = contractRepository.countByStatus(ContractStatus.DISPUTED);
        
        var stats = new java.util.HashMap<String, Object>();
        stats.put("totalContracts", totalContracts);
        stats.put("activeContracts", activeContracts);
        stats.put("completedContracts", completedContracts);
        stats.put("cancelledContracts", cancelledContracts);
        stats.put("disputedContracts", disputedContracts);
        
        return ResponseEntity.ok(stats);
    }
}
