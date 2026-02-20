#!/usr/bin/env pwsh
# ═══════════════════════════════════════════════════════════════
#  🛡️ WILD GUARD - Complete Service Startup
# ═══════════════════════════════════════════════════════════════
#  Starts all services:
#  • Backend + Frontend (Port 5001)
#  • YOLO Poaching Detection (Port 5003)
#  • TensorFlow Animal ID (Port 5004)
#  • Health Assessment Service (Port 5005)
# ═══════════════════════════════════════════════════════════════

Write-Host "
═══════════════════════════════════════════════════════════════
    🛡️ WILD GUARD - Starting All Services
═══════════════════════════════════════════════════════════════
" -ForegroundColor Cyan

# Get current directory (go up one level since we're in startup_scripts)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
Set-Location $projectDir

# Stop any existing processes
Write-Host "🧹 Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Start TensorFlow Animal Identification (Port 5004)
Write-Host "`n[1/4] 🤖 Starting TensorFlow AI (Port 5004)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir\ai_models'; python tensorflow_service_simple.py"
Start-Sleep -Seconds 8

# Start YOLO Poaching Detection (Port 5003)
Write-Host "[2/4] 🔍 Starting YOLO Poaching Detection (Port 5003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir\Poaching_Detection'; python yolo_poaching_service.py"
Start-Sleep -Seconds 6

# Start Health Assessment Service (Port 5005)
Write-Host "[3/4] 🏥 Starting Health Assessment Service (Port 5005)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; python injury-detection-service.py"
Start-Sleep -Seconds 6

# Start Backend + Frontend (Port 5001)
Write-Host "[4/4] 🌐 Starting Backend + Frontend (Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectDir'; npm run dev"
Start-Sleep -Seconds 10

# Verify all services
Write-Host "`n
═══════════════════════════════════════════════════════════════
    ✅ Verifying Services
═══════════════════════════════════════════════════════════════
" -ForegroundColor Cyan

$services = @{
    5001 = 'Backend + Frontend'
    5003 = 'YOLO Poaching Detection'
    5004 = 'TensorFlow Animal ID'
    5005 = 'Health Assessment'
}

$allOnline = $true

$services.GetEnumerator() | Sort-Object Key | ForEach-Object {
    $port = $_.Key
    $name = $_.Value
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -Method Get -TimeoutSec 3 -ErrorAction Stop
        Write-Host "   ✅ Port $port - ${name}: " -NoNewline -ForegroundColor Green
        Write-Host "ONLINE" -ForegroundColor White -BackgroundColor DarkGreen
    } catch {
        Write-Host "   ❌ Port $port - ${name}: " -NoNewline -ForegroundColor Red
        Write-Host "OFFLINE" -ForegroundColor White -BackgroundColor DarkRed
        $allOnline = $false
    }
}

Write-Host "`n
═══════════════════════════════════════════════════════════════
" -ForegroundColor Cyan

if ($allOnline) {
    Write-Host "
    🎉 ALL SYSTEMS OPERATIONAL! 🎉
    
    📱 Open your browser: http://localhost:5001
    
    ✨ Available Features:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    🦁 Animal Identification - 90+ Indian Species
    🚨 Poaching Detection - YOLO AI Threat Analysis  
    🏥 Health Assessment - Injury Detection with Gemini AI
    👨‍💼 Admin Dashboard - Alert Management & Monitoring
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
" -ForegroundColor Green
} else {
    Write-Host "
    ⚠️ SOME SERVICES FAILED TO START
    
    Please check the error messages above.
    Services will continue running in separate windows.
    
" -ForegroundColor Yellow
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
