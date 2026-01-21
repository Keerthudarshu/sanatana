package com.eduprajna.controller;

import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.entity.User;
import com.eduprajna.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" }, allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder,
            org.springframework.security.authentication.AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            logger.debug("Login attempt for email: {}", body.get("email"));

            String email = body.get("email");
            String password = body.get("password");

            if (email == null || password == null) {
                logger.warn("Missing email or password in login request");
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            try {
                org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email,
                                password));

                if (authentication.isAuthenticated()) {
                    Optional<User> userOpt = userService.findByEmail(email);
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        logger.info("Successful login for user: {}", email);
                        return ResponseEntity.ok(Map.of(
                                "id", user.getId(),
                                "name", user.getName(),
                                "email", user.getEmail(),
                                "role", user.getRole()));
                    }
                }
            } catch (org.springframework.security.core.AuthenticationException e) {
                logger.warn("Invalid credentials for email: {}", email);
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            return ResponseEntity.status(401).body("Invalid credentials");

        } catch (Exception e) {
            logger.error("Error during login for email: {}", body.get("email"), e);
            return ResponseEntity.status(500).body("Internal server error during login");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            logger.debug("Registration attempt for email: {}", body.get("email"));

            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");
            String phone = body.get("phone");
            String role = body.getOrDefault("role", "customer");

            if (name == null || email == null || password == null) {
                logger.warn("Missing required fields in registration request");
                return ResponseEntity.badRequest().body("Name, email, and password are required");
            }

            // Check if user already exists
            if (userService.findByEmail(email).isPresent()) {
                logger.warn("Registration failed - email already exists: {}", email);
                return ResponseEntity.badRequest().body("Email already exists");
            }

            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(password));
            user.setPhone(phone);
            user.setRole(role);

            User savedUser = userService.save(user);
            logger.info("User registered successfully: {}", email);

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "userId", savedUser.getId()));
        } catch (Exception e) {
            logger.error("Error during registration for email: {}", body.get("email"), e);
            return ResponseEntity.status(500).body("Internal server error during registration");
        }
    }
}