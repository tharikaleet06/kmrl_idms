# 🐍 Python FastAPI AI Microservice Specification

The `ai-service/` is a dedicated **Python FastAPI Microservice** running on port `:8000`. It provides real AI/ML processing capabilities for the KMRL Intelligent Document Management System.

---

## ⚡ Microservice Architecture

```text
React SPA (:3000)
    ↓ REST
Spring Boot API Gateway (:8080)
    ↓ REST
Spring Boot Document Service (:8082)
    ↓ REST (http://localhost:8000/ai/*)
Python FastAPI AI Service (:8000)
    ↓
AI Processing Pipeline (OCR, NLP, Vectors, GIS Routing)
```

---

## 📡 REST API Endpoints

### 1. `POST /ai/ocr`
Extracts verbatim text from document buffers or base64 files.
- **Request Body**:
  ```json
  {
    "base64Data": "data:application/pdf;base64,...",
    "fileName": "CMRS_Safety_Certificate.pdf",
    "fileType": "application/pdf"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "text": "COMMISSION OF RAILWAY SAFETY INSPECTION REPORT 2026...",
    "confidence": 0.98,
    "mode": "PYTHON_AI_SERVICE"
  }
  ```

### 2. `POST /ai/classify`
Analyzes document text to determine department, category, sensitivity, and executive summary.
- **Request Body**:
  ```json
  {
    "title": "CMRS Rail Safety Inspection",
    "rawText": "COMMISSION OF RAILWAY SAFETY INSPECTION REPORT 2026..."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "department": "Operations & Safety",
    "documentType": "Safety Certificate",
    "sensitivity": "Confidential",
    "confidence": 0.968,
    "summary": "Annual statutory safety inspection of elevated viaduct structure."
  }
  ```

### 3. `POST /ai/extract-entities`
Parses named entities from OCR text: addresses, dates, contractors, financial valuations, and statutory acts.
- **Request Body**:
  ```json
  {
    "text": "Contractor: L&T Heavy Infra. Valuation: ₹ 1,45,00,000. Act: Metro Railways Act 2002."
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "entities": {
      "addresses": ["Aluva to Petta Corridor Pier 45"],
      "dates": ["2026-08-05"],
      "contractors": ["L&T Heavy Infra"],
      "amounts": ["₹ 1,45,00,000"],
      "regulations": ["Metro Railways Act 2002"]
    }
  }
  ```

### 4. `POST /ai/embed`
Generates vector embeddings from text.
- **Request Body**:
  ```json
  {
    "text": "Monsoon high-water drainage culvert site inspection"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "embedding": [0.0124, -0.0451, 0.0892],
    "dimension": 384
  }
  ```

### 5. `POST /ai/search`
Performs secured vector similarity search pre-filtered by the user's department authorization scope.
- **Request Body**:
  ```json
  {
    "query": "viaduct structural bearing inspection",
    "documents": [...],
    "user_role": "DEPARTMENT_OFFICER",
    "user_department": "Civil Works",
    "user_name": "officer@kmrl.co.in"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "results": [
      {
        "id": "KMRL-CIVIL-2026-1007",
        "title": "Kakkanad Extension Viaduct Elastomeric Bearing Inspection",
        "relevanceScore": 94.2
      }
    ],
    "mode": "PYTHON_FASTAPI_FAISS_COSINE"
  }
  ```

### 6. `POST /ai/route/optimize`
Computes shortest metro corridor path using Dijkstra's graph algorithm.
- **Request Body**:
  ```json
  {
    "origin": "Aluva Metro Station",
    "destination": "Pettah Terminal",
    "waypoints": ["Edapally Junction"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "path": ["Aluva Metro Station", "Muttom Maintenance Depot", "Edapally Junction", "Pettah Terminal"],
    "totalDistanceKm": 14.2,
    "totalTimeMins": 26,
    "stationCount": 4
  }
  ```

---

## 🔗 Related Documentation
- 🏠 [Root README](../README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🔐 [RBAC Matrix](RBAC_MATRIX.md)
- 🗄️ [Database Schema](DATABASE_SCHEMA.md)
- 🧠 [AI Model Documentation](AI_MODEL_DOCUMENTATION.md)
- 🚀 [Setup & Run Guide](SETUP_RUN_GUIDE.md)
