# Wild Guard - Start All Services
# Starts Backend, TensorFlow AI, YOLO Poaching, and Health Assessment

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "    WILD GUARD - Starting All Services" -ForegroundColor Green  
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$scriptDir = $PSScriptRoot
if (-not $scriptDir) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
Set-Location $scriptDir

# Stop existing processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
try {
    Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "   Done" -ForegroundColor Green
} catch {
    Write-Host "   No old processes to clean" -ForegroundColor Gray
}

Write-Host ""

# Start TensorFlow AI (Port 5004)
Write-Host "[1/4] Starting TensorFlow AI (Port 5004)..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\ai_models'; python tensorflow_service_simple.py"
    Start-Sleep -Seconds 8
    Write-Host "   Started" -ForegroundColor Green
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Start YOLO Poaching (Port 5003)
Write-Host "[2/4] Starting YOLO Poaching Detection (Port 5003)..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\Poaching_Detection'; python yolo_poaching_service.py"
    Start-Sleep -Seconds 8
    Write-Host "   Started" -ForegroundColor Green
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Start Health Assessment (Port 5005)
Write-Host "[3/4] Starting Health Assessment (Port 5005)..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir'; python injury-detection-service.py"
    Start-Sleep -Seconds 8
    Write-Host "   Started" -ForegroundColor Green
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Start Backend + Frontend (Port 5001)
Write-Host "[4/4] Starting Backend + Frontend (Port 5001)..." -ForegroundColor Cyan
try {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir'; npm run dev"
    Start-Sleep -Seconds 15
    Write-Host "   Started" -ForegroundColor Green
} catch {
    Write-Host "   Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "    Verifying Services" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check each service
$allOnline = $true

Write-Host "Port 5001 - Backend + Frontend: " -NoNewline
try {
    Invoke-WebRequest -Uri "http://localhost:5001/health" -TimeoutSec 3 -ErrorAction Stop | Out-Null
    Write-Host "ONLINE" -ForegroundColor Green
} catch {
    Write-Host "OFFLINE" -ForegroundColor Red
    $allOnline = $false
}

Write-Host "Port 5003 - YOLO Poaching: " -NoNewline
try {
    Invoke-WebRequest -Uri "http://localhost:5003/health" -TimeoutSec 3 -ErrorAction Stop | Out-Null
    Write-Host "ONLINE" -ForegroundColor Green
} catch {
    Write-Host "OFFLINE" -ForegroundColor Red
    $allOnline = $false
}

Write-Host "Port 5004 - TensorFlow AI: " -NoNewline
try {
    Invoke-WebRequest -Uri "http://localhost:5004/health" -TimeoutSec 3 -ErrorAction Stop | Out-Null
    Write-Host "ONLINE" -ForegroundColor Green
} catch {
    Write-Host "OFFLINE" -ForegroundColor Red
    $allOnline = $false
}

Write-Host "Port 5005 - Health Assessment: " -NoNewline
try {
    Invoke-WebRequest -Uri "http://localhost:5005/health" -TimeoutSec 3 -ErrorAction Stop | Out-Null
    Write-Host "ONLINE" -ForegroundColor Green
} catch {
    Write-Host "OFFLINE" -ForegroundColor Red
    $allOnline = $false
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan

if ($allOnline) {
    Write-Host ""
    Write-Host "   ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Open: http://localhost:5001" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Features Available:" -ForegroundColor Yellow
    Write-Host "   - Animal Identification (90+ species)" -ForegroundColor White
    Write-Host "   - Poaching Detection (YOLO AI)" -ForegroundColor White
    Write-Host "   - Health Assessment (Gemini AI)" -ForegroundColor White
    Write-Host "   - Admin Dashboard & Alerts" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "   Some services failed to start" -ForegroundColor Yellow
    Write-Host "   Check the windows opened for error messages" -ForegroundColor Yellow
    Write-Host ""
}
