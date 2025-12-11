@echo off
echo ============================================
echo Starting TensorFlow AI Service
echo ============================================
echo.

cd ai_models

echo Activating Python virtual environment...
call ..\.. venv\Scripts\activate.bat

echo.
echo Starting TensorFlow Flask server...
echo Python service will run on http://localhost:5001
echo.
echo Press Ctrl+C to stop the service
echo ============================================
echo.

python tensorflow_service.py

pause
