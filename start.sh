#!/bin/bash

echo "========================================"
echo "  CyberGuard - Starting Up..."
echo "========================================"
echo ""

echo "[1/4] Installing Python dependencies..."
pip install --user -r backend/requirements.txt

echo "[2/4] Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "[3/4] Starting Backend server..."
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

sleep 2

echo "[4/4] Starting Frontend server..."
cd frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  CyberGuard is running!"
echo "========================================"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
