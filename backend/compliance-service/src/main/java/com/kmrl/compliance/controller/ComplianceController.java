package com.kmrl.compliance.controller;

import com.kmrl.compliance.entity.ComplianceRecord;
import com.kmrl.compliance.service.ComplianceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/compliance")
@CrossOrigin(origins = "*")
public class ComplianceController {

    private final ComplianceService complianceService;

    @Autowired
    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRecords() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("compliance", complianceService.getAllRecords());
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRecord(@RequestBody ComplianceRecord record) {
        ComplianceRecord created = complianceService.saveRecord(record);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("record", created);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRecord(@PathVariable String id, @RequestBody(required = false) ComplianceRecord record) {
        if (record == null) record = new ComplianceRecord();
        ComplianceRecord updated = complianceService.updateRecord(id, record);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("record", updated);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatusPut(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String notes = payload.get("notes");
        String officer = payload.get("officer");
        ComplianceRecord updated = complianceService.updateStatus(id, status, notes, officer);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("record", updated);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatusPost(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return updateStatusPut(id, payload);
    }

    @PostMapping("/{id}/request-review")
    public ResponseEntity<Map<String, Object>> requestReview(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        String notes = payload != null ? payload.get("notes") : "Compliance review requested.";
        String officer = payload != null ? payload.get("officer") : "Compliance Officer";
        ComplianceRecord updated = complianceService.updateStatus(id, "Under Review", notes, officer);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Compliance review requested successfully");
        res.put("record", updated);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/mark-compliance")
    public ResponseEntity<Map<String, Object>> markCompliance(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        String notes = payload != null ? payload.get("notes") : "Marked compliant.";
        String officer = payload != null ? payload.get("officer") : "Compliance Officer";
        ComplianceRecord updated = complianceService.updateStatus(id, "Compliant", notes, officer);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Marked as compliant successfully");
        res.put("record", updated);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/mark-non-compliant")
    public ResponseEntity<Map<String, Object>> markNonCompliant(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        String notes = payload != null ? payload.get("notes") : "Flagged non-compliant.";
        String officer = payload != null ? payload.get("officer") : "Compliance Officer";
        ComplianceRecord updated = complianceService.updateStatus(id, "Non-Compliant", notes, officer);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Flagged as non-compliant successfully");
        res.put("record", updated);
        return ResponseEntity.ok(res);
    }
}