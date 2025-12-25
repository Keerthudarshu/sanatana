package com.eduprajna.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service for sending emails
 */
@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    /**
     * Send password reset email with reset link
     * 
     * @param recipientEmail User's email address
     * @param username User's username
     * @param resetLink Link containing reset token
     * @return true if email sent successfully, false otherwise
     */
    public boolean sendPasswordResetEmail(String recipientEmail, String username, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@sanathanaparampara.com");
            message.setTo(recipientEmail);
            message.setSubject("Sanatana Parampara - Password Reset Request");
            
            String emailBody = buildPasswordResetEmailBody(username, resetLink, recipientEmail);
            message.setText(emailBody);
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", recipientEmail);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", recipientEmail, e);
            return false;
        }
    }
    
    /**
     * Build the email body for password reset
     */
    private String buildPasswordResetEmailBody(String username, String resetLink, String email) {
        return "Hello " + username + ",\n\n" +
               "We received a request to reset your password. Click the link below to reset your password:\n\n" +
               resetLink + "\n\n" +
               "This link will expire in 24 hours.\n\n" +
               "Your Account Details:\n" +
               "- Username: " + username + "\n" +
               "- Email: " + email + "\n\n" +
               "If you did not request a password reset, please ignore this email.\n\n" +
               "Best regards,\n" +
               "Sanatana Parampara Support Team";
    }
    
    /**
     * Send account credentials via email
     * 
     * @param recipientEmail User's email
     * @param username User's username
     * @param password User's password
     * @return true if email sent successfully
     */
    public boolean sendCredentialsEmail(String recipientEmail, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@sanathanaparampara.com");
            message.setTo(recipientEmail);
            message.setSubject("Sanatana Parampara - Your Account Credentials");
            
            String emailBody = "Hello " + username + ",\n\n" +
                             "Here are your account credentials:\n\n" +
                             "Email: " + recipientEmail + "\n" +
                             "Username: " + username + "\n" +
                             "Password: " + password + "\n\n" +
                             "Please keep these credentials secure and change your password after first login.\n\n" +
                             "Best regards,\n" +
                             "Sanatana Parampara Support Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Credentials email sent successfully to: {}", recipientEmail);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to send credentials email to: {}", recipientEmail, e);
            return false;
        }
    }
}
