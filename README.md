# 🛡️ CyberGuard - Intelligent Cyberbullying Detection System

A production-ready, full-stack cyberbullying detection system that can be embedded into social media platforms, forums, or used as a standalone moderation tool.

![CyberGuard](https://img.shields.io/badge/CyberGuard-v1.0.0-00d4ff?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?style=flat-square)

## ✨ Features

### Core Detection
- 🔍 **Real-time text analysis** - Instant analysis of any text
- ⚖️ **Binary Classification** - Bullying vs Non-bullying with confidence score
- ⚡ **Severity Detection** - Low, Medium, High severity levels
- 🏷️ **Category Detection** - Harassment, Hate Speech, Threats, Personal Attacks, Body Shaming
- 🔴 **Toxic Word Highlighting** - Highlights words that triggered detection

### Dashboard & Analytics
- 📊 **Live Statistics** - Total analyzed, bullying detected, safe content
- 📈 **Charts** - Pie charts, bar charts, trend lines
- 📝 **History** - Session history with timestamps

### Additional Features
- 📁 **Bulk Analysis** - Upload CSV/TXT files for batch processing
- 💬 **Comment Feed Simulator** - Realistic social media comment section
- 🌐 **REST API** - Full API with Swagger documentation
- 🐳 **Docker Support** - Easy deployment with Docker Compose

## 🏗️ Tech Stack

### Backend
- **Python 3.10+**
- **FastAPI** - Modern async web framework
- **scikit-learn** - Machine learning
- **SQLAlchemy** - Database ORM
- **TF-IDF + Logistic Regression** - ML Model

### Frontend
- **React 18** with Vite
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **Lucide React** - Icons

## 📁 Project Structure

```
cyberguard/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── schemas.py           # Pydantic schemas
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile
│   ├── model/
│   │   ├── train.py         # Model training script
│   │   ├── predict.py       # Prediction logic
│   │   ├── preprocess.py    # Text preprocessing
│   │   └── saved_model/     # Trained model files
│   ├── database/
│   │   ├── models.py        # SQLAlchemy models
│   │   └── db.py           # Database connection
│   └── routers/
│       ├── analyze.py       # /api/analyze endpoints
│       ├── stats.py        # /api/stats endpoints
│       └── history.py      # /api/history endpoints
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx        # Main app
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Option 1: Manual Installation

#### Backend Setup
```bash
# Navigate to backend directory
cd cyberguard/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model (optional - model already trained)
python model/train.py

# Start the backend server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd cyberguard/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d
```

## � API Usage

### Analyze Single Text
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "You are so ugly and nobody likes you",
    "api_key": "demo-key-123"
  }'
```

### Analyze Bulk Texts
```bash
curl -X POST http://localhost:8000/api/analyze/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["text 1", "text 2", "text 3"],
    "api_key": "demo-key-123"
  }'
```

### Get Statistics
```bash
curl http://localhost:8000/api/stats
```

### Get History
```bash
curl http://localhost:8000/api/history?page=1&page_size=10
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze single text |
| POST | `/api/analyze/bulk` | Analyze multiple texts |
| GET | `/api/stats` | Get system statistics |
| GET | `/api/history` | Get analysis history |
| DELETE | `/api/history` | Clear history |
| GET | `/docs` | Swagger API docs |

## 🎨 UI Pages

1. **Home** (`/`) - Main text analyzer
2. **Dashboard** (`/dashboard`) - Statistics and charts
3. **Comment Feed** (`/simulate`) - Social media simulator
4. **Bulk** (`/bulk`) - File upload analyzer
5. **API** (`/api`) - API documentation

## 🔧 Training the Model

```bash
cd cyberguard/backend
python model/train.py
```

The model will:
1. Load/create dataset
2. Preprocess text
3. Train TF-IDF + Logistic Regression
4. Save to `model/saved_model/`

## 📝 Configuration

### Environment Variables (Backend)
Create `.env` file:
```env
DATABASE_URL=sqlite:///cyberguard.db
API_KEY=demo-key-123
MODEL_PATH=model/saved_model
```

## 🐛 Troubleshooting

### Backend Issues
```bash
# If model fails to load, retrain
python model/train.py

# Check database
ls -la *.db
```

### Frontend Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## 📄 License

MIT License - Feel free to use this project for learning or production.

---

**CyberGuard** - Protecting online communities through intelligent content moderation. 🛡️
