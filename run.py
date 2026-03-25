#!/usr/bin/env python3
"""
CyberGuard - One-Click Start Script
Automatically installs dependencies and starts both servers
"""

import os
import sys
import subprocess
import time

def run_command(cmd, description, shell=False):
    """Run a command and handle errors"""
    print(f"\n[+] {description}...")
    try:
        subprocess.run(cmd, shell=shell, check=True, cwd=os.path.dirname(os.path.abspath(__file__)))
        print(f"[✓] {description} complete")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[✗] Error: {e}")
        return False

def main():
    print("=" * 50)
    print("  CyberGuard - One-Click Start")
    print("=" * 50)
    
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Step 1: Install Python dependencies
    print("\n[1/4] Installing Python dependencies...")
    req_file = os.path.join(script_dir, "backend", "requirements.txt")
    if os.path.exists(req_file):
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "--user", "-r", req_file],
            check=False
        )
    else:
        print("[!] Requirements file not found, skipping...")
    
    # Step 2: Install Node dependencies
    print("\n[2/4] Installing Node.js dependencies...")
    frontend_dir = os.path.join(script_dir, "frontend")
    if os.path.exists(frontend_dir):
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=False)
    else:
        print("[!] Frontend directory not found")
    
    # Step 3: Start backend
    print("\n[3/4] Starting Backend server...")
    backend_dir = os.path.join(script_dir, "backend")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=backend_dir
    )
    time.sleep(2)
    
    # Step 4: Start frontend
    print("\n[4/4] Starting Frontend server...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev", "--", "--host", "0.0.0.0"],
        cwd=frontend_dir
    )
    
    print("\n" + "=" * 50)
    print("  CyberGuard is running!")
    print("=" * 50)
    print("\n🌐 Frontend: http://localhost:3000")
    print("🔧 Backend:  http://localhost:8000")
    print("📚 API Docs:  http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop")
    print("=" * 50)
    
    try:
        # Keep running
        backend_process.wait()
    except KeyboardInterrupt:
        print("\n\nStopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped.")

if __name__ == "__main__":
    main()
