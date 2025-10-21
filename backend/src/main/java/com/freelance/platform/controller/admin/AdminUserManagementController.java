package com.freelance.platform.controller.admin;

import com.freelance.platform.dto.request.AdminCreateUserRequest;
import com.freelance.platform.dto.response.AuthResponse;
import com.freelance.platform.entity.Role;
import com.freelance.platform.entity.User;
import com.freelance.platform.exception.ResourceNotFoundException;
import com.freelance.platform.security.UserPrincipal;
import com.freelance.platform.service.UserService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/user-management")
@Tag(name = "Admin User Management", description = "APIs for managing all users including admin role assignment")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserManagementController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/users")
    @Operation(summary = "Create user with any roles", description = "Create a new user with any roles (including admin roles). Only super admins can use this.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "403", description = "Only super admins can create admin users")
    })
    public ResponseEntity<?> createUserWithRoles(
            @Valid @RequestBody AdminCreateUserRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if user already exists
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already taken!");
        }
        
        // Create new user with any roles (no restrictions for super admin)
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Set roles from request (all roles allowed for super admin)
        Set<Role> roles = request.getRoles();
        if (roles != null && !roles.isEmpty()) {
            user.setRoles(new HashSet<>(roles));
        } else {
            // Default to CLIENT if no roles specified
            user.addRole(Role.CLIENT);
        }
        
        user.setPhone(request.getPhone());
        user.setCountry(request.getCountry());
        user.setCity(request.getCity());
        user.setTimezone(request.getTimezone());
        user.setLanguage(request.getLanguage());
        user.setIsActive(true);
        user.setIsVerified(true);
        
        User savedUser = userService.save(user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/users/{userId}/roles")
    @Operation(summary = "Update user roles", description = "Update roles for any user. Only super admins can use this.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User roles updated successfully"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "403", description = "Only super admins can modify roles")
    })
    public ResponseEntity<?> updateUserRoles(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @RequestBody Set<Role> roles,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findByIdOptional(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Update roles
        user.setRoles(new HashSet<>(roles));
        User updatedUser = userService.save(user);
        
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/users/{userId}/roles/add")
    @Operation(summary = "Add role to user", description = "Add a role to a user. Only super admins can use this.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role added successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<?> addRoleToUser(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @RequestBody Role role,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findByIdOptional(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.addRole(role);
        User updatedUser = userService.save(user);
        
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{userId}/roles/remove")
    @Operation(summary = "Remove role from user", description = "Remove a role from a user. Only super admins can use this.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Role removed successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<?> removeRoleFromUser(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @RequestBody Role role,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findByIdOptional(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.removeRole(role);
        User updatedUser = userService.save(user);
        
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Get paginated list of all users with their roles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    })
    public ResponseEntity<Page<User>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Page<User> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Get user by ID", description = "Get user details including roles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> getUserById(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        User user = userService.findByIdOptional(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/by-role/{role}")
    @Operation(summary = "Get users by role", description = "Get all users with a specific role")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    })
    public ResponseEntity<List<User>> getUsersByRole(
            @Parameter(description = "Role") @PathVariable Role role,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        List<User> users = userService.findByRole(role);
        return ResponseEntity.ok(users);
    }
}

