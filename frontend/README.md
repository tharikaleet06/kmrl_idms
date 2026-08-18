# ⚛️ KMRL-IDMS React 19 Frontend SPA

Single Page Application (SPA) for the **KMRL Intelligent Document Management System (IDMS)** built with **React 19**, **Vite 6**, and **Tailwind CSS 4**.

---

## 🛠️ Tech Stack & Libraries

- **Core UI**: React 19, Vite 6, Tailwind CSS 4
- **Icons**: Lucide React
- **Analytics & GIS**: Recharts 2.12, Leaflet 1.9
- **HTTP Client**: Axios with JWT Request Interceptor

---

## 📁 Component Directory Structure

```text
frontend/src/
├── App.jsx                       # Root React SPA container & layout state
├── main.jsx                      # Vite entry point
components/
├── DashboardView.jsx             # Executive KPI Analytics & Recent Classified Documents
├── DocumentUploadView.jsx        # Multimodal Intake, OCR & AI Analysis
├── MyDocumentsView.jsx           # Repository Data Table with Department Scoping
├── SemanticSearchView.jsx        # 3072-Dim Vector Search Engine
├── GeospatialOcrView.jsx         # Interactive Leaflet Map & Dijkstra Route Optimizer
├── WorkflowApprovalView.jsx      # SLA 3-Stage Approval Chain Sign-offs
├── ComplianceView.jsx            # Statutory Clearance Ledger
├── AuditTrailView.jsx            # Immutable Audit Trail Logs
├── MicroservicesConsoleView.jsx  # Eureka Cluster Telemetry
├── AdminUsersView.jsx            # User & Role Account Management
└── DocumentDetailModal.jsx       # Version Control & Inspection Drawer
services/
└── api.js                        # Central Axios HTTP client & API Gateway methods
utils/
└── roleAccess.js                 # Role Permissions Matrix & Route Guard Policy
```

---

## 🚀 Running & Building

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Development Server (`:3000`)
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 📖 Complete Documentation
- 🔐 [RBAC Matrix](../docs/RBAC_MATRIX.md)
- 🚀 [Setup & Run Guide](../docs/SETUP_RUN_GUIDE.md)
