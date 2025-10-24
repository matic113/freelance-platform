package com.freelance.platform.service;

import com.freelance.platform.dto.request.CreateProjectRequest;
import com.freelance.platform.dto.request.UpdateProjectRequest;
import com.freelance.platform.dto.response.ProjectResponse;
import com.freelance.platform.entity.*;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.exception.UnauthorizedException;
import com.freelance.platform.repository.ProjectAttachmentRepository;
import com.freelance.platform.repository.ProjectRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectAttachmentRepository projectAttachmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private EntityManager entityManager;
    
    private static final Set<String> VALID_SORT_FIELDS = new HashSet<>(
        Arrays.asList("createdAt", "title", "budgetMin")
    );

    public ProjectResponse createProject(CreateProjectRequest request, UUID clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!client.isClient()) {
            throw new UnauthorizedException("Only clients can create projects");
        }

        Project project = new Project();
        project.setClient(client);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setCategory(request.getCategory());
        project.setSkillsRequired(request.getSkillsRequired());
        project.setBudgetMin(request.getBudgetMin());
        project.setBudgetMax(request.getBudgetMax());
        project.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        project.setProjectType(request.getProjectType());
        project.setDuration(request.getDuration());
        project.setStatus(ProjectStatus.DRAFT);
        project.setIsFeatured(false);
        project.setDeadline(request.getDeadline());
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        Project savedProject = projectRepository.save(project);
        
        // Handle attachments if provided
        if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            for (com.freelance.platform.dto.request.ProjectAttachmentRequest attachmentRequest : request.getAttachments()) {
                ProjectAttachment attachment = new ProjectAttachment();
                attachment.setProject(savedProject);
                attachment.setFileName(attachmentRequest.getFileName());
                attachment.setFileUrl(attachmentRequest.getFileUrl());
                attachment.setFileSize(attachmentRequest.getFileSize());
                attachment.setFileType(attachmentRequest.getFileType());
                attachment.setUploadedAt(LocalDateTime.now());
                
                projectAttachmentRepository.save(attachment);
            }
        }
        
        return mapToProjectResponse(savedProject);
    }

    public ProjectResponse updateProject(UUID projectId, UpdateProjectRequest request, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only update your own projects");
        }

        if (project.getStatus() != ProjectStatus.DRAFT) {
            throw new UnauthorizedException("Only draft projects can be updated");
        }

        // Update fields
        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getCategory() != null) project.setCategory(request.getCategory());
        if (request.getSkillsRequired() != null) project.setSkillsRequired(request.getSkillsRequired());
        if (request.getBudgetMin() != null) project.setBudgetMin(request.getBudgetMin());
        if (request.getBudgetMax() != null) project.setBudgetMax(request.getBudgetMax());
        if (request.getCurrency() != null) project.setCurrency(request.getCurrency());
        if (request.getProjectType() != null) project.setProjectType(request.getProjectType());
        if (request.getDuration() != null) project.setDuration(request.getDuration());
        if (request.getDeadline() != null) project.setDeadline(request.getDeadline());
        
        project.setUpdatedAt(LocalDateTime.now());

        Project updatedProject = projectRepository.save(project);
        return mapToProjectResponse(updatedProject);
    }

    public ProjectResponse publishProject(UUID projectId, UUID clientId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (!projectOpt.isPresent()) {
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }
        
        Project project = projectOpt.get();
        
        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only publish your own projects");
        }

        if (project.getStatus() != ProjectStatus.DRAFT) {
            throw new UnauthorizedException("Only draft projects can be published");
        }

        project.setStatus(ProjectStatus.PUBLISHED);
        project.setUpdatedAt(LocalDateTime.now());

        Project publishedProject = projectRepository.save(project);
        return mapToProjectResponse(publishedProject);
    }

    public ProjectResponse unpublishProject(UUID projectId, UUID clientId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (!projectOpt.isPresent()) {
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }
        
        Project project = projectOpt.get();
        
        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only unpublish your own projects");
        }

        if (project.getStatus() != ProjectStatus.PUBLISHED) {
            throw new UnauthorizedException("Only published projects can be unpublished");
        }

        project.setStatus(ProjectStatus.DRAFT);
        project.setUpdatedAt(LocalDateTime.now());

        Project unpublishedProject = projectRepository.save(project);
        return mapToProjectResponse(unpublishedProject);
    }

    public void deleteProject(UUID projectId, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only delete your own projects");
        }

        if (project.getStatus() == ProjectStatus.IN_PROGRESS) {
            throw new UnauthorizedException("Cannot delete projects in progress");
        }

        projectRepository.delete(project);
    }

    public ProjectResponse getProjectById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        return mapToProjectResponse(project);
    }

    public Page<ProjectResponse> getProjectsByClient(UUID clientId, Pageable pageable) {
        Page<Project> projects = projectRepository.findByClientIdOrderByCreatedAtDesc(clientId, pageable);
        return projects.map(this::mapToProjectResponse);
    }
    
    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(this::mapToProjectResponse)
                .collect(Collectors.toList());
    }

    public Page<ProjectResponse> getPublishedProjects(Pageable pageable) {
        Page<Project> projects = projectRepository.findByStatusOrderByCreatedAtDesc(
                ProjectStatus.PUBLISHED, pageable);
        return projects.map(this::mapToProjectResponse);
    }

    public Page<ProjectResponse> getFeaturedProjects(Pageable pageable) {
        Page<Project> projects = projectRepository.findByIsFeaturedTrueAndStatusOrderByCreatedAtDesc(
                ProjectStatus.PUBLISHED, pageable);
        return projects.map(this::mapToProjectResponse);
    }

    public Page<ProjectResponse> searchProjects(String query, String category, List<String> skills, 
                                              BigDecimal minBudget, BigDecimal maxBudget, 
                                              ProjectType projectType,
                                              String sortBy, String sortOrder,
                                              Pageable pageable) {
        String validatedSortBy = validateAndMapSortField(sortBy);
        Sort.Direction direction = "desc".equalsIgnoreCase(sortOrder) ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        Sort sort = Sort.by(direction, validatedSortBy);
        Pageable pageableWithSort = org.springframework.data.domain.PageRequest.of(
            pageable.getPageNumber(), 
            pageable.getPageSize(), 
            sort
        );
        
        Page<Project> projects = projectRepository.findPublishedProjectsWithFilters(
                query, category, skills, minBudget, maxBudget, projectType, pageableWithSort);
        return projects.map(this::mapToProjectResponse);
    }
    
    private String validateAndMapSortField(String sortField) {
        if (sortField == null || sortField.trim().isEmpty()) {
            return "createdAt";
        }
        
        if (!VALID_SORT_FIELDS.contains(sortField)) {
            throw new IllegalArgumentException(
                "Invalid sort field: " + sortField + ". Valid fields are: " + VALID_SORT_FIELDS
            );
        }
        
        return sortField;
    }

    public ProjectResponse addAttachment(UUID projectId, MultipartFile file, UUID clientId) {
        System.out.println("DEBUG: addAttachment called with projectId: " + projectId + ", clientId: " + clientId);
        
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (!projectOpt.isPresent()) {
            System.out.println("DEBUG: Project not found with ID: " + projectId);
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }
        
        Project project = projectOpt.get();
        System.out.println("DEBUG: Found project: " + project.getTitle() + ", client: " + project.getClient().getId());

        if (!project.getClient().getId().equals(clientId)) {
            System.out.println("DEBUG: Authorization failed - user is not project owner");
            throw new UnauthorizedException("You can only add attachments to your own projects");
        }

        // Upload file to storage
        System.out.println("DEBUG: Starting file upload...");
        System.out.println("DEBUG: File name: " + file.getOriginalFilename());
        System.out.println("DEBUG: File size: " + file.getSize());
        System.out.println("DEBUG: File type: " + file.getContentType());
        
        String fileUrl = fileService.uploadFile(file);
        System.out.println("DEBUG: File uploaded successfully, URL: " + fileUrl);

        ProjectAttachment attachment = new ProjectAttachment();
        attachment.setProject(project);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileUrl(fileUrl);
        attachment.setFileSize(file.getSize());
        attachment.setFileType(file.getContentType());
        attachment.setUploadedAt(LocalDateTime.now());

        projectAttachmentRepository.save(attachment);
        
        // Refresh project to get updated attachments
        project = projectRepository.findById(projectId).orElseThrow();
        return mapToProjectResponse(project);
    }

    public void removeAttachment(UUID projectId, UUID attachmentId, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only remove attachments from your own projects");
        }

        ProjectAttachment attachment = projectAttachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));

        if (!attachment.getProject().getId().equals(projectId)) {
            throw new UnauthorizedException("Attachment does not belong to this project");
        }

        // Delete file from storage
        fileService.deleteFile(attachment.getFileUrl());
        
        projectAttachmentRepository.delete(attachment);
    }

    public ProjectResponse updateProjectStatus(UUID projectId, ProjectStatus status, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only update your own projects");
        }

        project.setStatus(status);
        project.setUpdatedAt(LocalDateTime.now());

        Project updatedProject = projectRepository.save(project);
        return mapToProjectResponse(updatedProject);
    }

    private ProjectResponse mapToProjectResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setClientId(project.getClient().getId());
        response.setClientName(project.getClient().getFirstName() + " " + project.getClient().getLastName());
        response.setClientAvatarUrl(project.getClient().getAvatarUrl());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCategory(project.getCategory());
        response.setSkillsRequired(project.getSkillsRequired());
        response.setBudgetMin(project.getBudgetMin());
        response.setBudgetMax(project.getBudgetMax());
        response.setCurrency(project.getCurrency());
        response.setProjectType(project.getProjectType());
        response.setDuration(project.getDuration());
        response.setStatus(project.getStatus());
        response.setIsFeatured(project.getIsFeatured());
        response.setDeadline(project.getDeadline());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        
        // Map attachments
        if (project.getAttachments() != null) {
            response.setAttachments(project.getAttachments().stream()
                    .map(attachment -> {
                        ProjectResponse.AttachmentInfo attachmentInfo = new ProjectResponse.AttachmentInfo();
                        attachmentInfo.setId(attachment.getId());
                        attachmentInfo.setFileName(attachment.getFileName());

                        // If the stored fileUrl is an object name in MinIO, generate a presigned download URL
                        String storedUrl = attachment.getFileUrl();
                        try {
                            if (storedUrl != null && !storedUrl.startsWith("http")) {
                                String presigned = storageService.getPresignedDownloadUrl(storedUrl, 24);
                                attachmentInfo.setFileUrl(presigned);
                            } else {
                                attachmentInfo.setFileUrl(storedUrl);
                            }
                        } catch (Exception e) {
                            // On error, fallback to stored value
                            attachmentInfo.setFileUrl(storedUrl);
                        }

                        attachmentInfo.setFileSize(attachment.getFileSize());
                        attachmentInfo.setFileType(attachment.getFileType());
                        attachmentInfo.setUploadedAt(attachment.getUploadedAt());
                        return attachmentInfo;
                    })
                    .collect(Collectors.toList()));
        }
        
        return response;
    }

    public String uploadFileToProject(UUID projectId, MultipartFile file, String folder, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only upload files to your own projects");
        }

        String objectName = storageService.uploadFile(file, "projects/" + projectId + "/" + folder);
        return objectName;
    }

    public String getPresignedDownloadUrl(String objectName, int expirationHours) {
        return storageService.getPresignedDownloadUrl(objectName, expirationHours);
    }

    public com.freelance.platform.dto.response.PresignedUploadResponse getPresignedUploadUrl(UUID projectId, String filename, String folder, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only upload files to your own projects");
        }

        // Generate object name with project ID and folder
        String sanitizedFilename = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String objectName = "projects/" + projectId + "/" + folder + "/" + System.currentTimeMillis() + "_" + sanitizedFilename;

        // Generate presigned upload URL (24 hours expiration)
        String uploadUrl = storageService.getPresignedUploadUrl(objectName, 24);

        return new com.freelance.platform.dto.response.PresignedUploadResponse(
                uploadUrl,
                objectName,
                filename,
                24 * 60 * 60 * 1000  // 24 hours in milliseconds
        );
    }

    public java.util.List<com.freelance.platform.dto.response.PresignedUploadResponse> getPresignedUploadUrlsBatch(UUID projectId, java.util.List<String> filenames, String folder, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only upload files to your own projects");
        }

        java.util.List<com.freelance.platform.dto.response.PresignedUploadResponse> responses = new java.util.ArrayList<>();
        
        for (String filename : filenames) {
            // Generate object name with project ID and folder
            String sanitizedFilename = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
            String objectName = "projects/" + projectId + "/" + folder + "/" + System.currentTimeMillis() + "_" + sanitizedFilename;

            // Generate presigned upload URL (24 hours expiration)
            String uploadUrl = storageService.getPresignedUploadUrl(objectName, 24);

            responses.add(new com.freelance.platform.dto.response.PresignedUploadResponse(
                    uploadUrl,
                    objectName,
                    filename,
                    24 * 60 * 60 * 1000  // 24 hours in milliseconds
            ));
        }
        
        return responses;
    }

    public ProjectResponse completeFileUpload(UUID projectId, com.freelance.platform.dto.request.CompleteUploadRequest request, UUID clientId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getClient().getId().equals(clientId)) {
            throw new UnauthorizedException("You can only upload files to your own projects");
        }

        // Create and save the attachment with the object name (not a presigned URL)
        // mapToProjectResponse will generate fresh presigned download URLs when returning the project
        ProjectAttachment attachment = new ProjectAttachment();
        attachment.setProject(project);
        attachment.setFileName(request.getFilename());
        attachment.setFileSize(request.getFileSize());
        attachment.setFileType(request.getContentType());
        attachment.setFileUrl(request.getObjectName());  // Store object name, not presigned URL
        attachment.setUploadedAt(LocalDateTime.now());
        
        projectAttachmentRepository.save(attachment);

        // Return updated project response with all attachments
        return mapToProjectResponse(project);
    }
}
