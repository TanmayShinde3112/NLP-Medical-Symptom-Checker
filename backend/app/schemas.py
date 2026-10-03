from pydantic import BaseModel, Field
from typing import List, Optional

class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, description="Raw natural language symptom description")

class TokenDetail(BaseModel):
    text: str
    lemma: str
    pos: str
    is_stop: bool

class SymptomMatchDetail(BaseModel):
    canonical_symptom: str
    matched_phrase: str
    method: str  # 'exact', 'synonym', 'fuzzy'
    confidence: float

class ConditionMatch(BaseModel):
    name: str
    category: str
    description: str
    match_score: float  # 0 to 100 percentage
    matched_symptoms: List[str]
    all_condition_symptoms: List[str]
    explanation: str
    precautions: List[str]
    when_to_consult: str

class PipelineStageData(BaseModel):
    original_text: str
    cleaned_text: str
    tokens: List[str]
    token_details: List[TokenDetail]
    stopwords_removed: List[str]
    lemmatized_tokens: List[str]
    extracted_symptoms: List[str]
    symptom_matches: List[SymptomMatchDetail]

class AnalysisResponse(BaseModel):
    success: bool
    id: Optional[int] = None
    timestamp: str
    original_text: str
    processed_text: str
    tokens: List[str]
    pipeline: PipelineStageData
    identified_symptoms: List[str]
    symptom_matches: List[SymptomMatchDetail]
    possible_conditions: List[ConditionMatch]
    precautions: List[str]
    consultation_advice: str
    emergency_alert: bool
    emergency_reasons: List[str]
    processing_time_ms: float
    disclaimer: str
    single_symptom_notice: Optional[str] = None
    message: str

class HistoryItem(BaseModel):
    id: int
    timestamp: str
    original_input: str
    identified_symptoms: List[str]
    top_condition: Optional[str] = None
    top_match_score: float
    emergency_alert: bool
    processing_time_ms: float

class DashboardStats(BaseModel):
    total_analyses: int
    unique_symptoms_detected: int
    knowledge_base_conditions: int
    average_processing_time_ms: float
    recent_analyses: List[HistoryItem]

class KnowledgeBaseCondition(BaseModel):
    name: str
    category: str
    description: str
    symptoms: List[str]
    precautions: List[str]
    when_to_consult: str
