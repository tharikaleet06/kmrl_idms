package com.kmrl.workflow.controller;

import com.kmrl.workflow.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/workflows")
@CrossOrigin(origins = "*")
public class WorkflowController {

    private final WorkflowService workflowService;

    @Autowired
    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWorkflows() {
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("workflows", workflowService.getAllTasks());
        return ResponseEntity.ok(res);
    }

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiate(@RequestBody Map<String, Object> payload) {
        if (payload == null || !payload.containsKey("documentId") || payload.get("documentId") == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "documentId is required to initiate workflow");
            return ResponseEntity.badRequest().body(err);
        }

        String documentId = String.valueOf(payload.get("documentId")).trim();
        if (documentId.isEmpty() || "null".equalsIgnoreCase(documentId)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "documentId cannot be empty");
            return ResponseEntity.badRequest().body(err);
        }

        String department = payload.get("department") != null ? String.valueOf(payload.get("department")) : null;
        String documentTitle = payload.get("documentTitle") != null ? String.valueOf(payload.get("documentTitle")) : null;
        String category = payload.get("category") != null ? String.valueOf(payload.get("category")) : null;
        String priority = payload.get("priority") != null ? String.valueOf(payload.get("priority")) : null;
        String assignedTo = payload.get("assignedTo") != null ? String.valueOf(payload.get("assignedTo")) : null;
        String comments = payload.get("comments") != null ? String.valueOf(payload.get("comments")) : null;

        var task = workflowService.initiate(documentId, documentTitle, department, category, priority, assignedTo, comments);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Workflow initiated successfully");
        res.put("workflow", task);
        res.put("task", task);
        res.put("documentId", documentId);
        res.put("status", task.getStatus());
        return ResponseEntity.ok(res);
    }


    @PostMapping("/approve")
    public ResponseEntity<Map<String, Object>> approve(@RequestBody Map<String, String> payload) {
        String documentId = payload.get("documentId");
        String approverName = payload.get("approverName");
        String comments = payload.get("comments");
        String department = payload.get("department");

        Map<String, Object> doc = workflowService.approve(documentId, approverName, comments, department);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("document", doc);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/reject")
    public ResponseEntity<Map<String, Object>> reject(@RequestBody Map<String, String> payload) {
        String documentId = payload.get("documentId");
        String rejectorName = payload.get("rejectorName");
        if (rejectorName == null) rejectorName = payload.get("approverName");
        String comments = payload.get("comments");

        Map<String, Object> doc = workflowService.reject(documentId, rejectorName, comments);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("document", doc);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/check-sla")
    public ResponseEntity<Map<String, Object>> checkSla() {
        Map<String, Object> data = workflowService.checkSla();
        data.put("success", true);
        return ResponseEntity.ok(data);
    }
}
