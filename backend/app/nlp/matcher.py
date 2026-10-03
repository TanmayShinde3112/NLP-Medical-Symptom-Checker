"""
Knowledge Base Condition Matcher Module for MedNLP.
Implements a transparent, rule-based symptom matching algorithm without clinical diagnosis claims.
"""

from typing import List, Dict, Any
from app.knowledge_base.medical_data import MEDICAL_KNOWLEDGE_BASE

def match_conditions(user_symptoms: List[str]) -> List[Dict[str, Any]]:
    """
    Ranks knowledge base conditions by symptom overlap against extracted user symptoms.

    Clinical Overlap Scoring Formula:
    - Intersection: S_match = S_user ∩ S_condition
    - Pattern Coverage (Precision): |S_match| / |S_condition|
    - User Coverage (Recall): |S_match| / |S_user|
    - Score = (0.6 * Pattern Coverage + 0.4 * User Coverage) * 100

    This transparent metric reflects knowledge-base similarity rather than clinical probability.
    """
    if not user_symptoms:
        return []

    user_symptom_set = set(user_symptoms)
    matched_conditions: List[Dict[str, Any]] = []

    for condition in MEDICAL_KNOWLEDGE_BASE:
        cond_symptoms = condition.get("symptoms", [])
        cond_symptom_set = set(cond_symptoms)

        # Intersection of symptoms
        overlap = sorted(list(user_symptom_set.intersection(cond_symptom_set)))
        match_count = len(overlap)

        if match_count == 0:
            continue

        pattern_coverage = match_count / len(cond_symptoms) if cond_symptoms else 0.0
        user_coverage = match_count / len(user_symptoms) if user_symptoms else 0.0

        # Weighted transparent match score
        combined_score = (0.6 * pattern_coverage + 0.4 * user_coverage) * 100.0
        rounded_score = round(combined_score, 1)

        # Build clear academic explanation
        overlap_str = ", ".join(overlap)
        explanation = (
            f"Matches {match_count} of {len(cond_symptoms)} symptoms in this pattern: "
            f"[{overlap_str}]."
        )

        matched_conditions.append({
            "name": condition["name"],
            "category": condition["category"],
            "description": condition["description"],
            "match_score": rounded_score,
            "matched_symptoms": overlap,
            "all_condition_symptoms": cond_symptoms,
            "explanation": explanation,
            "precautions": condition.get("precautions", []),
            "when_to_consult": condition.get("when_to_consult", "")
        })

    # Sort primarily by number of matched symptoms descending, then by match score descending
    matched_conditions.sort(
        key=lambda x: (len(x["matched_symptoms"]), x["match_score"]),
        reverse=True
    )

    return matched_conditions
