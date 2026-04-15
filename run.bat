@echo off
title CrowdWiseAI Template Generator
color 0B

:: Add Python to PATH if not found
where python >nul 2>&1
if %errorlevel% neq 0 (
    set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"
)

echo.
echo  ============================================
echo   CrowdWiseAI Template Generator
echo  ============================================
echo.
echo  Starting the app...
echo.

:: Check Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ✗ Python not found!
    echo    Please run install.bat first.
    echo.
    pause
    exit /b 1
)

:: Check dependencies are installed
python -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo  ✗ Dependencies not installed!
    echo    Please run install.bat first.
    echo.
    pause
    exit /b 1
)

echo  ✓ Opening browser in 3 seconds...
echo.
echo  ----------------------------------------
echo   App running at: http://localhost:5000
echo  ----------------------------------------
echo.
echo  Keep this window open while using the app.
echo  Press Ctrl+C to stop the server.
echo.

:: Open browser after a short delay
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5000"

:: Start the Flask server (blocks until Ctrl+C)
cd /d "%~dp0"
python app.py

echo.
echo  Server stopped.
pause
