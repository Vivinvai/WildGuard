# Start Animal Injury Detection Service (YOLOv11)
# Runs on port 5003 (separate from poaching detection)

Write-Host "🏥 Starting Animal Injury Detection Service..." -ForegroundColor Cyan

# Activate Python environment
$venvPath = ".\.venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    Write-Host "✅ Activating Python virtual environment..." -ForegroundColor Green
    & $venvPath
} else {
    Write-Host "⚠️ Virtual environment not found at $venvPath" -ForegroundColor Yellow
    Write-Host "   Using system Python..." -ForegroundColor Yellow
}

# Check if injury detection model exists
$modelPath = ".\Injured Animals\Animal Injury\yolo11n.pt"
if (Test-Path $modelPath) {
    Write-Host "✅ Injury detection model found: $modelPath" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: Injury detection model not found at $modelPath" -ForegroundColor Red
    Write-Host "   Please ensure the trained YOLOv11 model is in the correct location" -ForegroundColor Red
    exit 1
}

# Start the injury detection service
Write-Host "🚀 Launching Injury Detection Service on port 5004..." -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop the service" -ForegroundColor Yellow
Write-Host ""

python injury-detection-service.py
