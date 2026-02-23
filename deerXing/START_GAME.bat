@echo off
cd /d "%~dp0"
title Deer Xing
echo.
echo  Deer Xing - Starting...
echo  Opening game in your browser.
echo  Keep this window open while you play.
echo.
start "" "http://localhost:8765/index.html"

python -m http.server 8765 2>nul
if errorlevel 1 (
  echo Python not found. Trying Node...
  npx -y serve -p 8765 -s 2>nul
  if errorlevel 1 (
    echo.
    echo  Could not start server. Install Python or Node.js, then run this again.
    echo  Or double-click index.html (game may have limited features from file).
    echo.
    pause
    exit /b 1
  )
)
pause
