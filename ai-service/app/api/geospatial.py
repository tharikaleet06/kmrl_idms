from fastapi import APIRouter
from app.models.schemas import GeospatialMatchRequest
from app.services.geospatial_service import geospatial_service

router = APIRouter()

@router.post("/geospatial/match")
def match_geospatial(req: GeospatialMatchRequest):
    result = geospatial_service.match_location(req.text, req.address)
    return {
        "success": True,
        "match": result,
        "mode": "PYTHON_FASTAPI_GEOSPATIAL"
    }
