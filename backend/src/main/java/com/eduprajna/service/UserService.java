package com.eduprajna.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.eduprajna.entity.User;
import com.eduprajna.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    public Optional<User> findByEmail(String email) { return userRepository.findByEmail(email); }
    public User save(User user) { return userRepository.save(user); }
}