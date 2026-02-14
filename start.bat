@echo off
title MERN Portfolio - Starting Servers

echo Checking dependencies...

cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)

cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

cd ..

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
