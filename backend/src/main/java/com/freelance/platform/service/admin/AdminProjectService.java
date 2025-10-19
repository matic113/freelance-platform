package com.freelance.platform.service.admin;

import com.freelance.platform.dto.response.ProjectResponse;
import com.freelance.platform.entity.Project;
import com.freelance.platform.entity.ProjectStatus;
import com.freelance.platform.repository.ProjectRepository;
import com.freelance.platform.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AdminProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ReportRepository reportRepository;

    public Page<ProjectResponse> getAllProjects(Pageable pageable) {
        Page<Project> projects = projectRepository.findAll(pageable);
        return projects.map(this::convertToResponse);
    }

    public ProjectResponse getProjectById(UUID id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return convertToResponse(project);
    }

    public ProjectResponse updateProjectStatus(UUID id, String status, UUID currentAdminId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setStatus(ProjectStatus.valueOf(status));
        Project savedProject = projectRepository.save(project);

        // Log admin action
        logAdminAction(currentAdminId, "UPDATE_PROJECT_STATUS", "Project", savedProject.getId().toString(),
                "Updated project status to: " + status);

        return convertToResponse(savedProject);
    }

    public ProjectResponse updateProjectFeatured(UUID id, boolean isFeatured, UUID currentAdminId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setIsFeatured(isFeatured);
        Project savedProject = projectRepository.save(project);

        // Log admin action
        logAdminAction(currentAdminId, "UPDATE_PROJECT_FEATURED", "Project", savedProject.getId().toString(),
                "Updated project featured status to: " + isFeatured);

        return convertToResponse(savedProject);
    }

    public void deleteProject(UUID id, UUID currentAdminId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Log admin action
        logAdminAction(currentAdminId, "DELETE_PROJECT", "Project", project.getId().toString(),
                "Deleted project: " + project.getTitle());

        projectRepository.delete(project);
    }

    public Map<String, Object> getProjectStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        long totalProjects = projectRepository.count();
        long publishedProjects = projectRepository.countByStatus(ProjectStatus.PUBLISHED);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long cancelledProjects = projectRepository.countByStatus(ProjectStatus.CANCELLED);
        long featuredProjects = projectRepository.countByIsFeaturedTrue();
        
        statistics.put("totalProjects", totalProjects);
        statistics.put("publishedProjects", publishedProjects);
        statistics.put("completedProjects", completedProjects);
        statistics.put("cancelledProjects", cancelledProjects);
        statistics.put("featuredProjects", featuredProjects);
        
        return statistics;
    }

    public Page<ProjectResponse> getReportedProjects(Pageable pageable) {
        // This would need a custom query to get projects that have been reported
        // For now, return empty page
        return Page.empty();
    }

    public ProjectResponse moderateProject(UUID id, String action, String reason, UUID currentAdminId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Apply moderation action
        switch (action.toUpperCase()) {
            case "APPROVE":
                project.setStatus(ProjectStatus.PUBLISHED);
                break;
            case "REJECT":
                project.setStatus(ProjectStatus.CANCELLED);
                break;
            case "HIDE":
                project.setStatus(ProjectStatus.DRAFT);
                break;
            default:
                throw new RuntimeException("Invalid moderation action");
        }

        Project savedProject = projectRepository.save(project);

        // Log admin action
        logAdminAction(currentAdminId, "MODERATE_PROJECT", "Project", savedProject.getId().toString(),
                "Moderated project with action: " + action + (reason != null ? " - Reason: " + reason : ""));

        return convertToResponse(savedProject);
    }

    public Map<String, Object> getProjectCategories() {
        // This would need a custom query to get project categories
        // For now, return mock data
        Map<String, Object> categories = new HashMap<>();
        categories.put("categories", new String[]{"Web Development", "Mobile Development", "Design", "Writing", "Marketing"});
        return categories;
    }

    public Map<String, Object> createProjectCategory(Map<String, String> categoryData, UUID currentAdminId) {
        // This would create a new project category
        // For now, return mock response
        Map<String, Object> response = new HashMap<>();
        response.put("id", UUID.randomUUID());
        response.put("name", categoryData.get("name"));
        response.put("description", categoryData.get("description"));
        response.put("created", true);
        
        // Log admin action
        logAdminAction(currentAdminId, "CREATE_PROJECT_CATEGORY", "ProjectCategory", response.get("id").toString(),
                "Created project category: " + categoryData.get("name"));
        
        return response;
    }

    public Map<String, Object> updateProjectCategory(UUID id, Map<String, String> categoryData, UUID currentAdminId) {
        // This would update a project category
        // For now, return mock response
        Map<String, Object> response = new HashMap<>();
        response.put("id", id);
        response.put("name", categoryData.get("name"));
        response.put("description", categoryData.get("description"));
        response.put("updated", true);
        
        // Log admin action
        logAdminAction(currentAdminId, "UPDATE_PROJECT_CATEGORY", "ProjectCategory", id.toString(),
                "Updated project category: " + categoryData.get("name"));
        
        return response;
    }

    public void deleteProjectCategory(UUID id, UUID currentAdminId) {
        // This would delete a project category
        // Log admin action
        logAdminAction(currentAdminId, "DELETE_PROJECT_CATEGORY", "ProjectCategory", id.toString(),
                "Deleted project category");
    }

    public Page<ProjectResponse> searchProjects(String query, Pageable pageable) {
    // ProjectRepository defines the method as (String query, Pageable pageable)
    Page<Project> projects = projectRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        query, pageable);
        return projects.map(this::convertToResponse);
    }

    public Map<String, Object> getProjectAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get project statistics
        Map<String, Object> statistics = getProjectStatistics();
        analytics.putAll(statistics);
        
        // Add additional analytics
        analytics.put("averageBudget", 5000.0);
        analytics.put("averageDuration", "30 days");
        analytics.put("topCategories", new String[]{"Web Development", "Mobile Development", "Design"});
        
        return analytics;
    }

    private ProjectResponse convertToResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setTitle(project.getTitle());
        response.setDescription(project.getDescription());
        response.setCategory(project.getCategory());
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
        
        // Set client info
        if (project.getClient() != null) {
            response.setClientId(project.getClient().getId());
            response.setClientName(project.getClient().getFirstName() + " " + project.getClient().getLastName());
        }
        
        return response;
    }

    private void logAdminAction(UUID adminUserId, String actionType, String entityType, String entityId, String description) {
        // This would be implemented in AdminActionService
        // For now, we'll just log it
        System.out.println("Admin Action: " + actionType + " on " + entityType + " (" + entityId + ") - " + description);
    }
}
