#!/usr/bin/env pwsh
# Wild Guard 4.0 - Complete Service Startup Script

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          WILD GUARD 4.0 - COMPLETE STARTUP                   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$rootPath = "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

# Kill any existing processes on our ports
Write-Host "🧹 Cleaning up existing services..." -ForegroundColor Yellow
$ports = @(5000, 5001, 5002)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  Stopping process on port $port..." -ForegroundColor Gray
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
    }
}
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "🚀 Starting Wild Guard 4.0 Services..." -ForegroundColor Green
Write-Host ""

# Service 1: TensorFlow AI
Write-Host "1️⃣  Starting TensorFlow AI Service (Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\ai_models'; python tensorflow_service.py"
Start-Sleep -Seconds 8

# Service 2: YOLOv11
Write-Host "2️⃣  Starting YOLOv11 Poaching Detection (Port 5002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\Poaching_Detection'; python yolo_poaching_service.py"
Start-Sleep -Seconds 5

# Service 3: Node.js
Write-Host "3️⃣  Starting Node.js Backend + Frontend (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath'; npm run dev"
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check health
Write-Host ""
Write-Host "🏥 Checking Service Health..." -ForegroundColor Cyan
Write-Host ""

$allHealthy = $true

# TensorFlow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ TensorFlow AI (Port 5001): RUNNING" -ForegroundColor Green
}
catch {
    Write-Host "❌ TensorFlow AI (Port 5001): FAILED" -ForegroundColor Red
    $allHealthy = $false
}

# YOLOv11
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5002/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ YOLOv11 Poaching (Port 5002): RUNNING" -ForegroundColor Green
}
catch {
    Write-Host "❌ YOLOv11 Poaching (Port 5002): FAILED" -ForegroundColor Red
    $allHealthy = $false
}

# Node.js
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Node.js Backend (Port 5000): RUNNING" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js Backend (Port 5000): FAILED" -ForegroundColor Red
    $allHealthy = $false
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

if ($allHealthy) {
    Write-Host ""
    Write-Host "🎉 All services are running successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Application: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "🦁 Animal ID: http://localhost:5000/identify" -ForegroundColor Cyan
    Write-Host "🔫 Poaching Detection: http://localhost:5000/features/poaching-detection" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "⚠️  Some services failed to start." -ForegroundColor Red
    Write-Host "   Check the individual PowerShell windows for errors" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
