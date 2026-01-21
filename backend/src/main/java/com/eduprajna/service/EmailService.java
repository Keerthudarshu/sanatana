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
     * @param username       User's username
     * @param resetLink      Link containing reset token
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
     * @param username       User's username
     * @param password       User's password
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

    /**
     * Send contact thank you email
     */
    public boolean sendContactThankYou(String name, String email) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@sanathanaparampara.com");
            message.setTo(email);
            message.setSubject("Thank you for contacting Sanatana Parampara");

            String emailBody = "Hello " + name + ",\n\n" +
                    "Thank you for contacting Sanatana Parampara. We have received your inquiry and will get back to you shortly.\n\n"
                    +
                    "Best regards,\n" +
                    "Sanatana Parampara Team";

            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Contact thank you email sent to: {}", email);
            return true;

        } catch (Exception e) {
            logger.error("Failed to send contact thank you email to: {}", email, e);
            return false;
        }
    }

    /**
     * Send subscription confirmation email
     */
    public boolean sendSubscriptionConfirmation(String email) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@sanathanaparampara.com");
            message.setTo(email);
            message.setSubject("Welcome to Sanatana Parampara Family!");

            String emailBody = "Hello,\n\n" +
                    "Thank you for subscribing to our newsletter! You are now part of the Sanatana Parampara family.\n\n"
                    +
                    "Use code WELCOME10 for 10% off your first order.\n\n" +
                    "Best regards,\n" +
                    "Sanatana Parampara Team";

            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Subscription confirmation email sent to: {}", email);
            return true;

        } catch (Exception e) {
            logger.error("Failed to send subscription confirmation email to: {}", email, e);
            return false;
        }
    }
}
