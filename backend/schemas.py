"""
Pydantic schemas for CyberGuard API
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Analyze Request/Response
class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to analyze")
    api_key: Optional[str] = Field(None, description="API key for authentication")

class AnalyzeResponse(BaseModel):
    text: str
    is_bullying: bool
    confidence: float
    severity: str
    category: str
    highlighted_words: List[str]
    recommended_action: str
    analyzed_at: datetime = Field(default_factory=datetime.utcnow)

# Bulk Analyze
class BulkAnalyzeRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=100)
    api_key: Optional[str] = None

class BulkAnalyzeResponse(BaseModel):
    results: List[AnalyzeResponse]
    summary: dict

# Stats
class StatsResponse(BaseModel):
    total_analyzed: int
    bullying_detected: int
    safe_content: int
    accuracy: float
    model_version: str
    uptime_hours: float
    mode: str

# History
class HistoryItem(BaseModel):
    id: int
    text: str
    is_bullying: bool
    confidence: float
    severity: str
    category: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    items: List[HistoryItem]
    total: int
    page: int
    page_size: int

# Health
class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    mode: str
    version: str