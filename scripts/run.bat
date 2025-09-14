@echo off
echo Starting backend...
start cmd /k "cd backend && venv\Scripts\activate && python app.py"
echo Starting frontend preview...
start cmd /k "cd frontend && pnpm preview"
echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173