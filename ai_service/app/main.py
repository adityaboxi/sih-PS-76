from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import logging

from app.core.config import settings
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

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger('jansetu-ai')

app = FastAPI(
    title='JanSetu AI - Grievance Prioritization & Routing Engine',
    description='Production Multilingual AI Microservice for SIH PS 76',
    version='1.0.0',
    docs_url='/docs',
    redoc_url='/redoc'
)

# CORS configuration from .env
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'] if '*' in settings.CORS_ORIGINS else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

classifier = DepartmentClassifier()
rag_assistant = MultilingualRAGAssistant()

@app.get('/health')
def health_check():
    return {
        'status': 'healthy',
        'service': 'JanSetu AI Microservice (SIH PS 76)',
        'environment': settings.ENVIRONMENT,
        'default_language': settings.DEFAULT_LANGUAGE,
        'version': '1.0.0'
    }

@app.post('/api/v1/analyze-grievance', response_model=GrievanceAnalysisResponse)
def analyze_grievance(req: GrievanceAnalysisRequest):
    try:
        detected_lang, lang_name = LanguageEngine.detect_language(req.text)
        user_lang = req.user_preferred_language or detected_lang
        normalized_en = LanguageEngine.normalize_to_english_concepts(req.text, detected_lang)

        spam_result = SpamGuard.evaluate(req.text)
        triage_result = classifier.classify_and_score(req.text, normalized_en, user_lang)

        xai_data = XAIEngine.generate_reasoning(
            department_name=triage_result['department_name'],
            priority_level=triage_result['priority_level'],
            priority_score=triage_result['priority_score'],
            triggers=triage_result['detected_triggers'],
            detected_lang=user_lang,
            sla_hours=triage_result['sla_hours']
        )

        return GrievanceAnalysisResponse(
            detected_language=detected_lang,
            detected_language_name=lang_name,
            normalized_english_text=normalized_en,
            department_id=triage_result['department_id'],
            department_name=triage_result['department_name'],
            sub_category=triage_result['sub_category'],
            priority_level=triage_result['priority_level'],
            priority_score=triage_result['priority_score'],
            sla_hours=triage_result['sla_hours'],
            is_duplicate=False,
            master_ticket_id=None,
            duplicate_similarity_score=0.0,
            spam_score=spam_result['spam_score'],
            verification_status=spam_result['verification_status'],
            reasoning=XAIReasoning(**xai_data)
        )
    except Exception as e:
        logger.error(f'Error analyzing grievance: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/v1/detect-duplicate')
def detect_duplicate(req: DuplicateCheckRequest):
    try:
        is_dup, master_id, score = DuplicateEngine.find_duplicate(
            new_text=req.text,
            department_id=req.department_id or '',
            existing_grievances=req.existing_grievances or [],
            threshold=settings.DUPLICATE_THRESHOLD
        )
        return {
            'is_duplicate': is_dup,
            'master_ticket_id': master_id,
            'similarity_score': score,
            'cluster_policy': 'Geospatial & Semantic Cosine Distance Matching'
        }
    except Exception as e:
        logger.error(f'Error detecting duplicate: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))

@app.post('/api/v1/chat', response_model=ChatResponse)
def conversational_chat(req: ChatRequest):
    try:
        lang = req.language_code
        if not lang or lang == 'auto':
            lang, _ = LanguageEngine.detect_language(req.message)

        res = rag_assistant.answer_query(req.message, lang)
        return ChatResponse(
            reply=res['reply'],
            detected_language=res['detected_language'],
            cited_sources=res['cited_sources'],
            suggested_actions=res['suggested_actions']
        )
    except Exception as e:
        logger.error(f'Error in RAG chat: {str(e)}')
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
