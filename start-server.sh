#!/bin/bash
# CyberGuard Backend Server Starter
# Run this on your laptop to start the API server

cd "$(dirname "$0")"

echo "=========================================="
echo "  CyberGuard Backend Server"
echo "=========================================="
echo ""
echo "Your IP: 192.168.68.107"
echo "Backend URL: http://192.168.68.107:8000"
echo ""
echo "Make sure this command is running when"
echo "you want to use the GitHub Pages site!"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000
