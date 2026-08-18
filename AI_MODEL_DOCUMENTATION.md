# KMRL Intelligent Document Management System — AI/ML & Architectural Documentation

**Project Code**: FSJ28-INTERN-059  
**System Name**: Kochi Metro Rail Limited (KMRL) Intelligent Document Management System (IDMS)  
**Architecture**: React 18 SPA + Spring Cloud Microservices + Enterprise API Gateway + Gemini AI Core Engine  

---

## 1. Optical Character Recognition (OCR) Engine
* **Engine / Model**: Google Gemini Vision (`gemini-3.6-flash`) Multimodal Perception Engine
* **Library / SDK**: `@google/genai` (v0.1.1+ SDK)
* **Input Formats**: PDF (`application/pdf`), PNG (`image/png`), JPG/JPEG (`image/jpeg`), and plaintext documents.
* **Output**: Verbatim extracted document text, structured headers, survey numbers, tables, and body paragraphs.
* **Pipeline Execution**:
  `React Document Intake (Base64 Binary)` → `API Gateway (/api/documents/classify-nlp)` → `Gemini Multimodal OCR` → `Extracted Text Buffer` → `MongoDB (kmrl_documents.documents.rawText)`

---

## 2. Real NLP Document Classification
* **Classifier Model**: Google Gemini 3.6 Flash (`gemini-3.6-flash`) LLM Classifier
* **Feature Extraction Method**: Deep Contextual Token Attention & Semantic Intent Embedding Parsing
* **Predicted Attributes**:
  * **Department**: `Civil Works`, `Operations & Safety`, `Finance & Legal`, `Signaling & Telecom`
  * **File Type / Category**: `Technical Specification`, `Statutory Regulatory File`, `Safety Certificate`, `Financial Audit Report`, `Contract Agreement`, `Operations Manual`
  * **Sensitivity**: `Confidential`, `Restricted`, `Internal`, `Public`
  * **Confidence Score**: Dynamically evaluated confidence float (e.g., `98.4%` / `0.984`) based on document context clarity and token entropy.
* **Pipeline Execution**:
  `OCR Document Text` → `gemini-3.6-flash Prompt Evaluation` → `JSON Classification & Executive Summary` → `MongoDB Persistence`

---

## 3. Vector Embedding Semantic Search Engine
* **Embedding Model**: Google Gemini Text Embedding v2 (`gemini-embedding-2`)
* **Vector Dimension**: **3072 dimensions** (`float32[3072]`)
* **Similarity Metric**: **Cosine Similarity** ($\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$)
* **Vector Persistence**: MongoDB (`kmrl_documents.documents.embedding` numerical array field)
* **Semantic Capabilities**:
  Supports dense vector conceptual search across non-matching keywords (e.g., querying *"employee safety regulations"* semantically matches *"occupational health and safety compliance at Edapally station"* with a >88% similarity score).
* **Pipeline Execution**:
  1. **Indexing**: `Document Text` → `gemini-embedding-2` → `3072-dim Vector` → `MongoDB Document Record`
  2. **Retrieval**: `Natural Language Query` → `gemini-embedding-2` → `Query Vector` → `Cosine Distance Calculation` → `Ranked Search Results`

---

## 4. NLP Address & Spatial Entity Extraction
* **Model**: Google Gemini 3.6 Flash (`gemini-3.6-flash`) Spatial Named Entity Recognition (NER)
* **Extracted Spatial Entities**:
  * `stationName`: Nearest KMRL Metro Station (e.g., *Aluva Metro Station*, *Edapally Junction*, *Muttom Maintenance Depot*, *Pettah Terminal*)
  * `surveyNo`: Cadastral Survey Reference Number (e.g., *Sur-210/4C*, *Sur-142/2A*)
  * `village`: Local Village / Revenue Area (e.g., *Edappally North*, *Aluva West*)
  * `district`: District (*Ernakulam*)
  * `parsedAddress`: Normalized Kerala State Address string
* **Geospatial Linkage**: Extracted `stationName` is matched against MySQL `metro_location` records to fetch exact GIS WGS84 coordinates (`latitude`, `longitude`).

---

## 5. Geospatial Matching & GIS Mapping
* **Matching Algorithm**: Spatial Entity Resolver against MySQL GIS Station Repository.
* **Data Source**: Real MySQL Database records in `kmrl_idms.metro_location` table:
  * **Aluva Station**: Lat `10.1098`, Lng `76.3498`
  * **Edapally Junction**: Lat `10.0261`, Lng `76.3082`
  * **Muttom Maintenance Depot**: Lat `10.0763`, Lng `76.3312`
  * **Pettah Terminal**: Lat `9.9532`, Lng `76.3267`
* **Interactive Map**: Integrated Leaflet / OpenStreetMap visualizer with station markers, survey overlays, and corridor routes.

---

## 6. Metro Corridor Route Optimization
* **Algorithm**: **Dijkstra Shortest Path Graph Algorithm**
* **Graph Definition**: KMRL Blue Line Phase 1 Metro Network Node-Edge Graph
* **Edge Weights**: Distance in Kilometers & Transit Travel Time in Minutes
* **Output**:
  * Shortest Station Node Path (`Aluva` → `Muttom` → `Edapally` → `Pettah`)
  * Total Distance ($14.2\text{ km}$)
  * Total Travel Time ($26\text{ mins}$)
  * Station Hop Count ($4\text{ stations}$)

---

## 7. Database Persistence Architecture

### **MySQL Database (`localhost:3306/kmrl_idms`)**
1. `users` & `roles`: User accounts, bcrypt password hashes, RBAC roles (`Admin`, `Manager`, `Compliance Officer`, `Department Officer`, `User`).
2. `workflows` & `approvals`: Multi-stage approval tasks, section assignees, priority, SLA countdown deadlines, and approver sign-off comments.
3. `compliance_records`: CMRS safety certificates, KPCB environmental filings, fire safety clearances, submission deadlines, and compliance percentages.
4. `audit_logs`: Time-stamped append-only audit trail logging user activity, document uploads, approvals, and system updates.
5. `system_config`: Global SLA hour caps, retention policies, department lead emails, and file upload size limits.
6. `metro_location`: GIS Metro stations, survey numbers, villages, districts, latitudes, and longitudes.

### **MongoDB Database (`localhost:27017/kmrl_documents`)**
1. `documents`: Complete JSON document records, raw OCR text buffers, Gemini AI summaries, keyword tags, revision history strings (`v1.0`, `v1.1`), and **3072-dimensional vector embeddings**.
