#!/usr/bin/env powershell
<#
.SYNOPSIS
    WildGuard Complete Service Launcher
.DESCRIPTION
    Starts all WildGuard services in separate windows:
    - Port 5000: Main Application (Node.js/React)
    - Port 5001: TensorFlow Animal Identification
    - Port 5002: YOLO Poaching Detection
    - Port 5004: Gemini Injury Detection
#>

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🐾 WILDGUARD PLATFORM - COMPLETE SERVICE STARTUP" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Kill any existing services on these ports
Write-Host "🔄 Cleaning up existing services..." -ForegroundColor Yellow
$ports = @(5000, 5001, 5002, 5004)
foreach ($port in $ports) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Port not in use, continue
    }
}

Start-Sleep -Seconds 2
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Service 1: TensorFlow Animal Identification (Port 5001)
Write-Host "🚀 Starting TensorFlow Animal Identification Service..." -ForegroundColor Cyan
$tfScript = @"
cd '$scriptDir\ai_models'
Write-Host ''
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host '   🦁 TENSORFLOW ANIMAL IDENTIFICATION SERVICE' -ForegroundColor Green
Write-Host '   Port: 5001' -ForegroundColor White
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host ''
python tensorflow_service.py
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $tfScript
Write-Host "   ✅ TensorFlow service window opened (Port 5001)" -ForegroundColor Green
Start-Sleep -Seconds 3

# Service 2: YOLO Poaching Detection (Port 5002)
Write-Host "🚀 Starting YOLO Poaching Detection Service..." -ForegroundColor Cyan
$poachingScript = @"
cd '$scriptDir\Poaching_Detection'
Write-Host ''
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host '   🔫 YOLO POACHING DETECTION SERVICE' -ForegroundColor Red
Write-Host '   Port: 5002' -ForegroundColor White
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host ''
python yolo_poaching_service.py
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $poachingScript
Write-Host "   ✅ Poaching detection window opened (Port 5002)" -ForegroundColor Green
Start-Sleep -Seconds 3

# Service 3: Gemini Injury Detection (Port 5004)
Write-Host "🚀 Starting Gemini Injury Detection Service..." -ForegroundColor Cyan
$injuryScript = @"
cd '$scriptDir'
Write-Host ''
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host '   🩹 GEMINI INJURY DETECTION SERVICE' -ForegroundColor Magenta
Write-Host '   Port: 5004' -ForegroundColor White
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host ''
python injury-detection-service.py
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $injuryScript
Write-Host "   ✅ Injury detection window opened (Port 5004)" -ForegroundColor Green
Start-Sleep -Seconds 3

# Service 4: Main Application (Port 5000)
Write-Host "🚀 Starting Main Application..." -ForegroundColor Cyan
$mainAppScript = @"
cd '$scriptDir'
Write-Host ''
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host '   🌍 WILDGUARD MAIN APPLICATION' -ForegroundColor Yellow
Write-Host '   Port: 5000' -ForegroundColor White
Write-Host '════════════════════════════════════════════════════════' -ForegroundColor Cyan
Write-Host ''
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $mainAppScript
Write-Host "   ✅ Main application window opened (Port 5000)" -ForegroundColor Green

Write-Host ""
Write-Host "⏳ Waiting for all services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✅ ALL SERVICES STARTED!" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Service status check
Write-Host "🔍 Checking service status..." -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{Port=5001; Name="TensorFlow Animal ID"; Endpoint="/"},
    @{Port=5002; Name="Poaching Detection"; Endpoint="/health"},
    @{Port=5004; Name="Injury Detection"; Endpoint="/health"},
    @{Port=5000; Name="Main Application"; Endpoint="/"}
)

foreach ($svc in $services) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($svc.Port)$($svc.Endpoint)" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        Write-Host "   ✅ $($svc.Name) (Port $($svc.Port)): ONLINE" -ForegroundColor Green
    } catch {
        Write-Host "   ⏳ $($svc.Name) (Port $($svc.Port)): Starting..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🌐 ACCESS POINTS" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Main App:          http://localhost:5000" -ForegroundColor White
Write-Host "   Animal ID:         http://localhost:5001" -ForegroundColor White
Write-Host "   Poaching Detect:   http://localhost:5002" -ForegroundColor White
Write-Host "   Injury Detect:     http://localhost:5004" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🎯 FEATURES TO TEST" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Animal Identification:" -ForegroundColor Cyan
Write-Host "      http://localhost:5000/features/animal-identification" -ForegroundColor White
Write-Host ""
Write-Host "   2. Health Assessment (Injury Detection):" -ForegroundColor Cyan
Write-Host "      http://localhost:5000/features/health-assessment" -ForegroundColor White
Write-Host ""
Write-Host "   3. Poaching Detection:" -ForegroundColor Cyan
Write-Host "      http://localhost:5000/features/poaching-detection" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✨ ALL SYSTEMS READY!" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "💡 TIP: Keep this window open to monitor the startup process" -ForegroundColor Gray
Write-Host "💡 TIP: Each service runs in its own window - check for errors there" -ForegroundColor Gray
Write-Host ""

# Keep this window open
Read-Host "Press Enter to exit this startup monitor (services will keep running)"
