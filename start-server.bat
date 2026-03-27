@echo off
echo ==========================================
echo   CyberGuard Backend Server
echo ==========================================
echo.
echo Your IP: 192.168.68.107
echo Backend URL: http://192.168.68.107:8000
echo.
echo Make sure this is running when you want
echo to use the GitHub Pages site!
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.
cd /d %~dp0backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
