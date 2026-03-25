# 🛡️ CyberGuard - Intelligent Cyberbullying Detection System

> A full-stack cyberbullying detection system with ML-powered text analysis, dashboard analytics, and a social media comment simulator.

**Live Frontend:** https://shhubham-r.github.io/cyberguard/

**Backend API:** Deploy on Railway or Render (see below)

---

## 🚀 One-Click Backend Deploy

The backend requires Python/FastAPI hosting. The easiest way:

### Option 1: Railway (Recommended - 1 Click)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?template=https%3A%2F%2Fgithub.com%2FShhubham-R%2Fcyberguard)

1. Click the button above
2. Connect your GitHub repo (`Shhubham-R/cyberguard`)
3. Railway auto-detects the `backend/Dockerfile`
4. Add environment variable: `API_KEY=demo-key-123`
5. Click **Deploy** — done!
6. Copy your backend URL (e.g. `https://cyberguard.up.railway.app`)
7. Set it in GitHub repo: **Settings → Variables → New repository variable** → name: `CYBERGUARD_API_URL`, value: your backend URL

### Option 2: Render (Free Tier)

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add `API_KEY=demo-key-123` in Environment variables
5. Deploy and copy the URL

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
