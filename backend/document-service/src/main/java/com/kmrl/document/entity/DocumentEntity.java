package com.kmrl.document.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "documents")
public class DocumentEntity {
    @Id
    private String id;
    private String title;
    private String docType;
    private String department;
    private String uploader;
    private String uploadedBy;
    private String status;
    private String sensitivity;
    private String version;
    private String createdAt;
    private String uploadedAt;
    private String priority = "Normal";
    private String category;

    @Column(columnDefinition = "LONGTEXT")
    private String summary;

    @Column(columnDefinition = "LONGTEXT")
    private String rawText;

    @Column(columnDefinition = "LONGTEXT")
    private String ocrText;

    private String tags;
    private String fileName;
    private String fileSize;
    private String fileType;
    private double confidenceScore;

    @Column(columnDefinition = "LONGTEXT")
    private String embeddingJson;

    @Transient
    private List<Double> embedding;

    private String ocrStatus = "COMPLETED";
    private String classificationStatus = "COMPLETED";
    private String entityExtractionStatus = "COMPLETED";
    private String embeddingStatus = "COMPLETED";
    private String overallAiStatus = "COMPLETED";

    private String stationName;
    private String surveyNo;
    private Double latitude;
    private Double longitude;
    private String village;
    private String district;

    private String workflowStatus;
    private Integer currentStage = 1;
    private Integer totalStages = 3;
    private String currentStageName = "Department Officer";
    private String currentStageStatus = "Pending";
    private String assignedTo;

    @Column(columnDefinition = "LONGTEXT")
    private String comments;

    public DocumentEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDocType() { return docType; }
    public void setDocType(String docType) { this.docType = docType; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSensitivity() { return sensitivity; }
    public void setSensitivity(String sensitivity) { this.sensitivity = sensitivity; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }

    public String getOcrText() { return ocrText; }
    public void setOcrText(String ocrText) { this.ocrText = ocrText; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileSize() { return fileSize; }
    public void setFileSize(String fileSize) { this.fileSize = fileSize; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getEmbeddingJson() { return embeddingJson; }
    public void setEmbeddingJson(String embeddingJson) { this.embeddingJson = embeddingJson; }

    public List<Double> getEmbedding() {
        if (embedding != null && !embedding.isEmpty()) return embedding;
        if (embeddingJson != null && !embeddingJson.trim().isEmpty()) {
            List<Double> list = new ArrayList<>();
            String[] parts = embeddingJson.replace("[", "").replace("]", "").split(",");
            for (String p : parts) {
                try {
                    list.add(Double.parseDouble(p.trim()));
                } catch (Exception ignored) {}
            }
            this.embedding = list;
            return list;
        }
        return new ArrayList<>();
    }

    public void setEmbedding(List<Double> embedding) {
        this.embedding = embedding;
        if (embedding != null && !embedding.isEmpty()) {
            this.embeddingJson = embedding.toString();
        } else {
            this.embeddingJson = null;
        }
    }

    public String getWorkflowStatus() { return workflowStatus; }
    public void setWorkflowStatus(String workflowStatus) { this.workflowStatus = workflowStatus; }

    public Integer getCurrentStage() { return currentStage != null ? currentStage : 1; }
    public void setCurrentStage(Integer currentStage) { this.currentStage = currentStage; }

    public Integer getTotalStages() { return totalStages != null ? totalStages : 3; }
    public void setTotalStages(Integer totalStages) { this.totalStages = totalStages; }

    public String getCurrentStageName() { return currentStageName != null ? currentStageName : "Department Officer"; }
    public void setCurrentStageName(String currentStageName) { this.currentStageName = currentStageName; }

    public String getCurrentStageStatus() { return currentStageStatus != null ? currentStageStatus : "Pending"; }
    public void setCurrentStageStatus(String currentStageStatus) { this.currentStageStatus = currentStageStatus; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getOcrStatus() { return ocrStatus; }
    public void setOcrStatus(String ocrStatus) { this.ocrStatus = ocrStatus; }

    public String getClassificationStatus() { return classificationStatus; }
    public void setClassificationStatus(String classificationStatus) { this.classificationStatus = classificationStatus; }

    public String getEntityExtractionStatus() { return entityExtractionStatus; }
    public void setEntityExtractionStatus(String entityExtractionStatus) { this.entityExtractionStatus = entityExtractionStatus; }

    public String getEmbeddingStatus() { return embeddingStatus; }
    public void setEmbeddingStatus(String embeddingStatus) { this.embeddingStatus = embeddingStatus; }

    public String getOverallAiStatus() { return overallAiStatus; }
    public void setOverallAiStatus(String overallAiStatus) { this.overallAiStatus = overallAiStatus; }

    public String getStationName() { return stationName; }
    public void setStationName(String stationName) { this.stationName = stationName; }

    public String getSurveyNo() { return surveyNo; }
    public void setSurveyNo(String surveyNo) { this.surveyNo = surveyNo; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    private String slaBreachRiskPercentage = "12.4%";
    private String slaRiskLevel = "Low Risk";

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getSlaBreachRiskPercentage() { return slaBreachRiskPercentage; }
    public void setSlaBreachRiskPercentage(String slaBreachRiskPercentage) { this.slaBreachRiskPercentage = slaBreachRiskPercentage; }

    public String getSlaRiskLevel() { return slaRiskLevel; }
    public void setSlaRiskLevel(String slaRiskLevel) { this.slaRiskLevel = slaRiskLevel; }

    public String getPriority() { return priority != null ? priority : "Normal"; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCategory() { return category != null ? category : docType; }
    public void setCategory(String category) { this.category = category; }
}
