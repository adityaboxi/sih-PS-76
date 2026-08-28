import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from app.core.config import settings
from app.schemas import (
    GrievanceAnalysisRequest, GrievanceAnalysisResponse,
    DuplicateCheckRequest, ChatRequest, ChatResponse, XAIReasoning
)
from app.pipelines.gemini_engine import GeminiGrievanceEngine
from app.pipelines.duplicate_engine import DuplicateEngine
from app.pipelines.rag_assistant import MultilingualRAGAssistant

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger('jansetu-ai')

app = FastAPI(
    title='JanSetu AI - LangChain & Gemini Grievance Prioritization Engine',
    description='Production Multilingual AI Microservice using LangChain & Google Gemini for SIH PS 76',
    version='2.0.0',
    docs_url='/docs',
    redoc_url='/redoc'
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'] if '*' in settings.CORS_ORIGINS else settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Initialize Engines
gemini_engine = GeminiGrievanceEngine()
rag_assistant = MultilingualRAGAssistant()

@app.get('/health')
def health_check():
    return {
        'status': 'healthy',
        'service': 'JanSetu AI Microservice (SIH PS 76)',
        'gemini_llm_enabled': bool(settings.GEMINI_API_KEY),
        'model_name': settings.MODEL_NAME,
        'environment': settings.ENVIRONMENT,
        'default_language': settings.DEFAULT_LANGUAGE,
        'version': '2.0.0'
    }

@app.post('/api/v1/analyze-grievance', response_model=GrievanceAnalysisResponse)
def analyze_grievance(req: GrievanceAnalysisRequest):
    try:
        analysis = gemini_engine.analyze(
            text=req.text,
            user_lang=req.user_preferred_language or 'auto',
            district=req.district or 'Kolkata',
            ward=req.ward or 'Ward 8'
        )

        return GrievanceAnalysisResponse(
            detected_language=analysis['detected_language'],
            detected_language_name=analysis['detected_language_name'],
            normalized_english_text=analysis['normalized_english_text'],
            department_id=analysis['department_id'],
            department_name=analysis['department_name'],
            sub_category=analysis['sub_category'],
            priority_level=analysis['priority_level'],
            priority_score=analysis['priority_score'],
            sla_hours=analysis['sla_hours'],
            is_duplicate=False,
            master_ticket_id=None,
            duplicate_similarity_score=0.0,
            spam_score=analysis['spam_score'],
            verification_status=analysis['verification_status'],
            reasoning=XAIReasoning(**analysis['reasoning'])
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
        lang = req.language_code or 'bn'
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
    uvicorn.run('app.main:app', host=settings.HOST, port=settings.PORT, reload=True)
