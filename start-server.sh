#!/bin/bash
# CyberGuard Backend + Cloudflare Tunnel Starter
# Run this to start both the backend server AND the cloudflare tunnel

cd "$(dirname "$0")"

echo "=========================================="
echo "  CyberGuard - Starting Up..."
echo "=========================================="
echo ""

# Kill any existing processes on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null
sleep 1

echo "[1/3] Starting Backend server..."
cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

sleep 3

echo "[2/3] Starting Cloudflare Tunnel..."
echo "    (This creates a public HTTPS URL for your backend)"
echo ""
cloudflared tunnel --url http://localhost:8000 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to be ready
echo "    Waiting for tunnel URL..."
sleep 8

# Extract tunnel URL from cloudflared output
TUNNEL_URL=$(ps aux | grep cloudflared | grep -v grep | grep -o 'https://[^ ]*trycloudflare.com' | head -1)
if [ -z "$TUNNEL_URL" ]; then
    echo "    Could not detect tunnel URL. Check cloudflared output above."
else
    echo "    Tunnel URL: $TUNNEL_URL"
fi

echo ""
echo "[3/3] Done!"
echo ""
echo "=========================================="
echo "  CyberGuard is running!"
echo "=========================================="
echo ""
echo "Backend: http://localhost:8000"
if [ ! -z "$TUNNEL_URL" ]; then
    echo "Tunnel:  $TUNNEL_URL"
    echo ""
    echo "NOTE: Update GitHub Actions workflow (VITE_API_URL) with the tunnel URL"
    echo "      when it changes (tunnel URL is different each time you restart)."
fi
echo ""
echo "Press Ctrl+C to stop everything"
echo "=========================================="

# Wait for interrupt
trap "kill $BACKEND_PID $TUNNEL_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
