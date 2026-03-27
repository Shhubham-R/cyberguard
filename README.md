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

### Option 2: Semi-Automatic (Linux/Mac)

```bash
./start-server.sh
```

Starts the backend + Cloudflare tunnel, but does **not** push to GitHub. You manually update the `VITE_API_URL` in `.github/workflows/pages.yml` with the tunnel URL shown in the output.

---

### Option 3: Windows — Backend Only

```batch
# In Command Prompt or Double-click
start-server.bat
```

Starts the backend only at `http://localhost:8000`. Shows your local IP (e.g. `192.168.x.x:8000`) — others on your network can use it directly (no tunnel needed for local network access).

---

### Option 4: Windows — Full Stack

```batch
start.bat
```

Installs all dependencies and starts both servers in separate windows. Opens the frontend in your browser automatically.

---

### Option 5: Linux/Mac — Full Stack

```bash
./start.sh
```

Installs all dependencies and starts both servers (frontend + backend, no tunnel).

---

## 🌐 Deploying to Railway (Alternative to Tunnel)

For permanent hosting without relying on your local machine:

1. Create a [Railway](https://railway.app) account
2. Connect your GitHub repo
3. Set root directory to `backend`
4. Railway auto-detects the `Dockerfile`
5. Set environment variable: `PYTHON_VERSION = 3.10`
6. Deploy — your API will be at `https://<your-app>.railway.app`

Update `VITE_API_URL` in `.github/workflows/pages.yml` to your Railway URL.

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

**Built with ❤️ by [shubi](https://github.com/Shhubham-R)**

**Tech Stack:** FastAPI · React · Vite · Tailwind CSS · scikit-learn · Cloudflare Tunnel
