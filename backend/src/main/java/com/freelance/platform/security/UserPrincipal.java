package com.freelance.platform.security;

import com.freelance.platform.entity.Role;
import com.freelance.platform.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {
    private UUID id;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private boolean isActive;
    private boolean isVerified;

    public UserPrincipal(UUID id, String email, String password, Collection<? extends GrantedAuthority> authorities, boolean isActive, boolean isVerified) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
        this.isVerified = isVerified;
    }

    public static UserPrincipal create(User user) {
        Set<Role> roles = user.getRoles();
        Collection<GrantedAuthority> authorities;
        
        if (roles == null || roles.isEmpty()) {
            authorities = Collections.emptyList();
        } else {
            authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());
        }

        return new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPasswordHash(),
            authorities,
            user.getIsActive() != null ? user.getIsActive() : false,
            user.getIsVerified() != null ? user.getIsVerified() : false
        );
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    public boolean isVerified() {
        return isVerified;
    }
}
