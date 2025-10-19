package com.freelance.platform.repository;

import com.freelance.platform.entity.UserOtp;
import com.freelance.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserOtpRepository extends JpaRepository<UserOtp, UUID> {
    List<UserOtp> findByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);
    Optional<UserOtp> findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(User user);
}


