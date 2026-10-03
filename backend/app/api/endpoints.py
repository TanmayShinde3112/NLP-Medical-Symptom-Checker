"""
API Endpoints Router for MedNLP Backend.
Provides RESTful APIs for symptom analysis, history management, stats, and knowledge base inspection.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, text

from app.database import get_db
from app.models import AnalysisRecord
from app.schemas import (
    AnalyzeRequest,
    AnalysisResponse,
    HistoryItem,
    DashboardStats,
    KnowledgeBaseCondition
)
from app.services.symptom_service import run_symptom_analysis
from app.knowledge_base.medical_data import (
    get_all_conditions,
    get_condition_by_name,
    get_all_canonical_symptoms,
    get_categories
)

router = APIRouter(prefix="/api", tags=["Medical NLP"])

@router.get("/health", summary="System Health Check")
def health_check(db: Session = Depends(get_db)):
    """Verifies that backend, SQLite database, and NLP pipeline are online."""
    try:
        # Check DB connectivity with standard SQL ping
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "degraded"

    return {
        "status": "healthy",
        "service": "MedNLP Symptom Intelligence Engine",
        "platform": "MedNLP AI Healthcare Assistant",
        "nlp_engine": "spaCy + RapidFuzz + Rule-based Matcher",
        "version": "2.0.0",
        "database": db_status
    }

@router.get("/stats", response_model=DashboardStats, summary="Retrieve Dashboard Metrics")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Computes real-time statistics from SQLite database and knowledge base."""
    total_analyses = db.query(AnalysisRecord).count()

    all_conditions = get_all_conditions()
    total_conditions = len(all_conditions)

    # Compute average processing time
    avg_time = db.query(func.avg(AnalysisRecord.processing_time_ms)).scalar() or 0.0
    avg_time_rounded = round(float(avg_time), 2)

    # Unique symptoms detected across all stored records
    records = db.query(AnalysisRecord).all()
    unique_symptoms = set()
    for rec in records:
        for sym in rec.identified_symptoms:
            unique_symptoms.add(sym)

    # Recent 5 records
    recent_records = (
        db.query(AnalysisRecord)
        .order_by(AnalysisRecord.id.desc())
        .limit(5)
        .all()
    )

    recent_items = [
        HistoryItem(
            id=r.id,
            timestamp=r.timestamp.isoformat() if r.timestamp else "",
            original_input=r.original_input,
            identified_symptoms=r.identified_symptoms,
            top_condition=r.top_condition,
            top_match_score=r.top_match_score,
            emergency_alert=r.emergency_alert,
            processing_time_ms=r.processing_time_ms
        )
        for r in recent_records
    ]

    return DashboardStats(
        total_analyses=total_analyses,
        unique_symptoms_detected=len(unique_symptoms),
        knowledge_base_conditions=total_conditions,
        average_processing_time_ms=avg_time_rounded,
        recent_analyses=recent_items
    )

