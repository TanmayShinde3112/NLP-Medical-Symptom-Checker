"""
Symptom Service Module for MedNLP.
Coordinates the end-to-end NLP workflow, database persistence, and analytical metrics.
"""

import time
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from app.nlp.preprocessing import preprocess_text
from app.nlp.symptom_extractor import extract_symptoms
from app.nlp.matcher import match_conditions
from app.nlp.response_generator import generate_academic_response
from app.models import AnalysisRecord
from app.schemas import AnalysisResponse, PipelineStageData, TokenDetail, SymptomMatchDetail, ConditionMatch

def run_symptom_analysis(raw_text: str, db: Optional[Session] = None) -> Dict[str, Any]:
    """
    Executes the full NLP diagnostic workflow:
    1. Preprocessing (tokenization, lemmatization, stopword analysis)
    2. Symptom extraction (synonym mapping, RapidFuzz approximate matching, negation scope)
    3. Condition matching against knowledge base
    4. Deterministic response & precaution generation
    5. Persistence to SQLite database
    """
    start_time = time.perf_counter()

    # 1. Preprocess
    pre_result = preprocess_text(raw_text)
    cleaned_text = pre_result["cleaned_text"]
    lemmatized_tokens = pre_result["lemmatized_tokens"]

    # 2. Extract Symptoms & Red Flags
    identified_symptoms, symptom_matches, is_emergency, emergency_reasons = extract_symptoms(
        cleaned_text,
        lemmatized_tokens
    )

    # 3. Match Conditions
    possible_conditions = match_conditions(identified_symptoms)

    # 4. Generate Output Messages & Precautions
    response_meta = generate_academic_response(
        original_text=raw_text,
        identified_symptoms=identified_symptoms,
        possible_conditions=possible_conditions,
        is_emergency=is_emergency,
        emergency_reasons=emergency_reasons
    )

    elapsed_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
    timestamp_str = datetime.now(timezone.utc).isoformat()

    # Determine top condition for database indexing
    top_cond_name = possible_conditions[0]["name"] if possible_conditions else None
    top_score = possible_conditions[0]["match_score"] if possible_conditions else 0.0

    record_id = None
    # 5. Persist to DB if session provided
    if db is not None:
        try:
            record = AnalysisRecord(
                original_input=raw_text,
                cleaned_text=cleaned_text,
                top_condition=top_cond_name,
                top_match_score=top_score,
                emergency_alert=is_emergency,
                processing_time_ms=elapsed_ms
            )
            record.tokens = pre_result["tokens"]
            record.identified_symptoms = identified_symptoms
            record.matched_conditions = possible_conditions[:5]
            record.emergency_reasons = emergency_reasons

            db.add(record)
            db.commit()
            db.refresh(record)
            record_id = record.id
        except Exception as e:
            db.rollback()
            print(f"[DB Warning] Could not persist analysis record: {e}")

    # Build response payload
    pipeline_data = {
        "original_text": raw_text,
        "cleaned_text": cleaned_text,
        "tokens": pre_result["tokens"],
        "token_details": pre_result["token_details"],
        "stopwords_removed": pre_result["stopwords_removed"],
        "lemmatized_tokens": lemmatized_tokens,
        "extracted_symptoms": identified_symptoms,
        "symptom_matches": symptom_matches
    }

    return {
        "success": True,
        "id": record_id,
        "timestamp": timestamp_str,
        "original_text": raw_text,
        "processed_text": pre_result["processed_text"],
        "tokens": pre_result["tokens"],
        "pipeline": pipeline_data,
        "identified_symptoms": identified_symptoms,
        "symptom_matches": symptom_matches,
        "possible_conditions": possible_conditions,
        "precautions": response_meta["precautions"],
        "consultation_advice": response_meta["consultation_advice"],
        "emergency_alert": is_emergency,
        "emergency_reasons": emergency_reasons,
        "processing_time_ms": elapsed_ms,
        "disclaimer": response_meta["disclaimer"],
        "single_symptom_notice": response_meta["single_symptom_notice"],
        "message": response_meta["message"]
    }
