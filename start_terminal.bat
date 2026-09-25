@echo off
TITLE IDX Quant Terminal Launcher

:: 1. Menyalakan Backend FastAPI (Aktifkan venv dulu)
cd /d "C:\IDX Big Investor Intelligence Scanner\backend"
call venv\Scripts\activate
start cmd /k "uvicorn main:app --reload"

:: 2. Menyalakan Frontend Next.js
cd /d "C:\IDX Big Investor Intelligence Scanner\frontend"
start cmd /k "npm run dev"

exit