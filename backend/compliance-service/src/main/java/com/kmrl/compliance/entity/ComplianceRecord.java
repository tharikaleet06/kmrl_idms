package com.kmrl.compliance.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "compliance_records")
public class ComplianceRecord {
    @Id
    private String id;
    private String title;
    private String regulationType;
    private String department;
    private String status;
    private String auditDate;
    private String officer;
    private String notes;

    public ComplianceRecord() {}

    public ComplianceRecord(String id, String title, String regulationType, String department, String status, String auditDate, String officer, String notes) {
        this.id = id;
        this.title = title;
        this.regulationType = regulationType;
        this.department = department;
        this.status = status;
        this.auditDate = auditDate;
        this.officer = officer;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRegulationType() { return regulationType; }
    public void setRegulationType(String regulationType) { this.regulationType = regulationType; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAuditDate() { return auditDate; }
    public void setAuditDate(String auditDate) { this.auditDate = auditDate; }

    public String getOfficer() { return officer; }
    public void setOfficer(String officer) { this.officer = officer; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}