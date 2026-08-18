from fastapi import APIRouter
from app.models.schemas import EmbedRequest, EmbedResponse, SearchRequest
from app.services.embedding_service import embedding_service
from app.services.semantic_search_service import semantic_search_service

router = APIRouter()

@router.post("/embed", response_model=EmbedResponse)
def embed_text(req: EmbedRequest):
    vec = embedding_service.generate_embedding(req.text)
    return EmbedResponse(
        success=True,
        embedding=vec,
        dimension=len(vec)
    )

@router.post("/search")
def search_semantic(req: SearchRequest):
    docs = req.documents or []
    ranked = semantic_search_service.search(
        query=req.query,
        documents=docs,
        user_role=req.user_role or "",
        user_department=req.user_department or "",
        user_name=req.user_name or ""
    )
    return {
        "success": True,
        "results": ranked,
        "mode": "PYTHON_FASTAPI_FAISS_COSINE"
    }
