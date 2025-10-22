package com.freelance.platform.service;

import com.freelance.platform.dto.request.LoginRequest;
import com.freelance.platform.dto.request.RegisterRequest;
import com.freelance.platform.dto.response.AuthResponse;
import com.freelance.platform.dto.response.GoogleAuthResponse;
import com.freelance.platform.dto.response.GoogleUserProfile;
import com.freelance.platform.entity.Role;
import com.freelance.platform.entity.User;
import com.freelance.platform.security.JwtTokenProvider;
import com.freelance.platform.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private OtpService otpService;
    
    @Value("${app.jwt.expiration}")
    private Long jwtExpirationInMs;

    @Autowired
    private GoogleOAuthService googleOAuthService;

    public JwtTokenProvider getTokenProvider() {
        return tokenProvider;
    }

    public Long getJwtExpirationInMs() {
        return jwtExpirationInMs;
    }

    public GoogleAuthResponse authenticateWithGoogle(String idToken) {
        GoogleUserProfile profile = googleOAuthService.verifyIdToken(idToken);

        Optional<User> existingUser = userService.findOptionalByEmail(profile.getEmail());
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            if (user.getDeletedAt() != null) {
                throw new RuntimeException("Your account has been deleted. Please contact support.");
            }
        } else {
            user = new User();
            user.setEmail(profile.getEmail());
            user.setFirstName(profile.getFirstName());
            user.setLastName(profile.getLastName());
            user.setIsActive(true);
            user.setIsVerified(true);
            user.setRoles(EnumSet.noneOf(Role.class));
            // Set a placeholder password for OAuth users (they don't have a traditional password)
            user.setPasswordHash("oauth_" + profile.getEmail());
        }

        boolean isNewGoogleUser = false;
        if (user.getRoles() == null || (!user.getRoles().contains(Role.CLIENT) && !user.getRoles().contains(Role.FREELANCER))) {
            // Give both CLIENT and FREELANCER roles by default
            user.setRoles(EnumSet.of(Role.CLIENT, Role.FREELANCER));
            notifyRoleSelectionRequired(user);
            isNewGoogleUser = true;
        }

        if (user.getFirstName() == null || user.getFirstName().isBlank()) {
            user.setFirstName(profile.getFirstName());
        }
        if (user.getLastName() == null || user.getLastName().isBlank()) {
            user.setLastName(profile.getLastName());
        }
        if (user.getAvatarUrl() == null) {
            user.setAvatarUrl(profile.getPicture());
        }
        user.setIsVerified(true);
        user.setIsActive(true);
        user.setLastLoginAt(LocalDateTime.now());
        userService.save(user);

        if (user.getActiveRole() == null) {
            return buildRoleSelectionResponse(user, isNewGoogleUser);
        }

        AuthResponse authResponse = buildAuthResponse(user);
        return new GoogleAuthResponse(authResponse, false);
    }

    public GoogleAuthResponse completeGoogleRoleSelection(User user, Role role) {
        if (role != Role.CLIENT && role != Role.FREELANCER) {
            throw new IllegalArgumentException("Role must be CLIENT or FREELANCER");
        }

        // Ensure user has both roles if not already set
        Set<Role> roles = user.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = EnumSet.of(Role.CLIENT, Role.FREELANCER);
            user.setRoles(roles);
        } else if (!roles.contains(Role.CLIENT) || !roles.contains(Role.FREELANCER)) {
            // Add both roles if missing
            roles = EnumSet.of(Role.CLIENT, Role.FREELANCER);
            user.setRoles(roles);
        }
        
        // Set the selected role as active
        user.setActiveRole(role);
        user.setIsVerified(true);
        user.setIsActive(true);
        userService.save(user);

        AuthResponse authResponse = buildAuthResponse(user);
        return new GoogleAuthResponse(authResponse, false);
    }

    private GoogleAuthResponse buildRoleSelectionResponse(User user, boolean isNewGoogleUser) {
        AuthResponse placeholderAuth = new AuthResponse(
                "",
                "",
                jwtExpirationInMs,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles(),
                null,
                true,
                user.getCreatedAt()
        );
        return new GoogleAuthResponse(placeholderAuth, true);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtExpirationInMs,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles(),
                user.getActiveRole(),
                user.getIsVerified(),
                user.getCreatedAt()
        );
    }

    private void notifyRoleSelectionRequired(User user) {
        // Placeholder for potential notification logic in future
        logger.info("✓ User {} successfully logged in with Google. Both CLIENT and FREELANCER roles assigned. Awaiting role selection.", user.getEmail());
    }
    
    public void register(RegisterRequest registerRequest) {
        logger.info("Processing registration for email: {}", registerRequest.getEmail());
        
        // Check if user already exists
        if (userService.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Registration attempt with already taken email: {}", registerRequest.getEmail());
            throw new RuntimeException("Email is already taken!");
        }
        
        // SECURITY: Validate that activeRole is CLIENT or FREELANCER
        Role activeRole = registerRequest.getActiveRole();
        if (activeRole != Role.CLIENT && activeRole != Role.FREELANCER) {
            logger.warn("Registration attempt with prohibited active role {}: {}", activeRole, registerRequest.getEmail());
            throw new RuntimeException("Active role must be CLIENT or FREELANCER");
        }
        
        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        
        // ALWAYS assign both CLIENT and FREELANCER roles
        Set<Role> roles = EnumSet.of(Role.CLIENT, Role.FREELANCER);
        user.setRoles(roles);
        user.setActiveRole(activeRole);
        logger.info("🔧 Setting activeRole to {} and assigning both roles (CLIENT, FREELANCER) for user: {}", activeRole, registerRequest.getEmail());
        
        user.setPhone(registerRequest.getPhone());
        user.setCountry(registerRequest.getCountry());
        user.setCity(registerRequest.getCity());
        user.setTimezone(registerRequest.getTimezone());
        user.setLanguage(registerRequest.getLanguage());
        user.setIsActive(true);
        user.setIsVerified(false);
        
        User savedUser = userService.save(user);
        logger.info("✅ User created with activeRole={}, roles={CLIENT, FREELANCER}, isVerified={}, email: {}", savedUser.getActiveRole(), savedUser.getIsVerified(), savedUser.getEmail());
        
        // Send OTP for email verification (tokens will be issued only after successful verification)
        otpService.createAndSendOtpForUser(savedUser, true);
        logger.debug("Email verification OTP sent to: {}", savedUser.getEmail());
    }
    
    public void login(LoginRequest loginRequest) {
        try {
            logger.info("Attempting login for email: {}", loginRequest.getEmail());
            
            // First, check if the user exists (including soft-deleted users)
            User user;
            try {
                user = userService.findByEmailIncludingDeleted(loginRequest.getEmail());
                logger.info("User found: {}", user.getEmail());
            } catch (Exception e) {
                logger.warn("User not found for email: {}", loginRequest.getEmail());
                throw new RuntimeException("Invalid credentials");
            }
            
            // Check if user account is soft deleted
            if (user.getDeletedAt() != null) {
                logger.warn("Login attempt for soft-deleted user: {}", user.getEmail());
                throw new RuntimeException("Your account has been deleted. Please contact support for assistance.");
            }
            
            // Verify password manually since we bypassed the normal authentication flow
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                logger.warn("Invalid password for user: {}", user.getEmail());
                throw new RuntimeException("Invalid credentials");
            }
            
            logger.info("Password verified for user: {}", user.getEmail());

            // Instead of issuing tokens here, generate and send OTP
            otpService.createAndSendOtpForUser(user);

            // Update last login attempt time
            user.setLastLoginAt(java.time.LocalDateTime.now());
            userService.save(user);

            // Return empty response (controller will translate to accepted)
        } catch (RuntimeException e) {
            // Re-throw known exceptions (invalid credentials, deleted account)
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during login for email: {}", loginRequest.getEmail(), e);
            throw new RuntimeException("An unexpected error occurred during login. Please try again.");
        }
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken) || !tokenProvider.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        UUID userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userService.findById(userId);
        
        // Generate new tokens
        String newAccessToken = tokenProvider.generateTokenFromUserId(userId);
        String newRefreshToken = tokenProvider.generateRefreshTokenFromUserId(userId);
        
        return new AuthResponse(
                newAccessToken,
                newRefreshToken,
                jwtExpirationInMs,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles(),
                user.getActiveRole(),
                user.getIsVerified(),
                user.getCreatedAt()
        );
    }
    
    public void logout() {
        SecurityContextHolder.clearContext();
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId());
            
            if (user.getActiveRole() == null && user.getRoles() != null && !user.getRoles().isEmpty()) {
                user.setActiveRole(user.getRoles().stream().findFirst().orElse(null));
                user = userService.save(user);
                logger.info("Auto-assigned activeRole to {} for user: {}", user.getActiveRole(), user.getEmail());
            }
            
            return user;
        }
        throw new RuntimeException("No authenticated user found");
    }
}
