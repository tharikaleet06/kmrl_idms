from fastapi import APIRouter
from app.models.schemas import OcrRequest, OcrResponse
from app.services.ocr_service import ocr_service

router = APIRouter()

@router.post("/ocr", response_model=OcrResponse)

def run_ocr(req: OcrRequest):
    data = req.base64Data or req.fileData or ""
    res = ocr_service.process_ocr(data, req.fileName)
    return OcrResponse(
        success=True,
        text=res.get("text", ""),
        confidence=res.get("confidence", 0.95),
        mode="PYTHON_FASTAPI_AI"
    )
