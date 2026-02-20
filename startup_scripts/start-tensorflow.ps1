# Start TensorFlow AI Service
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Starting TensorFlow AI Service" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location ai_models

Write-Host "Activating Python virtual environment..." -ForegroundColor Yellow
$venvPath = ".\venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    & $venvPath
    Write-Host "Virtual environment activated successfully!" -ForegroundColor Green
} else {
    Write-Host "Virtual environment not found at: $venvPath" -ForegroundColor Red
    Write-Host "Using system Python instead..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting TensorFlow Flask server..." -ForegroundColor Yellow
Write-Host "Python service will run on http://localhost:5001" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the service" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Use waitress-serve for production-ready WSGI server
& ".\venv\Scripts\waitress-serve.exe" --host=127.0.0.1 --port=5001 tensorflow_service:app
