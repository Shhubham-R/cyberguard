# 🛡️ CyberGuard - Intelligent Cyberbullying Detection System

> A full-stack cyberbullying detection system with ML-powered text analysis, dashboard analytics, and a social media comment simulator.

**Live Frontend:** https://shhubham-r.github.io/cyberguard/

**Backend API:** Deploy on Railway or Render (see below)

---

## 🚀 One-Click Backend Deploy

The backend requires Python/FastAPI hosting. The easiest way:

---

## 🖥️ Full Stack (Local Development)

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Access at `http://localhost:3000` — frontend proxies `/api` to backend.

---

## 📁 Project Structure

```
cyberguard/
├── backend/          # FastAPI + ML model
│   ├── main.py       # App entry point
│   ├── model/        # TF-IDF + Logistic Regression
│   └── routers/      # API endpoints
├── frontend/         # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/    # Home, Dashboard, Bulk, API, Comment Feed
│   │   └── services/  # API client
│   └── vite.config.js
└── .github/workflows/ # GitHub Pages deployment
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze single text |
| POST | `/api/analyze/bulk` | Analyze multiple texts |
| GET | `/api/stats` | Get statistics |
| GET | `/api/history` | Get analysis history |
| DELETE | `/api/history` | Clear history |
| GET | `/api/health` | Health check |

**API Key:** `demo-key-123` (default)

---

## ✨ Features

- 🔍 **Real-time text analysis** with confidence scores
- ⚡ **Severity detection** — Low, Medium, High
- 🏷️ **Category detection** — Harassment, Hate Speech, Threats, Personal Attacks, Body Shaming
- 🔴 **Toxic word highlighting**
- 📊 **Dashboard** with live charts
- 💬 **Comment feed simulator** — realistic social media UI
- 📁 **Bulk CSV/TXT analysis**
- 🌐 **REST API** with Swagger docs

---

**Built with ❤️ by shubi** — Powered by TF-IDF + Logistic Regression
