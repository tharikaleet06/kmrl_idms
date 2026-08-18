package com.kmrl.document.controller;

import com.kmrl.document.entity.DocumentEntity;
import com.kmrl.document.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final com.kmrl.document.service.AiEvaluationService aiEvaluationService;

    @Autowired
    public DocumentController(DocumentService documentService, com.kmrl.document.service.AiEvaluationService aiEvaluationService) {
        this.documentService = documentService;
        this.aiEvaluationService = aiEvaluationService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDocuments(
            @RequestParam(value = "department", required = false) String department,
            @RequestHeader(value = "X-User-Role", required = false) String userRole,
            @RequestHeader(value = "X-User-Department", required = false) String userDept,
            @RequestHeader(value = "X-User-Name", required = false) String userName) {
        
        List<DocumentEntity> allDocs = documentService.getAllDocuments();
        
        String targetDept = (department != null && !department.isEmpty()) ? department : userDept;
        String role = userRole != null ? userRole.toUpperCase() : "";
        String name = userName != null ? userName.trim() : "";
        
        if (targetDept != null && !targetDept.trim().isEmpty() && !targetDept.equalsIgnoreCase("ALL") 
            && (role.contains("OFFICER") || role.contains("USER")) && !role.contains("ADMIN") && !role.contains("MANAGER")) {
            allDocs = allDocs.stream()
                    .filter(d -> {
                        boolean deptMatch = d.getDepartment() != null && d.getDepartment().equalsIgnoreCase(targetDept);
                        boolean uploaderMatch = !name.isEmpty() && (
                            (d.getUploadedBy() != null && d.getUploadedBy().equalsIgnoreCase(name)) ||
                            (d.getUploader() != null && d.getUploader().equalsIgnoreCase(name))
                        );
                        boolean assignedMatch = !name.isEmpty() && d.getAssignedTo() != null && d.getAssignedTo().equalsIgnoreCase(name);
                        return deptMatch || uploaderMatch || assignedMatch;
                    })
                    .collect(java.util.stream.Collectors.toList());
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("documents", allDocs);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/ai-evaluation")
    public ResponseEntity<Map<String, Object>> getAiEvaluation() {
        Map<String, Object> eval = aiEvaluationService.evaluateModelPerformance();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("evaluation", eval);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDocument(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ADMIN") String userRole) {
        
        String roleUpper = userRole.toUpperCase();
        if (!roleUpper.contains("ADMIN") && !roleUpper.contains("OFFICER") && !roleUpper.contains("MANAGER")) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Access Denied: Deletion requires Administrator or Department Officer privileges.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(err);
        }

        boolean deleted = documentService.deleteDocument(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", deleted);
        res.put("message", deleted ? "Document deleted successfully" : "Document not found");
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createDocument(@RequestBody DocumentEntity doc) {
        try {
            DocumentEntity saved = documentService.saveDocument(doc);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("document", saved);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @PostMapping("/classify-nlp")
    public ResponseEntity<Map<String, Object>> classifyNlp(@RequestBody Map<String, String> body) {
        try {
            String title = body.getOrDefault("title", "");
            String rawText = body.getOrDefault("rawText", "");
            String fileData = body.getOrDefault("fileData", "");
            String fileType = body.getOrDefault("fileType", "");
            String fileName = body.getOrDefault("fileName", "");

            Map<String, Object> result = documentService.classifyNlp(title, rawText, fileData, fileType, fileName);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("result", result);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSemantic(@RequestParam(value = "query", required = false, defaultValue = "") String query) {
        try {
            List<Map<String, Object>> results = documentService.searchSemantic(query);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("results", results);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDocumentById(@PathVariable String id) {
        Optional<DocumentEntity> opt = documentService.getDocumentById(id);
        if (opt.isPresent()) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("document", opt.get());
            return ResponseEntity.ok(res);
        }
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("error", "Document not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDocument(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<DocumentEntity> opt = documentService.getDocumentById(id);
        DocumentEntity doc;
        if (opt.isPresent()) {
            doc = opt.get();
        } else {
            doc = new DocumentEntity();
            doc.setId(id);
        }

        if (body.containsKey("status")) doc.setStatus((String) body.get("status"));
        if (body.containsKey("workflowStatus")) doc.setWorkflowStatus((String) body.get("workflowStatus"));
        if (body.containsKey("currentStage")) {
            Object val = body.get("currentStage");
            if (val instanceof Number) doc.setCurrentStage(((Number) val).intValue());
        }
        if (body.containsKey("totalStages")) {
            Object val = body.get("totalStages");
            if (val instanceof Number) doc.setTotalStages(((Number) val).intValue());
        }
        if (body.containsKey("currentStageName")) doc.setCurrentStageName((String) body.get("currentStageName"));
        if (body.containsKey("currentStageStatus")) doc.setCurrentStageStatus((String) body.get("currentStageStatus"));
        if (body.containsKey("assignedTo")) doc.setAssignedTo((String) body.get("assignedTo"));
        if (body.containsKey("comments")) doc.setComments((String) body.get("comments"));

        DocumentEntity saved = documentService.saveDocument(doc);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("document", saved);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/version")
    public ResponseEntity<Map<String, Object>> addVersion(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<DocumentEntity> opt = documentService.getDocumentById(id);
        if (opt.isPresent()) {
            try {
                DocumentEntity doc = opt.get();
                String currentVer = doc.getVersion() != null ? doc.getVersion() : "v1.0";
                doc.setVersion(currentVer + ".1");
                DocumentEntity updated = documentService.saveDocument(doc);
                Map<String, Object> res = new HashMap<>();
                res.put("success", true);
                res.put("document", updated);
                return ResponseEntity.ok(res);
            } catch (Exception e) {
                Map<String, Object> err = new HashMap<>();
                err.put("success", false);
                err.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
            }
        } else {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Document not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
    }
}
