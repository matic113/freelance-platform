package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.response.ProjectResponse;
import com.freelance.platform.entity.Project;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.admin.AdminProjectService;
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
@RequestMapping("/api/admin/projects")
@Tag(name = "Admin Project Management", description = "APIs for managing projects from admin panel")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProjectController {

    @Autowired
    private AdminProjectService adminProjectService;

    @GetMapping
    @Operation(summary = "Get all projects", description = "Get paginated list of all projects")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> getAllProjects(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ProjectResponse> response = adminProjectService.getAllProjects(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Get project details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> getProjectById(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = adminProjectService.getProjectById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update project status", description = "Update project status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> updateProjectStatus(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @RequestParam String status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = adminProjectService.updateProjectStatus(id, status, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/featured")
    @Operation(summary = "Update project featured status", description = "Mark/unmark project as featured")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project featured status updated successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> updateProjectFeatured(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @RequestParam boolean isFeatured,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = adminProjectService.updateProjectFeatured(id, isFeatured, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Delete project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Project deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Void> deleteProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        adminProjectService.deleteProject(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get project statistics", description = "Get project statistics for admin dashboard")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project statistics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getProjectStatistics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> statistics = adminProjectService.getProjectStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/reported")
    @Operation(summary = "Get reported projects", description = "Get projects that have been reported")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reported projects retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> getReportedProjects(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ProjectResponse> response = adminProjectService.getReportedProjects(pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/moderate")
    @Operation(summary = "Moderate project", description = "Moderate project content")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project moderated successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> moderateProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @RequestParam String action,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = adminProjectService.moderateProject(id, action, reason, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get project categories", description = "Get all project categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project categories retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getProjectCategories(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> categories = adminProjectService.getProjectCategories();
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/categories")
    @Operation(summary = "Create project category", description = "Create a new project category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project category created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    public ResponseEntity<Map<String, Object>> createProjectCategory(
            @RequestBody Map<String, String> categoryData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminProjectService.createProjectCategory(categoryData, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update project category", description = "Update project category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project category updated successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<Map<String, Object>> updateProjectCategory(
            @Parameter(description = "Category ID") @PathVariable UUID id,
            @RequestBody Map<String, String> categoryData,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = adminProjectService.updateProjectCategory(id, categoryData, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete project category", description = "Delete project category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Project category deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<Void> deleteProjectCategory(
            @Parameter(description = "Category ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        adminProjectService.deleteProjectCategory(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @Operation(summary = "Search projects", description = "Search projects by title, description, or client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> searchProjects(
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ProjectResponse> response = adminProjectService.searchProjects(query, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get project analytics", description = "Get detailed project analytics")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project analytics retrieved successfully")
    })
    public ResponseEntity<Map<String, Object>> getProjectAnalytics(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> analytics = adminProjectService.getProjectAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
