"""
Improved text preprocessing with better keyword detection
"""

import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('punkt_tab', quiet=True)
except:
    pass

STOPWORDS = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# ENHANCED Toxic keywords with weights
TOXIC_KEYWORDS = {
    # High severity - threats
    'threats': [
        'kill yourself', 'kill yourself', 'kill you', 'suicide', 'murder', 'death', 
        'bomb', 'attack', 'shoot', 'stab', 'burn', 'attack', 'threat', 'dead',
        'hang yourself', 'jump off', 'slash wrists', 'od yourself', 'kill ur',
        'i hope you die', 'you should die', 'go die', 'drop dead', 'drop dead',
        'end your life', 'take your life', 'hurt yourself', 'harm yourself'
    ],
    # High severity - extreme insults
    'extreme': [
        'nigger', 'faggot', 'kike', 'spic', 'chink', 'wetback', 'raghead',
        'supremacy', 'genocide', 'slaughter', 'holocaust'
    ],
    # Medium severity - strong insults
    'harassment': [
        'stupid', 'idiot', 'dumb', 'moron', 'imbecile', 'retard', 'retarded',
        'loser', 'pathetic', 'worthless', 'disgusting', 'hate you', 'hate you',
        'nobody likes you', 'go away', 'shut up', 'shut up', 'leave',
        'get out', 'get lost', 'never talk', 'dont talk', 'stop talking'
    ],
    # Medium severity - personal attacks
    'personal_attack': [
        'ugly', 'fat', 'skinny', 'short', 'poor', 'failure', 'nasty', 
        'creep', 'weirdo', 'freak', 'disgusting', 'gross', 'horrible',
        'embarrassing', 'laughing stock', 'joke', 'waste', 'trash', 'scum'
    ],
    # Medium severity - body shaming
    'body_shaming': [
        'fat', 'ugly', 'skinny', 'bony', 'gross', 'whale', 'pig', 'cow', 
        'anorexic', 'bulimic', 'body', 'too fat', 'too skinny', 'too ugly',
        'lose weight', 'go eat', 'stop eating', 'fatass', 'fattie'
    ],
    # Low severity - mild insults
    'mild': [
        'annoying', 'boring', 'weird', 'lame', 'suck', 'sucks', 'worst',
        'bad', 'terrible', 'awful', 'useless', 'good for nothing', 'dumb'
    ]
}

# Build a flat set of all keywords for fast lookup
ALL_KEYWORDS = {}
for category, keywords in TOXIC_KEYWORDS.items():
    for kw in keywords:
        ALL_KEYWORDS[kw] = category

def clean_text(text: str) -> str:
    """Clean and preprocess text"""
    if not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    
    # Remove mentions and hashtags
    text = re.sub(r'@\w+|#\w+', '', text)
    
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text

def tokenize_and_clean(text: str) -> list:
    """Tokenize, remove stopwords, and lemmatize"""
    cleaned = clean_text(text)
    
    try:
        tokens = word_tokenize(cleaned)
    except:
        tokens = cleaned.split()
    
    tokens = [lemmatizer.lemmatize(word) for word in tokens 
              if word not in STOPWORDS and len(word) > 2]
    
    return tokens

def get_severity_from_keywords(text: str) -> tuple:
    """Determine severity based on keyword matching"""
    text_lower = text.lower()
    
    # Check for high severity (threats) first
    for keyword in TOXIC_KEYWORDS['threats']:
        if keyword in text_lower:
            return 'high', 'threats', [keyword]
    
    # Check for extreme (hate speech)
    for keyword in TOXIC_KEYWORDS['extreme']:
        if keyword in text_lower:
            return 'high', 'hate_speech', [keyword]
    
    # Check for medium severity
    for keyword in TOXIC_KEYWORDS['harassment']:
        if keyword in text_lower:
            return 'medium', 'harassment', [keyword]
    
    for keyword in TOXIC_KEYWORDS['personal_attack']:
        if keyword in text_lower:
            return 'medium', 'personal_attack', [keyword]
    
    for keyword in TOXIC_KEYWORDS['body_shaming']:
        if keyword in text_lower:
            return 'medium', 'body_shaming', [keyword]
    
    # Check for low severity
    for keyword in TOXIC_KEYWORDS['mild']:
        if keyword in text_lower:
            return 'low', 'mild_insult', [keyword]
    
    return None, None, []

def get_severity(confidence: float) -> str:
    """Determine severity based on ML confidence score"""
    if confidence < 0.5:
        return 'low'
    elif confidence < 0.75:
        return 'medium'
    else:
        return 'high'

def detect_category(text: str) -> str:
    """Detect the category of cyberbullying"""
    severity, category, _ = get_severity_from_keywords(text)
    if category:
        return category
    
    # Check ML model categories
    text_lower = text.lower()
    tokens = set(tokenize_and_clean(text))
    
    category_scores = {}
    
    for cat, keywords in TOXIC_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        category_scores[cat] = score
    
    if max(category_scores.values()) > 0:
        return max(category_scores, key=category_scores.get)
    
    return 'not_cyberbullying'

def highlight_toxic_words(text: str) -> list:
    """Find and highlight toxic words in text"""
    text_lower = text.lower()
    found_words = []
    
    # Check all categories
    for category, keywords in TOXIC_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                found_words.append(keyword)
    
    # Remove duplicates and limit
    seen = set()
    unique_words = []
    for word in found_words:
        if word not in seen:
            seen.add(word)
            unique_words.append(word)
    
    return unique_words[:10]

def get_recommended_action(severity: str, category: str) -> str:
    """Get recommended action based on severity and category"""
    actions = {
        'high': 'Remove this comment immediately. This content threatens harm and violates community guidelines.',
        'medium': 'Review this comment carefully. It contains inappropriate content that may violate guidelines.',
        'low': 'This comment may be borderline inappropriate. Consider monitoring.',
        'none': 'This content appears safe for posting.'
    }
    
    return actions.get(severity, 'Review this content.')
