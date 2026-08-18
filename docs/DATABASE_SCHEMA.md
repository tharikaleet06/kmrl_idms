# 🗄️ Database Schemas & Data Model Specifications

KMRL-IDMS uses a **polyglot persistence architecture**:
- **MySQL 8.0 (`kmrl_idms`)**: Source of truth for relational entities, users, RBAC roles, workflows, compliance records, GIS locations, and audit trails.
- **MongoDB (`kmrl_documents`)**: Document store for raw OCR text, AI classification JSON results, extracted spatial entities, and 3072-dimensional vector embeddings.

---

## 🐬 MySQL Database Schema (`kmrl_idms`)

### 1. `users` Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- BCrypt Hash
    role VARCHAR(100) NOT NULL,    -- ADMIN, MANAGER, DEPARTMENT_OFFICER, COMPLIANCE_OFFICER, USER
    department VARCHAR(100),
    avatar_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Active'
);
```

### 2. `documents` Metadata Table
```sql
CREATE TABLE documents (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    file_type VARCHAR(100),
    department VARCHAR(100) NOT NULL,
    sensitivity VARCHAR(50) DEFAULT 'Internal',
    confidence_score DOUBLE,
    uploader VARCHAR(255),
    uploaded_by VARCHAR(255),
    uploaded_at VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Uploaded',
    workflow_status VARCHAR(50) DEFAULT 'Not Initiated',
    station_name VARCHAR(255),
    summary TEXT,
    version VARCHAR(20) DEFAULT 'v1.0'
);
```

### 3. `workflow_tasks` Table
```sql
CREATE TABLE workflow_tasks (
    id VARCHAR(255) PRIMARY KEY,
    document_id VARCHAR(255) NOT NULL,
    document_title VARCHAR(500),
    department VARCHAR(100),
    category VARCHAR(100),
    priority VARCHAR(50) DEFAULT 'Normal',
    status VARCHAR(50) DEFAULT 'In Progress',
    current_stage INT DEFAULT 1,
    total_stages INT DEFAULT 3,
    current_stage_name VARCHAR(255),
    current_stage_status VARCHAR(50) DEFAULT 'Pending',
    assigned_to VARCHAR(255),
    sla_deadline VARCHAR(100),
    comments TEXT
);
```

### 4. `compliance_records` Table
```sql
CREATE TABLE compliance_records (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    regulation_type VARCHAR(100),
    department VARCHAR(100),
    officer VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Under Review',
    audit_date VARCHAR(100),
    notes TEXT
);
```

### 5. `audit_logs` Table
```sql
CREATE TABLE audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    timestamp VARCHAR(100) NOT NULL,
    user VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    last_hash VARCHAR(255),
    current_hash VARCHAR(255)
);
```

### 6. `metro_location` Table
```sql
CREATE TABLE metro_location (
    id VARCHAR(255) PRIMARY KEY,
    station_name VARCHAR(255) NOT NULL,
    station_code VARCHAR(50),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    survey_no VARCHAR(100),
    village VARCHAR(100),
    district VARCHAR(100) DEFAULT 'Ernakulam'
);
```

---

## 🍃 MongoDB Document Collection (`kmrl_documents.documents`)

```json
{
  "_id": "66c24f80a1b2c3d4e5f67890",
  "documentId": "KMRL-CIV-2026-1007",
  "title": "Kakkanad Extension Viaduct Elastomeric Bearing Inspection",
  "fileName": "Viaduct-Bearing-Inspection.pdf",
  "fileSize": "4.2 MB",
  "fileType": "Technical Specification",
  "department": "Civil Works",
  "sensitivity": "Restricted",
  "rawText": "KMRL CIVIL ENGINEERING & MAINTENANCE WING\nDocument Reference: KMRL-CIVIL-2026-9041...",
  "ocrText": "KMRL CIVIL ENGINEERING & MAINTENANCE WING...",
  "summary": "Elastomeric bearing pads installed per IRC:83 standard at Pier 88.",
  "confidenceScore": 96.8,
  "confidenceStatus": "VALID",
  "extractedEntities": {
    "addresses": ["Kalamassery Station Pier 88"],
    "dates": ["2026-08-10"],
    "contractors": ["Afcons Infrastructure Ltd."],
    "amounts": ["₹ 85,00,000"],
    "regulations": ["IRC:83 (Part II)"]
  },
  "tags": ["Civil Works", "Technical Specification"],
  "embedding": [0.0124, -0.0451, 0.0892, "... 3072 floats ..."],
  "version": "v1.0",
  "uploadedBy": "Department Officer",
  "createdAt": "2026-08-10T10:15:00.000Z"
}

---

## 🔗 Related Documentation
- 🏠 [Root README](../README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🔐 [RBAC Matrix](RBAC_MATRIX.md)
- 🐍 [Python AI Service Guide](AI_SERVICE_GUIDE.md)
- 🧠 [AI Model Documentation](AI_MODEL_DOCUMENTATION.md)
- 🚀 [Setup & Run Guide](SETUP_RUN_GUIDE.md)
```
