package com.eduprajna.config;

import com.eduprajna.entity.User;
import com.eduprajna.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "Admin@gmail.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User(
                    "Admin",
                    adminEmail,
                    passwordEncoder.encode("Admin@890"),
                    "0000000000" // Dummy phone number
            );
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Admin user created successfully with email: " + adminEmail);
        } else {
            System.out.println("Admin user checking: User already exists with email: " + adminEmail);
        }
    }
}
