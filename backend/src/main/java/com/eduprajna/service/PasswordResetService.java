package com.eduprajna.service;

import com.eduprajna.entity.PasswordResetToken;
import com.eduprajna.entity.User;
import com.eduprajna.repository.PasswordResetTokenRepository;
import com.eduprajna.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for handling password reset functionality
 */
@Service
public class PasswordResetService {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final long TOKEN_EXPIRY_HOURS = 24; // Token valid for 24 hours
    
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Generate password reset token for user email
     * Conditions:
     * 1. User with given email must exist
     * 2. Only one valid token per email at a time
     * 3. Token expires in 24 hours
     * 
     * @param email User's email address
     * @return Generated token if user exists, null otherwise
     */
    public String generatePasswordResetToken(String email) {
        // Check if user exists
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Password reset requested for non-existent email: {}", email);
            return null;
        }
        
        User user = userOpt.get();
        
        // Invalidate any existing tokens for this email
        invalidateExistingTokens(email);
        
        // Generate unique token
        String token = UUID.randomUUID().toString();
        
        // Create new token with 24-hour expiry
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryTime = now.plusHours(TOKEN_EXPIRY_HOURS);
        
        PasswordResetToken resetToken = new PasswordResetToken(token, email, now, expiryTime);
        tokenRepository.save(resetToken);
        
        logger.info("Password reset token generated for email: {}", email);
        
        // Send reset email
        String resetLink = buildResetLink(token);
        emailService.sendPasswordResetEmail(email, user.getName(), resetLink);
        
        return token;
    }
    
    /**
     * Validate reset token
     * Conditions:
     * 1. Token must exist in database
     * 2. Token must not have been used
     * 3. Token must not be expired
     * 
     * @param token Reset token
     * @return true if valid, false otherwise
     */
    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            logger.warn("Invalid reset token provided");
            return false;
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        
        // Check if token is valid (not used and not expired)
        if (!resetToken.isValid()) {
            if (resetToken.getIsUsed()) {
                logger.warn("Reset token already used: {}", token);
            } else {
                logger.warn("Reset token expired: {}", token);
            }
            return false;
        }
        
        return true;
    }
    
    /**
     * Reset password using valid token
     * Conditions:
     * 1. Token must be valid
     * 2. New password must not be empty
     * 3. Mark token as used after successful reset
     * 
     * @param token Reset token
     * @param newPassword New password
     * @return true if password reset successful, false otherwise
     */
    public boolean resetPassword(String token, String newPassword) {
        // Validate token
        if (!validateResetToken(token)) {
            return false;
        }
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            logger.warn("Cannot reset password with empty password");
            return false;
        }
        
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return false;
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        String email = resetToken.getEmail();
        
        // Find user and update password
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.error("User not found for email: {}", email);
            return false;
        }
        
        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Mark token as used
        resetToken.setIsUsed(true);
        tokenRepository.save(resetToken);
        
        logger.info("Password successfully reset for user: {}", email);
        return true;
    }
    
    /**
     * Send forgotten credentials to email
     * Conditions:
     * 1. User with given email must exist
     * 2. Sends username and a temporary password
     * 3. User should change password on first login
     * 
     * @param email User's email
     * @return true if credentials sent, false otherwise
     */
    public boolean sendForgottenCredentials(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Forgotten credentials requested for non-existent email: {}", email);
            return false;
        }
        
        User user = userOpt.get();
        
        // Generate temporary password
        String temporaryPassword = generateTemporaryPassword();
        
        // Update user with temporary password
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);
        
        // Send credentials email
        boolean emailSent = emailService.sendCredentialsEmail(email, user.getName(), temporaryPassword);
        
        if (emailSent) {
            logger.info("Forgotten credentials sent to email: {}", email);
            return true;
        } else {
            logger.error("Failed to send forgotten credentials to: {}", email);
            return false;
        }
    }
    
    /**
     * Invalidate all existing tokens for an email
     */
    private void invalidateExistingTokens(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.findByEmail(email).forEach(token -> {
                if (!token.getIsUsed()) {
                    token.setIsUsed(true);
                    tokenRepository.save(token);
                }
            });
        });
    }
    
    /**
     * Build password reset link
     */
    private String buildResetLink(String token) {
        // Adjust URL to your frontend domain
        return "http://localhost:3000/reset-password?token=" + token;
    }
    
    /**
     * Generate temporary password (8 characters: mix of uppercase, lowercase, numbers)
     */
    private String generateTemporaryPassword() {
        String uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowercase = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String all = uppercase + lowercase + digits;
        
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            password.append(all.charAt((int) (Math.random() * all.length())));
        }
        return password.toString();
    }
}
