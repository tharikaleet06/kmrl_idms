package com.kmrl.geospatial.controller;

import com.kmrl.geospatial.entity.MetroLocation;
import com.kmrl.geospatial.service.GeospatialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/geospatial")
@CrossOrigin(origins = "*")
public class GeospatialController {

    private final GeospatialService geospatialService;

    @Autowired
    public GeospatialController(GeospatialService geospatialService) {
        this.geospatialService = geospatialService;
    }

    @GetMapping({"/locations", "/stations"})
    public ResponseEntity<Map<String, Object>> getLocations() {
        List<MetroLocation> locations = geospatialService.getAllLocations();
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("locations", locations);
        res.put("stations", locations);
        return ResponseEntity.ok(res);
    }

    @PostMapping({"/locations", "/stations"})
    public ResponseEntity<Map<String, Object>> createLocation(@RequestBody MetroLocation location) {
        MetroLocation saved = geospatialService.saveLocation(location);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("location", saved);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/parse-ocr")
    public ResponseEntity<Map<String, Object>> parseOcrAddress(@RequestBody Map<String, String> body) {
        String text = body.getOrDefault("text", "");
        Map<String, Object> parsed = geospatialService.parseOcrAddress(text);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("result", parsed);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/route-optimize")
    public ResponseEntity<Map<String, Object>> routeOptimize(@RequestBody Map<String, String> body) {
        String fromStationId = body.get("fromStationId");
        String toStationId = body.get("toStationId");
        Map<String, Object> optimized = geospatialService.optimizeRoute(fromStationId, toStationId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("result", optimized);
        return ResponseEntity.ok(res);
    }
}
