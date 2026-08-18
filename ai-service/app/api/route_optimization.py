from fastapi import APIRouter
from app.models.schemas import RouteOptimizeRequest
from app.services.route_service import route_service

router = APIRouter()

@router.post("/route/optimize")
def optimize_route(req: RouteOptimizeRequest):
    res = route_service.optimize_route(req.origin, req.destination, req.waypoints)
    return {
        "success": True,
        "route": res,
        "mode": "PYTHON_FASTAPI_NETWORKX"
    }
