@echo off
title CrowdWiseAI Template Generator - Setup
color 0B
echo.
echo  ============================================
echo   CrowdWiseAI Template Generator - Setup
echo  ============================================
echo.
echo  This will install everything you need to run
echo  the template generator on your PC.
echo.
echo  Press any key to start...
pause >nul

echo.
echo  [1/4] Checking for Python...
echo.

where python >nul 2>&1
if %errorlevel% equ 0 (
    python --version 2>nul | findstr /R "3\.\(1[0-2]\|[89]\)" >nul
    if %errorlevel% equ 0 (
        echo  ✓ Python already installed
        python --version
        goto :install_deps
    )
)

echo  Python not found. Installing Python 3.12...
echo.
winget install Python.Python.3.12 --source winget --accept-package-agreements --accept-source-agreements
if %errorlevel% neq 0 (
    echo.
    echo  ✗ Failed to install Python automatically.
    echo.
    echo  Please install Python manually:
    echo    1. Go to https://www.python.org/downloads/
    echo    2. Download Python 3.12
    echo    3. IMPORTANT: Check "Add Python to PATH" during install
    echo    4. Run this script again after installing
    echo.
    pause
    exit /b 1
)

echo.
echo  ✓ Python installed. You may need to restart this script
echo    if the next steps fail (PATH needs to refresh).
echo.

:: Refresh PATH for the current session
set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Python312\Scripts;%PATH%"

:install_deps
echo.
echo  [2/4] Installing Python packages...
echo.

python -m pip install --upgrade pip >nul 2>&1
python -m pip install -r "%~dp0requirements.txt"
if %errorlevel% neq 0 (
    echo.
    echo  ✗ Failed to install packages.
    echo    Try closing and reopening this script.
    pause
    exit /b 1
)

echo.
echo  ✓ All Python packages installed
echo.

echo  [3/4] Installing browser for image export...
echo         (this may take a minute)
echo.

python -m playwright install chromium
if %errorlevel% neq 0 (
    echo.
    echo  ✗ Failed to install browser.
    echo    Try running this script as Administrator.
    pause
    exit /b 1
)

echo.
echo  ✓ Browser installed
echo.

echo  [4/4] Verifying installation...
echo.

python -c "import flask; import jinja2; import playwright; print('  All packages OK')"
if %errorlevel% neq 0 (
    echo  ✗ Verification failed.
    pause
    exit /b 1
)

echo.
echo  ============================================
echo   ✓ Setup complete!
echo  ============================================
echo.
echo  To start the app, double-click:
echo    run.bat
echo.
echo  Press any key to exit...
pause >nul
