package com.freelance.platform.controller;

import com.freelance.platform.dto.request.GoogleLoginRequest;
import com.freelance.platform.dto.request.GoogleRoleSelectionRequest;
import com.freelance.platform.dto.request.LoginRequest;
import com.freelance.platform.dto.request.RegisterRequest;
import com.freelance.platform.dto.response.AuthResponse;
import com.freelance.platform.dto.response.GoogleAuthResponse;
import com.freelance.platform.dto.response.UserResponse;
import com.freelance.platform.entity.User;
import com.freelance.platform.service.AuthService;
import com.freelance.platform.service.OtpService;
import com.freelance.platform.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;

    @Autowired
    private OtpService otpService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Register a new user with email and password. Email verification via OTP is required before account activation.")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // IMPORTANT: Do NOT issue tokens here. Registration requires email verification via OTP.
            authService.register(registerRequest);
            
            logger.info("Registration initiated for email: {}. OTP sent for verification.", registerRequest.getEmail());
            
            // Return OtpChallengeResponse (202 Accepted)
            // Tokens will ONLY be issued after successful OTP verification via /verify-email-register
            return ResponseEntity.accepted().body(Map.of(
                "otpSent", true, 
                "message", "Registration successful. Please verify your email with the OTP sent to your email address.",
                "email", registerRequest.getEmail()
            ));
        } catch (SecurityException e) {
            logger.warn("Security exception during registration: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Registration Forbidden",
                "message", e.getMessage(),
                "status", 400
            ));
        } catch (RuntimeException e) {
            logger.warn("Runtime exception during registration: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Registration Failed",
                "message", e.getMessage(),
                "status", 400
            ));
        } catch (Exception e) {
            logger.error("Unexpected error during registration", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal Server Error",
                "message", "An unexpected error occurred during registration. Please try again later.",
                "status", 500
            ));
        }
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user with email and password")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Modified: login will now trigger OTP send and not return tokens
            authService.login(loginRequest);
            return ResponseEntity.accepted().body(Map.of("otpSent", true, "email", loginRequest.getEmail()));
        } catch (RuntimeException e) {
            // Return specific error messages for known exceptions
            if (e.getMessage().contains("deleted")) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Account Deleted",
                    "message", e.getMessage(),
                    "status", 400
                ));
            } else if (e.getMessage().contains("Invalid credentials")) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid Credentials",
                    "message", e.getMessage(),
                    "status", 400
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Login Failed",
                    "message", e.getMessage(),
                    "status", 400
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal Server Error",
                "message", "An unexpected error occurred. Please try again later.",
                "status", 500
            ));
        }
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Generate new access token using refresh token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Logout the current user")
    public ResponseEntity<String> logout() {
        authService.logout();
        return ResponseEntity.ok("User logged out successfully");
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get information about the currently authenticated user")
    public ResponseEntity<UserResponse> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            UserResponse userResponse = userService.mapToUserResponse(user);
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            logger.error("Error getting current user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            logger.error("Unexpected error getting current user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and issue tokens", description = "Verify one-time password sent to email and return tokens (for login)")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String otp = payload.get("otp");
            if (email == null || otp == null) {
                logger.warn("verify-otp: Missing email or otp");
                return ResponseEntity.badRequest().body(Map.of("error", "Missing email or otp"));
            }

            // load user
            var user = userService.findByEmail(email);
            var maybeOtp = otpService.getLatestOtpForUser(user);
            if (maybeOtp.isEmpty()) {
                logger.warn("verify-otp: No OTP found or expired for {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "No OTP found or expired"));
            }

            var userOtp = maybeOtp.get();
            boolean ok = otpService.verifyOtp(userOtp, otp);
            if (!ok) {
                logger.warn("verify-otp: Invalid OTP for {}", email);
                return ResponseEntity.status(401).body(Map.of("error", "Invalid OTP"));
            }

             logger.info("✅ OTP verified for login. User email: {}, isVerified: {}, activeRole: {}", email, user.getIsVerified(), user.getActiveRole());

             if (user.getActiveRole() == null && user.getRoles() != null && !user.getRoles().isEmpty()) {
                 user.setActiveRole(user.getRoles().stream().findFirst().orElse(null));
                 user = userService.save(user);
                 logger.info("Auto-assigned activeRole to {} for user: {}", user.getActiveRole(), user.getEmail());
             } else if (user.getActiveRole() != null) {
                 logger.info("✅ activeRole already set to {} for user: {}", user.getActiveRole(), user.getEmail());
             }

            // Create authentication and generate tokens
            var userPrincipal = com.freelance.platform.security.UserPrincipal.create(user);
            var authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities()
            );

            // set security context
            org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = authService.getTokenProvider().generateToken(authentication);
            String refreshToken = authService.getTokenProvider().generateRefreshToken(authentication);

            logger.info("✅ Tokens issued for login. User: {}", email);
            
            return ResponseEntity.ok(new com.freelance.platform.dto.response.AuthResponse(
                    accessToken,
                    refreshToken,
                    authService.getJwtExpirationInMs(),
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRoles(),
                    user.getActiveRole(),
                    user.getIsVerified(),
                    user.getProfileCompleted(),
                    user.getCreatedAt()
            ));
        } catch (Exception e) {
            logger.error("Error verifying OTP", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/verify-email-register")
    @Operation(summary = "Verify email registration and issue tokens", description = "Verify OTP sent during registration, mark email as verified, and return authentication tokens")
    public ResponseEntity<?> verifyEmailRegistration(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String otp = payload.get("otp");
            if (email == null || otp == null) {
                logger.warn("verify-email-register: Missing email or otp");
                return ResponseEntity.badRequest().body(Map.of("error", "Missing email or otp"));
            }

            // Find user
            User user = userService.findByEmail(email);
            if (user.getIsVerified()) {
                logger.warn("Verification attempt for already verified user: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "Email already verified"));
            }

            // Get and verify OTP
            var maybeOtp = otpService.getLatestOtpForUser(user);
            if (maybeOtp.isEmpty()) {
                logger.warn("No OTP found for user: {}", email);
                return ResponseEntity.badRequest().body(Map.of("error", "No OTP found or expired"));
            }

            var userOtp = maybeOtp.get();
            boolean isOtpValid = otpService.verifyOtp(userOtp, otp);
            if (!isOtpValid) {
                logger.warn("Invalid OTP attempt for user: {}", email);
                return ResponseEntity.status(401).body(Map.of("error", "Invalid OTP"));
            }

             // ✅ CRITICAL: Mark email as verified BEFORE generating tokens
             logger.info("🔧 Before save - activeRole: {}, isVerified: {}, roles: {}", user.getActiveRole(), user.getIsVerified(), user.getRoles());
             user.setIsVerified(true);
             
             if (user.getActiveRole() == null && user.getRoles() != null && !user.getRoles().isEmpty()) {
                 user.setActiveRole(user.getRoles().stream().findFirst().orElse(null));
                 logger.info("Auto-assigned activeRole to {} for user: {}", user.getActiveRole(), user.getEmail());
             }
             
             User verifiedUser = userService.save(user);
             logger.info("✅ Email verified and saved for user: {}. activeRole={}, isVerified={}", email, verifiedUser.getActiveRole(), verifiedUser.getIsVerified());

            // Create authentication and generate tokens
            var userPrincipal = com.freelance.platform.security.UserPrincipal.create(verifiedUser);
            var authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    userPrincipal, null, userPrincipal.getAuthorities()
            );

            // Set security context
            org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = authService.getTokenProvider().generateToken(authentication);
            String refreshToken = authService.getTokenProvider().generateRefreshToken(authentication);

            // ✅ VERIFICATION: Ensure isVerified is true before returning
            logger.info("Generating tokens for verified user: {}. isVerified={}", email, verifiedUser.getIsVerified());
            
            AuthResponse response = new com.freelance.platform.dto.response.AuthResponse(
                    accessToken,
                    refreshToken,
                    authService.getJwtExpirationInMs(),
                    verifiedUser.getId(),
                    verifiedUser.getEmail(),
                    verifiedUser.getFirstName(),
                    verifiedUser.getLastName(),
                    verifiedUser.getRoles(),
                    verifiedUser.getActiveRole(),
                    verifiedUser.getIsVerified(),
                    verifiedUser.getProfileCompleted(),
                    verifiedUser.getCreatedAt()
            );
            
            logger.info("✅ Registration complete. Issuing tokens with isVerified={}", response.getIsVerified());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error verifying email registration", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/google")
    @Operation(summary = "Authenticate with Google", description = "Verify Google ID token and return platform auth tokens or require role selection")
    public ResponseEntity<?> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            GoogleAuthResponse response = authService.authenticateWithGoogle(request.getIdToken());
            if (response.isRequiresRoleSelection()) {
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
            }
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.warn("Google login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid Google login",
                "message", e.getMessage(),
                "status", 400
            ));
        } catch (RuntimeException e) {
            logger.warn("Runtime exception during Google login: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Google login failed",
                "message", e.getMessage(),
                "status", 400
            ));
        } catch (Exception e) {
            logger.error("Unexpected error during Google login", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal Server Error",
                "message", "An unexpected error occurred during Google login. Please try again later.",
                "status", 500
            ));
        }
    }

    @PostMapping("/google/role")
    @Operation(summary = "Complete Google role selection", description = "Persist the chosen role for Google-authenticated users and issue tokens")
    public ResponseEntity<?> completeGoogleRoleSelection(@Valid @RequestBody GoogleRoleSelectionRequest request) {
        try {
            User user = userService.findById(request.getUserId());
            GoogleAuthResponse response = authService.completeGoogleRoleSelection(user, request.toRole());
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            logger.warn("Google role selection failed - user not found: {}", request.getUserId());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "User Not Found",
                "message", e.getMessage(),
                "status", 404
            ));
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid role selection for user {}: {}", request.getUserId(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid Role",
                "message", e.getMessage(),
                "status", 400
            ));
        } catch (Exception e) {
            logger.error("Unexpected error completing Google role selection", e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal Server Error",
                "message", "An unexpected error occurred while saving the selected role.",
                "status", 500
            ));
        }
    }
}
