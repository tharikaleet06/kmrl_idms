package com.kmrl.auth.controller;

import com.kmrl.auth.entity.User;
import com.kmrl.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String password = payload.get("password");
            Map<String, Object> result = authService.authenticate(email, password);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(401).body(err);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("users", authService.getAllUsers());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody User u) {
        try {
            User created = authService.createUser(u);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("user", created);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable String id, @RequestBody User u) {
        try {
            User updated = authService.updateUser(id, u);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("user", updated);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }


    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ADMIN") String userRole) {
        
        if (!userRole.toUpperCase().contains("ADMIN")) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Access Denied: Only Administrator users can delete user accounts.");
            return ResponseEntity.status(403).body(err);
        }

        boolean deleted = authService.deleteUser(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", deleted);
        res.put("message", deleted ? "User account deleted successfully" : "User not found");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Logged out successfully");
        return ResponseEntity.ok(res);
    }
}
