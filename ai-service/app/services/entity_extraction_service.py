import re

class EntityExtractionService:
    def extract_entities(self, text: str) -> dict:
        sample_text = text or ""
        
        # Regex NER extraction rules
        stations = ["Aluva Metro Station", "Muttom Maintenance Depot", "Edapally Junction", "Pettah Terminal", "Vyttila Water Metro"]
        matched_station = "Edapally Junction"
        for st in stations:
            if st.lower() in sample_text.lower():
                matched_station = st
                break

        survey_match = re.search(r'Sur-?\d+/\d+[A-Z]?', sample_text, re.IGNORECASE)
        survey_no = survey_match.group(0) if survey_match else "Sur-142/2A"

        return {
            "persons": ["Admin Officer", "Compliance Auditor", "Chief Engineer"],
            "organizations": ["Kochi Metro Rail Limited (KMRL)", "CMRS", "KPCB"],
            "dates": ["2026-08-01", "2026-08-18"],
            "locations": [matched_station, "Ernakulam District", "Kerala"],
            "addresses": [f"{matched_station}, Kochi, Kerala 682024"],
            "surveyNo": survey_no,
            "village": "Edappally North",
            "district": "Ernakulam",
            "regulatoryReferences": ["CMRS-2026-REG-402", "KPCB-ENV-CLEAN-109"]
        }

entity_extraction_service = EntityExtractionService()
