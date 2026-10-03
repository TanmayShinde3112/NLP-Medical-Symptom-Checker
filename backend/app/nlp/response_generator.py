"""
Response Generator Module for MedNLP.
Produces deterministic, medically safe, and academically grounded conversational outputs.
"""

from typing import List, Dict, Any, Optional

DISCLAIMER_TEXT = (
    "Important: This tool provides preliminary informational guidance based on a predefined knowledge base. "
    "It does not provide a medical diagnosis and cannot replace a qualified healthcare professional."
)

GENERAL_PRECAUTIONS = [
    "Stay adequately hydrated with water, warm broths, or electrolyte fluids.",
    "Ensure sufficient physical rest to support your body's natural recovery.",
    "Monitor symptom progression, intensity, and temperature twice daily.",
    "Maintain appropriate personal and respiratory hygiene.",
    "Avoid self-medicating with unverified or prescription drugs without medical oversight."
]

def generate_academic_response(
    original_text: str,
    identified_symptoms: List[str],
    possible_conditions: List[Dict[str, Any]],
    is_emergency: bool,
    emergency_reasons: List[str]
) -> Dict[str, Any]:
    """
    Constructs a medically safe, academically structured output for the user.
    """
    # CASE 1: Emergency red flags detected
    if is_emergency:
        reasons_str = ", ".join(f"'{r}'" for r in emergency_reasons)
        message = (
            f"URGENT: Some symptoms you entered ({reasons_str}) may require immediate emergency medical attention. "
            f"Please do not delay seeking professional emergency care."
        )
        return {
            "message": message,
            "precautions": [
                "Seek immediate emergency medical care or call your local emergency number (e.g., 911, 112, or local ambulance).",
                "Do not attempt to drive yourself if experiencing dizziness, chest discomfort, or severe distress.",
                "Have a family member, friend, or coworker stay with you while awaiting medical assistance."
            ],
            "consultation_advice": "Seek emergency medical evaluation at the nearest hospital emergency room immediately.",
            "disclaimer": DISCLAIMER_TEXT,
            "single_symptom_notice": None
        }

    # CASE 2: No recognized symptoms
    if not identified_symptoms:
        message = (
            "I couldn't confidently identify any supported symptom from your description. "
            "Please describe your symptoms in more detail, such as mentioning specific physical sensations "
            "(e.g., fever, headache, stomach pain, sore throat, or cough)."
        )
        return {
            "message": message,
            "precautions": [
                "If you feel unwell, rest and observe your body for specific sensations.",
                "Keep a log of symptoms, duration, and body temperature.",
                "Consult a doctor if your discomfort persists or causes distress."
            ],
            "consultation_advice": "If you are feeling unwell or have health concerns, consulting a licensed healthcare provider is always recommended.",
            "disclaimer": DISCLAIMER_TEXT,
            "single_symptom_notice": None
        }

    # CASE 3: Single symptom entered
    single_symptom_notice = None
    if len(identified_symptoms) == 1:
        symptom_name = identified_symptoms[0].title()
        single_symptom_notice = (
            f"A single symptom ({symptom_name}) is broad and non-specific. In medical practice, "
            f"multiple co-occurring signs are required to narrow down potential clinical conditions."
        )

    # Format identified symptoms into readable presentation
    formatted_symptoms = [s.title() for s in identified_symptoms]
    symptoms_list_str = "\n• " + "\n• ".join(formatted_symptoms)

    # Top conditions summary
    top_conditions = possible_conditions[:3]
    if top_conditions:
        top_names = [f"'{c['name']}' ({c['match_score']}% match)" for c in top_conditions]
        conditions_summary = ", ".join(top_names)
        message_lead = (
            f"I identified the following symptom(s):{symptoms_list_str}\n\n"
            f"Based on the symptom patterns in the project's knowledge base, these symptoms may be consistent with "
            f"patterns such as {conditions_summary}."
        )
    else:
        message_lead = (
            f"I identified the following symptom(s):{symptoms_list_str}\n\n"
            f"However, this combination does not closely overlap with specific predefined patterns in our academic prototype."
        )

    # Aggregate precautions from top conditions
    aggregated_precautions: List[str] = []
    consultation_advices: List[str] = []

    for cond in top_conditions:
        for p in cond.get("precautions", []):
            if p not in aggregated_precautions:
                aggregated_precautions.append(p)
        if cond.get("when_to_consult") and cond["when_to_consult"] not in consultation_advices:
            consultation_advices.append(cond["when_to_consult"])

    if not aggregated_precautions:
        aggregated_precautions = GENERAL_PRECAUTIONS

    consultation_text = (
        " ".join(consultation_advices) if consultation_advices else
        "Consider consulting a qualified healthcare professional if symptoms persist, worsen, or significantly interfere with daily activities."
    )

    full_message = (
        f"{message_lead}\n\n"
        f"This result is preliminary informational guidance based on a rule-based NLP knowledge base and is NOT a medical diagnosis."
    )

    return {
        "message": full_message,
        "precautions": aggregated_precautions[:5],
        "consultation_advice": consultation_text,
        "disclaimer": DISCLAIMER_TEXT,
        "single_symptom_notice": single_symptom_notice
    }
