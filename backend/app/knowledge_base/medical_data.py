"""
Medical Knowledge Base for MedNLP Symptom Checker.
Structured clinical condition ontologies and symptom patterns.
"""

from typing import List, Dict, Any

# Emergency Red Flag keywords and phrases that warrant urgent medical evaluation
EMERGENCY_RED_FLAGS: List[str] = [
    "severe chest pain",
    "chest pain",
    "difficulty breathing",
    "severe breathing problem",
    "trouble breathing",
    "shortness of breath",
    "unconscious",
    "loss of consciousness",
    "passed out",
    "blacked out",
    "seizure",
    "convulsion",
    "severe bleeding",
    "uncontrolled bleeding",
    "coughing blood",
    "vomiting blood",
    "sudden severe weakness",
    "stroke-like symptoms",
    "facial droop",
    "slurred speech",
    "inability to speak",
    "severe allergic reaction",
    "anaphylaxis",
    "lips turning blue",
    "worst headache of my life",
    "worst headache of life",
    "sudden paralysis",
    "chest pressure radiating to arm"
]

# Canonical symptoms with extensive synonym and natural language variation mappings
SYMPTOM_DICTIONARY: Dict[str, List[str]] = {
    "fever": [
        "fever", "high temperature", "temperature", "elevated temperature",
        "febrile", "pyrexia", "feverish", "burning up", "hot to touch",
        "running a temperature", "running a fever", "mild fever", "high fever"
    ],
    "headache": [
        "headache", "head pain", "pain in my head", "pain in head", "head hurts",
        "throbbing head", "head ache", "severe headache", "aching head",
        "temple pain", "forehead pain", "splitting headache", "head pounding"
    ],
    "body pain": [
        "body pain", "body ache", "body aches", "muscle pain", "muscle ache",
        "muscle aches", "muscle soreness", "generalized ache", "myalgia",
        "aching muscles", "pain all over", "sore body", "all over body pain",
        "aching limbs", "body stiffness", "full body aches"
    ],
    "fatigue": [
        "fatigue", "tiredness", "exhaustion", "feeling tired", "weakness",
        "lethargy", "low energy", "worn out", "drowsy", "malaise",
        "extreme fatigue", "feeling drained", "lack of energy", "sluggish"
    ],
    "cough": [
        "cough", "coughing", "dry cough", "productive cough", "hacking cough",
        "persistent cough", "throat tickle", "coughing fits", "wet cough"
    ],
    "sore throat": [
        "sore throat", "throat pain", "throat irritation", "scratchy throat",
        "painful swallowing", "pharyngitis", "raw throat", "throat hurts",
        "irritated throat", "burning throat"
    ],
    "runny nose": [
        "runny nose", "rhinorrhea", "watery nose", "nasal discharge",
        "dripping nose", "running nose", "watery nasal discharge", "mucus from nose"
    ],
    "stuffy nose": [
        "stuffy nose", "blocked nose", "nasal congestion", "congested nose",
        "blocked nostrils", "clogged nose", "nose block", "sinus congestion"
    ],
    "sneezing": [
        "sneezing", "frequent sneezing", "sneeze", "sneezes", "constant sneezing",
        "uncontrollable sneezing"
    ],
    "stomach pain": [
        "stomach pain", "stomach ache", "stomach hurts", "abdominal pain",
        "belly ache", "tummy ache", "cramps in stomach", "gut pain",
        "abdominal cramps", "pain in stomach", "belly pain", "tummy hurts",
        "abdominal discomfort", "cramping"
    ],
    "vomiting": [
        "vomiting", "throwing up", "threw up", "puking", "emesis",
        "vomit", "puked", "regurgitating", "heaving"
    ],
    "nausea": [
        "nausea", "feeling nauseous", "queasy", "upset stomach",
        "sick to my stomach", "feeling sick", "nauseated", "urge to vomit",
        "motion sickness"
    ],
    "diarrhea": [
        "diarrhea", "loose motion", "watery stool", "loose stools",
        "frequent stools", "running stomach", "frequent bowel movements",
        "watery diarrhea", "dysentery"
    ],
    "sensitivity to light": [
        "sensitivity to light", "photophobia", "light hurts eyes",
        "sensitive to light", "light sensitivity", "cannot tolerate light",
        "eyes hurt in bright light"
    ],
    "sensitivity to sound": [
        "sensitivity to sound", "phonophobia", "sensitive to noise",
        "sound sensitivity", "noise hurts head"
    ],
    "dizziness": [
        "dizziness", "feeling dizzy", "lightheaded", "lightheadedness",
        "unsteady", "vertigo", "giddy", "room spinning", "loss of balance"
    ],
    "chills": [
        "chills", "shivering", "feeling cold", "rigors", "cold spells",
        "shivers", "teeth chattering"
    ],
    "sweating": [
        "sweating", "excessive sweating", "night sweats", "perspiring",
        "cold sweats", "heavy perspiration"
    ],
    "joint pain": [
        "joint pain", "arthralgia", "aching joints", "stiff joints",
        "knee pain", "pain in joints", "swollen joints", "wrist pain"
    ],
    "loss of appetite": [
        "loss of appetite", "not feeling hungry", "poor appetite",
        "no appetite", "anorexia", "cannot eat", "don't want to eat"
    ],
    "burning urination": [
        "burning urination", "painful urination", "dysuria",
        "stinging when peeing", "burning pee", "pain while urinating",
        "discomfort when urinating", "stinging sensation while urinating"
    ],
    "frequent urination": [
        "frequent urination", "peeing often", "urinary frequency",
        "constant urge to pee", "frequent trips to bathroom", "urinating a lot"
    ],
    "loss of smell": [
        "loss of smell", "anosmia", "cannot smell", "can't smell anything",
        "diminished smell", "no sense of smell"
    ],
    "loss of taste": [
        "loss of taste", "ageusia", "cannot taste", "food has no taste",
        "diminished taste", "no sense of taste"
    ],
    "skin rash": [
        "skin rash", "rash", "red spots", "itchy rash", "hives",
        "skin bumps", "dermatitis", "red patches", "skin eruptions", "welts"
    ],
    "itching": [
        "itching", "itchy skin", "pruritus", "scratching", "intense itching",
        "itchiness", "pruritic"
    ],
    "acid reflux": [
        "acid reflux", "heartburn", "burning in chest after eating",
        "acid regurgitation", "sour taste in mouth", "indigestion",
        "food coming back up", "burning sensation in throat"
    ],
    "chest tightness": [
        "chest tightness", "tight chest", "chest discomfort", "heaviness in chest"
    ]
}

