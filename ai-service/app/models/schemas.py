from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class OcrRequest(BaseModel):
    base64Data: Optional[str] = None
    fileData: Optional[str] = None
    fileName: Optional[str] = "KMRL_Document.pdf"
    fileType: Optional[str] = "application/pdf"

class OcrResponse(BaseModel):
    success: bool = True
    text: str
    confidence: float = 0.95
    mode: str = "PYTHON_AI_SERVICE"

class ClassifyRequest(BaseModel):
    title: Optional[str] = ""
    rawText: Optional[str] = ""
    text: Optional[str] = ""
    fileName: Optional[str] = ""

class ClassifyResponse(BaseModel):
    success: bool = True
    documentType: str
    department: str
    sensitivity: str
    confidence: float
    summary: str
    mode: str = "PYTHON_AI_SERVICE"

class EntityExtractRequest(BaseModel):
    text: str

class EntityExtractResponse(BaseModel):
    success: bool = True
    entities: Dict[str, Any]

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    success: bool = True
    embedding: List[float]
    dimension: int

class SearchRequest(BaseModel):
    query: str
    documents: Optional[List[Dict[str, Any]]] = []
    user_role: Optional[str] = ""
    user_department: Optional[str] = ""
    user_name: Optional[str] = ""

class GeospatialMatchRequest(BaseModel):
    text: Optional[str] = ""
    address: Optional[str] = ""

class RouteOptimizeRequest(BaseModel):
    origin: Optional[str] = "Aluva Metro Station"
    destination: Optional[str] = "Pettah Terminal"
    waypoints: Optional[List[str]] = []
