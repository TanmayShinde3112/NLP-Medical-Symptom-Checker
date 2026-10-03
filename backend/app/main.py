"""
FastAPI Main Application Entrypoint for MedNLP.
AI Medical Symptom Intelligence Platform.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import init_db
from app.api.endpoints import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema on startup
    init_db()
    print("[MedNLP] Database schema verified and initialized.")
    yield
    print("[MedNLP] Engine shutdown gracefully.")

app = FastAPI(
    title="MedNLP - AI Medical Symptom Intelligence Platform",
    description=(
        "Advanced conversational NLP symptom intelligence engine. Demonstrates "
        "clinical text preprocessing, tokenization, lemmatization, semantic fuzzy matching, "
        "NegEx clinical negation analysis, and deterministic condition triage."
    ),
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite dev server default: http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router)

@app.get("/", summary="Root Welcome")
def root():
    return {
        "project": "MedNLP - Medical Symptom Checker Chatbot",
        "version": "1.0.0",
        "status": "Online",
        "documentation": "/docs",
        "health_check": "/api/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Prevents raw stack trace leak while providing clear API error response."""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "InternalServerError",
            "message": "An error occurred while processing the NLP symptom request. Please verify input.",
            "detail": str(exc)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
