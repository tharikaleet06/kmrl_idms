package com.kmrl.auth.service;

import com.kmrl.auth.entity.User;
import com.kmrl.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String hashPassword(String password) {
        if (password == null || password.isEmpty()) return password;
        if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {
            return password;
        }
        return passwordEncoder.encode(password);
    }

    private boolean verifyPassword(String rawPassword, String storedPassword) {
        if (storedPassword == null || rawPassword == null) return false;
        if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }
        return storedPassword.equals(rawPassword) || passwordEncoder.matches(rawPassword, passwordEncoder.encode(storedPassword));
    }

    public Map<String, Object> authenticate(String email, String password) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Please enter a valid official email address");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Please enter your account password");
        }

        String cleanEmail = email.trim().toLowerCase();
        Optional<User> found = userRepository.findByEmailIgnoreCase(cleanEmail);

        if (!found.isPresent()) {
            throw new IllegalArgumentException("Authentication failed: User account not found in database.");
        }

        User user = found.get();
        if (!verifyPassword(password, user.getPassword())) {
            throw new IllegalArgumentException("Authentication failed: Invalid credentials.");
        }

        // Generate JWT Token payload containing authenticated user claims
        String payload = String.format(
            "{\"sub\":\"%s\",\"userId\":\"%s\",\"name\":\"%s\",\"role\":\"%s\",\"department\":\"%s\",\"iat\":%d}",
            user.getEmail(), user.getId(), user.getName(), user.getRole(), user.getDepartment(), System.currentTimeMillis() / 1000
        );
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + Base64.getEncoder().encodeToString(payload.getBytes(java.nio.charset.StandardCharsets.UTF_8)) + ".KMRL_SECURE_SIG";

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", user);
        response.put("token", token);
        return response;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User u) {
        if (u.getEmail() == null || !u.getEmail().contains("@")) {
            throw new IllegalArgumentException("Valid official email address is required.");
        }
        String cleanEmail = u.getEmail().trim().toLowerCase();
        Optional<User> existing = userRepository.findByEmailIgnoreCase(cleanEmail);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("An account with email '" + cleanEmail + "' already exists.");
        }

        if (u.getId() == null || u.getId().isEmpty()) {
            u.setId("usr-" + System.currentTimeMillis());
        }
        u.setEmail(cleanEmail);
        if (u.getName() == null || u.getName().trim().isEmpty()) {
            u.setName(cleanEmail.split("@")[0]);
        }
        if (u.getRole() == null || u.getRole().trim().isEmpty()) {
            u.setRole("Department Officer");
        }
        if (u.getDepartment() == null || u.getDepartment().trim().isEmpty()) {
            u.setDepartment("Operations");
        }
        if (u.getAvatarUrl() == null || u.getAvatarUrl().trim().isEmpty()) {
            u.setAvatarUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150");
        }
        if (u.getStatus() == null || u.getStatus().trim().isEmpty()) {
            u.setStatus("Active");
        }
        if (u.getPassword() != null && !u.getPassword().trim().isEmpty()) {
            u.setPassword(hashPassword(u.getPassword()));
        } else {
            u.setPassword(hashPassword("password123"));
        }

        return userRepository.save(u);
    }

    public User updateUser(String id, User updatedFields) {
        Optional<User> existingOpt = userRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }

        User existing = existingOpt.get();

        if (updatedFields.getName() != null && !updatedFields.getName().trim().isEmpty()) {
            existing.setName(updatedFields.getName().trim());
        }
        if (updatedFields.getEmail() != null && updatedFields.getEmail().contains("@")) {
            existing.setEmail(updatedFields.getEmail().trim().toLowerCase());
        }
        if (updatedFields.getRole() != null && !updatedFields.getRole().trim().isEmpty()) {
            existing.setRole(updatedFields.getRole().trim());
        }
        if (updatedFields.getDepartment() != null && !updatedFields.getDepartment().trim().isEmpty()) {
            existing.setDepartment(updatedFields.getDepartment().trim());
        }
        if (updatedFields.getStatus() != null && !updatedFields.getStatus().trim().isEmpty()) {
            existing.setStatus(updatedFields.getStatus().trim());
        }
        if (updatedFields.getAvatarUrl() != null && !updatedFields.getAvatarUrl().trim().isEmpty()) {
            existing.setAvatarUrl(updatedFields.getAvatarUrl().trim());
        }
        if (updatedFields.getPassword() != null && !updatedFields.getPassword().trim().isEmpty()) {
            existing.setPassword(hashPassword(updatedFields.getPassword()));
        }

        return userRepository.save(existing);
    }

    public User saveUser(User u) {
        if (u.getId() != null && userRepository.existsById(u.getId())) {
            return updateUser(u.getId(), u);
        }
        return createUser(u);
    }

    public boolean deleteUser(String id) {
        if (id == null || id.trim().isEmpty()) return false;
        Optional<User> opt = userRepository.findById(id);
        if (opt.isPresent()) {
            userRepository.delete(opt.get());
            return true;
        }
        Optional<User> byEmail = userRepository.findByEmailIgnoreCase(id);
        if (byEmail.isPresent()) {
            userRepository.delete(byEmail.get());
            return true;
        }
        return false;
    }
}
