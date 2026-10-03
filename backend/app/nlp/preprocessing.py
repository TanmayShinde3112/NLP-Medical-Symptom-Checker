"""
Text Preprocessing Module for MedNLP.
Performs text normalization, contraction expansion, tokenization, lemmatization, and stopword analysis.
"""

import re
import spacy
from typing import List, Dict, Any, Tuple

# Try loading spaCy en_core_web_sm, fallback to spacy.blank("en") if necessary
try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = spacy.blank("en")

# Common contractions dictionary for medical natural language
CONTRACTIONS: Dict[str, str] = {
    "i'm": "i am",
    "i've": "i have",
    "i'd": "i would",
    "i'll": "i will",
    "can't": "cannot",
    "won't": "will not",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "it's": "it is",
    "there's": "there is",
    "that's": "that is"
}

def expand_contractions(text: str) -> str:
    """Expands common English contractions into full words."""
    lowered = text.lower()
    for contraction, expanded in CONTRACTIONS.items():
        lowered = re.sub(r'\b' + re.escape(contraction) + r'\b', expanded, lowered)
    return lowered

def clean_text(text: str) -> str:
    """
    Cleans raw user input:
    - Lowercases text
    - Expands contractions
    - Strips special symbols while retaining whitespace and alphanumeric words
    - Normalizes multi-spaces
    """
    if not text:
        return ""
    expanded = expand_contractions(text)
    # Remove characters other than letters, numbers, and basic punctuation
    cleaned = re.sub(r'[^a-zA-Z0-9\s,\.\?\!\-]', ' ', expanded)
    # Normalize excessive spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def preprocess_text(raw_text: str) -> Dict[str, Any]:
    """
    Full NLP preprocessing pipeline:
    1. Text cleaning & normalization
    2. spaCy Tokenization
    3. Part-of-speech tagging & Lemmatization
    4. Stopword classification
    
    Returns structured dictionary with pipeline stages for educational display.
    """
    cleaned = clean_text(raw_text)
    doc = nlp(cleaned)

    tokens: List[str] = []
    token_details: List[Dict[str, Any]] = []
    stopwords_removed: List[str] = []
    lemmatized_tokens: List[str] = []

    # Preserve medical negation tokens (like 'no', 'not', 'without') even if spacy marks them as stop
    medical_preserves = {"no", "not", "without", "pain", "fever", "cold"}

    for token in doc:
        # Ignore standalone punctuation in token arrays
        if token.is_punct or token.is_space:
            continue
        
        token_str = token.text.lower()
        lemma_str = token.lemma_.lower()
        is_stop = token.is_stop and (token_str not in medical_preserves)

        tokens.append(token_str)
        token_details.append({
            "text": token.text,
            "lemma": lemma_str,
            "pos": token.pos_ if token.pos_ else "NOUN",
            "is_stop": is_stop
        })

        if not is_stop:
            stopwords_removed.append(token_str)
            lemmatized_tokens.append(lemma_str)

    # Simplified processed string representation for UI
    processed_text = " ".join(stopwords_removed) if stopwords_removed else cleaned

    return {
        "original_text": raw_text,
        "cleaned_text": cleaned,
        "tokens": tokens,
        "token_details": token_details,
        "stopwords_removed": stopwords_removed,
        "lemmatized_tokens": lemmatized_tokens,
        "processed_text": processed_text
    }
