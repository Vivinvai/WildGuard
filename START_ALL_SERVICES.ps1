#!/usr/bin/env pwsh
# Wild Guard - Start All Services Script
# This script starts all required services for the application

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  WILD GUARD - Starting Services" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
$projectDir = "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
Set-Location $projectDir

# Stop any existing processes
Write-Host "[1/3] Stopping existing services..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Main Server (port 5000)
Write-Host "[2/3] Starting Main Server (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir' ; npm run dev"
Start-Sleep -Seconds 8

# Start Flask Injury Detection Service (port 5004)
Write-Host "[3/3] Starting Flask Injury Detection (port 5004)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir' ; & '.\.venv\Scripts\python.exe' injury-detection-service.py"
Start-Sleep -Seconds 5

# Verify services
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Verifying Services..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$port5000 = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
$port5004 = Test-NetConnection -ComputerName localhost -Port 5004 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($port5000) {
    Write-Host "✅ Main Server (port 5000): RUNNING" -ForegroundColor Green
} else {
    Write-Host "❌ Main Server (port 5000): FAILED" -ForegroundColor Red
}

if ($port5004) {
    Write-Host "✅ Flask Injury Detection (port 5004): RUNNING" -ForegroundColor Green
} else {
    Write-Host "❌ Flask Injury Detection (port 5004): FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Application Ready!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Open in browser: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Available Pages:" -ForegroundColor Yellow
Write-Host "   • Home: http://localhost:5000/home"
Write-Host "   • Identify Animal: http://localhost:5000/identify"
Write-Host "   • Health Assessment: http://localhost:5000/features/health-assessment"
Write-Host "   • Poaching Detection: http://localhost:5000/features/poaching-detection"
Write-Host "   • Admin Login: http://localhost:5000/admin/login"
Write-Host "   • Admin Dashboard: http://localhost:5000/admin/dashboard"
Write-Host "   • Animal Detections: http://localhost:5000/admin/animal-detections"
Write-Host ""
Write-Host "🔑 Identification uses: Gemini AI (Cloud)" -ForegroundColor Yellow
Write-Host "🏥 Health Assessment uses: YOLOv11 (Local)" -ForegroundColor Yellow
Write-Host "🚨 Poaching Detection uses: YOLO + Cloud AI" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to open browser..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:5000"
