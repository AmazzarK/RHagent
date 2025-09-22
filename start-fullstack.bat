@echo off
echo 🚀 Starting HR Agent Full-Stack Application...
echo.

echo 📡 Starting Python Backend Server...
cd "%~dp0"
start "HR Agent Backend" cmd /k "python frontend.py"

echo ⏳ Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo ⚛️ Starting React Frontend Development Server...
cd "%~dp0frontend"
start "HR Agent Frontend" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting up...
echo 📡 Backend: http://localhost:8000
echo ⚛️ Frontend: http://localhost:5173
echo.
echo 🛑 Press any key to stop all servers...
pause > nul

echo 🔴 Stopping all servers...
taskkill /f /im python.exe 2>nul
taskkill /f /im node.exe 2>nul
echo ✅ All servers stopped.