# Knowledge Base containing 20 curated conditions across medical categories
MEDICAL_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "name": "Viral Infection (General)",
        "category": "General / Infectious",
        "description": "A generalized systemic viral illness pattern causing immune-response symptoms.",
        "symptoms": ["fever", "headache", "body pain", "fatigue", "chills", "loss of appetite"],
        "precautions": [
            "Maintain high fluid intake with water, clear soups, and oral rehydration solutions.",
            "Prioritize strict bed rest to assist immune system recovery.",
            "Monitor body temperature twice daily.",
            "Use cool compress on the forehead for comfort if experiencing high temperature."
        ],
        "when_to_consult": "Consult a healthcare professional if fever persists beyond 3 days, rises above 103°F (39.4°C), or if you develop severe lethargy or difficulty breathing."
    },
    {
        "name": "Influenza-like Illness (Flu)",
        "category": "Respiratory",
        "description": "An acute viral respiratory illness pattern with abrupt onset of systemic and respiratory signs.",
        "symptoms": ["fever", "headache", "body pain", "fatigue", "cough", "sore throat", "chills", "sweating"],
        "precautions": [
            "Get plenty of sleep and rest in a well-ventilated room.",
            "Drink plenty of warm liquids such as herbal tea and warm water.",
            "Practice respiratory hygiene: cover your mouth when coughing and wash hands frequently.",
            "Avoid strenuous physical activity until fully recovered."
        ],
        "when_to_consult": "Seek medical consultation promptly if you experience severe shortness of breath, continuous chest pressure, confusion, or if symptoms worsen after initial improvement."
    },
    {
        "name": "Common Cold",
        "category": "Respiratory",
        "description": "A mild viral infection predominantly affecting the upper respiratory tract.",
        "symptoms": ["runny nose", "sneezing", "sore throat", "stuffy nose", "cough", "fatigue"],
        "precautions": [
            "Practice gentle steam inhalation to soothe congested nasal passages.",
            "Gargle with warm salt water 2-3 times daily to relieve throat soreness.",
            "Stay well-hydrated with warm fluids to help thin mucus secretions.",
            "Wash hands thoroughly and avoid touching facial mucous membranes."
        ],
        "when_to_consult": "Consult a medical practitioner if symptoms persist for more than 10-14 days without improvement, or if you develop high fever or ear pain."
    },
    {
        "name": "Migraine",
        "category": "Neurological",
        "description": "A neurological condition characterized by recurrent, often throbbing headache episodes frequently accompanied by sensory sensitivities.",
        "symptoms": ["headache", "sensitivity to light", "sensitivity to sound", "nausea", "vomiting", "dizziness"],
        "precautions": [
            "Rest in a quiet, dark, well-ventilated room during an acute episode.",
            "Apply a cold pack or soothing compress to the forehead or back of the neck.",
            "Maintain consistent hydration and avoid skipped meals.",
            "Track possible dietary, sleep, or stress triggers in a symptom log."
        ],
        "when_to_consult": "Seek prompt medical care if you experience a sudden, explosive headache ('thunderclap'), accompanying speech changes, vision loss, or focal neurological weakness."
    },
    {
        "name": "Tension-Type Headache",
        "category": "Neurological",
        "description": "A common headache pattern presenting with dull, band-like tightening around the head or neck.",
        "symptoms": ["headache", "fatigue", "body pain"],
        "precautions": [
            "Take structured screen breaks and practice ergonomic neck and shoulder stretches.",
            "Stay hydrated and avoid skipping regular meals.",
            "Practice gentle relaxation exercises and diaphragmatic breathing.",
            "Ensure a consistent sleep schedule of 7-8 hours."
        ],
        "when_to_consult": "Consult a doctor if headaches become progressively frequent, disturb nightly sleep, or fail to respond to standard lifestyle rest measures."
    },
    {
        "name": "Allergic Rhinitis (Hay Fever)",
        "category": "Allergic",
        "description": "An allergic inflammatory response of the nasal airways to inhaled environmental allergens.",
        "symptoms": ["runny nose", "sneezing", "stuffy nose", "itching", "fatigue"],
        "precautions": [
            "Identify and minimize exposure to known environmental triggers like pollen, dust mites, or pet dander.",
            "Keep indoor windows closed during high-pollen seasons.",
            "Use isotonic saline nasal sprays or rinses to clear nasal passages naturally.",
            "Shower and change clothes after extended outdoor activities."
        ],
        "when_to_consult": "Consult an allergist or general practitioner if nasal obstruction interferes with sleep, causes chronic sinus discomfort, or triggers wheezing."
    },
    {
        "name": "Acute Sinusitis (Sinus-related Illness)",
        "category": "Respiratory",
        "description": "Inflammation or infection of the tissue lining the paranasal sinuses.",
        "symptoms": ["headache", "stuffy nose", "runny nose", "fever", "fatigue", "cough"],
        "precautions": [
            "Use warm compresses over the forehead, cheeks, and eyes to ease facial pressure.",
            "Perform warm steam inhalation for 10-15 minutes twice daily.",
            "Sleep with the head slightly elevated to promote sinus drainage.",
            "Drink ample warm broths and herbal teas."
        ],
        "when_to_consult": "Consult a physician if facial pain is severe, symptoms last beyond 10 days without relief, or if swelling appears around the eyes."
    },
    {
        "name": "Gastroenteritis (Stomach Flu)",
        "category": "Gastrointestinal",
        "description": "Inflammation of the stomach and intestines typically caused by viral or bacterial agents.",
        "symptoms": ["stomach pain", "vomiting", "nausea", "diarrhea", "fever", "fatigue", "chills"],
        "precautions": [
            "Prevent dehydration by taking small, frequent sips of oral rehydration solution (ORS).",
            "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast) once vomiting subsides.",
            "Avoid dairy, greasy foods, caffeine, and spicy seasonings during acute recovery.",
            "Wash hands thoroughly with soap and water after using the restroom."
        ],
        "when_to_consult": "Seek immediate medical attention if you cannot keep fluids down for over 24 hours, notice blood in stool/vomit, or exhibit signs of dehydration (extreme thirst, dry mouth, little urination)."
    },
    {
        "name": "Food-Related Gastrointestinal Illness (Food Poisoning)",
        "category": "Gastrointestinal",
        "description": "An acute gastrointestinal condition resulting from ingestion of contaminated food or water.",
        "symptoms": ["stomach pain", "vomiting", "nausea", "diarrhea", "fever", "loss of appetite"],
        "precautions": [
            "Allow the stomach to settle by abstaining from solid foods for several hours.",
            "Rehydrate slowly with clear liquids and electrolyte solutions.",
            "Rest quietly and avoid physical exertion.",
            "Maintain food safety: discard suspected spoiled foods and sanitize kitchen surfaces."
        ],
        "when_to_consult": "Consult a healthcare professional if diarrhea lasts longer than 2 days, high fever is present, or vomiting prevents oral rehydration."
    },
    {
        "name": "Gastroesophageal Reflux Pattern (GERD / Acid Reflux)",
        "category": "Gastrointestinal",
        "description": "A digestive condition where stomach acid flows back into the esophagus.",
        "symptoms": ["acid reflux", "stomach pain", "nausea", "cough", "sore throat"],
        "precautions": [
            "Eat smaller, more frequent meals rather than large heavy dinners.",
            "Avoid lying down for at least 2 to 3 hours after eating.",
            "Elevate the head of your bed by 6 inches.",
            "Limit intake of citrus, tomatoes, chocolate, caffeine, and spicy or fried items."
        ],
        "when_to_consult": "Seek medical evaluation if swallowing becomes difficult or painful, or if acid symptoms are frequent, severe, or accompany unexplained weight loss."
    },
    {
        "name": "Urinary Tract Infection Pattern (UTI)",
        "category": "Urinary",
        "description": "An infection in any part of the urinary system, commonly the bladder or urethra.",
        "symptoms": ["burning urination", "frequent urination", "stomach pain", "fatigue", "fever"],
        "precautions": [
            "Increase daily water consumption to help flush urinary passages.",
            "Do not delay urination when the urge occurs.",
            "Avoid bladder irritants like alcohol, caffeine, and carbonated beverages.",
            "Maintain proper personal hygiene."
        ],
        "when_to_consult": "Consult a doctor for clinical urine analysis. Antibiotic therapy may be required. Seek urgent care if back/flank pain, chills, or high fever develops."
    },
    {
        "name": "COVID-19-like Illness Pattern",
        "category": "Respiratory / Infectious",
        "description": "A viral syndrome presenting with characteristic systemic and respiratory features.",
        "symptoms": ["fever", "cough", "fatigue", "body pain", "loss of smell", "loss of taste", "sore throat", "headache", "stuffy nose"],
        "precautions": [
            "Isolate in a separate room to protect household members.",
            "Monitor blood oxygen saturation with a pulse oximeter if available.",
            "Rest, hydrate, and maintain good indoor ventilation.",
            "Wear a high-filtration mask if sharing common living spaces."
        ],
        "when_to_consult": "Seek urgent emergency medical care if oxygen levels drop below 94%, or if you experience difficulty breathing, persistent chest pain, or confusion."
    },
    {
        "name": "Acute Pharyngitis / Tonsillitis Pattern",
        "category": "Respiratory",
        "description": "Inflammation of the pharynx or tonsils presenting primarily with severe throat symptoms.",
        "symptoms": ["sore throat", "fever", "headache", "fatigue", "loss of appetite"],
        "precautions": [
            "Gargle with warm salt water (1/2 teaspoon salt in a glass of warm water) 3-4 times daily.",
            "Sip soothing warm liquids like warm water with honey and lemon.",
            "Rest your voice and avoid exposure to cigarette smoke or air pollutants.",
            "Consume soft, non-irritating foods like soups and puddings."
        ],
        "when_to_consult": "Consult a medical professional if you have difficulty swallowing or breathing, severe unilateral throat pain, or swollen tender neck lymph nodes."
    },
    {
        "name": "Acute Bronchitis Pattern",
        "category": "Respiratory",
        "description": "Inflammation of the lining of the bronchial tubes, commonly following a viral cold.",
        "symptoms": ["cough", "fatigue", "chest tightness", "sore throat", "body pain", "mild fever"],
        "precautions": [
            "Use a cool-mist humidifier or breathe steam from a warm shower.",
            "Avoid lung irritants, including smoking, dust, and cold dry outdoor air.",
            "Drink 8-10 glasses of water daily to thin bronchial secretions.",
            "Rest and avoid vigorous cardiovascular exercise until the cough clears."
        ],
        "when_to_consult": "Consult a physician if cough produces rust-colored or bloody mucus, lasts more than 3 weeks, or is accompanied by high fever or shortness of breath."
    },
    {
        "name": "Allergic Skin Reaction / Urticaria Pattern",
        "category": "Allergic",
        "description": "An allergic hypersensitivity response in the skin resulting in pruritus and rash.",
        "symptoms": ["skin rash", "itching", "sweating"],
        "precautions": [
            "Apply cool, damp compresses to soothe irritated skin areas.",
            "Wear loose, soft cotton clothing to prevent friction.",
            "Avoid hot baths; use lukewarm water with mild, fragrance-free cleansers.",
            "Refrain from scratching to prevent secondary skin bacterial infections."
        ],
        "when_to_consult": "Seek emergency medical attention if the rash is accompanied by swelling of the lips, tongue, or throat, or any difficulty breathing."
    },
    {
        "name": "Dengue-like Febrile Illness Pattern",
        "category": "General / Infectious",
        "description": "A mosquito-borne viral pattern characterized by abrupt high fever, severe headache, and musculoskeletal pain.",
        "symptoms": ["fever", "headache", "body pain", "joint pain", "fatigue", "skin rash", "nausea", "vomiting"],
        "precautions": [
            "Ensure absolute bed rest and copious hydration with oral fluids and coconut water.",
            "Prevent further mosquito bites by using mosquito nets and indoor repellents.",
            "Avoid aspirin or NSAIDs as they increase bleeding risks; consult a physician for fever management.",
            "Monitor for warning signs such as abdominal pain or mucosal bleeding."
        ],
        "when_to_consult": "Seek immediate emergency hospital evaluation if you develop severe abdominal pain, persistent vomiting, bleeding from gums/nose, or extreme fatigue."
    },
    {
        "name": "Musculoskeletal Strain / Physical Overexertion",
        "category": "Musculoskeletal",
        "description": "Tension and inflammation in muscle tissues following intense physical exertion or postural stress.",
        "symptoms": ["body pain", "fatigue", "joint pain"],
        "precautions": [
            "Rest the affected muscles and avoid aggravating strenuous activities.",
            "Apply cold therapy (ice packs wrapped in cloth) for 15-20 minutes during the first 48 hours.",
            "Transition to gentle heat and light stretching after initial acute soreness diminishes.",
            "Ensure adequate hydration and electrolyte intake."
        ],
        "when_to_consult": "Consult an orthopedic or sports medicine doctor if pain is debilitating, accompanied by joint swelling or numbness, or fails to improve within 7 days."
    },
    {
        "name": "Dehydration Syndrome",
        "category": "General",
        "description": "Deficiency of water and essential electrolytes in the body caused by inadequate fluid intake or excess fluid loss.",
        "symptoms": ["fatigue", "dizziness", "headache", "loss of appetite"],
        "precautions": [
            "Drink oral rehydration solutions (ORS) containing balanced electrolytes and glucose.",
            "Sip fluids slowly rather than gulping large quantities all at once.",
            "Rest in a cool, shaded environment.",
            "Avoid dehydrating beverages such as alcohol, caffeinated sodas, and energy drinks."
        ],
        "when_to_consult": "Seek emergency medical care if unable to retain fluids, if confusion or severe dizziness occurs upon standing, or if urine output ceases."
    },
    {
        "name": "Peptic Gastritis Pattern",
        "category": "Gastrointestinal",
        "description": "Irritation and inflammation of the protective mucosal lining of the stomach.",
        "symptoms": ["stomach pain", "nausea", "loss of appetite", "acid reflux", "vomiting"],
        "precautions": [
            "Eat bland, low-acid meals (such as oatmeal, steamed vegetables, and broth).",
            "Avoid NSAID pain relievers (like ibuprofen), alcohol, and tobacco, which irritate the stomach lining.",
            "Eat smaller portions on a regular schedule; avoid going long periods with an empty stomach.",
            "Avoid late-night eating within 3 hours of sleeping."
        ],
        "when_to_consult": "Consult a gastroenterologist if stomach pain is persistent or severe, or seek immediate emergency care if vomit contains blood or coffee-ground material."
    },
    {
        "name": "Heat Exhaustion Pattern",
        "category": "General",
        "description": "A heat-related illness resulting from prolonged exposure to high ambient temperatures and inadequate fluid replacement.",
        "symptoms": ["dizziness", "fatigue", "headache", "nausea", "sweating", "body pain"],
        "precautions": [
            "Move immediately to an air-conditioned room or cool shaded spot.",
            "Loosen tight clothing and remove unnecessary outer garments.",
            "Apply cool, wet cloths or take a cool sponge bath.",
            "Sip cool water or electrolyte-enhanced drinks slowly."
        ],
        "when_to_consult": "Seek immediate emergency help if body temperature exceeds 104°F (40°C), if confusion develops, or if the individual loses consciousness (risk of heat stroke)."
    }
]

def get_all_conditions() -> List[Dict[str, Any]]:
    """Returns the complete list of conditions from the knowledge base."""
    return MEDICAL_KNOWLEDGE_BASE

def get_condition_by_name(name: str) -> Dict[str, Any]:
    """Retrieves a single condition by name (case-insensitive)."""
    for cond in MEDICAL_KNOWLEDGE_BASE:
        if cond["name"].lower() == name.lower():
            return cond
    return None

def get_all_canonical_symptoms() -> List[str]:
    """Returns sorted list of all canonical symptoms recognized by the system."""
    return sorted(list(SYMPTOM_DICTIONARY.keys()))

def get_categories() -> List[str]:
    """Returns unique categories present in the knowledge base."""
    cats = sorted(list({c["category"] for c in MEDICAL_KNOWLEDGE_BASE}))
    return cats
