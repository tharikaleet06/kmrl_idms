package com.kmrl.auth.service;

import com.kmrl.auth.entity.User;
import com.kmrl.auth.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    private final UserRepository userRepository;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(new User("usr-1", "Admin User", "admin@kmrl.co.in", hashPassword("password123"), "Admin", "Operations", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", "Active"));
            userRepository.save(new User("usr-2", "Department Officer", "officer@kmrl.co.in", hashPassword("password123"), "Department Officer", "Civil Works", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", "Active"));
            userRepository.save(new User("usr-3", "Operations Manager", "manager@kmrl.co.in", hashPassword("password123"), "Manager", "Operations", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", "Active"));
            userRepository.save(new User("usr-4", "Compliance Officer", "compliance@kmrl.co.in", hashPassword("password123"), "Compliance Officer", "Legal & Regulatory", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150", "Active"));
            userRepository.save(new User("usr-5", "Standard User", "user@kmrl.co.in", hashPassword("password123"), "User", "Operations", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150", "Active"));
        }
    }

    private String hashPassword(String password) {
        if (password == null || password.isEmpty()) return password;
        if (password.startsWith("SHA256:")) return password;
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder("SHA256:");
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return password;
        }
    }

    private boolean verifyPassword(String rawPassword, String storedPassword) {
        if (storedPassword == null) return false;
        if (storedPassword.equals(rawPassword)) return true;
        return storedPassword.equals(hashPassword(rawPassword));
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

        User user;
        if (found.isPresent()) {
            user = found.get();
            if (!verifyPassword(password, user.getPassword())) {
                throw new IllegalArgumentException("Invalid email or password. Please check your credentials.");
            }
        } else {
            String role = "User";
            if (cleanEmail.contains("admin")) role = "Admin";
            else if (cleanEmail.contains("manager")) role = "Manager";
            else if (cleanEmail.contains("compliance")) role = "Compliance Officer";
            else if (cleanEmail.contains("officer")) role = "Department Officer";

            String department = "Operations";
            if ("Compliance Officer".equals(role)) department = "Legal & Regulatory";
            else if ("Department Officer".equals(role)) department = "Civil Works";

            String nameParts = cleanEmail.split("@")[0].replace(".", " ");
            String name = nameParts.substring(0, 1).toUpperCase() + nameParts.substring(1);

            user = new User("usr-" + System.currentTimeMillis(), name, cleanEmail, hashPassword(password), role, department, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150", "Active");
            userRepository.save(user);
        }

        String token = "kmrl_jwt_" + Base64.getEncoder().encodeToString(user.getEmail().getBytes()) + "_" + System.currentTimeMillis();

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
