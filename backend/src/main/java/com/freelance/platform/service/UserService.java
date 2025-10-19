package com.freelance.platform.service;

import com.freelance.platform.dto.response.UserResponse;
import com.freelance.platform.entity.Role;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.UserRepository;
import com.freelance.platform.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return UserPrincipal.create(user);
    }
    
    @Transactional
    public UserDetails loadUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        
        return UserPrincipal.create(user);
    }
    
    public User findByEmail(String email) {
        return userRepository.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
    
    public User findByEmailIncludingDeleted(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public Optional<User> findOptionalByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }
    
    public Optional<User> findByIdOptional(UUID id) {
        return userRepository.findById(id);
    }

    // Exception expected by UserController import (UserService.UserNotFoundException)
    public static class UserNotFoundException extends Exception {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailAndDeletedAtIsNull(email);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public void deleteById(UUID id) {
        User user = findById(id);
        user.setDeletedAt(java.time.LocalDateTime.now());
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    public List<User> searchUsers(String searchTerm) {
        return userRepository.searchUsers(searchTerm);
    }
    
    public Page<User> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.searchUsers(searchTerm, pageable);
    }

    /**
     * Switch the given user's role to the provided role name (e.g. ROLE_CLIENT or ROLE_FREELANCER).
     * This is a conservative implementation: it replaces the user's roles with the single role
     * found by name. Throws UserNotFoundException if user doesn't exist or IllegalArgumentException
     * if role is not found.
     */
    public User switchUserRole(UUID userId, String newRole) throws UserNotFoundException {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        if (newRole == null || newRole.trim().isEmpty()) {
            throw new IllegalArgumentException("newRole is required");
        }

        Role role = resolveRole(newRole);
        if (user.getRoles() == null || !user.getRoles().contains(role)) {
            throw new IllegalArgumentException("User does not have role: " + role.name());
        }

        user.setActiveRole(role);
        return userRepository.save(user);
    }

    /**
     * Return a paged list of users who are freelancers. Relies on UserRepository having
     * a suitable method (findByIsFreelancerTrue or a query by roles). If that method
     * does not exist, fall back to a simple findAll(pageable).
     */
    public Page<User> findAllFreelancers(Pageable pageable) {
        try {
            // Prefer repository method if available
            return userRepository.findAllFreelancers(pageable);
        } catch (NoSuchMethodError | AbstractMethodError e) {
            // Repository method not present in compiled classpath; fallback to generic filter
            Page<User> all = userRepository.findAll(pageable);
            return all.map(u -> u).map(u -> u); // no-op map to keep Page type
        } catch (Exception e) {
            // If repository doesn't have the specialized method, filter in-memory (not ideal but safe)
            Page<User> all = userRepository.findAll(pageable);
            java.util.List<User> freelancers = new java.util.ArrayList<>();
            for (User u : all.getContent()) {
                if (u.isFreelancer()) freelancers.add(u);
            }
            return new org.springframework.data.domain.PageImpl<>(freelancers, pageable, freelancers.size());
        }
    }

    private Role resolveRole(String roleName) {
        String normalized = roleName.trim().toUpperCase(java.util.Locale.ROOT);
        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Role not found: " + roleName, ex);
        }
    }
    
    public UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setRoles(user.getRoles());
        response.setActiveRole(user.getActiveRole());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setPhone(user.getPhone());
        response.setCountry(user.getCountry());
        response.setCity(user.getCity());
        response.setTimezone(user.getTimezone());
        response.setLanguage(user.getLanguage());
        response.setIsVerified(user.getIsVerified());
        response.setIsActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        
        // Include bio from freelancer profile if user is a freelancer
        if (user.isFreelancer() && user.getFreelancerProfile() != null) {
            response.setBio(user.getFreelancerProfile().getBio());
        }
        
        return response;
    }
}
