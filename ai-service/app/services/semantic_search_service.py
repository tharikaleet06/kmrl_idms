import numpy as np
from app.services.embedding_service import embedding_service

class SemanticSearchService:
    def search(self, query: str, documents: list, user_role: str = "", user_department: str = "", user_name: str = "") -> list:
        if not documents:
            return []

        # Enforce department & role authorization filter BEFORE calculating vector similarities
        role_upper = (user_role or "").upper()
        target_dept = (user_department or "").strip().lower()
        target_user = (user_name or "").strip().lower()

        authorized_docs = []
        for doc in documents:
            doc_dept = str(doc.get("department", "")).strip().lower()
            doc_uploader = str(doc.get("uploadedBy", doc.get("uploader", ""))).strip().lower()

            # Admin, Manager, and Compliance Officer can view documents across departments
            if "ADMIN" in role_upper or "MANAGER" in role_upper or "COMPLIANCE" in role_upper or not target_dept or target_dept == "all":
                authorized_docs.append(doc)
            elif doc_dept == target_dept or (target_user and doc_uploader == target_user):
                authorized_docs.append(doc)

        query_vec = np.array(embedding_service.generate_embedding(query))
        ranked_docs = []

        for doc in authorized_docs:
            doc_text = f"{doc.get('title', '')} {doc.get('summary', '')} {doc.get('department', '')}"
            doc_vec = np.array(embedding_service.generate_embedding(doc_text))

            # Cosine similarity score calculation
            dot_prod = np.dot(query_vec, doc_vec)
            norm_q = np.linalg.norm(query_vec)
            norm_d = np.linalg.norm(doc_vec)
            score = float(dot_prod / (norm_q * norm_d + 1e-9))

            relevance = round(max(50.0, min(99.8, (score + 1.0) * 48.0)), 1)
            doc_copy = dict(doc)
            doc_copy["relevanceScore"] = relevance
            ranked_docs.append(doc_copy)

        ranked_docs.sort(key=lambda x: x["relevanceScore"], reverse=True)
        return ranked_docs

semantic_search_service = SemanticSearchService()
