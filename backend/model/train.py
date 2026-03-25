"""
CyberGuard ML Model Training Script
Trains a cyberbullying detection model using scikit-learn
"""

import os
import sys
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
from sklearn.pipeline import Pipeline
import joblib
import logging

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from model.preprocess import clean_text, detect_category

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'saved_model')
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data')

def create_sample_dataset():
    """Create a comprehensive sample dataset for training"""
    logger.info("Creating sample dataset...")
    
    data = {
        'text': [
            # NOT CYBERBULLYING - Various safe content
            "Hey, how are you doing today?",
            "Great job on your project!",
            "I love spending time with my friends",
            "Have a nice day!",
            "Thanks for sharing this",
            "Congratulations on your success",
            "You're so talented!",
            "Let's hang out sometime",
            "This is really interesting",
            "I appreciate your help",
            "What a beautiful day!",
            "I can't wait for the weekend",
            "That movie was amazing",
            "Love this song!",
            "Good morning everyone",
            "Happy birthday!",
            "Well done!",
            "I agree with you",
            "That's so cool",
            "Thanks for the advice",
            "You're welcome!",
            "Nice work",
            "See you later",
            "Take care",
            "Sounds good",
            
            # LOW SEVERITY - Mild teasing, annoying
            "You're so annoying",
            "This is dumb",
            "You suck at this",
            "That's the worst idea ever",
            "Nobody likes you",
            "You're such a loser",
            "This is boring",
            "You're weird",
            "That's so lame",
            "You're such a nerd",
            "Stop being weird",
            "Nobody asked you",
            "Whatever",
            "That's stupid",
            "You're annoying me",
            
            # MEDIUM SEVERITY - Insults, personal attacks
            "I hate you so much",
            "You're ugly and stupid",
            "You're an idiot",
            "You're worthless",
            "Nobody wants you around",
            "You're pathetic",
            "You should just quit",
            "You're a failure",
            "You're the worst",
            "Go away",
            "Nobody cares about you",
            "You're so annoying",
            "Just die already",
            "You make me sick",
            "You're so annoying",
            
            # HIGH SEVERITY - Threats, hate speech
            "I hope you die",
            "You should kill yourself",
            "I'm going to hurt you",
            "Nobody would miss you if you were gone",
            "You deserve to die",
            "Go kill yourself",
            "You're better off dead",
            "I'm going to find you and hurt you",
            "You should be dead",
            "Everyone hates you, kill yourself",
            
            # HARASSMENT
            "stop messaging me you idiot",
            "you're so dumb delete your account",
            "what's wrong with you freak",
            "nobody wants to see your face",
            "shut up nobody cares",
            
            # BODY SHAMING
            "you're so fat nobody likes you",
            "you're too ugly to be here",
            "lose some weight fatty",
            "you're too skinny eat something",
            "your body is disgusting",
        ],
        'label': [
            # Not cyberbullying (0)
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            # Low severity (1)
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            # Medium severity (2)
            2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
            # High severity (3)
            3,3,3,3,3,3,3,3,3,3,
            # Harassment (4)
            4,4,4,4,4,
            # Body shaming (5)
            5,5,5,5,5,
        ]
    }
    
    return pd.DataFrame(data)

def load_external_dataset():
    """Try to load external dataset from HuggingFace"""
    try:
        from datasets import load_dataset
        logger.info("Loading dataset from HuggingFace...")
        dataset = load_dataset("hate_speech18")
        
        # Convert to DataFrame
        df = pd.DataFrame(dataset['train'])
        
        # Map labels
        label_map = {0: 'not_cyberbullying', 1: 'cyberbullying'}
        df['label'] = df['label'].map(label_map)
        
        return df[['text', 'label']]
    except Exception as e:
        logger.warning(f"Could not load external dataset: {e}")
        return None

def preprocess_data(df):
    """Preprocess the dataset"""
    logger.info("Preprocessing data...")
    
    # Clean text
    df['cleaned_text'] = df['text'].apply(clean_text)
    
    # Remove empty texts
    df = df[df['cleaned_text'].str.len() > 0]
    
    return df

def train_model():
    """Train the cyberbullying detection model"""
    logger.info("Starting model training...")
    
    # Try to load external dataset first
    df = load_external_dataset()
    
    # If no external dataset, use sample
    if df is None:
        logger.info("Using sample dataset...")
        df = create_sample_dataset()
    
    # Preprocess
    df = preprocess_data(df)
    
    logger.info(f"Dataset size: {len(df)} samples")
    
    # Convert to binary: 0 = safe, 1 = bullying
    # We train a binary classifier first, then add severity
    df['binary_label'] = df['label'].apply(lambda x: 0 if x == 0 or x == 'not_cyberbullying' else 1)
    
    # Split data
    X = df['cleaned_text']
    y = df['binary_label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    logger.info(f"Training set: {len(X_train)}, Test set: {len(X_test)}")
    
    # Create TF-IDF vectorizer
    logger.info("Creating TF-IDF features...")
    vectorizer = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train Logistic Regression
    logger.info("Training Logistic Regression model...")
    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        class_weight='balanced',
        C=1.0
    )
    model.fit(X_train_vec, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    logger.info(f"Model Accuracy: {accuracy:.4f}")
    logger.info(f"F1 Score: {f1:.4f}")
    logger.info("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and vectorizer
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    model_path = os.path.join(MODEL_DIR, 'cyberbullying_model.pkl')
    vectorizer_path = os.path.join(MODEL_DIR, 'vectorizer.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    logger.info(f"Model saved to: {model_path}")
    logger.info(f"Vectorizer saved to: {vectorizer_path}")
    
    # Save model info
    model_info = {
        'accuracy': accuracy,
        'f1_score': f1,
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'features': len(vectorizer.get_feature_names_out()),
        'model_type': 'LogisticRegression',
        'vectorizer_type': 'TF-IDF'
    }
    
    info_path = os.path.join(MODEL_DIR, 'model_info.json')
    with open(info_path, 'w') as f:
        json.dump(model_info, f, indent=2)
    
    logger.info(f"Model info saved to: {info_path}")
    
    return model, vectorizer

if __name__ == "__main__":
    train_model()
    print("\n✅ Training complete!")
