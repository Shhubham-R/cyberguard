"""
CyberGuard - Intelligent Cyberbullying Detection System
FastAPI Backend Main Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from database.db import engine
from database.models import Base
from routers import analyze, stats, history

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model variable
model = None
vectorizer = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Create database tables
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Try to load ML model
    global model, vectorizer
    try:
        from model.predict import load_model
        model, vectorizer = load_model()
        logger.info("ML Model loaded successfully!")
    except Exception as e:
        logger.warning(f"Could not load ML model: {e}. Running in demo mode.")
        model = None
        vectorizer = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down CyberGuard...")

# Create FastAPI app
app = FastAPI(
    title="CyberGuard API",
    description="Intelligent Cyberbullying Detection System",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api", tags=["Analyze"])
app.include_router(stats.router, prefix="/api", tags=["Stats"])
app.include_router(history.router, prefix="/api", tags=["History"])

# Include model and vectorizer in app state
app.state.model = model
app.state.vectorizer = vectorizer

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "CyberGuard API",
        "version": "1.0.0",
        "description": "Intelligent Cyberbullying Detection System",
        "docs": "/docs",
        "status": "online" if model else "demo_mode"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "mode": "production" if model else "demo"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
