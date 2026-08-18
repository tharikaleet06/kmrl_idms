package com.kmrl.dashboard.controller;

import com.kmrl.dashboard.entity.AuditLog;
import com.kmrl.dashboard.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping({"/api/dashboard/metrics", "/api/dashboard"})
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("metrics", dashboardService.getMetrics());
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/admin/system-config")
    public ResponseEntity<Map<String, Object>> getSystemConfig() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("config", dashboardService.getSystemConfig());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/admin/system-config")
    public ResponseEntity<Map<String, Object>> updateSystemConfig(@RequestBody Map<String, Object> body) {
        Map<String, Object> config = dashboardService.updateSystemConfig(body);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("config", config);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/admin/system-config/department")
    public ResponseEntity<Map<String, Object>> addDepartmentConfig(@RequestBody Map<String, Object> body) {
        Map<String, Object> config = dashboardService.addDepartmentConfig(body);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("config", config);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/api/admin/system-config/category")
    public ResponseEntity<Map<String, Object>> addCategoryConfig(@RequestBody Map<String, Object> body) {
        Map<String, Object> config = dashboardService.addCategoryConfig(body);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("config", config);
        return ResponseEntity.ok(res);
    }

    @GetMapping({"/api/audit-logs", "/api/dashboard/audit-logs"})
    public ResponseEntity<Map<String, Object>> getAuditLogs() {
        List<AuditLog> logs = dashboardService.getAllAuditLogs();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("logs", logs);
        return ResponseEntity.ok(res);
    }

    @PostMapping({"/api/audit-logs", "/api/dashboard/audit-logs"})
    public ResponseEntity<Map<String, Object>> createAuditLog(@RequestBody Map<String, String> body) {
        String user = body.getOrDefault("user", "system@kmrl.co.in");
        String action = body.getOrDefault("action", "USER_ACTION");
        String details = body.getOrDefault("details", "");
        AuditLog log = dashboardService.logAudit(user, action, details);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("log", log);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/eureka/status")
    public ResponseEntity<Map<String, Object>> getEurekaStatus() {
        Map<String, Object> eureka = dashboardService.getEurekaStatus();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("eureka", eureka);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/api/swagger/spec")
    public ResponseEntity<Map<String, Object>> getSwaggerSpec() {
        return ResponseEntity.ok(dashboardService.getSwaggerSpec());
    }
}
