@echo off
echo Installing backend dependencies...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt
cd ..
echo Building frontend...
cd frontend
call pnpm install
call pnpm build
cd ..
echo Build complete.