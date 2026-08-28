import os
import json
import logging
from app.core.config import settings
from app.pipelines.language_engine import LanguageEngine
from app.pipelines.classifier import DepartmentClassifier
from app.pipelines.spam_filter import SpamGuard
from app.pipelines.xai_engine import XAIEngine

logger = logging.getLogger('jansetu-ai')

class GeminiGrievanceEngine:
    def __init__(self):
        self.llm = None
        self.api_key = settings.GEMINI_API_KEY
        
        if self.api_key:
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                self.llm = ChatGoogleGenerativeAI(
                    model=settings.MODEL_NAME,
                    google_api_key=self.api_key,
                    temperature=0.1,
                    max_output_tokens=1024
                )
                logger.info(f"⚡ LangChain Google Gemini ({settings.MODEL_NAME}) Initialized Successfully!")
            except Exception as e:
                logger.warn(f"LangChain Gemini initialization notice: {e}. Fallback enabled.")

    def analyze(self, text: str, user_lang: str = 'auto', district: str = 'Kolkata', ward: str = 'Ward 8') -> dict:
        # 1. If Gemini LLM is active, run structured LangChain prompt
        if self.llm:
            try:
                from langchain_core.prompts import PromptTemplate
                from langchain_core.output_parsers import StrOutputParser

                prompt = PromptTemplate(
                    template="""You are the AI Grievance Triage Engine for JanSetu AI (Smart India Hackathon PS 76).
Analyze the following citizen complaint and return ONLY a valid JSON object.

CITIZEN GRIEVANCE TEXT:
"{text}"
CITIZEN LOCATION: District: {district}, Ward: {ward}

DEPARTMENTS TO CHOOSE FROM:
1. WATER_SUPPLY: "Water Supply & Sanitation Department"
2. ELECTRICITY_POWER: "Electricity & Power Distribution"
3. PUBLIC_WORKS_ROADS: "Public Works & Roads (PWD)"
4. HEALTHCARE: "Healthcare & Family Welfare"
5. SOLID_WASTE: "Solid Waste & Urban Cleanliness"
6. FOOD_CIVIL_SUPPLIES: "Food & Civil Supplies (Ration/PDS)"
7. POLICE_PUBLIC_SAFETY: "Police, Traffic & Public Safety"
8. SCHOOL_EDUCATION: "School & Higher Education"
9. WOMEN_CHILD_DEV: "Women & Child Development"
10. REVENUE_DISASTER: "Revenue & Disaster Management"

PRIORITY SCORING POLICY (0-100):
- CRITICAL (80-100, SLA: 2-4 hrs): Life hazards, live electric wire, hospital emergency, water contamination & illness.
- HIGH (60-79, SLA: 24 hrs): Major burst pipe, sewage overflow, transformer fault.
- MEDIUM (40-59, SLA: 48 hrs): Potholes, streetlights, garbage heaps.
- LOW (1-39, SLA: 72 hrs): Routine queries, documentation.

ZERO-DISCARD SPAM POLICY:
- If text is meaningless gibberish, return verification_status: "FLAGGED_REVIEW" and spam_score: 0.85 (do not discard).
- Otherwise return verification_status: "VERIFIED" and spam_score: 0.05.

OUTPUT FORMAT (JSON ONLY, NO MARKDOWN, NO CODEBLOCKS):
{{
  "detected_language": "bn|hi|ta|te|mr|gu|en",
  "detected_language_name": "Language Name",
  "normalized_english_text": "English translation/summary",
  "department_id": "ONE_OF_THE_DEPARTMENT_IDS",
  "department_name": "Full Department Name",
  "sub_category": "Short sub-category",
  "priority_level": "CRITICAL|HIGH|MEDIUM|LOW",
  "priority_score": 95,
  "sla_hours": 4,
  "spam_score": 0.05,
  "verification_status": "VERIFIED|FLAGGED_REVIEW",
  "key_triggers": ["list", "of", "trigger", "words"],
  "rule_applied": "Specific Government SOP / SLA Rule cited",
  "rationale_local": "Clear explanation in the citizen's native mother tongue",
  "rationale_en": "Official administrative explanation in English"
}}
""",
                    input_variables=["text", "district", "ward"]
                )

                chain = prompt | self.llm | StrOutputParser()
                raw_response = chain.invoke({"text": text, "district": district, "ward": ward})
                
                # Parse JSON
                cleaned = raw_response.strip()
                if cleaned.startswith("```json"):
                    cleaned = cleaned[7:]
                if cleaned.endswith("```"):
                    cleaned = cleaned[:-3]
                parsed = json.loads(cleaned.strip())
                
                return {
                    "detected_language": parsed.get("detected_language", "bn"),
                    "detected_language_name": parsed.get("detected_language_name", "Bengali"),
                    "normalized_english_text": parsed.get("normalized_english_text", text),
                    "department_id": parsed.get("department_id", "WATER_SUPPLY"),
                    "department_name": parsed.get("department_name", "Water Supply & Sanitation Department"),
                    "sub_category": parsed.get("sub_category", "Civic Grievance"),
                    "priority_level": parsed.get("priority_level", "CRITICAL"),
                    "priority_score": int(parsed.get("priority_score", 90)),
                    "sla_hours": int(parsed.get("sla_hours", 4)),
                    "spam_score": float(parsed.get("spam_score", 0.05)),
                    "verification_status": parsed.get("verification_status", "VERIFIED"),
                    "reasoning": {
                        "rule_applied": parsed.get("rule_applied", "Emergency Public SLA Rule 2026"),
                        "key_triggers": parsed.get("key_triggers", ["emergency"]),
                        "rationale_en": parsed.get("rationale_en", "Classified under emergency critical SLA."),
                        "rationale_local": parsed.get("rationale_local", "জরুরি জনস্বার্থে অন্তর্ভুক্ত করা হয়েছে।"),
                        "language_code": parsed.get("detected_language", "bn"),
                        "confidence_score": parsed.get("priority_score", 90)
                    }
                }
            except Exception as e:
                logger.warn(f"Gemini API invocation fallback: {e}")

        # 2. Local Resilient Rule-Engine Fallback
        detected_lang, lang_name = LanguageEngine.detect_language(text)
        user_lang = user_lang if user_lang != 'auto' else detected_lang
        normalized_en = LanguageEngine.normalize_to_english_concepts(text, detected_lang)

        spam_result = SpamGuard.evaluate(text)
        classifier = DepartmentClassifier()
        triage_result = classifier.classify_and_score(text, normalized_en, user_lang)

        xai_data = XAIEngine.generate_reasoning(
            department_name=triage_result['department_name'],
            priority_level=triage_result['priority_level'],
            priority_score=triage_result['priority_score'],
            triggers=triage_result['detected_triggers'],
            detected_lang=user_lang,
            sla_hours=triage_result['sla_hours']
        )

        return {
            "detected_language": detected_lang,
            "detected_language_name": lang_name,
            "normalized_english_text": normalized_en,
            "department_id": triage_result['department_id'],
            "department_name": triage_result['department_name'],
            "sub_category": triage_result['sub_category'],
            "priority_level": triage_result['priority_level'],
            "priority_score": triage_result['priority_score'],
            "sla_hours": triage_result['sla_hours'],
            "spam_score": spam_result['spam_score'],
            "verification_status": spam_result['verification_status'],
            "reasoning": xai_data
        }
