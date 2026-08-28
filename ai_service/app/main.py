from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from app.schemas import (
    GrievanceAnalysisRequest, GrievanceAnalysisResponse,
    DuplicateCheckRequest, ChatRequest, ChatResponse, XAIReasoning
)
from app.pipelines.language_engine import LanguageEngine
from app.pipelines.classifier import DepartmentClassifier
from app.pipelines.duplicate_engine import DuplicateEngine
from app.pipelines.spam_filter import SpamGuard
from app.pipelines.xai_engine import XAIEngine
from app.pipelines.rag_assistant import MultilingualRAGAssistant

app = FastAPI(
    title="SIH PS 76 - AI Grievance Prioritization & Routing Engine",
    description="Multilingual AI Microservice for Department Routing, Urgency Scoring, Zero-Discard Spam Filter, and Conversational RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

classifier = DepartmentClassifier()
rag_assistant = MultilingualRAGAssistant()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Grievance Prioritization & Routing Engine",
        "supported_languages": ["bn", "hi", "en", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "as"],
        "version": "1.0.0"
    }

@app.post("/api/v1/analyze-grievance", response_model=GrievanceAnalysisResponse)
def analyze_grievance(req: GrievanceAnalysisRequest):
    # 1. Language Detection & Normalization
    detected_lang, lang_name = LanguageEngine.detect_language(req.text)
    user_lang = req.user_preferred_language or detected_lang
    normalized_en = LanguageEngine.normalize_to_english_concepts(req.text, detected_lang)

    # 2. Zero-Discard False Grievance & Spam Evaluation
    spam_result = SpamGuard.evaluate(req.text)

    # 3. Department Classification & Urgency Scoring
    triage_result = classifier.classify_and_score(req.text, normalized_en, user_lang)

    # 4. Explainable AI (XAI) Transparent Reasoning
    xai_data = XAIEngine.generate_reasoning(
        department_name=triage_result["department_name"],
        priority_level=triage_result["priority_level"],
        priority_score=triage_result["priority_score"],
        triggers=triage_result["detected_triggers"],
        detected_lang=user_lang,
        sla_hours=triage_result["sla_hours"]
    )

    return GrievanceAnalysisResponse(
        detected_language=detected_lang,
        detected_language_name=lang_name,
        normalized_english_text=normalized_en,
        department_id=triage_result["department_id"],
        department_name=triage_result["department_name"],
        sub_category=triage_result["sub_category"],
        priority_level=triage_result["priority_level"],
        priority_score=triage_result["priority_score"],
        sla_hours=triage_result["sla_hours"],
        is_duplicate=False,
        master_ticket_id=None,
        duplicate_similarity_score=0.0,
        spam_score=spam_result["spam_score"],
        verification_status=spam_result["verification_status"],
        reasoning=XAIReasoning(**xai_data)
    )

@app.post("/api/v1/detect-duplicate")
def detect_duplicate(req: DuplicateCheckRequest):
    is_dup, master_id, score = DuplicateEngine.find_duplicate(
        new_text=req.text,
        department_id=req.department_id or "",
        existing_grievances=req.existing_grievances or []
    )
    return {
        "is_duplicate": is_dup,
        "master_ticket_id": master_id,
        "similarity_score": score,
        "cluster_policy": "Geospatial & Semantic Cosine Distance Matching"
    }

@app.post("/api/v1/chat", response_model=ChatResponse)
def conversational_chat(req: ChatRequest):
    # Detect language if not provided
    lang = req.language_code
    if not lang or lang == "auto":
        lang, _ = LanguageEngine.detect_language(req.message)

    res = rag_assistant.answer_query(req.message, lang)
    return ChatResponse(
        reply=res["reply"],
        detected_language=res["detected_language"],
        cited_sources=res["cited_sources"],
        suggested_actions=res["suggested_actions"]
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
