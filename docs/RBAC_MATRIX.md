# 🔐 Role-Based Access Control (RBAC) Matrix & Authorization Policy

The KMRL-IDMS platform enforces strict security policies at both the **React UI layer** and the **Spring Boot / JPA repository query layer**.

---

## 📊 RBAC Permissions Matrix

| Portal Module | Admin | Manager | Compliance Officer | Dept Officer | User |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Dashboard Metrics** (`/dashboard`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Multimodal Document Upload & OCR** (`/documents/upload`) | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Document Repository Access** (`/my-documents`) | ✅ All | ✅ Own Dept. | ✅ Authorized | ✅ Own Dept. | ✅ Authorized |
| **3072-Dim Semantic Vector Search** (`/search`) | ✅ All | ✅ Own Dept. | ✅ Authorized | ✅ Own Dept. | ✅ Authorized |
| **GIS Map & Dijkstra Route Optimizer** (`/geospatial`) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SLA Workflow Review & Approval** (`/workflows`) | ✅ | ✅ | ❌ | ✅ Assigned | ❌ |
| **Compliance Management** (`/compliance-ledger`) | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Immutable System Audit Trail** (`/audit-trail`) | ✅ | ✅ | ✅ | ❌ | ❌ |
| **User & Account Management** (`/admin/users`) | ✅ | ❌ | ❌ | ❌ | ❌ |
| **System Configuration** (`/system/eureka`) | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🛡️ Database & Repository-Level Scoping Rules

Authorization is enforced directly inside MySQL JPA database queries:

1. **`ADMIN`**:
   - Authorized to view, update, and manage all documents across every department in KMRL.
2. **`MANAGER`**:
   - Scoped to view documents belonging to their assigned department(s) or assigned workflows.
3. **`DEPARTMENT_OFFICER`**:
   - Queries database via `findByDepartmentOrUserAccess(userDept, userName)`. Returns documents belonging strictly to their assigned department or created by them.
4. **`COMPLIANCE_OFFICER`**:
   - Scoped to compliance records, CMRS safety clearances, environmental filings, and authorized regulatory documents.
5. **`USER`**:
   - Can upload new documents and view authorized documents created by or assigned to them. Cannot review or approve workflow stages.

---

## 🔗 Related Documentation
- 🏠 [Root README](../README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🗄️ [Database Schema](DATABASE_SCHEMA.md)
- 🐍 [Python AI Service Guide](AI_SERVICE_GUIDE.md)
- 🧠 [AI Model Documentation](AI_MODEL_DOCUMENTATION.md)
- 🚀 [Setup & Run Guide](SETUP_RUN_GUIDE.md)
