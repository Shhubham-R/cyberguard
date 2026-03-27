# 🛡️ CyberGuard - Intelligent Cyberbullying Detection System

> A full-stack cyberbullying detection system with ML-powered text analysis, dashboard analytics, and a real-time comment simulator.

**Live Frontend:** https://shhubham-r.github.io/cyberguard/

**Backend:** Deployed locally — accessible via Cloudflare Tunnel

---

## 🚀 Currently Deployed (Local Backend + Tunnel)

The backend runs on a local machine with a Cloudflare tunnel providing public access. No cloud hosting required!

```bash
# Navigate to project
cd cyberguard-release

# Start everything (backend + tunnel) — fully automatic
./auto-start.sh
```

The script will:
1. Start the FastAPI backend on `http://localhost:8000`
2. Create a Cloudflare tunnel with a public URL
3. Auto-push the tunnel URL to GitHub Actions to rebuild the frontend
4. Keep everything running

**API Key:** `demo-key-123` (default)

---

## 🖥️ Manual Local Development

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Access the frontend at `http://localhost:3000` — it proxies `/api` requests to the backend.

---

## 📁 Project Structure

```
cyberguard-release/
├── backend/              # FastAPI + ML model
│   ├── main.py           # App entry point
│   ├── model/            # TF-IDF + Logistic Regression
│   │   ├── predict.py    # Inference logic
│   │   ├── preprocess.py # Text cleaning
│   │   └── saved_model/  # Trained model files
│   └── routers/         # API endpoints
│       ├── analyze.py    # Text analysis
│       ├── history.py    # Analysis history
│       └── stats.py      # Statistics
├── frontend/             # React + Vite + Tailwind
│   └── src/
│       ├── pages/        # Home, Dashboard, Bulk, API, Comment Feed
│       └── services/     # API client
└── .github/workflows/    # GitHub Pages deployment
```

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

**Base URL:** `https://retain-charlie-removable-nokia.trycloudflare.com` (or your Railway URL)

**Example:**

```bash
curl -X POST "https://<tunnel-url>/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text": "You are amazing!", "api_key": "demo-key-123"}'
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

**Built with ❤️ by [shubi](https://github.com/Shhubham-R)**

**Tech Stack:** FastAPI · React · Vite · Tailwind CSS · scikit-learn · Cloudflare Tunnel
