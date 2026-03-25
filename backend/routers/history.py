"""
CyberGuard API Router - History endpoints
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from schemas import HistoryResponse, HistoryItem
from database.db import get_db
from database.models import Analysis, Stats

router = APIRouter()

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Get analysis history"""
    # Calculate offset
    offset = (page - 1) * page_size
    
    # Get total count
    total = db.query(Analysis).count()
    
    # Get items
    items = db.query(Analysis)\
        .order_by(Analysis.timestamp.desc())\
        .offset(offset)\
        .limit(page_size)\
        .all()
    
    # Convert to response format
    history_items = []
    for item in items:
        history_items.append(HistoryItem(
            id=item.id,
            text=item.text[:100] + "..." if len(item.text) > 100 else item.text,
            is_bullying=item.is_bullying,
            confidence=item.confidence,
            severity=item.severity,
            category=item.category,
            timestamp=item.timestamp
        ))
    
    return HistoryResponse(
        items=history_items,
        total=total,
        page=page,
        page_size=page_size
    )

@router.delete("/history")
async def clear_history(db: Session = Depends(get_db)):
    """Clear all history"""
    db.query(Analysis).delete()
    db.query(Stats).update({'total_analyzed': 0, 'bullying_detected': 0, 'safe_content': 0})
    db.commit()
    
    return {"message": "History cleared successfully"}
