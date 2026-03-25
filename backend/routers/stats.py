"""
CyberGuard API Router - Statistics endpoints
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas import StatsResponse
from database.db import get_db
from database.models import Stats
from model.predict import get_model_info

router = APIRouter()

# Track startup time
import time
START_TIME = time.time()

@router.get("/stats", response_model=StatsResponse)
async def get_stats(db: Session = Depends(get_db)):
    """Get system statistics"""
    # Get stats from database
    stats = db.query(Stats).first()
    
    if stats is None:
        total_analyzed = 0
        bullying_detected = 0
        safe_content = 0
    else:
        total_analyzed = stats.total_analyzed
        bullying_detected = stats.bullying_detected
        safe_content = stats.safe_content
    
    # Get model info
    model_info = get_model_info()
    
    # Calculate uptime
    uptime_hours = (time.time() - START_TIME) / 3600
    
    return StatsResponse(
        total_analyzed=total_analyzed,
        bullying_detected=bullying_detected,
        safe_content=safe_content,
        accuracy=model_info.get('accuracy', 0.0),
        model_version="1.0.0",
        uptime_hours=round(uptime_hours, 2),
        mode="production" if model_info.get('model_type') != 'demo' else "demo"
    )
