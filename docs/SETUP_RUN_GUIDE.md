# 🚀 KMRL-IDMS Setup & Run Guide

Guide to starting all services (Databases, Python FastAPI AI Service, Spring Boot Microservices, and React 19 Frontend) for local execution or VS Code development.

---

## 📋 Prerequisites

1. **Java 17 JDK** (`java -version`)
2. **Maven 3.8+** (`mvn -version`)
3. **Node.js 18+ & npm** (`node -v`, `npm -v`)
4. **Python 3.10+ & pip** (`python3 --version`)
5. **MySQL 8.0** (`localhost:3306`)
6. **MongoDB 6.0+** (`localhost:27017`)

---

## 🛠️ Step 1: Run All Services via Terminal Script

Run the automated master runner:

```bash
chmod +x ./run-all.sh
./run-all.sh
```

This script performs health checks on MySQL and MongoDB, installs Python dependencies, starts Python FastAPI on port `:8000`, compiles Spring Boot microservices, and starts Vite React SPA on port `:3000`.

---

## 💻 Step 2: Running via VS Code Tasks

Open the project in VS Code and press `Cmd+Shift+P` (or `Ctrl+Shift+P`), then select **`Tasks: Run Task`**:

1. **`Start Python FastAPI AI Service`** $\to$ Launches `uvicorn` on `:8000`.
2. **`Compile Spring Boot Backend`** $\to$ Runs `mvn clean compile`.
3. **`Start React Frontend`** $\to$ Runs `npm run dev` on `:3000`.

---

## 🌐 Service Ports & Health Check Endpoints

| Component | URL / Port | Health Endpoint |
| :--- | :--- | :--- |
| **React Frontend SPA** | `http://localhost:3000` | N/A |
| **Spring Cloud API Gateway** | `http://localhost:8080` | `http://localhost:8080/actuator/health` |
| **Eureka Service Registry** | `http://localhost:8761` | `http://localhost:8761` |
| **Auth Service** | `http://localhost:8081` | `http://localhost:8081/actuator/health` |
| **Document Service** | `http://localhost:8082` | `http://localhost:8082/actuator/health` |
| **Workflow Service** | `http://localhost:8083` | `http://localhost:8083/actuator/health` |
| **Geospatial Service** | `http://localhost:8084` | `http://localhost:8084/actuator/health` |
| **Compliance Service** | `http://localhost:8085` | `http://localhost:8085/actuator/health` |
| **Dashboard Service** | `http://localhost:8086` | `http://localhost:8086/actuator/health` |
| **Python FastAPI AI Service** | `http://localhost:8000` | `http://localhost:8000/health` |

---

## 🔗 Related Documentation
- 🏠 [Root README](../README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🔐 [RBAC Matrix](RBAC_MATRIX.md)
- 🗄️ [Database Schema](DATABASE_SCHEMA.md)
- 🐍 [Python AI Service Guide](AI_SERVICE_GUIDE.md)
- 🧠 [AI Model Documentation](AI_MODEL_DOCUMENTATION.md)
