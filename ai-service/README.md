# 🐍 KMRL-IDMS Python FastAPI AI Service

Python FastAPI Microservice running on port `:8000` providing AI/ML processing capabilities for the **KMRL Intelligent Document Management System**.

---

## 🛠️ Stack & Dependencies

- **Framework**: Python 3.10+, FastAPI, Uvicorn
- **Multimodal OCR**: PyTesseract, PyMuPDF, PIL, Google Gemini Perception Engine
- **NLP Classification & Entities**: Rule-based NLP heuristics, spaCy, NLTK
- **Vector Embeddings & Search**: NumPy, Cosine Similarity, Pre-filtered Department Authorization Scoping
- **Geospatial & Route Optimization**: Dijkstra Shortest Path Graph Algorithm & Haversine Distance Calculations

---

## 🚀 Execution & Running

### 1. Install Dependencies
```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Uvicorn Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 📡 API Routes Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status & provider check |
| `POST` | `/ai/ocr` | Multimodal OCR text extraction from document buffers |
| `POST` | `/ai/classify` | NLP document classification (Department, Category, Sensitivity) |
| `POST` | `/ai/extract-entities` | Named Entity Recognition (Dates, Amounts, Regulations, Orgs) |
| `POST` | `/ai/embed` | 384/3072-dimensional vector embedding generation |
| `POST` | `/ai/search` | Secured Cosine Similarity vector search with department pre-filtering |
| `POST` | `/ai/geospatial/match` | GIS Metro station entity resolution & coordinate mapping |
| `POST` | `/ai/route/optimize` | Dijkstra route optimizer for Blue Line metro corridor |

---

## 🔗 Related Documentation
- 🏠 [Root README](../README.md)
- 🐍 [Python AI Microservice Guide](../docs/AI_SERVICE_GUIDE.md)
- 🧠 [AI Model Specifications](../docs/AI_MODEL_DOCUMENTATION.md)
- 🏗️ [System Architecture](../docs/ARCHITECTURE.md)
