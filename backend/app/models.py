from datetime import datetime, timezone
import json
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from app.database import Base

class AnalysisRecord(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    original_input = Column(Text, nullable=False)
    cleaned_text = Column(Text, nullable=False)
    tokens_json = Column(Text, nullable=False, default="[]")
    identified_symptoms_json = Column(Text, nullable=False, default="[]")
    matched_conditions_json = Column(Text, nullable=False, default="[]")
    top_condition = Column(String(255), nullable=True)
    top_match_score = Column(Float, default=0.0)
    emergency_alert = Column(Boolean, default=False)
    emergency_reasons_json = Column(Text, nullable=False, default="[]")
    processing_time_ms = Column(Float, default=0.0)

    @property
    def tokens(self):
        try:
            return json.loads(self.tokens_json)
        except Exception:
            return []

    @tokens.setter
    def tokens(self, val):
        self.tokens_json = json.dumps(val)

    @property
    def identified_symptoms(self):
        try:
            return json.loads(self.identified_symptoms_json)
        except Exception:
            return []

    @identified_symptoms.setter
    def identified_symptoms(self, val):
        self.identified_symptoms_json = json.dumps(val)

    @property
    def matched_conditions(self):
        try:
            return json.loads(self.matched_conditions_json)
        except Exception:
            return []

    @matched_conditions.setter
    def matched_conditions(self, val):
        self.matched_conditions_json = json.dumps(val)

    @property
    def emergency_reasons(self):
        try:
            return json.loads(self.emergency_reasons_json)
        except Exception:
            return []

    @emergency_reasons.setter
    def emergency_reasons(self, val):
        self.emergency_reasons_json = json.dumps(val)
