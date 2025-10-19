package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CreatePaymentRequestDto;
import com.freelance.platform.dto.response.PaymentResponse;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.PaymentService;
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
@RequestMapping("/api/payments")
@Tag(name = "Payment Management", description = "APIs for managing payments")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/requests")
    @Operation(summary = "Create payment request", description = "Create a payment request for a completed milestone")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Payment request created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Only freelancers can create payment requests")
    })
    public ResponseEntity<PaymentResponse> createPaymentRequest(
            @Valid @RequestBody CreatePaymentRequestDto request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        PaymentResponse response = paymentService.createPaymentRequest(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/requests/{id}")
    @Operation(summary = "Get payment request by ID", description = "Retrieve a specific payment request by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment request retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Payment request not found")
    })
    public ResponseEntity<PaymentResponse> getPaymentRequest(
            @Parameter(description = "Payment request ID") @PathVariable UUID id) {
        
        PaymentResponse response = paymentService.getPaymentRequestById(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests/{id}/approve")
    @Operation(summary = "Approve payment request", description = "Approve a payment request (clients only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment request approved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to approve this payment request"),
            @ApiResponse(responseCode = "404", description = "Payment request not found")
    })
    public ResponseEntity<PaymentResponse> approvePaymentRequest(
            @Parameter(description = "Payment request ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        PaymentResponse response = paymentService.approvePaymentRequest(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/requests/{id}/reject")
    @Operation(summary = "Reject payment request", description = "Reject a payment request with reason (clients only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment request rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Rejection reason is required"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to reject this payment request"),
            @ApiResponse(responseCode = "404", description = "Payment request not found")
    })
    public ResponseEntity<PaymentResponse> rejectPaymentRequest(
            @Parameter(description = "Payment request ID") @PathVariable UUID id,
            @Parameter(description = "Rejection reason") @RequestParam String rejectionReason,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        PaymentResponse response = paymentService.rejectPaymentRequest(id, rejectionReason, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/process")
    @Operation(summary = "Process payment", description = "Process an approved payment request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment processed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid payment data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Payment request not found")
    })
    public ResponseEntity<PaymentResponse> processPayment(
            @Parameter(description = "Payment request ID") @RequestParam UUID paymentRequestId,
            @Parameter(description = "Payment method") @RequestParam String paymentMethod,
            @Parameter(description = "Gateway transaction ID") @RequestParam String gatewayTransactionId) {
        
        PaymentResponse response = paymentService.processPayment(paymentRequestId, paymentMethod, gatewayTransactionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests/my-requests")
    @Operation(summary = "Get my payment requests", description = "Get all payment requests created by the current freelancer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment requests retrieved successfully")
    })
    public ResponseEntity<Page<PaymentResponse>> getMyPaymentRequests(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<PaymentResponse> response = paymentService.getPaymentRequestsByFreelancer(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests/received")
    @Operation(summary = "Get received payment requests", description = "Get all payment requests received by the current client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment requests retrieved successfully")
    })
    public ResponseEntity<Page<PaymentResponse>> getReceivedPaymentRequests(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<PaymentResponse> response = paymentService.getPaymentRequestsByClient(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests/contract/{contractId}")
    @Operation(summary = "Get payment requests for contract", description = "Get all payment requests for a specific contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Payment requests retrieved successfully")
    })
    public ResponseEntity<Page<PaymentResponse>> getPaymentRequestsForContract(
            @Parameter(description = "Contract ID") @PathVariable UUID contractId,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<PaymentResponse> response = paymentService.getPaymentRequestsByContract(contractId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions/contract/{contractId}")
    @Operation(summary = "Get transactions for contract", description = "Get all transactions for a specific contract")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transactions retrieved successfully")
    })
    public ResponseEntity<List<PaymentResponse>> getTransactionsForContract(
            @Parameter(description = "Contract ID") @PathVariable UUID contractId) {
        
        List<PaymentResponse> response = paymentService.getTransactionsByContract(contractId);
        return ResponseEntity.ok(response);
    }
}
