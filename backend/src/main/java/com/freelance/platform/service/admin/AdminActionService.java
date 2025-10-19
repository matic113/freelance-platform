package com.freelance.platform.service.admin;

import com.freelance.platform.entity.AdminAction;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.AdminActionRepository;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AdminActionService {

    @Autowired
    private AdminActionRepository adminActionRepository;

    @Autowired
    private UserRepository userRepository;

    public void logAction(UUID userId, String actionType, String entityType, String entityId, String description) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminAction action = new AdminAction();
        action.setUser(user);
        action.setActionType(actionType);
        action.setEntityType(entityType);
        action.setEntityId(entityId);
        action.setDescription(description);
        action.setCreatedAt(LocalDateTime.now());

        adminActionRepository.save(action);
    }

    public void logAction(UUID userId, String actionType, String entityType, String entityId, 
                         String description, String metadata) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminAction action = new AdminAction();
        action.setUser(user);
        action.setActionType(actionType);
        action.setEntityType(entityType);
        action.setEntityId(entityId);
        action.setDescription(description);
        action.setMetadata(metadata);
        action.setCreatedAt(LocalDateTime.now());

        adminActionRepository.save(action);
    }

    public Page<AdminAction> getAdminActions(Pageable pageable) {
        return adminActionRepository.findAllOrderByCreatedAtDesc(pageable);
    }

    public Page<AdminAction> getAdminActionsByAdmin(UUID userId, Pageable pageable) {
        return adminActionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Page<AdminAction> getAdminActionsByType(String actionType, Pageable pageable) {
        return adminActionRepository.findByActionTypeOrderByCreatedAtDesc(actionType, pageable);
    }

    public Page<AdminAction> getAdminActionsByEntity(String entityType, String entityId, Pageable pageable) {
        return adminActionRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId, pageable);
    }

    public List<AdminAction> getRecentAdminActions(int limit) {
        return adminActionRepository.findTop10ByOrderByCreatedAtDesc();
    }

    public long getActionCountByAdmin(UUID userId) {
        return adminActionRepository.countByUserId(userId);
    }

    public long getActionCountByType(String actionType) {
        return adminActionRepository.countByActionType(actionType);
    }

    public List<String> getAllActionTypes() {
        return adminActionRepository.findAllActionTypes();
    }

    public List<String> getAllEntityTypes() {
        return adminActionRepository.findAllEntityTypes();
    }
}
