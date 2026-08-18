package com.kmrl.dashboard.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String timestamp;
    private String user;
    private String action;
    private String details;
    private String previousHash;
    private String currentHash;

    public AuditLog() {}

    public AuditLog(String id, String timestamp, String user, String action, String details, String previousHash, String currentHash) {
        this.id = id;
        this.timestamp = timestamp;
        this.user = user;
        this.action = action;
        this.details = details;
        this.previousHash = previousHash;
        this.currentHash = currentHash;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getPreviousHash() { return previousHash; }
    public void setPreviousHash(String previousHash) { this.previousHash = previousHash; }

    public String getCurrentHash() { return currentHash; }
    public void setCurrentHash(String currentHash) { this.currentHash = currentHash; }
}
