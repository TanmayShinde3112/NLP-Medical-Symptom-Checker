"""
Comprehensive Test Script for MedNLP Backend Endpoints.
Verifies all API routes, database transactions, NLP pipeline, and safety mechanisms.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

# Initialize database schema
init_db()
client = TestClient(app)

def test_endpoints():
    print(">>> Testing GET /")
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.status_code}"
    print("    Root OK:", res.json()["project"])

    print(">>> Testing GET /api/health")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    assert res.json()["status"] == "healthy"
    print("    Health OK:", res.json())

    print(">>> Testing GET /api/stats")
    res = client.get("/api/stats")
    assert res.status_code == 200, f"Stats failed: {res.status_code}"
    print("    Stats OK:", res.json()["knowledge_base_conditions"], "conditions in KB")

    print(">>> Testing POST /api/analyze (Multi-symptom query)")
    res = client.post("/api/analyze", json={"text": "I have fever, headache and body pain."})
    assert res.status_code == 200, f"Analyze failed: {res.status_code}"
    data = res.json()
    assert data["success"] is True
    assert "fever" in data["identified_symptoms"]
    assert "headache" in data["identified_symptoms"]
    assert "body pain" in data["identified_symptoms"]
    assert len(data["possible_conditions"]) > 0
    print("    Analyze Multi-symptom OK. Identified:", data["identified_symptoms"])
    analysis_id = data["id"]

    print(">>> Testing POST /api/analyze (Synonym normalization)")
    res = client.post("/api/analyze", json={"text": "I have head pain and high temperature."})
    assert res.status_code == 200
    syn_data = res.json()
    assert "headache" in syn_data["identified_symptoms"]
    assert "fever" in syn_data["identified_symptoms"]
    print("    Synonym Mapping OK. Identified:", syn_data["identified_symptoms"])

    print(">>> Testing POST /api/analyze (RapidFuzz typo resilience)")
    res = client.post("/api/analyze", json={"text": "I have hedache and feever."})
    assert res.status_code == 200
    typo_data = res.json()
    assert "headache" in typo_data["identified_symptoms"]
    assert "fever" in typo_data["identified_symptoms"]
    print("    Fuzzy Typo OK. Identified:", typo_data["identified_symptoms"])

    print(">>> Testing POST /api/analyze (Negation Scope Analysis)")
    res = client.post("/api/analyze", json={"text": "I have headache, but no fever and no vomiting."})
    assert res.status_code == 200
    neg_data = res.json()
    assert "headache" in neg_data["identified_symptoms"]
    assert "fever" not in neg_data["identified_symptoms"]
    assert "vomiting" not in neg_data["identified_symptoms"]
    print("    Negation OK. Identified only positive symptoms:", neg_data["identified_symptoms"])

    print(">>> Testing POST /api/analyze (Coordinated List Negation)")
    res = client.post("/api/analyze", json={"text": "I have headache but no cough, cold, or fever."})
    assert res.status_code == 200
    list_neg_data = res.json()
    assert "headache" in list_neg_data["identified_symptoms"]
    assert "fever" not in list_neg_data["identified_symptoms"]
    assert "cough" not in list_neg_data["identified_symptoms"]
    print("    Coordinated List Negation OK:", list_neg_data["identified_symptoms"])

    print(">>> Testing POST /api/analyze (Emergency Red Flag detection)")
    res = client.post("/api/analyze", json={"text": "I have severe chest pain and difficulty breathing."})
    assert res.status_code == 200
    em_data = res.json()
    assert em_data["emergency_alert"] is True
    assert len(em_data["emergency_reasons"]) > 0
    print("    Emergency Red Flag OK:", em_data["emergency_reasons"])

    print(">>> Testing POST /api/nlp/process (Dedicated NLP Sandbox)")
    res = client.post("/api/nlp/process", json={"text": "My stomach hurts and I am throwing up."})
    assert res.status_code == 200
    sandbox_data = res.json()
    assert "stomach pain" in sandbox_data["identified_symptoms"]
    assert "vomiting" in sandbox_data["identified_symptoms"]
    assert "token_details" in sandbox_data["pipeline"]
    print("    NLP Sandbox OK. Tokens:", len(sandbox_data["pipeline"]["tokens"]))

    print(">>> Testing GET /api/history")
    res = client.get("/api/history")
    assert res.status_code == 200
    history = res.json()
    assert len(history) > 0
    print(f"    History OK: Found {len(history)} stored records")

    if analysis_id:
        print(f">>> Testing GET /api/history/{analysis_id}")
        res = client.get(f"/api/history/{analysis_id}")
        assert res.status_code == 200
        print("    History Detail OK for ID:", analysis_id)

    print(">>> Testing GET /api/knowledge-base")
    res = client.get("/api/knowledge-base")
    assert res.status_code == 200
    kb = res.json()
    assert kb["total_conditions"] >= 20
    assert len(kb["categories"]) >= 6
    print(f"    Knowledge Base OK: {kb['total_conditions']} conditions across categories: {kb['categories']}")

    print(">>> Testing GET /api/knowledge-base/{condition}")
    res = client.get("/api/knowledge-base/Common%20Cold")
    assert res.status_code == 200
    print("    Knowledge Base Condition Detail OK:", res.json()["name"])

    print(">>> Testing Validation & Error Handling (Empty input)")
    res = client.post("/api/analyze", json={"text": "   "})
    assert res.status_code == 400 or res.status_code == 422
    print("    Empty input validation OK:", res.status_code)

    print("\n" + "="*60)
    print(">>> ALL MEDNLP BACKEND ENDPOINT TESTS PASSED WITH 100% SUCCESS! <<<")
    print("="*60)

if __name__ == "__main__":
    test_endpoints()