@router.post("/analyze", response_model=AnalysisResponse, summary="Analyze Natural Language Symptoms")
def analyze_symptoms(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Main symptom analysis endpoint.
    Processes user input through NLP pipeline, matches conditions, and logs to history.
    """
    text = request.text.strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Input symptom text cannot be empty."
        )

    try:
        response_data = run_symptom_analysis(text, db=db)
        return response_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing NLP symptom analysis: {str(e)}"
        )

@router.post("/chat", response_model=AnalysisResponse, summary="Interactive Chatbot Symptom Analysis")
def chat_endpoint(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """Chatbot conversational interface endpoint."""
    return analyze_symptoms(request, db)

@router.post("/nlp/process", summary="Dedicated NLP Pipeline Inspection")
def process_nlp_pipeline(request: AnalyzeRequest):
    """
    Processes natural-language input through the NLP pipeline without saving to history.
    Ideal for testing and academic pipeline visualization.
    """
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    # Run analysis without passing db session so it acts purely as a sandbox
    return run_symptom_analysis(text, db=None)

@router.get("/history", response_model=List[HistoryItem], summary="Get Analysis History")
def get_analysis_history(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Retrieves stored analysis records, newest first."""
    records = (
        db.query(AnalysisRecord)
        .order_by(AnalysisRecord.id.desc())
        .limit(limit)
        .all()
    )
    return [
        HistoryItem(
            id=r.id,
            timestamp=r.timestamp.isoformat() if r.timestamp else "",
            original_input=r.original_input,
            identified_symptoms=r.identified_symptoms,
            top_condition=r.top_condition,
            top_match_score=r.top_match_score,
            emergency_alert=r.emergency_alert,
            processing_time_ms=r.processing_time_ms
        )
        for r in records
    ]

@router.get("/history/export", summary="Export Analysis History (CSV or JSON)")
def export_analysis_history(
    format: str = Query("json", description="Export format: json or csv"),
    db: Session = Depends(get_db)
):
    """Exports all stored analysis records as CSV or JSON for reporting and academic evaluation."""
    import csv
    import io
    records = db.query(AnalysisRecord).order_by(AnalysisRecord.id.asc()).all()

    if format.lower() == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "ID", "Timestamp", "Original_Input", "Identified_Symptoms",
            "Top_Condition", "Top_Match_Score", "Emergency_Alert", "Latency_MS"
        ])
        for r in records:
            writer.writerow([
                r.id,
                r.timestamp.isoformat() if r.timestamp else "",
                r.original_input,
                "; ".join(r.identified_symptoms),
                r.top_condition or "None",
                r.top_match_score,
                "YES" if r.emergency_alert else "NO",
                r.processing_time_ms
            ])
        csv_content = output.getvalue()
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=mednlp_history_export.csv"}
        )
    else:
        data = [
            {
                "id": r.id,
                "timestamp": r.timestamp.isoformat() if r.timestamp else "",
                "original_input": r.original_input,
                "cleaned_text": r.cleaned_text,
                "tokens": r.tokens,
                "identified_symptoms": r.identified_symptoms,
                "matched_conditions": r.matched_conditions,
                "top_condition": r.top_condition,
                "top_match_score": r.top_match_score,
                "emergency_alert": r.emergency_alert,
                "emergency_reasons": r.emergency_reasons,
                "processing_time_ms": r.processing_time_ms
            }
            for r in records
        ]
        return JSONResponse(
            content=data,
            headers={"Content-Disposition": "attachment; filename=mednlp_history_export.json"}
        )

@router.get("/history/{record_id}", summary="Get Analysis Record Detail")
def get_history_detail(record_id: int, db: Session = Depends(get_db)):
    """Retrieves full NLP details of a specific past analysis."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")

    return {
        "id": record.id,
        "timestamp": record.timestamp.isoformat() if record.timestamp else "",
        "original_input": record.original_input,
        "cleaned_text": record.cleaned_text,
        "tokens": record.tokens,
        "identified_symptoms": record.identified_symptoms,
        "matched_conditions": record.matched_conditions,
        "top_condition": record.top_condition,
        "top_match_score": record.top_match_score,
        "emergency_alert": record.emergency_alert,
        "emergency_reasons": record.emergency_reasons,
        "processing_time_ms": record.processing_time_ms
    }

@router.delete("/history/{record_id}", summary="Delete Single History Record")
def delete_history_item(record_id: int, db: Session = Depends(get_db)):
    """Deletes an individual history item by ID."""
    record = db.query(AnalysisRecord).filter(AnalysisRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    db.delete(record)
    db.commit()
    return {"success": True, "message": f"Record {record_id} deleted."}

@router.delete("/history", summary="Clear All History")
def clear_all_history(db: Session = Depends(get_db)):
    """Clears all stored analysis records."""
    count = db.query(AnalysisRecord).delete()
    db.commit()
    return {"success": True, "message": f"Cleared {count} history records."}

@router.get("/knowledge-base", summary="Retrieve Knowledge Base Conditions")
def get_knowledge_base(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search condition or symptom")
):
    """Returns knowledge base condition patterns with optional filtering."""
    conditions = get_all_conditions()
    categories = get_categories()
    canonical_symptoms = get_all_canonical_symptoms()

    results = conditions
    if category and category.lower() != "all":
        results = [c for c in results if c["category"].lower() == category.lower()]

    if search:
        search_lower = search.lower().strip()
        results = [
            c for c in results
            if search_lower in c["name"].lower()
            or search_lower in c["description"].lower()
            or any(search_lower in s.lower() for s in c["symptoms"])
        ]

    return {
        "conditions": results,
        "total_conditions": len(conditions),
        "filtered_count": len(results),
        "categories": categories,
        "canonical_symptoms": canonical_symptoms
    }

@router.get("/knowledge-base/{condition_name}", summary="Get Knowledge Base Condition Detail")
def get_condition_detail(condition_name: str):
    """Retrieves full pattern information for a specific condition."""
    cond = get_condition_by_name(condition_name)
    if not cond:
        raise HTTPException(status_code=404, detail=f"Condition '{condition_name}' not found.")
    return cond
