package com.eduprajna.repository;

import com.eduprajna.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for PasswordResetToken entity
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    /**
     * Find token by its unique value
     */
    Optional<PasswordResetToken> findByToken(String token);
    
    /**
     * Find all tokens for a specific email
     */
    List<PasswordResetToken> findByEmail(String email);
    
    /**
     * Find valid (unused and not expired) tokens for an email
     */
    Optional<PasswordResetToken> findByEmailAndIsUsedFalse(String email);
    
    /**
     * Delete expired tokens (for cleanup)
     */
    void deleteByExpiryTimeBefore(LocalDateTime now);
}
