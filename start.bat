@echo off
echo ========================================
echo   CyberGuard - Starting Up...
echo ========================================
echo.

echo [1/4] Installing Python dependencies...
pip install --user -r backend\requirements.txt
if errorlevel 1 (
    echo Error installing Python packages
    pause
    exit /b 1
)

echo [2/4] Installing Node.js dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Error installing Node packages
    pause
    exit /b 1
)
cd ..

echo [3/4] Starting Backend server...
start "CyberGuard Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [4/4] Starting Frontend server...
start "CyberGuard Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   CyberGuard is starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open in browser...
pause >nul

start http://localhost:3000
