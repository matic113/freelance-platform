package com.freelance.platform.controller.admin;

import com.freelance.platform.entity.ContactForm;
import com.freelance.platform.entity.ContactStatus;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.ContactFormService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/contact-forms")
@Tag(name = "Admin Contact Form Management", description = "APIs for managing contact forms from admin panel")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactFormController {

    @Autowired
    private ContactFormService contactFormService;

    @GetMapping
    @Operation(summary = "Get all contact forms", description = "Get paginated list of all contact forms")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact forms retrieved successfully")
    })
    public ResponseEntity<Page<ContactForm>> getAllContactForms(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ContactForm> contactForms = contactFormService.getAllContactForms(pageable);
        return ResponseEntity.ok(contactForms);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get contact form statistics", description = "Get statistics about contact forms")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getContactFormStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> stats = contactFormService.getContactFormStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent contact forms", description = "Get recent contact form submissions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recent contact forms retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getRecentContactForms(
            @Parameter(description = "Number of recent forms to retrieve") @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        var recentForms = contactFormService.getRecentContactForms(limit);
        Map<String, Object> response = Map.of("contactForms", recentForms, "count", recentForms.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get contact form by ID", description = "Get contact form details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact form retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Contact form not found")
    })
    public ResponseEntity<ContactForm> getContactFormById(
            @Parameter(description = "Contact form ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ContactForm contactForm = contactFormService.getContactFormById(id);
        return ResponseEntity.ok(contactForm);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update contact form status", description = "Update the status of a contact form")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact form status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Contact form not found")
    })
    public ResponseEntity<ContactForm> updateContactFormStatus(
            @Parameter(description = "Contact form ID") @PathVariable UUID id,
            @Parameter(description = "New status") @RequestParam ContactStatus status,
            @Parameter(description = "Admin notes") @RequestParam(required = false) String adminNotes,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ContactForm updatedForm = contactFormService.updateContactFormStatus(id, status, adminNotes);
        return ResponseEntity.ok(updatedForm);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete contact form", description = "Delete a contact form")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Contact form deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Contact form not found")
    })
    public ResponseEntity<Void> deleteContactForm(
            @Parameter(description = "Contact form ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        contactFormService.deleteContactForm(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-status")
    @Operation(summary = "Get contact forms by status", description = "Get contact forms filtered by status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Contact forms retrieved successfully")
    })
    public ResponseEntity<Page<ContactForm>> getContactFormsByStatus(
            @Parameter(description = "Contact form status") @RequestParam ContactStatus status,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ContactForm> contactForms = contactFormService.getContactFormsByStatus(status, pageable);
        return ResponseEntity.ok(contactForms);
    }
}
