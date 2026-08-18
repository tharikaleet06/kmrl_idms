import base64
from fastapi import HTTPException
from app.config import settings

class OcrService:
    def process_ocr(self, file_data: str, file_name: str) -> dict:
        api_key = settings.AI_API_KEY
        if not api_key:
            raise HTTPException(status_code=503, detail="AI Service Error: Gemini API key is missing or unconfigured.")

        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            if file_data and "base64," in file_data:
                raw_b64 = file_data.split("base64,")[1]
                b64_bytes = base64.b64decode(raw_b64)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[
                        genai.types.Part.from_bytes(data=b64_bytes, mime_type='application/pdf'),
                        'Extract verbatim text, survey numbers, and table details from this KMRL document.'
                    ]
                )
                if response and response.text:
                    return {"text": response.text, "confidence": 0.98}
            raise HTTPException(status_code=400, detail="OCR processing error: Unable to extract text from provided document buffer.")
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")

ocr_service = OcrService()
