from fastapi import APIRouter
from app.models.schemas import ClassifyRequest, ClassifyResponse, EntityExtractRequest, EntityExtractResponse
from app.services.classification_service import classification_service
from app.services.entity_extraction_service import entity_extraction_service

router = APIRouter()

@router.post("/classify", response_model=ClassifyResponse)
def classify_document(req: ClassifyRequest):
    text_content = req.rawText or req.text or req.title or ""
    res = classification_service.classify_document(req.title or "", text_content)
    return ClassifyResponse(
        success=True,
        documentType=res.get("documentType", "Technical Specification"),
        department=res.get("department", "Civil Works"),
        sensitivity=res.get("sensitivity", "Restricted"),
        confidence=res.get("confidence", 0.94),
        summary=res.get("summary", ""),
        mode="PYTHON_FASTAPI_AI"
    )

@router.post("/extract-entities", response_model=EntityExtractResponse)
def extract_entities(req: EntityExtractRequest):
    entities = entity_extraction_service.extract_entities(req.text)
    return EntityExtractResponse(
        success=True,
        entities=entities
    )
