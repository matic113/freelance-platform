package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.request.CreateAnnouncementRequest;
import com.freelance.platform.dto.response.AdminAnnouncementDTO;
import com.freelance.platform.entity.Announcement;
import com.freelance.platform.entity.User;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.AnnouncementService;
import com.freelance.platform.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
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

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/announcements")
@Tag(name = "Admin Announcements", description = "APIs for managing platform-wide announcements")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnnouncementController {
    
    @Autowired
    private AnnouncementService announcementService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    @Operation(summary = "Create announcement", description = "Create a new announcement (not sent yet)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Announcement created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "403", description = "Admin access required")
    })
    public ResponseEntity<AdminAnnouncementDTO> createAnnouncement(
            @Valid @RequestBody CreateAnnouncementRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User admin = userService.findById(currentUser.getId());
        
        Announcement announcement = announcementService.createAnnouncement(
            request.getTitle(),
            request.getMessage(),
            request.getPriority(),
            request.getSendEmail(),
            request.getTargetAudience(),
            admin
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(AdminAnnouncementDTO.fromEntity(announcement));
    }
    
    @PostMapping("/{announcementId}/send")
    @Operation(summary = "Send announcement", description = "Send announcement to target audience")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Announcement sent successfully"),
        @ApiResponse(responseCode = "404", description = "Announcement not found"),
        @ApiResponse(responseCode = "400", description = "Announcement already sent")
    })
    public ResponseEntity<AdminAnnouncementDTO> sendAnnouncement(
            @PathVariable UUID announcementId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User admin = userService.findById(currentUser.getId());
        Announcement announcement = announcementService.sendAnnouncement(announcementId, admin);
        
        return ResponseEntity.ok(AdminAnnouncementDTO.fromEntity(announcement));
    }
    
    @GetMapping
    @Operation(summary = "Get all announcements", description = "Get paginated list of all announcements")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Announcements retrieved successfully")
    })
    public ResponseEntity<Page<AdminAnnouncementDTO>> getAllAnnouncements(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<AdminAnnouncementDTO> announcements = announcementService.getAllAnnouncements(pageable)
            .map(AdminAnnouncementDTO::fromEntity);
        return ResponseEntity.ok(announcements);
    }
    
    @GetMapping("/{announcementId}")
    @Operation(summary = "Get announcement by ID", description = "Get announcement details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Announcement retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Announcement not found")
    })
    public ResponseEntity<AdminAnnouncementDTO> getAnnouncementById(
            @PathVariable UUID announcementId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Announcement announcement = announcementService.getAnnouncementById(announcementId);
        return ResponseEntity.ok(AdminAnnouncementDTO.fromEntity(announcement));
    }
    
    @GetMapping("/recent")
    @Operation(summary = "Get recent announcements", description = "Get announcements from last N days")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Recent announcements retrieved successfully")
    })
    public ResponseEntity<List<AdminAnnouncementDTO>> getRecentAnnouncements(
            @RequestParam(defaultValue = "30") int days,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        List<AdminAnnouncementDTO> announcements = announcementService.getRecentAnnouncements(days)
            .stream()
            .map(AdminAnnouncementDTO::fromEntity)
            .toList();
        return ResponseEntity.ok(announcements);
    }
    
    @DeleteMapping("/{announcementId}")
    @Operation(summary = "Delete announcement", description = "Delete an announcement")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Announcement deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Announcement not found")
    })
    public ResponseEntity<Void> deleteAnnouncement(
            @PathVariable UUID announcementId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User admin = userService.findById(currentUser.getId());
        announcementService.deleteAnnouncement(announcementId, admin);
        
        return ResponseEntity.noContent().build();
    }
}
