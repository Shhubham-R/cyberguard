"""
CyberGuard Prediction Module
Uses keyword-based detection as primary, ML as backup
"""

import os
import pickle
import joblib
from typing import Tuple, Dict, Any

# Model directory
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_model')

_model = None
_vectorizer = None
_model_info = None

def load_model() -> Tuple[Any, Any]:
    """Load the trained model and vectorizer"""
    global _model, _vectorizer
    
    model_path = os.path.join(MODEL_DIR, 'cyberbullying_model.pkl')
    vectorizer_path = os.path.join(MODEL_DIR, 'vectorizer.pkl')
    
    if os.path.exists(model_path) and os.path.exists(vectorizer_path):
        _model = joblib.load(model_path)
        _vectorizer = joblib.load(vectorizer_path)
        return _model, _vectorizer
    
    return None, None

def get_model_info() -> Dict:
    """Get model information"""
    global _model_info
    
    info_path = os.path.join(MODEL_DIR, 'model_info.json')
    
    if os.path.exists(info_path):
        import json
        with open(info_path, 'r') as f:
            _model_info = json.load(f)
        return _model_info
    
    return {
        'accuracy': 0.0,
        'f1_score': 0.0,
        'model_type': 'demo',
        'training_samples': 0
    }

def predict(text: str) -> Dict[str, Any]:
    """Predict cyberbullying in text - uses keyword detection as primary"""
    
    # Import preprocessing functions
    from model.preprocess import (
        clean_text, 
        get_severity_from_keywords, 
        get_severity,
        highlight_toxic_words,
        get_recommended_action
    )
    
    # FIRST: Use keyword-based detection (more reliable)
    severity, category, keywords_found = get_severity_from_keywords(text)
    
    if severity:  # Found keywords!
        confidence = 0.95 if severity == 'high' else 0.85 if severity == 'medium' else 0.70
        highlighted = highlight_toxic_words(text)
        
        return {
            'text': text,
            'is_bullying': True,
            'confidence': confidence,
            'severity': severity,
            'category': category,
            'highlighted_words': keywords_found if keywords_found else highlighted,
            'recommended_action': get_recommended_action(severity, category)
        }
    
    # SECOND: If no keywords found, use ML model as backup
    global _model, _vectorizer
    
    if _model is None or _vectorizer is None:
        _model, _vectorizer = load_model()
    
    if _model is None or _vectorizer is None:
        # No ML model - use basic detection
        return basic_detection(text)
    
    # Use ML model
    cleaned = clean_text(text)
    X = _vectorizer.transform([cleaned])
    prediction = _model.predict(X)[0]
    probabilities = _model.predict_proba(X)[0]
    confidence = float(max(probabilities))
    
    # If ML says bullying with good confidence
    if prediction == 1 and confidence >= 0.6:
        severity = get_severity(confidence)
        category = 'harassment'  # Default category from ML
        highlighted = highlight_toxic_words(text)
        
        return {
            'text': text,
            'is_bullying': True,
            'confidence': confidence,
            'severity': severity,
            'category': category,
            'highlighted_words': highlighted,
            'recommended_action': get_recommended_action(severity, category)
        }
    
    # Safe content
    return {
        'text': text,
        'is_bullying': False,
        'confidence': confidence,
        'severity': 'none',
        'category': 'not_cyberbullying',
        'highlighted_words': [],
        'recommended_action': get_recommended_action('none', 'not_cyberbullying')
    }

def basic_detection(text: str) -> Dict[str, Any]:
    """Basic rule-based detection as last fallback"""
    from model.preprocess import (
        highlight_toxic_words,
        get_recommended_action,
        get_severity_from_keywords,
        TOXIC_KEYWORDS
    )
    
    text_lower = text.lower()
    
    # Check for any toxic keywords
    severity, category, keywords = get_severity_from_keywords(text)
    
    if severity:
        return {
            'text': text,
            'is_bullying': True,
            'confidence': 0.9,
            'severity': severity,
            'category': category,
            'highlighted_words': keywords,
            'recommended_action': get_recommended_action(severity, category)
        }
    
    # Check ML model if available
    global _model, _vectorizer
    
    try:
        if _model is None or _vectorizer is None:
            _model, _vectorizer = load_model()
            
        if _model and _vectorizer:
            from model.preprocess import clean_text
            cleaned = clean_text(text)
            X = _vectorizer.transform([cleaned])
            prediction = _model.predict(X)[0]
            prob = _model.predict_proba(X)[0]
            confidence = float(max(prob))
            
            if prediction == 1:
                return {
                    'text': text,
                    'is_bullying': True,
                    'confidence': confidence,
                    'severity': 'low' if confidence < 0.7 else 'medium',
                    'category': 'harassment',
                    'highlighted_words': [],
                    'recommended_action': get_recommended_action('low', 'harassment')
                }
    except:
        pass
    
    # Default safe
    return {
        'text': text,
        'is_bullying': False,
        'confidence': 0.95,
        'severity': 'none',
        'category': 'not_cyberbullying',
        'highlighted_words': [],
        'recommended_action': 'This content appears safe.'
    }

def predict_batch(texts: list) -> list:
    """Predict cyberbullying for multiple texts"""
    return [predict(text) for text in texts]

# Auto-load model on import
try:
    load_model()
    get_model_info()
except Exception as e:
    print(f"Warning: Could not load model: {e}")
