package com.freelance.platform.controller;

import com.freelance.platform.dto.request.CreateProjectRequest;
import com.freelance.platform.dto.request.UpdateProjectRequest;
import com.freelance.platform.dto.response.ProjectResponse;
import com.freelance.platform.entity.ProjectStatus;
import com.freelance.platform.entity.ProjectType;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.ProjectService;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "APIs for managing projects")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project", description = "Create a new project as a client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Project created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Only clients can create projects")
    })
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = projectService.createProject(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieve a specific project by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> getProject(
            @Parameter(description = "Project ID") @PathVariable UUID id) {
        
        ProjectResponse response = projectService.getProjectById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update project", description = "Update an existing project (only draft projects)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to update this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> updateProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = projectService.updateProject(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete project", description = "Delete a project (only draft projects)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Project deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to delete this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<Void> deleteProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        projectService.deleteProject(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    @Operation(summary = "Publish project", description = "Publish a draft project to make it visible to freelancers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project published successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to publish this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> publishProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = projectService.publishProject(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/unpublish")
    @Operation(summary = "Unpublish project", description = "Unpublish a published project to revert it to draft status")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project unpublished successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to unpublish this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> unpublishProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = projectService.unpublishProject(id, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-projects")
    @Operation(summary = "Get my projects", description = "Get all projects created by the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> getMyProjects(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<ProjectResponse> response = projectService.getProjectsByClient(currentUser.getId(), pageable);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all")
    @Operation(summary = "Get all projects", description = "Get all projects (for debugging)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully")
    })
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> response = projectService.getAllProjects();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get published projects", description = "Get all published projects with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Projects retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> getPublishedProjects(
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ProjectResponse> response = projectService.getPublishedProjects(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured projects", description = "Get all featured published projects")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Featured projects retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> getFeaturedProjects(
            @PageableDefault(size = 10) Pageable pageable) {
        
        Page<ProjectResponse> response = projectService.getFeaturedProjects(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search projects", description = "Search published projects with filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    })
    public ResponseEntity<Page<ProjectResponse>> searchProjects(
            @Parameter(description = "Search query") @RequestParam(required = false) String query,
            @Parameter(description = "Category filter") @RequestParam(required = false) String category,
            @Parameter(description = "Skills filter") @RequestParam(required = false) List<String> skills,
            @Parameter(description = "Minimum budget") @RequestParam(required = false) BigDecimal minBudget,
            @Parameter(description = "Maximum budget") @RequestParam(required = false) BigDecimal maxBudget,
            @Parameter(description = "Project type filter") @RequestParam(required = false) ProjectType projectType,
            @Parameter(description = "Sort field (createdAt, title, budgetMin)") @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort order (asc or desc)") @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<ProjectResponse> response = projectService.searchProjects(
                query, category, skills, minBudget, maxBudget, projectType, sortBy, sortOrder, pageable);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/upload")
    @Operation(summary = "Upload file to project", description = "Upload a file to Minio for a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to upload files to this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<com.freelance.platform.dto.response.FileUploadResponse> uploadFileToProject(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @Parameter(description = "File to upload") @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "files") String folder,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse projectResponse = projectService.getProjectById(id);
        
        // Verify user is the project owner
        if (!projectResponse.getClientId().equals(currentUser.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Not authorized to upload files to this project");
        }

        String objectName = projectService.uploadFileToProject(id, file, folder, currentUser.getId());
        String downloadUrl = projectService.getPresignedDownloadUrl(objectName, 24);

        com.freelance.platform.dto.response.FileUploadResponse response = 
                new com.freelance.platform.dto.response.FileUploadResponse(
                objectName,
                file.getOriginalFilename(),
                downloadUrl,
                file.getSize(),
                file.getContentType(),
                folder
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/attachments")
    @Operation(summary = "Add attachment to project", description = "Upload and attach a file to a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attachment added successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to add attachments to this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> addAttachment(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @Parameter(description = "File to upload") @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        System.out.println("DEBUG: addAttachment called with projectId: " + id + 
                          ", currentUser: " + (currentUser != null ? currentUser.getEmail() : "null"));
        if (currentUser != null) {
            System.out.println("DEBUG: User authorities: " + currentUser.getAuthorities());
            System.out.println("DEBUG: User is enabled: " + currentUser.isEnabled());
        }
        
        ProjectResponse response = projectService.addAttachment(id, file, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/attachments/{attachmentId}")
    @Operation(summary = "Remove attachment from project", description = "Remove an attachment from a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Attachment removed successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to remove attachments from this project"),
            @ApiResponse(responseCode = "404", description = "Project or attachment not found")
    })
    public ResponseEntity<Void> removeAttachment(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @Parameter(description = "Attachment ID") @PathVariable UUID attachmentId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        projectService.removeAttachment(id, attachmentId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/presigned-upload")
    @Operation(summary = "Get presigned upload URL", description = "Get a presigned URL to upload files directly to Minio")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Presigned URL generated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to upload files to this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<com.freelance.platform.dto.response.PresignedUploadResponse> getPresignedUploadUrl(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @RequestParam String filename,
            @RequestParam(value = "folder", defaultValue = "files") String folder,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse projectResponse = projectService.getProjectById(id);
        
        // Verify user is the project owner
        if (!projectResponse.getClientId().equals(currentUser.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Not authorized to upload files to this project");
        }

        com.freelance.platform.dto.response.PresignedUploadResponse response = 
                projectService.getPresignedUploadUrl(id, filename, folder, currentUser.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/complete-upload")
    @Operation(summary = "Complete file upload", description = "Register uploaded file as project attachment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Attachment registered successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> completeFileUpload(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @RequestBody com.freelance.platform.dto.request.CompleteUploadRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = projectService.completeFileUpload(id, request, currentUser.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update project status", description = "Update the status of a project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Project status updated successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Not authorized to update this project"),
            @ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ProjectResponse> updateProjectStatus(
            @Parameter(description = "Project ID") @PathVariable UUID id,
            @Parameter(description = "New status") @RequestParam ProjectStatus status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        ProjectResponse response = projectService.updateProjectStatus(id, status, currentUser.getId());
        return ResponseEntity.ok(response);
    }
}
