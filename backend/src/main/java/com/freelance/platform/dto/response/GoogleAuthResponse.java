package com.freelance.platform.dto.response;

public class GoogleAuthResponse {

    private AuthResponse auth;

    private boolean requiresRoleSelection;

    public GoogleAuthResponse() {
    }

    public GoogleAuthResponse(AuthResponse auth, boolean requiresRoleSelection) {
        this.auth = auth;
        this.requiresRoleSelection = requiresRoleSelection;
    }

    public AuthResponse getAuth() {
        return auth;
    }

    public void setAuth(AuthResponse auth) {
        this.auth = auth;
    }

    public boolean isRequiresRoleSelection() {
        return requiresRoleSelection;
    }

    public void setRequiresRoleSelection(boolean requiresRoleSelection) {
        this.requiresRoleSelection = requiresRoleSelection;
    }
}

