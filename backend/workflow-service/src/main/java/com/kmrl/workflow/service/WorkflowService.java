package com.kmrl.workflow.service;

import com.kmrl.workflow.entity.WorkflowTask;
import com.kmrl.workflow.repository.WorkflowRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WorkflowService {

    private final WorkflowRepository workflowRepository;

    @Autowired
    public WorkflowService(WorkflowRepository workflowRepository) {
        this.workflowRepository = workflowRepository;
    }

    @PostConstruct
    public void seedWorkflows() {
        if (workflowRepository.count() == 0) {
            workflowRepository.save(new WorkflowTask("wf-101", "KMRL-DOC-1001", "Civil Line Extension Survey Log", "Civil Works", "Operations Manager", "Approved", "2026-08-15", "High", "Fully verified"));
            workflowRepository.save(new WorkflowTask("wf-102", "KMRL-DOC-1002", "CMRS Safety Certificate", "Safety & Security", "Compliance Officer", "Pending Review", "2026-08-12", "Urgent", "Pending CMRS signature"));
        }
    }

    public List<WorkflowTask> getAllTasks() {
        return workflowRepository.findAll();
    }

    public WorkflowTask initiate(String documentId, String documentTitle, String department, String category, String priority, String assignedTo, String comments) {
        List<WorkflowTask> existing = workflowRepository.findByDocumentId(documentId);
        if (!existing.isEmpty()) {
            return existing.get(0);
        }

        String id = "wf-" + System.currentTimeMillis();
        String slaDeadline = java.time.LocalDate.now().plusDays(3).toString();
        String status = "In Progress";
        String workflowStatus = "In Progress";
        Integer currentStage = 1;
        Integer totalStages = 3;
        String currentStageName = "Department Officer";
        String currentStageStatus = "Pending";
        String defaultAssignedTo = assignedTo != null && !assignedTo.trim().isEmpty() ? assignedTo : "Department Officer";

        String finalComments = comments;
        if ((finalComments == null || finalComments.trim().isEmpty()) && category != null && !category.trim().isEmpty()) {
            finalComments = "Workflow initiated after AI analysis for category: " + category;
        } else if (finalComments == null || finalComments.trim().isEmpty()) {
            finalComments = "Workflow initiated automatically upon document intake";
        }

        WorkflowTask task = new WorkflowTask(
            id,
            documentId,
            documentTitle != null && !documentTitle.trim().isEmpty() ? documentTitle : "KMRL Document " + documentId,
            department != null && !department.trim().isEmpty() ? department : "Operations",
            defaultAssignedTo,
            status,
            slaDeadline,
            priority != null && !priority.trim().isEmpty() ? priority : "Normal",
            finalComments,
            1,
            3,
            "Department Officer",
            "Pending Approval",
            "In Progress",
            java.time.Instant.now().toString(),
            java.time.Instant.now().toString()
        );
        task.setCurrentStage(1);
        task.setTotalStages(3);
        task.setCurrentStageName("Department Officer");
        task.setCurrentStageStatus("Pending Approval");
        task.setStatus("In Progress");
        task.setWorkflowStatus("In Progress");

        return workflowRepository.save(task);
    }

    public WorkflowTask initiate(String documentId, String documentTitle, String department, String priority, String assignedTo, String comments) {
        return initiate(documentId, documentTitle, department, null, priority, assignedTo, comments);
    }

    public Map<String, Object> approve(String documentId, String approverName, String comments, String department) {
        List<WorkflowTask> tasks = workflowRepository.findByDocumentId(documentId);
        WorkflowTask task;
        if (!tasks.isEmpty()) {
            task = tasks.get(0);
        } else {
            task = new WorkflowTask(
                "wf-" + System.currentTimeMillis(),
                documentId,
                "KMRL Document " + documentId,
                department != null ? department : "Operations",
                approverName != null ? approverName : "Department Officer",
                "In Progress",
                "2026-08-20",
                "Normal",
                comments,
                1,
                3,
                "Department Officer",
                "Pending",
                "In Progress",
                java.time.Instant.now().toString(),
                java.time.Instant.now().toString()
            );
        }

        int currentStage = (task.getCurrentStage() != null && task.getCurrentStage() >= 1 && task.getCurrentStage() <= 3) ? task.getCurrentStage() : 1;
        if ("Approved".equalsIgnoreCase(task.getStatus()) || "Completed".equalsIgnoreCase(task.getWorkflowStatus())) {
            currentStage = 3;
        }

        if (currentStage == 1) {
            // Stage 1 Approved -> Move to Stage 2
            task.setCurrentStage(2);
            task.setCurrentStageName("Joint GM / Department Head");
            task.setAssignedTo("Joint GM (Operations)");
            task.setStatus("In Progress");
            task.setWorkflowStatus("In Progress");
            task.setCurrentStageStatus("Pending Approval");
        } else if (currentStage == 2) {
            // Stage 2 Approved -> Move to Stage 3
            task.setCurrentStage(3);
            task.setCurrentStageName("Final Approver / Authorized Officer");
            task.setAssignedTo("Authorized Officer");
            task.setStatus("In Progress");
            task.setWorkflowStatus("In Progress");
            task.setCurrentStageStatus("Pending Approval");
        } else {
            // Stage 3 (Final Stage) Approved -> Completed
            task.setCurrentStage(3);
            task.setCurrentStageName("Final Approver / Authorized Officer");
            task.setCurrentStageStatus("Approved");
            task.setStatus("Approved");
            task.setWorkflowStatus("Completed");
        }

        if (comments != null && !comments.trim().isEmpty()) {
            task.setComments(comments);
        }
        task.setUpdatedAt(java.time.Instant.now().toString());

        workflowRepository.save(task);

        Map<String, Object> res = new HashMap<>();
        res.put("id", documentId);
        res.put("documentId", documentId);
        res.put("title", task.getDocumentTitle());
        res.put("department", task.getDepartment());
        res.put("status", task.getStatus());
        res.put("workflowStatus", task.getWorkflowStatus());
        res.put("currentStage", task.getCurrentStage());
        res.put("totalStages", task.getTotalStages());
        res.put("currentStageName", task.getCurrentStageName());
        res.put("currentStageStatus", task.getCurrentStageStatus());
        res.put("assignedTo", task.getAssignedTo());
        res.put("approvedBy", approverName);
        res.put("comments", task.getComments());

        List<Map<String, Object>> chain = new ArrayList<>();
        Map<String, Object> c1 = new HashMap<>();
        c1.put("id", "ap-1");
        c1.put("role", "Stage 1: Department Officer");
        c1.put("approverName", "Department Officer");
        c1.put("status", task.getCurrentStage() > 1 || "Approved".equals(task.getStatus()) ? "approved" : "pending");
        chain.add(c1);

        Map<String, Object> c2 = new HashMap<>();
        c2.put("id", "ap-2");
        c2.put("role", "Stage 2: Joint GM / Department Head");
        c2.put("approverName", "Joint GM (Operations)");
        c2.put("status", task.getCurrentStage() > 2 || "Approved".equals(task.getStatus()) ? "approved" : (task.getCurrentStage() == 2 ? "pending" : "pending"));
        chain.add(c2);

        Map<String, Object> c3 = new HashMap<>();
        c3.put("id", "ap-3");
        c3.put("role", "Stage 3: Final Approver / Authorized Officer");
        c3.put("approverName", "Authorized Officer");
        c3.put("status", "Approved".equals(task.getStatus()) ? "approved" : "pending");
        chain.add(c3);

        res.put("approvalChain", chain);
        res.put("task", task);
        return res;
    }

    public Map<String, Object> reject(String documentId, String rejectorName, String comments) {
        List<WorkflowTask> tasks = workflowRepository.findByDocumentId(documentId);
        WorkflowTask task;
        if (!tasks.isEmpty()) {
            task = tasks.get(0);
        } else {
            task = new WorkflowTask(
                "wf-" + System.currentTimeMillis(),
                documentId,
                "KMRL Document " + documentId,
                "Operations",
                rejectorName != null ? rejectorName : "Department Officer",
                "Rejected",
                "2026-08-20",
                "High",
                comments,
                1,
                3,
                "Department Officer",
                "Rejected",
                "Rejected",
                java.time.Instant.now().toString(),
                java.time.Instant.now().toString()
            );
        }

        task.setStatus("Rejected");
        task.setWorkflowStatus("Rejected");
        task.setCurrentStageStatus("Rejected");
        if (comments != null && !comments.trim().isEmpty()) {
            task.setComments("REJECTED: " + comments);
        }
        task.setUpdatedAt(java.time.Instant.now().toString());

        workflowRepository.save(task);

        Map<String, Object> res = new HashMap<>();
        res.put("id", documentId);
        res.put("documentId", documentId);
        res.put("title", task.getDocumentTitle());
        res.put("status", "Rejected");
        res.put("workflowStatus", "Rejected");
        res.put("currentStageStatus", "Rejected");
        res.put("rejectedBy", rejectorName);
        res.put("comments", task.getComments());
        res.put("task", task);
        return res;
    }


    public Map<String, Object> checkSla() {
        List<WorkflowTask> tasks = workflowRepository.findAll();
        long breachedCount = tasks.stream().filter(t -> "SLA Breached".equalsIgnoreCase(t.getStatus())).count();
        Map<String, Object> res = new HashMap<>();
        res.put("totalChecked", tasks.size());
        res.put("breachesCount", breachedCount);
        res.put("status", "SLA Verification Completed");
        return res;
    }
}
