@echo off
echo HR Agent - Quick Start
echo ========================
echo.

echo Running integration test first...
python test_integration_fixed.py
echo.

if %ERRORLEVEL% EQU 0 (
    echo Backend tests passed! Starting servers...
    echo.
    
    echo Starting Python Backend Server...
    start "HR Agent Backend" cmd /k "cd /D %~dp0 && python frontend.py"
    
    echo Waiting 3 seconds for backend to start...
    timeout /t 3 /nobreak > nul
    
    echo Starting React Frontend Development Server...
    start "HR Agent Frontend" cmd /k "cd /D %~dp0frontend && npm run dev"
    
    echo.
    echo Both servers are starting up!
    echo Backend API: http://localhost:8000
    echo Frontend App: http://localhost:5173
    echo.
    echo You can also test the API with:
    echo    python test_api_fixed.py
    echo.
    echo Press any key to close this window...
    pause > nul
) else (
    echo Backend tests failed! Please check the errors above.
    echo.
    echo Press any key to close this window...
    pause > nul
)
