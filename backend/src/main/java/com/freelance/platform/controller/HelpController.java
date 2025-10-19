package com.freelance.platform.controller;

import com.freelance.platform.service.HelpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/help")
@Tag(name = "Help & Support", description = "APIs for help and support system")
public class HelpController {

    @Autowired
    private HelpService helpService;

    @GetMapping("/faq")
    @Operation(summary = "Get FAQ list", description = "Get frequently asked questions")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQ list retrieved successfully")
    })
    public ResponseEntity<Page<Map<String, Object>>> getFAQ(
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<Map<String, Object>> faq = helpService.getFAQ(pageable);
        return ResponseEntity.ok(faq);
    }

    @GetMapping("/faq/search")
    @Operation(summary = "Search FAQ", description = "Search FAQ by keywords")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQ search results retrieved successfully")
    })
    public ResponseEntity<Page<Map<String, Object>>> searchFAQ(
            @Parameter(description = "Search query") @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<Map<String, Object>> results = helpService.searchFAQ(query, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get help categories", description = "Get list of help categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Help categories retrieved successfully")
    })
    public ResponseEntity<List<Map<String, Object>>> getHelpCategories() {
        
        List<Map<String, Object>> categories = helpService.getHelpCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/contact")
    @Operation(summary = "Submit contact form", description = "Submit a contact form for support")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Contact form submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Map<String, Object>> submitContactForm(
            @RequestBody Map<String, Object> contactData) {
        
        Map<String, Object> response = helpService.submitContactForm(contactData);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/guides")
    @Operation(summary = "Get help guides", description = "Get help guides and tutorials")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Help guides retrieved successfully")
    })
    public ResponseEntity<Page<Map<String, Object>>> getHelpGuides(
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<Map<String, Object>> guides = helpService.getHelpGuides(pageable);
        return ResponseEntity.ok(guides);
    }

    @GetMapping("/guides/{id}")
    @Operation(summary = "Get help guide by ID", description = "Get a specific help guide")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Help guide retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Guide not found")
    })
    public ResponseEntity<Map<String, Object>> getHelpGuide(
            @Parameter(description = "Guide ID") @PathVariable UUID id) {
        
        Map<String, Object> guide = helpService.getHelpGuide(id);
        return ResponseEntity.ok(guide);
    }

    @GetMapping("/guides/category/{categoryId}")
    @Operation(summary = "Get guides by category", description = "Get help guides by category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Guides retrieved successfully")
    })
    public ResponseEntity<Page<Map<String, Object>>> getGuidesByCategory(
            @Parameter(description = "Category ID") @PathVariable UUID categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<Map<String, Object>> guides = helpService.getGuidesByCategory(categoryId, pageable);
        return ResponseEntity.ok(guides);
    }

    @GetMapping("/search")
    @Operation(summary = "Search help content", description = "Search across all help content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> searchHelpContent(
            @Parameter(description = "Search query") @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Map<String, Object> results = helpService.searchHelpContent(query, pageable);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular help topics", description = "Get most popular help topics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Popular topics retrieved successfully")
    })
    public ResponseEntity<List<Map<String, Object>>> getPopularTopics() {
        
        List<Map<String, Object>> topics = helpService.getPopularTopics();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent help topics", description = "Get recently added help topics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recent topics retrieved successfully")
    })
    public ResponseEntity<List<Map<String, Object>>> getRecentTopics() {
        
        List<Map<String, Object>> topics = helpService.getRecentTopics();
        return ResponseEntity.ok(topics);
    }
}
