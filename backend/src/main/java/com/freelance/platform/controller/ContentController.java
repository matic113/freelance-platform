package com.freelance.platform.controller;

import com.freelance.platform.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/content")
@Tag(name = "Content", description = "APIs for legal and content pages")
public class ContentController {

    @Autowired
    private ContentService contentService;

    @GetMapping("/privacy-policy")
    @Operation(summary = "Get privacy policy", description = "Get the privacy policy content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Privacy policy retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getPrivacyPolicy() {
        
        Map<String, Object> content = contentService.getPrivacyPolicy();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/terms-of-use")
    @Operation(summary = "Get terms of use", description = "Get the terms of use content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Terms of use retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getTermsOfUse() {
        
        Map<String, Object> content = contentService.getTermsOfUse();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/cookie-policy")
    @Operation(summary = "Get cookie policy", description = "Get the cookie policy content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cookie policy retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getCookiePolicy() {
        
        Map<String, Object> content = contentService.getCookiePolicy();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/about-us")
    @Operation(summary = "Get about us", description = "Get the about us content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "About us content retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getAboutUs() {
        
        Map<String, Object> content = contentService.getAboutUs();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/success-stories")
    @Operation(summary = "Get success stories", description = "Get success stories showcase")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Success stories retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getSuccessStories() {
        
        Map<String, Object> content = contentService.getSuccessStories();
        return ResponseEntity.ok(content);
    }

    @GetMapping("/client-experiences")
    @Operation(summary = "Get client experiences", description = "Get client experiences testimonials")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Client experiences retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getClientExperiences() {
        
        Map<String, Object> content = contentService.getClientExperiences();
        return ResponseEntity.ok(content);
    }

    @PostMapping("/contact-us")
    @Operation(summary = "Submit contact us form", description = "Submit contact us form")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Contact form submitted successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Map<String, Object>> submitContactUs(
            @RequestBody Map<String, Object> contactData) {
        
        Map<String, Object> response = contentService.submitContactUs(contactData);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/faqs")
    @Operation(summary = "Get all FAQs", description = "Get all active FAQs grouped by category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQs retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getFAQs() {
        Map<String, Object> response = contentService.getFAQs();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/faqs/category/{category}")
    @Operation(summary = "Get FAQs by category", description = "Get all active FAQs for a specific category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "FAQs retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getFAQsByCategory(
            @Parameter(description = "FAQ Category") @PathVariable String category) {
        Map<String, Object> response = contentService.getFAQsByCategory(category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/faqs/search")
    @Operation(summary = "Search FAQs", description = "Search FAQs by question or answer content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> searchFAQs(
            @Parameter(description = "Search term") @RequestParam String searchTerm) {
        Map<String, Object> response = contentService.searchFAQs(searchTerm);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/legal/{type}")
    @Operation(summary = "Get legal document", description = "Get specific legal document by type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Legal document retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<Map<String, Object>> getLegalDocument(
            @Parameter(description = "Document type") @PathVariable String type) {
        
        Map<String, Object> content = contentService.getLegalDocument(type);
        return ResponseEntity.ok(content);
    }

    @GetMapping("/banners")
    @Operation(summary = "Get banners", description = "Get active banners")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Banners retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getBanners() {
        
        Map<String, Object> banners = contentService.getBanners();
        return ResponseEntity.ok(banners);
    }

    @GetMapping("/announcements")
    @Operation(summary = "Get announcements", description = "Get active announcements")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Announcements retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getAnnouncements() {
        
        Map<String, Object> announcements = contentService.getAnnouncements();
        return ResponseEntity.ok(announcements);
    }
}
