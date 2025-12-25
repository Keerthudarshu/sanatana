package com.eduprajna.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity to store password reset tokens
 * Tokens are valid for 24 hours (86400 seconds)
 */
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 500)
    private String token; // Unique reset token (UUID)
    
    @Column(nullable = false)
    private String email; // User's email address
    
    @Column(nullable = false)
    private LocalDateTime createdAt; // When token was created
    
    @Column(nullable = false)
    private LocalDateTime expiryTime; // When token expires (24 hours from creation)
    
    @Column(nullable = false)
    private Boolean isUsed = false; // Whether token has been used to reset password
    
    /**
     * Default constructor
     */
    public PasswordResetToken() {
    }
    
    /**
     * Constructor with parameters
     */
    public PasswordResetToken(String token, String email, LocalDateTime createdAt, LocalDateTime expiryTime) {
        this.token = token;
        this.email = email;
        this.createdAt = createdAt;
        this.expiryTime = expiryTime;
        this.isUsed = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }
    
    public void setExpiryTime(LocalDateTime expiryTime) {
        this.expiryTime = expiryTime;
    }
    
    public Boolean getIsUsed() {
        return isUsed;
    }
    
    public void setIsUsed(Boolean isUsed) {
        this.isUsed = isUsed;
    }
    
    /**
     * Check if token is valid (not expired and not used)
     */
    public boolean isValid() {
        return !isUsed && LocalDateTime.now().isBefore(expiryTime);
    }
    
    /**
     * Check if token is expired
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}
