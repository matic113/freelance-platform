package com.freelance.platform.dto.request;

import com.freelance.platform.entity.Role;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public class GoogleRoleSelectionRequest {

    @NotNull
    private UUID userId;

    @NotNull
    @Pattern(regexp = "CLIENT|FREELANCER", message = "Role must be CLIENT or FREELANCER")
    private String role;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Role toRole() {
        return Role.valueOf(role);
    }
}

