package com.freelance.platform.controller;

import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Management", description = "APIs for file upload and management")
@SecurityRequirement(name = "bearerAuth")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    @Operation(summary = "Upload file", description = "Upload a single file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "File uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file or upload failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Map<String, Object>> uploadFile(
            @Parameter(description = "File to upload") @RequestParam("file") MultipartFile file,
            @Parameter(description = "File category") @RequestParam(required = false) String category,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = fileService.uploadFile(file, category, currentUser.getId());
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/bulk-upload")
    @Operation(summary = "Bulk upload files", description = "Upload multiple files at once")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Files uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid files or upload failed"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Map<String, Object>> bulkUploadFiles(
            @Parameter(description = "Files to upload") @RequestParam("files") List<MultipartFile> files,
            @Parameter(description = "File category") @RequestParam(required = false) String category,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> response = fileService.bulkUploadFiles(files, category, currentUser.getId());
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get file", description = "Get file information by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File information retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "File not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getFile(
            @Parameter(description = "File ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> file = fileService.getFile(id, currentUser.getId());
        return ResponseEntity.ok(file);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete file", description = "Delete a file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "File deleted successfully"),
            @ApiResponse(responseCode = "404", description = "File not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Void> deleteFile(
            @Parameter(description = "File ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        fileService.deleteFile(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user files", description = "Get all files for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User files retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getUserFiles(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @Parameter(description = "File category") @RequestParam(required = false) String category,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId) && !currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> files = fileService.getUserFiles(userId, category, page, size);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/download/{id}")
    @Operation(summary = "Download file", description = "Download a file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File download started"),
            @ApiResponse(responseCode = "404", description = "File not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> downloadFile(
            @Parameter(description = "File ID") @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> downloadInfo = fileService.getDownloadUrl(id, currentUser.getId());
        return ResponseEntity.ok(downloadInfo);
    }

    @PutMapping("/{id}/metadata")
    @Operation(summary = "Update file metadata", description = "Update file metadata")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File metadata updated successfully"),
            @ApiResponse(responseCode = "404", description = "File not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> updateFileMetadata(
            @Parameter(description = "File ID") @PathVariable UUID id,
            @RequestBody Map<String, Object> metadata,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Map<String, Object> updatedFile = fileService.updateFileMetadata(id, metadata, currentUser.getId());
        return ResponseEntity.ok(updatedFile);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get file categories", description = "Get available file categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File categories retrieved successfully")
    })
    public ResponseEntity<List<Map<String, Object>>> getFileCategories() {
        
        List<Map<String, Object>> categories = fileService.getFileCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/storage-usage/{userId}")
    @Operation(summary = "Get storage usage", description = "Get storage usage for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Storage usage retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    public ResponseEntity<Map<String, Object>> getStorageUsage(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Verify user can access this data
        if (!currentUser.getId().equals(userId) && !currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).build();
        }
        
        Map<String, Object> usage = fileService.getStorageUsage(userId);
        return ResponseEntity.ok(usage);
    }
}
