package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.request.CreateFAQRequest;
import com.freelance.platform.dto.request.UpdateFAQRequest;
import com.freelance.platform.dto.response.FAQResponse;
import com.freelance.platform.entity.FAQCategory;
import com.freelance.platform.service.FAQService;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/faqs")
@Tag(name = "Admin FAQ Management", description = "APIs for managing FAQs from admin panel")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFAQController {

    @Autowired
    private FAQService faqService;

    @GetMapping
    @Operation(summary = "Get all FAQs for admin", description = "Get all FAQs with pagination for admin management")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQs retrieved successfully")
    })
    public ResponseEntity<Page<FAQResponse>> getAllFAQs(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<FAQResponse> faqs = faqService.getAllFAQsPaginated(pageable);
        return ResponseEntity.ok(faqs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get FAQ by ID", description = "Get a specific FAQ by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQ retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "FAQ not found")
    })
    public ResponseEntity<FAQResponse> getFAQById(
            @Parameter(description = "FAQ ID") @PathVariable UUID id) {
        FAQResponse faq = faqService.getFAQById(id);
        return ResponseEntity.ok(faq);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all FAQ categories", description = "Get list of all available FAQ categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categories retrieved successfully")
    })
    public ResponseEntity<List<FAQCategory>> getAllCategories() {
        List<FAQCategory> categories = faqService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    @Operation(summary = "Create new FAQ", description = "Create a new FAQ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "FAQ created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<FAQResponse> createFAQ(@Valid @RequestBody CreateFAQRequest request) {
        FAQResponse faq = faqService.createFAQ(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(faq);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update FAQ", description = "Update an existing FAQ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQ updated successfully"),
            @ApiResponse(responseCode = "404", description = "FAQ not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<FAQResponse> updateFAQ(
            @Parameter(description = "FAQ ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateFAQRequest request) {
        FAQResponse faq = faqService.updateFAQ(id, request);
        return ResponseEntity.ok(faq);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete FAQ", description = "Delete an existing FAQ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "FAQ deleted successfully"),
            @ApiResponse(responseCode = "404", description = "FAQ not found")
    })
    public ResponseEntity<Void> deleteFAQ(
            @Parameter(description = "FAQ ID") @PathVariable UUID id) {
        faqService.deleteFAQ(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @Operation(summary = "Get FAQ statistics", description = "Get statistics about FAQs")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Statistics retrieved successfully")
    })
    public ResponseEntity<Object> getFAQStats() {
        // This could be expanded to include more detailed statistics
        List<FAQCategory> categories = faqService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}
