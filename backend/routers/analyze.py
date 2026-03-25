"""
CyberGuard API Router - Analysis endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import json

from schemas import AnalyzeRequest, AnalyzeResponse, BulkAnalyzeRequest, BulkAnalyzeResponse
from model.predict import predict, predict_batch
from database.db import get_db
from database.models import Analysis, Stats

router = APIRouter()

# Simple API key for demo (in production, use proper auth)
DEMO_API_KEY = "demo-key-123"

def verify_api_key(api_key: str = None):
    """Verify API key (demo mode accepts any key)"""
    if api_key is None:
        return True  # Allow in demo mode
    return True

def update_stats(db: Session, is_bullying: bool):
    """Update statistics"""
    stats = db.query(Stats).first()
    if stats is None:
        stats = Stats(total_analyzed=0, bullying_detected=0, safe_content=0)
        db.add(stats)
        db.commit()
        db.refresh(stats)
    
    stats.total_analyzed = (stats.total_analyzed or 0) + 1
    if is_bullying:
        stats.bullying_detected = (stats.bullying_detected or 0) + 1
    else:
        stats.safe_content = (stats.safe_content or 0) + 1
    stats.last_updated = datetime.utcnow()
    db.commit()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(
    request: AnalyzeRequest,
    db: Session = Depends(get_db)
):
    """Analyze a single text for cyberbullying"""
    # Verify API key
    verify_api_key(request.api_key)
    
    # Validate input
    if not request.text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Text cannot be empty"
        )
    
    # Get prediction
    result = predict(request.text)
    
    # Save to database
    analysis = Analysis(
        text=request.text,
        is_bullying=result['is_bullying'],
        confidence=result['confidence'],
        severity=result['severity'],
        category=result['category'],
        highlighted_words=json.dumps(result['highlighted_words']),
        recommended_action=result['recommended_action'],
        timestamp=datetime.utcnow()
    )
    db.add(analysis)
    
    # Update stats
    update_stats(db, result['is_bullying'])
    
    db.commit()
    db.refresh(analysis)
    
    return AnalyzeResponse(
        text=result['text'],
        is_bullying=result['is_bullying'],
        confidence=result['confidence'],
        severity=result['severity'],
        category=result['category'],
        highlighted_words=result['highlighted_words'],
        recommended_action=result['recommended_action'],
        analyzed_at=analysis.timestamp
    )

@router.post("/analyze/bulk", response_model=BulkAnalyzeResponse)
async def analyze_bulk(
    request: BulkAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """Analyze multiple texts at once"""
    # Verify API key
    verify_api_key(request.api_key)
    
    # Validate input
    if not request.texts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Texts array cannot be empty"
        )
    
    if len(request.texts) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 100 texts allowed per request"
        )
    
    # Get predictions
    results = predict_batch(request.texts)
    
    # Calculate summary
    bullying_count = sum(1 for r in results if r['is_bullying'])
    safe_count = len(results) - bullying_count
    high_severity = sum(1 for r in results if r['severity'] == 'high')
    
    # Save to database
    for result in results:
        analysis = Analysis(
            text=result['text'],
            is_bullying=result['is_bullying'],
            confidence=result['confidence'],
            severity=result['severity'],
            category=result['category'],
            highlighted_words=json.dumps(result['highlighted_words']),
            recommended_action=result['recommended_action'],
            timestamp=datetime.utcnow()
        )
        db.add(analysis)
        update_stats(db, result['is_bullying'])
    
    db.commit()
    
    # Build response
    response_results = []
    for result in results:
        response_results.append(AnalyzeResponse(
            text=result['text'],
            is_bullying=result['is_bullying'],
            confidence=result['confidence'],
            severity=result['severity'],
            category=result['category'],
            highlighted_words=result['highlighted_words'],
            recommended_action=result['recommended_action'],
            analyzed_at=datetime.utcnow()
        ))
    
    return BulkAnalyzeResponse(
        results=response_results,
        summary={
            "total": len(results),
            "bullying_count": bullying_count,
            "safe_count": safe_count,
            "high_severity": high_severity
        }
    )
