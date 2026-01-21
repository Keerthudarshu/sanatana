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

    /**
     * Send order confirmation email (Ported from Node.js)
     */
    public boolean sendOrderConfirmation(java.util.Map<String, Object> orderData) {
        try {
            String email = (String) orderData.get("email");
            Object orderIdObj = orderData.get("orderId");
            String orderId = orderIdObj != null ? String.valueOf(orderIdObj) : "N/A";

            @SuppressWarnings("unchecked")
            java.util.List<java.util.Map<String, Object>> items = (java.util.List<java.util.Map<String, Object>>) orderData
                    .get("items");

            Double subtotal = parseDouble(orderData.get("subtotal"));
            Double shippingCost = parseDouble(orderData.get("shippingCost"));
            Double discountAmount = parseDouble(orderData.get("discountAmount"));
            Double total = parseDouble(orderData.get("total"));

            StringBuilder rowsHtml = new StringBuilder();
            for (java.util.Map<String, Object> item : items) {
                String name = (String) item.get("name");
                Object weightVal = item.get("weightValue");
                String weightUnit = (String) item.get("weightUnit");
                String weightDisplay = (weightVal != null ? weightVal : "-") + " "
                        + (weightUnit != null ? weightUnit : "");

                int quantity = parseInt(item.get("quantity"));
                Double price = parseDouble(item.get("price"));
                Double itemTotal = quantity * price;

                rowsHtml.append("<tr>")
                        .append("<td style=\"padding: 10px; border: 1px solid #ddd;\">").append(name).append("</td>")
                        .append("<td style=\"padding: 10px; border: 1px solid #ddd;\">").append(weightDisplay)
                        .append("</td>")
                        .append("<td style=\"padding: 10px; border: 1px solid #ddd; text-align: center;\">")
                        .append(quantity).append("</td>")
                        .append("<td style=\"padding: 10px; border: 1px solid #ddd; text-align: right;\">₹")
                        .append(String.format("%.2f", price)).append("</td>")
                        .append("<td style=\"padding: 10px; border: 1px solid #ddd; text-align: right;\">₹")
                        .append(String.format("%.2f", itemTotal)).append("</td>")
                        .append("</tr>");
            }

            String discountRow = "";
            if (discountAmount > 0) {
                discountRow = "<tr>" +
                        "<td colspan=\"4\" style=\"padding: 10px; text-align: right; font-weight: bold; color: #e53e3e;\">Discount</td>"
                        +
                        "<td style=\"padding: 10px; text-align: right; color: #e53e3e;\">-₹"
                        + String.format("%.2f", discountAmount) + "</td>" +
                        "</tr>";
            }

            String emailBody = "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;\">"
                    +
                    "<div style=\"text-align: center; margin-bottom: 20px;\">" +
                    "<h2>Sanatana Parampare</h2>" +
                    "</div>" +
                    "<h2 style=\"color: #4CAF50; text-align: center;\">Thank you for your order!</h2>" +
                    "<p>Hi there,</p>" +
                    "<p>Your order <strong>#" + orderId + "</strong> has been confirmed and is being processed.</p>" +

                    "<table style=\"width: 100%; border-collapse: collapse; margin-top: 20px;\">" +
                    "<thead>" +
                    "<tr style=\"background-color: #f8f8f8;\">" +
                    "<th style=\"padding: 10px; border: 1px solid #ddd; text-align: left;\">Product</th>" +
                    "<th style=\"padding: 10px; border: 1px solid #ddd; text-align: left;\">Weight</th>" +
                    "<th style=\"padding: 10px; border: 1px solid #ddd; text-align: center;\">Qty</th>" +
                    "<th style=\"padding: 10px; border: 1px solid #ddd; text-align: right;\">Price</th>" +
                    "<th style=\"padding: 10px; border: 1px solid #ddd; text-align: right;\">Total</th>" +
                    "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    rowsHtml.toString() +
                    "</tbody>" +
                    "<tfoot>" +
                    "<tr>" +
                    "<td colspan=\"4\" style=\"padding: 10px; text-align: right; font-weight: bold;\">Subtotal</td>" +
                    "<td style=\"padding: 10px; text-align: right;\">₹" + String.format("%.2f", subtotal) + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td colspan=\"4\" style=\"padding: 10px; text-align: right; font-weight: bold;\">Shipping</td>" +
                    "<td style=\"padding: 10px; text-align: right;\">₹" + String.format("%.2f", shippingCost) + "</td>"
                    +
                    "</tr>" +
                    discountRow +
                    "<tr style=\"background-color: #f8f8f8; font-size: 1.1em;\">" +
                    "<td colspan=\"4\" style=\"padding: 10px; text-align: right; font-weight: bold;\">Grand Total</td>"
                    +
                    "<td style=\"padding: 10px; text-align: right; font-weight: bold; color: #4CAF50;\">₹"
                    + String.format("%.2f", total) + "</td>" +
                    "</tr>" +
                    "</tfoot>" +
                    "</table>" +

                    "<p style=\"margin-top: 30px;\">An invoice PDF has been attached to this email for your records.</p>"
                    +
                    "<p>We'll notify you when your order is shipped!</p>" +

                    "<div style=\"margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #888; text-align: center;\">"
                    +
                    "<p>Sanatana Parampare - 100% Authentic Products</p>" +
                    "<p>If you have any questions, contact us at techmindset@kvgengg.com</p>" +
                    "</div>" +
                    "</div>";

            jakarta.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
            org.springframework.mail.javamail.MimeMessageHelper helper = new org.springframework.mail.javamail.MimeMessageHelper(
                    mimeMessage, true, "UTF-8");

            helper.setFrom("noreply@sanathanaparampara.com");
            helper.setTo(email);
            helper.setSubject("Order Confirmation #" + orderId + " - Sanatana Parampare");
            helper.setText(emailBody, true); // true = isHtml

            mailSender.send(mimeMessage);
            logger.info("Order confirmation email sent to: {}", email);
            return true;

        } catch (Exception e) {
            logger.error("Failed to send order confirmation email", e);
            return false;
        }
    }

    private Double parseDouble(Object value) {
        if (value == null)
            return 0.0;
        if (value instanceof Number)
            return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private int parseInt(Object value) {
        if (value == null)
            return 0;
        if (value instanceof Number)
            return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
