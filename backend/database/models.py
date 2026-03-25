"""
Database models for CyberGuard
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Analysis(Base):
    """Analysis history model"""
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    is_bullying = Column(Boolean, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)
    category = Column(String(50), nullable=False)
    highlighted_words = Column(Text, nullable=True)  # JSON string
    recommended_action = Column(String(200), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
class APIKey(Base):
    """API Key model"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True)
    name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
class Stats(Base):
    """Statistics model"""
    __tablename__ = "stats"
    
    id = Column(Integer, primary_key=True, index=True)
    total_analyzed = Column(Integer, default=0)
    bullying_detected = Column(Integer, default=0)
    safe_content = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow)
