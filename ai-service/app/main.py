from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import ocr, classification, semantic_search, geospatial, route_optimization

app = FastAPI(
    title="KMRL Intelligent Document Management System — Python AI Service",
    description="Python FastAPI Microservice for Multimodal OCR, NLP Classification, Entity Extraction, Vector Embeddings & Geospatial Route Optimization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router, prefix="/ai", tags=["OCR"])
app.include_router(classification.router, prefix="/ai", tags=["Classification & Entities"])
app.include_router(semantic_search.router, prefix="/ai", tags=["Semantic Search & Embeddings"])
app.include_router(geospatial.router, prefix="/ai", tags=["Geospatial"])
app.include_router(route_optimization.router, prefix="/ai", tags=["Route Optimization"])

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "kmrl-python-ai-service",
        "port": settings.PORT,
        "provider": settings.AI_PROVIDER,
        "geminiKeyConfigured": bool(settings.AI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
