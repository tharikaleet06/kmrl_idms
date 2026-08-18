# ☕ KMRL-IDMS Spring Boot Microservices Backend

Parent Maven module containing the 8 Spring Cloud microservices powering the **KMRL Intelligent Document Management System (KMRL-IDMS)**.

---

## 🛠️ Stack & Technologies

- **Java Version**: JDK 17
- **Framework**: Spring Boot 3.2.3
- **Cloud Architecture**: Spring Cloud 2023.0.0 (Gateway & Netflix Eureka)
- **Security**: Spring Security & BCrypt Password Encoder
- **Persistence**: Spring Data JPA & MySQL 8.0 Driver

---

## 🔀 Microservices Cluster Overview

| Service Directory | Service Name | Port | Database | Primary Responsibility |
| :--- | :--- | :---: | :--- | :--- |
| `service-registry/` | **Service Registry (Eureka)** | `:8761` | N/A | Service discovery & heartbeat dashboard |
| `api-gateway/` | **API Gateway** | `:8080` | N/A | Central API proxy, CORS policy enforcement & JWT routing |
| `auth-service/` | **Auth Service** | `:8081` | MySQL (`kmrl_idms`) | BCrypt security, JWT issuance & user account RBAC management |
| `document-service/` | **Document Service** | `:8082` | MySQL & MongoDB | Document metadata, versioning, JPA department authorization & AI delegation |
| `workflow-service/` | **Workflow Service** | `:8083` | MySQL (`kmrl_idms`) | SLA calculation, 3-stage approval routing & deadline tracking |
| `geospatial-service/` | **Geospatial Service** | `:8084` | MySQL (`kmrl_idms`) | GIS station mapping, Kerala survey number NER & route calculations |
| `compliance-service/` | **Compliance Service** | `:8085` | MySQL (`kmrl_idms`) | CMRS safety clearances, KPCB statutory audits & health scores |
| `dashboard-service/` | **Dashboard Service** | `:8086` | MySQL & MongoDB | Real-time KPI aggregation & immutable audit trail logging |

---

## 🚀 Building & Compilation

Compile all 8 microservices from the `backend/` parent folder:

```bash
mvn clean compile
```

Or package target JARs:

```bash
mvn clean package -DskipTests
```

---

## 📖 Complete Documentation
- 🏗️ [Architecture Guide](../docs/ARCHITECTURE.md)
- 🔐 [RBAC Matrix](../docs/RBAC_MATRIX.md)
- 🗄️ [Database Schema](../docs/DATABASE_SCHEMA.md)
