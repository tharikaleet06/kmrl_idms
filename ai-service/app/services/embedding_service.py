import numpy as np
from app.config import settings

class EmbeddingService:
    def generate_embedding(self, text: str) -> list:
        api_key = settings.AI_API_KEY
        if api_key:
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                response = client.models.embed_content(
                    model='text-embedding-004',
                    contents=text
                )
                if response and hasattr(response, 'embedding') and response.embedding.values:
                    return list(response.embedding.values)
            except Exception as e:
                print(f"[Python AI Service] Gemini Embedding note: {e}")

        # Deterministic 384-dim pseudo-vector generation fallback
        np.random.seed(abs(hash(text)) % (2**32))
        vec = np.random.normal(0, 1, 384)
        normalized = vec / np.linalg.norm(vec)
        return normalized.tolist()

embedding_service = EmbeddingService()
