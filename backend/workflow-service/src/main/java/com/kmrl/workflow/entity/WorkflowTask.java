package com.kmrl.workflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "workflow_tasks")
public class WorkflowTask {
    @Id
    private String id;
    private String documentId;
    private String documentTitle;
    private String department;
    private String assignedTo;
    private String status;
    private String slaDeadline;
    private String priority;
    private String comments;

    private Integer currentStage = 1;
    private Integer totalStages = 3;
    private String currentStageName = "Department Officer";
    private String currentStageStatus = "Pending";
    private String workflowStatus = "In Progress";
    private String initiatedAt;
    private String updatedAt;

    public WorkflowTask() {}

    public WorkflowTask(String id, String documentId, String documentTitle, String department, String assignedTo, String status, String slaDeadline, String priority, String comments) {
        this.id = id;
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.department = department;
        this.assignedTo = assignedTo != null && !assignedTo.trim().isEmpty() ? assignedTo : "Department Officer";
        this.status = "Approved".equalsIgnoreCase(status) ? "Approved" : "In Progress";
        this.slaDeadline = slaDeadline;
        this.priority = priority;
        this.comments = comments;
        this.currentStage = "Approved".equalsIgnoreCase(status) ? 3 : 1;
        this.totalStages = 3;
        this.currentStageName = "Approved".equalsIgnoreCase(status) ? "Final Approver / Authorized Officer" : "Department Officer";
        this.currentStageStatus = "Approved".equalsIgnoreCase(status) ? "Approved" : "Pending";
        this.workflowStatus = "Approved".equalsIgnoreCase(status) ? "Completed" : "In Progress";
        this.initiatedAt = java.time.Instant.now().toString();
        this.updatedAt = java.time.Instant.now().toString();
    }

    public WorkflowTask(String id, String documentId, String documentTitle, String department, String assignedTo, String status, String slaDeadline, String priority, String comments, Integer currentStage, Integer totalStages, String currentStageName, String currentStageStatus, String workflowStatus, String initiatedAt, String updatedAt) {
        this.id = id;
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.department = department;
        this.assignedTo = assignedTo;
        this.status = status != null ? status : "In Progress";
        this.slaDeadline = slaDeadline;
        this.priority = priority;
        this.comments = comments;
        this.currentStage = currentStage != null ? currentStage : 1;
        this.totalStages = totalStages != null ? totalStages : 3;
        this.currentStageName = currentStageName != null ? currentStageName : "Department Officer";
        this.currentStageStatus = currentStageStatus != null ? currentStageStatus : "Pending";
        this.workflowStatus = workflowStatus != null ? workflowStatus : this.status;
        this.initiatedAt = initiatedAt != null ? initiatedAt : java.time.Instant.now().toString();
        this.updatedAt = updatedAt != null ? updatedAt : java.time.Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getDocumentTitle() { return documentTitle; }
    public void setDocumentTitle(String documentTitle) { this.documentTitle = documentTitle; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(String slaDeadline) { this.slaDeadline = slaDeadline; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Integer getCurrentStage() { return currentStage != null ? currentStage : 1; }
    public void setCurrentStage(Integer currentStage) { this.currentStage = currentStage; }

    public Integer getTotalStages() { return totalStages != null ? totalStages : 3; }
    public void setTotalStages(Integer totalStages) { this.totalStages = totalStages; }

    public String getCurrentStageName() { return currentStageName != null ? currentStageName : "Department Officer"; }
    public void setCurrentStageName(String currentStageName) { this.currentStageName = currentStageName; }

    public String getCurrentStageStatus() { return currentStageStatus != null ? currentStageStatus : "Pending"; }
    public void setCurrentStageStatus(String currentStageStatus) { this.currentStageStatus = currentStageStatus; }

    public String getWorkflowStatus() { return workflowStatus != null ? workflowStatus : status; }
    public void setWorkflowStatus(String workflowStatus) { this.workflowStatus = workflowStatus; }

    public String getInitiatedAt() { return initiatedAt; }
    public void setInitiatedAt(String initiatedAt) { this.initiatedAt = initiatedAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}

