package com.freelance.platform.service;

import com.freelance.platform.entity.User;
import com.freelance.platform.entity.UserOtp;
import com.freelance.platform.repository.UserOtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@Transactional
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);

    @Autowired
    private UserOtpRepository userOtpRepository;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.otp.code-length:6}")
    private int codeLength;

    @Value("${app.otp.ttl-minutes:10}")
    private int otpTtlMinutes;

    @Value("${app.otp.resend-cooldown-seconds:60}")
    private int resendCooldownSeconds;

    @Value("${app.otp.max-attempts:3}")
    private int maxAttempts;

    private final Random random = new Random();

    public static String cooldownKeyFor(String email) {
        return "otp:cooldown:" + email.toLowerCase();
    }

    public static String latestOtpKeyFor(String email) {
        return "otp:latest:" + email.toLowerCase();
    }

    public UserOtp createAndSendOtpForUser(User user) {
        return createAndSendOtpForUser(user, false);
    }

    public UserOtp createAndSendOtpForUser(User user, boolean forEmailVerification) {
        String rawOtp = generateNumericOtp(codeLength);
        String otpHash = passwordEncoder.encode(rawOtp);

        UserOtp userOtp = new UserOtp();
        userOtp.setUser(user);
        userOtp.setOtpHash(otpHash);
        userOtp.setExpiresAt(LocalDateTime.now().plusMinutes(otpTtlMinutes));
        userOtp = userOtpRepository.save(userOtp);

        // cache latest mapping in redis
        String latestKey = latestOtpKeyFor(user.getEmail());
        redisTemplate.opsForValue().set(latestKey, userOtp.getId().toString(), Duration.ofMinutes(otpTtlMinutes));

        // set cooldown
        String cooldownKey = cooldownKeyFor(user.getEmail());
        redisTemplate.opsForValue().set(cooldownKey, "1", Duration.ofSeconds(resendCooldownSeconds));

        // send email using appropriate template (uses fallback if template missing)
        if (forEmailVerification) {
            emailTemplateService.sendEmailVerification(user.getEmail(), rawOtp, user.getLanguage());
        } else {
            emailTemplateService.sendOtpEmail(user.getEmail(), rawOtp, user.getLanguage());
        }

        logger.info("OTP created and sent for user: {} (otpId={})", user.getEmail(), userOtp.getId());
        return userOtp;
    }

    public boolean canResend(String email) {
        String cooldownKey = cooldownKeyFor(email);
        return redisTemplate.opsForValue().get(cooldownKey) == null;
    }

    public Optional<UserOtp> getLatestOtpForUser(User user) {
        // try redis first
        String latestKey = latestOtpKeyFor(user.getEmail());
        Object maybe = redisTemplate.opsForValue().get(latestKey);
        if (maybe != null) {
            try {
                UUID otpId = UUID.fromString(maybe.toString());
                return userOtpRepository.findById(otpId);
            } catch (Exception e) {
                // fallback to DB lookup
            }
        }
        return userOtpRepository.findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(user);
    }

    public boolean verifyOtp(UserOtp userOtp, String providedOtp) {
        if (userOtp == null) return false;
        if (userOtp.isUsed()) return false;
        if (userOtp.getExpiresAt().isBefore(LocalDateTime.now())) return false;

        boolean matches = passwordEncoder.matches(providedOtp, userOtp.getOtpHash());
        if (matches) {
            userOtp.setUsed(true);
            userOtpRepository.save(userOtp);
            // clean redis entries
            String latestKey = latestOtpKeyFor(userOtp.getUser().getEmail());
            redisTemplate.delete(latestKey);
            return true;
        } else {
            userOtp.setAttempts(userOtp.getAttempts() + 1);
            if (userOtp.getAttempts() >= maxAttempts) {
                userOtp.setUsed(true);
            }
            userOtpRepository.save(userOtp);
            return false;
        }
    }

    private String generateNumericOtp(int length) {
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length) - 1;
        int val = random.nextInt(max - min + 1) + min;
        return String.valueOf(val);
    }
}


