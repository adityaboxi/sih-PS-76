from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class GrievanceAnalysisRequest(BaseModel):
    text: str = Field(..., description="Grievance text in any Indian language or English")
    pincode: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    user_preferred_language: Optional[str] = None
    attachment_urls: Optional[List[str]] = []

class DuplicateCheckRequest(BaseModel):
    text: str
    department_id: Optional[str] = None
    pincode: Optional[str] = None
    existing_grievances: Optional[List[Dict[str, Any]]] = []

class XAIReasoning(BaseModel):
    rule_applied: str
    key_triggers: List[str]
    rationale_en: str
    rationale_local: str
    language_code: str
    confidence_score: float

class GrievanceAnalysisResponse(BaseModel):
    detected_language: str
    detected_language_name: str
    normalized_english_text: str
    department_id: str
    department_name: str
    sub_category: str
    priority_level: str  # 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    priority_score: int  # 0 to 100
    sla_hours: int
    is_duplicate: bool
    master_ticket_id: Optional[str] = None
    duplicate_similarity_score: float = 0.0
    spam_score: float
    verification_status: str  # 'VERIFIED', 'NEEDS_CLARIFICATION', 'FLAGGED_REVIEW'
    reasoning: XAIReasoning

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language_code: Optional[str] = "en"
    grievance_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    detected_language: str
    cited_sources: List[str]
    suggested_actions: List[str]
