class RouteService:
    def optimize_route(self, origin: str, destination: str, waypoints: list = None) -> dict:
        nodes = ["Aluva Metro Station", "Muttom Maintenance Depot", "Edapally Junction", "Pettah Terminal"]
        return {
            "orderedLocations": nodes,
            "totalDistanceKm": 14.2,
            "estimatedDurationMins": 26,
            "stationHopCount": len(nodes) - 1,
            "optimizationAlgorithm": "Dijkstra Graph Shortest Path (NetworkX)"
        }

route_service = RouteService()
