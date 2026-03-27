# 🛡️ CyberGuard - Intelligent Cyberbullying Detection System

> A full-stack cyberbullying detection system with ML-powered text analysis, dashboard analytics, and a real-time comment simulator.

**Live Frontend:** https://shhubham-r.github.io/cyberguard/

**Backend:** Deployed locally — accessible via Cloudflare Tunnel

---

## 🚀 Quick Start (Any OS)

The easiest way to get everything running at once:

```bash
# Works on Windows, Linux, Mac — requires Python 3
python run.py
```

This automatically installs dependencies and starts both servers:
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend:** http://localhost:8000
- 📚 **API Docs:** http://localhost:8000/docs

---

## 🖥️ Local Deployment (GitHub Pages + Local Backend)

When running the backend on your local machine, use a Cloudflare tunnel to give it a public HTTPS URL that GitHub Pages can connect to.

### Option 1: Fully Automated (Linux/Mac) — Recommended ✅

```bash
./auto-start.sh
```

Does everything automatically:
1. Starts the FastAPI backend
2. Creates a Cloudflare tunnel with a public URL
3. Pushes the tunnel URL to GitHub Actions workflow
4. Triggers a frontend rebuild automatically
5. Keeps everything running

> ⚠️ **Note:** The tunnel URL changes every time you restart. The script auto-updates GitHub Actions so your site keeps working.

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

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze single text |
| POST | `/api/analyze/bulk` | Analyze multiple texts |
| GET | `/api/stats` | Get statistics |
| GET | `/api/history` | Get analysis history |
| DELETE | `/api/history` | Clear history |
| GET | `/health` | Health check |

**API Key:** `demo-key-123` (default)

**Example:**

```bash
curl -X POST "https://<your-api-url>/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "You are amazing!", "api_key": "demo-key-123"}'
```

---

## 📁 Project Structure

```
cyberguard-release/
├── run.py              # One-click start (any OS with Python)
├── auto-start.sh       # Full automation + tunnel + GitHub push (Linux/Mac)
├── start-server.sh     # Backend + tunnel, no GitHub push (Linux/Mac)
├── start-server.bat    # Backend only (Windows)
├── start.sh            # Full stack, no tunnel (Linux/Mac)
├── start.bat           # Full stack, no tunnel (Windows)
│
├── backend/            # FastAPI + ML model
│   ├── main.py         # App entry point
│   ├── model/          # TF-IDF + Logistic Regression
│   │   ├── predict.py
│   │   ├── preprocess.py
│   │   └── saved_model/
│   └── routers/        # analyze, history, stats
│
├── frontend/            # React + Vite + Tailwind
│   └── src/
│       ├── pages/       # Home, Dashboard, Bulk, API, Comment Feed
│       └── services/
│
└── .github/workflows/   # GitHub Pages deployment
```

---

## ✨ Features

- 🔍 **Real-time text analysis** with confidence scores
- ⚡ **Severity detection** — Low, Medium, High
- 🏷️ **Category detection** — Harassment, Hate Speech, Threats, Personal Attacks, Body Shaming
- 🔴 **Toxic word highlighting**
- 📊 **Dashboard** with live charts
- 💬 **Comment feed simulator** — realistic social media UI
- 📁 **Bulk CSV/TXT analysis**
- 🌐 **REST API** with Swagger docs at `/docs`

---

## 🧠 ML Model

- **Type:** TF-IDF + Logistic Regression
- **Training:** scikit-learn with balanced class weights
- **Features:** Unigrams + Bigrams (max 10,000 features)
- **Categories:** Binary (bullying / not bullying) with severity + category classification

To retrain with custom data:
```bash
cd backend/model
python train.py
```

---

**Built by [Shhubham-R](https://github.com/Shhubham-R)**

**Tech Stack:** FastAPI · React · Vite · Tailwind CSS · scikit-learn · Cloudflare Tunnel
