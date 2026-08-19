# 🚆 Kochi Metro Rail Limited (KMRL) — Intelligent Document Management System (IDMS)

[![Java 17](https://img.shields.io/badge/Java-17-orange.svg?style=flat-square&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Cloud 2023](https://img.shields.io/badge/Spring%20Cloud-2023.0.0-green.svg?style=flat-square&logo=spring)](https://spring.io/projects/spring-cloud)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![MongoDB 6.0](https://img.shields.io/badge/MongoDB-6.0-47A248.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

> **Project Perspective & System Architecture**: An enterprise-grade **Intelligent Document Management System (IDMS)** custom-architected for **Kochi Metro Rail Limited (KMRL)** operational, legal, structural, and compliance workflows. Features **React 19**, **Spring Cloud Microservices**, **Python FastAPI AI Processing**, **MySQL 8.0**, **MongoDB**, **Geospatial GIS Engine**, and **SLA-Driven Workflows**.

---

## 📚 Structured Documentation Index

All reference documentation is structured under the [docs](docs/) directory:

- 🏗️ [System Architecture Guide](docs/ARCHITECTURE.md) — Microservices topology, Spring Cloud Gateway, Eureka, and Python AI communication flow.
- 🔐 [Role-Based Access Control (RBAC) Matrix](docs/RBAC_MATRIX.md) — Permissions matrix for Admin, Manager, Compliance Officer, Dept Officer, and User roles with server-side JPA scoping logic.
- 🗄️ [Database Schema & Data Models](docs/DATABASE_SCHEMA.md) — Complete MySQL relational DDL schemas and MongoDB document collection specifications.
- 🐍 [Python FastAPI AI Microservice Guide](docs/AI_SERVICE_GUIDE.md) — OCR processing, NLP classification, spaCy entity parsing, 384/3072-dim embeddings, vector search security, and Dijkstra route optimization.
- 🧠 [AI/ML Engine & Model Specifications](docs/AI_MODEL_DOCUMENTATION.md) — Deep technical specification for Google Gemini & PyTesseract perception models and vector similarity pipelines.
- 🚀 [Setup & Execution Guide](docs/SETUP_RUN_GUIDE.md) — Step-by-step instructions for running the complete system via scripts, VS Code tasks, and verifying service health.
- 🔗 [ER Diagram](docs/KMRL_IDMS%20ER%20Diagram.jpeg) — Entity-Relationship diagram representing the relational database structure and relationships.
---

## 🏗️ System Topology Overview

```mermaid
graph TD
    User([👤 Client Browser / SPA]) -->|HTTP / REST Traffic| ReactApp[⚛️ React 19 + Vite Frontend :3000]
    
    subgraph Spring Cloud Microservices Tier
        ReactApp -->|REST Requests + JWT| Gateway[🚪 Spring Cloud API Gateway :8080]
        Gateway -->|Service Lookup| Eureka[📡 Eureka Service Registry :8761]
        
        Gateway -->|/api/auth/*| AuthSvc[🔐 Auth Service :8081]
        Gateway -->|/api/documents/*| DocSvc[📄 Document Service :8082]
        Gateway -->|/api/workflows/*| WorkSvc[⏱️ Workflow Service :8083]
        Gateway -->|/api/geospatial/*| GeoSvc[🗺️ Geospatial Service :8084]
        Gateway -->|/api/compliance/*| CompSvc[🛡️ Compliance Service :8085]
        Gateway -->|/api/dashboard/*| DashSvc[📊 Dashboard Service :8086]
    end
    
    subgraph Python AI / ML Processing Service
        DocSvc -->|REST /ai/*| FastApiAI[🐍 Python FastAPI AI Service :8000]
        FastApiAI -->|Multimodal OCR| PyTesseract[📄 OCR Engine]
        FastApiAI -->|NLP Classification| NlpClassifier[🧠 NLP Classifier]
        FastApiAI -->|Vector Search| FaissCosine[📐 Cosine Similarity & Embeddings]
        FastApiAI -->|Geospatial Matching| DijkstraRoute[📍 Dijkstra Route Optimizer]
    end
    
    subgraph Database Persistence Layer
        AuthSvc & WorkSvc & GeoSvc & CompSvc & DashSvc --->|Relational Data| MySQL[(🗄️ MySQL 8.0 kmrl_idms)]
        DocSvc & FastApiAI --->|Document Content & Embeddings| MongoDB[(🍃 MongoDB kmrl_documents)]
    end
```

---

## ✨ Key System Capabilities

- **Real Multimodal OCR & Vision**: Text extraction from PDFs, blueprints, PNG/JPEG images using PyTesseract & Gemini perception engines.
- **NLP Auto-Classification**: Dynamic document tagging across departments (`Civil Works`, `Operations & Safety`, `Finance & Legal`, `Signaling & Telecom`), file categories, sensitivity levels, and executive summary generation.
- **Dense Vector Embedding Search**: 384/3072-dimensional vector embeddings with Cosine Similarity, pre-filtered by the user's department authorization scope.
- **GIS Entity NER & Interactive Maps**: Parsing Kerala survey numbers (*Sur-210/4C*), revenue villages, and metro stations (*Aluva*, *Edapally*, *Muttom*, *Pettah*) rendered on interactive Leaflet maps.
- **Dijkstra Metro Route Optimizer**: Computes shortest station transit path, total travel distance in km, transit time, and hop counts across the KMRL metro network.
- **SLA-Driven Approval Workflows**: Multi-stage approval routing with dynamic SLA countdown timers, priority escalations, and approver sign-off logs.
- **Statutory Compliance & Security Audit**: Tracking CMRS safety certificates, KPCB environmental clearances, fire safety filings, and immutable security audit trails.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, Lucide React | Modern SPA User Interface |
| **GIS & Analytics** | Leaflet 1.9, Recharts 2.12 | Interactive Map & Data Visualization |
| **Backend Core** | Java 17, Spring Boot 3.2, Spring Security | Microservices Core & BCrypt Security |
| **Service Mesh** | Spring Cloud Gateway, Netflix Eureka | API Proxy Routing & Service Discovery |
| **AI Microservice** | Python 3.10+, FastAPI, NumPy, PyTesseract | Multimodal OCR, NLP, Vectors & Dijkstra |
| **Databases** | MySQL 8.0, MongoDB 6.0+ | Polyglot Relational & Document Vector Store |

---

## 🔐 Role-Based Access Control (RBAC) Summary

| Portal Module | Admin | Manager | Compliance Officer | Dept Officer | User |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard Metrics** (`dashboard`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multimodal Document Upload & OCR** (`documents`) | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Document Repository Access** (`my-documents`) | ✅ All | ✅ Own Dept. | ✅ Authorized | ✅ Own Dept. | ✅ Authorized |
| **3072-dim Semantic Vector Search** (`search`) | ✅ All | ✅ Own Dept. | ✅ Authorized | ✅ Own Dept. | ✅ Authorized |
| **GIS Map & Dijkstra Route Optimizer** (`geospatial`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SLA Workflow Review & Approval** (`workflows`) | ✅ | ✅ | ❌ | ✅ Assigned | ❌ |
| **Compliance Management** (`compliance`) | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Immutable System Audit Trail** (`audit`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| **User & Account Management** (`admin-users`) | ✅ | ❌ | ❌ | ❌ | ❌ |
| **System Configuration** (`microservices`) | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🚀 Quick Execution

Run the complete system using the master script:

```bash
chmod +x ./run-all.sh
./run-all.sh
```

Or view the [Setup & Run Guide](./docs/SETUP_RUN_GUIDE.md) for detailed VS Code task runner instructions.
---

## 🔗 Entity-Relationship Diagram

The ER diagram represents the entities, attributes, and relationships within the KMRL IDMS database.

![KMRL IDMS ER Diagram](docs/KMRL_IDMS%20ER%20Diagram.jpeg)

---
