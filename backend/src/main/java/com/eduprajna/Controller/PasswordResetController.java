package com.eduprajna.Controller;

import com.eduprajna.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for password reset and forgotten password functionality
 */
@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordResetController {
    
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetController.class);
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    /**
     * POST /api/password/forgot
     * Request forgotten password reset
     * 
     * Body: { "email": "user@example.com" }
     * Response: { "success": true, "message": "Reset link sent to email" }
     */
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Email is required"));
            }
            
            String token = passwordResetService.generatePasswordResetToken(email);
            
            Map<String, Object> response = new HashMap<>();
            if (token != null) {
                response.put("success", true);
                response.put("message", "Password reset link has been sent to your email. Please check your inbox.");
                response.put("email", email);
                logger.info("Password reset initiated for email: {}", email);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Email not found in our system");
                logger.warn("Password reset requested for non-existent email: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("Error in forgotPassword endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred. Please try again later."));
        }
    }
    
    /**
     * POST /api/password/validate-token
     * Validate if reset token is still valid
     * 
     * Body: { "token": "uuid-token" }
     * Response: { "valid": true/false, "message": "..." }
     */
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Token is required"));
            }
            
            boolean isValid = passwordResetService.validateResetToken(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            
            if (isValid) {
                response.put("message", "Token is valid. You can proceed to reset your password.");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Token is invalid or expired. Please request a new reset link.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            logger.error("Error in validateToken endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred while validating token"));
        }
    }
    
    /**
     * POST /api/password/reset
     * Reset password using valid token
     * 
     * Body: { "token": "uuid-token", "newPassword": "password123" }
     * Response: { "success": true/false, "message": "..." }
     */
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");
            
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Token is required"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("New password is required"));
            }
            
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Password must be at least 6 characters long"));
            }
            
            boolean success = passwordResetService.resetPassword(token, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "Password has been successfully reset. You can now login with your new password.");
                logger.info("Password successfully reset using token");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to reset password. Token may be invalid or expired.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } catch (Exception e) {
            logger.error("Error in resetPassword endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred while resetting password"));
        }
    }
    
    /**
     * POST /api/password/send-credentials
     * Send forgotten username and temporary password to email
     * 
     * Body: { "email": "user@example.com" }
     * Response: { "success": true/false, "message": "..." }
     */
    @PostMapping("/send-credentials")
    public ResponseEntity<?> sendForgottenCredentials(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Email is required"));
            }
            
            boolean success = passwordResetService.sendForgottenCredentials(email);
            
            Map<String, Object> response = new HashMap<>();
            if (success) {
                response.put("success", true);
                response.put("message", "Your username and temporary password have been sent to your email. Please check your inbox and login with the temporary password.");
                response.put("email", email);
                logger.info("Credentials sent to email: {}", email);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Email not found in our system or failed to send email");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("Error in sendForgottenCredentials endpoint", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("An error occurred. Please try again later."));
        }
    }
    
    /**
     * Helper method to create error response
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
