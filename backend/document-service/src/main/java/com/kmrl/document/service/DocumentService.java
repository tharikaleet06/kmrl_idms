package com.kmrl.document.service;

import com.kmrl.document.entity.DocumentEntity;
import com.kmrl.document.repository.DocumentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @PostConstruct
    public void seedDocuments() {
        if (documentRepository.count() == 0) {
            String apiKey = System.getenv("GEMINI_API_KEY");
            List<Double> seedVec = Collections.emptyList();
            if (apiKey != null && !apiKey.trim().isEmpty()) {
                try {
                    seedVec = generateEmbedding("KMRL Seed Document");
                } catch (Exception ignored) {}
            }

            DocumentEntity d1 = new DocumentEntity();
            d1.setId("KMRL-CIVIL-2026-1001");
            d1.setTitle("Phase II Water Metro Terminal Civil Clearance Report");
            d1.setDocType("Technical Specification");
            d1.setDepartment("Civil Works");
            d1.setUploader("Department Officer");
            d1.setUploadedBy("Department Officer");
            d1.setStatus("Approved");
            d1.setSensitivity("Restricted");
            d1.setVersion("v2.1");
            d1.setCreatedAt("2026-08-01");
            d1.setUploadedAt("2026-08-01T10:00:00Z");
            d1.setSummary("Geospatial and structural foundation feasibility report for Vyttila Water Metro terminal expansion.");
            d1.setRawText("Geospatial and structural foundation feasibility report for Vyttila Water Metro terminal expansion.");
            d1.setTags("water-metro, civil, survey");
            d1.setFileName("Water-Metro-Terminal-Report.pdf");
            d1.setFileSize("4.2 MB");
            d1.setFileType("PDF Document");
            d1.setConfidenceScore(98.6);
            d1.setEmbedding(seedVec);
            documentRepository.save(d1);

            DocumentEntity d2 = new DocumentEntity();
            d2.setId("KMRL-SAF-2026-1002");
            d2.setTitle("Statutory CMRS Track Inspection Clearance");
            d2.setDocType("Safety Certificate");
            d2.setDepartment("Operations & Safety");
            d2.setUploader("Compliance Officer");
            d2.setUploadedBy("Compliance Officer");
            d2.setStatus("In Review");
            d2.setSensitivity("Confidential");
            d2.setVersion("v1.0");
            d2.setCreatedAt("2026-08-05");
            d2.setUploadedAt("2026-08-05T14:30:00Z");
            d2.setSummary("Commissioner of Metro Railway Safety clearance for Phase 1B Pettah-SN Junction line extension.");
            d2.setRawText("Commissioner of Metro Railway Safety clearance for Phase 1B Pettah-SN Junction line extension.");
            d2.setTags("cmrs, safety, clearance");
            d2.setFileName("CMRS-Safety-Inspection.pdf");
            d2.setFileSize("2.8 MB");
            d2.setFileType("PDF Document");
            d2.setConfidenceScore(99.1);
            d2.setEmbedding(seedVec);
            documentRepository.save(d2);

            DocumentEntity d3 = new DocumentEntity();
            d3.setId("KMRL-FIN-2026-1003");
            d3.setTitle("Rolling Stock Maintenance Audit Q2 2026");
            d3.setDocType("Financial Audit Report");
            d3.setDepartment("Finance & Legal");
            d3.setUploader("Operations Manager");
            d3.setUploadedBy("Operations Manager");
            d3.setStatus("In Progress");
            d3.setSensitivity("Internal");
            d3.setVersion("v1.2");
            d3.setCreatedAt("2026-08-08");
            d3.setUploadedAt("2026-08-08T09:15:00Z");
            d3.setSummary("Muttom Depot trainset periodic overhaul and component inspection expenditure analysis.");
            d3.setRawText("Muttom Depot trainset periodic overhaul and component inspection expenditure analysis.");
            d3.setTags("rolling-stock, audit, finance");
            d3.setFileName("Rolling-Stock-Audit-Q2.pdf");
            d3.setFileSize("3.1 MB");
            d3.setFileType("PDF Document");
            d3.setConfidenceScore(97.4);
            d3.setEmbedding(seedVec);
            documentRepository.save(d3);

            DocumentEntity d4 = new DocumentEntity();
            d4.setId("KMRL-SIG-2026-1004");
            d4.setTitle("CBTC Signaling & Automatic Train Control System Validation Log");
            d4.setDocType("Technical Specification");
            d4.setDepartment("Signaling & Telecom");
            d4.setUploader("Department Officer");
            d4.setUploadedBy("Department Officer");
            d4.setStatus("Uploaded");
            d4.setSensitivity("Restricted");
            d4.setVersion("v1.0");
            d4.setCreatedAt("2026-08-10");
            d4.setUploadedAt("2026-08-10T11:20:00Z");
            d4.setSummary("Communication-Based Train Control signaling interlock and telemetry verification test results.");
            d4.setRawText("Communication-Based Train Control signaling interlock and telemetry verification test results.");
            d4.setTags("cbtc, signaling, telecom");
            d4.setFileName("CBTC-Signaling-Validation.pdf");
            d4.setFileSize("5.0 MB");
            d4.setFileType("PDF Document");
            d4.setConfidenceScore(99.4);
            d4.setEmbedding(seedVec);
            documentRepository.save(d4);

            DocumentEntity d5 = new DocumentEntity();
            d5.setId("KMRL-ELE-2026-1005");
            d5.setTitle("33kV Traction Sub-Station Transformer Safety Audit");
            d5.setDocType("Statutory Regulatory File");
            d5.setDepartment("Electrical & Traction");
            d5.setUploader("Compliance Officer");
            d5.setUploadedBy("Compliance Officer");
            d5.setStatus("SLA Breached");
            d5.setSensitivity("Confidential");
            d5.setVersion("v1.1");
            d5.setCreatedAt("2026-08-02");
            d5.setUploadedAt("2026-08-02T16:45:00Z");
            d5.setSummary("High voltage auxiliary transformer oil insulation test report for Water Metro jetty charging stations.");
            d5.setRawText("High voltage auxiliary transformer oil insulation test report for Water Metro jetty charging stations.");
            d5.setTags("transformer, traction, electrical");
            d5.setFileName("Substation-Safety-Audit.pdf");
            d5.setFileSize("3.8 MB");
            d5.setFileType("PDF Document");
            d5.setConfidenceScore(96.8);
            d5.setEmbedding(seedVec);
            documentRepository.save(d5);

            DocumentEntity d6 = new DocumentEntity();
            d6.setId("KMRL-SAF-2026-1006");
            d6.setTitle("Monsoon Disaster Management & Emergency Response Protocol");
            d6.setDocType("Safety Certificate");
            d6.setDepartment("Safety & Security");
            d6.setUploader("Operations Manager");
            d6.setUploadedBy("Operations Manager");
            d6.setStatus("Approved");
            d6.setSensitivity("Public");
            d6.setVersion("v3.0");
            d6.setCreatedAt("2026-08-04");
            d6.setUploadedAt("2026-08-04T08:00:00Z");
            d6.setSummary("Comprehensive flood emergency evacuation guidelines and station high-water barrier protocols.");
            d6.setRawText("Comprehensive flood emergency evacuation guidelines and station high-water barrier protocols.");
            d6.setTags("monsoon, safety, emergency");
            d6.setFileName("Monsoon-Emergency-Protocol.pdf");
            d6.setFileSize("2.1 MB");
            d6.setFileType("PDF Document");
            d6.setConfidenceScore(98.9);
            d6.setEmbedding(seedVec);
            documentRepository.save(d6);

            DocumentEntity d7 = new DocumentEntity();
            d7.setId("KMRL-CIVIL-2026-1007");
            d7.setTitle("Kakkanad Extension Viaduct Elastomeric Bearing Inspection");
            d7.setDocType("Technical Specification");
            d7.setDepartment("Civil Works");
            d7.setUploader("Department Officer");
            d7.setUploadedBy("Department Officer");
            d7.setStatus("Pending Approval");
            d7.setSensitivity("Internal");
            d7.setVersion("v1.0");
            d7.setCreatedAt("2026-08-09");
            d7.setUploadedAt("2026-08-09T12:00:00Z");
            d7.setSummary("Ultrasonic non-destructive foundation testing for Phase-II viaduct pier bearings.");
            d7.setRawText("Ultrasonic non-destructive foundation testing for Phase-II viaduct pier bearings.");
            d7.setTags("viaduct, bearing, civil");
            d7.setFileName("Viaduct-Bearing-Inspection.pdf");
            d7.setFileSize("4.5 MB");
            d7.setFileType("PDF Document");
            d7.setConfidenceScore(97.9);
            d7.setEmbedding(seedVec);
            documentRepository.save(d7);
        }
    }

    public List<DocumentEntity> getAllDocuments() {
        return documentRepository.findAll();
    }

    public DocumentEntity saveDocument(DocumentEntity doc) {
        if (doc.getId() == null || doc.getId().isEmpty()) {
            doc.setId("KMRL-DOC-" + (1000 + (int)(Math.random() * 9000)));
        }
        if (doc.getCreatedAt() == null || doc.getCreatedAt().isEmpty()) {
            doc.setCreatedAt(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        if (doc.getEmbedding() == null || doc.getEmbedding().isEmpty()) {
            String text = (doc.getTitle() != null ? doc.getTitle() : "") + " " + (doc.getSummary() != null ? doc.getSummary() : "");
            try {
                doc.setEmbedding(generateEmbedding(text));
            } catch (Exception e) {
                doc.setEmbedding(Collections.emptyList());
            }
        }

        // Calculate dynamic SLA Breach Probability Percentage
        double baseRisk = 8.0;
        if ("Urgent".equalsIgnoreCase(doc.getPriority()) || "Confidential".equalsIgnoreCase(doc.getSensitivity())) {
            baseRisk += 24.5;
        } else if ("High".equalsIgnoreCase(doc.getPriority()) || "Restricted".equalsIgnoreCase(doc.getSensitivity())) {
            baseRisk += 14.0;
        } else {
            baseRisk += 4.5;
        }

        if ("Safety Certificate".equalsIgnoreCase(doc.getDocType()) || "Statutory Compliance".equalsIgnoreCase(doc.getCategory())) {
            baseRisk += 12.0;
        } else if ("Contract Agreement".equalsIgnoreCase(doc.getDocType())) {
            baseRisk += 8.5;
        }

        long totalCount = documentRepository.count();
        baseRisk += Math.min(18.0, totalCount * 1.2);
        baseRisk = Math.min(96.5, Math.max(4.2, baseRisk));

        String formattedRisk = String.format(java.util.Locale.US, "%.1f%%", baseRisk);
        doc.setSlaBreachRiskPercentage(formattedRisk);

        if (baseRisk >= 35.0) {
            doc.setSlaRiskLevel("High SLA Risk");
        } else if (baseRisk >= 20.0) {
            doc.setSlaRiskLevel("Moderate Risk");
        } else {
            doc.setSlaRiskLevel("Low Risk");
        }

        return documentRepository.save(doc);
    }

    public Optional<DocumentEntity> getDocumentById(String id) {
        return documentRepository.findById(id);
    }

    public boolean deleteDocument(String id) {
        Optional<DocumentEntity> opt = documentRepository.findById(id);
        if (opt.isPresent()) {
            documentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Map<String, Object> classifyNlp(String title, String rawText, String fileData, String fileType, String fileName) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Gemini AI configuration is missing or invalid.");
        }

        String ocrText = rawText;
        if (fileData != null && fileData.contains("base64,")) {
            try {
                String base64Content = fileData.split("base64,")[1];
                String mime = "image/png";
                if ((fileType != null && fileType.contains("pdf")) || (fileName != null && fileName.endsWith(".pdf"))) {
                    mime = "application/pdf";
                } else if ((fileType != null && (fileType.contains("jpeg") || fileType.contains("jpg"))) || (fileName != null && (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")))) {
                    mime = "image/jpeg";
                }

                String ocrPrompt = "{\"contents\": [{\"parts\": [{\"inline_data\": {\"mime_type\": \"" + mime + "\", \"data\": \"" + base64Content + "\"}}, {\"text\": \"Perform OCR on this document file. Extract all text content verbatim. Return ONLY the extracted text.\"}]}]}";

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(ocrPrompt))
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() != 200) {
                    throw new RuntimeException("OCR processing error: Gemini API returned status code " + response.statusCode());
                }
                ocrText = extractTextFromGeminiResponse(response.body());
                if (ocrText == null || ocrText.trim().isEmpty()) {
                    throw new RuntimeException("OCR processing error: Gemini failed to extract text from document.");
                }
            } catch (Exception e) {
                if (e instanceof RuntimeException && e.getMessage().startsWith("OCR processing error")) {
                    throw (RuntimeException) e;
                }
                throw new RuntimeException("OCR processing error: " + e.getMessage(), e);
            }
        }

        if (ocrText == null || ocrText.trim().isEmpty()) {
            throw new RuntimeException("OCR processing error: No document text content available for classification.");
        }

        try {
            String promptText = "Analyze this KMRL document and classify it into valid JSON format with keys: department (one of: Civil Works, Operations & Safety, Finance & Legal, Signaling & Telecom), category (one of: Technical Specification, Safety Certificate, Financial Audit Report, Statutory Regulatory File), sensitivity (one of: Internal, Restricted, Confidential), confidenceScore (number between 80.0 and 100.0), summary (2 sentence executive summary), tags (array of string tags). Return ONLY raw JSON without markdown formatting or code fences. Title: " 
                    + (title != null ? title.replace("\"", "\\\"") : "") 
                    + ". Content: " + ocrText.replace("\"", "\\\"").replace("\n", " ");

            String promptJson = "{\"contents\": [{\"parts\": [{\"text\": \"" + promptText + "\"}]}]}";

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(promptJson))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new RuntimeException("NLP classification error: Gemini API returned status code " + response.statusCode());
            }

            String geminiText = extractTextFromGeminiResponse(response.body());
            if (geminiText == null || geminiText.trim().isEmpty()) {
                throw new RuntimeException("NLP classification error: Gemini generated empty output.");
            }

            Map<String, Object> result = parseGeminiNlpJson(geminiText, ocrText);
            result.put("ocrText", ocrText);
            return result;
        } catch (Exception e) {
            if (e instanceof RuntimeException && (e.getMessage().startsWith("NLP classification error") || e.getMessage().startsWith("Gemini AI") || e.getMessage().startsWith("OCR processing error"))) {
                throw (RuntimeException) e;
            }
            throw new RuntimeException("NLP classification error: " + e.getMessage(), e);
        }
    }

    public List<Double> generateEmbedding(String text) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Gemini AI configuration is missing or invalid.");
        }
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Text for embedding generation cannot be empty.");
        }

        try {
            String reqJson = "{\"model\": \"models/text-embedding-004\", \"content\": {\"parts\": [{\"text\": \"" + text.replace("\"", "\\\"").replace("\n", " ") + "\"}]}}";
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=" + apiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(reqJson))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new RuntimeException("Embedding generation error: Gemini API returned status " + response.statusCode());
            }
            List<Double> vec = parseEmbeddingVector(response.body());
            if (vec == null || vec.isEmpty()) {
                throw new RuntimeException("Embedding generation error: Gemini API returned empty vector.");
            }
            return vec;
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException || e instanceof RuntimeException) {
                throw (RuntimeException) e;
            }
            throw new RuntimeException("Embedding generation error: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> searchSemantic(String query) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Gemini AI configuration is missing or invalid.");
        }

        List<DocumentEntity> allDocs = getAllDocuments();
        if (query == null || query.trim().isEmpty()) {
            List<Map<String, Object>> res = new ArrayList<>();
            for (DocumentEntity d : allDocs) {
                Map<String, Object> m = documentToMap(d);
                m.put("relevanceScore", 95.0);
                res.add(m);
            }
            return res;
        }

        List<Double> queryVec = generateEmbedding(query);
        List<Map<String, Object>> ranked = new ArrayList<>();

        for (DocumentEntity doc : allDocs) {
            List<Double> docVec = doc.getEmbedding();
            if (docVec == null || docVec.isEmpty()) {
                docVec = generateEmbedding((doc.getTitle() != null ? doc.getTitle() : "") + " " + (doc.getSummary() != null ? doc.getSummary() : ""));
                doc.setEmbedding(docVec);
                documentRepository.save(doc);
            }

            double sim = calculateCosineSimilarity(queryVec, docVec);
            double score = Math.round(Math.min(99.8, Math.max(15.0, sim * 100 + 35)));
            if (doc.getTitle() != null && doc.getTitle().toLowerCase().contains(query.toLowerCase())) {
                score = Math.min(99.8, score + 15);
            }

            Map<String, Object> m = documentToMap(doc);
            m.put("relevanceScore", score);
            m.put("cosineSimilarityVal", Math.round(sim * 10000.0) / 10000.0);
            ranked.add(m);
        }

        ranked.sort((a, b) -> Double.compare((Double) b.get("relevanceScore"), (Double) a.get("relevanceScore")));
        return ranked;
    }

    private double calculateCosineSimilarity(List<Double> vA, List<Double> vB) {
        if (vA == null || vB == null || vA.isEmpty() || vB.isEmpty() || vA.size() != vB.size()) return 0.0;
        double dot = 0.0, normA = 0.0, normB = 0.0;
        for (int i = 0; i < vA.size(); i++) {
            dot += vA.get(i) * vB.get(i);
            normA += vA.get(i) * vA.get(i);
            normB += vB.get(i) * vB.get(i);
        }
        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private List<Double> parseEmbeddingVector(String json) {
        List<Double> vec = new ArrayList<>();
        int idx = json.indexOf("\"values\": [");
        if (idx != -1) {
            int start = idx + "\"values\": [".length();
            int end = json.indexOf("]", start);
            if (end != -1) {
                String[] parts = json.substring(start, end).split(",");
                for (String p : parts) {
                    try {
                        vec.add(Double.parseDouble(p.trim()));
                    } catch (Exception ignored) {}
                }
            }
        }
        return vec;
    }

    private String extractTextFromGeminiResponse(String json) {
        int idx = json.indexOf("\"text\": \"");
        if (idx != -1) {
            int start = idx + "\"text\": \"".length();
            StringBuilder sb = new StringBuilder();
            boolean escaped = false;
            for (int i = start; i < json.length(); i++) {
                char c = json.charAt(i);
                if (escaped) {
                    if (c == 'n') sb.append('\n');
                    else if (c == 'r') sb.append('\r');
                    else if (c == 't') sb.append('\t');
                    else sb.append(c);
                    escaped = false;
                } else if (c == '\\') {
                    escaped = true;
                } else if (c == '"') {
                    break;
                } else {
                    sb.append(c);
                }
            }
            return sb.toString();
        }
        return "";
    }

    private Map<String, Object> parseGeminiNlpJson(String rawText, String defaultSummary) {
        Map<String, Object> result = new HashMap<>();
        String clean = rawText.trim();
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        clean = clean.trim();

        String department = extractJsonKeyValue(clean, "department", null);
        String category = extractJsonKeyValue(clean, "category", null);
        String sensitivity = extractJsonKeyValue(clean, "sensitivity", "Internal");
        Double confidenceScore = extractJsonNumberValue(clean, "confidenceScore", null);
        String summary = extractJsonKeyValue(clean, "summary", defaultSummary);

        result.put("classificationStatus", department != null ? "COMPLETED" : "NEEDS_REVIEW");
        result.put("department", department);
        result.put("category", category);
        result.put("fileType", category);
        result.put("sensitivity", sensitivity);
        result.put("confidenceScore", confidenceScore);
        result.put("confidenceStatus", confidenceScore != null ? "VALID" : "UNAVAILABLE");
        result.put("summary", summary);
        result.put("tags", department != null ? List.of("KMRL", department.replace(" ", "-").toLowerCase()) : List.of("KMRL"));
        return result;
    }

    private String extractJsonKeyValue(String json, String key, String defaultValue) {
        String pattern = "\"" + key + "\": \"";
        int idx = json.indexOf(pattern);
        if (idx != -1) {
            int start = idx + pattern.length();
            int end = json.indexOf("\"", start);
            if (end != -1) {
                return json.substring(start, end);
            }
        }
        return defaultValue;
    }

    private Double extractJsonNumberValue(String json, String key, Double defaultValue) {
        String pattern = "\"" + key + "\": ";
        int idx = json.indexOf(pattern);
        if (idx != -1) {
            int start = idx + pattern.length();
            int end = json.indexOf(",", start);
            if (end == -1) end = json.indexOf("}", start);
            if (end != -1) {
                try {
                    return Double.parseDouble(json.substring(start, end).trim());
                } catch (Exception ignored) {}
            }
        }
        return defaultValue;
    }

    private Map<String, Object> documentToMap(DocumentEntity d) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", d.getId());
        m.put("title", d.getTitle());
        m.put("docType", d.getDocType());
        m.put("department", d.getDepartment());
        m.put("uploader", d.getUploader());
        m.put("uploadedBy", d.getUploadedBy() != null ? d.getUploadedBy() : d.getUploader());
        m.put("status", d.getStatus());
        m.put("sensitivity", d.getSensitivity());
        m.put("version", d.getVersion());
        m.put("createdAt", d.getCreatedAt());
        m.put("uploadedAt", d.getUploadedAt());
        m.put("summary", d.getSummary());
        m.put("rawText", d.getRawText());
        m.put("ocrText", d.getOcrText());
        m.put("tags", d.getTags());
        m.put("fileName", d.getFileName());
        m.put("fileSize", d.getFileSize());
        m.put("fileType", d.getFileType());
        m.put("confidenceScore", d.getConfidenceScore());
        return m;
    }
}
