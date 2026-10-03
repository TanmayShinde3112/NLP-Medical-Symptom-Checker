"""
Symptom Extractor Module for MedNLP.
Performs emergency red flag identification, negation detection, synonym mapping, and fuzzy symptom extraction.
"""

import re
from typing import List, Dict, Any, Tuple, Set
from rapidfuzz import fuzz
from app.knowledge_base.medical_data import (
    SYMPTOM_DICTIONARY,
    EMERGENCY_RED_FLAGS
)

# Negation trigger patterns commonly found in clinical natural language
NEGATION_PATTERNS = [
    r'\bno\s+([a-z\s]+)',
    r'\bnot\s+([a-z\s]+)',
    r'\bwithout\s+([a-z\s]+)',
    r'\bdenies\s+([a-z\s]+)',
    r'\bnever\s+had\s+([a-z\s]+)',
    r'\bfree\s+of\s+([a-z\s]+)'
]

def check_emergency_red_flags(cleaned_text: str) -> Tuple[bool, List[str]]:
    """
    Checks for high-risk red-flag symptoms in the text.
    Returns (is_emergency, matched_red_flags).
    """
    detected_flags: List[str] = []
    text_lower = cleaned_text.lower()

    for flag in EMERGENCY_RED_FLAGS:
        # Check phrase match using regex word boundary
        pattern = r'\b' + re.escape(flag) + r'\b'
        if re.search(pattern, text_lower):
            detected_flags.append(flag)
            continue
        
        # Fuzzy match for slight typos in severe emergency words
        score = fuzz.partial_ratio(flag, text_lower)
        if score >= 90 and len(flag) > 8:
            detected_flags.append(flag)

    # Remove duplicates
    unique_flags = sorted(list(set(detected_flags)))
    return (len(unique_flags) > 0, unique_flags)

def is_symptom_negated(phrase: str, text: str) -> bool:
    """
    Checks if a symptom phrase is preceded or followed by a negation indicator within a short window.
    Supports:
    - Preceding negations: 'no fever', 'without headache', 'denies chest pain', 'no cough, cold, or fever'
    - Trailing clinical negations: 'fever: none', 'headache absent', 'cough negative', 'vomiting: no'
    """
    text_lower = text.lower()
    escaped_phrase = re.escape(phrase)
    
    # 1. Preceding negation check:
    # Matches negation triggers followed by up to 6 intervening tokens (including commas, conjunctions, adjectives)
    preceding_negation = re.compile(
        r'\b(no|not|without|denies|denied|never|never\s+had|free\s+of|rules\s+out|ruled\s+out|zero)\b'
        r'(?:\s*[\w\',/]+){0,6}\s+' + escaped_phrase,
        re.IGNORECASE
    )
    if preceding_negation.search(text_lower):
        return True

    # 2. Trailing clinical negation check:
    # Matches phrases followed by negative/absent clinical terms
    trailing_negation = re.compile(
        escaped_phrase + r'\s*(?::|-)?\s*(?:is\s+)?\b(none|absent|negative|nil|ruled\s+out|denied|resolved|no)\b',
        re.IGNORECASE
    )
    if trailing_negation.search(text_lower):
        return True

    return False

def extract_symptoms(
    cleaned_text: str,
    lemmatized_tokens: List[str]
) -> Tuple[List[str], List[Dict[str, Any]], bool, List[str]]:
    """
    Extracts symptoms from normalized input using a 3-tier cascade:
    1. Exact / synonym phrase match
    2. Lemmatized phrase match
    3. RapidFuzz approximate match (for typos like 'hedache' or 'vommiting')

    Respects negation scopes (excludes negated symptoms).
    Returns (identified_symptoms, symptom_match_details, emergency_alert, emergency_reasons).
    """
    # 1. Emergency Check
    is_emergency, emergency_reasons = check_emergency_red_flags(cleaned_text)

    identified_symptoms: List[str] = []
    symptom_match_details: List[Dict[str, Any]] = []
    matched_canonical_set: Set[str] = set()

    text_lower = cleaned_text.lower()
    lemmatized_str = " ".join(lemmatized_tokens)

    # 2. Exact & Synonym Phrase Search (Sort synonyms by length descending to prioritize multi-word matches)
    for canonical, synonyms in SYMPTOM_DICTIONARY.items():
        matched = False
        sorted_synonyms = sorted(synonyms, key=lambda s: len(s), reverse=True)

        for syn in sorted_synonyms:
            pattern = r'\b' + re.escape(syn) + r'\b'
            
            # Check in cleaned text or lemmatized text
            in_raw = bool(re.search(pattern, text_lower))
            in_lemma = bool(re.search(pattern, lemmatized_str))

            if in_raw or in_lemma:
                # Check for negation
                if is_symptom_negated(syn, text_lower):
                    continue  # User explicitly denied having this symptom
                
                method = "exact" if syn == canonical else "synonym"
                matched_canonical_set.add(canonical)
                symptom_match_details.append({
                    "canonical_symptom": canonical,
                    "matched_phrase": syn,
                    "method": method,
                    "confidence": 1.0
                })
                matched = True
                break

    # Mask out spans that have already been matched to avoid sub-matching
    masked_text = text_lower
    for detail in symptom_match_details:
        matched_str = detail["matched_phrase"]
        # Replace occurrences with spaces
        masked_text = re.sub(r'\b' + re.escape(matched_str) + r'\b', ' ' * len(matched_str), masked_text)

    # 3. Fuzzy Matching with RapidFuzz for slight misspellings in remaining text
    # Extract clean words without punctuation marks
    words = re.findall(r"\b[a-zA-Z0-9']+\b", masked_text)
    candidates: List[str] = []
    for n in range(1, 4):
        for i in range(len(words) - n + 1):
            candidates.append(" ".join(words[i:i + n]))

    for canonical, synonyms in SYMPTOM_DICTIONARY.items():
        if canonical in matched_canonical_set:
            continue

        best_score = 0.0
        best_candidate = ""
        best_syn = ""

        for candidate in candidates:
            # Skip very short candidates
            if len(candidate) < 4:
                continue

            for syn in synonyms:
                # Candidate must be roughly similar length to avoid matching sub-phrases
                len_ratio = min(len(candidate), len(syn)) / max(len(candidate), len(syn))
                if len_ratio < 0.75:
                    continue

                score = fuzz.ratio(candidate, syn)
                if score > best_score:
                    best_score = score
                    best_candidate = candidate
                    best_syn = syn

        # High confidence fuzzy threshold (>= 88) for genuine typo resilience
        if best_score >= 88:
            if not is_symptom_negated(best_candidate, text_lower):
                matched_canonical_set.add(canonical)
                symptom_match_details.append({
                    "canonical_symptom": canonical,
                    "matched_phrase": f"{best_candidate} (approx: {best_syn})",
                    "method": "fuzzy",
                    "confidence": round(best_score / 100.0, 2)
                })

    # Return list of identified canonical symptoms sorted
    identified_symptoms = sorted(list(matched_canonical_set))

    return (
        identified_symptoms,
        symptom_match_details,
        is_emergency,
        emergency_reasons
    )
