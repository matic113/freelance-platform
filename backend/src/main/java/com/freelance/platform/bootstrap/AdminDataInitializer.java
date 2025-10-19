package com.freelance.platform.bootstrap;

import com.freelance.platform.entity.Role;
import com.freelance.platform.entity.User;
import com.freelance.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    public AdminDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            if (adminEmail == null || adminEmail.isBlank()) {
                logger.info("Admin seeding skipped: app.admin.email not set");
                return;
            }

            boolean exists = userRepository.existsByEmail(adminEmail);
            if (exists) {
                logger.info("Super admin already exists for email: {}", adminEmail);
                return;
            }

            String passwordToUse = (adminPassword == null || adminPassword.isBlank()) ? "ChangeMe123!" : adminPassword;

            // Default Super Admin roles i.e Everything
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ADMIN);
            roles.add(Role.CLIENT);
            roles.add(Role.FREELANCER);

            User u = new User();
            u.setEmail(adminEmail);
            u.setPasswordHash(passwordEncoder.encode(passwordToUse));
            u.setFirstName("Super");
            u.setLastName("Admin");
            u.setRoles(roles);
            u.setIsActive(true);
            u.setIsVerified(true); // Admin accounts are pre-verified
            userRepository.save(u);

            logger.warn("Super admin created: {}. Please change the password immediately.", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to seed super admin", e);
        }
    }
}


